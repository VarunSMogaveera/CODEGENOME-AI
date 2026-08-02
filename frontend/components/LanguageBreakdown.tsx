"use client";

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type Item = { language?: string; file_count?: number };

export default function LanguageBreakdown({ data }: { data: Item[] }) {
  const total = data.reduce((s, it) => s + (it.file_count || 0), 0);
  const chartData = {
    labels: data.map((d) => d.language || 'Unknown'),
    datasets: [
      {
        data: data.map((d) => d.file_count || 0),
        backgroundColor: ['#60a5fa', '#34d399', '#f59e0b', '#f97316', '#ef4444', '#a78bfa'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw || 0;
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${context.label}: ${value} files (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
      <div style={{ width: 140, minHeight: 200 }}>
        <Doughnut data={chartData} options={options} aria-label="Language breakdown chart" role="img" />
      </div>
      <div>
        <div aria-hidden={false} aria-label="Language breakdown list">
          {data.map((item) => {
          const count = item.file_count ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={item.language} data-testid={`lang-${item.language}`} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{item.language}</strong>
                <span>{count} files • {pct}%</span>
              </div>
              <div style={{ background: '#e6e6e6', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#60a5fa' }} />
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
