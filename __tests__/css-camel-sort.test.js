const { RuleTester } = require("eslint");
const rule = require("../lib/rules/css-camel-sort");

const ruleTester = new RuleTester();

ruleTester.run("sort-css-properties", rule, {
  valid: [
    {
      code: 'const styles = { position: "absolute", top: "0", right: "0", bottom: "0", left: "0", display: "block" };',

      settings: {
        ecmaVersion: 2021,
      },
    },
  ],
  invalid: [
    {
      code: 'const styles = { display: "block", position: "absolute", top: "0", right: "0", bottom: "0", left: "0" };',
      errors: [
        {
          message:
            "CSS properties should be sorted according to the specified order.",
        },
      ],
      output:
        'const styles = { position: "absolute", top: "0", right: "0", bottom: "0", left: "0", display: "block" };',

      settings: {
        ecmaVersion: 2021,
      },
    },
  ],
});
