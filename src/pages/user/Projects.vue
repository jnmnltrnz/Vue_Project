<template>
  <div class="projects-page">
    <!-- Header with Navigation -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">My Project</h1>
            <p class="mb-0 text-muted">Your assigned project and detailed information</p>
          </div>
          <div class="d-flex gap-2">
            <button 
              class="btn btn-outline-primary" 
              @click="viewAllMeetings"
            >
              My Meetings
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
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading your project details...</p>
      </div>

      <!-- No Project Assigned -->
      <div v-else-if="projects.length === 0" class="text-center py-5">
        <div class="card shadow-sm mx-auto" style="max-width: 600px;">
          <div class="card-body py-5">
            <i class="bi bi-kanban text-muted" style="font-size: 4rem;"></i>
            <h3 class="mt-3 text-muted">No Project Assigned</h3>
            <p class="text-muted">You haven't been assigned to any projects yet.</p>
            <p class="text-muted">Please contact your manager for project assignments.</p>
          </div>
        </div>
      </div>

      <!-- Project List -->
      <div v-else class="row justify-content-center">
        <div v-for="project in projects" :key="project.id" class="col-12 col-lg-10 col-xl-8 mb-4">
          <div class="card shadow-sm h-100 rounded-4 border-0 mx-auto" style="max-width: 900px;">
            <div class="card-header d-flex justify-content-between align-items-center rounded-top-4">
              <h5 class="mb-0 fw-bold">
                <i class="bi bi-kanban me-2"></i>{{ project.name }}
              </h5>
              <span class="badge" :class="getStatusBadgeClass(project.status)">
                {{ project.status.replace('_', ' ') }}
              </span>
            </div>
            <div class="card-body">
              <div class="mb-3 text-muted small">{{ 'Description: ' + project.description || 'No description available' }}</div>
              <div class="d-flex align-items-center mb-3">
                <div class="me-4">
                  <div class="fw-bold">Manager</div>
                  <div>{{ project.manager }}</div>
                </div>
                <div>
                  <div class="fw-bold">Deadline</div>
                  <div :class="{'text-danger': getDaysUntilDeadline(project.deadline).includes('overdue')}">
                    {{ formatDeadline(project.deadline) }} <span class="small">({{ getDaysUntilDeadline(project.deadline) }})</span>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <div class="fw-bold mb-1">Progress</div>
                <div class="progress rounded-pill" style="height: 14px;">
                  <div class="progress-bar" :class="getProgressBarClass(project.progress)" :style="{ width: project.progress + '%' }"></div>
                </div>
                <small class="text-muted">{{ project.progress }}% Complete</small>
              </div>
              <div class="mb-3 ">
                <div class="fw-bold mb-1">Team Members</div>
                <span class="badge" :class="(project.assignedEmployees && project.assignedEmployees.length === project.teamSize) ? 'bg-info' : 'bg-secondary'">
                  {{ project.assignedEmployees ? project.assignedEmployees.length : 0 }}/{{ project.teamSize || 0 }}
                </span>
                <div v-if="getTeamMembers(project).length > 0" class="mt-2 d-flex flex-wrap gap-2 justify-content-center">
                  <span v-for="name in getTeamMembers(project)" :key="name" class="team-member-badge">
                    <i class="bi bi-person-circle me-1"></i>{{ name }}
                  </span>
                </div>
                <div v-else class="text-muted small mt-2">No team members assigned</div>
              </div>
              <div class="d-flex justify-content-end">
                <button class="btn btn-outline-primary" @click="viewProject(project.id)">
                  <i class="bi bi-list-task me-2"></i>View Tasks
                </button>
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
import MeetingService from "@/services/MeetingService";

