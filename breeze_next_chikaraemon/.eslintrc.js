module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    commonjs: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'next', // Next.jsのルールを追加
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json', // TypeScriptのプロジェクト設定
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // PrettierのルールをESLintに適用(prettierを優先)
    'import/prefer-default-export': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'off',
    'no-nested-ternary': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': ['error', { allowTernary: true }],
    camelcase: 0,
    'react/self-closing-comp': 1,
    'react/jsx-filename-extension': [
      'warn', // もしくは 'error' としてエラーとして扱う
      { extensions: ['.jsx', '.tsx', '.js'] }, // .js, .jsx, .tsx にもJSXを許可
    ],
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-no-comment-textnodes': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    'react/no-unescaped-entities': 0,
    'react/require-default-props': 0,
    'react/react-in-jsx-scope': 0,
    'linebreak-style': ['error', 'unix'],
  },
}
