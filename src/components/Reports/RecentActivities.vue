<template>
  <div class="card shadow-sm h-100">
    <div class="card-header bg-light">
      <h5 class="mb-0">
        <i class="bi bi-clock-history me-2"></i>
        Recent Activities
      </h5>
    </div>
    <div class="card-body">
      <div class="activity-item d-flex align-items-center mb-3">
        <div class="activity-icon me-3">
          <i class="bi bi-check-circle text-success"></i>
        </div>
        <div class="activity-content">
          <div class="activity-text">Project Alpha completed</div>
          <small class="text-muted">{{ formatTimeAgo(projectCompletionDate) }}</small>
        </div>
      </div>
      <div class="activity-item d-flex align-items-center mb-3">
        <div class="activity-icon me-3">
          <i class="bi bi-person-plus text-primary"></i>
        </div>
        <div class="activity-content">
          <div class="activity-text">New employee hired</div>
          <small class="text-muted">{{ formatTimeAgo(newEmployeeDate) }}</small>
        </div>
      </div>
      <div class="activity-item d-flex align-items-center mb-3">
        <div class="activity-icon me-3">
          <i class="bi bi-file-earmark-text text-info"></i>
        </div>
        <div class="activity-content">
          <div class="activity-text">Monthly report generated</div>
          <small class="text-muted">{{ formatTimeAgo(reportDate) }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecentActivities",
  props: {
    projectCompletionDate: {
      type: Date,
      default: () => new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    newEmployeeDate: {
      type: Date,
      default: () => new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    reportDate: {
      type: Date,
      default: () => new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  },
  methods: {
    formatTimeAgo(date) {
      if (!date) return 'Unknown';
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
      
      return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
    }
  }
};
</script>

<style scoped>
.activity-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 