import { NextRequest, NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'projects.db');

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
      imageUrl TEXT,
      github TEXT,
      live TEXT
    )
  `);
  await db.close();
}

// Initialize the database
initDb();

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
  await db.close();
  return NextResponse.json(projects);
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
  const imageUrl = formData.get('imageUrl') as string;

  const db = await openDb();
  const result = await db.run(
    'INSERT INTO projects (title, description, imageUrl, github, live) VALUES (?, ?, ?, ?, ?)',
    [title, description, imageUrl, github, live]
  );
  await db.close();

  return NextResponse.json({
    id: result.lastID,
    title,
    description,
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
  const imageUrl = formData.get('imageUrl') as string;

  const db = await openDb();
  const result = await db.run(
    'UPDATE projects SET title = ?, description = ?, github = ?, live = ?, imageUrl = ? WHERE id = ?',
    [title, description, github, live, imageUrl, id]
  );

  const updatedProject = await db.get('SELECT * FROM projects WHERE id = ?', id);
  await db.close();

  if (result?.changes && result.changes > 0) {
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
  const result = await db.run('DELETE FROM projects WHERE id = ?', id);
  await db.close();

  if (result?.changes && result.changes > 0) {
    return NextResponse.json({ message: 'Project deleted successfully' });
  } else {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
}