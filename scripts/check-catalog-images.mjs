import {readFile,access} from 'node:fs/promises';
import {products} from '../src/catalogData.js';
import {additionalProducts} from '../src/additionalProducts.js';
const main=await readFile(new URL('../src/main.jsx',import.meta.url),'utf8');
const galleries=Function('return '+main.match(/const galleryImages=(\{[\s\S]*?\n\});/)[1])();
const paths=new Set([...products,...additionalProducts].flatMap(p=>galleries[p.name]||[p.image]).map(p=>p.split('/').pop().replace(/\.[^.]+$/,'.jpg')));
for(const file of paths){
 for(const directory of ['catalog-normalized','catalog-zoom']){
  await access(new URL(`../public/${directory}/${file}`,import.meta.url));
 }
}
console.log(`Verified ${paths.size} active photos for ${products.length+additionalProducts.length} products, including zoom versions.`);
