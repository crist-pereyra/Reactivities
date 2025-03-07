import { Navbar } from '@/components/shared/navbar';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Navbar />
      <main className='max-w-7xl mx-auto mt-[-56px]'>
        <Outlet />
      </main>
    </ThemeProvider>
  );
}

export default App;
