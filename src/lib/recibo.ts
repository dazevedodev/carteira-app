import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

export type ReciboDados = {
  numero: string;
  aluguel: number;
  multa: number;
  juros: number;
  correcao: number;
  total: number;
  diasAtraso: number;
  mesReferencia: string;
  imovel: string;
  morador: string;
  dataPagamento: string;
  recebedor: string;
  emNomeDe: string | null;
  emitidoEm: string;
};

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// As fontes padrão do PDF só aceitam Latin-1; troca o que não couber por "?".
const limpa = (s: string) => s.replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");

const UNIDADES = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const DEZENAS = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const CENTENAS = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

function ate999(n: number): string {
  if (n === 100) return "cem";
  const partes: string[] = [];
  const c = Math.floor(n / 100);
  const r = n % 100;
  if (c > 0) partes.push(CENTENAS[c]);
  if (r > 0) {
    partes.push(
      r < 20
        ? UNIDADES[r]
        : DEZENAS[Math.floor(r / 10)] + (r % 10 ? " e " + UNIDADES[r % 10] : "")
    );
  }
  return partes.join(" e ");
}

function inteiroPorExtenso(n: number): string {
  if (n < 1000) return ate999(n);
  const mil = Math.floor(n / 1000);
  const resto = n % 1000;
  const parteMil = mil === 1 ? "mil" : ate999(mil) + " mil";
  if (resto === 0) return parteMil;
  const liga = resto < 100 || resto % 100 === 0 ? " e " : " ";
  return parteMil + liga + ate999(resto);
}

// Vazio para valores muito grandes (não é o caso de aluguel).
export function reaisPorExtenso(valor: number): string {
  const centavosTotal = Math.round(valor * 100);
  const reais = Math.floor(centavosTotal / 100);
  const centavos = centavosTotal % 100;
  if (reais >= 1_000_000) return "";

  const partes: string[] = [];
  if (reais > 0) {
    partes.push(`${inteiroPorExtenso(reais)} ${reais === 1 ? "real" : "reais"}`);
  }
  if (centavos > 0) {
    partes.push(`${inteiroPorExtenso(centavos)} ${centavos === 1 ? "centavo" : "centavos"}`);
  }
  return partes.length ? partes.join(" e ") : "zero reais";
}

function quebraLinhas(texto: string, fonte: PDFFont, tamanho: number, larguraMax: number) {
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of texto.split(/\s+/)) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (fonte.widthOfTextAtSize(tentativa, tamanho) <= larguraMax) {
      atual = tentativa;
    } else {
      if (atual) linhas.push(atual);
      atual = palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

export async function gerarReciboPdf(d: ReciboDados): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const esquerda = 56;
  const largura = 595 - esquerda * 2;
  const verde = rgb(0.12, 0.55, 0.38);
  const cinza = rgb(0.4, 0.43, 0.42);
  const preto = rgb(0.1, 0.12, 0.11);

  let y = 780;

  page.drawText("RECIBO DE ALUGUEL", { x: esquerda, y, size: 22, font: bold, color: preto });
  page.drawText(limpa(`N° ${d.numero}`), {
    x: 595 - esquerda - bold.widthOfTextAtSize(limpa(`N° ${d.numero}`), 11),
    y: y + 4,
    size: 11,
    font: bold,
    color: cinza,
  });
  y -= 14;
  page.drawLine({ start: { x: esquerda, y }, end: { x: esquerda + largura, y }, thickness: 2, color: verde });

  y -= 44;
  page.drawText("VALOR RECEBIDO", { x: esquerda, y: y + 20, size: 9, font: bold, color: cinza });
  page.drawText(limpa(brl(d.total)), { x: esquerda, y: y - 8, size: 30, font: bold, color: verde });

  const extenso = reaisPorExtenso(d.total);
  y -= 34;
  if (extenso) {
    for (const linha of quebraLinhas(limpa(`(${extenso})`), regular, 10, largura)) {
      page.drawText(linha, { x: esquerda, y, size: 10, font: regular, color: cinza });
      y -= 14;
    }
  }

  y -= 14;
  const quemRecebe = d.emNomeDe
    ? `${d.recebedor}, em nome de ${d.emNomeDe}`
    : d.recebedor;
  const paragrafo =
    `Recebi de ${d.morador} a quantia acima, referente ao aluguel de ${d.mesReferencia} ` +
    `do imóvel ${d.imovel}, paga em ${d.dataPagamento}. ` +
    `Por ser verdade, firmo o presente recibo, dando plena quitação do valor descrito.`;
  for (const linha of quebraLinhas(limpa(paragrafo), regular, 12, largura)) {
    page.drawText(linha, { x: esquerda, y, size: 12, font: regular, color: preto });
    y -= 18;
  }

  y -= 14;
  page.drawText("DISCRIMINAÇÃO", { x: esquerda, y, size: 9, font: bold, color: cinza });
  y -= 10;
  page.drawLine({ start: { x: esquerda, y }, end: { x: esquerda + largura, y }, thickness: 0.5, color: cinza });

  const itens: [string, number][] = [["Aluguel", d.aluguel]];
  if (d.diasAtraso > 0) {
    itens.push([`Multa por atraso (${d.diasAtraso} dia${d.diasAtraso === 1 ? "" : "s"})`, d.multa]);
    itens.push(["Juros", d.juros]);
    if (d.correcao > 0) itens.push(["Correção monetária", d.correcao]);
  }
  for (const [nome, valor] of itens) {
    y -= 20;
    page.drawText(limpa(nome), { x: esquerda, y, size: 11, font: regular, color: preto });
    const v = limpa(brl(valor));
    page.drawText(v, { x: esquerda + largura - regular.widthOfTextAtSize(v, 11), y, size: 11, font: regular, color: preto });
  }
  y -= 10;
  page.drawLine({ start: { x: esquerda, y }, end: { x: esquerda + largura, y }, thickness: 0.5, color: cinza });
  y -= 20;
  page.drawText("Total", { x: esquerda, y, size: 12, font: bold, color: preto });
  const vt = limpa(brl(d.total));
  page.drawText(vt, { x: esquerda + largura - bold.widthOfTextAtSize(vt, 12), y, size: 12, font: bold, color: verde });

  y -= 70;
  page.drawText(limpa(`Emitido em ${d.emitidoEm}`), { x: esquerda, y, size: 11, font: regular, color: preto });

  y -= 70;
  page.drawLine({ start: { x: esquerda, y }, end: { x: esquerda + 260, y }, thickness: 0.8, color: preto });
  y -= 14;
  page.drawText(limpa(quemRecebe), { x: esquerda, y, size: 11, font: bold, color: preto });

  page.drawText("Emitido pelo sistema Carteira de Aluguel - carteiradealuguel.com.br", {
    x: esquerda,
    y: 40,
    size: 8,
    font: regular,
    color: cinza,
  });

  return pdf.save();
}
