<template>
  <div v-if="documents.length" class="mt-4">
    <h6 class="fw-semibold mb-3"  style="color: #000;">Uploaded Documents</h6>
    <ul class="list-group list-group-flush">
      <li
        v-for="(doc, idx) in documents"
        :key="doc.id"
        class="list-group-item d-flex justify-content-between align-items-center py-3"
      >
        <div class="d-flex align-items-center flex-grow-1">
          <span v-if="doc.fileType?.startsWith('image/')" class="me-3">
            <img
              :src="getDownloadUrl(doc.id)"
              alt="doc"
              class="rounded border"
              style="max-width: 100px; max-height: 60px"
            />
          </span>

          <span
            v-else
            class="me-3 d-flex align-items-center justify-content-center bg-light rounded"
            style="width: 100px; height: 60px"
          >
            <i class="bi bi-file-earmark-text fs-3 text-muted"></i>
          </span>

          <div class="text-truncate" style="max-width: 400px">
            <span class="badge bg-secondary me-2">{{ getFileType(doc.fileName) }}</span>
            <a
              :href="getDownloadUrl(doc.id)"
              target="_blank"
              class="text-decoration-none text-dark"
              >{{ doc.fileName }}</a
            >
          </div>
        </div>
        <div class="d-flex align-items-center me-3">
          <button
            class="btn btn-sm btn-outline-danger"
            @click="handleRemove(idx)"
            :disabled="isUploading"
          >
            <i class="bi bi-trash"></i> Remove
          </button>
        </div>
      </li>
    </ul>
  </div>
  <div v-else class="text-muted mt-3">No documents uploaded yet.</div>
</template>

<script>
export default {
  name: "DocumentList",
  props: {
    documents: {
      type: Array,
      default: () => []
    },
    isUploading: {
      type: Boolean,
      default: false
    },
    baseUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    getFileExtension(fileName) {
      if (!fileName) return "";
      const parts = fileName.split(".");
      return parts.length > 1 ? "." + parts.pop() : "";
    },
    getFileType(fileName) {
      if (!fileName) return "Unknown";
      const extension = this.getFileExtension(fileName).toLowerCase();
      
      const fileTypes = {
        '.pdf': 'PDF',
        '.doc': 'DOC',
        '.docx': 'DOCX',
        '.txt': 'TXT',
        '.jpg': 'JPG',
        '.jpeg': 'JPEG',
        '.png': 'PNG',
        '.gif': 'GIF',
        '.bmp': 'BMP',
        '.xls': 'XLS',
        '.xlsx': 'XLSX',
        '.ppt': 'PPT',
        '.pptx': 'PPTX',
        '.zip': 'ZIP',
        '.rar': 'RAR',
        '.mp4': 'MP4',
        '.mp3': 'MP3',
        '.avi': 'AVI',
        '.mov': 'MOV'
      };
      
      return fileTypes[extension] || extension.substring(1).toUpperCase() || 'Unknown';
    },
    getDownloadUrl(documentId) {
      return `${this.baseUrl}/documents/${documentId}/download`;
    },
    handleRemove(idx) {
      this.$emit('remove', idx);
    }
  }
};
</script>

<style scoped>
img {
  object-fit: cover;
}
</style> 