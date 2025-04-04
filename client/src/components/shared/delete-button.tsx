import { Trash } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  onClick?: () => void;
}
export const DeleteButton = ({ onClick }: Props) => {
  return (
    <div className='relative'>
      <Button
        onClick={onClick}
        variant='ghost'
        size='icon'
        className='relative cursor-pointer opacity-80 transition-opacity duration-300 text-red-400 hover:text-red-600 hover:opacity-100'
      >
        <Trash className='size-5 absolute' />
      </Button>
    </div>
  );
};
