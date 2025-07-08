<template>
  <div class="cache-debugger" v-if="showDebugger">
    <div class="debug-panel">
      <div class="debug-header">
        <h5>🔍 Cache Debugger</h5>
        <div class="debug-controls">
          <button class="btn btn-sm btn-outline-secondary me-2" @click="refreshCache">
            <i class="bi bi-arrow-clockwise"></i> Refresh
          </button>
          <button class="btn btn-sm btn-outline-danger me-2" @click="clearAllCache">
            <i class="bi bi-trash"></i> Clear All
          </button>
          <button class="btn btn-sm btn-outline-primary" @click="toggleDebugger">
            <i class="bi bi-x"></i> Close
          </button>
        </div>
      </div>
      
      <div class="debug-content">
        <!-- Cache Status -->
        <div class="cache-status mb-3">
          <h6>📊 Cache Status</h6>
          <div class="row">
            <div class="col-md-2">
              <div class="status-card">
                <div class="status-number">{{ cacheStats.employees }}</div>
                <div class="status-label">Employees</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="status-card">
                <div class="status-number">{{ cacheStats.projects }}</div>
                <div class="status-label">Projects</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="status-card">
                <div class="status-number">{{ cacheStats.documents }}</div>
                <div class="status-label">Documents</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="status-card">
                <div class="status-number">{{ cacheStats.profileImages }}</div>
                <div class="status-label">Profile Images</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="status-card">
                <div class="status-number">{{ employeeCacheAge }}</div>
                <div class="status-label">Employee Cache Age</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="status-card">
                <div class="status-number">{{ projectCacheAge }}</div>
                <div class="status-label">Project Cache Age</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="status-card">
                <div class="status-number">{{ cacheStats.meetings }}</div>
                <div class="status-label">Meetings</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="status-card">
                <div class="status-number">{{ meetingCacheAge }}</div>
                <div class="status-label">Meeting Cache Age</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cached Projects -->
        <div class="cache-section mb-3">
          <h6>📋 Cached Projects ({{ cacheStats.projects }})</h6>
          <div class="table-responsive">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th>Team Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="project in cachedProjects" :key="project.id">
                  <td>{{ project.id }}</td>
                  <td>{{ project.name }}</td>
                  <td>{{ project.manager }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(project.status)">
                      {{ formatStatus(project.status) }}
                    </span>
                  </td>
                  <td>{{ project.teamSize || 0 }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="clearProjectCache(project.id)">
                      Clear
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cached Meetings -->
        <div class="cache-section mb-3">
          <h6>📅 Cached Meetings ({{ cacheStats.meetings }})</h6>
          <div class="table-responsive">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="meeting in cachedMeetings" :key="meeting.id">
                  <td>{{ meeting.id }}</td>
                  <td>{{ meeting.title }}</td>
                  <td>{{ meeting.meetingDate }}</td>
                  <td>{{ meeting.meetingTime }}</td>
                  <td>
                    <span :class="getMeetingStatusBadgeClass(meeting)">
                      {{ getMeetingStatusLabel(meeting) }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="clearMeetingCache(meeting.id)">
                      Clear
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cached Employees -->
        <div class="cache-section mb-3">
          <h6>👥 Cached Employees ({{ cacheStats.employees }})</h6>
          <div class="table-responsive">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in cachedEmployees" :key="employee.id">
                  <td>{{ employee.id }}</td>
                  <td>{{ employee.firstName }} {{ employee.lastName }}</td>
                  <td>{{ employee.email }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="clearEmployeeCache(employee.id)">
                      Clear
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cached Documents -->
        <div class="cache-section mb-3">
          <h6>📄 Cached Documents ({{ cacheStats.documents }})</h6>
          <div class="table-responsive">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Document Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="[employeeId, documents] in cachedDocuments" :key="employeeId">
                  <td>{{ employeeId }}</td>
                  <td>{{ documents ? documents.length : 0 }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="clearDocumentsCache(employeeId)">
                      Clear
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cached Profile Images -->
        <div class="cache-section">
          <h6>🖼️ Cached Profile Images ({{ cacheStats.profileImages }})</h6>
          <div class="table-responsive">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Has Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="[employeeId, imageUrl] in cachedProfileImages" :key="employeeId">
                  <td>{{ employeeId }}</td>
                  <td>
                    <span :class="imageUrl ? 'text-success' : 'text-muted'">
                      {{ imageUrl ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="clearProfileImageCache(employeeId)">
                      Clear
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
</template>

<script>
import EmployeeCache from '@/services/EmployeeCache';
import ProjectCache from '@/services/ProjectCache';
import MeetingCache from '@/services/MeetingCache';

export default {
  name: 'CacheDebugger',
  data() {
    return {
      showDebugger: false,
      cacheData: {
        employees: new Map(),
        documents: new Map(),
        profileImages: new Map(),
        lastFetch: null
      },
      projectCacheData: {
        projects: [],
        lastFetch: null
      },
      meetingCacheData: {
        meetings: [],
        lastFetch: null
      }
    };
  },
  computed: {
    cacheStats() {
      return {
        employees: this.cacheData.employees.size,
        projects: this.projectCacheData.projects.length,
        meetings: this.meetingCacheData.meetings.length,
        documents: this.cacheData.documents.size,
        profileImages: this.cacheData.profileImages.size
      };
    },
    employeeCacheAge() {
      if (!this.cacheData.lastFetch) return 'N/A';
      const age = Date.now() - this.cacheData.lastFetch;
      const minutes = Math.floor(age / 60000);
      const seconds = Math.floor((age % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    },
    projectCacheAge() {
      if (!this.projectCacheData.lastFetch) return 'N/A';
      const age = Date.now() - this.projectCacheData.lastFetch;
      const minutes = Math.floor(age / 60000);
      const seconds = Math.floor((age % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    },
    meetingCacheAge() {
      if (!this.meetingCacheData.lastFetch) return 'N/A';
      const age = Date.now() - this.meetingCacheData.lastFetch;
      const minutes = Math.floor(age / 60000);
      const seconds = Math.floor((age % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    },
    cachedEmployees() {
      return Array.from(this.cacheData.employees.values());
    },
    cachedProjects() {
      return this.projectCacheData.projects;
    },
    cachedMeetings() {
      return this.meetingCacheData.meetings;
    },
    cachedDocuments() {
      return Array.from(this.cacheData.documents.entries());
    },
    cachedProfileImages() {
      return Array.from(this.cacheData.profileImages.entries());
    }
  },
  methods: {
    toggleDebugger() {
      this.showDebugger = !this.showDebugger;
      if (this.showDebugger) {
        this.refreshCache();
      }
    },
    refreshCache() {
      // Get cache data from the services
      this.cacheData = EmployeeCache.getCacheData();
      this.projectCacheData = {
        projects: ProjectCache.getAllProjects() || [],
        lastFetch: ProjectCache.getLastFetch()
      };
      this.meetingCacheData = {
        meetings: MeetingCache.getAllMeetings() || [],
        lastFetch: MeetingCache.getLastFetch()
      };
    },
    clearAllCache() {
      if (confirm('Are you sure you want to clear all cache?')) {
        EmployeeCache.clearCache();
        ProjectCache.clear();
        MeetingCache.clear();
        this.refreshCache();
      }
    },
    clearEmployeeCache(employeeId) {
      EmployeeCache.clearEmployeeCache(employeeId);
      this.refreshCache();
    },
    clearProjectCache(projectId) {
      ProjectCache.deleteProject(projectId);
      this.refreshCache();
    },
    clearDocumentsCache(employeeId) {
      EmployeeCache.setDocuments(employeeId, null);
      this.refreshCache();
    },
    clearProfileImageCache(employeeId) {
      EmployeeCache.setProfileImage(employeeId, null);
      this.refreshCache();
    },
    clearMeetingCache(meetingId) {
      MeetingCache.removeMeeting(meetingId);
      this.refreshCache();
    },
    formatStatus(status) {
      const statusMap = {
        'PLANNING': 'Planning',
        'IN_PROGRESS': 'In Progress',
        'ON_HOLD': 'On Hold',
        'COMPLETED': 'Completed'
      };
      return statusMap[status] || status;
    },
    getStatusBadgeClass(status) {
      const classMap = {
        'PLANNING': 'badge bg-secondary',
        'IN_PROGRESS': 'badge bg-primary',
        'ON_HOLD': 'badge bg-warning',
        'COMPLETED': 'badge bg-success'
      };
      return classMap[status] || 'badge bg-light text-dark';
    },
    getMeetingStatusLabel(meeting) {
      const now = new Date();
      const meetingDate = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
      
      if (meetingDate > now) return 'Upcoming';
      if (meetingDate.toDateString() === now.toDateString()) return 'Today';
      return 'Past';
    },
    getMeetingStatusBadgeClass(meeting) {
      const now = new Date();
      const meetingDate = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
      
      if (meetingDate > now) return 'badge bg-info';
      if (meetingDate.toDateString() === now.toDateString()) return 'badge bg-warning';
      return 'badge bg-secondary';
    }
  },
  mounted() {
    // Add keyboard shortcut to toggle debugger (Ctrl+Shift+D)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleDebugger();
      }
    });

    // Listen for toggle events from debug button using window events
    window.addEventListener('toggle-cache-debugger', this.toggleDebugger);
  },
  beforeUnmount() {
    // Clean up event listener
    window.removeEventListener('toggle-cache-debugger', this.toggleDebugger);
  }
};
</script>

<style scoped>
.cache-debugger {
  position: fixed;
  top: 0;
  right: 0;
  width: 600px;
  height: 100vh;
  background: white;
  border-left: 2px solid #007bff;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  z-index: 9999;
  overflow-y: auto;
}

.debug-panel {
  padding: 15px;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

.debug-header h5 {
  margin: 0;
  color: #007bff;
}

.debug-controls {
  display: flex;
  gap: 5px;
}

.status-card {
  text-align: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.status-number {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

.status-label {
  font-size: 10px;
  color: #6c757d;
  margin-top: 3px;
}

.cache-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.cache-section h6 {
  margin-bottom: 15px;
  color: #495057;
}

.table {
  font-size: 11px;
}

.table th {
  font-size: 10px;
  font-weight: 600;
}

.badge {
  font-size: 10px;
  padding: 2px 6px;
}
</style> 