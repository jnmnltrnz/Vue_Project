import axios from 'axios';
import API_BASE_URL from '@/constants/APIBaseURL';

class TaskFeedService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get all posts for a task
    async getTaskPosts(taskId) {
        try {
            const response = await axios.get(`${this.baseURL}/task-feed/tasks/${taskId}/posts`);
            return response.data;
        } catch (error) {
            console.error('Error fetching task posts:', error);
            throw error;
        }
    }

    // Get a specific post by ID
    async getPostById(postId) {
        try {
            const response = await axios.get(`${this.baseURL}/task-feed/posts/${postId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    }

    // Create a new post for a task
    async createPost(taskId, postData, username) {
        try {
            const response = await axios.post(
                `${this.baseURL}/task-feed/tasks/${taskId}/posts?username=${encodeURIComponent(username)}`,
                postData
            );
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    // Update a post
    async updatePost(postId, postData, username) {
        try {
            const response = await axios.put(
                `${this.baseURL}/task-feed/posts/${postId}?username=${encodeURIComponent(username)}`,
                postData
            );
            return response.data;
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    }

    // Delete a post
    async deletePost(postId, username) {
        try {
            const response = await axios.delete(
                `${this.baseURL}/task-feed/posts/${postId}?username=${encodeURIComponent(username)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }

    // Get all comments for a post
    async getPostComments(postId) {
        try {
            const response = await axios.get(`${this.baseURL}/task-feed/posts/${postId}/comments`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post comments:', error);
            throw error;
        }
    }

    // Get a specific comment by ID
    async getCommentById(commentId) {
        try {
            const response = await axios.get(`${this.baseURL}/task-feed/comments/${commentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comment:', error);
            throw error;
        }
    }

    // Create a new comment for a post
    async createComment(postId, commentData, username) {
        try {
            const response = await axios.post(
                `${this.baseURL}/task-feed/posts/${postId}/comments?username=${encodeURIComponent(username)}`,
                commentData
            );
            return response.data;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    }

    // Update a comment
    async updateComment(commentId, commentData, username) {
        try {
            const response = await axios.put(
                `${this.baseURL}/task-feed/comments/${commentId}?username=${encodeURIComponent(username)}`,
                commentData
            );
            return response.data;
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    }

    // Delete a comment
    async deleteComment(commentId, username) {
        try {
            const response = await axios.delete(
                `${this.baseURL}/task-feed/comments/${commentId}?username=${encodeURIComponent(username)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }

    // Get post count for a task
    async getTaskPostCount(taskId) {
        try {
            const response = await axios.get(`${this.baseURL}/task-feed/tasks/${taskId}/post-count`);
            return response.data;
        } catch (error) {
            console.error('Error fetching task post count:', error);
            throw error;
        }
    }

    // Get comment count for a post
    async getPostCommentCount(postId) {
        try {
            const response = await axios.get(`${this.baseURL}/task-feed/posts/${postId}/comment-count`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post comment count:', error);
            throw error;
        }
    }

    // Get posts by author for a specific task
    async getTaskPostsByAuthor(taskId, author) {
        try {
            const response = await axios.get(`${this.baseURL}/task-feed/tasks/${taskId}/posts/author/${encodeURIComponent(author)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching task posts by author:', error);
            throw error;
        }
    }

    // Get all posts by author across all tasks
    async getAllPostsByAuthor(author) {
        try {
            const response = await axios.get(`${this.baseURL}/task-feed/posts/author/${encodeURIComponent(author)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all posts by author:', error);
            throw error;
        }
    }
}

export default new TaskFeedService(); 