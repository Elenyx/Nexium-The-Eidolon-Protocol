import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log(`No .env file found at ${envPath}, using defaults`);
}

// Set default values for required environment variables
if (!process.env.PORT) {
  process.env.PORT = '5000';
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}
