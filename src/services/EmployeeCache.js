import { reactive } from 'vue';

// Reactive cache store
const employeeCache = reactive({
  employees: new Map(),
  documents: new Map(),
  profileImages: new Map(),
  lastFetch: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes in milliseconds
});

export default {
  // Check if cache is valid
  isCacheValid() {
    if (!employeeCache.lastFetch) return false;
    return Date.now() - employeeCache.lastFetch < employeeCache.cacheExpiry;
  },

  // Get employee from cache
  getEmployee(id) {
    return employeeCache.employees.get(id);
  },

  // Set employee in cache
  setEmployee(id, employee) {
    employeeCache.employees.set(id, employee);
  },

  // Get documents from cache
  getDocuments(employeeId) {
    return employeeCache.documents.has(employeeId) 
      ? employeeCache.documents.get(employeeId) 
      : undefined;
  },

  // Set documents in cache
  setDocuments(employeeId, documents) {
    employeeCache.documents.set(employeeId, documents);
  },

  // Get profile image URL from cache
  getProfileImage(employeeId) {
    return employeeCache.profileImages.has(employeeId) 
      ? employeeCache.profileImages.get(employeeId) 
      : undefined;
  },

  // Set profile image URL in cache
  setProfileImage(employeeId, imageUrl) {
    employeeCache.profileImages.set(employeeId, imageUrl);
  },

  // Update last fetch time
  updateLastFetch() {
    employeeCache.lastFetch = Date.now();
  },

  // Clear cache
  clearCache() {
    employeeCache.employees.clear();
    employeeCache.documents.clear();
    employeeCache.profileImages.clear();
    employeeCache.lastFetch = null;
  },

  // Clear specific employee cache
  clearEmployeeCache(employeeId) {
    employeeCache.employees.delete(employeeId);
    employeeCache.documents.delete(employeeId);
    employeeCache.profileImages.delete(employeeId);
  },

  // Get all employees from cache
  getAllEmployees() {
    return Array.from(employeeCache.employees.values());
  },

  // Set all employees in cache
  setAllEmployees(employees) {
    employees.forEach(employee => {
      employeeCache.employees.set(employee.id, employee);
    });
  },

  // Check if we have all employees cached
  hasAllEmployees() {
    return employeeCache.employees.size > 0 && this.isCacheValid();
  },

  // Get all cache data for debugging
  getCacheData() {
    return {
      employees: employeeCache.employees,
      documents: employeeCache.documents,
      profileImages: employeeCache.profileImages,
      lastFetch: employeeCache.lastFetch
    };
  }
}; 