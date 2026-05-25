import { useCountUp } from '../hooks/useCountUp';

function formatDollars(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatGain(value) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

export default function CountUpStat({ label, amount, percentGain, active }) {
  const animatedAmount = useCountUp(amount, 1200, active);
  const animatedGain = useCountUp(Math.abs(percentGain), 900, active);
  const isNegativeGain = percentGain < 0;

  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {active ? formatDollars(animatedAmount) : '—'}
      </span>
      <span
        className={`stat-gain ${isNegativeGain ? 'stat-gain-negative' : ''}`}
      >
        {active
          ? formatGain(isNegativeGain ? -animatedGain : animatedGain)
          : ''}
      </span>
    </div>
  );
}
