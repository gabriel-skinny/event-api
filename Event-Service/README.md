# Event-Service

## Requirements

User:

- Consegue listar os eventos disponiveis e ver os tickets disponiveis
- Consegue criar uma ordem de pagamento para um ou mais tickets de um evento
- Consegue ver seus tickets comprados

Admin:

- Consegue visualizar todos os eventos cadastrados com filtros
- Consegue cadastrar eventos e tickets com valores especificos
- Consegue deixar um evento disponivel para compra
- Consegue editar valores de tickets de um evento
- Consegue deixar um evento indisponivel
- Consegue deletar um evento

Controle Interno:

- Um ticket não pode ter duas ou mais orders

## Metodos RPC

Evento:

- `createEvent()`: Cria um evento com tickets
- `publicEvent()`: Deixa um evento disponivel para ser comprado
- `getManyEvents()`: Lista todos os eventos
- `cancelEvent()`: Cancel a disponibilidade de um evento
- `deleteEvent()`: Deleta um evento

Ticket:

- `buyTicket()`: Compra um ticket
- `getTicketsByBuyerId()`: Lista todos os tickets comprados por um usuario
- `orderTickets()`: Cria uma ordem para um ou mais tickets
- `updateTicketsValue()`: Atualiza os valores de tickets

## Eventos - Pub

- Criar ordem de pagamento para ticket
- Evento indisponivel

## Eventos - Sub

- Ordem paga
- Ordem editada
- Ordem cancelada

## Banco de dados

Event:

- id (uuid)
- name (uuid)
- creatorId (uuid)
- ticketNumber (int)
- availableTickets (int)
- endSellingDate (date)
- publishedDate (date)
- available (boolean)

ticket:

- id
- price (int)
- eventId(uuid)
- type (string)
- buyed (boolean)
- orderId (uuid)
- buyerId (int)
