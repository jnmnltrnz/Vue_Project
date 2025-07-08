<template>
  <div
    :class="['modal fade', { show: show }]"
    tabindex="-1"
    :style="{
      display: show ? 'block' : 'none',
      background: show ? 'rgba(0,0,0,0.3)' : '',
    }"
    role="dialog"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-info text-white">
          <h5 class="modal-title">
            <i class="bi bi-people me-2"></i>
            Assign Employees to {{ project?.name }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="isLoading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading employees...</p>
          </div>
          <div v-else>
            <div class="mb-3">
              <input 
                v-model="searchTerm" 
                type="text" 
                class="form-control" 
                placeholder="Search employees..."
              >
            </div>
            <div class="row">
              <div class="col-md-6">
                <h6>Available Employees</h6>
                <div class="list-group" style="max-height: 300px; overflow-y: auto;">
                  <div 
                    v-for="employee in availableEmployees" 
                    :key="employee.id"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    @click="assignEmployee(employee)"
                  >
                    <div>
                      <strong>{{ employee.firstName }} {{ employee.lastName }}</strong>
                      <br>
                      <small class="text-muted">{{ employee.position }} • {{ employee.department }}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h6>Assigned Employees</h6>
                <div class="list-group" style="max-height: 300px; overflow-y: auto;">
                  <div 
                    v-for="employee in assignedEmployees" 
                    :key="employee.id"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{{ employee.firstName }} {{ employee.lastName }}</strong>
                      <br>
                      <small class="text-muted">{{ employee.position }} • {{ employee.department }}</small>
                    </div>
                    <button 
                      class="btn btn-sm btn-outline-danger"
                      @click="unassignEmployee(employee)"
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Close</button>
          <button 
            type="button" 
            class="btn btn-info" 
            @click="handleSave"
            :disabled="isSaving"
          >
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
            Save Assignments
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AssignEmployeesModal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      default: null
    },
    employees: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchTerm: "",
      assignedEmployees: []
    };
  },
  computed: {
    availableEmployees() {
      if (!this.employees || this.employees.length === 0) return [];
      
      const assignedIds = this.assignedEmployees.map(emp => emp.id);
      let filtered = this.employees.filter(emp => !assignedIds.includes(emp.id));
      
      if (this.searchTerm) {
        const search = this.searchTerm.toLowerCase();
        filtered = filtered.filter(emp => 
          emp.firstName.toLowerCase().includes(search) ||
          emp.lastName.toLowerCase().includes(search) ||
          emp.department?.toLowerCase().includes(search) ||
          emp.position?.toLowerCase().includes(search)
        );
      }
      
      return filtered;
    }
  },
  watch: {
    project: {
      handler(newProject) {
        if (newProject) {
          this.assignedEmployees = newProject.assignedEmployees || [];
        } else {
          this.assignedEmployees = [];
        }
      },
      immediate: true
    }
  },
  methods: {
    assignEmployee(employee) {
      if (!this.assignedEmployees.find(emp => emp.id === employee.id)) {
        this.assignedEmployees.push(employee);
      }
    },

    unassignEmployee(employee) {
      const index = this.assignedEmployees.findIndex(emp => emp.id === employee.id);
      if (index !== -1) {
        this.assignedEmployees.splice(index, 1);
      }
    },

    handleSave() {
      this.$emit('save', this.assignedEmployees);
    }
  }
};
</script> 