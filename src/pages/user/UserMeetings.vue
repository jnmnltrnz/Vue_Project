<template>
  <div class="user-meetings-page">
    <!-- Header with Navigation -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">My Meetings</h1>
            <p class="mb-0 text-muted">View all meetings you're invited to</p>
          </div>
          <div class="d-flex gap-2">
            <button 
              class="btn btn-outline-primary" 
              @click="viewProjects"
            >
              <i class="bi bi-kanban me-2"></i>My Projects
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
        <p class="mt-3 text-muted">Loading your meetings...</p>
      </div>

      <!-- No Meetings -->
      <div v-else-if="meetings.length === 0" class="text-center py-5">
        <div class="card shadow-sm mx-auto" style="max-width: 600px;">
          <div class="card-body py-5">
            <i class="bi bi-calendar-x text-muted" style="font-size: 4rem;"></i>
            <h3 class="mt-3 text-muted">No Meetings Found</h3>
            <p class="text-muted">You haven't been invited to any meetings yet.</p>
            <p class="text-muted">Check back later for upcoming meetings.</p>
          </div>
        </div>
      </div>

      <!-- Meetings List -->
      <div v-else class="row">
        <div v-for="meeting in meetings" :key="meeting.id" class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="meeting-card h-100">
            <div class="card-header-section" :class="getStatusColorClass(meeting.status)">
              <div class="d-flex justify-content-between align-items-start">
                <div class="meeting-title">
                  <h6 class="mb-1 fw-bold text-white">{{ meeting.title }}</h6>
                  <small class="text-white-50">{{ meeting.createdBy || 'Unknown' }}</small>
                </div>
                <span class="status-badge" :class="getStatusBadgeClass(meeting.status)">
                  {{ meeting.status.replace('_', ' ') }}
                </span>
              </div>
            </div>
            
            <div class="card-body-section">
              <div class="meeting-details">
                <div class="detail-item">
                  <i class="bi bi-calendar3 text-primary"></i>
                  <span class="detail-text">{{ formatDate(meeting.meetingDate) }}</span>
                </div>
                <div class="detail-item">
                  <i class="bi bi-clock text-primary"></i>
                  <span class="detail-text">{{ formatTime(meeting.meetingTime) }}</span>
                </div>
                
                <div v-if="meeting.notes" class="detail-item notes-section">
                  <i class="bi bi-chat-text text-primary"></i>
                  <span class="detail-text">{{ meeting.notes }}</span>
                </div>
              </div>

              <div class="invitees-section">
                <div class="invitees-header">
                  <i class="bi bi-people text-muted"></i>
                  <small class="text-muted">Invitees ({{ meeting.invitees ? meeting.invitees.length : 0 }})</small>
                </div>
                <div v-if="meeting.invitees && meeting.invitees.length > 0" class="invitees-list">
                  <div v-for="invitee in meeting.invitees.slice(0, 3)" :key="invitee.id" class="invitee-item">
                    <div class="invitee-avatar">
                      {{ getInitials(invitee.firstName, invitee.lastName) }}
                    </div>
                    <span class="invitee-name">{{ invitee.firstName }} {{ invitee.lastName }}</span>
                  </div>
                  <div v-if="meeting.invitees.length > 3" class="more-invitees">
                    +{{ meeting.invitees.length - 3 }} more
                  </div>
                </div>
                <div v-else class="no-invitees">
                  <small class="text-muted">No invitees</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Meeting Status Update Modal -->
      <div
        :class="['modal fade', { show: showStatusModal }]"
        tabindex="-1"
        :style="{
          display: showStatusModal ? 'block' : 'none',
          background: showStatusModal ? 'rgba(0,0,0,0.3)' : '',
        }"
        role="dialog"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header" :class="statusModalType === 'success' ? 'bg-success text-white' : 'bg-warning text-dark'">
              <h5 class="modal-title">
                <i :class="statusModalType === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'" class="me-2"></i>
                {{ statusModalTitle }}
              </h5>
              <button type="button" class="btn-close" :class="statusModalType === 'success' ? 'btn-close-white' : ''" @click="closeStatusModal"></button>
            </div>
            <div class="modal-body">
              <p>{{ statusModalMessage }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeStatusModal">Close</button>
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
import MeetingService from "@/services/MeetingService";

export default {
  name: "UserMeetingsPage",
  data() {
    return {
      username: "",
      accountId: null,
      isLoggingOut: false,
      isLoading: false,
      meetings: [],
      updatingStatus: null,
      showStatusModal: false,
      statusModalTitle: "",
      statusModalMessage: "",
      statusModalType: "success"
    };
  },
  created() {
    this.username = localStorage.getItem("username") || "User";
    this.accountId = localStorage.getItem("accountId");
    this.loadMeetings();
  },
  methods: {
    async loadMeetings() {
      this.isLoading = true;
      try {
        if (this.accountId) {
          const response = await MeetingService.getMeetingsByEmployeeId(this.accountId);
          this.meetings = response.data.data || [];
        } else {
          this.meetings = [];
        }
      } catch (error) {
        console.error("Error loading meetings:", error);
        this.meetings = [];
      } finally {
        this.isLoading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Not set';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatTime(timeString) {
      if (!timeString) return 'Not set';
      return timeString;
    },

    getStatusBadgeClass(status) {
      switch (status) {
        case 'SCHEDULED':
          return 'bg-primary';
        case 'COMPLETED':
          return 'bg-success';
        case 'CANCELLED':
          return 'bg-danger';
        case 'ONGOING':
          return 'bg-warning';
        default:
          return 'bg-secondary';
      }
    },

    getStatusColorClass(status) {
      switch (status) {
        case 'SCHEDULED':
          return 'bg-primary';
        case 'COMPLETED':
          return 'bg-success';
        case 'CANCELLED':
          return 'bg-danger';
        case 'ONGOING':
          return 'bg-warning';
        default:
          return 'bg-secondary';
      }
    },

    getInitials(firstName, lastName) {
      const first = firstName ? firstName.charAt(0).toUpperCase() : '';
      const last = lastName ? lastName.charAt(0).toUpperCase() : '';
      return first + last;
    },
    closeStatusModal() {
      this.showStatusModal = false;
    },

    viewProjects() {
      this.$router.push({ name: 'Projects' });
    },

    async logout() {
      this.isLoggingOut = true;
      try {
        await AuthService.logout();
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error("Error during logout:", error);
        // Still redirect to login even if logout fails
        this.$router.push({ name: 'Login' });
      } finally {
        this.isLoggingOut = false;
      }
    }
  }
};
</script>

<style scoped>
.user-meetings-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.header-container {
  background: linear-gradient(135deg, #667eea 0%, #ffffff 100%);
  color: white;
}

.header-container h1,
.header-container p {
  color: white !important;
}

.meeting-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.meeting-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header-section {
  padding: 1.25rem;
  color: white;
  position: relative;
}

.meeting-title h6 {
  font-size: 1rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.status-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-body-section {
  padding: 1.25rem;
}

.meeting-details {
  margin-bottom: 1.25rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
}

.detail-item i {
  font-size: 1rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.detail-text {
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.4;
}

.notes-section .detail-text {
  font-style: italic;
  color: #6c757d;
}

.invitees-section {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.invitees-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.invitees-header i {
  font-size: 0.875rem;
}

.invitees-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.invitee-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.invitee-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.invitee-name {
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
}

.more-invitees {
  font-size: 0.75rem;
  color: #6c757d;
  font-style: italic;
  margin-left: 2.75rem;
}

.no-invitees {
  text-align: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.badge {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
}

.team-member-badge {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  border: 1px solid rgba(13, 110, 253, 0.2);
}

.employee-list-item {
  border: 1px solid #dee2e6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.employee-list-item:hover {
  background-color: #f8f9fa;
  border-color: #0d6efd;
}

.employee-list-item.selected {
  background-color: #e7f3ff;
  border-color: #0d6efd;
}

.invitee-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin: 0.25rem;
}

.btn-close {
  padding: 0.25rem;
  font-size: 0.75rem;
}

.modal.show {
  display: block !important;
}

@media (max-width: 768px) {
  .header-container .d-flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .card-body-section {
    padding: 1rem;
  }
  
  .meeting-card {
    margin-bottom: 1rem;
  }
}
</style>
