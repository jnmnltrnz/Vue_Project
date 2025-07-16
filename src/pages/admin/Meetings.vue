<template>
  <div class="meetings-page">
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">Meetings</h1>
            <p class="mb-0 text-muted">Schedule and view upcoming meetings</p>
          </div>
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

    <div class="container mt-4">
      <!-- Schedule Meeting Form -->
      <div class="card shadow meeting-form-card mb-4">
        <div class="card-header bg-light rounded-top">
          <h5 class="mb-0">
            <i class="bi bi-calendar-plus me-2"></i>
            {{ editingMeeting ? 'Edit Meeting' : 'Schedule a Meeting' }}
          </h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="scheduleMeeting">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label fw-semibold">Title</label>
                <input
                  v-model="meetingForm.title"
                  type="text"
                  class="form-control form-control-lg"
                  required
                  placeholder="Meeting Title"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Date</label>
                <input
                  v-model="meetingForm.date"
                  type="date"
                  class="form-control form-control-lg"
                  required
                />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Time</label>
                <input
                  v-model="meetingForm.time"
                  type="time"
                  class="form-control form-control-lg"
                  required
                />
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-12">
                <label class="form-label fw-semibold">Invite Employees</label>
                <div class="d-flex flex-wrap gap-2 mb-2">
                  <span
                    v-for="id in meetingForm.invitees"
                    :key="id"
                    class="badge bg-primary invitee-chip"
                  >
                    <i class="bi bi-person-circle me-1"></i>
                    {{ getEmployeeName(id) }}
                    <button
                      type="button"
                      class="btn btn-sm btn-close ms-1"
                      @click="removeInvitee(id)"
                    ></button>
                  </span>
                </div>
                
              </div>
            </div>
            <!-- Error Message -->
            <div v-if="error" class="mt-3">
              <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
              </div>
            </div>

            <div class="mt-4 d-flex justify-content-end">
             
              <button
                v-if="editingMeeting"
                type="button"
                class="btn btn-secondary btn-lg px-4 me-2"
                @click="cancelEdit"
              >
                Cancel Edit
              </button>
              <button
                  type="button"
                  class="btn btn-outline-info btn-lg px-4 me-2"
                  @click="openInviteModal"
                >
                  <i class="bi bi-person-plus me-1"></i>
                  Invite Employees
                </button>
              <button
                type="submit"
                class="btn btn-success btn-lg px-4"
                :disabled="!canSchedule || loading"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                <i v-else class="bi bi-calendar-plus me-2"></i>
                {{ loading ? (editingMeeting ? "Updating..." : "Scheduling...") : (editingMeeting ? "Update Meeting" : "Schedule Meeting") }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Invite Employees Modal -->
      <div
        class="modal fade"
        :class="{ show: showInviteModal }"
        tabindex="-1"
        :style="{
          display: showInviteModal ? 'block' : 'none',
          background: showInviteModal ? 'rgba(0,0,0,0.3)' : '',
        }"
        role="dialog"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header bg-info text-white">
              <h5 class="modal-title">
                <i class="bi bi-person-plus me-2"></i>
                Invite Employees
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="closeInviteModal"
              ></button>
            </div>
            <div class="modal-body">
              <div class="d-flex mb-3 align-items-center gap-2">
                <input
                  v-model="employeeSearch"
                  type="text"
                  class="form-control"
                  placeholder="Search employees..."
                />
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="toggleSelectAll"
                >
                  <i class="bi bi-check2-all me-1"></i>
                  {{ allSelected ? "Deselect All" : "Select All" }}
                </button>
              </div>
              <div class="row" style="max-height: 350px; overflow-y: auto">
                <div
                  v-for="employee in filteredEmployees"
                  :key="employee.id"
                  class="col-md-6 mb-2"
                >
                  <div
                    class="employee-list-item p-2 rounded d-flex align-items-center gap-2"
                    :class="{ selected: tempInvitees.includes(employee.id) }"
                    @click="toggleInvitee(employee.id)"
                  >
                    <div class="flex-grow-1">
                      <div class="fw-semibold">
                        {{ employee.firstName }} {{ employee.lastName }}
                      </div>
                      <div class="text-muted small">
                        {{ employee.position
                        }}<span v-if="employee.department">
                          • {{ employee.department }}</span
                        >
                      </div>
                    </div>
                    <input
                      class="form-check-input ms-2"
                      type="checkbox"
                      :checked="tempInvitees.includes(employee.id)"
                      @change.stop="toggleInvitee(employee.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeInviteModal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-info"
                @click="confirmInvitees"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cancel Meeting Modal -->
      <div
        class="modal fade"
        :class="{ show: isCancelModalVisible }"
        tabindex="-1"
        :style="{
          display: isCancelModalVisible ? 'block' : 'none',
          background: isCancelModalVisible ? 'rgba(0,0,0,0.3)' : '',
        }"
        role="dialog"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header bg-warning text-dark">
              <h5 class="modal-title">
                <i class="bi bi-x-circle me-2"></i>
                Add Cancellation Note
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="isCancelModalVisible = false"
              ></button>
            </div>
            <div class="modal-body">
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Add a cancellation note to this meeting
              </div>
              <div v-if="meetingToCancel" class="mb-3">
                <strong>Meeting:</strong> {{ meetingToCancel.title }}<br>
                <strong>Date:</strong> {{ meetingToCancel.meetingDate }}<br>
                <strong>Time:</strong> {{ formatTime(meetingToCancel.meetingTime) }}
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Cancellation Reason *</label>
                <textarea
                  v-model="cancelReason"
                  class="form-control"
                  rows="3"
                  placeholder="Please provide a reason for cancelling this meeting..."
                  required
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="isCancelModalVisible = false"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-warning"
                @click="cancelMeeting"
                :disabled="!cancelReason.trim() || loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Add Cancellation Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Meeting Modal -->
      <div
        class="modal fade"
        :class="{ show: isDeleteModalVisible }"
        tabindex="-1"
        :style="{
          display: isDeleteModalVisible ? 'block' : 'none',
          background: isDeleteModalVisible ? 'rgba(0,0,0,0.3)' : '',
        }"
        role="dialog"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title">
                <i class="bi bi-trash me-2"></i>
                Delete Meeting
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="isDeleteModalVisible = false"
              ></button>
            </div>
            <div class="modal-body">
              <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Warning:</strong> This action cannot be undone!
              </div>
              <div v-if="meetingToDelete" class="mb-3">
                <strong>Meeting:</strong> {{ meetingToDelete.title }}<br>
                <strong>Date:</strong> {{ meetingToDelete.meetingDate }}<br>
                <strong>Time:</strong> {{ formatTime(meetingToDelete.meetingTime) }}
              </div>
              <p class="text-muted">
                Are you sure you want to permanently delete this meeting? This action will remove the meeting from the system and cannot be reversed.
              </p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="isDeleteModalVisible = false"
              >
                Keep Meeting
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="deleteMeeting"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Delete Meeting
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast for feedback -->
      <div
        v-if="showToast"
        class="toast align-items-center text-bg-success border-0 show position-fixed bottom-0 end-0 m-4"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style="z-index: 9999; min-width: 250px"
      >
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-check-circle me-2"></i>
            {{ toastMessage }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="showToast = false"
          ></button>
        </div>
      </div>

      <!-- Calendar View -->
      <div class="card shadow-sm">
        <div class="card-header bg-light">
          <h5 class="mb-0">
            <i class="bi bi-calendar-event me-2"></i>Upcoming Meetings
          </h5>
        </div>
        <div class="card-body">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading meetings...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-4">
            <div class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
              <button
                class="btn btn-sm btn-outline-danger ms-2"
                @click="loadMeetings"
              >
                Retry
              </button>
            </div>
          </div>

          <!-- Meetings Table -->
          <div v-else class="calendar-view table-container">
            <table class="table table-bordered align-middle">
              <thead>
                <tr>
                  <th><i class="bi bi-calendar-date me-1"></i>Date</th>
                  <th><i class="bi bi-clock me-1"></i>Time</th>
                  <th><i class="bi bi-chat-left-text me-1"></i>Title</th>
                  <th><i class="bi bi-people me-1"></i>Invitees</th>
                  <th>Status</th>
                  <th><i class="bi bi-sticky me-1"></i>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="meeting in paginatedUpcomingMeetings" :key="meeting.id">
                  <td>{{ meeting.meetingDate }}</td>
                  <td>{{ formatTime(meeting.meetingTime) }}</td>
                  <td>
                    <span class="meeting-title-badge" :title="meeting.title">
                      <i class="bi bi-calendar3-event me-1"></i>
                      <span class="meeting-title-text">{{
                        truncateTitle(meeting.title)
                      }}</span>
                    </span>
                  </td>
                  <td>
                    <span
                      v-for="invitee in (meeting.invitees || [])"
                      :key="invitee.id"
                      class="badge bg-primary me-1 mb-1"
                    >
                      <i class="bi bi-person-circle me-1"></i
                      >{{ invitee.firstName }} {{ invitee.lastName }}
                    </span>
                    <span v-if="!meeting.invitees || meeting.invitees.length === 0" class="text-muted small">
                      No invitees
                    </span>
                  </td>
                  <td>
                    <span :class="['badge', meetingStatus(meeting)]">
                      <i :class="meetingStatusIcon(meeting)" class="me-1"></i>
                      {{ meetingStatusLabel(meeting) }}
                    </span>
                  </td>
                  <td>
                    <span v-if="meeting.notes" :class="['badge', meeting.notes != null ? 'bg-danger' : 'bg-info', 'text-white']">
                      <i class="bi bi-sticky me-1"></i>
                      {{ meeting.notes }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm" role="group">
                      <button 
                        class="btn btn-outline-primary" 
                        @click="editMeeting(meeting)"
                        title="Edit Meeting"
                      >
                        ✏️
                      </button>
                      <button 
                        class="btn btn-outline-warning" 
                        @click="showCancelModal(meeting)"
                        title="Cancel Meeting"
                      >
                        ❌
                      </button>
                      <button 
                        class="btn btn-outline-danger" 
                        @click="showDeleteModal(meeting)"
                        title="Delete Meeting"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedUpcomingMeetings.length === 0">
                  <td colspan="7" class="text-center text-muted">
                    No meetings scheduled
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Upcoming Meetings Pagination -->
          <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="text-muted">
              <span v-if="sortedMeetings.length > 0">
                Showing {{ (currentUpcomingPage - 1) * meetingsPerPage + 1 }} to 
                {{ Math.min(currentUpcomingPage * meetingsPerPage, sortedMeetings.length) }} 
                of {{ sortedMeetings.length }} upcoming meetings
              </span>
              <span v-else>
                No upcoming meetings
              </span>
            </div>
            <nav v-if="sortedMeetings.length > 0" aria-label="Upcoming meetings pagination">
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" :class="{ disabled: currentUpcomingPage === 1 }">
                  <button class="page-link" @click="changeUpcomingPage(currentUpcomingPage - 1)" :disabled="currentUpcomingPage === 1">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li v-for="page in getPageNumbers(totalUpcomingPages, currentUpcomingPage)" :key="page" class="page-item" :class="{ active: page === currentUpcomingPage }">
                  <button class="page-link" @click="changeUpcomingPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentUpcomingPage === totalUpcomingPages }">
                  <button class="page-link" @click="changeUpcomingPage(currentUpcomingPage + 1)" :disabled="currentUpcomingPage === totalUpcomingPages">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- Past Meetings Section -->
      <div class="card shadow-sm mt-4 past-meetings-card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-clock-history me-2"></i>Past Meetings
          </h5>
        </div>
        <div class="card-body">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading meetings...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-4">
            <div class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
              <button
                class="btn btn-sm btn-outline-danger ms-2"
                @click="loadMeetings"
              >
                Retry
              </button>
            </div>
          </div>

          <!-- Past Meetings Table -->
          <div v-else class="calendar-view table-container">
            <table class="table table-bordered align-middle">
              <thead>
                <tr>
                  <th><i class="bi bi-calendar-date me-1"></i>Date</th>
                  <th><i class="bi bi-clock me-1"></i>Time</th>
                  <th><i class="bi bi-chat-left-text me-1"></i>Title</th>
                  <th><i class="bi bi-people me-1"></i>Invitees</th>
                  <th>Status</th>
                  <th><i class="bi bi-sticky me-1"></i>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="meeting in paginatedPastMeetings" :key="meeting.id">
                  <td>{{ meeting.meetingDate }}</td>
                  <td>{{ formatTime(meeting.meetingTime) }}</td>
                  <td>
                    <span class="meeting-title-badge" :title="meeting.title">
                      <i class="bi bi-calendar3-event me-1"></i>
                      <span class="meeting-title-text">{{
                        truncateTitle(meeting.title)
                      }}</span>
                    </span>
                  </td>
                  <td>
                    <span
                      v-for="invitee in (meeting.invitees || [])"
                      :key="invitee.id"
                      class="badge bg-secondary me-1 mb-1"
                    >
                      <i class="bi bi-person-circle me-1"></i
                      >{{ invitee.firstName }} {{ invitee.lastName }}
                    </span>
                    <span v-if="!meeting.invitees || meeting.invitees.length === 0" class="text-muted small">
                      No invitees
                    </span>
                  </td>
                  <td>
                    <span :class="['badge', meetingStatus(meeting)]">
                      <i :class="meetingStatusIcon(meeting)" class="me-1"></i>
                      {{ meetingStatusLabel(meeting) }}
                    </span>
                  </td>
                  <td>
                    <span v-if="meeting.notes" :class="['badge', meeting.notes.startsWith('CANCELLED:') ? 'bg-danger' : 'bg-info', 'text-white']">
                      <i class="bi bi-sticky me-1"></i>
                      {{ meeting.notes }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm" role="group">
                      <button 
                        class="btn btn-outline-danger" 
                        @click="showDeleteModal(meeting)"
                        title="Delete Meeting"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedPastMeetings.length === 0">
                  <td colspan="7" class="text-center text-muted">
                    No past meetings found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Past Meetings Pagination -->
          <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="text-muted">
              <span v-if="pastMeetings.length > 0">
                Showing {{ (currentPastPage - 1) * meetingsPerPage + 1 }} to 
                {{ Math.min(currentPastPage * meetingsPerPage, pastMeetings.length) }} 
                of {{ pastMeetings.length }} past meetings
              </span>
              <span v-else>
                No past meetings
              </span>
            </div>
            <nav v-if="pastMeetings.length > 0" aria-label="Past meetings pagination">
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" :class="{ disabled: currentPastPage === 1 }">
                  <button class="page-link" @click="changePastPage(currentPastPage - 1)" :disabled="currentPastPage === 1">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li v-for="page in getPageNumbers(totalPastPages, currentPastPage)" :key="page" class="page-item" :class="{ active: page === currentPastPage }">
                  <button class="page-link" @click="changePastPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPastPage === totalPastPages }">
                  <button class="page-link" @click="changePastPage(currentPastPage + 1)" :disabled="currentPastPage === totalPastPages">
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
</template>

<script>
import EmployeeService from "@/services/EmployeeService";
import MeetingService from "@/services/MeetingService";
import MeetingCache from "@/services/MeetingCache";

export default {
  name: "MeetingsPage",
  data() {
    return {
      employees: [],
      meetings: [],
      meetingForm: {
        title: "",
        date: "",
        time: "",
        invitees: [],
      },
      showInviteModal: false,
      tempInvitees: [],
      employeeSearch: "",
      showToast: false,
      toastMessage: "",
      loading: false,
      error: null,
      // Edit/Cancel functionality
      editingMeeting: null,
      isCancelModalVisible: false,
      cancelReason: "",
      meetingToCancel: null,
      // Delete functionality
      isDeleteModalVisible: false,
      meetingToDelete: null,
      // Pagination
      currentUpcomingPage: 1,
      currentPastPage: 1,
      meetingsPerPage: 5,
    };
  },
  computed: {
    sortedMeetings() {
      // Ensure meetings is an array
      if (!this.meetings || !Array.isArray(this.meetings)) {
        return [];
      }
      
      // Filter upcoming meetings and sort by date and time ascending
      const now = new Date();
      return this.meetings
        .filter(meeting => {
          const meetingDate = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
          return meetingDate >= now;
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.meetingDate}T${a.meetingTime}`);
          const dateB = new Date(`${b.meetingDate}T${b.meetingTime}`);
          return dateA - dateB;
        });
    },
    filteredEmployees() {
      if (!this.employees || !Array.isArray(this.employees)) {
        return [];
      }
      if (!this.employeeSearch) return this.employees;
      const search = this.employeeSearch.toLowerCase();
      return this.employees.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(search) ||
          emp.lastName.toLowerCase().includes(search) ||
          emp.position?.toLowerCase().includes(search) ||
          emp.department?.toLowerCase().includes(search)
      );
    },
    canSchedule() {
      return (
        this.meetingForm.title &&
        this.meetingForm.date &&
        this.meetingForm.time &&
        Array.isArray(this.meetingForm.invitees) &&
        this.meetingForm.invitees.length > 0
      );
    },
    allSelected() {
      return (
        Array.isArray(this.filteredEmployees) &&
        this.filteredEmployees.length > 0 &&
        this.filteredEmployees.every((emp) =>
          this.tempInvitees.includes(emp.id)
        )
      );
    },
    pastMeetings() {
      // Ensure meetings is an array
      if (!this.meetings || !Array.isArray(this.meetings)) {
        return [];
      }
      
      const now = new Date();
      return this.meetings
        .filter(meeting => {
          const meetingDate = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
          return meetingDate < now;
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.meetingDate}T${a.meetingTime}`);
          const dateB = new Date(`${b.meetingDate}T${b.meetingTime}`);
          return dateB - dateA; // Sort in descending order (most recent first)
        });
    },
    paginatedUpcomingMeetings() {
      if (!Array.isArray(this.sortedMeetings)) {
        return [];
      }
      const startIndex = (this.currentUpcomingPage - 1) * this.meetingsPerPage;
      const endIndex = startIndex + this.meetingsPerPage;
      return this.sortedMeetings.slice(startIndex, endIndex);
    },
    paginatedPastMeetings() {
      if (!Array.isArray(this.pastMeetings)) {
        return [];
      }
      const startIndex = (this.currentPastPage - 1) * this.meetingsPerPage;
      const endIndex = startIndex + this.meetingsPerPage;
      return this.pastMeetings.slice(startIndex, endIndex);
    },
    totalUpcomingPages() {
      return Array.isArray(this.sortedMeetings) ? Math.ceil(this.sortedMeetings.length / this.meetingsPerPage) : 0;
    },
    totalPastPages() {
      return Array.isArray(this.pastMeetings) ? Math.ceil(this.pastMeetings.length / this.meetingsPerPage) : 0;
    }
  },
  created() {
    this.loadEmployees();
    this.loadMeetings();
  },
  methods: {
    async loadEmployees() {
      try {
        const response = await EmployeeService.getAllEmployees();
        this.employees = response.data.data || []; // Access the data property of ApiResponse
      } catch (error) {
        this.employees = [];
        console.error("Error loading employees:", error);
      }
    },
    async loadMeetings() {
      try {
        this.loading = true;
        this.error = null;
        
        // Check cache first
        if (MeetingCache.hasAllMeetings()) {
          this.meetings = MeetingCache.getAllMeetings();
        } else {
          // Fetch from API if cache is empty or expired
          const response = await MeetingService.getAllMeetings();
          this.meetings = response.data.data || [];
          MeetingCache.setAllMeetings(this.meetings);
        }
        
        // Reset pagination to first page
        this.currentUpcomingPage = 1;
        this.currentPastPage = 1;
      } catch (error) {
        this.meetings = [];
        console.error("Error loading meetings:", error);
        this.error = "Failed to load meetings";
        MeetingCache.clear();
      } finally {
        this.loading = false;
      }
    },
    
    async refreshMeetings() {
      try {
        this.loading = true;
        this.error = null;
        
        // Clear cache and force fetch from API
        MeetingCache.clear();
        const response = await MeetingService.getAllMeetings();
        this.meetings = response.data.data || [];
        MeetingCache.setAllMeetings(this.meetings);
        
        // Reset pagination to first page
        this.currentUpcomingPage = 1;
        this.currentPastPage = 1;
      } catch (error) {
        this.meetings = [];
        console.error("Error refreshing meetings:", error);
        this.error = "Failed to refresh meetings";
        MeetingCache.clear();
      } finally {
        this.loading = false;
      }
    },
    
    async scheduleMeeting() {
      try {
        this.loading = true;
        this.error = null;
        const username = localStorage.getItem("username");

        const meetingData = {
          title: this.meetingForm.title,
          date:  this.meetingForm.date,
          time: this.meetingForm.time.length === 5 ? this.meetingForm.time + ':00' : this.meetingForm.time, // ensure 'HH:mm:ss'
          notes: "",
          inviteeIds: this.meetingForm.invitees || []
        };

        if (this.editingMeeting) {
          await MeetingService.updateMeeting(
            this.editingMeeting.id,
            meetingData,
            username
          );
          // Force refresh meetings list to get updated data
          await this.refreshMeetings();
          // Dispatch event for dashboard
          window.dispatchEvent(new CustomEvent('meeting-updated'));
        } else {
          await MeetingService.createMeeting(
            meetingData,
            username
          );
          // Force refresh meetings list to get new meeting
          await this.refreshMeetings();
          // Dispatch event for dashboard
          window.dispatchEvent(new CustomEvent('meeting-added'));
        }

        // Reset form
        this.meetingForm = {
          title: "",
          date: "",
          time: "",
          invitees: [],
        };
        
        const wasEditing = this.editingMeeting;
        this.editingMeeting = null;

        // Reset pagination to first page after adding/updating
        this.currentUpcomingPage = 1;
        this.currentPastPage = 1;

        this.showToastMessage(wasEditing ? 'Meeting updated successfully!' : 'Meeting scheduled successfully!');
      } catch (error) {
        console.error("Error scheduling meeting:", error);
        this.error = "Failed to schedule meeting";
      } finally {
        this.loading = false;
      }
    },
    removeInvitee(id) {
      if (Array.isArray(this.meetingForm.invitees)) {
        this.meetingForm.invitees = this.meetingForm.invitees.filter(
          (eid) => eid !== id
        );
      }
    },
    confirmInvitees() {
      this.meetingForm.invitees = [...this.tempInvitees];
      this.showInviteModal = false;
      this.tempInvitees = []; // Reset selections after confirming
    },
    toggleInvitee(id) {
      if (!Array.isArray(this.tempInvitees)) {
        this.tempInvitees = [];
      }
      if (this.tempInvitees.includes(id)) {
        this.tempInvitees = this.tempInvitees.filter((eid) => eid !== id);
      } else {
        this.tempInvitees.push(id);
      }
    },
    toggleSelectAll() {
      if (!Array.isArray(this.tempInvitees)) {
        this.tempInvitees = [];
      }
      if (this.allSelected) {
        this.tempInvitees = [];
      } else {
        this.tempInvitees = Array.isArray(this.filteredEmployees) ? this.filteredEmployees.map((emp) => emp.id) : [];
      }
    },
    getEmployeeName(id) {
      if (!this.employees || !Array.isArray(this.employees)) {
        return `ID ${id}`;
      }
      const emp = this.employees.find((e) => e.id === id);
      return emp ? `${emp.firstName} ${emp.lastName}` : `ID ${id}`;
    },
    getInviteeNames(invitees) {
      if (!invitees || !Array.isArray(invitees)) return [];
      return invitees.map((emp) => `${emp.firstName} ${emp.lastName}`);
    },
    meetingStatus(meeting) {
      if (meeting.status === 'CANCELLED') return 'bg-danger';
      if (meeting.status === 'COMPLETED') return 'bg-success';
      const now = new Date();
      const meetingDate = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
      if (meetingDate > now) return 'bg-info';
      if (meetingDate.toDateString() === now.toDateString()) return 'bg-warning';
      return 'bg-secondary';
    },
    meetingStatusLabel(meeting) {
      if (meeting.status === 'CANCELLED') return 'Cancelled';
      if (meeting.status === 'COMPLETED') return 'Completed';
      const now = new Date();
      const meetingDate = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
      if (meetingDate > now) return 'Upcoming';
      if (meetingDate.toDateString() === now.toDateString()) return 'Today';
      return 'Past';
    },
    meetingStatusIcon(meeting) {
      if (meeting.status === 'CANCELLED') return 'bi bi-x-octagon';
      if (meeting.status === 'COMPLETED') return 'bi bi-check-circle';
      const now = new Date();
      const meetingDate = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
      if (meetingDate > now) return 'bi bi-calendar-event';
      if (meetingDate.toDateString() === now.toDateString()) return 'bi bi-clock-history';
      return 'bi bi-clock';
    },
    truncateTitle(title) {
      const maxLen = 28;
      if (!title) return "";
      return title.length > maxLen ? title.slice(0, maxLen) + "…" : title;
    },
    formatTime(timeString) {
      if (!timeString) return "";
      const timeParts = timeString.split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? ' PM' : ' AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes}${ampm}`;
    },
    editMeeting(meeting) {
      this.editingMeeting = meeting;
      this.meetingForm = {
        title: meeting.title,
        date: meeting.meetingDate,
        time: meeting.meetingTime,
        invitees: Array.isArray(meeting.invitees) ? meeting.invitees.map(invitee => invitee.id) : [],
      };
      this.tempInvitees = [...this.meetingForm.invitees];
      // Scroll to form
      document.querySelector('.meeting-form-card').scrollIntoView({ behavior: 'smooth' });
    },
    cancelEdit() {
      this.editingMeeting = null;
      this.meetingForm = {
        title: "",
        date: "",
        time: "",
        invitees: [],
      };
      this.tempInvitees = [];
      // Scroll to form
      document.querySelector('.meeting-form-card').scrollIntoView({ behavior: 'smooth' });
    },
    showCancelModal(meeting) {
      this.meetingToCancel = meeting;
      this.cancelReason = "";
      this.isCancelModalVisible = true;
    },
    async cancelMeeting() {
      if (!this.cancelReason.trim()) {
        alert("Please provide a reason for cancellation.");
        return;
      }
      
      try {
        this.loading = true;
        const username = localStorage.getItem("username");
        
        // Update meeting notes with cancellation reason
        const meetingData = {
          title: this.meetingToCancel.title,
          date: this.meetingToCancel.meetingDate, // use meetingToCancel.meetingDate for cancel
          time: (this.meetingToCancel.meetingTime && this.meetingToCancel.meetingTime.length === 5) ? this.meetingToCancel.meetingTime + ':00' : this.meetingToCancel.meetingTime,
          notes: this.cancelReason,
          inviteeIds: this.meetingToCancel.invitees ? this.meetingToCancel.invitees.map(invitee => invitee.id) : []
        };
        
        await MeetingService.updateMeeting(this.meetingToCancel.id, meetingData, username);
        await MeetingService.updateMeetingStatus(this.meetingToCancel.id,'CANCELLED',username)
        
        // Force refresh meetings list to get updated data
        await this.refreshMeetings();
        
        this.isCancelModalVisible = false;
        this.meetingToCancel = null;
        this.cancelReason = "";
        
        // Show success message
        this.showToastMessage('Meeting cancelled successfully!');
      } catch (error) {
        console.error("Error cancelling meeting:", error);
        this.error = "Failed to cancel meeting";
      } finally {
        this.loading = false;
      }
    },
    showDeleteModal(meeting) {
      this.meetingToDelete = meeting;
      this.isDeleteModalVisible = true;
    },
    async deleteMeeting() {
      if (!this.meetingToDelete) return;

      try {
        this.loading = true;
        const username = localStorage.getItem("username");

        await MeetingService.deleteMeeting(this.meetingToDelete.id, username);

        // Force refresh meetings list to get updated data
        await this.refreshMeetings();
        // Dispatch event for dashboard
        window.dispatchEvent(new CustomEvent('meeting-deleted'));

        this.isDeleteModalVisible = false;
        this.meetingToDelete = null;

        // Reset pagination to first page after deleting
        this.currentUpcomingPage = 1;
        this.currentPastPage = 1;

        this.showToastMessage('Meeting deleted successfully!');
      } catch (error) {
        console.error("Error deleting meeting:", error);
        this.error = "Failed to delete meeting";
      } finally {
        this.loading = false;
      }
    },
    openInviteModal() {
      this.showInviteModal = true;
      // If editing, pre-select current invitees, otherwise reset selections
      this.tempInvitees = this.editingMeeting ? [...this.meetingForm.invitees] : [];
    },
    closeInviteModal() {
      this.showInviteModal = false;
      this.tempInvitees = []; // Reset selections when modal closes
    },
    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => (this.showToast = false), 2500);
    },
    changeUpcomingPage(page) {
      if (page >= 1 && page <= this.totalUpcomingPages) {
        this.currentUpcomingPage = page;
      }
    },
    changePastPage(page) {
      if (page >= 1 && page <= this.totalPastPages) {
        this.currentPastPage = page;
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
  },
};
</script>

<style scoped>
.meetings-page {
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

.meeting-form-card {
  border-radius: 1rem;
  overflow: hidden;
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

.invitee-chip {
  font-size: 1em;
  padding: 0.5em 0.75em;
  display: flex;
  align-items: center;
}

.employee-list-item {
  cursor: pointer;
  border: 1px solid #e3e6f0;
  background: #f8f9fa;
  transition: background 0.2s, border 0.2s;
}
.employee-list-item.selected {
  background: #e3f2fd;
  border-color: #007bff;
}
.employee-list-item:hover {
  background: #e9ecef;
}

.avatar {
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-view {
  overflow-x: auto;
}

.table-container {
  height: 400px;
  overflow-y: auto;
}

.table-container table {
  margin-bottom: 0;
}

.table-container thead {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 1;
}

.table th,
.table td {
  vertical-align: middle;
}

.toast {
  font-size: 1.1rem;
  border-radius: 0.75rem;
}
.meeting-title-badge {
  display: inline-flex;
  align-items: center;
  background: #e3f2fd;
  color: #1565c0;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 0.5rem;
  padding: 0.35em 0.75em;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meeting-title-text {
  font-size: 1.08em;
  font-weight: 700;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.past-meetings-card .card-header {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
}

.past-meetings-card .table {
  background-color: rgba(255, 255, 255, 0.8);
}

.past-meetings-card .badge {
  opacity: 0.8;
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
