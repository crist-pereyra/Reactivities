import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ActivityList } from './activity-list';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ActivityDashboard = () => {
  return (
    <ResizablePanelGroup direction='horizontal' className='w-full'>
      <ResizablePanel defaultSize={70} className='min-w-[35%]'>
        <ScrollArea className='h-screen'>
          <ActivityList />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} className='min-w-[25%] p-6 mt-14'>
        Activity filter
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
