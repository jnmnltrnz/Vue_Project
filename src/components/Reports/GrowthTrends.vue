<template>
  <div class="card shadow-sm h-100">
    <div class="card-header bg-light">
      <h5 class="mb-0">
        <i class="bi bi-trending-up me-2"></i>
        Growth Trends
      </h5>
    </div>
    <div class="card-body">
      <div class="trend-item d-flex justify-content-between align-items-center mb-3">
        <span>Employee Growth</span>
        <span class="fw-bold text-success">+12%</span>
      </div>
      <div class="trend-item d-flex justify-content-between align-items-center mb-3">
        <span>Revenue Growth</span>
        <span class="fw-bold text-primary">+18%</span>
      </div>
      <div class="trend-item d-flex justify-content-between align-items-center mb-3">
        <span>Project Completion</span>
        <span class="fw-bold text-info">+8%</span>
      </div>
      <div class="trend-item d-flex justify-content-between align-items-center mb-3">
        <span>Client Retention</span>
        <span class="fw-bold text-success">+15%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GrowthTrends"
};
</script>

<style scoped>
.trend-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.trend-item:last-child {
  border-bottom: none;
}
</style> 