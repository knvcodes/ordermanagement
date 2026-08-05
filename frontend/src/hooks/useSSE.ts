import { useEffect, useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { OrderStatus } from "@/utils/types";

// Types for SSE events
export interface OrderStatusEvent {
  type: "connected" | "status_update" | "location_update";
  status?: OrderStatus;
  location?: { lat: number; lng: number };
  timestamp?: string;
  orderId?: string;
}

export interface UseOrderSSEReturn {
  liveStatus: OrderStatus | null;
  liveLocation: { lat: number; lng: number } | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useOrderSSE(orderId: string | null): UseOrderSSEReturn {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [liveStatus, setLiveStatus] = useState<OrderStatus | null>(null);
  const [liveLocation, setLiveLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Disconnect helper
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Connect helper
  const connect = useCallback(() => {
    // Must have valid orderId
    if (!orderId || orderId.length !== 24) return;

    // Clean up any existing connection first
    disconnect();

    const eventSource = new EventSource(
      `http://localhost:3000/api/sse/order/${orderId}`,
    );

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: OrderStatusEvent = JSON.parse(event.data);

        if (data.type === "status_update" && data.status) {
          setLiveStatus(data.status);
          // Refresh React Query cache
          queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        }

        if (data.type === "location_update" && data.location) {
          setLiveLocation(data.location);
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
      // Auto-reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };
  }, [orderId, queryClient, disconnect]);

  // Auto-connect when orderId changes
  useEffect(() => {
    // Reset state when orderId changes
    setLiveStatus(null);
    setLiveLocation(null);
    setIsConnected(false);

    if (orderId && orderId.length === 24) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [orderId, connect, disconnect]);

  return {
    liveStatus,
    liveLocation,
    isConnected,
    connect,
    disconnect,
  };
}
