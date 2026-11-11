export type Veiculo = {
  id: number;
  marca: string;
  modelo: string;
  ano: number | null;
  preco: number | null;
  cor: string;
  cambio: string;
  status: string;
  categoria: string;
  quilometragem: number | null;
  imagemUrl: string | null;
  demonstracao?: boolean;
};

export type Contato = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
};
export type TestDriveInput = Contato & { idVeiculo: number; dataAgendamento: string; horario: string };
export type FinanciamentoInput = Contato & { idVeiculo: number; entrada: number; parcelas: number; taxaMensal: number };
export type Confirmacao = { protocolo: number; mensagem: string };
