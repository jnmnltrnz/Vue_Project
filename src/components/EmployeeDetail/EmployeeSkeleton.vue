<template>
  <div>
    <!-- Employee Details Skeleton -->
    <div v-if="type === 'details'" class="row mb-3">
      <div class="col-sm-3">
        <div class="skeleton-label"></div>
      </div>
      <div class="col-sm-9">
        <div class="skeleton-content"></div>
      </div>
    </div>

    <!-- Document List Skeleton -->
    <div v-if="type === 'document'" class="list-group-item d-flex justify-content-between align-items-center py-3">
      <div class="d-flex align-items-center flex-grow-1">
        <div class="skeleton-image me-3"></div>
        <div class="flex-grow-1">
          <div class="skeleton-badge mb-2"></div>
          <div class="skeleton-text"></div>
        </div>
      </div>
      <div class="skeleton-button"></div>
    </div>

    <!-- Table Row Skeleton -->
    <template v-if="type === 'table-row'">
      <tr v-for="n in count" :key="'skeleton-' + n">
        <td><div class="skeleton-cell"></div></td>
        <td><div class="skeleton-cell"></div></td>
        <td><div class="skeleton-cell"></div></td>
        <td><div class="skeleton-cell"></div></td>
        <td style="text-align: center"><div class="skeleton-actions"></div></td>
      </tr>
    </template>
  </div>
</template>

<script>
export default {
  name: "EmployeeSkeleton",
  props: {
    type: {
      type: String,
      default: "details",
      validator: (value) => ["details", "document", "table-row"].includes(value)
    },
    count: {
      type: Number,
      default: 1
    }
  }
};
</script>

<style scoped>
/* Skeleton Loader Styles */
.skeleton-label {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  width: 60px;
}

.skeleton-content {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  width: 200px;
}

.skeleton-image {
  width: 100px;
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-badge {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
  width: 50px;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  width: 250px;
}

.skeleton-button {
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 6px;
  width: 80px;
}

.skeleton-cell {
  height: 48px; /* Match your table row height */
  width: 100%;  /* Fill the cell */
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-actions {
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 6px;
  width: 120px;
  margin: 0 auto;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style> 