// services/health-metrics-service/src/utils/rabbitmq.js
const amqp = require("amqplib");

// SỬA: Dùng đúng tên biến môi trường như trong file YAML
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const EXCHANGE_NAME = "health.events";

let channel = null;
let connection = null;

async function connect() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    
    // Xử lý khi connection bị đóng (VD: RabbitMQ restart)
    connection.on("error", (err) => {
      console.error("[RabbitMQ] Connection error:", err);
      channel = null;
      connection = null;
      setTimeout(connect, 5000); // Thử lại sau 5s
    });

    connection.on("close", () => {
      console.warn("[RabbitMQ] Connection closed. Reconnecting...");
      channel = null;
      connection = null;
      setTimeout(connect, 5000);
    });

    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });
    console.log("[health-metrics-service] Connected to RabbitMQ");
  } catch (err) {
    console.error("[RabbitMQ] Failed to connect:", err);
    setTimeout(connect, 5000); // Retry connect
  }
}

// Gọi hàm connect ngay khi khởi động file
connect();

async function publishMetricCreated(metric) {
  try {
    if (!channel) {
      console.error("[RabbitMQ] Channel not ready, message dropped or verify retry logic");
      // Ở production, bạn có thể lưu tạm vào biến local array để retry sau
      return; 
    }
    const payload = Buffer.from(JSON.stringify(metric));
    channel.publish(EXCHANGE_NAME, "", payload, { persistent: true });
    console.log("[health-metrics-service] Published metric:", metric.id || metric._id);
  } catch (err) {
    console.error("[health-metrics-service] Failed to publish event", err);
  }
}

module.exports = { publishMetricCreated };