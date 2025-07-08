# User Type Testing Guide

This guide explains how to test the new user type functionality that redirects different users to different pages after login.

## How It Works

The system now supports two user types:
- **Employee users**: Redirected to the Employee List page (`/employee`)
- **Company users**: Redirected to the Company Dashboard page (`/dashboard`)

## User Type Determination

User types are determined by the username during login:
- Usernames starting with `admin` or `company` → Company users
- All other usernames → Employee users

## Testing Instructions

### 1. Test Company User Login
1. Open the application
2. Login with username: `admin` or `company` (any password)
3. You should be redirected to the Company Dashboard
4. The dashboard shows:
   - Company statistics (employees, projects, revenue)
   - Quick action buttons
   - Recent activity feed
   - Upcoming events
   - Navigation to Employee List

### 2. Test Employee User Login
1. Open the application
2. Login with any username that doesn't start with `admin` or `company` (e.g., `john`, `user123`)
3. You should be redirected to the Employee List page
4. The employee page now has a "Dashboard" button in the top-left corner

### 3. Test Navigation Between Pages
1. From Company Dashboard:
   - Click "View Employees" or "Add Employee" → Goes to Employee List
   - Click "Logout" → Returns to Login page

2. From Employee List:
   - Click "Dashboard" (top-left) → Goes to Company Dashboard
   - Click "Logout" (top-right) → Returns to Login page

### 4. Test Authentication Guards
1. Try accessing `/dashboard` without logging in → Should redirect to Login
2. Try accessing `/employee` without logging in → Should redirect to Login
3. Login as a company user, then try to access `/employee` directly → Should work
4. Login as an employee user, then try to access `/dashboard` directly → Should work

## Example Test Cases

### Company User Test
```
Username: admin
Password: 123
Expected: Redirect to Company Dashboard
```

### Employee User Test
```
Username: john
Password: 123
Expected: Redirect to Employee List
```

### Company User Test 2
```
Username: company_manager
Password: 123
Expected: Redirect to Company Dashboard
```

## Features Added

1. **Company Dashboard Page** (`/dashboard`)
   - Modern dashboard with statistics cards
   - Quick action buttons
   - Recent activity feed
   - Upcoming events
   - Responsive design

2. **User Type Logic**
   - Automatic user type detection based on username
   - Proper redirection after login
   - Authentication guards for different user types

3. **Navigation**
   - Dashboard button on Employee page
   - Employee management buttons on Dashboard
   - Consistent logout functionality

## Technical Implementation


- Router guards check user type for proper redirection
- Login form determines user type based on username pattern
- All logout functions clear user type from localStorage 