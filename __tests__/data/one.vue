<template>
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

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'ModalPreview',

    props: {
      selectedRow: {
        type: Object,
        default() {
          return null
        },
      },

      imageSource: {
        type: String,
        default() {
          return ''
        },
      },
    },

    data() {
      return {
        row: null,
      }
    },

    watch: {
      selectedRow(val) {
        this.row = val

        const el = this.$refs.txt_roll_no
        el.focus()
      },
    },

    created() {
      this.row = this.selectedRow
    },

    mounted() {
      const el = this.$refs.txt_roll_no
      el.focus()
    },

    methods: {
      closeModal() {
        this.$emit('close-modal')
        this.row = null
      },

      next() {
        this.$emit('next')
      },

      previous() {
        this.$emit('previous')
      },
    },
  })
</script>

<style lang="scss" scoped>
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
