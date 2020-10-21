<template>
  <button @click.prevent="onClick" :disabled="isLoading" :class="computedButtonClass">
    <slot/>
  </button>
</template>

<script>
export default {
  model: {
    prop: 'loading',
    event: 'on-switch'
  },
  props: {
    on: {
      type: String,
      default: ''
    },
    off: {
      type: String,
      default: ''
    },
    click: {
      type: Function,
      default: () => () => {
      },
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Array, Object, String, Number, Boolean],
      default: null
    },
    noButtonClass: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      buttonIsDisabled: false,
    }
  },
  computed: {
    computedButtonClass() {
      let $class = this.noButtonClass ? "" : "button ";
      let on = this.on;
      let off = this.off;
      if (off.length && !on.length) {
        on = off;
      }
      if (this.isLoading) {
        $class += on + " is-loading";
      } else {
        $class += this.off;
      }
      return $class;
    }
  },
  mounted() {
    if (this.loading) {
      this.startLoading();
    }
  },
  methods: {
    startLoading() {
      this.isLoading = true;
      this.buttonIsDisabled = true;
    },
    stopLoading(run = undefined) {
      this.isLoading = false;
      this.buttonIsDisabled = false;
      if (run && typeof run === "function") run();
    },
    onClick() {
      if (!this.isLoading) {
        this.startLoading();
        return this.click(this, this.data);
      }
    }
  }
}
</script>