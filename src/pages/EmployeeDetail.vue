<template>
  <div class="container mt-4">
    <!-- Header with Back -->
    <div class="d-flex align-items-center mb-3">
      <button class="btn btn-outline-primary me-3 shadow-sm" @click="goBack">
        <i class="bi bi-arrow-left me-2"></i> Back to Employees
      </button>
              <div class="flex-grow-1">
          <h2 class="mb-0 text-info fw-bold">Employee Details</h2>
          <p class="mb-0 mt-1 small" style="color: #5dade2;">Upload and View Employee Documents</p>
        </div>
    </div>

    <!-- Employee Details Card -->
    <div class="card shadow-lg border-0 rounded-3 mb-3">
      <div class="card-header bg-gradient-primary text-white rounded-top-3 py-2 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <i class="bi bi-person-circle me-2 fs-5"></i>
          <h5 class="mb-0 fw-semibold" style="color: #000;">Employee Information</h5>
        </div>
        <div class="btn-group" style="min-width: 180px;">
          <button
            v-if="employee && !isEditing && !isLoadingDetails"
            class="btn btn-sm btn-outline-warning"
            @click="startEdit"
          >
            <i class="bi bi-pencil-square"></i> Edit
          </button>
          <template v-else-if="isEditing">
            <button class="btn btn-sm btn-outline-secondary me-2" @click="cancelEdit">Cancel</button>
            <button class="btn btn-sm btn-success" :disabled="isEditLoading || !isEditFormValid" @click="saveEdit">
              <span v-if="isEditLoading" class="spinner-border spinner-border-sm me-1"></span>
              Save
            </button>
          </template>
          <span v-if="isLoadingDetails" class="spinner-border spinner-border-sm text-light"></span>
        </div>
      </div>
      <div class="card-body p-2">
        <div v-if="!isEditing && !isLoadingDetails && employee" class="row">
          <!-- Profile Image Column -->
          <div class="col-md-4 col-lg-3 mb-3 mb-md-0">
            <div class="text-center">
              <ProfileImage
                :employee-id="employee.id"
                :current-image="profileImageUrl"
                :is-uploading="isProfileUploading"
                :loading-message="profileLoadingMessage"
                @upload="uploadProfileImage"
                @remove="removeProfileImage"
              />
            </div>
          </div>
          
          <!-- Employee Details Column -->
          <div class="col-md-8 col-lg-9">
            <div class="employee-details">
              <div class="row g-2">
                <!-- Basic Info -->
                <div class="col-md-6">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Employee ID</label>
                    <div class="detail-value">{{ employee.id }}</div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="detail-item mb-1">
                    <label class="detail-label">First Name</label>
                    <div class="detail-value">{{ employee.firstName }}</div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Last Name</label>
                    <div class="detail-value">{{ employee.lastName }}</div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Email Address</label>
                    <div class="detail-value">
                      <a :href="`mailto:${employee.email}`" class="text-decoration-none">
                        {{ employee.email }}
                      </a>
                    </div>
                  </div>
                </div>

                <div class="col-md-6" v-if="employee.phone">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Phone Number</label>
                    <div class="detail-value">
                      <a :href="`tel:${employee.phone}`" class="text-decoration-none">
                        {{ employee.phone }}
                      </a>
                    </div>
                  </div>
                </div>

                <div class="col-md-6" v-if="employee.department">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Department</label>
                    <div class="detail-value">{{ employee.department }}</div>
                  </div>
                </div>

                <div class="col-md-6" v-if="employee.position">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Position</label>
                    <div class="detail-value">{{ employee.position }}</div>
                  </div>
                </div>

                <div class="col-md-6" v-if="employee.hireDate">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Hire Date</label>
                    <div class="detail-value">{{ formatDate(employee.hireDate) }}</div>
                  </div>
                </div>

                <div class="col-md-6" v-if="employee.salary">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Salary</label>
                    <div class="detail-value">{{ formatSalary(employee.salary) }}</div>
                  </div>
                </div>

                <div class="col-md-6" v-if="employee.createdAt">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Created At</label>
                    <div class="detail-value">{{ formatDate(employee.createdAt) }}</div>
                  </div>
                </div>

                <div class="col-md-6" v-if="employee.account">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Username</label>
                    <div class="detail-value">{{ employee.account.username }}</div>
                  </div>
                </div>

                <!-- Notes - Full Width -->
                <div class="col-12" v-if="employee.notes">
                  <div class="detail-item mb-1">
                    <label class="detail-label">Notes</label>
                    <div class="detail-value notes-scroll">{{ employee.notes }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="employee && isEditing && !isLoadingDetails">
          <form @submit.prevent="saveEdit">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">First Name *</label>
                <input v-model="editEmployee.firstName" type="text" class="form-control" required :disabled="isEditLoading" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Last Name *</label>
                <input v-model="editEmployee.lastName" type="text" class="form-control" required :disabled="isEditLoading" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Email Address *</label>
              <input v-model="editEmployee.email" type="email" class="form-control" required :disabled="isEditLoading" />
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Phone Number</label>
                <input v-model="editEmployee.phone" type="tel" class="form-control" :disabled="isEditLoading" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Department</label>
                <select v-model="editEmployee.department" class="form-select" :disabled="isEditLoading">
                  <option value="">Select department</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Position</label>
              <input v-model="editEmployee.position" type="text" class="form-control" :disabled="isEditLoading" />
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Hire Date</label>
                <input v-model="editEmployee.hireDate" type="date" class="form-control" :disabled="isEditLoading" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Salary</label>
                <input v-model="editEmployee.salary" type="number" class="form-control" :disabled="isEditLoading" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Notes</label>
              <textarea v-model="editEmployee.notes" class="form-control" rows="3" :disabled="isEditLoading"></textarea>
            </div>
            <div v-if="editError" class="alert alert-danger">{{ editError }}</div>
            <div v-if="editSuccess" class="alert alert-success">{{ editSuccess }}</div>
          </form>
        </div>
        <div v-else-if="isLoadingDetails">
          <EmployeeSkeleton type="details" :count="4" />
        </div>
      </div>
    </div>

    <!-- Documents Section -->
    <div class="card shadow-lg border-0 rounded-3">
      <div class="card-header bg-gradient-secondary text-white rounded-top-3 py-2">
        <div class="d-flex align-items-center">
          <i class="bi bi-file-earmark-text me-2 fs-5"></i>
          <h5 class="mb-0 fw-semibold" style="color: #000;">Documents</h5>
        </div>
      </div>
      <div class="card-body p-2">
        <!-- Upload Form -->
        <DocumentUpload 
          :is-uploading="isUploading"
          @file-change="handleFileChange"
          @upload="uploadDocument"
        />

        <!-- Uploaded Documents -->
        <div v-if="isLoadingDetails" class="mt-4">
          <h6 class="fw-semibold mb-3 text-info">Uploaded Documents</h6>
          <div class="list-group list-group-flush">
            <EmployeeSkeleton type="document" :count="2" />
          </div>
        </div>
        <DocumentList 
          v-else
          :documents="documents"
          :is-uploading="isUploading"
          :base-url="API_BASE"
          @remove="removeDocument"
        />
      </div>
    </div>

    <!-- Upload/Success Modal -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: modalLoading || modalMessage }"
      :style="{
        display: modalLoading || modalMessage ? 'block' : 'none',
        background: 'rgba(0,0,0,0.4)',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div
            class="modal-header"
            :class="modalLoading ? 'bg-info text-white' : 'bg-success text-white'"
          >
            <h5 class="modal-title">
              {{ modalLoading ? "Please Wait" : "Success" }}
            </h5>
          </div>
          <div class="modal-body text-center">
            <div v-if="modalLoading">
              <span class="spinner-border text-primary mb-2"></span>
              <p class="mt-2">{{ modalMessage }}</p>
            </div>
            <div v-else>
              <p>{{ modalMessage }}</p>
            </div>
          </div>
          <div class="modal-footer justify-content-center" v-if="!modalLoading">
            <button class="btn btn-success" @click="modalMessage = ''; modalType = ''">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API_BASE from "@/constants/APIBaseURL";
