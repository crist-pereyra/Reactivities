import { Navbar } from '@/components/shared/navbar';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { HomePage } from '@/features';
import { Outlet, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      {location.pathname === '/' ? (
        <HomePage />
      ) : (
        <>
          <Navbar />
          <main className='max-w-7xl mx-auto mt-[-56px]'>
            <Outlet />
          </main>
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
