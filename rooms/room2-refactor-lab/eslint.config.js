/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs"
    },
    rules: {
      // Unlock condition: reduzir complexidade ciclomática abaixo do target.
      // ESLint calcula complexidade por função (número de caminhos independentes).
      // Target inicial: 10.
      complexity: ["error", 10]
    }
  }
];
