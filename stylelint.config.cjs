module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    // Allow @import after Tailwind directives
    "no-invalid-position-at-import-rule": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
          "theme",
        ],
      },
    ],
    "function-no-unknown": [true, { ignoreFunctions: ["theme"] }],
    // Relax keyframe naming to allow camelCase names already used
    "keyframes-name-pattern": null,
    "no-descending-specificity": null,
    "selector-class-pattern": null,
    "media-feature-range-notation": null,
  },
};
