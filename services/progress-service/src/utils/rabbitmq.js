const amqp = require("amqplib");
const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://localhost:5672";
const EXCHANGE_NAME = "health.events";
const QUEUE_NAME = "progress.metrics";
// đảm bảo chỉ start consumer 1 lần
let started = false;
async function startMetricConsumer(onMessage) {
  if (started) {
    console.log("[progress-service] RabbitMQ consumer already started");
    return;
  }
  started = true;
  const isAmqps = RABBITMQ_URL.startsWith("amqps://");
  const conn = await amqp.connect(
    RABBITMQ_URL,
    isAmqps
      ? {
          heartbeat: 30,
          protocol: "amqps",
        }
      : {}
  );
  conn.on("error", (err) => {
    console.error("[progress-service] RabbitMQ connection error", err);
    started = false;
  });
  conn.on("close", () => {
    console.error("[progress-service] RabbitMQ connection closed");
    started = false;
  });
  const channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, "fanout", {
    durable: true,
  });
  const q = await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, "");
  console.log(
    "[progress-service] RabbitMQ consumer ready → queue:",
    q.queue
  );
  channel.prefetch(1); 
  channel.consume(
    q.queue,
    async (msg) => {
      if (!msg) return;
      try {
        const content = JSON.parse(msg.content.toString());
        await onMessage(content);
        channel.ack(msg);
      } catch (err) {
        console.error(
          "[progress-service] Failed to process message",
          err
        );
        channel.nack(msg, false, false); // drop message lỗi
      }
    },
    { noAck: false }
  );
}

module.exports = {
  startMetricConsumer,
};
