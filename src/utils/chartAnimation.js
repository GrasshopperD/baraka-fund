const REVEAL_INTERVAL_MS = 16;

export function getRevealDuration(pointCount) {
  return pointCount * REVEAL_INTERVAL_MS;
}

function formatYAxisTick(value) {
  const num = Number(value);
  if (Math.abs(num) >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `$${num.toFixed(0)}`;
}

export function getChartOptions(yAxisMin, yAxisMax, datasetCount) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    transitions: {
      active: { animation: { duration: 0 } },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(8, 15, 10, 0.95)',
        borderColor: 'rgba(0, 255, 136, 0.35)',
        borderWidth: 1,
        titleColor: '#00ff88',
        bodyColor: '#f0ede6',
        titleFont: { family: 'DM Sans', size: 11 },
        bodyFont: { family: 'DM Sans', size: 12 },
        callbacks: {
          title(items) {
            const month = Number(items[0]?.label ?? 0);
            return month % 12 === 0 ? `Year ${month / 12}` : `Month ${month}`;
          },
          label(context) {
            return ` $${Number(context.parsed.y).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
          },
        },
        filter(item) {
          return item.datasetIndex === datasetCount - 1;
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: 'rgba(240, 237, 230, 0.4)',
          font: { family: 'DM Sans', size: 10 },
          maxTicksLimit: 8,
          callback(_value, index) {
            return index % 12 === 0 ? `Y${index / 12}` : '';
          },
        },
        border: { color: 'rgba(255, 255, 255, 0.08)' },
      },
      y: {
        min: yAxisMin,
        max: yAxisMax,
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
          drawOnChartArea: true,
        },
        ticks: {
          color: 'rgba(240, 237, 230, 0.45)',
          font: { family: 'DM Sans', size: 11 },
          maxTicksLimit: 10,
          callback(value) {
            return formatYAxisTick(value);
          },
        },
        border: { display: false },
      },
    },
  };
}

function cloneDatasetsWithEmptyData(datasets) {
  return datasets.map((dataset) => ({
    ...dataset,
    data: [],
  }));
}

export function createMonteCarloChart(
  canvas,
  labels,
  datasets,
  yAxisMin,
  yAxisMax,
  onRevealComplete,
) {
  const Chart = window.Chart;
  if (!Chart) {
    throw new Error('Chart.js is not loaded. Check the CDN script in index.html.');
  }

  if (window.chartInstance) {
    window.chartInstance.destroy();
    window.chartInstance = null;
  }

  const fullSeries = datasets.map((dataset) => [...dataset.data]);
  const totalPoints = fullSeries[0]?.length ?? 0;

  window.chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: cloneDatasetsWithEmptyData(datasets),
    },
    options: getChartOptions(yAxisMin, yAxisMax, datasets.length),
  });

  let revealedCount = 0;
  let intervalId = null;

  const revealNextPoint = () => {
    revealedCount += 1;
    window.chartInstance.data.datasets.forEach((dataset, index) => {
      dataset.data = fullSeries[index].slice(0, revealedCount);
    });
    window.chartInstance.update('none');

    if (revealedCount >= totalPoints) {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      onRevealComplete?.();
    }
  };

  intervalId = setInterval(revealNextPoint, REVEAL_INTERVAL_MS);

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (window.chartInstance) {
      window.chartInstance.destroy();
      window.chartInstance = null;
    }
  };
}
