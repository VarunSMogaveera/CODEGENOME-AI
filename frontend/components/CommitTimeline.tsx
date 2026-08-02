"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type Commit = { date?: string; message?: string };

export default function CommitTimeline({ commits }: { commits?: Commit[] }) {
  const byDate: Record<string, number> = {};
  (commits || []).forEach((c) => {
    const d = c.date ? c.date.split('T')[0] : 'unknown';
    byDate[d] = (byDate[d] || 0) + 1;
  });

  const labels = Object.keys(byDate).sort();
  const data = {
    labels,
    datasets: [
      {
        label: 'Commits',
        data: labels.map((l) => byDate[l]),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.2)',
        fill: true,
      },
    ],
  };

  const options = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

  return (
    <div style={{ minHeight: 120 }}>
      <Line data={data} options={options} aria-label="Commit timeline chart" role="img" />
    </div>
  );
}
