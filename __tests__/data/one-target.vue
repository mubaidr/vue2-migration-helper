<template>
  <div>
    <div></div>
    <div>
      <header>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        <a>
          <i>skip_previous</i>
        </a>
        <a>
          <i>skip_next</i>
        </a>
        <input></input>
      </header>
      <section>
        <div>
          <img></img>
        </div>
      </section>
    </div>
    <button></button>
  </div>
</template>
<script>import "vue";
import Vue from 'vue';
export default Vue.extend({
  name: 'ModalPreview',
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

  data() {
    return {
      row: null
    };
  },

  watch: {
    selectedRow(val) {
      context.row = val;
      const el = context.$refs.txt_roll_no;
      el.focus();
    }

  },

  created() {
    context.row = context.selectedRow;
  },

  mounted() {
    const el = context.$refs.txt_roll_no;
    el.focus();
  },

  methods: {
    closeModal() {
      context.$emit('close-modal');
      context.row = null;
    },

    next() {
      context.$emit('next');
    },

    previous() {
      context.$emit('previous');
    }

  }
});</script>
<style>.delete.is-top-right {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99999;
  }

  img {
    height: calc(100vh - 200px);
    min-height: 600px;
  }</style>
