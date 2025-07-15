import axios from 'axios';
import API_BASE_URL from '@/constants/APIBaseURL';

const TASK_API_URL = `${API_BASE_URL}/tasks`;

class TaskService {
    
    // Get all tasks
    static async getAllTasks() {
        try {
            const response = await axios.get(TASK_API_URL);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching all tasks:', error);
            throw error;
        }
    }

    // Get task by ID
    static async getTaskById(id) {
        try {
            const response = await axios.get(`${TASK_API_URL}/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching task with ID ${id}:`, error);
            throw error;
        }
    }

    // Get all tasks by project ID
    static async getTasksByProjectId(projectId) {
        try {
            const response = await axios.get(`${TASK_API_URL}/project/${projectId}/all`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching tasks for project ${projectId}:`, error);
            throw error;
        }
    }

    // Create new task for a project
    static async createTask(projectId, taskData) {
        try {
            const response = await axios.post(`${TASK_API_URL}/project/${projectId}`, taskData);
            return response.data.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    // Update task
    static async updateTask(id, taskData) {
        try {
            const response = await axios.put(`${TASK_API_URL}/${id}`, taskData);
            return response.data.data;
        } catch (error) {
            console.error(`Error updating task with ID ${id}:`, error);
            throw error;
        }
    }

    // Delete task
    static async deleteTask(id) {
        try {
            const response = await axios.delete(`${TASK_API_URL}/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error deleting task with ID ${id}:`, error);
            throw error;
        }
    }

    // Get tasks by status for a project
    static async getTasksByProjectIdAndStatus(projectId, status) {
        try {
            const response = await axios.get(`${TASK_API_URL}/project/${projectId}/status/${status}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching tasks with status ${status} for project ${projectId}:`, error);
            throw error;
        }
    }

    // Get tasks by priority for a project
    static async getTasksByProjectIdAndPriority(projectId, priority) {
        try {
            const response = await axios.get(`${TASK_API_URL}/project/${projectId}/priority/${priority}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching tasks with priority ${priority} for project ${projectId}:`, error);
            throw error;
        }
    }

    // Get tasks by stage for a project
    static async getTasksByProjectIdAndStage(projectId, stage) {
        try {
            const response = await axios.get(`${TASK_API_URL}/project/${projectId}/stage/${stage}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching tasks with stage ${stage} for project ${projectId}:`, error);
            throw error;
        }
    }

    // Get tasks by assigned person for a project
    static async getTasksByProjectIdAndAssignedTo(projectId, assignedTo) {
        try {
            const response = await axios.get(`${TASK_API_URL}/project/${projectId}/assigned/${encodeURIComponent(assignedTo)}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching tasks assigned to ${assignedTo} for project ${projectId}:`, error);
            throw error;
        }
    }

    // Get overdue tasks for a project
    static async getOverdueTasksByProjectId(projectId) {
        try {
            const response = await axios.get(`${TASK_API_URL}/project/${projectId}/overdue`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching overdue tasks for project ${projectId}:`, error);
            throw error;
        }
    }

    // Get tasks due soon for a project
    static async getTasksDueSoonByProjectId(projectId) {
        try {
            const response = await axios.get(`${TASK_API_URL}/project/${projectId}/due-soon`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching tasks due soon for project ${projectId}:`, error);
            throw error;
        }
    }

    // Get task statistics for a project
    static async getTaskStatisticsByProjectId(projectId) {
        try {
            const response = await axios.get(`${TASK_API_URL}/project/${projectId}/statistics`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching task statistics for project ${projectId}:`, error);
            throw error;
        }
    }

    // Update task status
    static async updateTaskStatus(id, status) {
        try {
            const username = localStorage.getItem("username") || "User";
            const response = await axios.patch(`${TASK_API_URL}/${id}/status?username=${encodeURIComponent(username)}`, { status });
            return response.data.data;
        } catch (error) {
            console.error(`Error updating task status for task ${id}:`, error);
            throw error;
        }
    }

    // Update task progress
    static async updateTaskProgress(id, progress) {
        try {
            const username = localStorage.getItem("username") || "User";
            const response = await axios.patch(`${TASK_API_URL}/${id}/progress?username=${encodeURIComponent(username)}`, { progress });
            return response.data.data;
        } catch (error) {
            console.error(`Error updating task progress for task ${id}:`, error);
            throw error;
        }
    }

    // Unified method to update both status and progress with auto-sync
    static async updateTaskStatusAndProgress(id, status, progress) {
        try {
            const username = localStorage.getItem("username") || "User";
            const updateData = {};
            
            if (status !== undefined && status !== null) {
                updateData.status = status;
            }
            if (progress !== undefined && progress !== null) {
                updateData.progress = progress;
            }
            
            const response = await axios.patch(`${TASK_API_URL}/${id}/update?username=${encodeURIComponent(username)}`, updateData);
            return response.data.data;
        } catch (error) {
            console.error(`Error updating task status and progress for task ${id}:`, error);
            throw error;
        }
    }

    // Assign task to a person
    static async assignTask(id, assignedTo) {
        try {
            const response = await axios.patch(`${TASK_API_URL}/${id}/assign`, { assignedTo });
            return response.data.data;
        } catch (error) {
            console.error(`Error assigning task ${id} to ${assignedTo}:`, error);
            throw error;
        }
    }

