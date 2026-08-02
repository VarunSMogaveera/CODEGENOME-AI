import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
vi.mock('react-chartjs-2', () => ({
  Doughnut: () => <div data-testid="doughnut" />
}))
import LanguageBreakdown from '../LanguageBreakdown'

describe('LanguageBreakdown', () => {
  it('renders language items and percentages', () => {
    const data = [
      { language: 'Java', file_count: 50 },
      { language: 'Markdown', file_count: 1 },
    ];
    render(<LanguageBreakdown data={data} />);
    expect(screen.getByText('Java')).toBeTruthy();
    expect(screen.getByText('Markdown')).toBeTruthy();
    expect(screen.getByText(/50\s*files/)).toBeTruthy();
    expect(screen.getByText(/1\s*files/)).toBeTruthy();
  })
})
