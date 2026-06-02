import eslint from "@eslint/js";
import litPlugin from "eslint-plugin-lit";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    plugins: {
      lit: litPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          "args": "none",
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrors": "none"
        }
      ],
      "no-undef": "error",
      ...litPlugin.configs.recommended.rules,
    },
  },
];
