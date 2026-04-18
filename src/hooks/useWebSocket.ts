'use client';
import { useEffect, useRef, useCallback } from 'react';
import { getToken } from '@/lib/api';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';

type MsgHandler = (msg: any) => void;

export function useWebSocket(orderId: string | null, onMessage: MsgHandler) {
  const ws    = useRef<WebSocket | null>(null);
  const alive = useRef(true);

  const connect = useCallback(() => {
    const token = getToken();
    if (!token || !orderId) return;

    ws.current = new WebSocket(`${WS_URL}?token=${token}`);

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({ type: 'SUBSCRIBE_ORDER', order_id: orderId }));
    };

    ws.current.onmessage = (e) => {
      try { onMessage(JSON.parse(e.data)); } catch {}
    };

    ws.current.onclose = () => {
      if (alive.current) setTimeout(connect, 3000); // auto-reconnect
    };

    ws.current.onerror = () => ws.current?.close();
  }, [orderId, onMessage]);

  useEffect(() => {
    alive.current = true;
    connect();
    return () => {
      alive.current = false;
      ws.current?.close();
    };
  }, [connect]);

  const send = useCallback((data: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  return { send };
}
