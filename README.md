# vue2-migration-helper

Updates vue2 SFCs (single file components) to vue3 composition api syntax. This script contains hacky and quick implementation but the features listed here works well.

[![Build Status](https://travis-ci.org/mubaidr/vue2-migration-helper.svg?branch=master)](https://travis-ci.org/mubaidr/vue2-migration-helper)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/adf93fc22bd3479da66f3d4c74a0b95f)](https://app.codacy.com/app/mubaidr/vue2-migration-helper?utm_source=github.com&utm_medium=referral&utm_content=mubaidr/vue2-migration-helper&utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/mubaidr/vue2-migration-helper/branch/master/graph/badge.svg)](https://codecov.io/gh/mubaidr/vue2-migration-helper)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

[![NPM](https://nodei.co/npm/vue2-migration-helper.png)](https://nodei.co/npm/vue2-migration-helper/)

<a href="https://patreon.com/mubaidr">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="45">
</a>

## Features

- [x] add `setup` method
  - with `props` and `context` arguments
- [x] add required vue `imports`
  - only adds required imports after traversing code
- [x] update `data` properties
  - Uses `data` variable using `reactive`
  - Return reactive references using `ref`
  - updates usage of these varaiables
- [x] update `computed` syntax
  - defines variable for each property using new syntax `computed`
- [x] update `watch` syntax
  - updates watch syntax
- [x] integrate `methods` directly into setup
  - defines `methods` into the setup body
  - updates method calls
- [x] update template `ref` usage
  - adds a new variable for each `templateRef` using `ref(null)`
  - add new defined templateRefs to return statement
- [x] convert `props` syntax
- [x] replace `this` usage with new `context` parameter for \$events etc
  - replaces `this` keyword usage as this no longer refers to vue component itself.
- [x] update `lifecycle` hooks and remove deperecated lifecycle hooks
  - removes depracted life cycle hooks, injects deprecated hooks code into `setup` method.
  - copies other `hooks` into the `setup` method
- [x] `component` registration

missing something?

## Install

```bash
npm i vue2-migration-helper
```

### CLI

```bash
# convert all .vue files in source directory and outputs in target directory
vue2-migration-helper --s="source/" --t="target/"

# displays help
vue2-migration-helper --help
```

### Programatically use

```ts
import { vue2MigrationHelper } from 'vue2-migration-helper'

vue2MigrationHelper({
  source: 'source/',
  target: 'target/'
})
```

## Example

For a Vue.js SFC (single file component) like this:

```js
import SomeComponent from './SomeComponent'
const zero = {}

export default {
  props: {
    title: String,
    likes: Number,
    callback: Function
  },

  components: {
    SomeComponent
  },

  data() {
    return {
      one: true,
      two: 2,
      three: 'three'
    }
  },

  watch: {
    one(val) {
      console.log(val)
    },
    two: val => {
      console.log(val)
    },
    three: function(a, b) {
      console.log(a, b)
    }
  },

  computed: {
    oneComputed() {
      return !this.one
    },
    twoComputed: () => {
      return !this.one
    },
    threeComputed: function() {
      return !this.one
    }
  },

  created() {
    console.log('created')
  },

  mounted() {
    console.log('mounted')
  },

  methods: {
    ...[
      function fourMethod() {
        console.log('fourMethod')
      },
      function fiveMethod() {
        console.log('fiveMethod')
      }
    ],

    oneMethod() {
      const html = this.$refs.templateRef.innerHTML
      console.log('oneMethod')
      console.log(this.oneComputed)
    },

    twoMethod: function() {
      this.$refs.templateRef.innerHTML = 'html'
      console.log('twoMethod')
      console.log(this.twoComputed)
      this.oneMethod()
      console.log(this.$router)
    },

    threeMethod: () => {
      console.log('threeMethod')
      console.log(this.threeComputed)
      this.twoMethod()

      console.log(this.$store)
    }
  }
}
```

this script generates Vue SFC using composition API:

```js
import { ref, reacted, toRefs, watch, computed, onMounted } from 'vue'
import SomeComponent from './SomeComponent'
const zero = {}
export default {
  components: {
    SomeComponent
  },
  props: {
    title: String,
    likes: Number,
    callback: Function
  },

  setup(props, context) {
    const data = reactive({
      one: true,
      two: 2,
      three: 'three'
    })
    const templateRef = ref(null)
    const threeComputed = computed(() => {
      return !data.one
    })
    const twoComputed = computed(() => {
      return !data.one
    })
    const oneComputed = computed(() => {
      return !data.one
    })
    watch(three, (a, b) => {
      console.log(a, b)
    })
    watch(two, val => {
      console.log(val)
    })
    watch(one, val => {
      console.log(val)
    })
    console.log('created')
    onMounted(() => {
      console.log('mounted')
    })

    function fourMethod() {
      console.log('fourMethod')
    }

    function fiveMethod() {
      console.log('fiveMethod')
    }

    function oneMethod() {
      const html = templateRef.value.innerHTML
      console.log('oneMethod')
      console.log(oneComputed)
    }

    function twoMethod() {
      templateRef.value.innerHTML = 'html'
      console.log('twoMethod')
      console.log(twoComputed)
      oneMethod()
      console.log(context.router)
    }

    function threeMethod() {
      console.log('threeMethod')
      console.log(threeComputed)
      twoMethod()
      console.log(context.store)
    }

    return {
      ...ref(data),
      oneComputed,
      twoComputed,
      threeComputed,
      fourMethod,
      fiveMethod,
      oneMethod,
      twoMethod,
      threeMethod,
      templateRef
    }
  }
}
```
