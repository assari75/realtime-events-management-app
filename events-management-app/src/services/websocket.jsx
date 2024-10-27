import { WEBSOCKET_BASE_URL } from '../config/defaultValues'

class WebSocketService {
    constructor() {
      this.ws = null;
      this.messageHandlers = [];
    }
  
    connect() {
      this.ws = new WebSocket(`${WEBSOCKET_BASE_URL}/ws`);
  
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(data));
      };
  
      this.ws.onclose = () => {
        setTimeout(() => this.connect(), 1000);
      };
    }
  
    addMessageHandler(handler) {
      this.messageHandlers.push(handler);
    }
  
    removeMessageHandler(handler) {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    }
  }
  
  export const wsService = new WebSocketService();