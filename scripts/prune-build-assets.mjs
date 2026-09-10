import { readdir, rm } from 'node:fs/promises';
const dist = new URL('../dist/', import.meta.url);
const normalized = new URL('../dist/catalog-normalized/', import.meta.url);

await rm(new URL('catalog-original/', dist), { recursive: true, force: true });

for (const file of await readdir(normalized)) {
  if (!file.toLowerCase().endsWith('.jpg')) {
    await rm(new URL(file, normalized), { recursive: true, force: true });
  }
}
