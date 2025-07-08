<template>
  <div class="login-center">
    <LoginForm @login-success="onLoginSuccess" />
  </div>
</template>

<script>
import LoginForm from '@/components/Login/LoginForm.vue';
export default {
  name: "LoginPage",
  components: { LoginForm },
  methods: {
    onLoginSuccess() {
      const username = localStorage.getItem('username');
      const isAdmin = username === 'admin';
      
      if (isAdmin) {
        this.$router.push({ name: 'CompanyDashboard' });
      } else {
        this.$router.push({ name: 'Projects' });
      }
    }
  }
};
</script>

<style scoped>
.login-center {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>