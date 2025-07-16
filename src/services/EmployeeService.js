import axios from "axios";
import API_BASE from "../constants/APIBaseURL";

class EmployeeService {
  getAllEmployees() {
    return axios.get(`${API_BASE}/employees`);
  }

  addEmployee(employee, username) {
    return axios.post(`${API_BASE}/addEmployee?username=${encodeURIComponent(username)}`, employee);
  }

  deleteEmployee(id,username,employeeName) {
    return axios.delete(`${API_BASE}/deleteEmployee/${id}?username=${encodeURIComponent(username)}&employeeName=${encodeURIComponent(employeeName)}`);
  }


  uploadDocument(employeeId, file, username) {
    const formData = new FormData();
    formData.append("file", file); // <-- key must be "file"
    return axios.post(`${API_BASE}/employees/${employeeId}/upload?username=${encodeURIComponent(username)}`, formData);
  }

  getDocumentsByEmployeeId(id) {
    return axios.get(`${API_BASE}/employees/${id}/documents`);
  }

  // Delete a document by its document id
  deleteDocument(documentId,username,employeeName, documentName) {
    return axios.delete(`${API_BASE}/documents/${documentId}?username=${encodeURIComponent(username)}&employeeName=${encodeURIComponent(employeeName)}&documentName=${encodeURIComponent(documentName)}`);
  }

  // Upload profile image
  uploadProfileImage(employeeId, file) {
    const formData = new FormData();
    formData.append("profileImage", file);
    return axios.post(`${API_BASE}/employees/${employeeId}/profile-image`, formData);
  }

  // Get profile image
  getProfileImage(employeeId) {
    return axios.get(`${API_BASE}/employees/${employeeId}/profile-image`, );
  }

  // Delete profile image
  deleteProfileImage(employeeId) {
    return axios.delete(`${API_BASE}/employees/${employeeId}/profile-image`);
  }

  // Update employee by ID
  updateEmployee(id, employee, username) {
    return axios.put(`${API_BASE}/updateEmployee/${id}?username=${encodeURIComponent(username)}`, employee);
  }
}

export default new EmployeeService();
