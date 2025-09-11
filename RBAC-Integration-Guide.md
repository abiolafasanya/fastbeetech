# RBAC Frontend Integration Guide

## 🚀 Quick Start

Your RBAC system is now ready! Here's how to use it in your frontend:

### 1. Basic Usage in Components

```tsx
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGuard } from "@/components/PermissionGuard";

function MyComponent() {
  const { can, hasPermission } = usePermissions();

  return (
    <div>
      {/* Method 1: Using the hook directly */}
      {can.createCourse() && (
        <button>Create Course</button>
      )}

      {/* Method 2: Using PermissionGuard component */}
      <PermissionGuard permission="blog:create">
        <button>Create Blog Post</button>
      </PermissionGuard>

      {/* Method 3: Multiple permissions (any) */}
      <PermissionGuard permissions={["course:edit", "course:delete"]}>
        <div>Course Management Tools</div>
      </PermissionGuard>

      {/* Method 4: Multiple permissions (all required) */}
      <PermissionGuard 
        permissions={["user:manage", "system:admin"]} 
        requireAll={true}
      >
        <div>Super Admin Tools</div>
      </PermissionGuard>
    </div>
  );
}
```

### 2. Protecting Entire Pages

```tsx
import { RequirePermission } from "@/components/RequirePermission";

export default function CreateCoursePage() {
  return (
    <RequirePermission permission="course:create">
      <div>Your course creation form here</div>
    </RequirePermission>
  );
}
```

### 3. Navigation Menu with Permissions

```tsx
import { PermissionGuard } from "@/components/PermissionGuard";

function Navigation() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      
      <PermissionGuard permission="course:create">
        <Link href="/courses/create">Create Course</Link>
      </PermissionGuard>
      
      <PermissionGuard permission="user:manage">
        <Link href="/admin/users">Manage Users</Link>
      </PermissionGuard>
      
      <PermissionGuard permissions={["blog:create", "blog:edit"]}>
        <Link href="/blog/manage">Blog Management</Link>
      </PermissionGuard>
    </nav>
  );
}
```

### 4. Form Fields with Permission-Based Visibility

```tsx
function CourseForm() {
  const { can } = usePermissions();

  return (
    <form>
      <input type="text" placeholder="Course title" />
      <textarea placeholder="Description" />
      
      {can.publishCourse() && (
        <div>
          <label>
            <input type="checkbox" />
            Publish immediately
          </label>
        </div>
      )}

      <PermissionGuard permission="course:featured">
        <label>
          <input type="checkbox" />
          Feature this course
        </label>
      </PermissionGuard>
    </form>
  );
}
```

## 🔐 Available Permissions

Based on your seeded roles, here are the available permissions:

### Course Permissions
- `course:create` - Create new courses
- `course:edit` - Edit existing courses  
- `course:delete` - Delete courses
- `course:publish` - Publish/unpublish courses
- `course:featured` - Mark courses as featured

### Blog Permissions
- `blog:create` - Create blog posts
- `blog:edit` - Edit blog posts
- `blog:delete` - Delete blog posts
- `blog:publish` - Publish blog posts

### User Management
- `user:view` - View user profiles
- `user:create` - Create new users
- `user:edit` - Edit user profiles
- `user:delete` - Delete users
- `user:manage` - Full user management

### System Permissions
- `system:admin` - System administration
- `analytics:view` - View analytics
- `settings:manage` - Manage system settings

## 👥 Role Hierarchy

1. **Super Admin** (17 permissions): Full system access
2. **Admin** (11 permissions): User and content management
3. **Author** (7 permissions): Content creation and editing
4. **Student** (3 permissions): Basic access to view content

## 🎯 Integration Steps

### Step 1: Wrap your app with PermissionInitializer

Add this to your layout or app component:

```tsx
import { PermissionInitializer } from "@/components/PermissionInitializer";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <PermissionInitializer>
          {children}
        </PermissionInitializer>
      </body>
    </html>
  );
}
```

### Step 2: Update your login process

Your auth store now automatically loads permissions after login, but make sure your login flow calls the updated login method:

```tsx
// In your login page/component
const { login } = useAuthStore();

async function handleLogin(credentials) {
  const response = await authApi.login(credentials);
  login(response.user); // This will automatically load permissions
}
```

### Step 3: Protect your routes

Use `RequirePermission` component for pages that need specific permissions:

```tsx
// pages/dashboard/courses/create.tsx
export default function CreateCoursePage() {
  return (
    <RequirePermission permission="course:create">
      <CreateCourseForm />
    </RequirePermission>
  );
}
```

### Step 4: Update your dashboard navigation

Replace role-based checks with permission-based ones:

```tsx
// Old way (role-based)
{user?.role === "admin" && <AdminMenu />}

// New way (permission-based)
<PermissionGuard permission="user:manage">
  <AdminMenu />
</PermissionGuard>
```

## 🛠️ Advanced Usage

### Custom Permission Checks

```tsx
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

// Single permission
const canCreate = hasPermission("course:create");

// Any of multiple permissions
const canManage = hasAnyPermission(["course:edit", "course:delete"]);

// All permissions required
const isFullAdmin = hasAllPermissions(["user:manage", "system:admin"]);
```

### Loading States

```tsx
const { isLoadingPermissions } = usePermissions();

if (isLoadingPermissions) {
  return <div>Loading permissions...</div>;
}
```

### Refreshing Permissions

```tsx
const { refreshPermissions } = usePermissions();

// Call this when user roles change
await refreshPermissions();
```

## 🔄 Testing Your Implementation

1. **Test with different roles**: Create users with different roles and verify they see appropriate UI elements
2. **Test API calls**: Ensure protected API endpoints return 403 for unauthorized users
3. **Test navigation**: Verify users can't access pages they don't have permissions for
4. **Test real-time updates**: When permissions change, UI should update accordingly

## 📝 Next Steps

1. Update your existing pages to use permission-based protection
2. Replace role-based checks with permission-based ones
3. Add permission checks to your API calls
4. Create admin interface for managing user roles and permissions
5. Add audit logging for permission changes

Your RBAC system is now fully integrated and ready to use! 🎉
