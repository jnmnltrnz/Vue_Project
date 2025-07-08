<template>
  <div class="modal-backdrop">
    <div class="modal-dialog animate-modal">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title d-flex align-items-center">
            <span class="me-2">&#9888;</span> Confirm Deletion
          </h5>
        </div>

        <div class="modal-body">
          <p>Are you sure you want to delete this employee?</p>
          <p class="text-muted mb-0">
            All associated documents will be permanently removed.
          </p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('cancel')">
            Cancel
          </button>
          <button class="btn btn-danger" @click="$emit('confirm')">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmployeeModal",
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-dialog {
  background: #fff;
  border-radius: 8px;
  min-width: 340px;
  max-width: 95%;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 1rem 1.25rem;
}

.modal-footer {
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #dee2e6;
}

.animate-modal {
  animation: fadeInUp 0.25s ease-out;
}

@keyframes fadeInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
