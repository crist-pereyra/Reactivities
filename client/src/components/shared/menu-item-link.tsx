import { NavLink } from 'react-router-dom';
import { Button } from '../ui/button';

interface Props {
  children: React.ReactNode;
  to: string;
}
export const MenuItemLink = ({ children, to }: Props) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Button
          variant='ghost'
          className={isActive ? 'bg-muted font-bold' : ''}
        >
          {children}
        </Button>
      )}
    </NavLink>
  );
};
