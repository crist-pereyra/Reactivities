export interface Activity {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  isCancelled: boolean;
  city: string;
  venue: string;
  latitude: number;
  longitude: number;
  attendees: Profile[];
  isGoing: boolean;
  isHost: boolean;
  hostId: string;
  hostDisplayName: string;
  hostImageUrl?: string;
}

export interface Profile {
  id: string;
  displayName: string;
  bio?: string;
  imageUrl?: string;
  followersCount?: number;
  followingCount?: number;
  following?: boolean;
}
