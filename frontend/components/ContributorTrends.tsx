"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ContributorTrends({ contributors }: { contributors?: string[] }) {
  const counts: Record<string, number> = {};
  (contributors || []).forEach((c) => (counts[c] = (counts[c] || 0) + 1));

  const labels = Object.keys(counts).length ? Object.keys(counts) : ['No contributors'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Contributions',
        data: labels.map((l) => counts[l] || 0),
        backgroundColor: '#f97316',
      },
    ],
  };

  const options = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

  return (
    <div style={{ minHeight: 120 }}>
      <Bar data={data} options={options} aria-label="Contributor trends chart" role="img" />
    </div>
  );
}
