<template>
  <div class="mb-3 d-flex justify-content-end">
    <input
    
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      class="form-control"
      style="max-width: 300px; margin-right: 10px;"
      placeholder="Search employees..."
    />
  </div>
</template>

<script>
export default {
  name: "EmployeeSearch",
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue']
};
</script>

<style scoped>

</style>
