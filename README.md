# vue2-migration-helper

Updates vue2 SFCs (single file components) to vue3 composition api syntax.

(work in progress)

## Features

- [x] add `setup` method
- [x] add required vue `imports`
- [x] update `data` properties
- [x] update `computed` syntax
- [x] update `watch` syntax
- [x] integrate `methods` directly into setup
- [ ] update template `ref` usage
- [ ] replace `this` usage with new `context` parameter for \$events etc
- [ ] convert `props` syntax
- [ ] `component` registration
- [ ] update `lifecycle` hooks and remove deperecated lifecycle hooks

missing something?

## Example

For a Vue.js SFC (single file component) like this:

```js
const zero = {}

export default {
  props: {
    title: String,
    likes: Number,
    callback: Function
  },

  data() {
    return {
      one: true,
      two: 2,
      three: 'three'
    }
  },

  watch: {
    oneWatch(val) {
      console.log(val)
    },
    twoWatch: val => {
      console.log(val)
    },
    threeWatch: function(val) {
      console.log(val)
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
    },

    threeMethod: () => {
      console.log('threeMethod')
      console.log(this.threeComputed)
      this.twoMethod()
    }
  }
}
```

this script generates Vue SFC using composition API:

```js
import { ref, reacted, toRefs, watch, computed, onMounted } from 'vue'
const zero = {}
export default {
  setup(props, context) {
    const data = reactive({
      one: true,
      two: 2
    })
    const twoComputed = computed(() => {
      return !data.one
    })
    const oneComputed = computed(() => {
      return !data.one
    })
    const threeWatch = watch(val => {
      console.log(val)
    })
    const twoWatch = watch(val => {
      console.log(val)
    })
    const oneWatch = watch(val => {
      console.log(val)
    })

    const fourMethod = () => {
      console.log('fourMethod')
    }

    const fiveMethod = () => {
      console.log('fiveMethod')
    }

    const oneMethod = () => {
      const html = this.$refs.templateRef.innerHTML
      console.log('oneMethod')
      console.log(oneComputed)
    }

    const twoMethod = () => {
      this.$refs.templateRef.innerHTML = 'html'
      console.log('twoMethod')
      console.log(twoComputed)
      oneMethod()
    }

    const threeMethod = () => {
      console.log('threeMethod')
      console.log(threeComputed)
      twoMethod()
    }

    return {
      ...ref(data),
      oneComputed: oneComputed,
      twoComputed: twoComputed,
      threeComputed: threeComputed,
      fourMethod: fourMethod,
      fiveMethod: fiveMethod,
      oneMethod: oneMethod,
      twoMethod: twoMethod,
      threeMethod: threeMethod
    }
  }
}
```
