module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    plugins: [
        'vue'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'no-useless-escape': 'off',
        'no-console': 'off',
        'space-before-function-paren': ['error', 'never'],
        'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
