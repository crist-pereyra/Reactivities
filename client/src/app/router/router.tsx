import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../layout/App';
import {
  ActivityDashboard,
  ActivityDetailPage,
  ActivityForm,
  HomePage,
  LoginForm,
  NotFound,
  RegisterForm,
  ServerError,
  TestErrors,
} from '@/features';
import { RequireAuth } from './RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'activities',
            element: <ActivityDashboard />,
          },
          {
            path: 'createActivity',
            element: <ActivityForm key='create' />,
          },
          {
            path: 'activities/:id',
            element: <ActivityDetailPage />,
          },
          {
            path: 'manage/:id',
            element: <ActivityForm />,
          },
        ],
      },
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'register',
        element: <RegisterForm />,
      },
      {
        path: 'errors',
        element: <TestErrors />,
      },
      {
        path: 'not-found',
        element: <NotFound />,
      },
      {
        path: 'server-error',
        element: <ServerError />,
      },
      {
        path: '*',
        element: <Navigate replace to='/not-found' />,
      },
    ],
  },
]);
