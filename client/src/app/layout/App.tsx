import { Navbar } from '@/components/shared/navbar';
import { ActivityDashboard } from '@/features/activities/dashboard/activity-dashboard';
import { ThemeProvider } from '@/components/shared/theme-provider';

function App() {
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
