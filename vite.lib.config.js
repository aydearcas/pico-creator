// Library build (revsis-app ADR 0036): lib/editor.js, lib/exports.js and lib/pico-editor.css.
// Dependencies and peer dependencies stay external: npm installs them with the package.
import {defineConfig} from 'vite';
import pkg from './package.json' with {type:'json'};
const external=[...Object.keys(pkg.dependencies||{}),...Object.keys(pkg.peerDependencies||{})];
export default defineConfig({build:{outDir:'lib',emptyOutDir:true,target:'es2022',minify:false,cssCodeSplit:false,copyPublicDir:false,lib:{entry:{editor:'src/lib/editor.js',exports:'src/lib/exports.js'},formats:['es'],cssFileName:'pico-editor'},rollupOptions:{external:id=>external.some(d=>id===d||id.startsWith(d+'/')),output:{chunkFileNames:'chunks/[name].js'}}}});