    // Get all task priorities
    static async getTaskPriorities() {
        try {
            const response = await axios.get(`${TASK_API_URL}/priorities`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching task priorities:', error);
            throw error;
        }
    }

    // Get all task statuses
    static async getTaskStatuses() {
        try {
            const response = await axios.get(`${TASK_API_URL}/statuses`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching task statuses:', error);
            throw error;
        }
    }

    // Get all task stages
    static async getTaskStages() {
        try {
            const response = await axios.get(`${TASK_API_URL}/stages`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching task stages:', error);
            throw error;
        }
    }

    // Helper method to format task data for API
    static formatTaskData(task) {
        return {
            name: task.name,
            description: task.description || '',
            assignedTo: task.assignedTo,
            priority: task.priority,
            status: task.status,
            progress: task.progress || 0,
            deadline: task.deadline,
            stage: task.stage
        };
    }

    // Helper method to validate task data
    static validateTaskData(task) {
        const errors = [];
        
        if (!task.name || task.name.trim() === '') {
            errors.push('Task name is required');
        }
        
        if (!task.assignedTo || task.assignedTo.trim() === '') {
            errors.push('Task assignee is required');
        }
        
        if (task.progress !== undefined && (task.progress < 0 || task.progress > 100)) {
            errors.push('Progress must be between 0 and 100');
        }
        
        return errors;
    }

    // Helper method to get task priority options
    static getTaskPriorityOptions() {
        return [
            { value: 'LOW', label: 'Low' },
            { value: 'MEDIUM', label: 'Medium' },
            { value: 'HIGH', label: 'High' }
        ];
    }

    // Helper method to get task status options
    static getTaskStatusOptions() {
        return [
            { value: 'PENDING', label: 'Pending' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'ON_HOLD', label: 'On Hold' }
        ];
    }

    // Helper method to get task stage options
    static getTaskStageOptions() {
        return [
            { value: 'DEVELOPMENT', label: 'Development' },
            { value: 'TESTING', label: 'Testing' },
            { value: 'STAGING', label: 'Staging' },
            { value: 'PRODUCTION', label: 'Production' }
        ];
    }

    // Helper method to get priority label from value
    static getPriorityLabel(priorityValue) {
        const priorityOptions = this.getTaskPriorityOptions();
        const priority = priorityOptions.find(option => option.value === priorityValue);
        return priority ? priority.label : priorityValue;
    }

    // Helper method to get status label from value
    static getStatusLabel(statusValue) {
        const statusOptions = this.getTaskStatusOptions();
        const status = statusOptions.find(option => option.value === statusValue);
        return status ? status.label : statusValue;
    }

    // Helper method to get stage label from value
    static getStageLabel(stageValue) {
        const stageOptions = this.getTaskStageOptions();
        const stage = stageOptions.find(option => option.value === stageValue);
        return stage ? stage.label : stageValue;
    }

    // Helper method to get priority color
    static getPriorityColor(priority) {
        switch (priority) {
            case 'HIGH':
                return 'danger';
            case 'MEDIUM':
                return 'warning';
            case 'LOW':
                return 'info';
            default:
                return 'secondary';
        }
    }

    // Helper method to get status color
    static getStatusColor(status) {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'primary';
            case 'PENDING':
                return 'warning';
            case 'ON_HOLD':
                return 'secondary';
            default:
                return 'info';
        }
    }

    // Helper method to get stage color
    static getStageColor(stage) {
        switch (stage) {
            case 'DEVELOPMENT':
                return 'primary';
            case 'TESTING':
                return 'warning';
            case 'STAGING':
                return 'info';
            case 'PRODUCTION':
                return 'success';
            default:
                return 'secondary';
        }
    }

    // Helper method to get progress color
    static getProgressColor(progress) {
        if (progress >= 80) return 'success';
        if (progress >= 60) return 'info';
        if (progress >= 40) return 'warning';
        return 'danger';
    }

    // Helper method to format deadline
    static formatDeadline(deadline) {
        if (!deadline) return 'Not set';
        
        const date = new Date(deadline);
        if (isNaN(date.getTime())) return 'Invalid date';
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Helper method to check if task is overdue
    static isOverdue(deadline) {
        if (!deadline) return false;
        
        const deadlineDate = new Date(deadline);
        const today = new Date();
        
        return deadlineDate < today;
    }

    // Helper method to check if task is due soon (within 7 days)
    static isDueSoon(deadline) {
        if (!deadline) return false;
        
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return deadlineDate >= today && deadlineDate <= nextWeek;
    }

    // Helper method to format task for display
    static formatTaskForDisplay(task) {
        return {
            ...task,
            priorityLabel: this.getPriorityLabel(task.priority),
            statusLabel: this.getStatusLabel(task.status),
            stageLabel: this.getStageLabel(task.stage),
            formattedDeadline: this.formatDeadline(task.deadline),
            isOverdue: this.isOverdue(task.deadline),
            isDueSoon: this.isDueSoon(task.deadline)
        };
    }
}

export default TaskService; 