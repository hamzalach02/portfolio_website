import { NextRequest, NextResponse } from 'next/server';
import * as Minio from 'minio';
import { Readable } from 'stream';
import minioClient from '@/lib/minio';



// Ensure the bucket exists
const bucketName = 'portfolio'; // Changed to match your description
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

export async function POST(req: NextRequest) {
    if (!req.body) {
        return NextResponse.json({ error: 'No body in request' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer));

    try {
        await minioClient.putObject(bucketName, file.name, stream, file.size);
        return NextResponse.json({ message: 'File uploaded successfully', fileName: file.name }, { status: 200 });
    } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    }
}