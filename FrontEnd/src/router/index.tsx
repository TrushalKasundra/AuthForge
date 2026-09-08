import { createBrowserRouter } from 'react-router';

// Layouts
import AppLayout from '@/view/layout/AppLayout';
import AuthLayout from '@/view/layout/AuthLayout';
import RootLayout from '@/view/layout/RootLayout';

// Pages
import ErrorBoundary from '@/view/error/ErrorBoundary';

import { appRoutes, authRoutes, errorRoutes } from './routes';

const router = createBrowserRouter([{
  ErrorBoundary: ErrorBoundary,
  shouldRevalidate: () => false,  
  element:<RootLayout/>,
  children: [
    // Public routes - redirect to dashboard if logged in
    {
      element: <AuthLayout />,
      children: authRoutes,
    },

    // Protected routes - redirect to login if not authenticated
    {
      element: <AppLayout />,
      children: appRoutes,
    },

    // 404 - Catch all
    ...errorRoutes,
  ]
}]);

export default router;