export default {
  name: "ProjectsPage",
  data() {
    return {
      username: "",
      accountId: null,
      isLoggingOut: false,
      isLoading: false,
      projects: [],
      currentProject: null,
      projectMeetings: [],
      isLoadingMeetings: false,
    };
  },
  created() {
    this.username = localStorage.getItem("username") || "User";
    this.accountId = localStorage.getItem("accountId");
    this.loadProjects();
  },
  methods: {
    async loadProjects() {
      this.isLoading = true;
      if (this.accountId) {
        try {
          // Fetch projects directly by accountId
          const projects = await ProjectService.getProjectsByEmployee(this.accountId);

          this.projects = projects || [];
        } catch (error) {
          console.error("Error loading projects for account:", error);
          this.projects = [];
        }
      } else {
        this.projects = [];
      }
      this.isLoading = false;
    },
    
    async loadProjectMeetings() {
      this.isLoadingMeetings = true;
      try {
        if (this.accountId) {
          // Use the existing getMeetingsWithInviteesByEmployee method
          const response = await MeetingService.getMeetingsWithInviteesByEmployee(this.accountId);
          this.projectMeetings = response.data.data || []; // Access the data property of ApiResponse
        } else {
          this.projectMeetings = [];
        }
      } catch (error) {
        console.error("Error loading project meetings:", error);
        this.projectMeetings = [];
      } finally {
        this.isLoadingMeetings = false;
      }
    },
    
    formatDeadline(deadline) {
      if (!deadline) return 'Not set';
      const date = new Date(deadline);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    formatDate(date) {
      if (!date) return 'N/A';
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    getDaysUntilDeadline(deadline) {
      if (!deadline) return '';
      const deadlineDate = new Date(deadline);
      const today = new Date();
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return `${Math.abs(diffDays)} days overdue`;
      } else if (diffDays === 0) {
        return 'Due today';
      } else if (diffDays === 1) {
        return 'Due tomorrow';
      } else {
        return `${diffDays} days remaining`;
      }
    },
    
    formatMeetingDate(date, time) {
      if (!date || !time) return 'N/A';
      try {
        const meetingDate = new Date(date);
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? ' PM' : ' AM';
        const displayHours = hours % 12 || 12;
        
        return `${meetingDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })} at ${displayHours}:${minutes}${ampm}`;
      } catch (error) {
        return 'Invalid date';
      }
    },
    
    viewAllMeetings() {
      this.$router.push({ name: 'UserMeetings' });
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

    getTimelineMarkerClass(status) {
      switch (status) {
        case 'COMPLETED': return 'bg-success';
        case 'IN_PROGRESS': return 'bg-primary';
        case 'PLANNING': return 'bg-warning';
        case 'ON_HOLD': return 'bg-secondary';
        default: return 'bg-info';
      }
    },

    viewProject(projectId) {
      // Navigate to project detail or task list
      this.$router.push({ name: 'UserTasks', query: { project: projectId } });
    },

    goToTasks() {
      this.$router.push({ name: 'UserTasks' });
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
            localStorage.removeItem("accountId");
            localStorage.removeItem("employeeFullName");
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
    },

    getTeamMembers(project) {
      if (!project) return [];
      if (project.assignedEmployees && Array.isArray(project.assignedEmployees)) {
        return project.assignedEmployees.map(emp => {
          // Handle different possible data structures
          if (emp.name) {
            return emp.name;
          } else if (emp.firstName && emp.lastName) {
            return `${emp.firstName} ${emp.lastName}`;
          } else if (emp.firstName) {
            return emp.firstName;
          } else if (emp.lastName) {
            return emp.lastName;
          } else {
            return 'Unknown Employee';
          }
        });
      }
      if (project.assignedEmployeeIds && Array.isArray(project.assignedEmployeeIds)) {
        // If we only have IDs, we can't display names without additional API call
        return [];
      }
      return [];
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
    },
    completedTasks() {
      // Sum completedTasks for all projects
      return this.projects.reduce((sum, p) => sum + (p.completedTasks || 0), 0);
    },
    pendingTasks() {
      // Sum pendingTasks for all projects
      return this.projects.reduce((sum, p) => sum + (p.pendingTasks || 0), 0);
    },
    upcomingMeetingsCount() {
      if (!Array.isArray(this.projectMeetings)) return 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.projectMeetings.filter(meeting => {
        const meetingDate = new Date(meeting.meetingDate);
        return meetingDate >= today;
      }).length;
    },
    
    // Remove teamMembers computed, now handled per project
  }
};
</script>

<style scoped>
.projects-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header-container {
  background: linear-gradient(135deg, #2da6f8 0%, #ffffff 100%);
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
  width: 1000px;
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

/* Meeting styles */
.meetings-list {
  max-height: 300px;
}

.meeting-item {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.meeting-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.meeting-title {
  font-size: 0.9rem;
  line-height: 1.2;
}

.meeting-notes {
  font-size: 0.75rem;
  line-height: 1.1;
  opacity: 0.8;
}

.meeting-status .badge {
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
}

/* Project overview specific styles */
.card-header.bg-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
}

.card-header.bg-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
}

/* Timeline styles */
.timeline-container {
  position: relative;
  padding-left: 20px;
}

.timeline-item {
  position: relative;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.timeline-marker {
  position: absolute;
  left: -25px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #dee2e6;
}

.timeline-content {
  flex: 1;
  font-size: 0.9rem;
}

/* Team members styles */
.team-members-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.team-member-badge {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.team-member-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

/* Stat cards */
.stat-card {
  transition: all 0.3s ease-in-out;
  border-radius: 8px;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.8rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem 1rem;
  }
  
  .stats-icon {
    height: 60px;
  }
  
  .stats-icon i {
    font-size: 2rem !important;
  }
  
  .card h4 {
    font-size: 2rem;
  }
  
  .team-members-container {
    gap: 6px;
  }
  
  .team-member-badge {
    font-size: 0.8rem;
    padding: 4px 10px;
  }
}

/* Loading and empty states */
.text-center.py-5 {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Meeting summary section */
.border-top {
  border-top: 1px solid #dee2e6 !important;
}

/* Progress bar enhancements */
.progress {
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  transition: width 0.6s ease;
}

/* Table styles */
.table-borderless td {
  padding: 0.5rem 0;
  border: none;
}

.table-borderless td:first-child {
  width: 40%;
  color: #6c757d;
}
</style> 