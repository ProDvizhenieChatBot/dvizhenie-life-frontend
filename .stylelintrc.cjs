module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
  ignoreFiles: ['dist/**/*', 'node_modules/**/*'],
  rules: {
    'no-empty-source': null,
  },
};
