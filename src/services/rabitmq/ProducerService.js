import amqp from 'amqplib'
import config from '../../utils/config.js'

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(config.rabbitmq.host)
    const channel = await connection.createChannel()
    await channel.assertQueue('export:playlists', {
      durable: true
    })
    channel.sendToQueue(queue, Buffer.from(message))
    setTimeout(() => {
      connection.close()
    }, 1000)
  }
}

export default ProducerService
