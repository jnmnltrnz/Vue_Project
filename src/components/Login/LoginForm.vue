<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        required
        class="form-control mb-2"
        :disabled="loading"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="form-control mb-2"
        :disabled="loading"
      />
      <button type="submit" class="btn btn-primary" :disabled="loading">
        Login
      </button>
      <div v-if="error" class="text-danger mt-2">{{ error }}</div>
    </form>
    <!-- Login Loading Modal -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: loading }"
      :style="{
        display: loading ? 'block' : 'none',
        background: loading ? 'rgba(0,0,0,0.3)' : '',
      }"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">Logging In</h5>
          </div>
          <div class="modal-body d-flex align-items-center">
            <span class="spinner-border spinner-border-sm me-2"></span>
            <span>Please wait while we log you in...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";
export default {
  name: "LoginForm",
  data: () => ({
    username: "",
    password: "",
    error: "",
    loading: false,
  }),
  methods: {
    login() {
      this.error = "";
      this.loading = true;

      this.$nextTick(() => {
        AuthService.login({ username: this.username, password: this.password })
                    .then(() => {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", this.username);
          })
          .catch(() => (this.error = "Invalid username or password"))
          .finally(() => {
            setTimeout(() => {
              this.loading = false;
              this.$emit("login-success");
            }, 1000);
          });
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 350px;
  width: 100%;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
form input,
form button {
  width: 100%;
}
h2 {
  text-align: center;
  width: 100%;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-spinner {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.spinner {
  border: 4px solid #eee;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}
.loading-text {
  font-size: 1.1em;
  color: #333;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

