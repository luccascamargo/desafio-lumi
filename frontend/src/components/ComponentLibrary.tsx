"use client";
import axios from "axios";
import React, { useState, ChangeEvent } from "react";

interface ClientData {
  id: string;
  client_number: string;
  reference_month: string;
}

interface ComponentLibraryProps {
  data: ClientData[];
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ data }) => {
  const [searchClientNumber, setSearchClientNumber] = useState<number | null>(
    null
  );
  const [searchReferenceMonth, setSearchReferenceMonth] = useState<
    string | null
  >(null);

  const handleClientNumberChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const clientNumber =
      e.target.value === "default" ? null : parseInt(e.target.value);
    setSearchClientNumber(clientNumber);
  };

  const handleReferenceMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const referenceMonth = e.target.value === "default" ? null : e.target.value;
    setSearchReferenceMonth(referenceMonth);
  };

  // Extrair meses únicos da lista de dados
  const uniqueMonths = Array.from(
    new Set(data.map((client) => client.reference_month))
  );

  const filteredData = data.filter((client) => {
    return (
      (searchClientNumber === null ||
        String(client.client_number) === String(searchClientNumber)) &&
      (searchReferenceMonth === null ||
        client.reference_month.includes(searchReferenceMonth))
    );
  });

  const handleDownloadClick = async (id: string) => {
    // Faça uma solicitação para o backend para obter o PDF associado ao cliente
    try {
      const response = await axios.post(
        `http://localhost:3000/download?id=${id}`,
        {
          responseType: "blob", // Indica que a resposta é um blob (binary large object)
        }
      );

      // Cria um URL do blob e cria um link temporário para fazer o download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "fatura.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao fazer o download do PDF:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md w-screen">
      <h2 className="text-2xl font-bold mb-4">Lista de Clientes</h2>

      <div className="mb-4">
        <label
          htmlFor="clientNumber"
          className="block text-sm font-medium text-gray-600"
        >
          Buscar por Client Number:
        </label>
        <select
          id="clientNumber"
          value={searchClientNumber || "default"}
          onChange={handleClientNumberChange}
          className="mt-1 p-2 border rounded-md w-full"
        >
          <option value="default">Selecione um cliente</option>
          {data.map((client) => (
            <option key={client.id} value={client.client_number}>
              {client.client_number}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="referenceMonth"
          className="block text-sm font-medium text-gray-600"
        >
          Buscar por Reference Month:
        </label>
        <select
          id="referenceMonth"
          value={searchReferenceMonth || "default"}
          onChange={handleReferenceMonthChange}
          className="mt-1 p-2 border rounded-md w-full"
        >
          <option value="default">Selecione um mês</option>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <ul className="w-full">
        {filteredData === null
          ? data.map((client) => (
              <li
                key={client.id}
                className="mb-2 w-full flex items-center justify-between"
              >
                <span className="text-gray-800">
                  Client Number: {client.client_number}, Reference Month:{" "}
                  {client.reference_month}
                </span>
                <button
                  type="button"
                  onClick={() => handleDownloadClick(client.client_number)}
                  className="ml-2 p-2 bg-blue-500 text-white rounded-md"
                >
                  Baixar fatura
                </button>
              </li>
            ))
          : filteredData.map((client) => (
              <li
                key={client.id}
                className="mb-2 w-full flex items-center justify-between"
              >
                <span className="text-gray-800">
                  Client Number: {client.client_number}, Reference Month:{" "}
                  {client.reference_month}
                </span>
                <button
                  type="button"
                  onClick={() => handleDownloadClick(client.client_number)}
                  className="ml-2 p-2 bg-blue-500 text-white rounded-md"
                >
                  Baixar fatura
                </button>
              </li>
            ))}
      </ul>
    </div>
  );
};
