<template>
  <h1>Test Component</h1>
</template>

<script>
const zero = {}

export default {
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
    logOne() {
      console.log(this.one)
    }
  },

  ...[function some() {}, function other() {}]
}
</script>

<style>
</style>
