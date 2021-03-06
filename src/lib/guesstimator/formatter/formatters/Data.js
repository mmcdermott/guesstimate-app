import {textMixin, isParseableNumber, parseNumber} from './lib.js'

export const item = {
    guesstimateType: 'DATA',
    inputType: 'TEXT',
    formatterName: 'DATA',

    format(g) {
      return {
        guesstimateType: this.guesstimateType,
        data: g.data
      }
    },
    matches(g) { return !!g.data },
    errors(g) {return []},
  }

