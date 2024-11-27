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

        const misorderedProperties = properties.filter(
          (prop, index) => prop !== sortedProperties[index],
        )

        if (misorderedProperties.length === 0) {
          return
        }

        const match = sourceCode.getText(node).match(/^{\s*\n(\s*)/)
        const objectIndent = match ? match[1] : ''
        const lineCase = match ? '\n' : ' '

        misorderedProperties.forEach((prop) => {
          const correctIndex = sortedProperties.indexOf(prop)

          context.report({
            node: prop,
            message: `Property "${getPropertyName(
              prop,
            )}" is out of order. Expected position: ${correctIndex + 1}.`,
            fix(fixer) {
              const formattedProps = sortedProperties
                .map((sortedProp) => {
                  if (Array.isArray(getPropertyName(sortedProp))) {
                    const arrayKey = sourceCode.getText(sortedProp.key)
                    const arrayContent = sortedProp.value.properties
                      .map(
                        (innerProp) =>
                          `${objectIndent}  ${sourceCode.getText(innerProp)}`,
                      )
                      .join(`,${lineCase}`)
                    return `${objectIndent}${arrayKey}: {\n${arrayContent}\n${objectIndent}}`
                  }
                  return `${objectIndent}${sourceCode.getText(sortedProp)}`
                })
                .join(`,${lineCase}`)

              return fixer.replaceTextRange(
                [node.range[0] + 1, node.range[1] - 1],
                `${lineCase}${formattedProps}${lineCase}`,
              )
            },
          })
        })
      },
    }
  },
}
