import { useEffect } from 'react';
import { wsService } from '../services/websocket';

export function useWebSocket(onMessage) {
  useEffect(() => {
    wsService.connect();
    wsService.addMessageHandler(onMessage);

    return () => {
      wsService.removeMessageHandler(onMessage);
    };
  }, [onMessage]);
}