import { CalendarEvent } from '../types';
import { getSavedSession } from './firebase';

export interface CalendarSyncStatus {
  connected: boolean;
  error?: string;
  userEmail?: string;
}

/**
 * Fetch real Google Calendar events for today using Google Calendar v3 REST API.
 * Never returns mock data. If unauthenticated, returns empty list and logs error.
 */
export const fetchGoogleCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const session = getSavedSession();
  const token = session?.googleAccessToken;

  if (!token) {
    return [];
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

    if (res.status === 401 || res.status === 403) {
      console.warn('Google Calendar OAuth token expired or lacks calendar permissions');
      return [];
    }

    if (!res.ok) {
      console.warn('Google Calendar fetch returned status:', res.status);
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
        title: item.summary || 'กิจกรรมใน Google Calendar',
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

/**
 * Create a Real Focus Block event in user's primary Google Calendar (2-Way Real Sync)
 */
export const createGoogleCalendarFocusBlock = async (
  taskTitle: string,
  durationMinutes: number = 25
): Promise<{ success: boolean; eventId?: string; error?: string }> => {
  const session = getSavedSession();
  const token = session?.googleAccessToken;

  if (!token) {
    return { success: false, error: 'ยังไม่ได้เชื่อมต่อบัญชี Google หรือไม่มี Access Token' };
  }

  try {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    const eventPayload = {
      summary: `[Freak Out! Focus] ${taskTitle}`,
      description: `ช่วงเวลาโฟกัสสร้างโดย Freak Out! App เพื่อป้องกันการนัดซ้อนและลด Overthinking`,
      start: {
        dateTime: startTime.toISOString(),
      },
      end: {
        dateTime: endTime.toISOString(),
      },
      colorId: '2', // Sage green in Google Calendar
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 5 },
        ],
      },
    };

    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { success: false, error: errBody?.error?.message || `HTTP ${res.status}` };
    }

    const created = await res.json();
    return { success: true, eventId: created.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'ไม่สามารถสร้าง Event ใน Google Calendar ได้' };
  }
};
