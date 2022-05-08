module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "browser": true,
    "es2021": true,
    "jest/globals": true,
  },
  "plugins": ["jest"],
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-prototype-builtins": 0,
  }
};
