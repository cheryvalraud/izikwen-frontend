
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const API_HTTP = "http://10.0.0.119:8080";
const API_WS = API_HTTP.replace("http://", "ws://") + "/ws/admin/orders";

export function useAdminOrdersSocket(onEvent: (msg: any) => void) {
  const { authState } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = (authState as any).token;
    if (!token) return;

    let alive = true;
    let retry = 0;

    const connect = () => {
      const url = `${API_WS}?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retry = 0;
        console.log("🟢 Admin WS Connected");
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          onEvent(data);
        } catch {}
      };

      ws.onclose = () => {
        if (!alive) return;
        retry++;
        const delay = Math.min(8000, 500 * retry);
        setTimeout(connect, delay);
      };

      ws.onerror = () => {
        try { ws.close(); } catch {}
      };
    };

    connect();

    return () => {
      alive = false;
      try { wsRef.current?.close(); } catch {}
      wsRef.current = null;
    };
  }, [authState, onEvent]);
}
