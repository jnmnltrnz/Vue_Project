<template>
  <div class="card shadow-sm">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="bi bi-kanban me-2"></i>
        Project Management
      </h5>
      <div class="d-flex gap-2 align-items-center">
        <div class="d-flex align-items-center">
          <label class="form-label mb-0 me-2 text-muted">Filter:</label>
          <select 
            v-model="statusFilter" 
            class="form-select form-select-sm"
            style="width: auto; min-width: 140px;"
          >
            <option value="">All Status</option>
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <button 
          class="btn btn-primary btn-sm"
          @click="openProjectModal()"
        >
          <i class="bi bi-plus-circle me-2"></i>
          Add Project
        </button>
      </div>
    </div>
    <div class="card-body">
      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading projects...</p>
      </div>
      <div v-else-if="filteredProjects.length === 0" class="text-center py-4">
        <i class="bi bi-kanban text-muted fs-1"></i>
        <p class="mt-2 text-muted">
          {{ statusFilter ? `No ${getStatusLabel(statusFilter)} projects available` : 'No projects available' }}
        </p>
        <button 
          class="btn btn-primary"
          @click="openProjectModal()"
        >
          <i class="bi bi-plus-circle me-2"></i>
          Create First Project
        </button>
      </div>
      <div v-else>
        <div class="table-container">
          <table class="table table-hover fixed-table">
            <thead class="table-light">
              <tr>
                <th class="project-name-col">Project Name</th>
                <th class="manager-col">Manager</th>
                <th class="team-size-col">Team Allocation</th>
                <th class="assigned-col">Assigned</th>
                <th class="progress-col">Progress</th>
                <th class="status-col">Status</th>
                <th class="deadline-col">Deadline</th>
                <th class="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in paginatedProjects" :key="project.id">
                <td class="fw-bold">{{ project.name }}</td>
                <td>{{ project.manager }}</td>
                <td>{{ project.teamSize || 0 }} members</td>
                <td>{{ project.assignedEmployees ? project.assignedEmployees.length : 0 }}</td>
                <td>
                  <div class="progress" style="height: 8px;">
                    <div 
                      class="progress-bar" 
                      :class="getProgressBarClass(project.progress)"
                      :style="{ width: (project.progress || 0) + '%' }"
                    ></div>
                  </div>
                  <small class="text-muted">{{ project.progress || 0 }}%</small>
                </td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(project.status)">
                    {{ getStatusLabel(project.status) }}
                  </span>
                </td>
                <td>
                  <span :class="{ 'text-danger': isOverdue(project.deadline), 'text-warning': isDueSoon(project.deadline) }">
                    {{ formatDeadline(project.deadline) }}
                  </span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button 
                      class="btn btn-sm btn-outline-primary"
                      title="Edit Project"
                      @click="openProjectModal(project)"
                    >
                      ✏️
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-info"
                      title="Assign Employees"
                      @click="openAssignModal(project)"
                    >
                      👥
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger"
                      title="Delete Project"
                      @click="deleteProject(project.id)"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Empty rows to maintain consistent height -->
              <tr v-for="i in (10 - paginatedProjects.length)" :key="`empty-${i}`" class="empty-row">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div class="text-muted">
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredProjects.length }} projects
          </div>
          <nav aria-label="Project pagination">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 || totalPages === 0 }">
                <button 
                  class="page-link" 
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1 || totalPages === 0"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              
              <template v-if="totalPages > 0">
                <li 
                  v-for="page in visiblePages" 
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button 
                    class="page-link" 
                    @click="changePage(page)"
                  >
                    {{ page }}
                  </button>
                </li>
              </template>
              
              <li v-if="totalPages === 0" class="page-item disabled">
                <span class="page-link">1</span>
              </li>
              
              <li class="page-item" :class="{ disabled: currentPage === totalPages || totalPages === 0 }">
                <button 
                  class="page-link" 
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages || totalPages === 0"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectService from "@/services/ProjectService";

export default {
  name: "ProjectManagement",
  props: {
    projects: {
      type: Array,
      default: () => []
    },
    employees: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isLoadingEmployees: {
      type: Boolean,
      default: false
    },
    isSavingProject: {
      type: Boolean,
      default: false
    },
    isSavingAssignments: {
      type: Boolean,
      default: false
    },
    editingProject: {
      type: Object,
      default: null
    },
    selectedProject: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      statusFilter: "",
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    filteredProjects() {
      if (!this.statusFilter) {
        return this.projects;
      }
      return this.projects.filter(project => project.status === this.statusFilter);
    },
    
    totalPages() {
      return Math.ceil(this.filteredProjects.length / this.itemsPerPage);
    },
    
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    
    endIndex() {
      const end = this.startIndex + this.itemsPerPage;
      return Math.min(end, this.filteredProjects.length);
    },
    
    paginatedProjects() {
      const start = this.startIndex;
      const end = start + this.itemsPerPage;
      return this.filteredProjects.slice(start, end);
    },
    
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  watch: {
    statusFilter() {
      this.currentPage = 1; // Reset to first page when filter changes
    }
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    
    getProgressBarClass(progress) {
      const color = ProjectService.getProgressColor(progress || 0);
      return `bg-${color}`;
    },
    
    getStatusBadgeClass(status) {
      const color = ProjectService.getStatusColor(status);
      return `bg-${color}`;
    },

    getStatusLabel(status) {
      return ProjectService.getStatusLabel(status);
    },

    formatDeadline(deadline) {
      return ProjectService.formatDeadline(deadline);
    },

    isOverdue(deadline) {
      return ProjectService.isOverdue(deadline);
    },

    isDueSoon(deadline) {
      return ProjectService.isDueSoon(deadline);
    },

    openProjectModal(project = null) {
      this.$emit('open-project-modal', project);
    },

    closeProjectModal() {
      this.$emit('close-project-modal');
    },

    saveProject(projectData) {
      this.$emit('save-project', projectData);
    },

    deleteProject(projectId) {
      this.$emit('delete-project', projectId);
    },

    openAssignModal(project) {
      this.$emit('open-assign-modal', project);
    },

    closeAssignModal() {
      this.$emit('close-assign-modal');
    },

    saveAssignments(assignments) {
      this.$emit('save-assignments', assignments);
    }
  }
};
</script>

<style scoped>
.table-container {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background-color: #ffffff;
}

.fixed-table {
  width: 100%;
  table-layout: fixed;
  margin-bottom: 0;
}

.fixed-table thead {
  background-color: #f8f9fa;
}

.fixed-table th,
.fixed-table td {
  padding: 0.75rem;
  vertical-align: middle;
  border-bottom: 1px solid #dee2e6;
}

/* Column widths */
.project-name-col {
  width: 20%;
}

.manager-col {
  width: 15%;
}

.team-size-col {
  width: 10%;
}

.assigned-col {
  width: 10%;
}

.progress-col {
  width: 15%;
}

.status-col {
  width: 12%;
}

.deadline-col {
  width: 15%;
}

.actions-col {
  width: 13%;
}

/* Empty row styling */
.empty-row {
  background-color: transparent;
}

.empty-row td {
  border-bottom: 1px solid #dee2e6;
}

.progress {
  background-color: #e9ecef;
}

.badge {
  font-size: 0.75em;
  padding: 0.375rem 0.75rem;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.form-select-sm {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .fixed-table th,
  .fixed-table td {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 576px) {
  .fixed-table th,
  .fixed-table td {
    padding: 0.375rem;
    font-size: 0.8rem;
  }
}
</style> 