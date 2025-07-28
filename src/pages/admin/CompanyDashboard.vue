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
    <div class=" container mt-4">
      <!-- Dashboard Overview -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body text-center py-5">
              <div class="overview-icon mb-4">
                <i class="bi bi-speedometer2 text-primary" style="font-size: 4rem;"></i>
              </div>
              <h2 class="text-primary mb-3">Dashboard Overview</h2>
              <p class="lead text-muted mb-4">
                Quick access to your most important management tools and recent activities.
              </p>
              <div class="row justify-content-center">
                <div class="col-md-8">
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <div class="feature-item">
                        <i class="bi bi-people text-success fs-2 mb-2"></i>
                        <h5>Team Management</h5>
                        <p class="text-muted small">View and manage your team members</p>
                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <div class="feature-item">
                        <i class="bi bi-kanban text-info fs-2 mb-2"></i>
                        <h5>Project Control</h5>
                        <p class="text-muted small">Monitor and track project progress</p>
                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <div class="feature-item">
                        <i class="bi bi-list-task text-warning fs-2 mb-2"></i>
                        <h5>Task Assignment</h5>
                        <p class="text-muted small">Assign and track individual tasks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-4 ">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="mb-0">Quick Actions</h5>
            </div>
            <div class="card-body ">
              <div class="row justify-content-center align-items-center">
                <div class="col-md-3 mb-3">
                  <button class="btn btn-outline-primary w-100 h-100 py-3" @click="viewEmployees">
                    <i class="bi bi-people me-2"></i>
                    View Employees
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
            <div class="card-body d-flex flex-column" style="height: 400px;">
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
              <div v-else class="activity-list" style="flex: 1; overflow-y: auto;">
                <div v-for="activity in paginatedActivity" :key="activity.id" class="activity-item d-flex align-items-center mb-3">
                  <div class="activity-content flex-grow-1">
                    <div class="activity-text text-truncate" :title="activity.text">{{ activity.text }}</div>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                </div>
              </div>
              
              <!-- Activity Pagination - Fixed at bottom -->
              <div v-if="recentActivity.length > 0" class="d-flex justify-content-between align-items-center p-3 border-top" style="height: 60px; flex-shrink: 0;">
                <div class="text-muted">
                  <span v-if="recentActivity.length > 0">
                    Showing {{ (currentActivityPage - 1) * activitiesPerPage + 1 }} to 
                    {{ Math.min(currentActivityPage * activitiesPerPage, recentActivity.length) }} 
                    of {{ recentActivity.length }} activities
                  </span>
                  <span v-else>
                    No activities found
                  </span>
                </div>
                <nav v-if="recentActivity.length > 0" aria-label="Activity pagination">
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
                      v-for="page in getActivityPageNumbers(totalActivityPages, currentActivityPage)" 
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
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-calendar-event me-2"></i>Upcoming Meetings (This Week)
              </h5>
            </div>
            <div class="card-body d-flex flex-column" style="height: 400px;">
              <!-- Loading State -->
              <div v-if="isLoadingMeetings" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading meetings...</p>
              </div>

              <!-- Meetings List -->
              <div v-else class="event-list" style="flex: 1; overflow-y: auto;">
                <div v-for="meeting in paginatedMeetings" :key="meeting.id" class="event-item d-flex align-items-center mb-3">
                  <div class="event-content flex-grow-1">
                    <div class="event-title">{{ meeting.title }}</div>
                    <small class="text-muted">{{ meeting.fullDate }}</small>
                  </div>
                </div>
                
                <!-- No Meetings Message -->
                <div v-if="upcomingMeetings.length === 0" class="text-center py-3">
                  <i class="bi bi-calendar-x text-muted" style="font-size: 2rem;"></i>
                  <p class="text-muted mt-2 mb-0">No upcoming meetings this week</p>
                  <button class="btn btn-sm btn-outline-primary mt-2" @click="viewMeetings">
                    <i class="bi bi-plus-circle me-1"></i>Schedule Meeting
                  </button>
                </div>
              </div>
              
              <!-- Pagination - Fixed at bottom -->
              <div v-if="upcomingMeetings.length > 0" class="d-flex justify-content-between align-items-center p-3 border-top" style="height: 60px; flex-shrink: 0;">
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

import MeetingService from "@/services/MeetingService";
import MeetingCache from "@/services/MeetingCache";
import DebugButton from "@/components/Debug/DebugButton.vue";
import AuditService from "@/services/AuditService";
import AuthService from "@/services/AuthService";

