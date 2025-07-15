import axios from "axios";
import API_BASE from "../constants/APIBaseURL";

class TaskFileService {
  // Upload file for a task
  static uploadTaskFile(taskId, file, username) {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_BASE}/tasks/${taskId}/upload?username=${encodeURIComponent(username)}`, formData);
  }

  // Get all files for a task
  static getTaskFiles(taskId) {
    return axios.get(`${API_BASE}/tasks/${taskId}/files`);
  }

  // Delete a file from a task
  static deleteTaskFile(fileId, username, taskName, fileName) {
    return axios.delete(`${API_BASE}/tasks/files/${fileId}?username=${encodeURIComponent(username)}&taskName=${encodeURIComponent(taskName)}&fileName=${encodeURIComponent(fileName)}`);
  }

  // Download a file
  static downloadTaskFile(fileId) {
    return axios.get(`${API_BASE}/task-files/${fileId}/download`, {
      responseType: 'blob'
    });
  }

  // Add a post/comment to a task
  static addTaskPost(taskId, postData, username) {
    return axios.post(`${API_BASE}/tasks/${taskId}/posts?username=${encodeURIComponent(username)}`, postData);
  }

  // Get all posts for a task
  static getTaskPosts(taskId) {
    return axios.get(`${API_BASE}/tasks/${taskId}/posts`);
  }

  // Delete a post from a task
  static deleteTaskPost(postId, username, taskName) {
    return axios.delete(`${API_BASE}/task-posts/${postId}?username=${encodeURIComponent(username)}&taskName=${encodeURIComponent(taskName)}`);
  }

  // Get task history/audit trail
  static getTaskHistory(taskId) {
    return axios.get(`${API_BASE}/tasks/${taskId}/history`);
  }

  // Update task progress
  static updateTaskProgress(taskId, progress, username) {
    return axios.patch(`${API_BASE}/tasks/${taskId}/progress?username=${encodeURIComponent(username)}`, { progress });
  }

  // Update task status
  static updateTaskStatus(taskId, status, username) {
    return axios.patch(`${API_BASE}/tasks/${taskId}/status?username=${encodeURIComponent(username)}`, { status });
  }
}

export default TaskFileService; 