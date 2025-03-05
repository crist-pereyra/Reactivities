import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ActivityList } from './activity-list';
import { ActivityDetail } from '../details/activity-detail';
import { useActivityStore } from '@/app/stores/activity.store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActivityForm } from '../form/activity-form';

export const ActivityDashboard = () => {
  const activities = useActivityStore((state) => state.activities);
  const selectedActivity = useActivityStore((state) => state.selectedActivity);
  const isEditMode = useActivityStore((state) => state.isEditMode);

  return (
    <ResizablePanelGroup direction='horizontal' className='w-full'>
      <ResizablePanel defaultSize={70} className='min-w-[35%]'>
        <ScrollArea className='h-screen'>
          <ActivityList activities={activities} />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} className='min-w-[25%] p-6 mt-14'>
        {selectedActivity && !isEditMode && (
          <ActivityDetail activity={selectedActivity} />
        )}
        {isEditMode && <ActivityForm />}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
