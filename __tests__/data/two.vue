<template>
  <h1 ref="templateRef" class="heading">Test Component</h1>
</template>

<script lang="js" scoped>
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
      return this.two + 5
    },
    threeComputed: function() {
      return this.three.toUpperCase()
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
      console.log(this.$data)
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

      console.log(this.fourMethod)
      console.log(this.$store)
    }
  }
}
</script>

<style>
.heading {
  font-size: large;
}
</style>
