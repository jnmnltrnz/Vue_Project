<template>
  <div class="task-view-page">
    <!-- Header -->
    <div class="header-container">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center py-3">
          <div>
            <h1 class="mb-0 text-primary fw-bold">
              <i class="bi bi-list-task me-2"></i>
              {{ task ? task.name : 'Task Details' }}
            </h1>
          </div>
          <button class="btn btn-outline-primary" @click="goBack">
            <i class="bi bi-arrow-left me-2"></i>
            Back to Tasks
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mt-4" v-if="!isLoading">
      <!-- Feed Tabs -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <ul class="nav nav-tabs card-header-tabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link" :class="{ active: activeTab === 'feed' }" @click="switchToTab('feed')" type="button" role="tab">
                    <i class="bi bi-chat-dots me-2"></i>
                    Feed ({{ taskPosts.length }})
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" :class="{ active: activeTab === 'files' }" @click="switchToTab('files')" type="button" role="tab">
                    <i class="bi bi-file-earmark me-2"></i>
                    Files ({{ taskFiles ? taskFiles.length : 0 }})
                  </button>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div class="tab-content">
                <!-- Feed Tab -->
                <div class="tab-pane" :class="{ 'show active': activeTab === 'feed' }" id="feed-tab" role="tabpanel">
                  <div class="row">
                    <!-- Left Column: Progress Only -->
                    <div class="col-lg-4">
                      <!-- Task Progress Section -->
                      <div class="task-progress-section mb-4" v-if="task">
                        <div class="card border-0 shadow-sm">
                          <div class="card-body p-4">
                            <h6 class="mb-3 fw-bold text-primary">
                              <i class="bi bi-speedometer2 me-2"></i>
                              Task Progress
                            </h6>
                            <div class="mb-3">
                              <label class="form-label fw-semibold">Progress (%)</label>
                              <div class="d-flex align-items-center">
                                <input 
                                  v-model.number="progressUpdate" 
                                  type="range" 
                                  class="form-range flex-grow-1 me-3" 
                                  min="0" 
                                  max="100"
                                  step="5"
                                >
                                <span class="badge bg-primary fs-6">{{ progressUpdate }}%</span>
                              </div>
                            </div>
                            <div class="mb-3">
                              <label class="form-label fw-semibold">Status</label>
                              <select v-model="statusUpdate" class="form-select">
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="ON_HOLD">On Hold</option>
                              </select>
                            </div>
                            <div class="text-center mb-3">
                              <div class="progress-circle" :style="progressCircleStyle">
                                <div class="progress-circle-inner">
                                  <span class="progress-text">{{ progressUpdate }}%</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              class="btn btn-primary w-100"
                              @click="updateTaskProgress"
                              :disabled="isUpdatingProgress"
                            >
                              <span v-if="isUpdatingProgress" class="spinner-border spinner-border-sm me-2"></span>
                              <i class="bi bi-check-circle me-2"></i>
                              Update Progress
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column: Create Post and Posts Feed -->
                    <div class="col-lg-8">
                      <!-- Create Post Area - Now at the top -->
                      <div class="create-post-area mb-4">
                        <div class="card border-0 shadow-sm">
                          <div class="card-body p-3">
                            <h6 class="mb-2 fw-bold text-primary">
                              <i class="bi bi-chat-dots me-2"></i>
                              Create Post
                            </h6>
                            <div class="d-flex align-items-start">
                              <div class="flex-grow-1">
                                <textarea 
                                  v-model="newPostContent" 
                                  class="form-control post-input" 
                                  rows="3"
                                  placeholder="Post your progress..."
                                  @keydown.ctrl.enter="addPost"
                                  @keydown.enter.exact="handleEnterKey"
                                ></textarea>
                                <div class="d-flex justify-content-between align-items-center mt-2">
                                  <small class="text-muted">Press Enter to post</small>
                                  <button class="btn btn-primary btn-sm px-4" @click="addPost" :disabled="!newPostContent.trim() || isAddingPost">
                                    <span v-if="isAddingPost" class="spinner-border spinner-border-sm me-2"></span>
                                    <i class="bi bi-send me-1"></i>
                                    Post
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Posts Feed -->
                      <div class="posts-feed">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                          <h6 class="mb-0 fw-bold text-primary">
                            <i class="bi bi-chat-dots me-2"></i>
                            Task Feed
                          </h6>
                          <span class="badge bg-primary">{{ taskPosts.length }} posts</span>
                        </div>

                        <!-- Empty State -->
                        <div v-if="taskPosts.length === 0" class="empty-state text-center py-5">
                          <div class="empty-icon mb-3">
                            <i class="bi bi-chat-dots text-muted"></i>
                          </div>
                          <h5 class="text-muted mb-2">No posts yet</h5>
                          <p class="text-muted mb-3">Be the first to share something!</p>
                          <button class="btn btn-primary" @click="focusPostInput">
                            <i class="bi bi-plus-circle me-2"></i>
                            Create First Post
                          </button>
                        </div>
                        
                        <!-- Posts Container -->
                        <div v-else class="posts-container">
                          <div v-for="post in taskPosts" :key="post.id" class="post-card mb-4" :data-post-id="post.id">
                            <div class="card border-0 shadow-sm">
                              <div class="card-body p-4">
                                <!-- Post Header -->
                                <div class="d-flex align-items-start mb-3">
                                  <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between align-items-start">
                                      <div class="d-flex align-items-center">
                                        <div class="profile-avatar me-3">
                                          <span class="avatar-initials">{{ getInitials(post.author) }}</span>
                                        </div>
                                        <div>
                                          <h6 class="mb-0 fw-bold post-author">{{ post.author }}</h6>
                                          <small class="text-muted post-time">{{ formatDateTime(post.createdAt) }}</small>
                                        </div>
                                      </div>
                                      <div class="dropdown" v-if="canDeletePost(post)">
                                        <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                                          <i class="bi bi-three-dots"></i>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                          <li>
                                            <button class="dropdown-item text-danger" @click="deletePost(post.id)">
                                              <i class="bi bi-trash me-2"></i>
                                              Delete Post
                                            </button>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <!-- Post Content -->
                                <div class="post-content mb-4">
                                  <p class="mb-0 post-text">{{ post.content }}</p>
                                </div>

                                <!-- Post Actions -->
                                <div class="post-actions">
                                  <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center">
                                      <button class="btn btn-link text-muted p-0 d-flex align-items-center me-4" @click="focusCommentInput(post.id)">
                                        <i class="bi bi-chat me-1"></i>
                                        <span class="comment-count">{{ post.comments ? post.comments.length : 0 }} comments</span>
                                      </button>
                                    </div>
                                  </div>

                                  <!-- Comments Section -->
                                  <div v-if="post.comments && post.comments.length > 0" class="comments-section mt-4">
                                    <div v-for="comment in post.comments" :key="comment.id" class="comment-item mb-3">
                                      <div class="d-flex align-items-start">
                                        <div class="comment-avatar me-2">
                                          <span class="avatar-initials-small">{{ getInitials(comment.author) }}</span>
                                        </div>
                                        <div class="flex-grow-1">
                                          <div class="comment-content p-3 bg-light rounded">
                                            <div class="d-flex align-items-center mb-1">
                                              <span class="fw-bold small comment-author">{{ comment.author }}</span>
                                              <small class="text-muted ms-2">{{ formatDateTime(comment.createdAt) }}</small>
                                            </div>
                                            <p class="mb-0 comment-text">{{ comment.content }}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <!-- Add Comment -->
                                  <div class="add-comment mt-4">
                                    <div class="d-flex align-items-center">
                                      <div class="flex-grow-1">
                                        <div class="input-group">
                                          <input 
                                            type="text" 
                                            class="form-control comment-input" 
                                            placeholder="Write a comment..." 
                                            :value="commentInputs[post.id] || ''"
                                            @input="commentInputs[post.id] = $event.target.value" 
                                            @keyup.enter="addComment(post.id)"
                                            @focus="focusCommentInput(post.id)"
                                          />
                                          <button 
                                            class="btn btn-outline-primary" 
                                            @click="addComment(post.id)"
                                            :disabled="!(commentInputs[post.id] || '').trim()"
                                          >
                                            Send
                                            <i class="bi bi-send"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Files Tab -->
                <div class="tab-pane" :class="{ 'show active': activeTab === 'files' }" id="files-tab" role="tabpanel">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0 fw-semibold" style="color: #000;">Task Files</h6>
                    <button class="btn btn-primary btn-sm" @click="showFileUploadModal = true">
                      <i class="bi bi-upload me-1"></i>
                      Upload File
                    </button>
                  </div>
                  <div v-if="taskFiles && taskFiles.length" class="mt-4">
                    <ul class="list-group list-group-flush">
                      <li
                        v-for="(file) in taskFiles"
                        :key="file.id"
                        class="list-group-item d-flex justify-content-between align-items-center py-3"
                      >
                        <div class="d-flex align-items-center flex-grow-1">
                          <span v-if="file.fileType?.startsWith('image/')" class="me-3">
                            <img
                              :src="getDownloadUrl(file.id)"
                              :alt="file.fileName"
                              class="rounded border"
                              style="max-width: 100px; max-height: 60px"
                            />
                          </span>

                          <span
                            v-else
                            class="me-3 d-flex align-items-center justify-content-center bg-light rounded"
                            style="width: 100px; height: 60px"
                          >
                            <i class="bi bi-file-earmark-text fs-3 text-muted"></i>
                          </span>

                          <div class="text-truncate" style="max-width: 400px">
                            <span class="badge bg-secondary me-2">{{ getFileType(file.fileName) }}</span>
                            <a
                              :href="getDownloadUrl(file.id)"
                              target="_blank"
                              class="text-decoration-none text-dark"
                              >{{ file.fileName }}</a
                            >
                            <div class="small text-muted mt-1">
                              Size: {{ formatFileSize(file.fileSize) }}
                            </div>
                          </div>
                        </div>
                        <div class="d-flex align-items-center me-3">
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteFile(file.id, file.fileName)"
                            :disabled="isUploadingFile"
                          >
                            <i class="bi bi-trash"></i> Remove
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div v-else class="text-muted mt-3">No files uploaded yet.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="container mt-4">
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading task details...</p>
      </div>
    </div>

    <!-- File Upload Modal -->
    <div :class="['modal fade', { show: showFileUploadModal }]" tabindex="-1" :style="{ display: showFileUploadModal ? 'block' : 'none', background: showFileUploadModal ? 'rgba(0,0,0,0.3)' : '' }" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-upload me-2"></i>
              Upload File
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeFileUploadModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="uploadFile">
              <div class="mb-3">
                <label class="form-label">Select File</label>
                <input ref="fileInput" type="file" class="form-control" @change="handleFileChange" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.zip,.rar">
                <div class="form-text">Maximum file size: 10MB</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeFileUploadModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="uploadFile" :disabled="!selectedFile || isUploadingFile">
              <span v-if="isUploadingFile" class="spinner-border spinner-border-sm me-2"></span>
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>



    <!-- Error Modal -->
    <div :class="['modal fade', { show: error }]" tabindex="-1" :style="{ display: error ? 'block' : 'none', background: error ? 'rgba(0,0,0,0.3)' : '' }" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Error
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="error = null"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">{{ error }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="error = null">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div :class="['modal fade', { show: successMessage }]" tabindex="-1" :style="{ display: successMessage ? 'block' : 'none', background: successMessage ? 'rgba(0,0,0,0.3)' : '' }" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="bi bi-check-circle me-2"></i>
              Success
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="successMessage = null"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">{{ successMessage }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="successMessage = null">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskService from "@/services/TaskService";
import TaskFileService from "@/services/TaskFileService";
import TaskFeedService from "@/services/TaskFeedService";

