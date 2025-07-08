// ProjectCache.js
// Simple in-memory cache for projects

let allProjects = null;
let lastFetch = null;

export default {
  hasAllProjects() {
    return Array.isArray(allProjects) && allProjects.length > 0;
  },
  getAllProjects() {
    return allProjects;
  },
  setAllProjects(projects) {
    allProjects = Array.isArray(projects) ? [...projects] : null;
  },
  updateLastFetch() {
    lastFetch = Date.now();
  },
  getLastFetch() {
    return lastFetch;
  },
  clear() {
    allProjects = null;
    lastFetch = null;
  },
  addProject(project) {
    if (!allProjects) allProjects = [];
    allProjects.push(project);
  },
  updateProject(updatedProject) {
    if (!allProjects) return;
    const idx = allProjects.findIndex(p => p.id === updatedProject.id);
    if (idx !== -1) allProjects[idx] = updatedProject;
  },
  deleteProject(projectId) {
    if (!allProjects) return;
    allProjects = allProjects.filter(p => p.id !== projectId);
  }
}; 