import EmployeeService from "@/services/EmployeeService";
import EmployeeCache from "@/services/EmployeeCache";
import EmployeeSkeleton from "@/components/EmployeeDetail/EmployeeSkeleton.vue";
import DocumentUpload from "@/components/EmployeeDetail/DocumentUpload.vue";
import DocumentList from "@/components/EmployeeDetail/DocumentList.vue";
import ProfileImage from "@/components/EmployeeDetail/ProfileImage.vue";

export default {
  name: "EmployeeDetail",
  components: {
    EmployeeSkeleton,
    DocumentUpload,
    DocumentList,
    ProfileImage
  },
  data() {
    return {
      employee: null,
      documents: [],
      selectedFile: null,
      isUploading: false,
      loadingMessage: "",
      successMessage: "",
      isProfileUploading: false,
      profileLoadingMessage: "",
      profileImageUrl: null,
      API_BASE,
      modalLoading: false,
      modalMessage: "",
      modalType: "", // "document" or "profile"
      isEditing: false,
      isEditLoading: false,
      editEmployee: null,
      editError: '',
      editSuccess: '',
      isLoadingDetails: true,
    };
  },
  computed: {
    isEditFormValid() {
      return (
        this.editEmployee &&
        this.editEmployee.firstName &&
        this.editEmployee.lastName &&
        this.editEmployee.email
      );
    },
  },
  created() {
    this.loadEmployeeData();
  },
  
  // Add activated lifecycle hook to refresh data when navigating back
  activated() {
    // Force refresh profile image when component is activated
    if (this.employee && this.employee.id) {
      this.refreshProfileImage();
    }
  },
  methods: {
    loadEmployeeData() {
      this.isLoadingDetails = true;
      const id = Number(this.$route.params.id);
      
      // Check cache first
      const cachedEmployee = EmployeeCache.getEmployee(id);
      if (cachedEmployee) {
        this.employee = cachedEmployee;
        this.fetchDocuments();
        this.fetchProfileImage();
        this.isLoadingDetails = false;
        return;
      }

      // If not in cache, check if we have all employees cached
      if (EmployeeCache.hasAllEmployees()) {
        const allEmployees = EmployeeCache.getAllEmployees();
        const matchedEmployee = allEmployees.find((emp) => emp.id === id);
        
        if (matchedEmployee) {
          this.employee = matchedEmployee;
          EmployeeCache.setEmployee(id, matchedEmployee);
          this.fetchDocuments();
          this.fetchProfileImage();
          this.isLoadingDetails = false;
          return;
        }
      }

      // Fallback to fetching from API
      EmployeeService.getAllEmployees()
        .then((response) => {
          const allEmployees = response.data;
          EmployeeCache.setAllEmployees(allEmployees);
          EmployeeCache.updateLastFetch();
          
          const matchedEmployee = allEmployees.find((emp) => emp.id === id);

          if (matchedEmployee) {
            this.employee = matchedEmployee;
            EmployeeCache.setEmployee(id, matchedEmployee);
            this.fetchDocuments();
            this.fetchProfileImage();
            this.isLoadingDetails = false;
          } else {
            // Employee not found
            this.isLoadingDetails = false;
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the employees!", error);
          this.isLoadingDetails = false;
        });
    },
    
    refreshProfileImage() {
      // Clear the profile image cache and refetch
      EmployeeCache.setProfileImage(this.employee.id, null);
      this.fetchProfileImage();
    },
    
    goBack() {
      this.$router.push({ name: 'EmployeeList' });
    },
    handleFileChange(file) {
      this.selectedFile = file;
    },
    async uploadDocument(file) {
      if (!file || !this.employee) return;
      this.modalLoading = true;
      this.modalType = "document";
      this.modalMessage = "Uploading document, please wait...";
      const username = localStorage.getItem("username") || "system";
      try {
        await EmployeeService.uploadDocument(
          this.employee.id,
          file, 
          username
        );
        EmployeeCache.setDocuments(this.employee.id, null);
        await this.fetchDocuments();
        this.selectedFile = null;
        this.$nextTick(() => {
          document.getElementById("docUpload").value = "";
        });
        await new Promise((resolve) => setTimeout(resolve, 800));
        this.modalMessage = "Document uploaded successfully!";
        setTimeout(() => {
          this.modalMessage = "";
          this.modalType = "";
        }, 2000);
      } catch (error) {
        alert("Failed to upload document.");
        console.error(error);
      } finally {
        this.modalLoading = false;
      }
    },
    async fetchDocuments() {
      if (!this.employee || !this.employee.id) return;
      
      // Check cache first
      const cachedDocuments = EmployeeCache.getDocuments(this.employee.id);
      if (cachedDocuments) {
        this.documents = cachedDocuments;
        return;
      }

      try {
        const res = await EmployeeService.getDocumentsByEmployeeId(
          this.employee.id
        );
        this.documents = res.data || [];
        EmployeeCache.setDocuments(this.employee.id, this.documents);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        this.documents = [];
      }
    },
    async removeDocument(idx) {
      const doc = this.documents[idx];
      if (!doc || !doc.id) return;
      if (!confirm("Are you sure you want to delete this document?")) return;
      this.modalLoading = true;
      this.modalType = "document";
      this.modalMessage = "Deleting the document, please wait...";
      try {
        const username = localStorage.getItem("username") || "system";
        await EmployeeService.deleteDocument(
          doc.id,
          username,
          this.employee.firstName + " " + this.employee.lastName,
          this.documents[idx].fileName
        );
        EmployeeCache.setDocuments(this.employee.id, null);
        await this.fetchDocuments();
        await new Promise((resolve) => setTimeout(resolve, 800));
        this.modalMessage = "Document deleted successfully!";
        setTimeout(() => {
          this.modalMessage = "";
          this.modalType = "";
        }, 2000);
      } catch (error) {
        alert("Failed to delete document.");
        console.error(error);
      } finally {
        this.modalLoading = false;
      }
    },
    async fetchProfileImage() {
      if (!this.employee || !this.employee.id) {
        return;
      }

      // Validate employee ID
      if (isNaN(this.employee.id) || this.employee.id <= 0) {
        this.profileImageUrl = null;
        EmployeeCache.setProfileImage(this.employee.id, null);
        return;
      }
      
      // Check cache first, but only if it's not null (null means we explicitly cached "no image")
      const cachedImageUrl = EmployeeCache.getProfileImage(this.employee.id);
      if (cachedImageUrl !== undefined && cachedImageUrl !== null) {
        this.profileImageUrl = cachedImageUrl;
        return;
      }

      // Set default to null first to avoid showing broken image
      this.profileImageUrl = null;

      try {
        // Try to fetch the profile image with timeout and error suppression
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        // Use a more robust fetch with better error handling
        const response = await fetch(`${this.API_BASE}/employees/${this.employee.id}/profile-image`, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Accept': 'image/*, application/json, */*',
            'Cache-Control': 'no-cache' // Prevent browser caching
          }
        }).catch(error => {
          // Suppress fetch errors and return a mock response
          console.log("Profile image fetch error suppressed:", error.message);
          return new Response(null, { status: 500 });
        });
        
        clearTimeout(timeoutId);
        
        if (response && response.ok) {
          const contentType = response.headers.get('content-type');
          
          // If response is JSON, it means no image (API returns {"imageUrl": null})
          if (contentType && contentType.includes('application/json')) {
            try {
              const data = await response.json();
              console.log("Profile image response data:", data);
            } catch (e) {
              console.log("Failed to parse JSON response");
            }
            this.profileImageUrl = null;
            EmployeeCache.setProfileImage(this.employee.id, null);
            console.log("No profile image found for employee");
          } else {
            // If response is an image, set the URL with cache-busting parameter
            const timestamp = Date.now();
            this.profileImageUrl = `${this.API_BASE}/employees/${this.employee.id}/profile-image?t=${timestamp}`;
            EmployeeCache.setProfileImage(this.employee.id, this.profileImageUrl);
          }
        } else {
          this.profileImageUrl = null;
          EmployeeCache.setProfileImage(this.employee.id, null);
        }
      } catch (error) {
        // Handle any remaining exceptions
        if (error.name === 'AbortError') {
          console.log("Profile image request timed out");
        } else {
          console.log("Profile image request failed:", error.message);
        }
        this.profileImageUrl = null;
        EmployeeCache.setProfileImage(this.employee.id, null);
      }
    },
    async uploadProfileImage(file) {
      if (!this.employee || !this.employee.id) return;
      this.modalLoading = true;
      this.modalType = "profile";
      this.modalMessage = "Uploading profile image, please wait...";
      try {
        await EmployeeService.uploadProfileImage(this.employee.id, file);
        EmployeeCache.setProfileImage(this.employee.id, null);
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.fetchProfileImage();
        this.modalMessage = "Profile image uploaded successfully!";
        setTimeout(() => {
          this.modalMessage = "";
          this.modalType = "";
        }, 2000);
      } catch (error) {
        alert("Failed to upload profile image.");
        console.error(error);
      } finally {
        this.modalLoading = false;
      }
    },
    async removeProfileImage() {
      if (!this.employee || !this.employee.id) return;
      this.modalLoading = true;
      this.modalType = "profile";
      this.modalMessage = "Removing profile image, please wait...";
      try {
        await EmployeeService.deleteProfileImage(this.employee.id);
        this.profileImageUrl = null;
        EmployeeCache.setProfileImage(this.employee.id, null);
        await new Promise(resolve => setTimeout(resolve, 500));
        this.modalMessage = "Profile image removed successfully!";
        setTimeout(() => {
          this.modalMessage = "";
          this.modalType = "";
        }, 2000);
      } catch (error) {
        alert("Failed to remove profile image.");
        console.error(error); 
      } finally {
        this.modalLoading = false;
      }
    },
    startEdit() {
      this.isEditing = true;
      this.editEmployee = { ...this.employee };
      this.editError = '';
      this.editSuccess = '';
    },
    cancelEdit() {
      this.isEditing = false;
      this.editEmployee = null;
      this.editError = '';
      this.editSuccess = '';
    },
    async saveEdit() {
      if (!this.isEditFormValid) return;
      this.isEditLoading = true;
      this.editError = '';
      this.editSuccess = '';
      this.modalLoading = true;
      this.modalMessage = "Updating employee, please wait...";
      try {
        const username = localStorage.getItem("username") || "system";
        const response = await EmployeeService.updateEmployee(this.employee.id, this.editEmployee,username);
        const updatedEmployee = response.data;

        // Update cache as previously described
        EmployeeCache.setEmployee(this.employee.id, updatedEmployee);
        const allEmployees = EmployeeCache.getAllEmployees();
        if (allEmployees) {
          const idx = allEmployees.findIndex(emp => emp.id === this.employee.id);
          if (idx !== -1) {
            allEmployees[idx] = updatedEmployee;
            EmployeeCache.setAllEmployees(allEmployees);
          }
        }

        this.employee = { ...updatedEmployee };
        this.editSuccess = 'Employee updated successfully!';
        this.modalMessage = "Employee updated successfully!";
        setTimeout(() => {
          this.isEditing = false;
          this.editSuccess = '';
          this.modalLoading = false;
          this.modalMessage = '';
        }, 1200);
      } catch (err) {
        this.editError = 'Failed to update employee.';
        this.modalLoading = false;
        this.modalMessage = '';
      } finally {
        this.isEditLoading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return dateString;
      }
    },

    formatSalary(salary) {
      if (!salary) return '';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(salary);
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
}

.employee-details {
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.detail-item {
  position: relative;
  margin-bottom: 0.25rem;
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.detail-item::before {
  content: '';
  position: absolute;
  left: -0.75rem;
  top: 0.25rem;
  width: 3px;
  height: 3px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 50%;
  opacity: 0.6;
}

.detail-label {
  display: block;
  font-weight: 600;
  color: #000000;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 0.25rem;
  position: relative;
  justify-content: left;
  text-align: left;
}

.detail-value {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 2px solid #3498db;
  transition: all 0.3s ease;
  min-height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid #e9ecef;
}

.detail-value:hover {
  background: #e3f2fd;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
  transform: translateX(2px);
  border-color: #3498db;
}

.detail-value a {
  color: #3498db;
  transition: color 0.2s ease;
  font-weight: 600;
}

.detail-value a:hover {
  color: #2980b9;
  text-decoration: underline !important;
}

/* Card enhancements */
.card-header {
  border-bottom: none;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(115, 113, 113, 0.1) 50%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.card-body {
  background: linear-gradient(145deg, #f8f9fa, #ffffff);
  position: relative;
  color: #2c3e50;
}

.card {
  transition: all 0.3s ease;
  border: none;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3) !important;
}

/* Button enhancements */
.btn-outline-primary {
  border-width: 2px;
  font-weight: 600;
  transition: all 0.3s ease;

  border-color: #5dade2;
  color: #5dade2;
  position: relative;
  overflow: hidden;
}

.btn-outline-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(93, 173, 226, 0.2), transparent);
  transition: left 0.5s;
}

.btn-outline-primary:hover::before {
  left: 100%;
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(93, 173, 226, 0.5);
  background: linear-gradient(135deg, #5dade2, #3498db);
  border-color: #5dade2;
  color: white;
}

/* Modal enhancements */
.modal-content {
  border: none;
  border-radius: 1rem;
}

.modal-header {
  border-bottom: none;
  border-radius: 1rem 1rem 0 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .detail-label {
    font-size: 0.6rem;
  }
  
  .detail-value {
    font-size: 0.85rem;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .employee-details {
    padding: 0.25rem;
  }
}

/* Animation for loading states */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.employee-details {
  animation: fadeIn 0.5s ease-out;
}

.notes-scroll {
  max-height: 120px;   /* or whatever height you prefer */
  overflow-y: auto;
  white-space: pre-line; /* preserves line breaks */
}
</style>
