import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ActivityList } from './activity-list';
import { ActivityDetail } from '../details/activity-detail';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActivityForm } from '../form/activity-form';
import { useActivities } from '@/lib/hooks/useActivities';
import { ActivityCardSkeleton } from '../skeleton/activity-card-skeleton';
import { useActivityStore } from '@/lib/stores/activity.store';

export const ActivityDashboard = () => {
  const { activities, isPending } = useActivities();
  const selectedActivity = useActivityStore((state) => state.selectedActivity);
  const isEditMode = useActivityStore((state) => state.isEditMode);

  return (
    <ResizablePanelGroup direction='horizontal' className='w-full'>
      <ResizablePanel defaultSize={70} className='min-w-[35%]'>
        <ScrollArea className='h-screen'>
          {!activities && isPending ? (
            <div className='flex flex-col gap-3 p-6 mt-14'>
              {Array.from({ length: 5 }).map((_, i) => (
                <ActivityCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ActivityList activities={activities!} />
          )}
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} className='min-w-[25%] p-6 mt-14'>
        {selectedActivity && !isEditMode && (
          <ActivityDetail selectedActivity={selectedActivity} />
        )}
        {isEditMode && <ActivityForm />}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
