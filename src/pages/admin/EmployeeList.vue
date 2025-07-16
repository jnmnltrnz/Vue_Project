<template>
  <div class="employee-list-page">
    <!-- Header with Navigation -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">Employee List</h1>
            <p class="mb-0 text-muted">Manage and view all employees</p>
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
      <!-- Employee Search and Table -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-lg">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-people me-2"></i>
                Employee Management
              </h5>
            </div>
            <div class="card-body p-4">
              <EmployeeSearch v-model="search" :is-loading="isLoading" />

              <EmployeeTable
                :employees="paginatedEmployees"
                :empty-rows="emptyRows"
                :all-employees="employees"
                @delete="confirmDelete"
                :is-loading="isLoading"
              />

              <EmployeePagination
                :page="page"
                :total-pages="totalPages"
                @prev="page--"
                @next="page++"
              />
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

      <EmployeeModal
        v-if="showConfirm"
        :deleting="isDeleting"
        @cancel="showConfirm = false"
        @confirm="deleteEmployee"
      />

    <!-- Deleting Employee Modal - always on top -->
    <div
      class="modal fade deleting-modal"
      tabindex="-1"
      :class="{ show: isDeleting }"
      :style="{
        display: isDeleting ? 'block' : 'none',
        background: isDeleting ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Deleting</h5>
          </div>
          <div class="modal-body d-flex align-items-center">
            <span
              class="spinner-border spinner-border-sm me-2 text-danger"
            ></span>
            <span>Deleting employee and its details...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import EmployeeSearch from "@/components/EmployeeList/EmployeeSearch.vue";
import EmployeeTable from "@/components/EmployeeList/EmployeeTable.vue";
import EmployeePagination from "@/components/EmployeeList/EmployeePagination.vue";
import EmployeeModal from "@/components/EmployeeList/EmployeeModal.vue";
import EmployeeService from "@/services/EmployeeService";
import EmployeeCache from "@/services/EmployeeCache";

export default {
  name: "EmployeePage",
  components: {
    EmployeeSearch,
    EmployeeTable,
    EmployeePagination,
    EmployeeModal,
  },
  data() {
    return {
      employees: [],
      showConfirm: false,
      deleteId: null,

      search: "",
      page: 1,
      pageSize: 10,
      isDeleting: false,
      isLoggingOut: false,
      isLoading: false,
    };
  },
  computed: {
    filteredEmployees() {
      if (!this.search) return this.employees;
      const s = this.search.toLowerCase();
      return this.employees.filter(
        (e) =>
          e.firstName.toLowerCase().includes(s) ||
          e.lastName.toLowerCase().includes(s) ||
          e.email.toLowerCase().includes(s) ||
          String(e.id).includes(s)
      );
    },
    totalPages() {
      return Math.max(
        1,
        Math.ceil(this.filteredEmployees.length / this.pageSize)
      );
    },
    paginatedEmployees() {
      const start = (this.page - 1) * this.pageSize;
      return this.filteredEmployees.slice(start, start + this.pageSize);
    },
    emptyRows() {
      return this.pageSize - this.paginatedEmployees.length;
    },
  },
  watch: {
    search() {
      this.page = 1;
    },
    filteredEmployees() {
      if (this.page > this.totalPages) this.page = this.totalPages;
    },
  },
  methods: {
    
    goToDashboard() {
      this.$router.push({ name: 'CompanyDashboard' });
    },

    fetchEmployees() {
      // Check cache first
      if (EmployeeCache.hasAllEmployees()) {
        this.employees = EmployeeCache.getAllEmployees();
        return;
      }

      this.isLoading = true;
      EmployeeService.getAllEmployees()
        .then((response) => {
          this.employees = response.data.data; // Access the data property of ApiResponse
          EmployeeCache.setAllEmployees(response.data.data);
          EmployeeCache.updateLastFetch();
        })
        .catch((error) => {
          console.error("There was an error fetching the employees!", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },


    confirmDelete(id) {
      this.deleteId = id;
      this.showConfirm = true;
    },
    async deleteEmployee() {
      this.isDeleting = true; // show loading modal
      await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms delay
      const username = localStorage.getItem("username") || "system";
      EmployeeService.deleteEmployee(this.deleteId,username,this.employees.find(e => e.id === this.deleteId).firstName + " " + this.employees.find(e => e.id === this.deleteId).lastName)
        .then(() => {
          // Remove employee from cache
          EmployeeCache.removeEmployee(this.deleteId);
          
          // Update local employees array
          this.employees = this.employees.filter(e => e.id !== this.deleteId);
          
          this.showConfirm = false;
          this.deleteId = null;
        })
        .catch((error) => {
          console.error("There was an error deleting the employee!", error);
          this.showConfirm = false;
        })
        .finally(() => {
          this.isDeleting = false; // hide loading modal
        });
    },

  },
  created() {
    this.fetchEmployees();
  },
};
</script>

<style scoped>
.employee-list-page {
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


.btn-danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border: none;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ec7063, #e74c3c);
  transform: translateY(-1px);
}

.btn-success {
  background: linear-gradient(135deg, #27ae60, #229954);
  border: none;
}

.btn-success:hover {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  transform: translateY(-1px);
}

/* Form styling */
.form-control {
  background: rgba(52, 73, 94, 0.8);
  border: 1px solid #34495e;
  color: #ffffff;
  border-radius: 8px;
}

.form-control:focus {
  background: rgba(52, 73, 94, 1);
  border-color: #5dade2;
  box-shadow: 0 0 0 0.2rem rgba(93, 173, 226, 0.25);
  color: #ffffff;
}

.form-control::placeholder {
  color: #bdc3c7;
}

/* Table styling */
.table {
  color: #ecf0f1;
  background: transparent;
}

.table th {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border-color: #34495e;
  color: #ffffff;
  font-weight: 600;
}

.table td {
  border-color: #34495e;
  background: rgba(52, 73, 94, 0.6);
}

.table tbody tr:hover {
  background: rgba(93, 173, 226, 0.1);
}

/* Modal styling */
.modal-content {
  border: none;
  border-radius: 1rem;
}

.modal-header {
  border-bottom: none;
  border-radius: 1rem 1rem 0 0;
}


/* Text colors */
.text-info {
  color: #5dade2 !important;
}

.text-light {
  color: #ecf0f1 !important;
}

/* Spinner styling */
.spinner-border {
  color: #5dade2;
}

.deleting-modal {
  z-index: 10000 !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Logout button positioning */
.logout-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.logout-btn {
  cursor: pointer;
  color: #e74c3c;
  font-size: 1.1em;
  font-weight: bold;
  padding: 0.5rem 1rem;
  /* border-radius: 6px;
  background: rgba(231, 76, 60, 0.1); */
  transition: all 0.3s ease;
  display: inline-block;
}

/* .logout-btn:hover {
  background: rgba(231, 76, 60, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
} */

/* Navigation button positioning */
.nav-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}

.nav-btn {
  cursor: pointer;
  color: #3498db;
  font-size: 1.1em;
  font-weight: bold;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.nav-btn:hover {
  color: #5dade2;
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 1rem 0;
  }
 
}
</style>
