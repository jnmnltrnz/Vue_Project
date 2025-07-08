<template>
  <div class="row mb-4">
    <div class="col-md-3 mb-3">
      <div class="card shadow-sm h-100">
        <div class="card-body text-center">
          <div class="summary-icon mb-3">
            <i class="bi bi-people text-primary fs-1"></i>
          </div>
          <h3 class="card-title text-primary">{{ totalEmployees }}</h3>
          <p class="card-text text-muted">Total Employees</p>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="card shadow-sm h-100">
        <div class="card-body text-center">
          <div class="summary-icon mb-3">
            <i class="bi bi-kanban text-success fs-1"></i>
          </div>
          <h3 class="card-title text-success">{{ totalProjects }}</h3>
          <p class="card-text text-muted">Active Projects</p>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="card shadow-sm h-100">
        <div class="card-body text-center">
          <div class="summary-icon mb-3">
            <i class="bi bi-pause-circle text-warning fs-1"></i>
          </div>
          <h3 class="card-title text-warning">{{ onHoldProjects }}</h3>
          <p class="card-text text-muted">On Hold Projects</p>
        </div>
      </div>
    </div>
    <div class="col-md-3 mb-3">
      <div class="card shadow-sm h-100">
        <div class="card-body text-center">
          <div class="summary-icon mb-3">
            <i class="bi bi-graph-up text-info fs-1"></i>
          </div>
          <h3 class="card-title text-info">{{ averageProgress }}%</h3>
          <p class="card-text text-muted">Average Progress</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SummaryCards",
  props: {
    totalEmployees: {
      type: Number,
      default: 0
    },
    totalProjects: {
      type: Number,
      default: 0
    },
    onHoldProjects: {
      type: Number,
      default: 0
    },
    averageProgress: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
.summary-icon {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
</style> 