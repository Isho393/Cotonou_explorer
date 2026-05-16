import { useState, useEffect } from 'react';
import type { Notification } from '../types';

const NOTIFICATIONS_KEY = 'cotonou_explorer_notifications';
const WELCOME_SHOWN_KEY = 'cotonou_explorer_welcome_shown';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Charger les notifications depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }

    // Afficher le message de bienvenue si première visite
    const welcomeShown = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!welcomeShown) {
      addWelcomeNotification();
      localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
    }
  }, []);

  // Sauvegarder les notifications dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications:', error);
    }
  }, [notifications]);

  const addWelcomeNotification = () => {
    const welcomeNotif: Notification = {
      id: `welcome-${Date.now()}`,
      type: 'info',
      title: 'Bienvenue sur Cotonou Explorer !',
      message: 'Découvrez les meilleurs lieux de Cotonou avec notre assistant IA.',
      timestamp: Date.now(),
      read: false,
      icon: '👋',
    };
    setNotifications(prev => [welcomeNotif, ...prev]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    unreadCount,
  };
}
