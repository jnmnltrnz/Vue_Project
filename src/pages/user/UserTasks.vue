<template>
  <div class="tasks-page">
    <!-- Header with Navigation -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">
              {{ currentProject ? `${currentProject.name} - My Tasks` : 'My Tasks' }}
            </h1>
            <p class="mb-0 text-muted">
              {{ currentProject ? `View and update your tasks for ${currentProject.name}` : 'View and update your assigned tasks' }}
            </p>
          </div>
          <div class="d-flex gap-2">
            <button
            class="btn btn-outline-primary"
            @click="$router.push({ name: 'Reports' })"
          >
            <i class="bi bi-arrow-left me-2"></i>
            Back
          </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mt-4">
      <!-- Task Statistics -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-people me-2"></i>
                Team Members & Task Assignments
              </h5>
            </div>
            <div class="card-body">
              <div v-if="getTeamMembers().length === 0" class="text-center py-3">
                <i class="bi bi-people text-muted fs-1"></i>
                <p class="text-muted mt-2">No team members found</p>
              </div>
              <div v-else class="row">
                <div 
                  v-for="member in getTeamMembers()" 
                  :key="member.id"
                  class="col-md-6 col-lg-4 mb-3"
                >
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                      <div class="d-flex align-items-center mb-3">
                        <div class="avatar me-3">
                          <img 
                            v-if="employeeProfileImages[member.id] && employeeProfileImages[member.id] !== null" 
                            :src="employeeProfileImages[member.id]" 
                            :alt="`${member.firstName} ${member.lastName}`"
                            class="profile-image"
                            @error="handleImageError(member.id)"
                          />
                          <div v-else class="profile-placeholder">
                            {{ getInitials(member.firstName, member.lastName) }}
                          </div>
                        </div>
                        <div>
                          <h6 class="mb-1 fw-bold">{{ member.firstName }} {{ member.lastName }}</h6>
                          <small class="text-muted">{{ member.position || 'Team Member' }}</small>
                        </div>
                      </div>
                      
                      <div class="assigned-tasks">
                        <h6 class="text-muted mb-2">
                          <i class="bi bi-list-task me-1"></i>
                          Assigned Tasks ({{ getAssignedTasks(member).length }})
                        </h6>
                        <div v-if="getAssignedTasks(member).length === 0" class="text-muted small">
                          No tasks assigned
                        </div>
                        <div v-else>
                          <div 
                            v-for="task in getAssignedTasks(member)" 
                            :key="task.id"
                            class="task-item mb-2 p-2 rounded"
                            :class="getTaskStatusClass(task.status)"
                          >
                            <div class="d-flex justify-content-between align-items-start">
                              <div class="flex-grow-1">
                                <div class="fw-bold small">{{ task.name }}</div>
                                <div class="d-flex align-items-center mt-1">
                                  <span class="badge me-2" :class="getPriorityBadgeClass(task.priority)">
                                    {{ task.priority }}
                                  </span>
                                  <span class="badge" :class="getStatusBadgeClass(task.status)">
                                    {{ task.status }}
                                  </span>
                                </div>
                              </div>
                              <div class="text-end">
                                <div class="small text-muted">{{ task.progress }}%</div>
                                <div class="progress" style="height: 4px; width: 40px;">
                                  <div 
                                    class="progress-bar" 
                                    :class="getProgressBarClass(task.progress)"
                                    :style="{ width: task.progress + '%' }"
                                  ></div>
                                </div>
                                <div class="small text-muted mt-1">{{ formatDateForDisplay(task.deadline) }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
              
              <h5 class="mb-0">
                <i class="bi bi-list-task me-2"></i>
                {{ currentProject ? `${currentProject.name} Tasks` : 'My Tasks' }}
              </h5>
              <div class="d-flex gap-2">
                  <button 
                    v-if="selectedTask && isTaskAssignedToCurrentUser(tasks.find(t => t.id === selectedTask))"
                    class="btn btn-outline-primary btn-sm"
                    @click="viewSelectedTask"
                    title="View Task"
                  >
                    <i class="bi bi-eye me-1"></i>
                    View
                  </button>
                  <button 
                    v-if="selectedTask && isTaskAssignedToCurrentUser(tasks.find(t => t.id === selectedTask))"
                    class="btn btn-outline-warning btn-sm"
                    @click="editTask(tasks.find(t => t.id === selectedTask))"
                    title="Edit Task"
                  >
                    <i class="bi bi-pencil me-1"></i>
                    Edit
                  </button>
                </div>
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
                      <th>Assigned To</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Stage</th>
                      <th>Progress</th>
                      <th>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="task in filteredTasks" 
                      :key="task.id"
                      @click="selectTask(task.id)"
                      :class="{ 'table-primary': selectedTask === task.id}"
                      style="cursor: pointer;"
                    >
                      <td  class="fw-bold">
                        {{ task.name }}
                        <span v-if="isTaskAssignedToCurrentUser(task)" class="badge bg-success ms-2">
                          <i class="bi bi-person-check me-1"></i>My Task
                        </span>
                      </td>
                      <td>{{ task.assignedTo }}</td>
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
                        <span class="badge" :class="getStageBadgeClass(task.stage)">
                          {{ task.stage }}
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
                      <td>{{ formatDateForDisplay(task.deadline) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <div
      :class="['modal fade', { show: showTaskModal }]"
      tabindex="-1"
      :style="{
        display: showTaskModal ? 'block' : 'none',
        background: showTaskModal ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-list-task me-2"></i>
              {{ editingTask ? 'Update Task' : 'View Task' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeTaskModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSaveTask">
              <div class="row">
                <div class="col-md-8 mb-3">
                  <label class="form-label">Task Name *</label>
                  <input 
                    v-model="taskForm.name" 
                    type="text" 
                    class="form-control" 
                    required
                    placeholder="Enter task name"
                    :readonly="!editingTask"
                  >
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Priority *</label>
                  <select v-model="taskForm.priority" class="form-select" required :disabled="!editingTask">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Assigned To *</label>
                  <select v-model="taskForm.assignedTo" class="form-select" required :disabled="!editingTask">
                    <option value="">Select team member</option>
                    <option 
                      v-for="member in getTeamMembers()" 
                      :key="member.id" 
                      :value="`${member.firstName} ${member.lastName}`"
                    >
                      {{ member.firstName }} {{ member.lastName }} - {{ member.position }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status</label>
                  <select v-model="taskForm.status" class="form-select" :disabled="!editingTask" @change="handleStatusChange">
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Progress (%)</label>
                  <input 
                    v-model.number="taskForm.progress" 
                    type="number" 
                    class="form-control" 
                    min="0" 
                    max="100"
                    placeholder="0-100"
                    :readonly="!editingTask"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Deadline</label>
                  <input 
                    v-model="taskForm.deadline" 
                    type="date" 
                    class="form-control"
                    :readonly="!editingTask"
                  >
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Stage</label>
                  <select v-model="taskForm.stage" class="form-select" :disabled="!editingTask">
                    <option value="DEVELOPMENT">Development</option>
                    <option value="TESTING">Testing</option>
                    <option value="STAGING">Staging</option>
                    <option value="PRODUCTION">Production</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea 
                  v-model="taskForm.description" 
                  class="form-control" 
                  rows="3"
                  placeholder="Enter task description"
                  :readonly="!editingTask"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeTaskModal">Close</button>
            <button 
              v-if="editingTask"
              type="button" 
              class="btn btn-primary" 
              @click="handleSaveTask"
              :disabled="isSavingTask"
            >
              <span v-if="isSavingTask" class="spinner-border spinner-border-sm me-2"></span>
              Update Task
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div
      :class="['modal fade', { show: error }]"
      tabindex="-1"
      :style="{
        display: error ? 'block' : 'none',
        background: error ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Error
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="error = null"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">{{ error }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="error = null">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      :class="['modal fade', { show: successMessage }]"
      tabindex="-1"
      :style="{
        display: successMessage ? 'block' : 'none',
        background: successMessage ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="bi bi-check-circle me-2"></i>
              Success
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="successMessage = null"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">{{ successMessage }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="successMessage = null">OK</button>
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
import ProjectService from "@/services/ProjectService";
import TaskService from "@/services/TaskService";
import API_BASE from "@/constants/APIBaseURL";

export default {
  name: "UserTasksPage",
  data() {
    return {
      username: "",
      isLoggingOut: false,
      isLoading: false,
      currentFilter: 'all',
      sortBy: 'priority',
      totalTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      // Project-specific data
      currentProject: null,
      projectId: null,
      // User functionality (limited)
      showTaskModal: false,
      editingTask: null,
      isSavingTask: false,
      // Task selection
      selectedTask: null,
      // Employee data
      employeeProfileImages: {},
      // Caching
      tasksCache: new Map(),
      lastTasksFetch: null,
      cacheTimeout: 30000, // 30 seconds
      taskForm: {
        name: "",
        assignedTo: "",
        priority: "MEDIUM",
        status: "PENDING",
        progress: 0,
        deadline: "",
        description: "",
        stage: "DEVELOPMENT"
      },
      tasks: [],
      // Error handling
      error: null,
      successMessage: null
    };
  },
  computed: {
    filteredTasks() {
      let filtered = this.tasks;
      
      // Apply filter
      if (this.currentFilter !== 'all') {
        filtered = filtered.filter(task => {
          switch (this.currentFilter) {
            case 'in-progress': return task.status === 'IN_PROGRESS';
            case 'completed': return task.status === 'COMPLETED';
            case 'pending': return task.status === 'PENDING';
            default: return true;
          }
        });
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'priority': {
            const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
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
    },
  },
  created() {
    this.username = localStorage.getItem("username") || "User";
    this.loadProjectData();
  },
  beforeUnmount() {
    // Clear cache and profile images when component is destroyed
    this.tasksCache.clear();
    this.employeeProfileImages = {};
  },
  mounted() {
    // Ensure data is loaded when component is mounted (for navigation back)
    if (!this.currentProject && this.$route.query.project) {
      this.loadProjectData();
    }
  },
  watch: {
    // Watch for route changes to reload data when navigating back
    '$route'(to, from) {
      if (to.query.project !== from.query.project) {
        this.loadProjectData();
      }
    }
  },
  methods: {
    async loadProjectData() {
      // Get project ID from route query
      this.projectId = this.$route.query.project;
      
      if (this.projectId) {
        try {
          // Load project details
          const project = await ProjectService.getProjectById(this.projectId);
          this.currentProject = project;
          
          // Load tasks for this project
          await this.loadTasks();
          
          // Load employees and their profile images
          await this.loadEmployees();
        } catch (error) {
          console.error("Error loading project:", error);
          this.error = "Failed to load project data. Please try again.";
          // Set a fallback project to prevent UI issues
          this.currentProject = {
            name: "Project",
            assignedEmployees: []
          };
        }
      } else {
        // Load all tasks for the current user
        await this.loadTasks();
        // Set a default project for team members display
        this.currentProject = {
          name: "My Tasks",
          assignedEmployees: []
        };
        
        // Load employees and their profile images
        await this.loadEmployees();
      }
    },

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
        case 'COMPLETED': return 'bg-success';
        case 'IN_PROGRESS': return 'bg-primary';
        case 'PENDING': return 'bg-warning';
        case 'ON_HOLD': return 'bg-secondary';
        default: return 'bg-info';
      }
    },

    getPriorityBadgeClass(priority) {
      switch (priority) {
        case 'HIGH': return 'bg-danger';
        case 'MEDIUM': return 'bg-warning';
        case 'LOW': return 'bg-info';
        default: return 'bg-secondary';
      }
    },

    getStageBadgeClass(stage) {
      switch (stage) {
        case 'DEVELOPMENT': return 'bg-info';
        case 'TESTING': return 'bg-warning';
        case 'STAGING': return 'bg-primary';
        case 'PRODUCTION': return 'bg-success';
        default: return 'bg-secondary';
      }
    },

    editTask(task) {
      
      this.editingTask = task;
      this.taskForm = {
        name: task.name,
        assignedTo: task.assignedTo || "",
        priority: task.priority,
        status: task.status,
        progress: task.progress,
        deadline: this.formatDateForInput(task.deadline),
        description: task.description || "",
        stage: task.stage || "DEVELOPMENT"
      };
      this.showTaskModal = true;
    },

    openTaskModal() {
      this.editingTask = null;
      this.taskForm = {
        name: "",
        assignedTo: "",
        priority: "MEDIUM",
        status: "PENDING",
        progress: 0,
        deadline: "",
        description: "",
        stage: "DEVELOPMENT"
      };
      this.showTaskModal = true;
    },

    closeTaskModal() {
      this.showTaskModal = false;
      this.editingTask = null;
      this.taskForm = {
        name: "",
        assignedTo: "",
        priority: "MEDIUM",
        status: "PENDING",
        progress: 0,
        deadline: "",
        description: "",
        stage: "DEVELOPMENT"
      };
    },

    // Helper method to format date for HTML date input (yyyy-MM-dd)
    formatDateForInput(dateString) {
      if (!dateString) return "";
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    },

    // Helper method to format date for display
    formatDateForDisplay(dateString) {
      if (!dateString) return "Not set";
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    async handleSaveTask() {
      this.isSavingTask = true;
      this.error = null;
      this.successMessage = null;
      
      try {
        // Validate task data
        const errors = TaskService.validateTaskData(this.taskForm);
        if (errors.length > 0) {
          this.error = errors.join(', ');
          return;
        }

        // Format the task data for API
        const taskData = {
          ...this.taskForm,
          deadline: this.taskForm.deadline || null
        };

        if (this.editingTask) {
          // Update existing task using optimized method for status/progress sync
          // Update existing task with all fields
          const updatedTask = await TaskService.updateTask(this.editingTask.id, taskData);
          
          // Update local task data with server response
          const taskIndex = this.tasks.findIndex(t => t.id === this.editingTask.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask;
          }
          
          this.successMessage = "Task updated successfully!";
        }
        
        this.closeTaskModal();
        this.selectedTask = null;
        await this.loadTasks(true); // Force refresh after update
      } catch (error) {
        console.error("Error saving task:", error);
        this.error = "Failed to save task. Please try again.";
      } finally {
        this.isSavingTask = false;
      }
    },

    async updateTaskStatus(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        try {
          const updatedTask = await TaskService.updateTaskStatusAndProgress(taskId, 'COMPLETED', 100);
          
          // Update local task data
          const taskIndex = this.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask;
          }
          
          this.updateTaskCounts();
          this.successMessage = "Task status updated successfully!";
        } catch (error) {
          console.error("Error updating task status:", error);
          this.error = "Failed to update task status. Please try again.";
        }
      }
    },

    async loadTasks(forceRefresh = false) {
      const now = Date.now();
      const cacheKey = this.projectId ? `project_${this.projectId}_tasks` : 'all_tasks';
      
      // Check cache if not forcing refresh
      if (!forceRefresh && this.tasksCache.has(cacheKey)) {
        const cached = this.tasksCache.get(cacheKey);
        if (now - cached.timestamp < this.cacheTimeout) {
          this.tasks = cached.data;
          this.updateTaskCounts();
          return;
        }
      }
      
      this.isLoading = true;
      try {
        let tasks;
        if (this.projectId) {
          tasks = await TaskService.getTasksByProjectId(this.projectId);
        } else {
          tasks = await TaskService.getAllTasks();
        }
        
        // Update cache
        this.tasksCache.set(cacheKey, {
          data: tasks,
          timestamp: now
        });
        
        this.tasks = tasks;
        this.lastTasksFetch = now;
        this.updateTaskCounts();
      } catch (error) {
        console.error("Error loading tasks:", error);
        this.error = "Failed to load tasks. Please try again.";
        this.tasks = [];
      } finally {
        this.isLoading = false;
      }
    },

    updateTaskCounts() {
      this.totalTasks = this.tasks.length;
      this.inProgressTasks = this.tasks.filter(t => t.status === 'IN_PROGRESS').length;
      this.completedTasks = this.tasks.filter(t => t.status === 'COMPLETED').length;
      this.pendingTasks = this.tasks.filter(t => t.status === 'PENDING').length;
    },

    // Task selection methods
    selectTask(taskId) {
      this.selectedTask = this.selectedTask === taskId ? null : taskId;
    },

    goToProjects() {
      this.$router.push({ name: 'Reports' });
    },

    getTeamMembers() {
      // If we have a current project with assigned employees, use those
      if (this.currentProject && this.currentProject.assignedEmployees && this.currentProject.assignedEmployees.length > 0) {
        return this.currentProject.assignedEmployees.map((employee, index) => ({
          id: employee.id || `temp_${index}`, // Use actual employee ID if available
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position || 'Team Member'
        }));
      }
      
      // If no assigned employees, return empty array
      return [];
    },

    getAssignedTasks(member) {
      // This is a placeholder. In a real application, you would filter tasks
      // by the member's assignedTo field.
      return this.tasks.filter(task => task.assignedTo === `${member.firstName} ${member.lastName}`);
    },

    getTaskStatusClass(status) {
      switch (status) {
        case 'COMPLETED': return 'bg-success';
        case 'IN_PROGRESS': return 'bg-primary';
        case 'PENDING': return 'bg-warning';
        case 'ON_HOLD': return 'bg-secondary';
        default: return 'bg-info';
      }
    },

    getCurrentUserAccountId() {
      // Get the current user's account ID from localStorage
      return localStorage.getItem("accountId") || localStorage.getItem("id") || "";
    },

    isTaskAssignedToCurrentUser(task) {
      const employeeFullName = localStorage.getItem("employeeFullName");
      return task && task.assignedTo && employeeFullName && task.assignedTo === employeeFullName;
    },

    viewSelectedTask() {
      if (this.selectedTask) {
        // Preserve the project parameter when navigating to task view
        const query = {};
        if (this.projectId) {
          query.project = this.projectId;
        }
        this.$router.push({ 
          name: 'UserViewTask', 
          params: { id: this.selectedTask },
          query: query
        });
      }
    },

    handleStatusChange() {
      // Auto-sync progress based on status change
      switch (this.taskForm.status) {
        case 'COMPLETED':
          this.taskForm.progress = 100;
          break;
        case 'IN_PROGRESS':
          // Only set to 25% if current progress is 0
          if (this.taskForm.progress === 0) {
            this.taskForm.progress = 25;
          }
          break;
        case 'PENDING':
          // Reset progress to 0 only if it was completed
          if (this.taskForm.progress === 100) {
            this.taskForm.progress = 0;
          }
          break;
        case 'ON_HOLD':
          // Keep current progress when putting on hold
          break;
      }
    },

    async loadEmployees() {
      try {
        // Load profile images for assigned employees only
        await this.loadEmployeeProfileImages();
      } catch (error) {
        console.error("Error loading employee profile images:", error);
        // Don't show error to user, just log it
      }
    },

        async loadEmployeeProfileImages() {
      const teamMembers = this.getTeamMembers();
      for (const member of teamMembers) {
        try {
          // Use direct URL approach like in EmployeeDetail.vue
          const timestamp = Date.now();
          const profileImageUrl = `${API_BASE}/employees/${member.id}/profile-image?t=${timestamp}`;
          this.employeeProfileImages[member.id] = profileImageUrl;
        } catch (error) {
          // Profile image not found or error loading it
          console.log(`No profile image found for employee ${member.id}`);
        }
      }
    },

    getInitials(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : '';
      const last = lastName ? lastName.charAt(0).toUpperCase() : '';
      return first + last;
    },

    handleImageError(employeeId) {
      // Remove the failed image URL so the fallback placeholder shows
      this.employeeProfileImages[employeeId] = null;
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

.clickable-row {
  transition: all 0.2s ease-in-out;
}

.clickable-row:hover {
  background-color: #f8f9fa !important;
  transform: translateX(2px);
}

.clickable-row.table-primary {
  background-color: #e3f2fd !important;
  border-left: 4px solid #2196f3;
}

.clickable-row.table-primary:hover {
  background-color: #bbdefb !important;
}

.task-item {
  background-color: #f8f9fa;
  border-left: 3px solid #dee2e6;
  transition: all 0.2s ease-in-out;
}

.task-item:hover {
  background-color: #e9ecef;
  transform: translateX(2px);
}

.task-item.bg-success {
  border-left-color: #28a745;
  background-color: #d4edda !important;
}

.task-item.bg-primary {
  border-left-color: #007bff;
  background-color: #cce7ff !important;
}

.task-item.bg-warning {
  border-left-color: #ffc107;
  background-color: #fff3cd !important;
}

.task-item.bg-secondary {
  border-left-color: #6c757d;
  background-color: #e2e3e5 !important;
}

.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f8f9fa;
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  font-size: 14px;
  border-radius: 50%;
  text-transform: uppercase;
}
</style> 