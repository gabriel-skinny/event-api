# Event Api

Uma api que suporta a criação de novos eventos e compra de tickets para usuarios

## Micro Serviços

- [Gateway](https://github.com/gabriel-skinny/event-api/tree/master/Gateway): Gateway com autenticação e loadbalancer
- [Event-Service](https://github.com/gabriel-skinny/event-api/tree/master/Event-Service): Serviço que lida com os eventos e tickets
- [Order-Service](https://github.com/gabriel-skinny/event-api/tree/master/Order-Service): Serviço que lida com as ordens
- [Payment-Service](https://github.com/gabriel-skinny/event-api/tree/master/Payment-Service): Serviço que lida com os pagamentos
- [Client-Service](https://github.com/gabriel-skinny/event-api/tree/master/Client-Service): Serviço que lida com a criação de usuarios

## Usuario

- `POST - /user`: Cria um usuário
- `POST - /user/login`: Faz login e recebe token de autenticação

## Rotas implementadas

- `GET - /events`: Lista todos os eventos
- `POST - /event/request-buy-order/:event_id`: Requisição para fazer uma ordem de comprar um ticket
- `POST - /order/checkout-order/:order_id`: Requisição para finalizar o pagamento

## Como rodar

- Clone o repositório na maquina
- No diretório principal digite o comando `docker-compose up -d --build`
- As rotas estarão disponiveis no `localhost:8000`
- A documentação pode ser acessada por esse link: `localhost:8000/api`
