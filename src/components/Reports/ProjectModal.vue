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
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            <i class="bi bi-kanban me-2"></i>
            {{ project ? 'Edit Project' : 'Add New Project' }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSave">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Project Name *</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  class="form-control" 
                  required
                  placeholder="Enter project name"
                >
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Manager *</label>
                <input 
                  v-model="form.manager" 
                  type="text" 
                  class="form-control" 
                  required
                  placeholder="Enter manager name"
                >
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Progress (%)</label>
                <input 
                  v-model.number="form.progress" 
                  type="number" 
                  class="form-control" 
                  min="0" 
                  max="100"
                  placeholder="0-100"
                >
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Deadline</label>
                <input 
                  v-model="form.deadline" 
                  type="date" 
                  class="form-control"
                >
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Team Size</label>
                <input 
                  v-model.number="form.teamSize" 
                  type="number" 
                  class="form-control" 
                  min="1"
                  placeholder="Number of team members"
                >
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea 
                v-model="form.description" 
                class="form-control" 
                rows="3"
                placeholder="Enter project description"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="handleSave"
            :disabled="isSaving"
          >
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
            {{ project ? 'Update Project' : 'Create Project' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectModal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      default: null
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: "",
        manager: "",
        status: "Planning",
        progress: 0,
        deadline: "",
        teamSize: 1,
        description: ""
      }
    };
  },
  watch: {
    project: {
      handler(newProject) {
        if (newProject) {
          // Edit mode - populate form
          this.form = {
            name: newProject.name,
            manager: newProject.manager,
            status: newProject.status,
            progress: newProject.progress,
            deadline: newProject.deadline,
            teamSize: newProject.teamSize,
            description: newProject.description || ""
          };
        } else {
          // Add mode - reset form
          this.form = {
            name: "",
            manager: "",
            status: "Planning",
            progress: 0,
            deadline: "",
            teamSize: 1,
            description: ""
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSave() {
      if (!this.form.name || !this.form.manager) {
        alert("Please fill in all required fields");
        return;
      }
      this.$emit('save', this.form);
    }
  }
};
</script> 