import { useEffect, useRef } from 'react';
import { createMonteCarloChart } from '../utils/chartAnimation';

export default function MonteCarloChart({
  labels,
  datasets,
  yAxisMin,
  yAxisMax,
  containerRef,
  onRevealComplete,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef?.current;
    const canvas = canvasRef.current;

    if (!container || !canvas || !labels?.length || !datasets?.length) {
      return undefined;
    }

    container.style.display = 'block';

    let cleanup = () => {};

    try {
      cleanup = createMonteCarloChart(
        canvas,
        labels,
        datasets,
        yAxisMin,
        yAxisMax,
        onRevealComplete,
      );
    } catch (error) {
      console.error('[Baraka Fund] Chart creation failed:', error);
    }

    return cleanup;
  }, [labels, datasets, yAxisMin, yAxisMax, containerRef, onRevealComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
