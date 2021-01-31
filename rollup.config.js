import copy from 'rollup-plugin-copy';
import gzipPlugin from 'rollup-plugin-gzip';
import uglify from 'rollup-plugin-uglify-es';
import minify from 'rollup-plugin-babel-minify';
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
    resolve(),
    uglify(),
    minify({
      comments: false,
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
