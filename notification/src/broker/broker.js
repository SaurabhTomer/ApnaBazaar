import amqplib from "amqplib";

// Holds the RabbitMQ channel (used to publish messages)
let channel;

// Holds the RabbitMQ connection (TCP connection to broker)
let connection;

//connects server to rabbitmq
export const connect = async () => {

  // If connection already exists, reuse it
  if (connection) return connection;

  try {
    // Create connection to RabbitMQ server
    connection = await amqplib.connect(process.env.RABBIT_URL);
    console.log("Connected to RabbitMQ");

    // Create a channel on top of the connection
    channel = await connection.createChannel();

    return connection;
  } catch (error) {
    // Log connection errors
    console.error("Error connecting to RabbitMQ:", error);
  }
};

// /**
//  * Publishes a message to a given queue
//  * @param {string} queueName - Name of the queue
//  * @param {object} data - Data to be sent to the queue
//  */
export const publishToQueue = async (queueName, data = {}) => {

  // Ensure connection and channel are ready
  if (!channel || !connection) {
    await connect();
  }

  // Ensure the queue exists (durable = survives broker restart)
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // Send message to queue as a Buffer
  channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify(data))
  );

  console.log("Message sent to queue:", queueName, data);

};

export const subscribeToQueue = async (queueName , callback ) => {

  // Ensure connection and channel are ready
  if (!channel || !connection) {
    await connect();
  }

  // Ensure the queue exists (durable = survives broker restart)
  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.consume(queueName , async (msg)=> {
    if(msg !== null){
        const data = JSON.parse(msg.content.toString());
        await callback(data);
        channel.ack(msg);
    }
  } )
};
