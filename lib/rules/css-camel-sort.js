'use strict'
const propertyGroups = require('../util/propertyGroups')

function getPropertyName(property) {
  if (property.key.type === 'Literal' && Array.isArray(property.key.value)) {
    return property.key.value
  }
  return property.key.name || property.key.value || ''
}

function getPropertyIndex(property) {
  const name = getPropertyName(property)

  if (Array.isArray(name)) return Infinity
  if (name.includes('@media')) return 3000
  if (name.includes(':')) return 2000
  if (name.startsWith('&')) return 1000

  // Order according to propertyGroups
  for (let i = 0; i < propertyGroups.length; i++) {
    const group = propertyGroups[i]
    const propIndex = group.properties.indexOf(name)
    if (propIndex !== -1) {
      return i * 100 + propIndex
    }
  }

  return Infinity
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Sort CSS properties according to defined groups and specific rules.',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      ObjectExpression(node) {
        const sourceCode = context.getSourceCode()
        const properties = node.properties.filter((prop) => prop.key)

        const sortedProperties = [...properties].sort((a, b) => {
          const indexA = getPropertyIndex(a)
          const indexB = getPropertyIndex(b)
          return indexA - indexB
        })

        const isSorted = properties.every(
          (prop, index) => prop === sortedProperties[index],
        )
        if (isSorted) {
          return
        }

        const match = sourceCode.getText(node).match(/^{\s*\n(\s*)/)
        const objectIndent = match ? match[1] : ''
        const lineCase = match ? '\n' : ' '

        context.report({
          node,
          message:
            'CSS properties should be sorted according to the specified order.',
          fix(fixer) {
            const formattedProps = sortedProperties
              .map((prop) => {
                if (Array.isArray(getPropertyName(prop))) {
                  const arrayKey = sourceCode.getText(prop.key)
                  const arrayContent = prop.value.properties
                    .map(
                      (innerProp) =>
                        `${objectIndent}  ${sourceCode.getText(innerProp)}`,
                    )
                    .join(`,${lineCase}`)
                  return `${objectIndent}${arrayKey}: {\n${arrayContent}\n${objectIndent}}`
                }
                return `${objectIndent}${sourceCode.getText(prop)}`
              })
              .join(`,${lineCase}`)

            return fixer.replaceTextRange(
              [node.range[0] + 1, node.range[1] - 1],
              `${lineCase}${formattedProps}${lineCase}`,
            )
          },
        })
      },
    }
  },
}
