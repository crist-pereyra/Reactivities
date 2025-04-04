import { useAccount } from '@/lib/hooks/useAccount';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../ui/menubar';
import { useNavigate } from 'react-router-dom';
import { SquareActivityIcon } from '../ui/square-activity';
import { UserIcon } from '../ui/user';
import { LogoutIcon } from '../ui/logout';

export const MenuUser = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAccount();
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className='flex items-center gap-1'>
          <Avatar className='size-5'>
            <AvatarImage
              src={currentUser?.imageUrl || 'https://github.com/shadcn.png'}
              alt={currentUser?.displayName}
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span>{currentUser?.displayName}</span>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate('/createActivity')}>
            <SquareActivityIcon />
            Create Activity
          </MenubarItem>
          <MenubarItem onClick={() => navigate(`/profile/${currentUser?.id}`)}>
            <UserIcon />
            Profile
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => logoutUser.mutate()}>
            <LogoutIcon />
            Logout
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