export default {
  name: "UserViewTaskPage",
  data() {
    return {
      taskId: null,
      task: null,
      isLoading: true,
      isUploadingFile: false,
      isAddingPost: false,
      isUpdatingProgress: false,
      
      // Active tab
      activeTab: 'feed',
      
      // File upload
      showFileUploadModal: false,
      selectedFile: null,
      
      // Posts
      newPostContent: "",
      taskPosts: [],
      commentInputs: {},
      
      // Files with caching
      taskFiles: [],
      filesCache: new Map(),
      lastFilesFetch: null,
      cacheTimeout: 30000, // 30 seconds
      
      // Error handling
      error: null,
      successMessage: null,

      // Progress and Status
      progressUpdate: 0,
      statusUpdate: "PENDING",
    };
  },
  created() {
    this.taskId = this.$route.params.id;
    this.loadTaskData();
  },
  
  beforeUnmount() {
    // Clear cache when component is destroyed
    this.filesCache.clear();
  },
  computed: {
    progressCircleStyle() {
      return {
        '--progress': this.progressUpdate
      };
    }
  },
  watch: {
    progressUpdate(newValue) {
      this.updateProgressCircle(newValue);
    }
  },
  methods: {
    async loadTaskData() {
      try {
        this.isLoading = true;
        this.task = await TaskService.getTaskById(this.taskId);
        await this.loadTaskFiles();
        await this.loadTaskPosts();
        this.progressUpdate = this.task.progress;
        this.statusUpdate = this.task.status;
      } catch (error) {
        console.error("Error loading task data:", error);
        this.error = "Failed to load task data. Please try again.";
      } finally {
        this.isLoading = false;
      }
      
    },

      async loadTaskFiles(forceRefresh = false) {
      const now = Date.now();
      const cacheKey = `task_${this.taskId}_files`;
      
      // Check cache if not forcing refresh
      if (!forceRefresh && this.filesCache.has(cacheKey)) {
        const cached = this.filesCache.get(cacheKey);
        if (now - cached.timestamp < this.cacheTimeout) {
          this.taskFiles = cached.data;
          return;
        }
      }
      
      try {
        const res = await TaskFileService.getTaskFiles(this.taskId);
        const parsedData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        const files = parsedData.data || [];
        
        // Update cache
        this.filesCache.set(cacheKey, {
          data: files,
          timestamp: now
        });
        
        this.taskFiles = files;
        this.lastFilesFetch = now;
      
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        this.taskFiles = [];
      }
    },

    async loadTaskPosts() {
      try {
        const response = await TaskFeedService.getTaskPosts(this.taskId);
        this.taskPosts = response.data || [];
      } catch (error) {
        console.error("Error loading task posts:", error);
      }
    },

    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },

    async uploadFile() {
      if (!this.selectedFile) return;
      
      this.isUploadingFile = true;
      this.error = null;
      this.successMessage = null;
 
      try {
        const username = localStorage.getItem("username") || "User";
        await TaskFileService.uploadTaskFile(this.taskId, this.selectedFile, username);
        await this.loadTaskFiles(true); // Force refresh after upload
        this.closeFileUploadModal();
        this.successMessage = "File uploaded successfully!";
      } catch (error) {
        console.error("Error uploading file:", error);
        this.error = "Failed to upload file. Please try again.";
      } finally {
        this.isUploadingFile = false;
      }
    },

    // async downloadFile(fileId) {
    //   try {
    //     const response = await TaskFileService.downloadTaskFile(fileId);
    //     const blob = new Blob([response.data]);
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'task-file';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     window.URL.revokeObjectURL(url);
    //   } catch (error) {
    //     console.error("Error downloading file:", error);
    //     this.error = "Failed to download file. Please try again.";
    //   }
    // },

    async deleteFile(fileId, fileName) {
      if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;
      
      try {
        const username = localStorage.getItem("username") || "User";
        await TaskFileService.deleteTaskFile(fileId, username, this.task.name, fileName);
        await this.loadTaskFiles(true); // Force refresh after delete
        this.successMessage = "File deleted successfully!";
      } catch (error) {
        console.error("Error deleting file:", error);
        this.error = "Failed to delete file. Please try again.";
      }
    },

    async addPost() {
      if (!this.newPostContent.trim()) return;
      this.isAddingPost = true;
      this.error = null;
      this.successMessage = null;
      try {
        const username = localStorage.getItem("username") || "User";
        const postData = {
          content: this.newPostContent.trim(),
        };
        
        const response = await TaskFeedService.createPost(this.taskId, postData, username);
        const newPost = response.data;
        
        // Add the new post to the beginning of the list
        this.taskPosts.unshift(newPost);
        this.newPostContent = "";
        this.successMessage = "Post added successfully!";
      } catch (error) {
        console.error("Error adding post:", error);
        this.error = "Failed to add post. Please try again.";
      } finally {
        this.isAddingPost = false;
      }
    },

    focusPostInput() {
      this.$nextTick(() => {
        const textarea = document.querySelector('.post-input');
        if (textarea) {
          textarea.focus();
        }
      });
    },

    async deletePost(postId) {
      if (!confirm("Are you sure you want to delete this post?")) return;
      try {
        const username = localStorage.getItem("username") || "User";
        await TaskFeedService.deletePost(postId, username);
        this.taskPosts = this.taskPosts.filter(post => post.id !== postId);
        this.successMessage = "Post deleted successfully!";
      } catch (error) {
        console.error("Error deleting post:", error);
        this.error = "Failed to delete post. Please try again.";
      }
    },

    async addComment(postId) {
      const commentContent = this.commentInputs[postId];
      if (!commentContent || !commentContent.trim()) return;
      
      try {
        const username = localStorage.getItem("username") || "User";
        const commentData = {
          content: commentContent.trim(),
        };
        
        const response = await TaskFeedService.createComment(postId, commentData, username);
        const newComment = response.data;
        
        // Find the post and add the comment
        const post = this.taskPosts.find(p => p.id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(newComment);
        }
        
        // Clear the specific comment input for this post
        this.commentInputs[postId] = '';
      } catch (error) {
        console.error("Error adding comment:", error);
        this.error = "Failed to add comment. Please try again.";
      }
    },

    focusCommentInput(postId) {
      this.$nextTick(() => {
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        if (postElement) {
          const commentInput = postElement.querySelector('.comment-input');
          if (commentInput) {
            commentInput.focus();
          }
        }
      });
    },

    closeFileUploadModal() {
      this.showFileUploadModal = false;
      this.selectedFile = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },

    async updateTaskProgress() {
      if (this.isUpdatingProgress) return;
      this.isUpdatingProgress = true;
      this.error = null;
      this.successMessage = null;

      try {
        // Use unified method to update both status and progress with auto-sync
        const updatedTask = await TaskService.updateTaskStatusAndProgress(
          this.taskId, 
          this.statusUpdate, 
          this.progressUpdate
        );
        
        // Update local task data with the response from server
        this.task = updatedTask;
        this.progressUpdate = updatedTask.progress;
        this.statusUpdate = updatedTask.status;
        
        // Update progress circle
        this.updateProgressCircle(updatedTask.progress);
        
        this.successMessage = "Task updated successfully!";
      } catch (error) {
        console.error("Error updating task:", error);
        this.error = "Failed to update task. Please try again.";
      } finally {
        this.isUpdatingProgress = false;
      }
    },

    canDeleteFile(file) {
      const currentUser = localStorage.getItem("employeeFullName") || localStorage.getItem("username");
      return file.uploadedBy === currentUser || localStorage.getItem("username") === "admin";
    },

    canDeletePost(post) {
      const currentUser = localStorage.getItem("employeeFullName") || localStorage.getItem("username");
      return post.author === currentUser || localStorage.getItem("username") === "admin";
    },

    formatDateTime(dateString) {
      if (!dateString) return "Unknown";
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatFileSize(bytes) {
      if (!bytes) return "Unknown size";
      if (bytes === 0) return '0 Bytes';
      
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },

    goBack() {
      // Check if user is admin based on username in localStorage
      const username = localStorage.getItem("username");
      const isAdmin = username && (username.toLowerCase().includes('admin') || username.toLowerCase().includes('manager'));
      
      // Preserve the project parameter when going back
      const projectId = this.$route.query.project;
      const query = projectId ? { project: projectId } : {};
      
      if (isAdmin) {
        // Admin users go to Tasks.vue
        this.$router.push({ name: 'Tasks', query: query });
      } else {
        // Regular users go to UserTasks.vue
        this.$router.push({ name: 'UserTasks', query: query });
      }
    },

    switchToTab(tabName) {
      this.activeTab = tabName;
    },

    updateProgressCircle(progress) {
      const progressCircle = document.querySelector('.progress-circle');
      if (progressCircle) {
        progressCircle.style.setProperty('--progress', `${progress * 3.6}deg`);
      }
    },

    handleEnterKey(event) {
      // Allow Enter for new lines, but Ctrl+Enter to post
      if (event.ctrlKey) {
        event.preventDefault();
        this.addPost();
      }
    },

    getInitials(name) {
      if (!name) return '?';
      
      // Split the name into parts and get initials
      const nameParts = name.trim().split(' ');
      if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
      } else {
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
      }
    },
    // Add utility methods for file type and download URL
    getFileType(fileName) {
      if (!fileName) return "Unknown";
      const extension = fileName.split(".").pop()?.toLowerCase();
      if (!extension) return "Unknown";
      
      const fileTypes = {
        'pdf': 'PDF', 'doc': 'DOC', 'docx': 'DOCX', 'txt': 'TXT', 
        'jpg': 'JPG', 'jpeg': 'JPEG', 'png': 'PNG', 'gif': 'GIF', 
        'bmp': 'BMP', 'xls': 'XLS', 'xlsx': 'XLSX', 'ppt': 'PPT', 
        'pptx': 'PPTX', 'zip': 'ZIP', 'rar': 'RAR', 'mp4': 'MP4', 
        'mp3': 'MP3', 'avi': 'AVI', 'mov': 'MOV'
      };
      return fileTypes[extension] || extension.toUpperCase();
    },
    getDownloadUrl(fileId) {
      return `https://springboot-project-production-6718.up.railway.app/api/tasks/files/${fileId}/download`;
    },
    

  }
};
</script>

