import type { Plugin } from 'vite';
import type { Dirent } from 'fs';
import { promises as fs } from 'fs';
import path from 'path';

interface Breakpoint {
  name: string;
  width: number;
}

const BREAKPOINTS: Breakpoint[] = [
  { name: 'mobile', width: 480 },
  { name: 'tablet', width: 768 },
  { name: 'desktop', width: 1200 },
];

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.tiff',
  '.avif',
]);

export function optimizeImages(): Plugin {
  let root = process.cwd();

  return {
    name: 'optimize-images',
    apply: 'build',
    configResolved(config) {
      root = config.root;
    },
    async buildStart() {
      const imagesDir = path.resolve(root, 'public/images');
      const outputDir = path.resolve(imagesDir, 'resized');

      let entries: Dirent[];
      try {
        entries = await fs.readdir(imagesDir, { withFileTypes: true });
      } catch {
        console.log('[optimize-images] No public/images directory found, skipping.');
        return;
      }

      const imageFiles = entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()));

      if (imageFiles.length === 0) {
        console.log('[optimize-images] No images to process, skipping.');
        return;
      }

      // Load sharp only when there is real work, so tests/dev never pay the cost
      const sharp = (await import('sharp')).default;
      await fs.mkdir(outputDir, { recursive: true });

      for (const file of imageFiles) {
        const inputPath = path.join(imagesDir, file);
        const { name } = path.parse(file);

        for (const breakpoint of BREAKPOINTS) {
          const outputPath = path.join(
            outputDir,
            `${name}-${breakpoint.name}-${breakpoint.width}w.webp`,
          );

          try {
            await sharp(inputPath)
              .resize({ width: breakpoint.width, withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(outputPath);
          } catch (error) {
            console.warn(`[optimize-images] Failed to process ${file}:`, error);
          }
        }
      }

      console.log(
        `[optimize-images] Generated ${imageFiles.length * BREAKPOINTS.length} optimized image(s) in public/images/resized/.`,
      );
    },
  };
}
