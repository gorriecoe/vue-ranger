/**
 * For convience we expose the props as a mixin so we can wrap this component easier.
 */
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: Boolean,
    min: {
      type: [Number, String],
      default: 0
    },
    max: {
      type: [Number, String],
      default: 100
    },
    step: {
      type: [Number, String, Array],
      default: 1
    },
    valueKey: {
      type: String,
      default: 'value'
    }
  }
}
