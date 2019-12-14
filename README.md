# vue2-migration-helper

Updates vue2 SFCs (single file components) to vue3 composition api syntax.

## Features

- [x] add `setup` method
- [x] add required vue `imports`
- [x] update `data` properties
- [x] update `computed` syntax
- [x] update `watch` syntax
- [x] integrate `methods` directly into setup
- [x] update template `ref` usage
- [x] convert `props` syntax
- [x] replace `this` usage with new `context` parameter for \$events etc
- [x] update `lifecycle` hooks and remove deperecated lifecycle hooks
- [x] `component` registration

missing something?

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
