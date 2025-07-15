import axios from 'axios';
import API_BASE_URL from '@/constants/APIBaseURL';

const PROJECT_API_URL = `${API_BASE_URL}/projects`;

class ProjectService {
    
    // Get all projects
    static async getAllProjects() {
        try {
            const response = await axios.get(PROJECT_API_URL);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching all projects:', error);
            throw error;
        }
    }

    // Get project by ID
    static async getProjectById(id) {
        try {
            const response = await axios.get(`${PROJECT_API_URL}/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching project with ID ${id}:`, error);
            throw error;
        }
    }

    // Create new project
    static async createProject(projectData) {
        try {
            const response = await axios.post(PROJECT_API_URL, projectData);
            return response.data.data;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    // Update project
    static async updateProject(id, projectData) {
        try {
            const response = await axios.put(`${PROJECT_API_URL}/${id}`, projectData);
            return response.data.data;
        } catch (error) {
            console.error(`Error updating project with ID ${id}:`, error);
            throw error;
        }
    }

    // Delete project
    static async deleteProject(id) {
        try {
            const response = await axios.delete(`${PROJECT_API_URL}/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error deleting project with ID ${id}:`, error);
            throw error;
        }
    }

    // Assign employees to project
    static async assignEmployeesToProject(projectId, employeeIds) {
        try {
            const response = await axios.post(`${PROJECT_API_URL}/${projectId}/assign-employees`, employeeIds);
            return response.data.data;
        } catch (error) {
            console.error(`Error assigning employees to project ${projectId}:`, error);
            throw error;
        }
    }

    // Remove employees from project
    static async removeEmployeesFromProject(projectId, employeeIds) {
        try {
            const response = await axios.delete(`${PROJECT_API_URL}/${projectId}/remove-employees`, {
                data: employeeIds
            });
            return response.data.data;
        } catch (error) {
            console.error(`Error removing employees from project ${projectId}:`, error);
            throw error;
        }
    }

    // Get projects by employee ID
    static async getProjectsByEmployee(employeeId) {
        try {
            const response = await axios.get(`${PROJECT_API_URL}/employee/${employeeId}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching projects for employee ${employeeId}:`, error);
            throw error;
        }
    }


    

    // Helper method to format project data for API
    static formatProjectData(project) {
        return {
            name: project.name,
            manager: project.manager,
            status: project.status,
            progress: project.progress || 0,
            deadline: project.deadline,
            teamSize: project.teamSize || 1,
            description: project.description || ''
        };
    }

    // Helper method to validate project data
    static validateProjectData(project) {
        const errors = [];
        
        if (!project.name || project.name.trim() === '') {
            errors.push('Project name is required');
        }
        
        if (!project.manager || project.manager.trim() === '') {
            errors.push('Project manager is required');
        }
        
        if (project.progress !== undefined && (project.progress < 0 || project.progress > 100)) {
            errors.push('Progress must be between 0 and 100');
        }
        
        if (project.teamSize !== undefined && project.teamSize < 1) {
            errors.push('Team size must be at least 1');
        }
        
        return errors;
    }

    // Helper method to get project status options
    static getProjectStatusOptions() {
        return [
            { value: 'PLANNING', label: 'Planning' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'ON_HOLD', label: 'On Hold' },
            { value: 'COMPLETED', label: 'Completed' }
        ];
    }

    // Helper method to get status label from value
    static getStatusLabel(statusValue) {
        const statusOptions = this.getProjectStatusOptions();
        const status = statusOptions.find(option => option.value === statusValue);
        return status ? status.label : statusValue;
    }

    // Helper method to get status color
    static getStatusColor(status) {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'primary';
            case 'PLANNING':
                return 'warning';
            case 'ON_HOLD':
                return 'secondary';
            default:
                return 'info';
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

    // Helper method to check if project is overdue
    static isOverdue(deadline) {
        if (!deadline) return false;
        
        const deadlineDate = new Date(deadline);
        const today = new Date();
        
        return deadlineDate < today;
    }

    // Helper method to check if project is due soon (within 7 days)
    static isDueSoon(deadline) {
        if (!deadline) return false;
        
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return deadlineDate >= today && deadlineDate <= weekFromNow;
    }
}

export default ProjectService;
