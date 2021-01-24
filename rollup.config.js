import copy from 'rollup-plugin-copy';
import gzipPlugin from 'rollup-plugin-gzip';
import uglify from 'rollup-plugin-uglify-es';
import minify from 'rollup-plugin-babel-minify';

const config = {
  input: './src/index.js',
  output: [
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      entryFileNames: 'index.js',
    },
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
      entryFileNames: 'index-cjs.js',
    },
  ],
  plugins: [
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
      ],
    }),
  ],
};

export default config;
