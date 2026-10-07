import { CalendarEvent } from '../types';
import { getSavedSession } from './firebase';

// Fetch real Google Calendar events for today
export const fetchGoogleCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const session = getSavedSession();
  const token = session?.googleAccessToken;

  if (!token || token === 'mock-google-access-token') {
    // Return sample synchronized events
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'gcal-1',
        title: 'ประชุมทีม Sprint Planning (Google Meet)',
        startTime: '10:00',
        endTime: '11:00',
        category: 'meeting',
        source: 'google',
      },
      {
        id: 'gcal-2',
        title: 'Review Product Requirements Doc',
        startTime: '14:00',
        endTime: '15:30',
        category: 'focus',
        source: 'google',
      },
    ];
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
      startOfDay
    )}&timeMax=${encodeURIComponent(endOfDay)}&singleEvents=true&orderBy=startTime`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn('Google Calendar fetch failed with status:', res.status);
      return [];
    }

    const data = await res.json();
    const items = data.items || [];

    return items.map((item: any, idx: number) => {
      const startDateTime = item.start?.dateTime ? new Date(item.start.dateTime) : null;
      const endDateTime = item.end?.dateTime ? new Date(item.end.dateTime) : null;

      const startTime = startDateTime
        ? `${String(startDateTime.getHours()).padStart(2, '0')}:${String(startDateTime.getMinutes()).padStart(2, '0')}`
        : '09:00';
      const endTime = endDateTime
        ? `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`
        : '10:00';

      return {
        id: item.id || `gcal-${idx}`,
        title: item.summary || 'กิจกรรมในปฏิทิน',
        startTime,
        endTime,
        category: 'meeting' as const,
        source: 'google' as const,
      };
    });
  } catch (error) {
    console.error('Failed to load Google Calendar events:', error);
    return [];
  }
};
