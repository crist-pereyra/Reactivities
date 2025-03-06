import { Users } from 'lucide-react';
import { Button } from '../ui/button';
import { ModeToggle } from './mode-toggle';
import { useActivityStore } from '@/lib/stores/activity.store';

export const Navbar = () => {
  const handleOpenForm = useActivityStore((state) => state.handleOpenForm);
  return (
    <nav className='sticky h-14 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <header className='flex justify-between max-w-7xl mx-auto items-center h-14'>
        <div className='flex gap-3 items-center'>
          <Users className='size-5' />
          <h1 className='text-lg font-semibold'>Reactivities</h1>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => handleOpenForm()}>Create Activity</Button>
          <ModeToggle />
        </div>
      </header>
    </nav>
  );
};
