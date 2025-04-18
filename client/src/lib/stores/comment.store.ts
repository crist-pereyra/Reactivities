import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { create } from 'zustand';
import { ChatComment } from '../interfaces/comment';

interface CommentStore {
  hubConnection: HubConnection | null;
  comments: ChatComment[];
  resetComments: () => void;
  createHubConnection: (activityId: string) => void;
  stopHubConnection: () => void;
}

export const useCommentStore = create<CommentStore>((set, get) => ({
  hubConnection: null,
  comments: [],
  resetComments: () => set({ comments: [] }),
  createHubConnection: (activityId: string) => {
    if (!activityId) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_COMMENT_URL}?activityId=${activityId}`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();
    connection
      .start()
      .then(() => {
        console.log('Hub connection established');
        set({ hubConnection: connection });
      })
      .catch((error) => {
        console.log('Error establishing connection: ', error);
      });

    connection.on('LoadComments', (comments: ChatComment[]) => {
      set({ comments });
    });
    connection.on('ReceiveComment', (comment: ChatComment) => {
      set({ comments: [comment, ...get().comments] });
    });
  },
  stopHubConnection: () => {
    const connection = get().hubConnection;
    if (connection?.state === HubConnectionState.Connected) {
      connection
        .stop()
        .then(() => {
          console.log('Connection stopped');
          set({ hubConnection: null });
        })
        .catch((error) => {
          console.log('Error stopping connection: ', error);
        });
    }
  },
}));
