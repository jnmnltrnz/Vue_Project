<template>
  <div class="debug-button-container">
    <button 
      class="btn btn-sm btn-outline-info debug-button"
      @click="toggleDebugger"
      title="Toggle Cache Debugger (Ctrl+Shift+D)"
    >
      <i class="bi bi-bug"></i>
      Cache Debug
    </button>
  </div>
</template>

<script>
export default {
  name: 'DebugButton',
  methods: {
    toggleDebugger() {
      // Dispatch custom event to toggle debugger
      window.dispatchEvent(new CustomEvent('toggle-cache-debugger'));
    }
  }
};
</script>

<style scoped>
.debug-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.debug-button {
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.debug-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style> 