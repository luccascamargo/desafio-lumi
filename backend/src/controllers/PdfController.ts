// <reference types="node" />
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import pdf from "pdf-parse";
import { UploadedFile } from "express-fileupload";
import {
  extractClienteNumero,
  extractContribuicaoIlumPublica,
  extractEnergia,
  extractEnergiaCompensada,
  extractMesReferencia,
} from "../helpers";

class PdfController {
  async list(req: Request, res: Response) {
    try {
      const clients = await prisma.clients.findMany({
        include: {
          Invoice: false,
        },
      });

      return res.status(200).json(clients);
    } catch (error) {
      console.log(error);
      return res.status(200).send("Erro interno do sistema");
    }
  }
  async upload(req: Request, res: Response) {
    try {
      const { pdf: uploadedFile } = req.files as { pdf: UploadedFile };

      if (!uploadedFile) {
        return res.status(400).send("Nenhum arquivo enviado.");
      }

      const buffer = uploadedFile.data;
      if (buffer) {
        const result = await pdf(buffer);

        const clienteNumero = extractClienteNumero(result.text);
        const mesReferencia = extractMesReferencia(result.text);
        const energiaEletrica = extractEnergia(result.text, "Energia Elétrica");
        const energiaSCEEE = extractEnergia(
          result.text,
          "Energia SCEE s/ ICMS"
        );
        const energiaCompensada = extractEnergiaCompensada(result.text);
        const contribuicaoIlumPublica = extractContribuicaoIlumPublica(
          result.text
        );

        /* const formattedResponse = {
          "No DO CLIENTE": clienteNumero,
          "Mês de referência": mesReferencia,
          "Energia Elétrica": energiaEletrica,
          "Energia SCEEE s/ICMS": energiaSCEEE,
          "Energia Compensada GD I": energiaCompensada,
          "Contrib Ilum Publica Municipal": contribuicaoIlumPublica,
        };
  
        return res.json(formattedResponse); */

        if (clienteNumero) {
          const clientAlreadyExists = await prisma.clients.findUnique({
            where: {
              client_number: clienteNumero,
            },
          });

          if (!clientAlreadyExists) {
            await prisma.clients.create({
              data: {
                client_number: clienteNumero,
                contribution: contribuicaoIlumPublica,
                amount_compensated_energy: energiaCompensada?.Quantidade,
                amount_electrical_energy: energiaEletrica?.Quantidade,
                amout_sceee_electrical_energy: energiaSCEEE?.Quantidade,
                compensated_energy_value: energiaCompensada?.Valor,
                electrical_energy_value: energiaEletrica?.Valor,
                sceee_energy_value: energiaSCEEE?.Valor,
                reference_month: mesReferencia,
                Invoice: {
                  create: {
                    pdfData: buffer,
                  },
                },
              },
            });

            return res.status(204).send("Cadastrado com sucesso");
          }
          return res.status(200).send("Cliente já cadastrado na base de dados");
        }
        return res.status(200).send("Pdf não contém numero do cliente");
      }

      return res.status(500).send("Erro ao processar o arquivo PDF.");
    } catch (error) {
      console.error(
        "Erro durante o upload e processamento do arquivo PDF:",
        error
      );
      return res.status(500).send("Erro interno no servidor.");
    } finally {
      await prisma.$disconnect();
    }
  }
  async download(req: Request, res: Response) {
    try {
      const { id } = req.query;

      const client = await prisma.clients.findUnique({
        where: {
          client_number: id as string,
        },
        include: {
          Invoice: true,
        },
      });

      if (client) {
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=arquivo.pdf"
        );
        res.setHeader("Content-Type", "application/pdf");
        //@ts-ignore
        const blobBuffer = Buffer.from(client.Invoice[0].pdfData, "base64");
        res.status(200).end(blobBuffer);
      } else {
        res.status(404).send("Cliente não encontrado");
      }
    } catch (error) {
      console.error("Erro durante o download do arquivo PDF:", error);
      res.status(500).send("Erro interno no servidor.");
    } finally {
      await prisma.$disconnect();
    }
  }
}

export default PdfController;
