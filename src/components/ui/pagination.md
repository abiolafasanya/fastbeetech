# Pagination Components Documentation

## Overview
The pagination system consists of three reusable parts:
1. `SimplePagination` - Simple previous/next navigation
2. `Pagination` - Full pagination with page numbers
3. `usePagination` - Custom hook for pagination state management

## Components

### SimplePagination
Simple pagination with just Previous/Next buttons (matches your original design).

```tsx
import { SimplePagination } from "@/components/ui/pagination";

<SimplePagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
  itemName="courses" // Optional, defaults to "items"
  showInfo={true}    // Optional, defaults to true
  className=""       // Optional styling
/>
```

### Pagination
Full pagination with page numbers and ellipsis.

```tsx
import { Pagination } from "@/components/ui/pagination";

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
  itemName="posts"   // Optional
  showInfo={true}    // Optional
  className=""       // Optional
/>
```

## Hook

### usePagination
Custom hook to manage pagination state.

```tsx
import { usePagination } from "@/hooks/usePagination";

function MyComponent() {
  const pagination = usePagination({ 
    initialPage: 1, 
    itemsPerPage: 20 
  });

  const { data } = useQuery({
    queryKey: ["data", pagination.currentPage],
    queryFn: () => fetchData(pagination.getParams())
  });

  return (
    <div>
      {/* Your content */}
      
      <SimplePagination
        currentPage={pagination.currentPage}
        totalPages={data?.pagination.totalPages}
        totalItems={data?.pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={pagination.goToPage}
        itemName="items"
      />
    </div>
  );
}
```

## Usage Examples

### Blog Posts
```tsx
function BlogList() {
  const pagination = usePagination({ itemsPerPage: 12 });
  const { data } = useBlogPosts(pagination.getParams());

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {data?.data?.posts?.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
      {data?.data?.pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={data.data.pagination.totalPages}
          totalItems={data.data.pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.goToPage}
          itemName="posts"
        />
      )}
    </>
  );
}
```

### User Management
```tsx
function UserTable() {
  const pagination = usePagination({ itemsPerPage: 25 });
  const { data } = useUsers(pagination.getParams());

  return (
    <>
      <Table>
        {/* Table content */}
      </Table>
      
      {data?.data?.pagination && (
        <SimplePagination
          currentPage={pagination.currentPage}
          totalPages={data.data.pagination.totalPages}
          totalItems={data.data.pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.goToPage}
          itemName="users"
        />
      )}
    </>
  );
}
```

## Features

### SimplePagination Features
- ✅ Previous/Next navigation
- ✅ Automatic hide when only 1 page
- ✅ Disabled states
- ✅ Customizable item names
- ✅ Optional info text
- ✅ Responsive design

### Pagination Features
- ✅ All SimplePagination features
- ✅ Page number buttons
- ✅ Smart ellipsis (...)
- ✅ Current page highlighting
- ✅ Click to jump to specific page

### usePagination Features
- ✅ State management
- ✅ Parameter generation for API calls
- ✅ Helper methods (goToNext, goToPrevious, reset)
- ✅ Configurable items per page
- ✅ TypeScript support

## Customization

The components are built with shadcn/ui components and can be easily customized by:
1. Modifying the CSS classes
2. Changing the Button variants
3. Adding custom styling via className prop
4. Extending the interfaces for additional props
