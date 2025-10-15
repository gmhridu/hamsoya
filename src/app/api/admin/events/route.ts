import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial connection event
      sendEvent({
        type: 'connected',
        timestamp: new Date().toISOString(),
        message: 'Connected to admin dashboard events',
      });

      // Send periodic stats updates
      const statsInterval = setInterval(() => {
        sendEvent({
          type: 'stats_update',
          timestamp: new Date().toISOString(),
          data: {
            // This would normally come from your database
            // For now, we'll send a heartbeat
            heartbeat: true,
          },
        });
      }, 30000); // Every 30 seconds

      // Send real-time order updates
      const orderInterval = setInterval(() => {
        // In a real implementation, this would listen to database changes
        // or use a message queue like Redis
        sendEvent({
          type: 'order_update',
          timestamp: new Date().toISOString(),
          data: {
            // Mock data - replace with real order updates
            action: 'heartbeat',
          },
        });
      }, 60000); // Every minute

      // Cleanup function
      const cleanup = () => {
        clearInterval(statsInterval);
        clearInterval(orderInterval);
      };

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        cleanup();
        controller.close();
      });

      // Auto-cleanup after 30 minutes
      setTimeout(() => {
        cleanup();
        controller.close();
      }, 30 * 60 * 1000);
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}

export const dynamic = 'force-dynamic';
