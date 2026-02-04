
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const API_HTTP = "http://localhost:8080";
const API_WS = API_HTTP.replace("http://", "ws://") + "/ws/orders";

export function useOrdersSocket(onEvent: (msg: any) => void) {
  const { authState } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!authState.user?.token) return;

    let alive = true;
    let retry = 0;

    const connect = () => {
      const url = `${API_WS}?token=${encodeURIComponent(authState.user.token)}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retry = 0;
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          onEvent(data);
        } catch {}
      };

      ws.onclose = () => {
        if (!alive) return;
        // simple reconnect with backoff
        retry++;
        const delay = Math.min(8000, 500 * retry);
        setTimeout(connect, delay);
      };

      ws.onerror = () => {
        // close triggers reconnect
        try { ws.close(); } catch {}
      };
    };

    connect();

    return () => {
      alive = false;
      try { wsRef.current?.close(); } catch {}
      wsRef.current = null;
    };
  }, [authState.user?.token, onEvent]);
}
