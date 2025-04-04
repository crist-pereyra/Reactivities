import { Star } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  isSelected: boolean;
  onClick?: () => void;
}
export const StarButton = ({ isSelected, onClick }: Props) => {
  return (
    <div className='relative'>
      <Button
        onClick={onClick}
        variant='ghost'
        size='icon'
        className='relative cursor-pointer opacity-80 transition-opacity duration-300 text-[#ccab00] hover:text-[#FFD700] hover:opacity-100'
      >
        <Star
          className='size-5 absolute'
          fill={isSelected ? '#FFD700' : 'none'}
        />
      </Button>
    </div>
  );
};
