import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusPieChartProps {
  data: any;
}

export default function StatusPieChart({ data }: StatusPieChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  return <Pie data={data} options={options} />;
}