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

};</script>
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
