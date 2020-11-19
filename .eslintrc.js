module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'max-len': [
      'error',
      120,
      {
        ignoreTemplateLiterals: true
      }
    ]
  }
}
