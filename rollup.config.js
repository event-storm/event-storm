import path from 'path';
import copy from 'rollup-plugin-copy';
import alias from 'rollup-plugin-alias';
import gzipPlugin from 'rollup-plugin-gzip';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';

const config = {
  input: './src/index.js',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
      entryFileNames: 'index.js',
    },
  ],
  plugins: [
    alias({
      entries: [
        { find: 'api', replacement: path.resolve('src/api') },
        { find: 'utils', replacement: path.resolve('src/utils') },
        { find: 'pubsub', replacement: path.resolve('src/pubsub') },
      ],
    }),
    resolve(),
    terser({
      toplevel: true,
      compress: {
        passes: 5,
        unsafe: true,
        pure_getters: true
      },
    }),
    gzipPlugin(),
    copy({
      targets: [
        { src: './package.json', dest: './dist' },
        { src: './LICENSE', dest: './dist' },
        { src: './README.md', dest: './dist' },
        { src: './types', dest: './dist' },
      ],
    }),
  ],
};

export default config;