<style scoped>
.task-view-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header-container {
  background: linear-gradient(135deg, #2da6f8 0%, #ffffff 100%);
  color: white;
}

.header-container h1 {
  color: white !important;
}

.card {
  border: none;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  color: #007bff;
  background-color: transparent;
  border-bottom: 2px solid #007bff;
}

.nav-tabs .nav-link:hover {
  border-color: transparent;
  color: #007bff;
}

/* Facebook-style feed */
.create-post-area {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: box-shadow 0.3s ease;
}

.create-post-area:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.post-input {
  background: #f8f9fa;
  border: none;
  border-radius: 16px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  font-size: 1rem;
  resize: none;
  min-height: 60px;
}

.post-input:hover {
  background: #e9ecef;
}

.post-input:focus {
  background: #fff;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
  outline: none;
}

.empty-state {
  background: #fff;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.empty-icon i {
  font-size: 4rem;
  opacity: 0.5;
}

.posts-container {
  max-width: 800px;
  margin: 0 auto;
}

.post-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.post-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}



.post-author {
  color: #1a1a1a;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.post-time {
  font-size: 0.85rem;
  color: #6c757d;
}

.post-content {
  margin: 1.5rem 0;
  background-color: rgba(108, 117, 125, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  width: 400px;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.post-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
  margin: 0;
}

/* File display styling */
.list-group-item {
  border: none;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}

.list-group-item:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.list-group-item img {
  object-fit: cover;
  border-radius: 8px;
}

.list-group-item .badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.list-group-item a {
  font-weight: 500;
  transition: color 0.2s ease;
}

.list-group-item a:hover {
  color: #007bff !important;
}

.list-group-item .btn-outline-danger {
  border-radius: 8px;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  transition: all 0.2s ease;
}

.list-group-item .btn-outline-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

img {
  object-fit: cover;
}

.post-actions {
  border-top: 1px solid #f1f3f4;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.post-actions .btn-link {
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.post-actions .btn-link:hover {
  color: #007bff !important;
  background-color: #f8f9fa;
  transform: translateY(-1px);
}

.comment-count {
  font-weight: 500;
}

.comments-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f3f4;
}

/* Two-column layout styles */
.posts-feed {
  height: 100%;
}

.task-progress-section {

  top: 20px;
}

.create-post-area {
  margin-top: 20px;
}

/* Progress circle styles */
.progress-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#007bff 0dstart(--progress, 0deg), #e9ecef var(--progress, 0deg) 360deg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  --progress: 0deg;
}

