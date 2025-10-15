// src/utils/api.ts
import axios from "axios";
import type {
  LoginRequest,
  SignUpRequest,
  IssueRequest,
  VoterItem,
  VoteRequest,
  PositionRequest,
} from "./types";

// Environment variables - EXPORT THESE
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8082/assemblyservice/api";

export const VOTE_SERVICE_BASE_URL =
  import.meta.env.VITE_VOTE_SERVICE_API_BASE_URL ||
  "http://localhost:8080/voteservice/api";

export const WS_BASE_URL =
  import.meta.env.VITE_WS_URL ||
  "ws://localhost:8082/assemblyservice/ws/attendance";

// For backward compatibility, export BASE_URL as well
export const BASE_URL = API_BASE_URL;

// Create axios instances
export const assemblyApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const voteApi = axios.create({
  baseURL: VOTE_SERVICE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add auth token
const addAuthToken = (config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

assemblyApi.interceptors.request.use(addAuthToken);
voteApi.interceptors.request.use(addAuthToken);

// Response interceptor to handle token refresh
const setupResponseInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const response = await axios.post(
              `${API_BASE_URL}/auth/refresh-token`,
              { refreshToken }
            );

            const { token, refreshToken: newRefreshToken } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", newRefreshToken);

            // Update WebSocket authentication if connected
            if (nativeWebSocketService.isConnected()) {
              nativeWebSocketService.authenticate();
            }

            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiInstance(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          nativeWebSocketService.disconnect();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

setupResponseInterceptor(assemblyApi);
setupResponseInterceptor(voteApi);

// ============ WEBSOCKET SERVICE ============
class NativeWebSocketService {
  private socket: WebSocket | null = null;
  private subscribers: ((message: any) => void)[] = [];
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;

  connect() {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.CONNECTING ||
        this.socket.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    this.clearReconnectTimeout();

    try {
      this.socket = new WebSocket(WS_BASE_URL);
      this.setupEventHandlers();
    } catch (error) {
      this.handleConnectionError();
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.connected = true;
      this.reconnectAttempts = 0;

      this.authenticate();
      this.getAttendanceStatus();
      this.startPingInterval();

      this.notifySubscribers({
        type: "CONNECTION_STATUS",
        connected: true,
        message: "Connected to server",
      });
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.notifySubscribers(message);
      } catch (error) {
        // Silent parse error handling
      }
    };

    this.socket.onclose = (event) => {
      this.connected = false;
      this.stopPingInterval();

      this.notifySubscribers({
        type: "CONNECTION_STATUS",
        connected: false,
        message: "Connection lost",
      });

      this.attemptReconnect(event);
    };

    this.socket.onerror = () => {
      this.connected = false;
      this.notifySubscribers({
        type: "CONNECTION_STATUS",
        connected: false,
        message: "Connection error",
      });
    };
  }

  private startPingInterval() {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      if (this.isReady()) {
        this.send({ type: "PING", timestamp: Date.now() });
      }
    }, 30000);
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private clearReconnectTimeout() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private handleConnectionError() {
    this.connected = false;
    this.notifySubscribers({
      type: "CONNECTION_STATUS",
      connected: false,
      message: "Connection failed",
    });
  }

  private attemptReconnect(event: CloseEvent) {
    if (
      event.code === 1000 ||
      this.reconnectAttempts >= this.maxReconnectAttempts
    ) {
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000));
  }

  authenticate() {
    const token = localStorage.getItem("token");
    if (token && this.isReady()) {
      this.send({ type: "AUTHENTICATE", token });
    }
  }

  private send(message: any) {
    if (this.isReady()) {
      try {
        this.socket!.send(JSON.stringify(message));
      } catch (error) {
        // Silent send error handling
      }
    }
  }

  private isReady(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  private notifySubscribers(message: any) {
    this.subscribers.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        // Silent subscriber error handling
      }
    });
  }

  // Public API
  subscribe(callback: (message: any) => void) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  }

  getAttendanceStatus() {
    this.send({ type: "GET_STATUS" });
  }

  toggleAttendance() {
    const token = localStorage.getItem("token");
    this.send({ type: "TOGGLE_ATTENDANCE", token });
  }

  isConnected(): boolean {
    return this.connected && this.isReady();
  }

  getConnectionState(): string {
    if (!this.socket) return "DISCONNECTED";

    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return "CONNECTING";
      case WebSocket.OPEN:
        return "CONNECTED";
      case WebSocket.CLOSING:
        return "CLOSING";
      case WebSocket.CLOSED:
        return "DISCONNECTED";
      default:
        return "UNKNOWN";
    }
  }

  disconnect() {
    this.clearReconnectTimeout();
    this.stopPingInterval();
    if (this.socket) {
      this.socket.close(1000, "Normal closure");
      this.connected = false;
    }
  }
}

