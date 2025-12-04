// services/progress-service/src/utils/rabbitmq.js
const amqp = require("amqplib");

// SỬA: Dùng đúng tên biến môi trường
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const EXCHANGE_NAME = "health.events";
const QUEUE_NAME = "progress.metrics";

async function startMetricConsumer(onMessage) {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    
    // LOGIC QUAN TRỌNG: Tự động restart consumer khi mất kết nối
    conn.on("error", (err) => {
      console.error("[RabbitMQ] Connection error:", err);
      setTimeout(() => startMetricConsumer(onMessage), 5000);
    });

    conn.on("close", () => {
      console.warn("[RabbitMQ] Connection closed. Reconnecting...");
      setTimeout(() => startMetricConsumer(onMessage), 5000);
    });

    const channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });
    
    // Dùng Queue durable để không mất tin nhắn khi RabbitMQ restart
    const q = await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.bindQueue(q.queue, EXCHANGE_NAME, "");
    
    // Prefetch: Chỉ nhận 1 tin nhắn xử lý xong mới nhận tiếp (Tránh overload pod)
    channel.prefetch(1);

    console.log(`[progress-service] Waiting for messages in ${q.queue}`);

    channel.consume(
      q.queue,
      async (msg) => {
        if (!msg) return;
        try {
          const content = JSON.parse(msg.content.toString());
          
          // Xử lý message (Async để đảm bảo DB lưu xong mới ACK)
          await onMessage(content);
          
          channel.ack(msg);
        } catch (err) {
          console.error("[progress-service] Error processing message:", err);
          // QUAN TRỌNG: Nếu lỗi do Data sai format -> Nack không requeue (vứt đi)
          // Nếu lỗi do DB chết -> Nack có requeue (thử lại sau) hoặc đẩy vào DLQ
          channel.nack(msg, false, false); 
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("[RabbitMQ] Startup error. Retrying in 5s...", err);
    setTimeout(() => startMetricConsumer(onMessage), 5000);
  }
}

module.exports = { startMetricConsumer };