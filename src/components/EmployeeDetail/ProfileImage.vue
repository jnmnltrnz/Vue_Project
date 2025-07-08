<template>
  <div class="profile-image-container">
    <!-- Profile Image Display -->
    <div class="profile-image-wrapper">
      <div v-if="profileImage" class="profile-image">
        <img 
          :src="profileImage" 
          alt="Profile" 
          @error="handleImageError"
        />
        <div class="profile-overlay">
          <button 
            class="btn btn-sm btn-outline-light me-2" 
            @click="editImage"
            title="Edit Profile Image"
          >
            Update
          </button>
          <button 
            class="btn btn-sm btn-outline-danger" 
            @click="removeImage"
            title="Remove Profile Image"
          >
            Remove
          </button>
        </div>
      </div>
      
      <!-- Default Avatar when no image -->
      <div v-else class="profile-placeholder" @click="addImage">
        <div class="avatar-placeholder">
          <i class="bi bi-person-fill"></i>
        </div>
        <div class="add-image-text">Add Photo</div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileChange"
      style="display: none"
    />

    <!-- Upload Progress Modal -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: isUploading }"
      :style="{
        display: isUploading ? 'block' : 'none',
        background: 'rgba(0,0,0,0.4)',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">Uploading Profile Image</h5>
          </div>
          <div class="modal-body text-center">
            <span class="spinner-border text-primary mb-2"></span>
            <p class="mt-2">{{ loadingMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileImage",
  props: {
    employeeId: {
      type: Number,
      required: true
    },
    currentImage: {
      type: String,
      default: null
    },
    isUploading: {
      type: Boolean,
      default: false
    },
    loadingMessage: {
      type: String,
      default: "Uploading image, please wait..."
    }
  },
  data() {
    return {
      profileImage: this.currentImage
    };
  },
  watch: {
    currentImage(newVal) {
      this.profileImage = newVal;
    }
  },
  methods: {
    addImage() {
      this.$refs.fileInput.click();
    },
    editImage() {
      this.$refs.fileInput.click();
    },
    removeImage() {
      if (confirm("Are you sure you want to remove the profile image?")) {
        this.profileImage = null;
        this.$emit('remove');
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file.');
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB.');
          return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Emit upload event
        this.$emit('upload', file);
      }
      
      // Reset input
      event.target.value = '';
    },
    handleImageError() {
      this.profileImage = null;
      console.log('Failed to load profile image');
    }
  }
};
</script>

<style scoped>
.profile-image-container {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.profile-image-wrapper {
  position: relative;
  width: 200px;
  height: 200px;

  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  border: 2px solid rgba(102, 126, 234, 0.4);
}

.profile-image-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.profile-image {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid #667eea;
  transition: all 0.3s ease;
}

.profile-image:hover {
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-image:hover img {
  transform: scale(1.05);
}

.profile-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(102, 126, 234, 0.7));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  border-radius: 8px;
  backdrop-filter: blur(3px);
}

.profile-image:hover .profile-overlay {
  opacity: 1;
}

.profile-overlay .btn {
  margin: 0 0.25rem;
  border-radius: 8px;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

 
  padding: 0.25rem 0.75rem;
  font-weight: 600;
}

.profile-overlay .btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.profile-overlay .btn i {
  color: #222 !important;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.profile-overlay .btn:hover i {
  color: #8b5cf6 !important;
}

.profile-placeholder {
  width: 100%;
  height: 100%;
  border: 3px dashed #667eea;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #ffffff);
  position: relative;
  overflow: hidden;
}

.profile-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(102, 126, 234, 0.2) 50%, transparent 70%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.profile-placeholder:hover {
  border-color: #8b5cf6;
  background: linear-gradient(145deg, #3d3d3d, #2d2d2d);
  transform: scale(1.02);
}

.avatar-placeholder {
  font-size: 4rem;
  color: #667eea;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

.profile-placeholder:hover .avatar-placeholder {
  color: #8b5cf6;
  transform: scale(1.1);
  text-shadow: 0 0 15px rgba(139, 92, 246, 0.7);
}

.add-image-text {
  font-size: 1rem;
  color: #e0e0e0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.profile-placeholder:hover .add-image-text {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Modal enhancements to match the design */
.modal-content {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  color: #e0e0e0;
}

.modal-header {
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d) !important;
  border-bottom: 1px solid #404040;
  border-radius: 1rem 1rem 0 0;
}

.modal-header .modal-title {
  font-weight: 600;
  color: #e0e0e0;
}

.modal-body {
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  color: #e0e0e0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-image-wrapper {
    width: 160px;
    height: 160px;
  }
  
  .avatar-placeholder {
    font-size: 3rem;
  }
  
  .add-image-text {
    font-size: 0.9rem;
  }
}
</style> 