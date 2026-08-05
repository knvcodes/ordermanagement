import { Router, Request, Response } from "express";

const sseRouter = Router();

// Store connections by orderId (not userId, since this is for tracking any order)
const orderClients = new Map<string, Response>();

// SSE endpoint for order tracking
sseRouter.get("/order/:orderId", (req: Request, res: Response) => {
  const { orderId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  req.socket.setTimeout(0);

  orderClients.set(orderId, res);

  // Send initial connection
  res.write(`data: ${JSON.stringify({ type: "connected", orderId })}\n\n`);

  req.on("close", () => {
    orderClients.delete(orderId);
    console.log(`SSE: Order ${orderId} tracker disconnected`);
  });

  req.on("error", () => {
    orderClients.delete(orderId);
  });
});

// Export helper to send status updates from anywhere
export function sendOrderStatusUpdate(orderId: string, data: any) {
  const client = orderClients.get(orderId);
  if (client && !client.writableEnded) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
    return true;
  }
  return false;
}

export default sseRouter;
