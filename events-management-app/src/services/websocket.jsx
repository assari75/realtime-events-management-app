import React, {createContext, useContext, useEffect, useRef, useCallback} from 'react';

import { WEBSOCKET_BASE_URL } from '../config/defaultValues'

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const ws = useRef(null);
  const listeners = useRef(new Map());
  const reconnectTimeout = useRef(null);

  const connectWebSocket = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }
    ws.current = new WebSocket(`${WEBSOCKET_BASE_URL}/ws`);

    ws.current.onmessage = (message) => {
      listeners.current.forEach(listener => {
        try {
          listener(message);
        } catch (error) {
          console.error('Error in websocket listener:', error);
        }
      });
    };

    ws.current.onclose = () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
    };
  }, []);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connectWebSocket]);

  const addListener = useCallback((listener) => {
    const listenerId = Symbol();
    listeners.current.set(listenerId, listener);
    
    return () => {
      listeners.current.delete(listenerId);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={addListener}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket(listener) {
  const addListener = useContext(WebSocketContext);
  const stableListener = useRef(listener);

  useEffect(() => {
    stableListener.current = listener;
  }, [listener]);

  useEffect(() => {
    if (!listener) return;

    const wrapper = (message) => {
      stableListener.current(message);
    };

    return addListener(wrapper);
  }, [addListener]);
}
