import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

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
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileName = `${Date.now()}-${profileImage.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(filePath, buffer);
    }

    await db.run(
      `INSERT INTO feedback (name, feedback, stars, profileImage, imageSize) VALUES (?, ?, ?, ?, ?)`,
      [name, feedback, stars, fileName, imageSize]
    );

    return NextResponse.json({ message: 'Feedback submitted!' }, { status: 200 });
  } catch (err) {
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
    return NextResponse.json(feedbackList, { status: 200 });
  } catch (err) {
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
      const bytes = Buffer.from(profileImage);
      fileName = `${Date.now()}-updated-${profileImage.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(filePath, bytes);
    }

    await db.run(
      `UPDATE feedback SET name = ?, feedback = ?, stars = ?, profileImage = ?, imageSize = ? WHERE id = ?`,
      [name, feedback, stars, fileName, imageSize, id]
    );

    return NextResponse.json({ message: 'Feedback updated!' }, { status: 200 });
  } catch (err) {
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

    // Delete the feedback from the database
    await db.run('DELETE FROM feedback WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Feedback deleted!' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting feedback' }, { status: 500 });
  } finally {
    await db.close();
  }
}
