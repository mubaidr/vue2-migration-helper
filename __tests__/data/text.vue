<template>
  <h1>Test Component</h1>
</template>

<script>
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
      console.log('oneMethod')
    },

    twoMethod: function() {
      console.log('twoMethod')
    },

    threeMethod: () => {
      console.log('threeMethod')
    }
  }
}
</script>

<style>
</style>
