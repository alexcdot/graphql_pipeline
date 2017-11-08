# GraphQL Pipeline
Graphql API to a node server, which calls a python worker with RabbitMQ and prints the response

### Requirements
* Docker-CE version 17.09.0-ce
* Docker Compose version 1.14.0

### Getting Started

Make sure rabbitmq running on your local machine is off with
```
sudo service rabbitmq-server stop
```
or change the ports for rabbitmq in the docker-compose file
Make sure the ports in the docker-compose.yml are available

To install, start up the Docker container with 
```
docker-compose up --build
```

Call the node API with
```
sudo chmod 774 call.sh
./call.sh
```