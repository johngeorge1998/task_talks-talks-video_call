import { Socket } from "socket.io-client";

export interface User {
  id: string;
  username: string;
  stream?: MediaStream;
  peerId?: string;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
}

export interface HomeProps {
  setUsername: (username: string) => void;
}

export interface CallProps {
  username: string;
}

export interface ChatProps {
  socket: Socket;
  roomId: string;
  username: string;
}

export interface Message {
  username: string;
  text: string;
  timestamp: number;
}

export interface ControlsProps {
  toggleVideo: () => void;
  toggleAudio: () => void;
  leaveCall: () => void;
  videoEnabled: boolean;
  audioEnabled: boolean;
}


export interface VideoPlayerProps {
  stream?: MediaStream;
  username: string;
  muted?: boolean;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
  ref?: React.RefObject<HTMLVideoElement | null>;
}

export interface UseWebRTCReturn {
  users: User[];
  stream: MediaStream | null;
  userVideo: React.RefObject<HTMLVideoElement | null>;
  toggleVideo: () => void;
  toggleAudio: () => void;
  leaveCall: () => void;
  videoEnabled: boolean;
  audioEnabled: boolean;
  socket: Socket;
}
