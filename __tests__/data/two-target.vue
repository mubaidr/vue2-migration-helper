<template >
    
<h1 ref="templateRef" class="heading">Test Component</h1>

  </template>
  <script lang="js" scoped="true">
    import { ref, reacted, toRefs } from "vue";
import SomeComponent from './SomeComponent';
const zero = {};
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
    });
    const templateRef = ref(null);
    watch(three, (a, b) => {
      console.log(a, b);
    });
    watch(two, val => {
      console.log(val);
    });
    watch(one, val => {
      console.log(val);
    });
    const oneComputed = computed(() => {
      return !data.one;
    });
    const twoComputed = computed(() => {
      return data.two + 5;
    });
    const threeComputed = computed(() => {
      return data.three.toUpperCase();
    });

    (() => {
      console.log('created');
    })();

    onMounted(() => {
      console.log('mounted');
    });

    function fourMethod() {
      console.log('fourMethod');
    }

    function fiveMethod() {
      console.log('fiveMethod');
    }

    function oneMethod() {
      const html = templateRef.innerHTML;
      console.log('oneMethod');
      console.log(oneComputed);
      console.log(context.$data);
    }

    function twoMethod() {
      templateRef.innerHTML = 'html';
      console.log('twoMethod');
      console.log(twoComputed);
      oneMethod();
      console.log(context.$router);
    }

    function threeMethod() {
      console.log('threeMethod');
      console.log(threeComputed);
      twoMethod();
      console.log(fourMethod);
      console.log(context.$store);
    }

    return { ...ref(data),
      oneComputed,
      twoComputed,
      threeComputed,
      fourMethod,
      fiveMethod,
      oneMethod,
      twoMethod,
      threeMethod,
      templateRef
    };
  }

};
  </script>
  <style >
        
.heading {
  font-size: large;
}

      </style>