export const nativeWebSocketService = new NativeWebSocketService();

// ============ AUTH API ============
export const loginUser = (loginData: LoginRequest) => {
  return assemblyApi.post("/auth/login", loginData);
};

export const registerUser = (userData: SignUpRequest) => {
  return assemblyApi.post("/auth/register", userData);
};

// ============ ISSUE API ============
export const createIssue = (newIssue: IssueRequest) => {
  return voteApi.post("/issue/createIssue", newIssue);
};

export const updateIssue = (id: number, updatedIssue: IssueRequest) => {
  return voteApi.put(`/issue/updateIssue/${id}`, updatedIssue);
};

export const getIssueList = () => {
  return voteApi.get("/issue/active");
};

export const activateIssue = (id: number) => {
  return voteApi.put(`/issue/active/${id}`);
};

export const closeIssue = (id: number) => {
  return voteApi.put(`/issue/close/${id}`);
};

export const getIssue = (id: number) => {
  return voteApi.get(`/issue/getIssue/${id}`);
};

export const getIssueResult = (id: number) => {
  return voteApi.get(`/issue/result/${id}`);
};

export const voteIssue = (vote: VoteRequest) => {
  return voteApi.post("/issue/vote", vote);
};

// ============ POSITIONS API ============
export const getActivePositions = () => {
  return voteApi.get("/positions/active");
};

export const activatePosition = (id: number) => {
  return voteApi.put(`/positions/activate/${id}`);
};

export const closePosition = (id: number) => {
  return voteApi.put(`/positions/close/${id}`);
};

export const createPosition = (data: PositionRequest) => {
  return voteApi.post("/positions/create", data);
};

export const updatePosition = (id: number, data: PositionRequest) => {
  return voteApi.put(`/positions/update/${id}`, data);
};

export const getPositionInfo = (positionId: number) => {
  return voteApi.get(`/candidates/position/${positionId}`);
};

export const votePosition = (data: any) => {
  return voteApi.post("/candidates/vote", data);
};

export const getPositionResult = (positionId: number) => {
  return voteApi.get(`candidates/rankings/position/${positionId}`);
};

// ============ VOTER API ============
export const getVoters = () => {
  return voteApi.get("/voter");
};

export const getVoterById = (voterId: string) => {
  return voteApi.get(`/voter/${voterId}`);
};

export const registerVoter = (data: VoterItem) => {
  return voteApi.post("/voter/register", data);
};

// ============ CANDIDATES API ============
export const registerCandidate = (data: any) => {
  return voteApi.post("/candidates/register", data);
};

export const getAllCandidates = () => {
  return voteApi.get("/candidates");
};

export const updateCandidateById = (id: number, data: any) => {
  return voteApi.post(`/candidates/update/${id}`, data);
};

export const assignCandidate = (data: any) => {
  return voteApi.post("/candidates/assign", data);
};

export const getPositionTally = (positionId: number) => {
  return voteApi.get(`/candidates/results/position/${positionId}`);
};

export const getDetailedPositionResults = (positionId: number) => {
  return voteApi.get(`/candidates/detailed/position/${positionId}`);
};

// ============ ELECTION API ============
export const createElection = (electionData: any) => {
  return voteApi.post("/elections/create", electionData);
};

export const activateElection = (electionId: number) => {
  return voteApi.put(`/elections/activate/${electionId}`);
};

export const getAllElections = () => {
  return voteApi.get("/elections/all");
};

export default {
  // Base URLs
  API_BASE_URL,
  VOTE_SERVICE_BASE_URL,
  BASE_URL,
  WS_BASE_URL,

  // WebSocket Service
  nativeWebSocketService,

  // Auth
  loginUser,
  registerUser,

  // Issue
  createIssue,
  updateIssue,
  getIssueList,
  activateIssue,
  closeIssue,
  getIssue,
  getIssueResult,
  voteIssue,

  // Positions
  getActivePositions,
  activatePosition,
  closePosition,
  createPosition,
  updatePosition,
  getPositionInfo,
  votePosition,
  getPositionResult,

  // Voter
  getVoters,
  getVoterById,
  registerVoter,

  // Candidates
  registerCandidate,
  getAllCandidates,
  updateCandidateById,
  assignCandidate,
  getPositionTally,
  getDetailedPositionResults,

  // Election
  createElection,
  activateElection,
  getAllElections,
};
