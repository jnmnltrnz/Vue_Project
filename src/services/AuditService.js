import axios from "axios";
import API_BASE from "../constants/APIBaseURL";

class AuditService {
  getAuditLogsByUser(username) {
    return axios.get(`${API_BASE}/audit/user/${encodeURIComponent(username)}`);
  }
}

export default new AuditService(); 