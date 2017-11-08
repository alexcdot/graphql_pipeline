#!/usr/bin/env python
import pika
from time import sleep

def sendResponse():

    responseConnection = pika.BlockingConnection(pika.ConnectionParameters \
      (host='rabbitmq', port=5672))
    responseChannel = responseConnection.channel()

    responseChannel.queue_declare(queue='goodbye')

    responseChannel.basic_publish(exchange='',
                          routing_key='goodbye',
                          body='Goodbye World!')
    print(" [x] Sent 'Goodbye World!'")
    responseConnection.close()

def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
    sendResponse()


if __name__ == '__main__':
  
    # sleep a few seconds to allow RabbitMQ server to come up
    sleep(5)
    connection = pika.BlockingConnection(pika.ConnectionParameters \
      (host='rabbitmq', port=5672))
    channel = connection.channel()

    channel.queue_declare(queue='hello')

    channel.basic_consume(callback,
                          queue='hello',
                          no_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

