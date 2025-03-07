import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ActivityList } from './activity-list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActivityFilters } from './activity-filters';

export const ActivityDashboard = () => {
  return (
    <ResizablePanelGroup direction='horizontal' className='w-full'>
      <ResizablePanel defaultSize={75} className='min-w-[35%]'>
        <ScrollArea className='h-screen'>
          <ActivityList />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={25}
        className='min-w-[25%] max-w-[35%] p-6 mt-14'
      >
        <ActivityFilters />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
