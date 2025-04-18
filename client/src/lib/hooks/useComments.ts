import { useEffect, useRef } from 'react';
import { useCommentStore } from '../stores/comment.store';

export const useComments = (activityId?: string) => {
  const isCreated = useRef(false);
  const {
    createHubConnection,
    stopHubConnection,
    hubConnection,
    resetComments,
    comments,
  } = useCommentStore();

  useEffect(() => {
    if (activityId && !isCreated.current) {
      createHubConnection(activityId);
      isCreated.current = true;
    }

    return () => {
      stopHubConnection();
      resetComments();
    };
  }, [activityId, createHubConnection, stopHubConnection, resetComments]);

  return { hubConnection, comments };
};
