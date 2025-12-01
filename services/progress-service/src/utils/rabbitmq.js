// services/progress-service/src/utils/rabbitmq.js
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const EXCHANGE_NAME = "health.events";
const QUEUE_NAME = "progress.metrics";

async function startMetricConsumer(onMessage) {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });
  const q = await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, "");

  console.log(
    "[progress-service] Connected to RabbitMQ, queue:",
    q.queue
  );

  channel.consume(
    q.queue,
    (msg) => {
      if (!msg) return;
      try {
        const content = JSON.parse(msg.content.toString());
        onMessage(content);
        channel.ack(msg);
      } catch (err) {
        console.error(
          "[progress-service] Failed to process message",
          err
        );
        // bỏ message lỗi, tránh lặp vô hạn
        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}

module.exports = {
  startMetricConsumer,
};
