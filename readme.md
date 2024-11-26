# eslint-plugin-css-camel-sort

A [Eslint](https://github.com/eslint/eslint) config that sorts camelCase CSS properties based on [Recess](https://github.com/twitter-archive/recess/blob/29bccc870b7b4ccaa0a138e504caf608a6606b59/lib/lint/strict-property-order.js).

## Usage

1. Add eslint and this package to your project:

```sh
npm install --sav-dev eslint eslint-plugin-css-camel-sort
```

2. Configure in your `.eslintrc`:

```json
{
  "plugins": ["css-camel-sort"],
  "rules": {
    "css-camel-sort/css-camel-sort": "warn"
  }
}
```

## Advanced

3. Save and lint run: Add ESlint setting to your project in `.vscode/settings.json`

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "eslint.validate": ["js", "jsx", "ts", "tsx"]
}
```

## License

This project is licensed under the ISC License.  
It includes code modified from ISC-licensed software.  
The original ISC license can be found [stylelint-config-recess-order](https://github.com/stormwarning/stylelint-config-recess-order?tab=readme-ov-file).
