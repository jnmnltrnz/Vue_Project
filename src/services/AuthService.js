import axios from "axios";
import API_BASE from "../constants/APIBaseURL";

class AuthService {
  login(credentials) {
    return axios.post(`${API_BASE}/login`, credentials, {
      withCredentials: true 
    });
  }

  logout(username) {
    console.log("Calling backend logout for:", username); // Debug
    return axios.post(`${API_BASE}/logout`, { username });
  }
}

export default new AuthService();
