
export enum SocialPlatform {
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  LinkedIn = 'LinkedIn',
  TikTok = 'TikTok',
}

export interface Account {
  platform: SocialPlatform;
  username: string;
  followers: number;
  isConnected: boolean;
}

export interface Post {
  id: string;
  platform: SocialPlatform;
  content: string;
  status: 'শিডিউলড' | 'প্রকাশিত';
  scheduledTime: string;
  imageUrl?: string;
}

export interface GeneratedPost {
    platform: SocialPlatform;
    content: string;
    imagePrompt?: string;
    image?: string | null;
}

export interface ResearchSource {
    web?: {
        uri: string;
        title: string;
    }
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    sources?: ResearchSource[];
}
