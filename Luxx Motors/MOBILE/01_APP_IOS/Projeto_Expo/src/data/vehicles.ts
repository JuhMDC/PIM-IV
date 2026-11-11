import type { Veiculo } from '../types';
import { cleanKey } from '../lib/utils';
import type { ImageSourcePropType } from 'react-native';

const fotos: {marca:string; modelo:string; cor:string; asset:ImageSourcePropType}[] = [
  { marca: 'Fiat', modelo: 'Mobi Like', cor: 'Branco', asset: require("../../assets/carros/mobi-branco.webp") },
  { marca: 'Volkswagen', modelo: 'Gol 1.0', cor: 'Prata', asset: require("../../assets/carros/gol-prata.webp") },
  { marca: 'Chevrolet', modelo: 'Onix', cor: 'Preto', asset: require("../../assets/carros/onix-preto.webp") },
  { marca: 'Hyundai', modelo: 'HB20', cor: 'Vermelho', asset: require("../../assets/carros/hb20-vermelho.webp") },
  { marca: 'Ford', modelo: 'Ka', cor: 'Branco', asset: require("../../assets/carros/ford_ka-branco.webp") },
  { marca: 'Renault', modelo: 'Kwid', cor: 'Cinza', asset: require("../../assets/carros/kwid-cinza.webp") },
  { marca: 'Fiat', modelo: 'Argo', cor: 'Preto', asset: require("../../assets/carros/argo-preto.webp") },
  { marca: 'Volkswagen', modelo: 'Polo', cor: 'Azul', asset: require("../../assets/carros/polo-azul.webp") },
  { marca: 'Chevrolet', modelo: 'Onix Plus', cor: 'Prata', asset: require("../../assets/carros/onix_plus-prata.webp") },
  { marca: 'Hyundai', modelo: 'HB20S', cor: 'Branco', asset: require("../../assets/carros/hb20s-branco.webp") },
  { marca: 'Toyota', modelo: 'Etios', cor: 'Cinza', asset: require("../../assets/carros/etios-cinza.webp") },
  { marca: 'Nissan', modelo: 'Versa', cor: 'Preto', asset: require("../../assets/carros/versa-preto.webp") },
  { marca: 'Fiat', modelo: 'Cronos', cor: 'Branco', asset: require("../../assets/carros/cronos-branco.webp") },
  { marca: 'Chevrolet', modelo: 'Joy', cor: 'Prata', asset: require("../../assets/carros/joy-prata.webp") },
  { marca: 'Toyota', modelo: 'Corolla', cor: 'Preto', asset: require("../../assets/carros/corolla-preto.webp") },
  { marca: 'Jeep', modelo: 'Compass', cor: 'Branco', asset: require("../../assets/carros/compass-branco.webp") },
  { marca: 'Honda', modelo: 'Civic', cor: 'Cinza', asset: require("../../assets/carros/civic-cinza.webp") },
  { marca: 'Volkswagen', modelo: 'Jetta GLI', cor: 'Vermelho', asset: require("../../assets/carros/gli-vermelho.webp") },
  { marca: 'BMW', modelo: '320i', cor: 'Azul', asset: require("../../assets/carros/320i-azul.webp") },
  { marca: 'Fiat', modelo: 'Strada', cor: 'Branco', asset: require("../../assets/carros/strada-branco.webp") },
  { marca: 'Volkswagen', modelo: 'Saveiro', cor: 'Prata', asset: require("../../assets/carros/saveiro-prata.webp") },
  { marca: 'Toyota', modelo: 'Hilux', cor: 'Preto', asset: require("../../assets/carros/hilux-preto.webp") },
  { marca: 'Chevrolet', modelo: 'S10', cor: 'Cinza', asset: require("../../assets/carros/s10-cinza.webp") },
  { marca: 'Ford', modelo: 'Ranger', cor: 'Branco', asset: require("../../assets/carros/ranger-branco.webp") },
  { marca: 'Mitsubishi', modelo: 'L200 Triton', cor: 'Prata', asset: require("../../assets/carros/l200-prata.webp") },
];
export const FOTOS = fotos;
export const PREVIEW: Veiculo[] = fotos.map((f, i) => ({
  id: -(i+1), marca: f.marca, modelo: f.modelo, cor: f.cor,
  ano: null, preco: null, cambio: '', status: 'Demonstração', categoria: '',
  quilometragem: null, imagemUrl: null, demonstracao: true,
}));

export function fotoLocal(v: Veiculo): ImageSourcePropType | undefined {
  const marca = cleanKey(v.marca), modelo = cleanKey(v.modelo), cor = cleanKey(v.cor);
  const exata = fotos.find(f => cleanKey(f.marca) === marca && cleanKey(f.modelo) === modelo && cleanKey(f.cor) === cor);
  return exata?.asset ?? fotos.find(f => cleanKey(f.marca) === marca && cleanKey(f.modelo) === modelo)?.asset;
}
