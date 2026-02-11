# Toast Notification System

## Overview
A complete toast notification system for displaying user feedback messages (success, error, warning, info).

## Features
- ✅ 4 notification types: success, error, warning, info
- ✅ Auto-dismiss with configurable duration
- ✅ Manual dismiss button
- ✅ Smooth animations (slide-in from right)
- ✅ Stacking support (multiple toasts)
- ✅ TypeScript support
- ✅ Accessible (ARIA attributes)

## Files Created
1. `lib/toast-context.tsx` - Context provider and hooks
2. `components/ToastContainer.tsx` - Toast rendering component
3. Updated `app/layout.tsx` - Global integration
4. Updated `app/globals.css` - Animation styles

## Usage

### Basic Usage

```tsx
'use client';

import { useToast } from '@/lib/toast-context';

export function MyComponent() {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success('Operation completed!')}>
        Success
      </button>
      
      <button onClick={() => toast.error('Something went wrong')}>
        Error
      </button>
      
      <button onClick={() => toast.warning('Please check your input')}>
        Warning
      </button>
      
      <button onClick={() => toast.info('New update available')}>
        Info
      </button>
    </div>
  );
}
```

### Custom Duration

```tsx
// Default is 5000ms (5 seconds)
toast.success('Quick message', 3000);  // 3 seconds
toast.error('Important error', 10000); // 10 seconds
toast.info('Persistent message', 0);   // Never auto-dismiss
```

### Advanced Usage

```tsx
import { useToast } from '@/lib/toast-context';

function MyForm() {
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      await api.post('/data', data);
      toast.success('Data saved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save data');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## API Reference

### Hook: `useToast()`

Returns an object with the following methods:

```typescript
interface ToastContextType {
  // Add any type of toast
  addToast: (type: ToastType, message: string, duration?: number) => void;
  
  // Remove specific toast
  removeToast: (id: string) => void;
  
  // Convenience methods
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  
  // Current toasts array
  toasts: Toast[];
}
```

### Toast Types

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
```

## Styling

Toasts are positioned fixed at `top-4 right-4`. Customize in `ToastContainer.tsx`:

```tsx
<div className="fixed top-4 right-4 z-50 ...">
```

### Colors by Type:
- **Success**: Green (bg-green-50, text-green-800)
- **Error**: Red (bg-red-50, text-red-800)
- **Warning**: Yellow (bg-yellow-50, text-yellow-800)
- **Info**: Blue (bg-blue-50, text-blue-800)

## Examples

### Login Success/Error
```tsx
try {
  await login(credentials);
  toast.success('Login successful! Redirecting...');
  router.push('/dashboard');
} catch (err) {
  toast.error(err.message || 'Login failed');
}
```

### Logout Confirmation
```tsx
const handleLogout = () => {
  logout();
  toast.success('Logout successful. See you soon!');
  router.push('/login');
};
```

### Form Validation
```tsx
if (!email || !password) {
  toast.warning('Please fill in all fields');
  return;
}
```

### API Response
```tsx
const deleteItem = async (id: string) => {
  try {
    await api.delete(`/items/${id}`);
    toast.success('Item deleted successfully');
    fetchItems(); // Refresh list
  } catch (error) {
    toast.error('Failed to delete item');
  }
};
```

### Multiple Toasts
```tsx
// Show multiple toasts in sequence
toast.info('Starting process...');
setTimeout(() => toast.success('Step 1 complete'), 1000);
setTimeout(() => toast.success('Step 2 complete'), 2000);
setTimeout(() => toast.success('All done!'), 3000);
```

## Accessibility

Toasts include proper ARIA attributes:
- `role="alert"` on each toast
- `aria-live="polite"` on container
- `aria-atomic="true"` on container
- `aria-label="Close"` on dismiss button

## Browser Support

Works in all modern browsers that support:
- CSS animations
- React 18+
- ES6+

## Future Enhancements

Potential improvements:
- [ ] Toast queue limit (max 3-5 visible)
- [ ] Action buttons in toasts
- [ ] Position customization (top-left, bottom-right, etc.)
- [ ] Sound notifications
- [ ] Persistent toasts (survive page refresh)
- [ ] Toast history/log
