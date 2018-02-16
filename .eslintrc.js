module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: ['airbnb-base', 'plugin:vue/recommended'],
  plugins: ['vue'],
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'import/extensions': {
      vue: 'never'
    }
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.prod.conf.js'
      }
    }
  }
}
