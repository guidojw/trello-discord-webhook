module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: 'standard-with-typescript',
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json',
    sourceType: 'module'
  },
  rules: {
    'max-len': [
      'error',
      120,
      {
        ignoreTemplateLiterals: true,
        tabWidth: 2
      }
    ],
    'sort-imports': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/restrict-template-expressions': 'off'
  }
}
