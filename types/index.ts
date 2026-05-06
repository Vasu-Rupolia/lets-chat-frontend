export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  dob?: string;
  about?: string;
  skills?: string[];
  hasSentRequest?: boolean;
  hasReceivedRequest?: boolean;
  isFriend?: boolean;
  matchPercentage?: number;
}

export interface Message {
  message: string;
  sender?: string;
  receiver?: string;
  self?: boolean;
  createdAt?: string;
}