import minioClient from '@/lib/minio';
import { NextRequest, NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { Readable } from 'stream';

const bucketName = 'portfolio'; // Use your MinIO bucket name

const openDb = async () => {
  return open({
    filename: './feedback.db',
    driver: sqlite3.Database,
  });
};

const initDb = async () => {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      feedback TEXT,
      stars INTEGER,
      profileImage TEXT,
      imageSize INTEGER
    );
  `);
};

// POST - Create new feedback
export async function POST(req: NextRequest) {
  await initDb();
  const db = await openDb();

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const feedback = formData.get('feedback') as string;
    const stars = parseInt(formData.get('stars') as string);
    const imageSize = parseInt(formData.get('imageSize') as string);
    const profileImage = formData.get('profileImage') as File | null;

    let fileName = null;
    if (profileImage) {
      const buffer = Buffer.from(await profileImage.arrayBuffer());
      fileName = `${Date.now()}-${profileImage.name}`;
      const stream = Readable.from(buffer);

      await minioClient.putObject(bucketName, fileName, stream, buffer.length);
    }

    await db.run(
      `INSERT INTO feedback (name, feedback, stars, profileImage, imageSize) VALUES (?, ?, ?, ?, ?)`,
      [name, feedback, stars, fileName, imageSize]
    );

    return NextResponse.json({ message: 'Feedback submitted!' }, { status: 200 });
  } catch (err) {
    console.error('Error handling request:', err);
    return NextResponse.json({ message: 'Error handling request' }, { status: 500 });
  } finally {
    await db.close();
  }
}

// GET - Retrieve all feedback
export async function GET() {
  await initDb();
  const db = await openDb();

  try {
    const feedbackList = await db.all('SELECT * FROM feedback ORDER BY id DESC');
    
    // Generate presigned URLs for each image
    const feedbackWithUrls = await Promise.all(feedbackList.map(async (feedback) => {
      if (feedback.profileImage) {
        const url = await minioClient.presignedGetObject(bucketName, feedback.profileImage, 24 * 60 * 60); // 24 hours expiry
        return { ...feedback, imageUrl: url };
      }
      return feedback;
    }));

    return NextResponse.json(feedbackWithUrls, { status: 200 });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    return NextResponse.json({ message: 'Error fetching feedback' }, { status: 500 });
  } finally {
    await db.close();
  }
}

// PUT - Update feedback
export async function PUT(req: NextRequest) {
  await initDb();
  const db = await openDb();

  try {
    const { id, name, feedback, stars, imageSize, profileImage } = await req.json();
    let fileName = null;

    if (profileImage) {
      const buffer = Buffer.from(profileImage, 'base64');
      fileName = `${Date.now()}-updated-${id}`;
      const stream = Readable.from(buffer);

      await minioClient.putObject(bucketName, fileName, stream, buffer.length);
    }

    await db.run(
      `UPDATE feedback SET name = ?, feedback = ?, stars = ?, profileImage = ?, imageSize = ? WHERE id = ?`,
      [name, feedback, stars, fileName, imageSize, id]
    );

    return NextResponse.json({ message: 'Feedback updated!' }, { status: 200 });
  } catch (err) {
    console.error('Error updating feedback:', err);
    return NextResponse.json({ message: 'Error updating feedback' }, { status: 500 });
  } finally {
    await db.close();
  }
}

// DELETE - Delete feedback
export async function DELETE(req: NextRequest) {
  await initDb();
  const db = await openDb();

  try {
    const { id } = await req.json();

    // Get the filename of the image to delete
    const feedback = await db.get('SELECT profileImage FROM feedback WHERE id = ?', [id]);

    // Delete the feedback from the database
    await db.run('DELETE FROM feedback WHERE id = ?', [id]);

    // Delete the image from MinIO if it exists
    if (feedback && feedback.profileImage) {
      await minioClient.removeObject(bucketName, feedback.profileImage);
    }

    return NextResponse.json({ message: 'Feedback deleted!' }, { status: 200 });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    return NextResponse.json({ message: 'Error deleting feedback' }, { status: 500 });
  } finally {
    await db.close();
  }
}