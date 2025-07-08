<template>
  <div style="overflow-x: auto">
    <table class="table table-striped fixed-table table-hover">
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Department</th>
          <th style="text-align: center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="isLoading">
          <tr v-for="n in 5" :key="'skeleton-' + n">
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton skeleton-action"></div></td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="employee in employees" :key="employee.id">
            <td>{{ employee.id }}</td>
            <td>{{ employee.firstName }}</td>
            <td>{{ employee.lastName }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.department || 'N/A' }}</td>
            <!-- Actions -->
            <td style="text-align: center">
              <div class="btn-group" role="group">
                <button
                  class="btn btn-sm btn-outline-info"
                  title="View"
                  @click="
                    $router.push({
                      name: 'EmployeeDetail',
                      params: { id: employee.id },
                    })
                  "
                >
                  👁️
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  title="Delete"
                  @click="$emit('delete', employee.id)"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
          <!-- Show 'No records yet' if employees is empty -->
          <tr v-if="employees.length === 0">
            <td colspan="6" style="text-align: center; color: #888;">No records yet</td>
          </tr>
          <!-- Empty Rows -->
          <tr v-for="n in emptyRows" :key="'empty-' + n">
            <td colspan="6" style="height: 48px"></td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>


export default {
  name: "EmployeeTable",

  props: {
    employees: Array,
    emptyRows: Number,
    allEmployees: Array,
    isLoading: Boolean,
  },

};
</script>

<style scoped>
.fixed-table {
  min-height: 480px;
  max-height: 480px;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

.fixed-table th,
.fixed-table td {
  vertical-align: middle;
  text-align: left;
  height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0.75rem;
}

.fixed-table thead {
  background-color: #f8f9fa;
  font-weight: bold;
  border-bottom: 2px solid #dee2e6;
}

.fixed-table tbody tr:hover {
  background-color: #f1f3f5;
}

.btn-group > .btn {
  margin-right: 0.25rem;
}

.btn:last-child {
  margin-right: 0;
}

.skeleton {
  height: 24px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
  border-radius: 4px;
}
.skeleton-action {
  width: 60px;
  height: 24px;
  margin: 0 auto;
}
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

</style>
