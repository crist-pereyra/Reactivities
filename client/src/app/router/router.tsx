import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../layout/App';
import {
  ActivityDashboard,
  ActivityDetailPage,
  ActivityForm,
  HomePage,
  NotFound,
  ServerError,
  TestErrors,
} from '@/features';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
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
