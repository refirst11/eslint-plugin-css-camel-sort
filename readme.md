# eslint-plugin-css-camel-sort

Fork of [stylelint-config-recess-order](https://github.com/stormwarning/stylelint-config-recess-order?tab=readme-ov-file) with object CSS properties sorts for use eslint-plugin.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-css-camel-sort`:

```sh
npm install eslint-plugin-css-camel-sort --save-dev
```

## Usage

Add css-camel-sort to the plugins section of your `.eslintrc` configuration file. You can omit the eslint-plugin- prefix:

```json
{
  "plugins": ["css-camel-sort"]
}
```

Then add css-camel-sort rule under the rules section.

```json
{
  "rules": {
    "css-camel-sort/css-camel-sort": "warn"
  }
}
```
