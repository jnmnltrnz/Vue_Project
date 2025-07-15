<template>
    <div class="edit-employee-page">
      <div class="container mt-4">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card shadow-lg">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                  <i class="bi bi-pencil-square me-2"></i>
                  Edit Employee
                </h5>
              </div>
              <div class="card-body p-4">
                <form v-if="employee" @submit.prevent="handleSubmit">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="firstName" class="form-label">First Name *</label>
                      <input
                        id="firstName"
                        v-model="employee.firstName"
                        type="text"
                        class="form-control"
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
                      Save Changes
                    </button>
                  </div>
                </form>
                <div v-else class="text-center py-5">
                  <span class="spinner-border text-primary"></span>
                  <p class="mt-3">Loading employee data...</p>
                </div>
                <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
                <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import EmployeeService from '@/services/EmployeeService';
  import EmployeeCache from '@/services/EmployeeCache';
  
  export default {
    name: 'EditEmployee',
    props: {
      employeeId: {
        type: [String, Number],
        required: false
      }
    },
    data() {
      return {
        employee: null,
        isLoading: false,
        successMessage: '',
        errorMessage: ''
      };
    },
    computed: {
      id() {
        // Prefer prop, fallback to route param
        return this.employeeId || this.$route.params.id;
      },
      isFormValid() {
        return (
          this.employee &&
          this.employee.firstName &&
          this.employee.lastName &&
          this.employee.email
        );
      }
    },
    created() {
      this.fetchEmployee();
    },
    methods: {
      async fetchEmployee() {
        this.isLoading = true;
        this.errorMessage = '';
        try {
          const res = await EmployeeService.getAllEmployees();
          const found = res.data.find(emp => String(emp.id) === String(this.id));
          if (found) {
            this.employee = { ...found };
          } else {
            this.errorMessage = 'Employee not found.';
          }
        } catch (err) {
          this.errorMessage = 'Failed to load employee data.';
        } finally {
          this.isLoading = false;
        }
      },
      async handleSubmit() {
        if (!this.isFormValid) return;
        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';
        try {
          const username = localStorage.getItem("username") || "system";
          const response = await EmployeeService.updateEmployee(this.id, this.employee, username);
          
          // Update employee in cache
          if (response.data && response.data.data) {
            EmployeeCache.updateEmployee(response.data.data);
          }
          
          this.successMessage = 'Employee updated successfully!';
        } catch (err) {
          this.errorMessage = 'Failed to update employee.';
        } finally {
          this.isLoading = false;
        }
      },
      goBack() {
        this.$router.back();
      }
    }
  };
  </script>
  
  <style scoped>
  .edit-employee-page {
    min-height: 100vh;
    background-color: #f8f9fa;
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
  .btn {
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;
  }
  .btn:hover {
    transform: translateY(-1px);
  }
  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
  }
  .btn-primary:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  }
  .btn-secondary {
    background: #6c757d;
    border: none;
  }
  .alert {
    border-radius: 0.5rem;
  }
  </style>
  