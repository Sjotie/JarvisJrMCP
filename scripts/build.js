import { cp } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function build() {
  try {
    const srcDir = join(__dirname, '..', 'src');
    const buildDir = join(__dirname, '..', 'build');
    
    await cp(srcDir, buildDir, { 
      recursive: true,
      force: true 
    });
    
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
