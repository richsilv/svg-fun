import jsf from 'json-schema-faker'
import { randomWord, makeInteger } from './make-vars'
import { Slider } from './form-components'

export const viewBox = [-180, -120, 360, 240]

export function schema (fonts, family) {
  const selected = fonts.find((f) => f.family === family) || { variants: [] }

  return {
    title: 'SVG Paramaterised Logo Schema',
    type: 'object',
    properties: {
      colors: {
        type: 'array',
        items: {
          type: 'string',
          pattern: '^#[0-9a-fA-F]{6}$',
          chance: {
            color: {
              format: 'hex'
            }
          }
        },
        minItems: 3,
        maxItems: 3
      },
      graphic: {
        title: 'Graphic properties',
        type: 'object',
        properties: {
          a: {
            minimum: 10,
            maximum: 50,
            type: 'integer',
            default: 30
          },
          b: {
            minimum: 10,
            maximum: 50,
            type: 'integer',
            default: 30
          },
          l: {
            minimum: 0.0,
            maximum: 1.0,
            multipleOf: 0.0000001,
            type: 'number',
            default: 0.5
          },
          numPaths: {
            maximum: 12,
            minimum: 2,
            type: 'integer',
            default: 7
          },
          numPoints: {
            maximum: 16,
            minimum: 8,
            type: 'integer',
            default: 12
          },
          pointOrderInt: {
            maximum: 100000000000000,
            minimum: 0,
            type: 'integer',
            default: 100000
          },
          curvedPath: {
            type: 'boolean',
            default: false
          },
          k: {
            type: 'array',
            items: [
              {
                type: 'integer',
                minimum: 1,
                maximum: 20,
                default: 8
              },
              {
                type: 'integer',
                minimum: 1,
                maximum: 20,
                default: 12
              }
            ],
            maxItems: 2,
            minItems: 2
          },
          // position: {
          //   type: 'object',
          //   properties: {
          //     x: {
          //       type: 'number',
          //       maximum: 1.0,
          //       minimum: 0.0,
          //       multipleOf: 0.0000001,
          //       default: 0.5
          //     },
          //     y: {
          //       type: 'number',
          //       maximum: 1.0,
          //       minimum: 0.0,
          //       multipleOf: 0.0000001,
          //       default: 0.5
          //     }
          //   },
          //   required: ['x', 'y']
          // },
          // scale: {
          //   type: 'number',
          //   maximum: 3.0,
          //   minimum: 0.3,
          //   multipleOf: 0.000001,
          //   default: 1.0
          // },
          angMult: {
            type: 'integer',
            maximum: 5,
            minimum: 1,
            default: 1
          },
          flip: {
            type: 'object',
            properties: {
              x: {
                maximum: 5,
                minimum: 1,
                default: 1,
                type: 'integer'
              },
              y: {
                maximum: 5,
                minimum: 1,
                default: 1,
                type: 'integer'
              }
            },
            required: ['x', 'y']
          }
        },
        required: ['a', 'b', 'l', 'numPaths', 'numPoints', 'pointOrderInt', 'curvedPath', 'k', 'position', 'angMult', 'flip']
      },
      text: {
        title: 'Text properties',
        type: 'object',
        properties: {
          font: {
            type: 'object',
            properties: {
              family: {
                type: 'string',
                enum: fonts.map((f) => f.family)
              },
              variant: {
                type: 'string',
                enum: selected.variants
              }
            },
            required: ['family', 'variant']
          },
          fontSize: {
            maximum: 60,
            minimum: 20,
            type: 'integer',
            default: 40
          },
          letterSpacing: {
            maximum: 10,
            minimum: -5,
            type: 'integer',
            default: 0
          },
          textTransform: {
            type: 'string',
            enum: ['none', 'capitalize', 'lowercase', 'uppercase']
          },
          position: {
            type: 'object',
            properties: {
              x: {
                type: 'number',
                maximum: 1.0,
                minimum: 0.0,
                multipleOf: 0.0000001,
                default: 0.5
              },
              y: {
                type: 'number',
                maximum: 1.0,
                minimum: 0.0,
                multipleOf: 0.0000001,
                default: 0.5
              }
            },
            required: ['x', 'y']
          },
          textColorRatios: {
            type: 'array',
            items: {
              type: 'number',
              maximum: 1.0,
              minimum: 0.0,
              multipleOf: 0.0000001,
              default: 0.5
            },
            minItems: 2,
            maxItems: 2
          }
        },
        required: ['font', 'fontSize', 'position', 'textColorRatios', 'letterSpacing']
      }
    },
    required: [
      'colors',
      'graphic',
      'text'
    ]
  }
}

export const uiSchema = {
  colors: {
    items: {
      'ui:widget': 'color'
    },
    addable: false,
    removable: false
  },
  graphic: {
    a: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    b: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    l: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    numPaths: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    numPoints: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    pointOrderInt: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    lineCount: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    k: {
      items: { 'ui:widget': Slider },
      addable: false,
      removable: false
    },
    position: {
      x: { 'ui:widget': Slider, classNames: 'w-40 dib' },
      y: { 'ui:widget': Slider, classNames: 'w-40 dib' }
    },
    scale: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    angMult: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    flip: {
      x: { 'ui:widget': Slider, classNames: 'w-40 dib' },
      y: { 'ui:widget': Slider, classNames: 'w-40 dib' }
    }
  },
  text: {
    fontSize: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    letterSpacing: { 'ui:widget': Slider, classNames: 'w-40 dib' },
    position: {
      x: { 'ui:widget': Slider, classNames: 'w-40 dib' },
      y: { 'ui:widget': Slider, classNames: 'w-40 dib' }
    },
    textColorRatios: {
      items: {
        'ui:widget': Slider
      },
      addable: false,
      removable: false
    }
  }
}

function randomFont (fonts) {
  const font = fonts[makeInteger(fonts.length)]
  const variant = font.variants[makeInteger(font.variants.length)]
  return { family: font.family, variant }
}

export function makeWebFontUrl ({ family, variant }) {
  if (!family) return ''
  return `https://fonts.googleapis.com/css?family=${family.replace(/ /g, '+')}:${variant}`
}

export default function makeVars ({ fonts }) {
  const font = randomFont(fonts)
  const vars = jsf(schema(fonts, font.family))
  vars.graphic.k = vars.graphic.k.sort((a, b) => a - b)

  Object.assign(vars.graphic, { position: { x: 0, y: 0 }, scale: 1 })

  vars.viewBox = viewBox
  return randomWord().then((word) => {
    vars.text.name = word
    return vars
  })
}
