import api from './api';

function normaliseTicket(ticket) {
  return {
    id: String(ticket.id),
    category: ticket.category,
    subject: ticket.subject,
    message: ticket.message,
    status: ticket.status,
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
  };
}

export async function getSupportTickets() {
  const response = await api.get('/support/tickets/');
  return response.data.map(normaliseTicket);
}

export async function createSupportTicket(ticket) {
  const response = await api.post('/support/tickets/', ticket);
  return normaliseTicket(response.data);
}
