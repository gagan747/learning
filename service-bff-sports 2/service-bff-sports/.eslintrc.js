module.exports = {
  extends: ['@tabdigital/eslint-config-node'],
  plugins: ['mocha'],
  overrides: [
    {
      files: [
        'test/**/*.js',
      ],
      env: {
        mocha: true,
      },
      globals: {
        SRC: 'readonly',
        TEST: 'readonly',
      },
      rules: {
        'import/no-dynamic-require': 'off',
      },
    },
  ],
  rules: {
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: '@tabdigital/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'new-cap': [
      'error',
      {
        newIsCapExceptionPattern: '^s\\..',
      },
    ],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
    ],
  },
};
