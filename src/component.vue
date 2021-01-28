<template>
  <div
    class='range'
    :class="{ 'disabled': disabled }"
    v-click-outside="unsetActiveThumb">
    <div
      class='range__hitbox'
      @click="updateThumb">
      <div class='range__bar' ref='bar'>
        <div
          class='range__process-bar'
          ref='process'
          :style="{
            '--start': `${process.min}%`,
            '--end': `${process.max - process.min}%`
          }">
        </div>
        <div
          v-for="(thumb, index) in value"
          v-bind:key="index"
          ref='thumb'
          class='range__thumb'
          :class="{ 'active': thumb.__range.active }"
          tabindex="0"
          @mousedown="setActive(thumb)"
          @touchstart="setActive(thumb)"
          @focus="setActive(thumb)"
          @mouseup="updateThumb"
          @touchend="updateThumb"
          @keyup.left="decreaseThumb"
          @keyup.down="decreaseThumb"
          @keyup.right="increaseThumb"
          @keyup.up="increaseThumb"
          :style="{ '--percentage': `${thumb.__range.percentage}%` }">
          <slot name="thumb" v-bind:thumb="thumb"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vClickOutside from 'v-click-outside'
import props from './props'

export default {
  name: 'range',

  directives: {
    clickOutside: vClickOutside.directive
  },

  mixins: [
    props
  ],

  data () {
    return {
      stepPercentage: 0,
      stepCount: 1,
      process: {
        min: 0,
        max: 0
      },
      minimum: 0,
      maximum: 100
    }
  },

  created () {
    this.setNumeric()
    this.setStep()
    this.setThumbset()
    this.updateProcess()
  },

  watch: {
    value (value) {
      if (!value.every(thumb => this.valueKey in thumb)) {
        console.error(`Every object within the value array must contain a ${this.valueKey} key.`)
      }
      this.setThumbset()
      this.updateProcess()
    },
    min (value) {
      if (value > this.max) {
        console.error('The minimum value can not be greater than the maximum value.')
      }
      this.setNumeric()
    },
    max (value) {
      if (value < this.min) {
        console.error('The maximum value can not be less than the minimum value.')
      }
      this.setNumeric()
    },
    step (value) {
      this.setNumeric()
      this.setStep()
    }
  },

  methods: {
    setNumeric () {
      // Ensures all min, max and step values are numeric.
      this.minimum = Number(this.min)
      this.maximum = Number(this.max)
    },
    toPercentage (value) {
      // Converts the given value to a percentage based on the min and max range values.
      return ((Number(value) - this.minimum) / (this.maximum - this.minimum)) * 100
    },
    setStep () {
      this.stepCount = Array.isArray(this.step) ? (this.maximum - this.minimum) / this.step.length : Number(this.step)
      this.stepPercentage = this.toPercentage(this.stepCount + this.minimum)
    },
    setThumbset () {
      this.value.map(thumb => {
        thumb.__range = {
          percentage: this.toPercentage(thumb.value),
          active: false
        }
      })
    },
    setActive (thumb) {
      this.unsetActiveThumb()

      if (this.disabled) return

      thumb.__range.active = true
    },
    unsetActiveThumb () {
      this.value.map(thumb => {
        thumb.__range.active = false
      })
    },
    getActive () {
      return this.value.find(thumb => thumb.__range.active)
    },
    updateThumb (event) {
      if (!this.getActive()) return

      const x = event.clientX
      const left = this.$refs.bar.offsetLeft || 0
      const size = this.$refs.bar.offsetWidth || 0
      const fraction = (x - left) / size
      const total = this.maximum - this.minimum
      const value = this.minimum + (fraction * total)
      const nearestValue = Math.round(value / this.stepCount) * this.stepCount
      const percentage = fraction * 100
      const nearestStep = Math.round(percentage / this.stepPercentage) * this.stepPercentage
      const thumb = this.value.find(thumb => thumb.__range.active)

      thumb.value = nearestValue
      thumb.__range.percentage = nearestStep

      this.updateProcess()
    },
    updateProcess () {
      // If there is only one value then the process bar should start at 0.
      if (this.value.length === 1) {
        this.process = {
          min: 0,
          max: this.value[0].__range.percentage
        }
        return
      }

      // Otherwise the process bar will start and end from the smallest to largest value.
      let min = this.value[0].__range.percentage || 0
      let max = this.value[0].__range.percentage || 0

      for (let i = 1, len = this.value.length; i < len; i++) {
        const value = this.value[i].__range.percentage
        min = (value < min) ? value : min
        max = (value > max) ? value : max
      }

      this.process = {
        min: min,
        max: max
      }
    },
    stepThumb (value, percentage) {
      const thumb = this.getActive()

      value = value >= this.minimum ? value : this.minimum
      value = value <= this.maximum ? value : this.maximum

      percentage = percentage >= 0 ? percentage : 0
      percentage = percentage <= 100 ? percentage : 100

      thumb.value = value
      thumb.__range.percentage = percentage

      this.updateProcess()
    },
    increaseThumb (event) {
      if (!this.getActive()) return

      event.preventDefault()

      const thumb = this.getActive()

      this.stepThumb(
        thumb.value + this.stepCount,
        thumb.__range.percentage + this.stepPercentage
      )
    },
    decreaseThumb (event) {
      if (!this.getActive()) return

      event.preventDefault()

      const thumb = this.getActive()

      this.stepThumb(
        thumb.value - this.stepCount,
        thumb.__range.percentage - this.stepPercentage
      )
    }
  }
}
</script>

<style scoped>
.range {
  padding: 0 var(--bar-height, 8px);
}

.range__hitbox {
  cursor: pointer;
  padding: var(--bar-height, 8px) 0;
}

.range__bar {
  height: var(--bar-height, 8px);
  width: 100%;
  position: relative;
  background: var(--bar-color, currentColor);
  border-radius: var(--bar-radius, 0);
}

.range__thumb,
.range__thumb:before,
.range__process-bar {
  transition-duration: var(--thumb-transition-duration, 0.2s);
  transition-timing-function: var(--thumb-transition-timing-function, ease-in-out);
}

.range__process-bar {
  height: var(--bar-height, 8px);
  position: absolute;
  z-index: 1;
  top: 0;
  background: var(--process-bar-color, currentColor);
  border-radius: var(--bar-radius, 0);
  left: var(--start, 0%);
  width: var(--end, 100%);
  transition-property: left, width;
}

.range__thumb {
  cursor: grab;
  outline: none;
  height: calc(var(--bar-height, 8px) * 4);
  width: calc(var(--bar-height, 8px) * 4);
  position: absolute;
  z-index: 2;
  top: 50%;
  left: var(--percentage, 0%);
  transform: translate(-50%, -50%);
  background: transparent;
  transition-property: left;
}

.range__thumb:before {
  content: '';
  display: block;
  height: 0;
  width: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition-property: height, width, opacity;
  border-radius: 50%;
  opacity: var(--thumb-opacity, 1);
  background: var(--thumb-color, currentColor);
  box-shadow: var(--thumb-shadow);
}

.range:hover .range__thumb:before,
.range__thumb.active:before {
  height: calc(var(--bar-height, 8px) * 3);
  width: calc(var(--bar-height, 8px) * 3);
  opacity: var(--thumb-opacity-active, 1);
  background: var(--thumb-color-active, currentColor);
}

.range.disabled {
  opacity: var(--bar-disabled-opacity, 0.5);
}

.range.disabled .range__thumb {
  display: none;
}
</style>
