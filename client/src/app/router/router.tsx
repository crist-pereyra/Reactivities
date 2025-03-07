import { createBrowserRouter } from 'react-router-dom';
import App from '../layout/App';
import {
  ActivityDashboard,
  ActivityDetail,
  ActivityForm,
  HomePage,
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
        element: <ActivityDetail />,
      },
      {
        path: 'manage/:id',
        element: <ActivityForm />,
      },
    ],
  },
]);
