<template>
  <div
    class="modal fade"
    tabindex="-1"
    :class="{ show: isVisible }"
    :style="{
      display: isVisible ? 'block' : 'none',
      background: 'rgba(0,0,0,0.4)',
    }"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content shadow-lg">
        <div
          class="modal-header"
          :class="headerClass"
        >
          <h5 class="modal-title">
            {{ title }}
          </h5>
        </div>
        <div class="modal-body text-center">
          <div v-if="isLoading">
            <span class="spinner-border text-primary mb-2"></span>
            <p class="mt-2">{{ loadingMessage }}</p>
          </div>
          <div v-else>
            <p>{{ successMessage }}</p>
          </div>
        </div>
        <div class="modal-footer justify-content-center" v-if="!isLoading && successMessage">
          <button class="btn btn-success" @click="$emit('close')">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingModal",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "Please Wait"
    },
    loadingMessage: {
      type: String,
      default: ""
    },
    successMessage: {
      type: String,
      default: ""
    },
    headerClass: {
      type: String,
      default: "bg-info text-white"
    }
  }
};
</script> 