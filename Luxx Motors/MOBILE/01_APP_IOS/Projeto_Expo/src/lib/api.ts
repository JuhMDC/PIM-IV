import type { Confirmacao, FinanciamentoInput, TestDriveInput, Veiculo } from '../types';

export const API_BASE = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE) throw new Error('Configure EXPO_PUBLIC_API_URL para conectar o aplicativo à API LUXX MOTORS.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...options.headers },
    });
    const raw = await response.text();
    let data: any = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }
    if (!response.ok) {
      throw new Error(typeof data?.mensagem === 'string'
        ? data.mensagem
        : response.status === 429 ? 'Muitas tentativas. Aguarde um pouco e tente novamente.'
        : `Não foi possível concluir a solicitação (HTTP ${response.status}).`);
    }
    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('Tempo de conexão esgotado. Confira a rede e tente novamente.');
    throw error;
  } finally { clearTimeout(timeout); }
}

function normalizaVeiculo(o: any): Veiculo {
  return {
    id: Number(o.id ?? o.id_veiculo ?? o.Id_veiculo),
    marca: String(o.marca ?? o.Marca ?? ''),
    modelo: String(o.modelo ?? o.Modelo ?? ''),
    ano: o.ano == null ? null : Number(o.ano),
    preco: o.preco == null ? null : Number(o.preco),
    cor: String(o.cor ?? ''),
    cambio: String(o.cambio ?? ''),
    status: String(o.status ?? ''),
    categoria: String(o.categoria ?? ''),
    quilometragem: o.quilometragem == null ? null : Number(o.quilometragem),
    imagemUrl: typeof o.imagemUrl === 'string' ? o.imagemUrl : null,
  };
}

export const api = {
  async veiculos(): Promise<Veiculo[]> {
    const data = await request<unknown>('/api/mobile/veiculos');
    if (!Array.isArray(data)) throw new Error('Resposta de veículos inválida.');
    return data.map(normalizaVeiculo).filter(v => Number.isSafeInteger(v.id) && v.id > 0);
  },
  testDrive: (dados: TestDriveInput) => request<Confirmacao>('/api/mobile/testdrives', {
    method: 'POST', body: JSON.stringify(dados),
  }),
  proposta: (dados: FinanciamentoInput) => request<Confirmacao>('/api/mobile/financiamentos', {
    method: 'POST', body: JSON.stringify(dados),
  }),
};

export function urlImagem(path: string | null): string | undefined {
  if (!path || !API_BASE) return undefined;
  if (/^https:\/\//.test(path)) return path;
  // Nunca aceitar protocolos executáveis ou URLs arbitrárias da base de dados.
  if (!path.startsWith('/veiculos/')) return undefined;
  return `${API_BASE}${path}`;
}
