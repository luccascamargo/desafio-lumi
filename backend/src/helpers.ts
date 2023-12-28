export function extractClienteNumero(pdfText: string) {
  const regex = /Nº DA INSTALAÇÃO\n\s+(\d+)/;

  const matches = pdfText.match(regex);

  if (matches && matches?.length >= 2) {
    return matches[1];
  }

  return null;
}

export function extractEnergiaCompensada(pdfText: string) {
  const regex =
    /Energia\s+compensada\s+GD\s+I[^\d]*(\d+)[^\d]*\s+(-?[\d,]+)\s+(-?[\d,]+)/i;

  const match = pdfText.match(regex);

  if (match && match.length >= 4) {
    const quantidade = parseFloat(match[1].replace(",", "."));
    const valor2 = parseFloat(match[3].replace(",", "."));

    return { Quantidade: quantidade, Valor: valor2 };
  }

  return null;
}

export function extractMesReferencia(pdfText: string) {
  const regex = /Referente\s*a?\s(\S+)/i;
  const matches = pdfText.match(regex);

  if (matches && matches.length >= 2) {
    const dataReferencia = matches[0].trim();

    const lines = pdfText.split("\n");
    const index = lines.findIndex((line) => line.includes(dataReferencia));

    if (index !== -1 && index + 1 < lines.length) {
      const month = lines[index + 1].trim().split("/")[0];
      const year = lines[index + 1].trim().split("/")[1].split(" ")[0];

      return `${month} ${year}`;
    }
  }

  return null;
}

export function extractEnergia(pdfText: string, tipoEnergia: string) {
  const regex = new RegExp(
    `${tipoEnergia}kWh\\s+(\\d+)\\s+([\\d,]+)\\s+([\\d,]+)`
  );
  const match = pdfText.match(regex);

  if (match) {
    return {
      Quantidade: parseFloat(match[1].replace(",", ".")),
      Valor: parseFloat(match[3].replace(",", ".")),
    };
  }
}

export function extractContribuicaoIlumPublica(pdfText: string) {
  const regex = /Contrib Ilum Publica Municipal\s+([\d,]+)/;
  const match = pdfText.match(regex);
  return match ? parseFloat(match[1].replace(",", ".")) : null;
}
