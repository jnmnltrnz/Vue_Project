<template>
  <div class="projects-page">
    <!-- Header with Navigation -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">Projects</h1>
            <p class="mb-0 text-muted">Manage your assigned projects</p>
          </div>
          <div class="d-flex gap-2">
            <button 
              class="btn btn-outline-info" 
              @click="goToTasks"
            >
              <i class="bi bi-list-task me-2"></i>
              View Tasks
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
      <!-- Project Statistics -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm text-center">
            <div class="card-body">
              <div class="stats-icon mb-3">
                <i class="bi bi-kanban text-primary fs-1"></i>
              </div>
              <h4 class="text-primary mb-1">{{ totalProjects }}</h4>
              <p class="text-muted mb-0">Total Projects</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm text-center">
            <div class="card-body">
              <div class="stats-icon mb-3">
                <i class="bi bi-play-circle text-success fs-1"></i>
              </div>
              <h4 class="text-success mb-1">{{ activeProjects }}</h4>
              <p class="text-muted mb-0">Active Projects</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm text-center">
            <div class="card-body">
              <div class="stats-icon mb-3">
                <i class="bi bi-check-circle text-info fs-1"></i>
              </div>
              <h4 class="text-info mb-1">{{ completedProjects }}</h4>
              <p class="text-muted mb-0">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects List -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-kanban me-2"></i>
                My Projects
              </h5>
            </div>
            <div class="card-body">
              <div v-if="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading projects...</p>
              </div>
              <div v-else-if="projects.length === 0" class="text-center py-4">
                <i class="bi bi-kanban text-muted fs-1"></i>
                <p class="mt-2 text-muted">No projects assigned yet</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Project Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Deadline</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="project in projects" :key="project.id">
                      <td class="fw-bold">{{ project.name }}</td>
                      <td>{{ project.description }}</td>
                      <td>
                        <span class="badge" :class="getStatusBadgeClass(project.status)">
                          {{ project.status }}
                        </span>
                      </td>
                      <td>
                        <div class="progress" style="height: 8px;">
                          <div 
                            class="progress-bar" 
                            :class="getProgressBarClass(project.progress)"
                            :style="{ width: project.progress + '%' }"
                          ></div>
                        </div>
                        <small class="text-muted">{{ project.progress }}%</small>
                      </td>
                      <td>{{ project.deadline }}</td>
                      <td>
                        <button 
                          class="btn btn-sm btn-outline-primary"
                          @click="viewProject(project.id)"
                        >
                          👁️ View
                        </button>
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
import ProjectService from "@/services/ProjectService";
import EmployeeService from "@/services/EmployeeService";

export default {
  name: "ProjectsPage",
  data() {
    return {
      username: "",
      isLoggingOut: false,
      isLoading: false,
      projects: [],
      employeeId: null,
    };
  },
  created() {
    this.username = localStorage.getItem("username") || "User";
    this.initializeUserAndLoadProjects();
  },
  methods: {
    async initializeUserAndLoadProjects() {
      try {
        // First, get all employees to find the current user's employee record
        const response = await EmployeeService.getAllEmployees();
        const employees = response.data || [];
        
        // Find the employee whose account username matches the current user
        const currentEmployee = employees.find(emp => 
          emp.account && emp.account.username === this.username
        );
        
        if (currentEmployee) {
          this.employeeId = currentEmployee.id;
          await this.loadProjects();
        } else {
          console.warn("No employee record found for current user:", this.username);
          this.projects = [];
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        this.projects = [];
      }
    },
    async loadProjects() {
      this.isLoading = true;
      if (this.employeeId) {
        try {
          const projects = await ProjectService.getProjectsByEmployee(this.employeeId);
          this.projects = projects || [];
        } catch (error) {
          console.error("Error loading projects for employee:", error);
          this.projects = [];
        }
      } else {
        this.projects = [];
      }
      this.isLoading = false;
    },
    getProgressBarClass(progress) {
      if (progress >= 80) return 'bg-success';
      if (progress >= 60) return 'bg-info';
      if (progress >= 40) return 'bg-warning';
      return 'bg-danger';
    },
    
    getStatusBadgeClass(status) {
      switch (status) {
        case 'COMPLETED':
        case 'Completed': return 'bg-success';
        case 'IN_PROGRESS':
        case 'In Progress': return 'bg-primary';
        case 'PLANNING':
        case 'Planning': return 'bg-warning';
        case 'ON_HOLD':
        case 'On Hold': return 'bg-secondary';
        default: return 'bg-info';
      }
    },

    viewProject(projectId) {
      // Navigate to project detail or task list
      this.$router.push({ name: 'Tasks', query: { project: projectId } });
    },

    goToTasks() {
      this.$router.push({ name: 'Tasks' });
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
  },
  computed: {
    totalProjects() {
      return this.projects.length;
    },
    activeProjects() {
      return this.projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'In Progress').length;
    },
    completedProjects() {
      return this.projects.filter(p => p.status === 'COMPLETED' || p.status === 'Completed').length;
    }
  }
};
</script>

<style scoped>
.projects-page {
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
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  border: none;
  transition: all 0.3s ease-in-out;
  border-radius: 12px;
  min-height: 180px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.card-body {
  padding: 2rem 1.5rem;
}

.stats-icon i {
  font-size: 3rem !important;
}

.card h4 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0;
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
</style> 