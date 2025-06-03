import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "warn",         // Advierte sobre variables no usadas
      "no-console": "off",              // Permite el uso de console.log
      "eqeqeq": "error",                // Obliga a usar === y !==
      "semi": ["error", "always"],      // Obliga a usar punto y coma
      "quotes": ["error", "double"],    // Obliga a usar comillas dobles
      "indent": ["error", 2],           // Indentación de 2 espacios
      "no-var": "error",                // Prohíbe el uso de var
      "prefer-const": "warn"            // Recomienda usar const cuando sea posible
    },
  },
];
