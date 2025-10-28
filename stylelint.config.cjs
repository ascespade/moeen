module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'no-invalid-position-at-import-rule': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'responsive',
          'screen',
          'layer',
          'theme',
        ],
      },
    ],
    'keyframes-name-pattern': null,
    'selector-class-pattern': null,
    'media-feature-range-notation': null,
    'declaration-empty-line-before': null,
  },
};
