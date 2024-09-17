import { NextRequest, NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { Readable } from 'stream';
import minioClient from '@/lib/minio';


const dbPath = path.join(process.cwd(), 'projects.db');
const bucketName = 'portfolio'; // Use your MinIO bucket name

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      image TEXT,
      github TEXT,
      live TEXT
    )
  `);
  await db.close();
}

// Initialize the database
initDb();

// Ensure the MinIO bucket exists
(async () => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
  }
})();

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return false;
  }

  const [, credentials] = authHeader.split(' ');
  const [username, password] = atob(credentials).split(':');

  // In a real app, you'd store hashed passwords in the database
  return username === 'admin' && password === 'password';
}

export async function GET() {
  const db = await openDb();
  const projects = await db.all('SELECT * FROM projects');
  
  // Generate presigned URLs for each image
  const projectsWithUrls = await Promise.all(projects.map(async (project) => {
    if (project.image) {
      const url = await minioClient.presignedGetObject(bucketName, project.image, 24 * 60 * 60); // 24 hours expiry
      return { ...project, imageUrl: url };
    }
    return project;
  }));

  await db.close();
  return NextResponse.json(projectsWithUrls);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const github = formData.get('github') as string;
  const live = formData.get('live') as string;
  const imageFile = formData.get('image') as File;

  if (!imageFile) {
    return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
  }

  const buffer = await imageFile.arrayBuffer();
  const filename = Date.now() + '-' + imageFile.name.replace(/\s/g, '-');
  const stream = Readable.from(Buffer.from(buffer));

  await minioClient.putObject(bucketName, filename, stream);

  const db = await openDb();
  const result = await db.run(
    'INSERT INTO projects (title, description, image, github, live) VALUES (?, ?, ?, ?, ?)',
    [title, description, filename, github, live]
  );
  await db.close();

  const imageUrl = await minioClient.presignedGetObject(bucketName, filename, 24 * 60 * 60);

  return NextResponse.json({
    id: result.lastID,
    title,
    description,
    image: filename,
    imageUrl,
    github,
    live,
  }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const github = formData.get('github') as string;
  const live = formData.get('live') as string;
  const imageFile = formData.get('image') as File | null;

  const db = await openDb();
  let filename;

  if (imageFile) {
    const buffer = await imageFile.arrayBuffer();
    filename = Date.now() + '-' + imageFile.name.replace(/\s/g, '-');
    const stream = Readable.from(Buffer.from(buffer));

    await minioClient.putObject(bucketName, filename, stream);

    // Delete old image
    const oldProject = await db.get('SELECT image FROM projects WHERE id = ?', id);
    if (oldProject && oldProject.image) {
      await minioClient.removeObject(bucketName, oldProject.image).catch(console.error);
    }
  }

  const result = await db.run(
    'UPDATE projects SET title = ?, description = ?, github = ?, live = ?' + (filename ? ', image = ?' : '') + ' WHERE id = ?',
    [title, description, github, live, ...(filename ? [filename] : []), id]
  );

  const updatedProject = await db.get('SELECT * FROM projects WHERE id = ?', id);
  await db.close();

  if (result?.changes && result.changes > 0) {
    if (updatedProject.image) {
      updatedProject.imageUrl = await minioClient.presignedGetObject(bucketName, updatedProject.image, 24 * 60 * 60);
    }
    return NextResponse.json(updatedProject);
  } else {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const db = await openDb();
  
  // Get the project to delete its image
  const project = await db.get('SELECT * FROM projects WHERE id = ?', id);
  
  if (project && project.image) {
    await minioClient.removeObject(bucketName, project.image).catch(console.error);
  }

  const result = await db.run('DELETE FROM projects WHERE id = ?', id);
  await db.close();

  if (result?.changes && result.changes > 0) {
    return NextResponse.json({ message: 'Project deleted successfully' });
  } else {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
}