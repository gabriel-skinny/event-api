# Order Service

## Requirements

- Usuario consegue fazer uma ordem
- Usuario consegue pagar uma ordem
- Usuario consegue cancelar uma ordem pendente
- Usuario consegue ver suas ordens
- Uma ordem é cancelada depois de 10 minutos estando pendente

status da ordem -> "on_payment" -> "processing payment" -> "payed" -> "canceled"

## Controle interno

- Cancelar uma ordem depois de 10 minutos sem ser paga

## Eventos - Sub

- Criar ordem
- Pagamento confirmado

## Eventos - Pub

- Ordem cancelada
- Fazer pagamento
- Erro no pagamento
