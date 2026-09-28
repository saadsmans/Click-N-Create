import React from 'react';
import { motion } from 'motion/react';
import { RemotePointer } from './types.ts';

interface RemoteCursorProps {
  pointer: RemotePointer;
}

export const RemoteCursor: React.FC<RemoteCursorProps> = ({ pointer }) => {
  const accentColor = pointer.color || '#00F5FF';

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 transition-all duration-75 ease-out select-none"
      style={{
        transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)`,
      }}
    >
      {/* SVG cursor arrow */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={accentColor}
          stroke="#070707"
          strokeWidth="1.5"
        />
      </svg>

      {/* User tag */}
      {pointer.name && (
        <div
          className="mt-1 ml-4 px-2 py-0.5 rounded text-[10px] font-mono text-white shadow-md border border-white/20 whitespace-nowrap"
          style={{ backgroundColor: accentColor }}
        >
          {pointer.name}
        </div>
      )}
    </motion.div>
  );
};

export const RealtimePresence: React.FC<{ enabled?: boolean }> = ({ enabled = false }) => {
  // In frontend-only release, presence is disabled and kept cleanly architected for future WebSocket linkage.
  if (!enabled) return null;
  return null;
};

export const CollaborativeCanvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Pass-through container ready for future collaborative multi-pointer canvas bindings
  return <div className="relative w-full h-full">{children}</div>;
};
