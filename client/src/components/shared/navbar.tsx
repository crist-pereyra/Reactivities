import { Users } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { Link, NavLink } from 'react-router-dom';
import { MenuItemLink } from './menu-item-link';
import { useUiStore } from '@/lib/stores/ui.store';
import { motion } from 'framer-motion';
import { useAccount } from '@/lib/hooks/useAccount';
import { Button } from '../ui/button';
import { MenuUser } from './menu-user';

export const Navbar = () => {
  const isLoading = useUiStore((state) => state.isLoading);
  const { currentUser } = useAccount();
  console.log(currentUser);
  return (
    <nav className='sticky h-14 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <header className='flex justify-between max-w-7xl mx-auto items-center h-14 relative'>
        <div className='flex gap-6 items-center'>
          <NavLink to='/' className='flex items-center gap-3'>
            <Users className='size-5' />
            <h1 className='text-lg font-semibold'>Reactivities</h1>
          </NavLink>
          <div className='flex gap-3'>
            <MenuItemLink to='/activities'>Activities</MenuItemLink>
            <MenuItemLink to='/errors'>Errors</MenuItemLink>
          </div>
        </div>
        <div className='flex gap-2'>
          {/* <Button onClick={() => navigate('/createActivity')}>
            Create Activity
          </Button> */}
          {currentUser ? (
            <MenuUser />
          ) : (
            <>
              <Button variant='ghost' asChild>
                <Link to='/login'>Log In</Link>
              </Button>
              <Button asChild>
                <Link to='/register'>Register</Link>
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
        {isLoading && (
          <motion.div
            className='absolute bottom-0 left-0 h-1 bg-primary'
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
          />
        )}
      </header>
    </nav>
  );
};