.progress-circle-inner {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.progress-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .col-lg-4 {
    margin-bottom: 2rem;
  }
  
  .task-progress-section,
  .create-post-area {
    position: static;
  }
}

.comment-item {
  margin-bottom: 1rem;
}



.comment-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.comment-content:hover {
  background: #f1f3f4;
  border-color: #dee2e6;
}

.comment-author {
  color: #1a1a1a;
  font-weight: 600;
}

.comment-text {
  color: #2c3e50;
  line-height: 1.5;
  margin: 0;
  text-align: left;
}

.add-comment {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f3f4;
}

.comment-input {
  border-radius: 24px 0 0 24px;
  border: 1px solid #e9ecef;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.comment-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.add-comment .btn {
  border-radius: 0 24px 24px 0;
  border: 1px solid #007bff;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
}

.add-comment .btn:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
}

.add-comment .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border-radius: 12px;
  padding: 0.5rem 0;
}

.dropdown-item {
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #dc3545;
}

.dropdown-item.text-danger:hover {
  background-color: #fef2f2;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .post-card {
    margin-bottom: 1rem;
  }
  
  .post-text {
    font-size: 1rem;
  }
  
  .comment-input {
    font-size: 0.9rem;
  }
  
  .create-post-area {
    margin-bottom: 1rem;
  }
}

