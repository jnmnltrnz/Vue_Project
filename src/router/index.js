// For Vue 3 + vue-router v4
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/pages/Login.vue';
import Employee from '@/pages/admin/EmployeeList.vue';
import EmployeeDetail from '@/pages/admin/EmployeeDetail.vue';
import CompanyDashboard from '@/pages/admin/CompanyDashboard.vue';
import AddEmployee from '@/pages/admin/AddEmployee.vue';
import Reports from '@/pages/admin/Reports.vue';
import Projects from '@/pages/user/Projects.vue';
import Tasks from '@/pages/admin/Tasks.vue';
import MeetingsPage from '@/pages/admin/Meetings.vue';
import UserTasks from '@/pages/user/UserTasks.vue';
import UserViewTask from '@/pages/user/UserViewTask.vue';
import UserMeetings from '@/pages/user/UserMeetings.vue';

const routes = [
  { path: '/', name: 'Login', component: Login, meta: { title: 'Login - Employee Management System' } },
  // Admin-only routes
  { path: '/employee', name: 'EmployeeList', component: Employee, meta: { title: 'Employees - Employee Management System', requiresAdmin: true } },
  { path: '/employee/:id', name: 'EmployeeDetail', component: EmployeeDetail, meta: { title: 'Employee Details - Employee Management System', requiresAdmin: true } },
  { path: '/dashboard', name: 'CompanyDashboard', component: CompanyDashboard, meta: { title: 'Company Dashboard - Employee Management System', requiresAdmin: true } },
  { path: '/add-employee', name: 'AddEmployee', component: AddEmployee, meta: { title: 'Add Employee - Employee Management System', requiresAdmin: true } },
  { path: '/reports', name: 'Reports', component: Reports, meta: { title: 'Reports - Employee Management System', requiresAdmin: true } },
  { path: '/tasks', name: 'Tasks', component: Tasks, meta: { title: 'Tasks - Employee Management System' } },
  // Non-admin routes
  { path: '/projects', name: 'Projects', component: Projects, meta: { title: 'Projects - Employee System' } },
  { path: '/user-tasks', name: 'UserTasks', component: UserTasks, meta: { title: 'User Tasks - Employee Management System' } },
  { path: '/user-view-task/:id', name: 'UserViewTask', component: UserViewTask, meta: { title: 'View Task - Employee Management System' } },
  { path: '/user-meetings', name: 'UserMeetings', component: UserMeetings, meta: { title: 'My Meetings - Employee Management System' } },
  {
    path: '/meetings',
    name: 'Meetings',
    component: MeetingsPage,
    meta: { title: 'Meeting - Schedule a Meeting' } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('isLoggedIn');
  const username = localStorage.getItem('username');
  const isAdmin = username === 'admin';
  
  // Set the page title
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  
  if (to.name === 'Login' && isAuthenticated) {
    // Redirect based on user role
    if (isAdmin) {
      next({ name: 'CompanyDashboard' });
    } else {
      next({ name: 'Projects' });
    }
  } else if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.meta && to.meta.requiresAdmin && !isAdmin) {
    // Redirect non-admin users trying to access admin pages
    next({ name: 'Projects' });
  } else {
    next();
  }
});

export default router;
