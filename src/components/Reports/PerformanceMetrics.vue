<template>
  <div class="card shadow-sm h-100">
    <div class="card-header bg-light">
      <h5 class="mb-0">
        <i class="bi bi-speedometer2 me-2"></i>
        Performance Metrics
      </h5>
    </div>
    <div class="card-body">
      <div class="metric-item d-flex justify-content-between align-items-center mb-3">
        <span>Average Project Duration</span>
        <span class="fw-bold text-primary">45 days</span>
      </div>
      <div class="metric-item d-flex justify-content-between align-items-center mb-3">
        <span>Employee Satisfaction</span>
        <span class="fw-bold text-success">4.2/5.0</span>
      </div>
      <div class="metric-item d-flex justify-content-between align-items-center mb-3">
        <span>Client Satisfaction</span>
        <span class="fw-bold text-info">4.5/5.0</span>
      </div>
      <div class="metric-item d-flex justify-content-between align-items-center mb-3">
        <span>Budget Utilization</span>
        <span class="fw-bold text-warning">87%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PerformanceMetrics"
};
</script>

<style scoped>
.metric-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.metric-item:last-child {
  border-bottom: none;
}
</style> 