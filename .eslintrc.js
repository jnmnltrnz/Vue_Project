// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    "cypress/globals": true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:cypress/recommended",
  ],
  plugins: ["vue", "cypress"],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    // your custom rules
  },
};
