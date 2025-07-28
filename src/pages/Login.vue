<template>
  <div class="login-page">
    <!-- Left: Welcome section -->
    <div class="left-panel">
      <div class="welcome-content">
        <h1>Welcome Back</h1>
        <p>
          Manage your team, track projects, and stay organized—all in one place.
          Empower productivity with a streamlined workflow designed for your business.
        </p>
      </div>
    </div>

    <!-- Right: Login form -->
    <div class="right-panel">
      <form class="login-form" @submit.prevent="login">
        <h2>Sign in</h2>
        <input
        v-model="username"
        type="text"
        placeholder="Username"
        required
        class="form-control mb-2"
        :disabled="loading"
        autocomplete="username"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="form-control mb-2"
        :disabled="loading"
        autocomplete="current-password"
      />

        <button type="submit" :disabled="loading">
          {{ loading ? "Signing in..." : "Sign in now" }}
        </button>

        <a href="#" class="forgot-link">Forgot password?</a>

        <p class="terms-text">
          By clicking on "Sign in now" you agree to our
          <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
        </p>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>

import AuthService from "@/services/AuthService";
import EmployeeService from "@/services/EmployeeService";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
      loading: false,
      error: "",
    };
  },
  methods: {

    login() {
      this.error = "";
      this.loading = true;

      this.$nextTick(() => {
        AuthService.login({ username: this.username, password: this.password })
          .then(async (response) => {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", this.username);
      
              const accountId = response.data.data.id.toString();
              localStorage.setItem("accountId", accountId);
              
              // Fetch and store employee full name
              try {
                const employeeResponse = await EmployeeService.getAllEmployees();
                const employee = employeeResponse.data.data.find(emp => {
                  return emp.id === parseInt(accountId);
                });
                
                
                if (employee && employee.firstName && employee.lastName) {
                  const fullName = `${employee.firstName} ${employee.lastName}`;
                  localStorage.setItem("employeeFullName", fullName);
                }
                
              } catch (error) {
                console.error("Error fetching employee details:", error);
              }
            
          })
          .catch(() => (this.error = "Invalid username or password"))
          .finally(() => {
            setTimeout(() => {
              this.loading = false;
              const username = localStorage.getItem('username');


              const isAdmin = username === 'admin';
              
              if (isAdmin) {
                this.$router.push({ name: 'CompanyDashboard' });
              } else {
                this.$router.push({ name: 'Projects' });
              }
            }, 1000);
          });
      });
    },
  },
};
</script>

<style scoped>

:global(html),
:global(body),
:global(#app) {
  margin: 0;
  padding: 0;
  height: 100%;
}

.login-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: "Segoe UI", sans-serif;
}

/* Left side */
.left-panel {
  flex: 1;
  background: url('@/assets/office-background.jpg') no-repeat center center;
  background-size: cover;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: left;
}

.welcome-content {
  max-width: 400px;
}

.welcome-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.welcome-content p {
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.social-icons i {
  font-size: 1.2rem;
  margin-right: 1rem;
  cursor: pointer;
}

/* Right side */
.right-panel {
  flex: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-form {
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.login-form input[type="text"],
.login-form input[type="password"] {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.form-extra {
  text-align: left;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.login-form button {
  width: 100%;
  padding: 0.75rem;
  background: #2da6f8;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-form button:hover:enabled {
  background: #0068b3;
}

.forgot-link {
  display: block;
  text-align: right;
  font-size: 0.9rem;
  color: #007bff;
  margin-bottom: 1rem;
  text-decoration: none;
}

.terms-text {
  font-size: 0.85rem;
  color: #555;
}

.terms-text a {
  color: #007bff;
  text-decoration: none;
}

.error-message {
  color: #e74c3c;
  font-size: 0.95rem;
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .left-panel {
    height: 250px;
    text-align: center;
    justify-content: center;
  }

  .right-panel {
    padding: 1rem;
  }
}
</style>
