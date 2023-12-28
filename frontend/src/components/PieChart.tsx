"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Legend } from "chart.js";
import "chart.js/auto";

ChartJS.register(Legend);

interface ChartDataItem {
  id: string;
  client_number: string;
  reference_month: string;
  electrical_energy_value: number;
  amount_electrical_energy: number;
  sceee_energy_value: number;
  amout_sceee_electrical_energy: number;
  compensated_energy_value: number;
  amount_compensated_energy: number;
  contribution: number;
}

interface PieChartProps {
  data: ChartDataItem[];
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const handleClientNumberChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const clientNumber = e.target.value;
    setSelectedClient(clientNumber);
  };

  const getChartData = (): {
    chartDataEnergy: any;
    chartDataMoney: any;
  } | null => {
    if (selectedClient !== null) {
      const filteredData = data.filter(
        (item) => item.client_number === selectedClient
      );

      const totalData = filteredData.reduce(
        (acc, item) => {
          acc.electrical_energy_value += item.electrical_energy_value;
          acc.sceee_energy_value += item.sceee_energy_value;
          acc.compensated_energy_value += item.compensated_energy_value;
          acc.contribution += item.contribution;
          return acc;
        },
        {
          electrical_energy_value: 0,
          sceee_energy_value: 0,
          compensated_energy_value: 0,
          contribution: 0,
        }
      );

      // Retornar os dados do gráfico de Energia (kWh) e Valores Monetários (R$)
      return {
        chartDataEnergy: {
          labels: ["Consumo de Energia Elétrica", "Energia Compensada"],
          datasets: [
            {
              data: [
                totalData.electrical_energy_value +
                  totalData.sceee_energy_value,
                totalData.compensated_energy_value,
              ],
              backgroundColor: ["#FF6384", "#36A2EB"],
            },
          ],
        },
        chartDataMoney: {
          labels: ["Valor Total Sem GD"],
          datasets: [
            {
              data: [
                totalData.electrical_energy_value +
                  totalData.sceee_energy_value +
                  totalData.contribution,
              ],
              backgroundColor: ["#FFCE56"],
            },
          ],
        },
      };
    }

    // Se nenhum cliente estiver selecionado, calcular os totais para todos os clientes
    const totalData = data.reduce(
      (acc, item) => {
        acc.electrical_energy_value += item.electrical_energy_value;
        acc.sceee_energy_value += item.sceee_energy_value;
        acc.compensated_energy_value += item.compensated_energy_value;
        acc.contribution += item.contribution;
        return acc;
      },
      {
        electrical_energy_value: 0,
        sceee_energy_value: 0,
        compensated_energy_value: 0,
        contribution: 0,
      }
    );

    return {
      chartDataEnergy: {
        labels: ["Consumo de Energia Elétrica", "Energia Compensada"],
        datasets: [
          {
            data: [
              totalData.electrical_energy_value + totalData.sceee_energy_value,
              totalData.compensated_energy_value,
            ],
            backgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      },
      chartDataMoney: {
        labels: ["Valor Total Sem GD"],
        datasets: [
          {
            data: [
              totalData.electrical_energy_value +
                totalData.sceee_energy_value +
                totalData.contribution,
            ],
            backgroundColor: ["#FFCE56"],
          },
        ],
      },
    };
  };

  const { chartDataEnergy, chartDataMoney } = getChartData() || {};

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <label
        htmlFor="clientNumber"
        className="block text-sm font-medium text-gray-600 mb-2"
      >
        Selecione o codigo do cliente
      </label>
      <select
        id="clientNumber"
        value={selectedClient || ""}
        onChange={handleClientNumberChange}
        className="mt-1 p-2 border rounded-md w-full"
      >
        <option value="">Selecione um cliente</option>
        {data.map((client) => (
          <option key={client.client_number} value={client.client_number}>
            {client.client_number}
          </option>
        ))}
      </select>

      <div className="w-full flex items-center justify-around mt-8">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Energia (kWh)</h2>
          <Pie data={chartDataEnergy} />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Valores Monetários (R$)</h2>
          <Pie data={chartDataMoney} />
        </div>
      </div>
    </div>
  );
};
