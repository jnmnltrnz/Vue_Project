<template>
  <div class="reports-page">
    <!-- Header with Navigation -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">Project and Reports</h1>
            <p class="mb-0 text-muted">Employee and project insights</p>
          </div>
          <div class="d-flex gap-2">
            <button
            class="btn btn-outline-primary"
            @click="$router.push({ name: 'CompanyDashboard' })"
          >
            <i class="bi bi-arrow-left me-2"></i>
            Back to Dashboard
          </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mt-4">
        
      
      <!-- Summary Cards -->
      <SummaryCards 
        :total-employees="totalEmployees"
        :total-projects="activeProjectsCount"
        :on-hold-projects="onHoldProjectsCount"
        :average-progress="averageProjectProgress"
      />

      <!-- Project Management -->
      <div class="row mb-4">
        <div class="col-12">
          <!-- Error Alert -->
          <div v-if="projectError" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ projectError }}
            <div class="mt-2">
              <button type="button" class="btn btn-outline-danger btn-sm me-2" @click="loadProjects">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Retry
              </button>
              <button type="button" class="btn-close" @click="projectError = null"></button>
            </div>
          </div>
          
          <ProjectManagement 
            :projects="projects"
            :employees="employees"
            :is-loading="isLoadingProjects"
            :is-loading-employees="isLoadingEmployees"
            :is-saving-project="isSavingProject"
            :is-saving-assignments="isSavingAssignments"
            :editing-project="editingProject"
            :selected-project="selectedProject"
            @open-project-modal="openProjectModal"
            @close-project-modal="closeProjectModal"
            @save-project="saveProject"
            @delete-project="deleteProject"
            @open-assign-modal="openAssignModal"
            @close-assign-modal="closeAssignModal"
            @save-assignments="saveAssignments"
          />
        </div>
      </div>

      <!-- Employee Statistics -->
      <div class="row mb-4">
        <div class="col-md-6 mb-4">
          <EmployeeDistribution 
            :department-stats="departmentStats"
            :is-loading="isLoadingEmployees"
          />
        </div>
        <div class="col-md-6 mb-4">
          <RecentHires 
            :recent-hires="recentHires"
            :is-loading="isLoadingEmployees"
            :current-hire-page="currentHirePage"
            :hires-per-page="hiresPerPage"
            @page-change="changeHirePage"
          />
        </div>
      </div>

      
    </div>

    <!-- Project Modal -->
    <div
      :class="['modal fade', { show: showProjectModal }]"
      tabindex="-1"
      :style="{
        display: showProjectModal ? 'block' : 'none',
        background: showProjectModal ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-kanban me-2"></i>
              {{ editingProject ? 'Edit Project' : 'Add New Project' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeProjectModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSaveProject">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Project Name *</label>
                  <input 
                    v-model="projectForm.name" 
                    type="text" 
                    class="form-control" 
                    required
                    placeholder="Enter project name"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Manager *</label>
                  <input 
                    v-model="projectForm.manager" 
                    type="text" 
                    class="form-control" 
                    required
                    placeholder="Enter manager name"
                  >
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status</label>
                  <select v-model="projectForm.status" class="form-select" @change="handleProjectStatusChange">
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Progress (%)</label>
                  <input 
                    v-model.number="projectForm.progress" 
                    type="number" 
                    class="form-control" 
                    min="0" 
                    max="100"
                    placeholder="0-100"
                    @change="handleProjectProgressChange"
                  >
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Deadline</label>
                  <input 
                    v-model="projectForm.deadline" 
                    type="date" 
                    class="form-control"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Team Size</label>
                  <input 
                    v-model.number="projectForm.teamSize" 
                    type="number" 
                    class="form-control" 
                    min="1"
                    placeholder="Number of team members"
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea 
                  v-model="projectForm.description" 
                  class="form-control" 
                  rows="3"
                  placeholder="Enter project description"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeProjectModal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="handleSaveProject"
              :disabled="isSavingProject"
            >
              <span v-if="isSavingProject" class="spinner-border spinner-border-sm me-2"></span>
              {{ editingProject ? 'Update Project' : 'Create Project' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Employees Modal -->
    <div
      :class="['modal fade', { show: showAssignModal }]"
      tabindex="-1"
      :style="{
        display: showAssignModal ? 'block' : 'none',
        background: showAssignModal ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">
              <i class="bi bi-people me-2"></i>
              Assign Employees to {{ selectedProject?.name }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeAssignModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="isLoadingEmployees" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Loading employees...</p>
            </div>
            <div v-else>
              <div class="mb-3">
                <input 
                  v-model="employeeSearch" 
                  type="text" 
                  class="form-control" 
                  placeholder="Search employees..."
                >
              </div>
              <div class="row">
                <div class="col-md-6">
                  <h6>
                    Available Employees
                    <span v-if="assignedEmployees.length >= selectedProject?.teamSize" class="badge bg-warning ms-2">
                      Team Full
                    </span>
                  </h6>
                  <div class="list-group" style="max-height: 300px; overflow-y: auto;">
                    <div 
                      v-for="employee in availableEmployees" 
                      :key="employee.id"
                      class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      :class="{ 'opacity-50': assignedEmployees.length >= selectedProject?.teamSize }"
                      @click="assignedEmployees.length < selectedProject?.teamSize && assignEmployee(employee)"
                    >
                      <div>
                        <strong>{{ employee.firstName }} {{ employee.lastName }}</strong>
                        <br>
                        <small class="text-muted">{{ employee.position }} • {{ employee.department }}</small>
                      </div>
                      <button 
                        class="btn btn-sm btn-outline-primary"
                        :disabled="assignedEmployees.length >= selectedProject?.teamSize"
                        :title="assignedEmployees.length >= selectedProject?.teamSize ? 'Team is full' : 'Add to team'"
                      >
                        ➕
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <h6>
                    Assigned Employees 
                    <span class="badge bg-info ms-2">
                      {{ assignedEmployees.length }}/{{ selectedProject?.teamSize || 0 }}
                    </span>
                  </h6>
                  <div class="list-group" style="max-height: 300px; overflow-y: auto;">
                    <div 
                      v-for="employee in assignedEmployees" 
                      :key="employee.id"
                      class="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{{ employee.firstName }} {{ employee.lastName }}</strong>
                        <br>
                        <small class="text-muted">{{ employee.position }} • {{ employee.department }}</small>
                      </div>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        @click="unassignEmployee(employee)"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAssignModal">Close</button>
            <button 
              type="button" 
              class="btn btn-info" 
              @click="handleSaveAssignments"
              :disabled="isSavingAssignments"
            >
              <span v-if="isSavingAssignments" class="spinner-border spinner-border-sm me-2"></span>
              Save Assignments
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeCache from "@/services/EmployeeCache";
import EmployeeService from "@/services/EmployeeService";
import ProjectService from "@/services/ProjectService";
import ProjectCache from "@/services/ProjectCache";
import SummaryCards from "@/components/Reports/SummaryCards.vue";
import EmployeeDistribution from "@/components/Reports/EmployeeDistribution.vue";
import RecentHires from "@/components/Reports/RecentHires.vue";
import ProjectManagement from "@/components/Reports/ProjectManagement.vue";

export default {
  name: "ReportsPage",
  components: {
    SummaryCards,
    EmployeeDistribution,
    RecentHires,
    ProjectManagement
  },
  data() {
    return {
      username: "",
      isLoggingOut: false,
      isLoadingEmployees: false,
      totalEmployees: 0,
      departmentStats: [],
      recentHires: [],
      currentHirePage: 1,
      hiresPerPage: 5,
      projectCompletionDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      newEmployeeDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      reportDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      // Project management
      showProjectModal: false,
      showAssignModal: false,
      isLoadingProjects: false,
      isSavingProject: false,
      isSavingAssignments: false,
      editingProject: null,
      selectedProject: null,
      employeeSearch: "",
      assignedEmployees: [],
      projectForm: {
        name: "",
        manager: "",
        status: "PLANNING",
        progress: 0,
        deadline: "",
        teamSize: 1,
        description: ""
      },
      projects: [],
      projectError: null
    };
  },
  computed: {
    employees() {
      return EmployeeCache.getAllEmployees() || [];
    },
    
    completedProjectsCount() {
      return this.projects.filter(project => project.status === 'COMPLETED').length;
    },
    
    onHoldProjectsCount() {
      return this.projects.filter(project => project.status === 'ON_HOLD').length;
    },
    
    activeProjectsCount() {
      return this.projects.filter(project => 
        project.status === 'PLANNING' || project.status === 'IN_PROGRESS'
      ).length;
    },
    
    averageProjectProgress() {
      if (this.projects.length === 0) return 0;
      const totalProgress = this.projects.reduce((sum, project) => sum + (project.progress || 0), 0);
      return Math.round(totalProgress / this.projects.length);
    },

    availableEmployees() {
      if (!this.employees || this.employees.length === 0) return [];
      // Use string comparison for all IDs to ensure type consistency
      const sessionAssignedIds = this.assignedEmployees.map(emp => String(emp.id));
      const allAssignedEmployeeIds = this.projects
        .filter(project => project.id !== this.selectedProject?.id)
        .flatMap(project => project.assignedEmployees || [])
        .map(emp => String(emp.id));

      let filtered = this.employees.filter(emp => {
        const idStr = String(emp.id);
        // Only exclude if in current session's assignedEmployees or assigned to another project
        return (
          !sessionAssignedIds.includes(idStr) &&
          !allAssignedEmployeeIds.includes(idStr)
        );
      });

      if (this.employeeSearch) {
        const search = this.employeeSearch.toLowerCase();
        filtered = filtered.filter(emp => 
          emp.firstName.toLowerCase().includes(search) ||
          emp.lastName.toLowerCase().includes(search) ||
          emp.department?.toLowerCase().includes(search) ||
          emp.position?.toLowerCase().includes(search)
        );
      }
      return filtered;
    }
  },
  
  created() {
    this.username = localStorage.getItem("username") || "User";
    this.loadEmployees();
    this.loadProjects();
  },
  
  methods: {
    // Load projects from API
    async loadProjects() {
      this.isLoadingProjects = true;
      this.projectError = null;
      
      // Use cache if available
      if (ProjectCache.hasAllProjects()) {
        this.projects = ProjectCache.getAllProjects();
        this.isLoadingProjects = false;
        return;
      }

      try {
        const response = await ProjectService.getAllProjects();
        this.projects = response || [];
        ProjectCache.setAllProjects(this.projects);
        ProjectCache.updateLastFetch();
      } catch (error) {
        console.error("Error loading projects:", error);
        this.projectError = "Failed to load projects. Please try again.";
        this.projects = [];
        ProjectCache.clear();
      } finally {
        this.isLoadingProjects = false;
      }
    },

    loadEmployees() {
      // Check cache first
      if (EmployeeCache.hasAllEmployees()) {
        const employees = EmployeeCache.getAllEmployees();
        this.processEmployeeData(employees);
        return;
      }

      this.isLoadingEmployees = true;
      EmployeeService.getAllEmployees()
        .then((response) => {
          const employees = response.data.data; // Access the data property of ApiResponse
          EmployeeCache.setAllEmployees(employees);
          EmployeeCache.updateLastFetch();
          this.processEmployeeData(employees);
        })
        .catch((error) => {
          console.error("There was an error fetching the employees!", error);
          this.departmentStats = [];
          this.totalEmployees = 0;
        })
        .finally(() => {
          this.isLoadingEmployees = false;
        });
    },

    processEmployeeData(employees) {
      // Ensure employees is an array
      if (!employees || !Array.isArray(employees)) {
        console.warn('Employees is not an array:', employees);
        this.totalEmployees = 0;
        this.departmentStats = [];
        this.recentHires = [];
        return;
      }
      
      this.totalEmployees = employees.length;
      
      // Group employees by department
      const departmentCounts = {};
      const departmentColors = {
        'IT': '#007bff',
        'HR': '#28a745', 
        'Finance': '#ffc107',
        'Marketing': '#dc3545',
        'Sales': '#6f42c1',
        'Operations': '#fd7e14',
        'Engineering': '#17a2b8',
        'Design': '#e83e8c',
        'Support': '#6c757d',
        'Management': '#343a40'
      };

      employees.forEach(employee => {
        const dept = employee.department || 'Unassigned';
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
      });

      // Convert to array format for display
      this.departmentStats = Object.entries(departmentCounts).map(([dept, count]) => ({
        name: dept,
        count: count,
        percentage: Math.round((count / this.totalEmployees) * 100),
        color: departmentColors[dept] || '#6c757d' // Default color for unknown departments
      })).sort((a, b) => b.count - a.count); // Sort by count descending

      // Process recent hires (last 6 months)
      this.processRecentHires(employees);
    },

    processRecentHires(employees) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const recentHires = employees
        .filter(employee => {
          if (!employee.hireDate) return false;
          const hireDate = new Date(employee.hireDate);
          // Include hires from last 6 months AND future hires (planned hires)
          return hireDate >= sixMonthsAgo || hireDate > new Date();
        })
        .map(employee => ({
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          position: employee.position || 'Not specified',
          department: employee.department || 'Unassigned',
          originalHireDate: employee.hireDate, // Keep original date for sorting
          hireDate: this.formatHireDate(employee.hireDate)
        }))
        .sort((a, b) => new Date(b.originalHireDate) - new Date(a.originalHireDate)); // Sort by original hire date descending (latest first)

      this.recentHires = recentHires;   
    },

    formatHireDate(hireDateString) {
      if (!hireDateString) return 'Unknown';
      
      // Simple date parsing - just use the date part if it's a datetime string
      let dateString = hireDateString;
      if (typeof hireDateString === 'string' && hireDateString.includes(' ')) {
        // Extract just the date part (before the space)
        dateString = hireDateString.split(' ')[0];
      }
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffTime = now - date;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Handle future dates (planned hires)
      if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        if (absDays === 1) return 'Tomorrow';
        if (absDays < 7) return `In ${absDays} days`;
        if (absDays < 30) return `In ${Math.floor(absDays / 7)} weeks`;
        if (absDays < 365) return `In ${Math.floor(absDays / 30)} months`;
        return `In ${Math.floor(absDays / 365)} years`;
      }
      
      // Handle past dates (actual hires)
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    },

    changeHirePage(page) {
      if (page >= 1 && page <= Math.ceil(this.recentHires.length / this.hiresPerPage)) {
        this.currentHirePage = page;
      }
    },

    // Project Management Methods
    openProjectModal(project = null) {
      this.editingProject = project;
      if (project) {
        // Edit mode - populate form
        this.projectForm = {
          name: project.name,
          manager: project.manager,
          status: project.status || 'PLANNING',
          progress: project.progress || 0,
          deadline: project.deadline,
          teamSize: project.teamSize || 1,
          description: project.description || ""
        };
      } else {
        // Add mode - reset form
        this.projectForm = {
          name: "",
          manager: "",
          status: "PLANNING",
          progress: 0,
          deadline: "",
          teamSize: 1,
          description: ""
        };
      }
      this.showProjectModal = true;
    },

    closeProjectModal() {
      this.showProjectModal = false;
      this.editingProject = null;
      this.projectForm = {
        name: "",
        manager: "",
        status: "PLANNING",
        progress: 0,
        deadline: "",
        teamSize: 1,
        description: ""
      };
    },

    async handleSaveProject() {
      // Validate project data
      const errors = ProjectService.validateProjectData(this.projectForm);
      if (errors.length > 0) {
        alert("Please fix the following errors:\n" + errors.join('\n'));
        return;
      }

      this.isSavingProject = true;

      try {
        const projectData = ProjectService.formatProjectData(this.projectForm);
        
        if (this.editingProject) {
          // Update existing project
          const response = await ProjectService.updateProject(this.editingProject.id, projectData);
          const index = this.projects.findIndex(p => p.id === this.editingProject.id);
          if (index !== -1) {
            this.projects[index] = response;
            ProjectCache.updateProject(this.projects[index]);
          }
        } else {
          // Create new project
          const response = await ProjectService.createProject(projectData);
          this.projects.push(response);
          ProjectCache.addProject(response);
        }

        this.closeProjectModal();
      } catch (error) {
        console.error("Error saving project:", error);
        alert("Failed to save project. Please try again.");
      } finally {
        this.isSavingProject = false;
      }
    },

    saveProject() {
      // This method is called by the ProjectManagement component
      // but we handle the actual saving in handleSaveProject
      this.handleSaveProject();
    },

    async deleteProject(projectId) {
      if (confirm("Are you sure you want to delete this project?")) {
        try {
          await ProjectService.deleteProject(projectId);
          const index = this.projects.findIndex(p => p.id === projectId);
          if (index !== -1) {
            this.projects.splice(index, 1);
            ProjectCache.deleteProject(projectId);
          }
        } catch (error) {
          console.error("Error deleting project:", error);
          alert("Failed to delete project. Please try again.");
        }
      }
    },

    openAssignModal(project) {
      this.selectedProject = project;
      // Initialize with currently assigned employees from the project
      this.assignedEmployees = project.assignedEmployees ? [...project.assignedEmployees] : [];
      this.employeeSearch = "";
      this.showAssignModal = true;
    },

    closeAssignModal() {
      this.showAssignModal = false;
      this.selectedProject = null;
      this.assignedEmployees = [];
      this.employeeSearch = "";
    },

    assignEmployee(employee) {
      if (!this.assignedEmployees.find(emp => emp.id === employee.id)) {
        // Check if we've reached the team size limit
        if (this.assignedEmployees.length >= this.selectedProject.teamSize) {
          alert(`Cannot assign more employees. Team size limit is ${this.selectedProject.teamSize} members.`);
          return;
        }
        this.assignedEmployees.push(employee);
      }
    },

    unassignEmployee(employee) {
      const index = this.assignedEmployees.findIndex(emp => emp.id === employee.id);
      if (index !== -1) {
        this.assignedEmployees.splice(index, 1);
      }
    },

    async handleSaveAssignments() {
      if (!this.selectedProject) return;

      this.isSavingAssignments = true;

      try {
        const employeeIds = this.assignedEmployees.map(emp => emp.id);
        
        // Send the complete list of employee IDs to assign
        const response = await ProjectService.assignEmployeesToProject(this.selectedProject.id, employeeIds);
        
        // Update the project with the response from the server
        const projectIndex = this.projects.findIndex(p => p.id === this.selectedProject.id);
        if (projectIndex !== -1) {
          const updatedProject = response;
          this.projects[projectIndex] = updatedProject;
          
          // Let the backend control the team size based on actual assigned employees
          ProjectCache.updateProject(updatedProject);
        }

        this.closeAssignModal();
      } catch (error) {
        console.error("Error saving assignments:", error);
        alert("Failed to save assignments. Please try again.");
      } finally {
        this.isSavingAssignments = false;
      }
    },
    saveAssignments() {
      // This method is called by the ProjectManagement component
      // but we handle the actual saving in handleSaveAssignments
      this.handleSaveAssignments();
    },

    handleProjectStatusChange() {
      // Auto-sync progress based on project status change
      switch (this.projectForm.status) {
        case 'COMPLETED':
          this.projectForm.progress = 100;
          break;
        case 'IN_PROGRESS':
          // Only set to 25% if current progress is 0
          if (this.projectForm.progress === 0) {
            this.projectForm.progress = 25;
          }
          break;
        case 'PLANNING':
          // Reset progress to 0 only if it was completed
          if (this.projectForm.progress === 100) {
            this.projectForm.progress = 0;
          }
          break;
        case 'ON_HOLD':
          // Keep current progress when putting on hold
          break;
      }
    },

    handleProjectProgressChange() {
      // Auto-sync status based on project progress change
      if (this.projectForm.progress >= 100) {
        this.projectForm.status = 'COMPLETED';
      } else if (this.projectForm.progress > 0) {
        this.projectForm.status = 'IN_PROGRESS';
      } else if (this.projectForm.progress === 0) {
        this.projectForm.status = 'PLANNING';
      }
      // Note: ON_HOLD status is preserved regardless of progress
    }
  }
};
</script>

<style scoped>
.reports-page {
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
</style> 