export default {
  name: "CompanyDashboard",
  components: {
    DebugButton,
  },
  data() {
    return {
      username: "",
      isLoggingOut: false,
      // Activity tracking
      recentActivity: [],
      isLoadingActivity: false,
      currentActivityPage: 1,
      activitiesPerPage: 10,
      // Meetings tracking
      upcomingMeetings: [],
      isLoadingMeetings: false,
      currentMeetingsPage: 1,
      meetingsPerPage: 5,
      totalMeetings: 0,
      // Pagination
      totalActivityPages: 0,
      totalMeetingsPages: 0
    };
  },
      created() {
      this.username = localStorage.getItem("username") || "User";
      this.loadAuditLogs();
      this.loadMeetings();
    },
  
  // Add activated lifecycle hook to refresh data when navigating back
  activated() {
    // Always refresh audit logs when dashboard is activated
    this.loadAuditLogs();
    this.loadMeetings();
  },
  
  beforeUnmount() {
    // No event listeners to clean up
  },
  methods: {
    async loadAuditLogs() {
      // Always fetch fresh audit logs when dashboard is activated
      this.isLoadingActivity = true;
      try {
        const response = await AuditService.getAuditLogsByUser(this.username);
        const auditLogs = response.data.data; // Access the data property of ApiResponse
        
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
      // Ensure auditLogs is an array
      if (!auditLogs || !Array.isArray(auditLogs)) {
        console.warn('Audit logs is not an array:', auditLogs);
        return [];
      }
      
      // Sort by dateTriggered in descending order (latest first)
      const sortedLogs = auditLogs.sort((a, b) => 
        new Date(b.dateTriggered) - new Date(a.dateTriggered)
      );
      
      this.totalActivityPages = Math.ceil(sortedLogs.length / this.activitiesPerPage);
      
      return sortedLogs.map((log, index) => {
        const iconMapping = this.getIconForAction(log.actionMessage);
        return {
          id: log.id || (index + 1),
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
      if (page >= 1 && page <= this.totalActivityPages) {
        this.currentActivityPage = page;
      }
    },
    
    getActivityPageNumbers(totalPages, currentPage) {
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
    
    async loadMeetings() {
      // Check cache first for faster loading
      if (MeetingCache.hasAllMeetings()) {
        const allMeetings = MeetingCache.getAllMeetings();
        const thisWeekMeetings = this.filterMeetingsForCurrentWeek(allMeetings);
        this.upcomingMeetings = this.formatMeetings(thisWeekMeetings);
        this.totalMeetings = this.upcomingMeetings.length;
        this.totalMeetingsPages = Math.ceil(this.upcomingMeetings.length / this.meetingsPerPage);
        this.currentMeetingsPage = 1;
        return;
      }

      // Only fetch from API if cache is empty
      this.isLoadingMeetings = true;
      try {
        const response = await MeetingService.getAllMeetings();
        const allMeetings = response.data.data || []; // Access the data property of ApiResponse
        
        // Store in cache for faster access on other pages
        MeetingCache.setAllMeetings(allMeetings);
        
        // Filter meetings for current week only (from today onwards)
        const thisWeekMeetings = this.filterMeetingsForCurrentWeek(allMeetings);
        this.upcomingMeetings = this.formatMeetings(thisWeekMeetings);
        this.totalMeetings = this.upcomingMeetings.length;
        this.totalMeetingsPages = Math.ceil(this.upcomingMeetings.length / this.meetingsPerPage);
        // Reset pagination to first page
        this.currentMeetingsPage = 1;
      } catch (error) {
        console.error("Failed to load upcoming meetings:", error);
        this.upcomingMeetings = [];
        this.totalMeetings = 0;
        this.totalMeetingsPages = 0;
        MeetingCache.clear();
      } finally {
        this.isLoadingMeetings = false;
      }
    },

    filterMeetingsForCurrentWeek(meetings) {
      // Ensure meetings is an array
      if (!meetings || !Array.isArray(meetings)) {
        console.warn('Meetings is not an array:', meetings);
        return [];
      }
      
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
      
      // Filter meetings from today onwards within this week and sort by date/time
      return meetings
        .filter(meeting => {
          const meetingDate = new Date(meeting.meetingDate);
          const meetingDateTime = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
          
          // Only include meetings from today onwards (not past meetings)
          return meetingDateTime >= now && meetingDate <= endOfWeek;
        })
        .sort((a, b) => {
          // Sort by date and time in ascending order (earliest first)
          const dateA = new Date(`${a.meetingDate}T${a.meetingTime}`);
          const dateB = new Date(`${b.meetingDate}T${b.meetingTime}`);
          return dateA - dateB;
        });
    },

    formatMeetings(meetings) {
      if (!meetings || !Array.isArray(meetings)) return [];
      
      return meetings.map(meeting => {
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
            localStorage.removeItem("accountId");
            localStorage.removeItem("meetings_cache");
            localStorage.removeItem("meetings_last_fetch");
        
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
    paginatedActivity() {
      if (!Array.isArray(this.recentActivity)) {
        return [];
      }
      const startIndex = (this.currentActivityPage - 1) * this.activitiesPerPage;
      const endIndex = startIndex + this.activitiesPerPage;
      return this.recentActivity.slice(startIndex, endIndex);
    },
    paginatedMeetings() {
      if (!Array.isArray(this.upcomingMeetings)) {
        return [];
      }
      const startIndex = (this.currentMeetingsPage - 1) * this.meetingsPerPage;
      const endIndex = startIndex + this.meetingsPerPage;
      return this.upcomingMeetings.slice(startIndex, endIndex);
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
  background: linear-gradient(135deg,  #2da6f8 0%, #ffffff 100%);
  color: white;
}

.header-container h1,
.header-container p {
  color: white !important;
}

.overview-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.feature-item {
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.feature-item i {
  display: block;
  margin-bottom: 0.5rem;
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

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background-color: #f8f9fa;
}

.activity-text {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.meeting-item {
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  border-left: 4px solid transparent;
}

.meeting-item:hover {
  background-color: #f8f9fa;
}

.meeting-item.urgent {
  border-left-color: #dc3545;
  background-color: #fff5f5;
}

.meeting-item.important {
  border-left-color: #fd7e14;
  background-color: #fff8f0;
}

.meeting-item.normal {
  border-left-color: #20c997;
  background-color: #f0fffd;
}

.meeting-time {
  font-weight: 600;
  color: #495057;
}

.meeting-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.meeting-participants {
  font-size: 0.875rem;
  color: #6c757d;
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
.page-link {
  border: none;
  color: #6c757d;
  padding: 0.375rem 0.75rem;
}

.page-link:hover {
  background-color: #e9ecef;
  color: #495057;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: transparent;
}

.stats-icon {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 