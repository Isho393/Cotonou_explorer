import { Bell } from 'lucide-react';

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
  isOpen: boolean;
}

export default function NotificationBell({ unreadCount, onClick, isOpen }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center w-10 h-10 rounded-xl glass border transition-all ${
        isOpen
          ? 'border-amber-800/50 bg-amber-900/30'
          : 'border-white/10 hover:border-amber-800/30 hover:bg-white/5'
      }`}
      aria-label="Notifications"
    >
      <Bell
        size={18}
        className={`transition-colors ${
          isOpen ? 'text-amber-400' : 'text-gray-400'
        }`}
      />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse-glow">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
