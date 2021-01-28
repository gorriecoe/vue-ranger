# Range/slider

A super light weight vuejs multi-value range/slider component.

## Features

- Super light weight
- Highly customizable
- Supports multiple values/sliders
- Keypress support
- Min/Max values

## Installation

```
npm install vue-ranger babel-loader css-loader vue-style-loader vue-template-compiler
```

## Usage

```html
<template>
  <range v-model="MyCustomModel" min="100" max="500" step="10"></range>
</template>

<script>
import range from 'vue-ranger'

export default {
  data () {
    return {
      MyCustomModel: [
        {
          SomeOtherData: "Blah",
          value: 157,
        },
        {
          SomeOtherData: "Blah",
          value: 400,
        },
        {
          SomeOtherData: "Blah",
          value: 320
        },
      ],
    }
  },
  components: {
    range
  }
}
</script>

<style>
.range {
  /* Custom CSS.  Details below */
}
</style>
```

## Props

### `v-model`

- Type: Array
- Validator: Only accepts an array of objects.  The Objects must contain a `value` key.
- _Required_

### `min`

- Type: Number | String
- Default: 0

### `max`

- Type: Number | String
- Default: 100

### `step`

Defines the interval between legal numbers in the range.

- Type: Number | String | Array
- Default: 1

> Note: While `step` accepts an Array it merely used for snapping to nearest value and provides no visual change.

### `valueKey`

Allows us to change the `value` key required for each object.

- Type: String
- Default: value

## Styling

Styling is primarily controled via css variables.

Below are a few examples of how they can be applied and variables available.

**CSS root example (Recommended)**

```css
:root {
  --bar-height: 8px;
}
```

**CSS element example**

```css
.range {
  --bar-height: 8px;
}
```

**Inline example**

```html
<range style="--bar-height: 8px"></range>
```

### `--bar-height`

Defines the height of the range bar.

- Default: 8px

### `--bar-color`

Defines the color of the range bar.

- Default: currentColor

### `--bar-radius`

Defines the border radius of the range and process bar.

- Default: 0

### `--bar-disabled-opacity`

Defines the range opacity while disabled.

- Default: 0.5

### `--thumb-color`

Defines the color of the thumbs.

- Default: currentColor

### `--thumb-color-active`

Defines the color of the thumb while active.

- Default: currentColor

### `--thumb-opacity`

Defines the opacity of the thumbs.

- Default: 1

### `--thumb-opacity-active`

Defines the opacity of the thumb while active.

- Default: 1

### `--process-bar-color`

Defines the color of the process(smallest to largest value) range bar.

- Default: currentColor

### `--thumb-transition-duration`

Defines the transition duration between default to active and hover state of thumbs.

- Default: 0.2s

### `--thumb-transition-timing-function`

Defines the transition timing function between default to active and hover state of thumbs.

- Default: ease-in-out

#### Some nice styles

**Example**

```css
.range {
  --thumb-color: #fff;
  --thumb-color-active: #fff;
  --thumb-shadow: .5px .5px 2px 1px rgba(0,0,0,.32);
  --bar-color: #ccc;
  --bar-height: 6px;
  --bar-radius: 15px;
  --process-bar-color: #3498db;
}
```

**Example**

```css
.range {
  --thumb-color: #fff;
  --thumb-color-active: #fff;
  --thumb-shadow: .5px .5px 2px 1px rgba(0,0,0,.32);
  --bar-color: #ccc;
  --bar-height: 6px;
  --bar-radius: 15px;
  --process-bar-color: #666;
}
.range__bar {
  box-shadow: rgba(0, 0, 0, 0.36) 0.5px 0.5px 3px 1px inset;
}
```

## Custom thumb

Optionally specify an alternative `<template>` for thumbs with access to the thumb data.

```html
<range>
  <template v-slot:thumb="{ thumb }">
    {{ thumb.value }}
  </template>
</range>
```

## Loading bar

The range could also be used a loading bar with simple configuration and styling.

- Ensure the range is disabled.
- It is also recommended to add a unique loading class.
- Apply `--bar-disabled-opacity: 1` to the loading class.

```html
<template>
  <div>
    <h2>Loading: {{ loading }}%</h2>
    <div>
      <range class="loader" v-model="loading" disabled></range>
    </div>
    <div>
      <button type="button" name="button" @click="startLoad">
        Start loading
      </button>
    </div>
  </div>
</template>

<script>
import range from 'vue-ranger'

export default {
  data () {
    return {
      loader: null,
      loading: [
          {
              value: 0
          }
      ]
    }
  },
  components: {
    range
  },
  methods: {
    startLoad () {
      this.loader = setInterval(() => {
        this.loading[0].value++
        if (this.loading[0].value === 100) {
          clearInterval(this.loader)
        }
      }, 100)
    }
  }
}
</script>

<style>
.range.loader {
  --bar-color: #ccc;
  --bar-disabled-opacity: 1;
  --bar-height: 15px;
  --bar-radius: 15px;
  --process-bar-color: #3498db;
}
</style>
```
