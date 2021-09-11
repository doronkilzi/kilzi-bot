module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-use-before-define': 'off',
    'consistent-return': 'off',
    'linebreak-style': 'off',
    'max-len': ['error', { code: 130 }],
  },
  ignorePatterns: ['package.json', 'package-lock.json', 'node_modules'],
};
