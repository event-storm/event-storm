const fs = require('fs');
const path = require('path');

const filesToCopy = [
  'package.json',
  'src/helpers/eventBus/README.md',
  'src/helpers/eventBus/eventBus.js',
  'src/helpers/eventBus/index.js',
  'src/helpers/eventBus/useSubscription.js',
  'src/helpers/eventBus/utils.js',
];

filesToCopy.forEach(file => fs.copyFileSync(path.join(__dirname, '..', file), path.join(__dirname, '..', 'build', file)));
