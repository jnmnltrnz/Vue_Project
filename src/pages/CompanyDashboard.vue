<template>
  <div class="company-dashboard">
    <!-- Header with Logout -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">Company Dashboard</h1>
            <p class="mb-0 text-muted">Welcome back, {{ username }}!</p>
          </div>
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

    <!-- Main Content -->
    <div class="container mt-4">
      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <div class="stats-icon mb-3">
                <i class="bi bi-people-fill text-primary fs-1"></i>
              </div>
              <div v-if="isLoadingEmployees" class="d-flex justify-content-center">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <h3 v-else class="card-title text-primary">{{ totalEmployees }}</h3>
              <p class="card-text text-muted">Total Employees</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <div class="stats-icon mb-3">
                <i class="bi bi-calendar-check text-success fs-1"></i>
              </div>
              <h3 class="card-title text-success">{{ activeProjects }}</h3>
              <p class="card-text text-muted">Active Projects</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <div class="stats-icon mb-3">
                <i class="bi bi-graph-up text-info fs-1"></i>
              </div>
              <h3 class="card-title text-info">{{ revenue }}</h3>
              <p class="card-text text-muted">Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-3">
                  <button class="btn btn-outline-primary w-100 h-100 py-3" @click="viewEmployees">
                    <i class="bi bi-people me-2"></i>
                    View Employees
                  </button>
                </div>
                <div class="col-md-3 mb-3">
                  <button class="btn btn-outline-success w-100 h-100 py-3" @click="addEmployee">
                    <i class="bi bi-person-plus me-2"></i>
                    Add Employee
                  </button>
                </div>
                <div class="col-md-3 mb-3">
                  <button class="btn btn-outline-info w-100 h-100 py-3" @click="viewReports">
                    <i class="bi bi-file-earmark-text me-2"></i>
                    Project and Reports
                  </button>
                </div>
                <div class="col-md-3 mb-3">
                  <button class="btn btn-outline-warning w-100 h-100 py-3" @click="viewMeetings">
                    <i class="bi bi-calendar-event me-2"></i>
                    Meetings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-light">
              <h5 class="mb-0">Recent Activity</h5>
            </div>
            <div class="card-body">
              <div v-if="isLoadingActivity" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading recent activity...</p>
              </div>
              <div v-else-if="recentActivity.length === 0" class="text-center py-4">
                <i class="bi bi-activity text-muted fs-1"></i>
                <p class="mt-2 text-muted">No recent activity found</p>
              </div>
              <div v-else class="activity-list">
                <div v-for="activity in recentActivity" :key="activity.id" class="activity-item d-flex align-items-center mb-3">
                  
                  <div class="activity-content flex-grow-1">
                    <div class="activity-text">{{ activity.text }}</div>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                </div>
                
                <!-- Pagination -->
                <div v-if="totalActivityPages > 1" class="d-flex justify-content-center mt-3">
                  <nav aria-label="Activity pagination">
                    <ul class="pagination pagination-sm mb-0">
                      <li class="page-item" :class="{ disabled: currentActivityPage === 1 }">
                        <button 
                          class="page-link" 
                          @click="changeActivityPage(currentActivityPage - 1)"
                          :disabled="currentActivityPage === 1"
                        >
                          <i class="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      
                      <li 
                        v-for="page in totalActivityPages" 
                        :key="page" 
                        class="page-item"
                        :class="{ active: page === currentActivityPage }"
                      >
                        <button 
                          class="page-link" 
                          @click="changeActivityPage(page)"
                        >
                          {{ page }}
                        </button>
                      </li>
                      
                      <li class="page-item" :class="{ disabled: currentActivityPage === totalActivityPages }">
                        <button 
                          class="page-link" 
                          @click="changeActivityPage(currentActivityPage + 1)"
                          :disabled="currentActivityPage === totalActivityPages"
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
        </div>
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-calendar-event me-2"></i>This Week's Meetings
              </h5>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div v-if="isLoadingMeetings" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading meetings...</p>
              </div>

              <!-- Meetings List -->
              <div v-else class="event-list">
                <div v-for="meeting in paginatedMeetings" :key="meeting.id" class="event-item d-flex align-items-center mb-3">
                  <div class="event-content flex-grow-1">
                    <div class="event-title">{{ meeting.title }}</div>
                    <small class="text-muted">{{ meeting.fullDate }}</small>
                  </div>
                </div>
                
                <!-- No Meetings Message -->
                <div v-if="upcomingMeetings.length === 0" class="text-center py-3">
                  <i class="bi bi-calendar-x text-muted" style="font-size: 2rem;"></i>
                  <p class="text-muted mt-2 mb-0">No meetings scheduled this week</p>
                  <button class="btn btn-sm btn-outline-primary mt-2" @click="viewMeetings">
                    <i class="bi bi-plus-circle me-1"></i>Schedule Meeting
                  </button>
                </div>
                
                <!-- Meetings Pagination -->
                <div v-if="upcomingMeetings.length > 0" class="d-flex justify-content-between align-items-center mt-3">
                  <div class="text-muted">
                    <span v-if="upcomingMeetings.length > 0">
                      Showing {{ (currentMeetingsPage - 1) * meetingsPerPage + 1 }} to 
                      {{ Math.min(currentMeetingsPage * meetingsPerPage, upcomingMeetings.length) }} 
                      of {{ upcomingMeetings.length }} meetings
                    </span>
                    <span v-else>
                      No meetings this week
                    </span>
                  </div>
                  <nav v-if="upcomingMeetings.length > 0" aria-label="Meetings pagination">
                    <ul class="pagination pagination-sm mb-0">
                      <li class="page-item" :class="{ disabled: currentMeetingsPage === 1 }">
                        <button class="page-link" @click="changeMeetingsPage(currentMeetingsPage - 1)" :disabled="currentMeetingsPage === 1">
                          <i class="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      <li v-for="page in getPageNumbers(totalMeetingsPages, currentMeetingsPage)" :key="page" class="page-item" :class="{ active: page === currentMeetingsPage }">
                        <button class="page-link" @click="changeMeetingsPage(page)">{{ page }}</button>
                      </li>
                      <li class="page-item" :class="{ disabled: currentMeetingsPage === totalMeetingsPages }">
                        <button class="page-link" @click="changeMeetingsPage(currentMeetingsPage + 1)" :disabled="currentMeetingsPage === totalMeetingsPages">
                          <i class="bi bi-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                  <div v-if="upcomingMeetings.length > 0 && totalMeetingsPages === 1" class="text-muted">
                    Page 1 of 1
                  </div>
                </div>
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
    
    <!-- Debug Button -->
    <DebugButton />
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";
import AuditService from "@/services/AuditService";
import EmployeeService from "@/services/EmployeeService";
import EmployeeCache from "@/services/EmployeeCache";
import MeetingService from "@/services/MeetingService";
import MeetingCache from "@/services/MeetingCache";
import ProjectService from "@/services/ProjectService";
import ProjectCache from "@/services/ProjectCache";
import DebugButton from "@/components/Debug/DebugButton.vue";

