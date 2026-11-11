export const brl = (valor: number | null) => valor == null || valor <= 0
  ? 'Consulte o valor'
  : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);

export const km = (valor: number | null) => valor == null
  ? 'KM não informado'
  : `${new Intl.NumberFormat('pt-BR').format(valor)} km`;

export const onlyDigits = (v: string) => v.replace(/\D/g, '');

// Insere automaticamente os hífens em datas digitadas no teclado numérico.
// Exemplo: 20261025 -> 2026-10-25.
export const formatarDataISO = (texto: string): string => {
  const numeros = onlyDigits(texto).slice(0, 8);
  if (numeros.length <= 4) return numeros;
  if (numeros.length <= 6) return `${numeros.slice(0, 4)}-${numeros.slice(4)}`;
  return `${numeros.slice(0, 4)}-${numeros.slice(4, 6)}-${numeros.slice(6)}`;
};

export const cleanKey = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

export function parcelaPrice(preco: number, entrada: number, taxaPercentualMes: number, meses: number) {
  const saldo = preco - entrada;
  if (!Number.isFinite(saldo) || saldo <= 0 || meses < 1 || !Number.isInteger(meses) || taxaPercentualMes < 0) return 0;
  const taxa = taxaPercentualMes / 100;
  if (taxa === 0) return saldo / meses;
  const fator = (1 + taxa) ** meses;
  return saldo * taxa * fator / (fator - 1);
}

export const dataISOValida = (v: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T12:00:00`);
  return !Number.isNaN(d.getTime()) && d.getFullYear() === +v.slice(0,4) && d.getMonth()+1 === +v.slice(5,7) && d.getDate() === +v.slice(8,10);
};
export const cpfValido = (v: string) => {
  const cpf = onlyDigits(v);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const len of [9, 10]) {
    let sum = 0;
    for (let i=0; i<len; i++) sum += Number(cpf[i]) * (len+1-i);
    const digito = ((sum * 10) % 11) % 10;
    if (digito !== Number(cpf[len])) return false;
  }
  return true;
};
