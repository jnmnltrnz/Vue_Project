<template>
  <div class="card shadow-sm h-100">
    <div class="card-header bg-light">
      <h5 class="mb-0">
        <i class="bi bi-pie-chart me-2"></i>
        Employee Distribution by Department
      </h5>
    </div>
    <div class="card-body">
      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading employee data...</p>
      </div>
      <div v-else-if="departmentStats.length === 0" class="text-center py-4">
        <i class="bi bi-people text-muted fs-1"></i>
        <p class="mt-2 text-muted">No employee data available</p>
      </div>
      <div v-else class="department-stats">
        <div v-for="dept in departmentStats" :key="dept.name" class="dept-item d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center">
            <div class="dept-color me-3" :style="{ backgroundColor: dept.color }"></div>
            <div>
              <div class="dept-name fw-bold">{{ dept.name }}</div>
              <small class="text-muted">{{ dept.count }} employees</small>
            </div>
          </div>
          <div class="dept-percentage fw-bold">{{ dept.percentage }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmployeeDistribution",
  props: {
    departmentStats: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.dept-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.dept-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.dept-item:last-child {
  border-bottom: none;
}
</style> 