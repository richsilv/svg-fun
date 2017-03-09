import jsf from 'json-schema-faker'
import { randomWord } from './make-vars'

export const viewBox = [-180, -120, 360, 240]

export const schema = {
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
    lineCount: {
      minimum: 2,
      maximum: 11,
      type: 'integer',
      default: 6
    },
    fontSize: {
      maximum: 60,
      minimum: 20,
      type: 'integer',
      default: 40
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
    fontPosition: {
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
    angMult: {
      type: 'integer',
      maximum: 5,
      minimum: 1,
      default: 1
    },
    fontColorRatios: {
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
  required: [
    'colors',
    'a',
    'b',
    'l',
    'numPaths',
    'numPoints',
    'pointOrderInt',
    'curvedPath',
    'lineCount',
    'fontSize',
    'k',
    'fontPosition',
    'angMult',
    'fontColorRatios',
    'flip'
  ]
}

export const uiSchema ={
  colors: {
    items: {
      'ui:widget': 'color'
    },
    addable: false,
    removable: false
  },
  a: { 'ui:widget': 'range' },
  b: { 'ui:widget': 'range' },
  l: { 'ui:widget': 'range' },
  numPaths: { 'ui:widget': 'range' },
  numPoints: { 'ui:widget': 'range' },
  pointOrderInt: { 'ui:widget': 'range' },
  lineCount: { 'ui:widget': 'range' },
  fontSize: { 'ui:widget': 'range' },
  k: {
    items: { 'ui:widget': 'range' },
    addable: false,
    removable: false
  },
  fontPosition: {
    x: { 'ui:widget': 'range' },
    y: { 'ui:widget': 'range' }
  },
  angMult: { 'ui:widget': 'range' },
  fontColorRatios: {
    items: {
      'ui:widget': 'range'
    },
    addable: false,
    removable: false
  },
  flip: {
    x: { 'ui:widget': 'range' },
    y: { 'ui:widget': 'range' }
  }
}

export default function makeVars () {
  const vars = jsf(schema)
  vars.k = vars.k.sort((a, b) => a - b)
  vars.viewBox = viewBox
  return randomWord().then((word) => {
    vars.name = word
    return vars
  })
}
