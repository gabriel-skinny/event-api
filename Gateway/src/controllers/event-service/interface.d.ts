export interface IOrderTicketReturn {
  orderId: string;
}

export interface ITicketViewModel {
  id: string;
}

export interface IGetTicketsByBuyerIdReturn {
  tickets: ITicketViewModel[];
  totalTickets: number;
}

export interface IUpdateTicketsValueReturn {
  message: string;
}

export interface ICreateEventReturn {
  eventId: string;
}
