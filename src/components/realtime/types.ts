/**
 * Types and architecture for future real-time collaboration & presence.
 * Prepared for WebSocket or server-sent events integration.
 */

export interface RemotePointer {
  id: string;
  x: number;
  y: number;
  name?: string;
  color?: string;
  lastActive?: number;
}

export interface CollaborativeCanvasState {
  isActive: boolean;
  activeUsersCount: number;
  pointers: RemotePointer[];
}

export interface RealtimeConfig {
  enabled: boolean;
  endpoint?: string;
  channel?: string;
}
