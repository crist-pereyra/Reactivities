import { Button } from '@/components/ui/button';
import { PlusIcon, XIcon } from 'lucide-react';

interface CampaignTabsProps {
  fields: any[];
  indexSelected: number;
  setIndexSelected: (index: number) => void;
  onAddCampaign: () => void;
  onRemoveCampaign: (index: number) => void;
}

export const CampaignTabs = ({
  fields,
  indexSelected,
  setIndexSelected,
  onAddCampaign,
  onRemoveCampaign,
}: CampaignTabsProps) => {
  return (
    <div className='flex justify-between mb-4'>
      <div className='flex gap-[9px]'>
        {fields.map((item, index) => (
          <div
            className={`rounded-md px-2 py-1 flex gap-2 items-center cursor-pointer ${
              index === indexSelected
                ? 'bg-primary-2 text-primary'
                : 'bg-primary-3 text-gray-400'
            }`}
            key={item.id + index}
            onClick={() => setIndexSelected(index)}
          >
            <span className='text-sm font-medium leading-tight'>
              Oferta {index + 1}
            </span>
            {index !== 0 && (
              <Button
                size='icon'
                variant='ghost'
                className='p-0! h-3 w-3'
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCampaign(index);
                }}
              >
                <XIcon className='size-2.5' />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button
        onClick={onAddCampaign}
        disabled={fields.length === 3}
        size='sm'
        type='button'
      >
        <PlusIcon className='mr-1' />
        Añadir oferta
      </Button>
    </div>
  );
};
