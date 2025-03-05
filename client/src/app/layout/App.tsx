import { useEffect } from 'react';
import { Activity } from '../interfaces/activity';
import axios from 'axios';
import { Navbar } from '@/components/shared/navbar';
import { ActivityDashboard } from '@/features/activities/dashboard/activity-dashboard';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { useActivityStore } from '../stores/activity.store';

function App() {
  const setActivities = useActivityStore((state) => state.setActivities);
  useEffect(() => {
    const fetchActivities = async () => {
      const response = await axios.get<Activity[]>(
        'https://localhost:5001/api/activities'
      );
      setActivities(response.data);
    };
    fetchActivities();
  }, [setActivities]);

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Navbar />
      <main className='max-w-7xl mx-auto mt-[-56px]'>
        <ActivityDashboard />
      </main>
    </ThemeProvider>
  );
}

export default App;
