<template>
  <div class="card shadow-sm h-100">
    <div class="card-header bg-light">
      <h5 class="mb-0">
        <i class="bi bi-calendar-event me-2"></i>
        Recent Hires (Last 6 Months)
      </h5>
    </div>
    <div class="card-body">
      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading recent hires...</p>
      </div>
      <div v-else-if="recentHires.length === 0" class="text-center py-4">
        <i class="bi bi-calendar-x text-muted fs-1"></i>
        <p class="mt-2 text-muted">No recent hires in the last 6 months</p>
      </div>
      <div v-else class="recent-hires">
        <div v-for="hire in paginatedHires" :key="hire.id" class="hire-item d-flex align-items-center mb-3">
          <div class="hire-avatar me-3">
            <i class="bi bi-person-circle text-primary fs-4"></i>
          </div>
          <div class="hire-info flex-grow-1">
            <div class="hire-name fw-bold">{{ hire.name }}</div>
            <div class="hire-details text-muted">
              {{ hire.position }} • {{ hire.department }} • {{ hire.hireDate }}
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalHirePages > 1" class="d-flex justify-content-center mt-3">
          <nav aria-label="Recent hires pagination">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentHirePage === 1 }">
                <button 
                  class="page-link" 
                  @click="changeHirePage(currentHirePage - 1)"
                  :disabled="currentHirePage === 1"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              
              <li 
                v-for="page in visibleHirePages" 
                :key="page" 
                class="page-item"
                :class="{ active: page === currentHirePage }"
              >
                <button 
                  class="page-link" 
                  @click="changeHirePage(page)"
                >
                  {{ page }}
                </button>
              </li>
              
              <li class="page-item" :class="{ disabled: currentHirePage === totalHirePages }">
                <button 
                  class="page-link" 
                  @click="changeHirePage(currentHirePage + 1)"
                  :disabled="currentHirePage === totalHirePages"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        <!-- Page info -->
        <div v-if="totalHirePages > 1" class="text-center mt-2">
          <small class="text-muted">
            Showing {{ startHireIndex + 1 }}-{{ endHireIndex }} of {{ recentHires.length }} recent hires
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecentHires",
  props: {
    recentHires: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    currentHirePage: {
      type: Number,
      default: 1
    },
    hiresPerPage: {
      type: Number,
      default: 5
    }
  },
  computed: {
    paginatedHires() {
      const start = (this.currentHirePage - 1) * this.hiresPerPage;
      const end = start + this.hiresPerPage;
      return this.recentHires.slice(start, end);
    },
    
    totalHirePages() {
      return Math.ceil(this.recentHires.length / this.hiresPerPage);
    },
    
    startHireIndex() {
      return (this.currentHirePage - 1) * this.hiresPerPage;
    },
    
    endHireIndex() {
      const end = this.startHireIndex + this.hiresPerPage;
      return Math.min(end, this.recentHires.length);
    },
    
    visibleHirePages() {
      const pages = [];
      const maxVisible = 5;
      const start = Math.max(1, this.currentHirePage - Math.floor(maxVisible / 2));
      const end = Math.min(this.totalHirePages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  methods: {
    changeHirePage(page) {
      if (page >= 1 && page <= this.totalHirePages) {
        this.$emit('page-change', page);
      }
    }
  }
};
</script>

<style scoped>
.hire-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.hire-item:last-child {
  border-bottom: none;
}

.pagination {
  margin-bottom: 0;
}

.pagination .page-link {
  border: none;
  color: #6c757d;
  padding: 0.375rem 0.75rem;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  background-color: transparent;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
  color: #495057;
}

.pagination .page-item.active .page-link:hover {
  background-color: #0056b3;
  color: white;
}
</style> 