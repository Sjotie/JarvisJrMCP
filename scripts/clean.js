import { rm } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function clean() {
  try {
    const buildDir = join(__dirname, '..', 'build');
    await rm(buildDir, { 
      recursive: true, 
      force: true 
    });
    console.log('Clean completed successfully');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Clean failed:', error);
      process.exit(1);
    }
  }
}

clean();
