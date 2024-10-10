import { format } from 'date-fns';

export function salute(): string {
  const agora = new Date();
  const horaAtual = Number(format(agora, 'HH'));

  if (horaAtual >= 6 && horaAtual < 12) {
    return 'Bom dia';
  } else if (horaAtual >= 12 && horaAtual < 18) {
    return 'Boa tarde';
  } else if (horaAtual >= 18 && horaAtual < 24) {
    return 'Boa noite';
  } else {
    return 'Boa madrugada';
  }
}
