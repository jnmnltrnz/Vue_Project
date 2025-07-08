<template>
  <div class="d-flex justify-content-center mb-4">
    <button class="btn btn-light me-3" :disabled="page === 1" @click="$emit('prev')">
      <span aria-hidden="true" style="color: #000;">&laquo; Previous</span>
    </button>
    <span class="align-self-center mx-3" style="color: #000;">Page {{ page }} of {{ totalPages }}</span>
    <button class="btn btn-light ms-3" :disabled="page === totalPages" @click="$emit('next')">
      <span aria-hidden="true" style="color: #000;">Next &raquo;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "EmployeePagination",
  props: {
    page: Number,
    totalPages: Number
  }
};
</script>