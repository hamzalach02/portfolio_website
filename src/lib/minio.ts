import * as Minio from 'minio';

// Ensure all environment variables are defined
const {
    MINIO_ENDPOINT,
    MINIO_PORT,
    MINIO_USE_SSL,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
  } = process.env;
  
  if (!MINIO_ENDPOINT || !MINIO_PORT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY) {
    throw new Error('Missing required environment variables');
  }

// Set up MinIO client
const minioClient = new Minio.Client({
    endPoint: MINIO_ENDPOINT,
    port: parseInt(MINIO_PORT, 10),
    useSSL: MINIO_USE_SSL === 'true', // Convert string to boolean
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
});

export default minioClient;