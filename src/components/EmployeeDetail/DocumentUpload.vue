<template>
  <form @submit.prevent="handleUpload">
    <div class="mb-3">
      <label for="docUpload" class="form-label fw-semibold" style="color: #000;">
        Upload Document or Image
      </label>
      <div class="input-group">
        <input
          class="form-control"
          type="file"
          id="docUpload"
          @change="handleFileChange"
          :disabled="isUploading"
        />
        <button
          class="btn btn-primary"
          type="submit"
          :disabled="!selectedFile || isUploading"
        >
          <i class="bi bi-upload me-1"></i> Upload
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: "DocumentUpload",
  props: {
    isUploading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedFile: null
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      this.selectedFile = file || null;
      this.$emit('file-change', file);
    },
    handleUpload() {
      if (!this.selectedFile) return;
      this.$emit('upload', this.selectedFile);
    }
  }
};
</script> 