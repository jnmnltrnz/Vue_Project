<template>
  <div class="tasks-page">
    <!-- Header with Navigation -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">Tasks</h1>
            <p class="mb-0 text-muted">Manage your assigned tasks</p>
          </div>
          <div class="d-flex gap-2">
            <button 
              class="btn btn-outline-info" 
              @click="goToProjects"
            >
              <i class="bi bi-kanban me-2"></i>
              View Projects
            </button>
            <button 
              class="btn btn-outline-danger" 
              @click="logout"
              :disabled="isLoggingOut"
            >
              <span v-if="isLoggingOut" class="spinner-border spinner-border-sm me-2"></span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mt-4">
      <!-- Task Statistics -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm text-center">
            <div class="card-body">
              <div class="stats-icon mb-3">
                <i class="bi bi-list-task text-primary fs-1"></i>
              </div>
              <h4 class="text-primary mb-1">{{ totalTasks }}</h4>
              <p class="text-muted mb-0">Total Tasks</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm text-center">
            <div class="card-body">
              <div class="stats-icon mb-3">
                <i class="bi bi-play-circle text-success fs-1"></i>
              </div>
              <h4 class="text-success mb-1">{{ inProgressTasks }}</h4>
              <p class="text-muted mb-0">In Progress</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm text-center">
            <div class="card-body">
              <div class="stats-icon mb-3">
                <i class="bi bi-check-circle text-info fs-1"></i>
              </div>
              <h4 class="text-info mb-1">{{ completedTasks }}</h4>
              <p class="text-muted mb-0">Completed</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm text-center">
            <div class="card-body">
              <div class="stats-icon mb-3">
                <i class="bi bi-clock text-warning fs-1"></i>
              </div>
              <h4 class="text-warning mb-1">{{ pendingTasks }}</h4>
              <p class="text-muted mb-0">Pending</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Filters -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-outline-primary"
                    :class="{ 'btn-primary text-white': currentFilter === 'all' }"
                    @click="setFilter('all')"
                  >
                    All ({{ totalTasks }})
                  </button>
                  <button 
                    class="btn btn-outline-success"
                    :class="{ 'btn-success text-white': currentFilter === 'in-progress' }"
                    @click="setFilter('in-progress')"
                  >
                    In Progress ({{ inProgressTasks }})
                  </button>
                  <button 
                    class="btn btn-outline-info"
                    :class="{ 'btn-info text-white': currentFilter === 'completed' }"
                    @click="setFilter('completed')"
                  >
                    Completed ({{ completedTasks }})
                  </button>
                  <button 
                    class="btn btn-outline-warning"
                    :class="{ 'btn-warning text-white': currentFilter === 'pending' }"
                    @click="setFilter('pending')"
                  >
                    Pending ({{ pendingTasks }})
                  </button>
                </div>
                <div class="d-flex gap-2">
                  <select v-model="sortBy" class="form-select" style="width: auto;">
                    <option value="priority">Sort by Priority</option>
                    <option value="deadline">Sort by Deadline</option>
                    <option value="status">Sort by Status</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks List -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-list-task me-2"></i>
                My Tasks
              </h5>
            </div>
            <div class="card-body">
              <div v-if="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading tasks...</p>
              </div>
              <div v-else-if="filteredTasks.length === 0" class="text-center py-4">
                <i class="bi bi-list-task text-muted fs-1"></i>
                <p class="mt-2 text-muted">No tasks found</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Task Name</th>
                      <th>Project</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Deadline</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="task in filteredTasks" :key="task.id">
                      <td class="fw-bold">{{ task.name }}</td>
                      <td>{{ task.project }}</td>
                      <td>
                        <span class="badge" :class="getPriorityBadgeClass(task.priority)">
                          {{ task.priority }}
                        </span>
                      </td>
                      <td>
                        <span class="badge" :class="getStatusBadgeClass(task.status)">
                          {{ task.status }}
                        </span>
                      </td>
                      <td>
                        <div class="progress" style="height: 8px;">
                          <div 
                            class="progress-bar" 
                            :class="getProgressBarClass(task.progress)"
                            :style="{ width: task.progress + '%' }"
                          ></div>
                        </div>
                        <small class="text-muted">{{ task.progress }}%</small>
                      </td>
                      <td>{{ task.deadline }}</td>
                      <td>
                        <div class="btn-group" role="group">
                          <button 
                            class="btn btn-sm btn-outline-primary"
                            @click="viewTask(task.id)"
                          >
                            👁️ View
                          </button>
                          <button 
                            class="btn btn-sm btn-outline-success"
                            @click="updateTaskStatus(task.id)"
                            v-if="task.status !== 'Completed'"
                          >
                            ✅ Complete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Loading Modal -->
    <div
      :class="['modal fade', { show: isLoggingOut }]"
      tabindex="-1"
      :style="{
        display: isLoggingOut ? 'block' : 'none',
        background: isLoggingOut ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">Logging Out</h5>
          </div>
          <div class="modal-body d-flex align-items-center">
            <span class="spinner-border spinner-border-sm me-2"></span>
            <span>Please wait while we log you out...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";

