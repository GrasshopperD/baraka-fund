export const ASSETS = {
  Gold: 0.08,
  Silver: 0.1,
  'Sharia Compliant ETF (SPUS)': 0.12,
  Oil: 0.15,
  Wheat: 0.06,
  Soybean: 0.07,
};

export const ASSET_OPTIONS = Object.keys(ASSETS);

export const HORIZONS = [
  { label: '1 Year', years: 1 },
  { label: '5 Years', years: 5 },
  { label: '10 Years', years: 10 },
  { label: '15 Years', years: 15 },
];

export const PATH_COUNT = 100;
const VOLATILITY_MULTIPLIER = 1.375;

function randomNormal(mean, stdDev) {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + z * stdDev;
}

function runPath(months, capital, monthlyContribution, annualReturn) {
  const mu = annualReturn / 12;
  const sigma = (annualReturn * VOLATILITY_MULTIPLIER) / Math.sqrt(12);
  const values = [capital];
  let balance = capital;

  for (let m = 1; m <= months; m += 1) {
    const monthlyReturn = randomNormal(mu, sigma);
    balance *= 1 + monthlyReturn;
    balance += monthlyContribution;
    values.push(balance);
  }

  return values;
}

function percentileValue(sortedValues, percentile) {
  const index = Math.floor((percentile / 100) * (sortedValues.length - 1));
  return sortedValues[index];
}

function percentGainOverCapital(finalValue, capital) {
  return ((finalValue - capital) / capital) * 100;
}

export function buildChartDatasets(paths) {
  const ranked = paths
    .map((path, index) => ({
      path,
      index,
      final: path[path.length - 1],
    }))
    .sort((a, b) => a.final - b.final);

  const medianRank = Math.floor(ranked.length / 2);
  const medianEntry = ranked[medianRank];
  const datasets = [];

  ranked.forEach((entry, rank) => {
    if (entry.index === medianEntry.index) return;

    let borderColor = 'rgba(0, 255, 136, 0.15)';
    if (rank < 10) borderColor = 'rgba(255, 80, 80, 0.3)';
    else if (rank >= PATH_COUNT - 10) borderColor = 'rgba(0, 255, 136, 0.4)';

    datasets.push({
      data: entry.path,
      borderColor,
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
      tension: 0.15,
    });
  });

  datasets.push({
    data: medianEntry.path,
    borderColor: '#ffffff',
    borderWidth: 2,
    pointRadius: 0,
    fill: false,
    tension: 0.15,
  });

  return datasets;
}

export function runMonteCarlo({
  capital,
  monthlyContribution,
  annualReturn,
  years,
}) {
  const months = years * 12;
  const paths = Array.from({ length: PATH_COUNT }, () =>
    runPath(months, capital, monthlyContribution, annualReturn),
  );

  const labels = Array.from({ length: months + 1 }, (_, month) => month);
  const finalValues = paths.map((path) => path[path.length - 1]);
  const sortedFinals = [...finalValues].sort((a, b) => a - b);
  const lowestFinal = Math.min(...finalValues);
  const highestFinal = Math.max(...finalValues);
  const yAxisMin = lowestFinal * 0.85;
  const yAxisMax = highestFinal * 1.15;

  const expectedAmount =
    finalValues.reduce((sum, value) => sum + value, 0) / finalValues.length;
  const bestAmount = percentileValue(sortedFinals, 90);
  const worstAmount = percentileValue(sortedFinals, 10);

  return {
    paths,
    labels,
    datasets: buildChartDatasets(paths),
    yAxisMin,
    yAxisMax,
    stats: {
      expectedAmount,
      bestAmount,
      worstAmount,
      expectedGain: percentGainOverCapital(expectedAmount, capital),
      bestGain: percentGainOverCapital(bestAmount, capital),
      worstGain: percentGainOverCapital(worstAmount, capital),
    },
    months,
    capital,
  };
}
