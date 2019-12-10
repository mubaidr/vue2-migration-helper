<template>
  <h1>Test Component</h1>
</template>

<script>
const zero = {}

export default {
  props: {
    title: String,
    likes: Number,
    callback: Function,
  },

  data() {
    return {
      one: true,
      two: 2,
      three: 'three'
    }
  },

  watch: {
    two(val) {
      console.log(val)
    }
  },

  computed: {
    oneComputed() {
      return !this.one
    }
  },

  mounted() {
    console.log('mounted')
  },

  methods: {
    ...[function some() {}, function other() {}],

    logOne() {
      console.log(this.one)
    }
  }
}
</script>

<style>
</style>
