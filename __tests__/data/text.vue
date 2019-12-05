<template>
  <h1>Test Component</h1>
</template>

<script>
import { ref, computed, watch, onMounted } from '@vue/composition-api'

const zero = {}

export default {
  data() {
    return {
      one: true,
      two: 2,
      three: 'three',
    }
  },

  watch: {
    two(val) {
      console.log(val)
    },
  },

  computed: {
    oneComputed() {
      return !this.one
    },
  },

  mounted() {
    console.log('mounted')
  },

  methods: {
    logOne() {
      console.log(this.one)
    },
  },
}
</script>

<style>
</style>
