import { useTranslation } from 'react-i18next';
import { X, Check, Trash2, CheckCheck, Info, CheckCircle, AlertTriangle, MapPin, Heart, Tag } from 'lucide-react';
import type { Notification } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onClose,
}: NotificationCenterProps) {
  const { t } = useTranslation();

  const getNotificationIcon = (type: Notification['type'], customIcon?: string) => {
    if (customIcon) {
      return <span className="text-xl">{customIcon}</span>;
    }

    const iconMap = {
      info: <Info size={18} className="text-blue-400" />,
      success: <CheckCircle size={18} className="text-green-400" />,
      warning: <AlertTriangle size={18} className="text-yellow-400" />,
      new_place: <MapPin size={18} className="text-amber-400" />,
      favorite_update: <Heart size={18} className="text-red-400" />,
      promo: <Tag size={18} className="text-purple-400" />,
    };

    return iconMap[type] || iconMap.info;
  };

  const getNotificationBgColor = (type: Notification['type']) => {
    const colorMap = {
      info: 'bg-blue-900/20 border-blue-800/30',
      success: 'bg-green-900/20 border-green-800/30',
      warning: 'bg-yellow-900/20 border-yellow-800/30',
      new_place: 'bg-amber-900/20 border-amber-800/30',
      favorite_update: 'bg-red-900/20 border-red-800/30',
      promo: 'bg-purple-900/20 border-purple-800/30',
    };

    return colorMap[type] || colorMap.info;
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('notifications.justNow');
    if (minutes < 60) return t('notifications.minutesAgo', { count: minutes });
    if (hours < 24) return t('notifications.hoursAgo', { count: hours });
    if (days < 7) return t('notifications.daysAgo', { count: days });
    
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)] z-50 animate-fade-in">
      <div className="glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[calc(100vh-6rem)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-sm">
              {t('notifications.title')}
            </h3>
            {notifications.length > 0 && (
              <span className="text-xs text-gray-500">
                ({notifications.length})
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.read) && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                title={t('notifications.markAllRead')}
              >
                <CheckCheck size={14} />
              </button>
            )}
            
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                title={t('notifications.clearAll')}
              >
                <Trash2 size={14} />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-xl glass border border-white/6 flex items-center justify-center mx-auto mb-3">
                <Bell size={20} className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                {t('notifications.empty')}
              </p>
              <p className="text-gray-600 text-xs">
                {t('notifications.emptyDesc')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-all hover:bg-white/5 ${
                    !notification.read ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${getNotificationBgColor(notification.type)}`}>
                      {getNotificationIcon(notification.type, notification.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-400' : 'text-white'
                        }`}>
                          {notification.title}
                        </h4>
                        
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-600">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                              title={t('notifications.markRead')}
                            >
                              <Check size={12} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => onDelete(notification.id)}
                            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                            title={t('notifications.delete')}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Bell({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
