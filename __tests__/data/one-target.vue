<template lang="html">
    
<div class="modal is-active">
  <div class="modal-background" @click="closeModal" />
  <button
    aria-label="close"
    class="delete is-large is-top-right"
    @click="closeModal"
  />

  <div class="modal-card">
    <header class="modal-card-head">
      <a class="button is-pulled-left is-info" @click="previous">
        <i class="material-icons">skip_previous</i>
      </a>
      &nbsp;&nbsp;&nbsp;
      <input
        ref="txt_roll_no"
        v-model="row.rollNo"
        :class="{ 'is-danger': !row.rollNo }"
        :readonly="row.isRollNoExtracted"
        class="input has-text-centered is-uppercase has-text-weight-bold is-family-code"
        placeholder="Input Roll Number"
        type="text"
      />
      &nbsp;&nbsp;&nbsp;
      <a class="button is-pulled-right is-info" @click="next">
        <i class="material-icons">skip_next</i>
      </a>
    </header>

    <section class="modal-card-body">
      <div class="has-text-centered">
        <!-- Preview -->
        <img v-show="imageSource" :src="imageSource" />
      </div>
    </section>
  </div>
</div>

  </template>
  <script lang="js" scoped="true" src="./something.js">
    import { ref, reacted, toRefs } from "vue";
import Vue from 'vue';
export default {
  props: {
    selectedRow: {
      type: Object,

      default() {
        return null;
      }

    },
    imageSource: {
      type: String,

      default() {
        return '';
      }

    }
  },

  setup(props, context) {
    const data = reactive({
      row: null
    });
    const txt_roll_no = ref(null);
    watch(selectedRow, val => {
      data.row = val;
      const el = context.$refs.txt_roll_no;
      el.focus();
    });

    (() => {
      data.row = props.selectedRow;
    })();

    onMounted(() => {
      const el = context.$refs.txt_roll_no;
      el.focus();
    });

    function closeModal() {
      context.$emit('close-modal');
      data.row = null;
    }

    function next() {
      context.$emit('next');
    }

    function previous() {
      context.$emit('previous');
    }

    return { ...ref(data),
      closeModal,
      next,
      previous,
      txt_roll_no
    };
  }

};
  </script>
  <style lang="scss" scoped="true">
        
.delete.is-top-right {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99999;
}

img {
  height: calc(100vh - 200px);
  min-height: 600px;
}

      </style>