export default {
  name: "TasksPage",
  data() {
    return {
      username: "",
      isLoggingOut: false,
      isLoading: false,
      currentFilter: 'all',
      sortBy: 'priority',
      totalTasks: 12,
      inProgressTasks: 5,
      completedTasks: 4,
      pendingTasks: 3,
      tasks: [
        { 
          id: 1, 
          name: "Design User Interface", 
          project: "E-commerce Platform",
          priority: "High", 
          status: "In Progress", 
          progress: 75, 
          deadline: "Jan 10, 2025" 
        },
        { 
          id: 2, 
          name: "Implement Payment Gateway", 
          project: "E-commerce Platform",
          priority: "High", 
          status: "Completed", 
          progress: 100, 
          deadline: "Jan 5, 2025" 
        },
        { 
          id: 3, 
          name: "Database Schema Design", 
          project: "Data Migration",
          priority: "Medium", 
          status: "In Progress", 
          progress: 60, 
          deadline: "Jan 15, 2025" 
        },
        { 
          id: 4, 
          name: "API Documentation", 
          project: "API Integration",
          priority: "Low", 
          status: "Pending", 
          progress: 0, 
          deadline: "Jan 20, 2025" 
        },
        { 
          id: 5, 
          name: "Mobile App Testing", 
          project: "Mobile App Development",
          priority: "Medium", 
          status: "Completed", 
          progress: 100, 
          deadline: "Dec 25, 2024" 
        },
        { 
          id: 6, 
          name: "Frontend Development", 
          project: "Website Redesign",
          priority: "High", 
          status: "In Progress", 
          progress: 45, 
          deadline: "Feb 1, 2025" 
        }
      ]
    };
  },
  computed: {
    filteredTasks() {
      let filtered = this.tasks;
      
      // Apply filter
      if (this.currentFilter !== 'all') {
        filtered = filtered.filter(task => {
          switch (this.currentFilter) {
            case 'in-progress': return task.status === 'In Progress';
            case 'completed': return task.status === 'Completed';
            case 'pending': return task.status === 'Pending';
            default: return true;
          }
        });
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'priority': {
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          case 'deadline':
            return new Date(a.deadline) - new Date(b.deadline);
          case 'status':
            return a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });
      
      return filtered;
    }
  },
  created() {
    this.username = localStorage.getItem("username") || "User";
  },
  methods: {
    setFilter(filter) {
      this.currentFilter = filter;
    },

    getProgressBarClass(progress) {
      if (progress >= 80) return 'bg-success';
      if (progress >= 60) return 'bg-info';
      if (progress >= 40) return 'bg-warning';
      return 'bg-danger';
    },
    
    getStatusBadgeClass(status) {
      switch (status) {
        case 'Completed': return 'bg-success';
        case 'In Progress': return 'bg-primary';
        case 'Pending': return 'bg-warning';
        case 'On Hold': return 'bg-secondary';
        default: return 'bg-info';
      }
    },

    getPriorityBadgeClass(priority) {
      switch (priority) {
        case 'High': return 'bg-danger';
        case 'Medium': return 'bg-warning';
        case 'Low': return 'bg-info';
        default: return 'bg-secondary';
      }
    },

    viewTask(taskId) {
      // Navigate to task detail
      console.log('Viewing task:', taskId);
    },

    updateTaskStatus(taskId) {
      // Update task status to completed
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = 'Completed';
        task.progress = 100;
        this.updateTaskCounts();
      }
    },

    updateTaskCounts() {
      this.totalTasks = this.tasks.length;
      this.inProgressTasks = this.tasks.filter(t => t.status === 'In Progress').length;
      this.completedTasks = this.tasks.filter(t => t.status === 'Completed').length;
      this.pendingTasks = this.tasks.filter(t => t.status === 'Pending').length;
    },

    goToProjects() {
      this.$router.push({ name: 'Projects' });
    },
    
    logout() {
      const username = localStorage.getItem("username");
      if (!username) {
        console.warn("No username in localStorage.");
        return;
      }

      this.isLoggingOut = true;

      AuthService.logout(username)
        .then(() => {
          setTimeout(() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            console.log("Logout success");
            this.$router.replace({ name: "Login" });
          }, 1000);
        })
        .catch((error) => {
          console.error("Logout failed:", error);
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoggingOut = false;
          }, 1000);
        });
    }
  }
};
</script>

<style scoped>
.tasks-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header-container {
  background: linear-gradient(135deg, #667eea 0%, #ffffff 100%);
  color: white;
}

.header-container h1,
.header-container p {
  color: white !important;
}

.stats-icon {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  border: none;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.progress {
  background-color: #e9ecef;
}

.badge {
  font-size: 0.75em;
  padding: 0.375rem 0.75rem;
}

.btn-group .btn {
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}
</style> 