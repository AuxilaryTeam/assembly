// src/utils/nativeWebSocketService.ts
class NativeWebSocketService {
  private socket: WebSocket | null = null;
  private subscribers: ((message: any) => void)[] = [];
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private connectionUrl: string;

  constructor() {
    this.connectionUrl = this.buildWebSocketUrl();
  }

  private buildWebSocketUrl(): string {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    return isLocalhost
      ? "ws://localhost:8082/assemblyservice/ws/attendance"
      : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
          window.location.host
        }/assemblyservice/ws/attendance`;
  }

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
      this.socket = new WebSocket(this.connectionUrl);
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

  private authenticate() {
    const token = localStorage.getItem("token");
    if (token) {
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
