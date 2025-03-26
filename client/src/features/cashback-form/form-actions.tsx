import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface FormActionsProps {
  onCancel: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

export const FormActions = ({
  onCancel,
  onPrevious,
  isSubmitting,
}: FormActionsProps) => {
  return (
    <div className='flex justify-between mt-8'>
      <Button variant='destructive' type='button' onClick={onCancel}>
        Cancelar registro
      </Button>
      <div className='w-fit flex gap-5'>
        <Button type='button' onClick={onPrevious}>
          Anterior
        </Button>
        <Button type='submit'>
          {isSubmitting ? <Spinner size='small' /> : 'Finalizar registro'}
        </Button>
      </div>
    </div>
  );
};
