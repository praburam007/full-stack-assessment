module.exports = {
  scripts: {
    default: 'nps start',
    run: {
      ui: 'npm start run.ui --workspace=ui || true',
      api: 'npm start run.api --workspace=api || true',
    },
    format: {
      js: 'prettier --write "**/*.{js,jsx,cjs,mjs}"',
      json: 'prettier --write "**/*.json"',
      md: 'prettier --write "**/*.md"',
      all: 'nps format.js format.json format.md',
    },
    lint: {
      js: 'eslint "**/*.{js,jsx,cjs,mjs}"',
      all: 'nps lint.js',
    }``
  },
};