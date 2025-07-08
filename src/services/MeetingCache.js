class MeetingCache {
  constructor() {
    this.cacheKey = 'meetings_cache';
    this.lastFetchKey = 'meetings_last_fetch';
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  // Check if cache has all meetings
  hasAllMeetings() {
    const cached = this.getAllMeetings();
    const lastFetch = this.getLastFetch();
    
    if (!cached || !lastFetch) {
      return false;
    }

    const now = Date.now();
    const isExpired = (now - lastFetch) > this.cacheExpiry;
    
    return !isExpired && Array.isArray(cached) && cached.length >= 0;
  }

  // Get all meetings from cache
  getAllMeetings() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error reading meetings from cache:', error);
      return null;
    }
  }

  // Set all meetings in cache
  setAllMeetings(meetings) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(meetings));
      this.updateLastFetch();
    } catch (error) {
      console.error('Error saving meetings to cache:', error);
    }
  }

  // Get last fetch timestamp
  getLastFetch() {
    try {
      const timestamp = localStorage.getItem(this.lastFetchKey);
      return timestamp ? parseInt(timestamp) : null;
    } catch (error) {
      console.error('Error reading last fetch timestamp:', error);
      return null;
    }
  }

  // Update last fetch timestamp
  updateLastFetch() {
    try {
      localStorage.setItem(this.lastFetchKey, Date.now().toString());
    } catch (error) {
      console.error('Error updating last fetch timestamp:', error);
    }
  }

  // Add a single meeting to cache
  addMeeting(meeting) {
    try {
      const meetings = this.getAllMeetings() || [];
      meetings.push(meeting);
      this.setAllMeetings(meetings);
    } catch (error) {
      console.error('Error adding meeting to cache:', error);
    }
  }

  // Update a meeting in cache
  updateMeeting(updatedMeeting) {
    try {
      const meetings = this.getAllMeetings() || [];
      const index = meetings.findIndex(m => m.id === updatedMeeting.id);
      
      if (index !== -1) {
        meetings[index] = updatedMeeting;
        this.setAllMeetings(meetings);
      }
    } catch (error) {
      console.error('Error updating meeting in cache:', error);
    }
  }

  // Remove a meeting from cache
  removeMeeting(meetingId) {
    try {
      const meetings = this.getAllMeetings() || [];
      const filteredMeetings = meetings.filter(m => m.id !== meetingId);
      this.setAllMeetings(filteredMeetings);
    } catch (error) {
      console.error('Error removing meeting from cache:', error);
    }
  }

  // Clear all cached data
  clear() {
    try {
      localStorage.removeItem(this.cacheKey);
      localStorage.removeItem(this.lastFetchKey);
    } catch (error) {
      console.error('Error clearing meetings cache:', error);
    }
  }

  // Force refresh cache (clear and set new data)
  refresh(meetings) {
    this.clear();
    this.setAllMeetings(meetings);
  }

  // Get upcoming meetings from cache
  getUpcomingMeetings() {
    try {
      const meetings = this.getAllMeetings() || [];
      const now = new Date();
      
      return meetings.filter(meeting => {
        const meetingDate = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
        return meetingDate >= now;
      });
    } catch (error) {
      console.error('Error getting upcoming meetings from cache:', error);
      return [];
    }
  }

  // Get past meetings from cache
  getPastMeetings() {
    try {
      const meetings = this.getAllMeetings() || [];
      const now = new Date();
      
      return meetings.filter(meeting => {
        const meetingDate = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);
        return meetingDate < now;
      });
    } catch (error) {
      console.error('Error getting past meetings from cache:', error);
      return [];
    }
  }

  // Get meetings for current week from cache
  getCurrentWeekMeetings() {
    try {
      const meetings = this.getAllMeetings() || [];
      const now = new Date();
      const startOfWeek = new Date(now);
      const endOfWeek = new Date(now);
      
      // Set start of week to Monday (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days
      startOfWeek.setDate(now.getDate() - daysToMonday);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Set end of week to Sunday
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      return meetings.filter(meeting => {
        const meetingDate = new Date(meeting.meetingDate);
        return meetingDate >= startOfWeek && meetingDate <= endOfWeek;
      });
    } catch (error) {
      console.error('Error getting current week meetings from cache:', error);
      return [];
    }
  }
}

export default new MeetingCache(); 