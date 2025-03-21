import { Navbar } from '@/components/shared/navbar';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { HomePage } from '@/features';
import { useUiStore } from '@/lib/stores/ui.store';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function App() {
  const location = useLocation();
  const isLoading = useUiStore((state) => state.isLoading);
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      {location.pathname === '/' ? (
        <HomePage />
      ) : location.pathname.startsWith('/login') ||
        location.pathname.startsWith('/register') ? (
        <main className='flex justify-center items-center h-screen relative'>
          {isLoading && (
            <motion.div
              className='absolute top-0 left-0 h-1 bg-primary'
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          )}
          <Outlet />
        </main>
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
