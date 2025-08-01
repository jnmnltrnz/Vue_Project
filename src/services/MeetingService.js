import axios from "axios";
import API_BASE from "../constants/APIBaseURL";

class MeetingService {
  // Get all meetings
  getAllMeetings() {
    return axios.get(`${API_BASE}/meetings`);
  }

  // Get upcoming meetings
  getUpcomingMeetings() {
    return axios.get(`${API_BASE}/meetings/upcoming`);
  }

  // Get meetings by date
  getMeetingsByDate(date) {
    return axios.get(`${API_BASE}/meetings/date/${date}`);
  }

  // Get meeting by ID
  getMeetingById(id) {
    return axios.get(`${API_BASE}/meetings/${id}`);
  }

  // Create new meeting
  createMeeting(meetingData, username) {
    // Ensure inviteeIds is included in the request
    const requestData = {
      title: meetingData.title,
      date: meetingData.date,
      time: meetingData.time,
      notes: meetingData.notes || "",
      inviteeIds: meetingData.inviteeIds || []
    };
    return axios.post(`${API_BASE}/meetings?username=${encodeURIComponent(username)}`, requestData);
  }

  // Update meeting
  updateMeeting(id, meetingData, username) {
    // Ensure inviteeIds is included in the request
    const requestData = {
      title: meetingData.title,
      date: meetingData.date,
      time: meetingData.time,
      notes: meetingData.notes || "",
      inviteeIds: meetingData.inviteeIds || []
    };
    return axios.put(`${API_BASE}/meetings/${id}?username=${encodeURIComponent(username)}`, requestData);
  }

  // Update meeting status
  updateMeetingStatus(id, status, username) {
    return axios.patch(`${API_BASE}/meetings/${id}/status?status=${status}&username=${encodeURIComponent(username)}`);
  }

  // Delete meeting
  deleteMeeting(id, username) {
    return axios.delete(`${API_BASE}/meetings/${id}?username=${encodeURIComponent(username)}`);
  }

  // Get meetings by creator
  getMeetingsByCreator(username) {
    return axios.get(`${API_BASE}/meetings/created-by/${encodeURIComponent(username)}`);
  }

  // Get meetings by status
  getMeetingsByStatus(status) {
    return axios.get(`${API_BASE}/meetings/status/${status}`);
  }

  // Get meetings by employee ID
  getMeetingsByEmployeeId(employeeId) {
    return axios.get(`${API_BASE}/meetings/employee/${employeeId}`);
  }

}

export default new MeetingService(); 