/* Animation improvements */
.post-card {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus states for accessibility */
.post-input:focus,
.comment-input:focus {
  outline: none;
}

/* Loading states */
.post-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Success states */
.post-card.success {
  border-left: 4px solid #28a745;
}

/* Progress Circle Styles */
.progress-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(#007bff 0deg, #007bff calc(var(--progress) * 3.6deg), #e9ecef calc(var(--progress) * 3.6deg), #e9ecef 360deg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  transition: all 0.3s ease;
}

.progress-circle-inner {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.progress-text {
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
}

.task-progress-section {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: box-shadow 0.3s ease;
}

.task-progress-section:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.form-range {
  height: 8px;
  border-radius: 4px;
  background: #e9ecef;
}

.form-range::-webkit-slider-thumb {
  background: #007bff;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}

.form-range::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.form-range::-moz-range-thumb {
  background: #007bff;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.form-range::-moz-range-thumb:hover {
  transform: scale(1.1);
}

.form-select {
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.badge {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

/* Responsive improvements for progress section */
@media (max-width: 768px) {
  .progress-circle {
    width: 80px;
    height: 80px;
  }
  
  .progress-circle-inner {
    width: 64px;
    height: 64px;
  }
  
  .progress-text {
    font-size: 16px;
  }
}

/* Profile Avatar Styles */
.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.avatar-initials {
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.avatar-initials-small {
  color: white;
  font-weight: bold;
  font-size: 12px;
  text-shadow: 0 1px 1px rgba(0,0,0,0.2);
}

/* Responsive avatar adjustments */
@media (max-width: 768px) {
  .profile-avatar {
    width: 40px;
    height: 40px;
  }
  
  .avatar-initials {
    font-size: 16px;
  }
  
  .comment-avatar {
    width: 28px;
    height: 28px;
  }
  
  .avatar-initials-small {
    font-size: 10px;
  }
}
</style> 