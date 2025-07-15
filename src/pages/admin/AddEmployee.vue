<template>
  <div class="add-employee-page">
    <!-- Header with Navigation -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">Add New Employee</h1>
            <p class="mb-0 text-muted">Create a new employee record</p>
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
      <div class="row justify-content-center">
        <div class="col-12" style="max-width: 1000px; margin: 0 auto;">
          <div class="card shadow-lg">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-person-plus me-2"></i>
                Employee Information
              </h5>
            </div>
            <div class="card-body p-4">
              <form @submit.prevent="handleSubmit">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name *</label>
                    <input
                      id="firstName"
                      v-model="employee.firstName"
                      type="text"
                      class="form-control"
                      placeholder="Enter first name"
                      required
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name *</label>
                    <input
                      id="lastName"
                      v-model="employee.lastName"
                      type="text"
                      class="form-control"
                      placeholder="Enter last name"
                      required
                      :disabled="isLoading"
                    />
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address *</label>
                  <input
                    id="email"
                    v-model="employee.email"
                    type="email"
                    class="form-control"
                    placeholder="Enter email address"
                    required
                    :disabled="isLoading"
                  />
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input
                      id="phone"
                      v-model="employee.phone"
                      type="tel"
                      class="form-control"
                      placeholder="Enter phone number"
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="department" class="form-label">Department</label>
                    <select
                      id="department"
                      v-model="employee.department"
                      class="form-select"
                      :disabled="isLoading"
                    >
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
                  <label for="position" class="form-label">Position</label>
                  <input
                    id="position"
                    v-model="employee.position"
                    type="text"
                    class="form-control"
                    placeholder="Enter job position"
                    :disabled="isLoading"
                  />
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="hireDate" class="form-label">Hire Date</label>
                    <input
                      id="hireDate"
                      v-model="employee.hireDate"
                      type="date"
                      class="form-control"
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="salary" class="form-label">Salary</label>
                    <input
                      id="salary"
                      v-model="employee.salary"
                      type="number"
                      class="form-control"
                      placeholder="Enter salary"
                      :disabled="isLoading"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="notes" class="form-label">Notes</label>
                  <textarea
                    id="notes"
                    v-model="employee.notes"
                    class="form-control"
                    rows="3"
                    placeholder="Enter any additional notes"
                    :disabled="isLoading"
                  ></textarea>
                </div>

                <div class="d-flex justify-content-between">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="goBack"
                    :disabled="isLoading"
                  >
                    <i class="bi bi-arrow-left me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="isLoading || !isFormValid"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-lg me-2"></i>
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Modal -->
    <div
      :class="['modal fade', { show: isLoading }]"
      tabindex="-1"
      :style="{
        display: isLoading ? 'block' : 'none',
        background: isLoading ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">Adding Employee</h5>
          </div>
          <div class="modal-body d-flex align-items-center">
            <span class="spinner-border spinner-border-sm me-2"></span>
            <span>Please wait while we add the employee...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      :class="['modal fade', { show: showSuccessModal }]"
      tabindex="-1"
      :style="{
        display: showSuccessModal ? 'block' : 'none',
        background: showSuccessModal ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Success!</h5>
            <button
              type="button"
              class="btn-close"
              @click="showSuccessModal = false"
            ></button>
          </div>
          <div class="modal-body text-center">
            <i class="bi bi-check-circle text-success fs-1 mb-3"></i>
            <p class="mb-0">Employee added successfully!</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              type="button"
              class="btn btn-success"
              @click="viewEmployees"
            >
              View All Employees
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="resetForm"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    </div>

  
  </div>
</template>

<script>
import EmployeeService from "@/services/EmployeeService";
import EmployeeCache from "@/services/EmployeeCache";

export default {
  name: "AddEmployee",
  data() {
    return {
      employee: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        hireDate: "",
        salary: "",
        notes: "",
        createdAt: null
      },
      isLoading: false,
      isLoggingOut: false,
      showSuccessModal: false
    };
  },
  computed: {
    isFormValid() {
      return this.employee.firstName.trim() && 
             this.employee.lastName.trim() && 
             this.employee.email.trim();
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.isFormValid) return;

      this.isLoading = true;
      
      try {
        // Prepare employee data without createdAt (backend will set it)
        const employeeData = {
          firstName: this.employee.firstName.trim(),
          lastName: this.employee.lastName.trim(),
          email: this.employee.email.trim(),
          phone: this.employee.phone.trim() || null,
          department: this.employee.department || null,
          position: this.employee.position.trim() || null,
          hireDate: this.employee.hireDate || null,
          salary: this.employee.salary ? parseFloat(this.employee.salary) : null,
          notes: this.employee.notes.trim() || null
        };
        const username = localStorage.getItem("username") || "system";
        const response = await EmployeeService.addEmployee(employeeData, username);
        
        // Add the new employee to cache
        if (response.data && response.data.data) {
          EmployeeCache.addEmployee(response.data.data);
        }
        
        // Show success modal
        this.showSuccessModal = true;
        
      } catch (error) {
        console.error("Error adding employee:", error);
        alert("Failed to add employee. Please try again.");
      } finally {
        this.isLoading = false;
      }
    },
    viewEmployees() {
      this.$router.push({ name: "EmployeeList" });
    },
    resetForm() {
      this.showSuccessModal = false;
      this.employee = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        hireDate: "",
        salary: "",
        notes: "",
        createdAt: null
      };
      // Reset form validation state
      this.$nextTick(() => {
        const form = document.querySelector('form');
        if (form) {
          form.reset();
        }
      });
    },
  }
};
</script>

<style scoped>
.add-employee-page {
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
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-header {
  border-radius: 1rem 1rem 0 0 !important;
  border-bottom: none;
}

.form-control,
.form-select {
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
  padding: 0.75rem;
  transition: all 0.2s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.btn-secondary {
  background: #6c757d;
  border: none;
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
}

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
  .container {
    padding: 1rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}
</style>