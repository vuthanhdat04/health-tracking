// services/health-metrics-service/src/utils/rabbitmq.js
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const EXCHANGE_NAME = "health.events";

let channel;

async function getChannel() {
  if (channel) return channel;

  const conn = await amqp.connect(RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });
  console.log("[health-metrics-service] Connected to RabbitMQ");
  return channel;
}

async function publishMetricCreated(metric) {
  try {
    const ch = await getChannel();
    const payload = Buffer.from(JSON.stringify(metric));
    ch.publish(EXCHANGE_NAME, "", payload, { persistent: true });
    console.log(
      "[health-metrics-service] Published metric event:",
      metric.id || metric._id
    );
  } catch (err) {
    console.error("[health-metrics-service] Failed to publish event", err);
  }
}

module.exports = {
  publishMetricCreated,
};
