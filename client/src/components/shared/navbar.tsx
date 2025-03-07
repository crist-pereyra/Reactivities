import { Users } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { NavLink } from 'react-router-dom';
import { MenuItemLink } from './menu-item-link';

export const Navbar = () => {
  return (
    <nav className='sticky h-14 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <header className='flex justify-between max-w-7xl mx-auto items-center h-14'>
        <div className='flex gap-6 items-center'>
          <NavLink to='/' className='flex items-center gap-3'>
            <Users className='size-5' />
            <h1 className='text-lg font-semibold'>Reactivities</h1>
          </NavLink>
          <div className='flex gap-3'>
            <MenuItemLink to='/activities'>Activities</MenuItemLink>
            <MenuItemLink to='/createActivity'>Create Activity</MenuItemLink>
          </div>
        </div>
        <div className='flex gap-2'>
          {/* <Button onClick={() => navigate('/createActivity')}>
            Create Activity
          </Button> */}
          <ModeToggle />
        </div>
      </header>
    </nav>
  );
};