export default {
  name: "CompanyDashboard",
  components: {
    DebugButton,
  },
  data() {
    return {
      username: "",
      isLoggingOut: false,
      isLoadingActivity: false,
      isLoadingEmployees: false,
      totalEmployees: 0,
      activeProjects: 0,
      revenue: "$2.4M",
      recentActivity: [],
      currentActivityPage: 1,
      activitiesPerPage: 5,
      totalActivities: 0,
      upcomingMeetings: [],
      isLoadingMeetings: false,
      // Meetings pagination
      currentMeetingsPage: 1,
      meetingsPerPage: 5,
      totalMeetings: 0
    };
  },
      created() {
      this.username = localStorage.getItem("username") || "User";
      this.loadAuditLogs();
      this.loadEmployees();
      this.loadMeetings();
      this.loadProjects();
      
      // Listen for employee deletion events using window events
      window.addEventListener('employee-deleted', this.updateEmployeeCount);
      window.addEventListener('employee-added', this.updateEmployeeCount);
      
      // Listen for meeting events
      window.addEventListener('meeting-added', this.refreshMeetings);
      window.addEventListener('meeting-updated', this.refreshMeetings);
      window.addEventListener('meeting-deleted', this.refreshMeetings);
      
      // Listen for project events
      window.addEventListener('project-added', this.refreshProjects);
      window.addEventListener('project-updated', this.refreshProjects);
      window.addEventListener('project-deleted', this.refreshProjects);
    },
  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener('employee-deleted', this.updateEmployeeCount);
    window.removeEventListener('employee-added', this.updateEmployeeCount);
    window.removeEventListener('meeting-added', this.refreshMeetings);
    window.removeEventListener('meeting-updated', this.refreshMeetings);
    window.removeEventListener('meeting-deleted', this.refreshMeetings);
    window.removeEventListener('project-added', this.refreshProjects);
    window.removeEventListener('project-updated', this.refreshProjects);
    window.removeEventListener('project-deleted', this.refreshProjects);
  },
  methods: {
    async loadAuditLogs() {
      // Check if we have cached audit logs for this user
      const cacheKey = `audit_logs_${this.username}`;
      const timestampKey = `${cacheKey}_timestamp`;
      const cachedLogs = sessionStorage.getItem(cacheKey);
      const cacheTimestamp = sessionStorage.getItem(timestampKey);
      
      // Check if cache is valid (5 minutes expiry)
      const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : 0;
      const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (cachedLogs && cacheValid) {
        try {
          const parsedLogs = JSON.parse(cachedLogs);
          this.recentActivity = this.formatAuditLogs(parsedLogs);
          return;
        } catch (error) {
          console.error("Failed to parse cached audit logs:", error);
        }
      }

      // Only fetch from API if cache is empty, invalid, or expired
      this.isLoadingActivity = true;
      try {
        const response = await AuditService.getAuditLogsByUser(this.username);
        const auditLogs = response.data;
        
        // Cache the audit logs for 5 minutes
        sessionStorage.setItem(cacheKey, JSON.stringify(auditLogs));
        sessionStorage.setItem(timestampKey, Date.now().toString());
        
        this.recentActivity = this.formatAuditLogs(auditLogs);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
        // Fallback to empty array if API fails
        this.recentActivity = [];
      } finally {
        this.isLoadingActivity = false;
      }
    },
    
    formatAuditLogs(auditLogs) {
      // Sort by dateTriggered in descending order (latest first)
      const sortedLogs = auditLogs.sort((a, b) => 
        new Date(b.dateTriggered) - new Date(a.dateTriggered)
      );
      
      this.totalActivities = sortedLogs.length;
      
      // Calculate pagination
      const startIndex = (this.currentActivityPage - 1) * this.activitiesPerPage;
      const endIndex = startIndex + this.activitiesPerPage;
      const paginatedLogs = sortedLogs.slice(startIndex, endIndex);
      
      return paginatedLogs.map((log, index) => {
        const iconMapping = this.getIconForAction(log.actionMessage);
        return {
          id: log.id || (startIndex + index + 1),
          text: log.actionMessage,
          time: this.formatTimeAgo(log.dateTriggered),
          icon: iconMapping.icon,
          iconClass: iconMapping.iconClass
        };
      });
    },
    
    getIconForAction(actionMessage) {
      const message = actionMessage.toLowerCase();
      
      if (message.includes('add') || message.includes('created')) {
        return { icon: 'bi bi-person-plus', iconClass: 'text-success' };
      } else if (message.includes('update') || message.includes('modified')) {
        return { icon: 'bi bi-pencil', iconClass: 'text-primary' };
      } else if (message.includes('delete') || message.includes('removed')) {
        return { icon: 'bi bi-trash', iconClass: 'text-danger' };
      } else if (message.includes('upload') || message.includes('file')) {
        return { icon: 'bi bi-file-earmark-arrow-up', iconClass: 'text-info' };
      } else if (message.includes('login') || message.includes('logout')) {
        return { icon: 'bi bi-box-arrow-in-right', iconClass: 'text-warning' };
      } else {
        return { icon: 'bi bi-activity', iconClass: 'text-secondary' };
      }
    },
    
    formatTimeAgo(dateTimeString) {
      const now = new Date();
      const dateTime = new Date(dateTimeString);
      const diffInMs = now - dateTime;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        return dateTime.toLocaleDateString();
      }
    },
    
    changeActivityPage(page) {
      this.currentActivityPage = page;
      this.loadAuditLogs();
    },
    
    changeMeetingsPage(page) {
      if (page >= 1 && page <= this.totalMeetingsPages) {
        this.currentMeetingsPage = page;
      }
    },
    
    getPageNumbers(totalPages, currentPage) {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is less than max visible
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current page
        let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let end = Math.min(totalPages, start + maxVisiblePages - 1);
        
        // Adjust start if we're near the end
        if (end === totalPages) {
          start = Math.max(1, end - maxVisiblePages + 1);
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    },
    
    loadEmployees() {
      // Check cache first for faster loading
      if (EmployeeCache.hasAllEmployees()) {
        const employees = EmployeeCache.getAllEmployees();
        this.totalEmployees = employees.length;
        return;
      }

      // Only fetch from API if cache is empty
      this.isLoadingEmployees = true;
      EmployeeService.getAllEmployees()
        .then((response) => {
          const employees = response.data;
          this.totalEmployees = employees.length;
          EmployeeCache.setAllEmployees(employees);
          EmployeeCache.updateLastFetch();
        })
        .catch((error) => {
          console.error("There was an error fetching the employees!", error);
          this.totalEmployees = 0;
        })
        .finally(() => {
          this.isLoadingEmployees = false;
        });
    },
    
    updateEmployeeCount() {
      if (EmployeeCache.hasAllEmployees()) {
        this.totalEmployees = EmployeeCache.getAllEmployees().length;
      }
    },
    
    refreshMeetings() {
      // Force refresh meetings from cache or API
      MeetingCache.clear();
      this.loadMeetings();
    },
    
    refreshProjects() {
      // Force refresh projects from cache or API
      ProjectCache.clear();
      this.loadProjects();
    },

    clearAuditLogsCache() {
      const cacheKey = `audit_logs_${this.username}`;
      sessionStorage.removeItem(cacheKey);
      sessionStorage.removeItem(`${cacheKey}_timestamp`);
    },

    refreshAuditLogs() {
      // Clear cache and reload audit logs
      this.clearAuditLogsCache();
      this.loadAuditLogs();
    },

    async loadProjects() {
      try {
        // Check cache first for faster loading
        if (ProjectCache.hasAllProjects()) {
          const projects = ProjectCache.getAllProjects();
          this.activeProjects = projects.filter(project => 
            project.status === 'PLANNING' || project.status === 'IN_PROGRESS'
          ).length;
          return;
        }

        // Only fetch from API if cache is empty
        const response = await ProjectService.getAllProjects();
        const projects = response || [];
        
        // Store in cache for faster access on other pages
        ProjectCache.setAllProjects(projects);
        ProjectCache.updateLastFetch();
        
        // Calculate active projects (PLANNING or IN_PROGRESS)
        this.activeProjects = projects.filter(project => 
          project.status === 'PLANNING' || project.status === 'IN_PROGRESS'
        ).length;

        
      } catch (error) {
        console.error("Failed to load projects:", error);
        this.activeProjects = 0;
        ProjectCache.clear();
      }
    },

    async loadMeetings() {
      // Check cache first for faster loading
      if (MeetingCache.hasAllMeetings()) {
        const allMeetings = MeetingCache.getAllMeetings();
        const thisWeekMeetings = this.filterMeetingsForCurrentWeek(allMeetings);
        this.upcomingMeetings = this.formatMeetings(thisWeekMeetings);
        this.totalMeetings = this.upcomingMeetings.length;
        this.currentMeetingsPage = 1;
        return;
      }

      // Only fetch from API if cache is empty
      this.isLoadingMeetings = true;
      try {
        const response = await MeetingService.getAllMeetings();
        const allMeetings = response.data || [];
        
        // Store in cache for faster access on other pages
        MeetingCache.setAllMeetings(allMeetings);
        
        // Filter meetings for current week only
        const thisWeekMeetings = this.filterMeetingsForCurrentWeek(allMeetings);
        this.upcomingMeetings = this.formatMeetings(thisWeekMeetings);
        this.totalMeetings = this.upcomingMeetings.length;
        // Reset pagination to first page
        this.currentMeetingsPage = 1;
      } catch (error) {
        console.error("Failed to load upcoming meetings:", error);
        this.upcomingMeetings = [];
        this.totalMeetings = 0;
        MeetingCache.clear();
      } finally {
        this.isLoadingMeetings = false;
      }
    },

    filterMeetingsForCurrentWeek(meetings) {
      const now = new Date();
      const startOfWeek = new Date(now);
      const endOfWeek = new Date(now);
      
      // Set start of week to Monday (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days
      startOfWeek.setDate(now.getDate() - daysToMonday);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Set end of week to Sunday
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      return meetings.filter(meeting => {
        const meetingDate = new Date(meeting.meetingDate);
        return meetingDate >= startOfWeek && meetingDate <= endOfWeek;
      });
    },

    formatMeetings(meetings) {
      if (!meetings || !Array.isArray(meetings)) return [];
      
      return meetings.slice(0, 5).map(meeting => {
        const meetingDate = new Date(meeting.meetingDate);
        const dayName = meetingDate.toLocaleString('default', { weekday: 'long' });
        const month = meetingDate.toLocaleString('default', { month: 'long' });
        const day = meetingDate.getDate();
        const year = meetingDate.getFullYear();
        
        // Format time with AM/PM
        const timeString = meeting.meetingTime;
        const timeParts = timeString.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? ' PM' : ' AM';
        const displayHours = hours % 12 || 12;
        const formattedTime = `${displayHours}:${minutes}${ampm}`;

        return {
          id: meeting.id,
          day: day.toString(),
          month: month,
          title: meeting.title,
          time: meeting.meetingTime,
          fullDate: `${dayName} - ${month} ${day}, ${year} (${formattedTime})`
        };
      });
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
    viewEmployees() {
      this.$router.push({ name: "EmployeeList" });
    },
    addEmployee() {
      this.$router.push({ name: "AddEmployee" });
    },
    viewReports() {
      this.$router.push({ name: "Reports" });
    },
    manageSettings() {
      // Deprecated: Settings feature replaced by Meetings
    },
    viewMeetings() {
      this.$router.push({ name: "Meetings" });
    }
  },
  computed: {
    totalActivityPages() {
      return Math.ceil(this.totalActivities / this.activitiesPerPage);
    },
    paginatedMeetings() {
      const startIndex = (this.currentMeetingsPage - 1) * this.meetingsPerPage;
      const endIndex = startIndex + this.meetingsPerPage;
      return this.upcomingMeetings.slice(startIndex, endIndex);
    },
    totalMeetingsPages() {
      return Math.ceil(this.totalMeetings / this.meetingsPerPage);
    }
  }
};
</script>

<style scoped>
.company-dashboard {
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

.activity-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.event-item:last-child {
  border-bottom: none;
}

.event-date {
  width: 50px;
  height: 50px;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.event-day {
  font-weight: bold;
  font-size: 1.2em;
  line-height: 1;
}

.event-month {
  font-size: 0.8em;
  line-height: 1;
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