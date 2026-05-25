import { useCallback, useRef, useState } from 'react';
import {
  ASSETS,
  ASSET_OPTIONS,
  HORIZONS,
  runMonteCarlo,
} from '../utils/monteCarlo';
import CountUpStat from './CountUpStat';
import MonteCarloChart from './MonteCarloChart';
import TerminalInput from './TerminalInput';

const EXPAND_MS = 300;
const CHART_WRAPPER_HEIGHT = 500;

export default function Simulator() {
  const chartContainerRef = useRef(null);
  const [capital, setCapital] = useState('10000');
  const [asset, setAsset] = useState(ASSET_OPTIONS[0]);
  const [horizonYears, setHorizonYears] = useState(5);
  const [monthlyContribution, setMonthlyContribution] = useState('0');
  const [result, setResult] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const [runId, setRunId] = useState(0);
  const [chartExpanded, setChartExpanded] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const horizon = HORIZONS.find((h) => h.years === horizonYears);

  const handleRevealComplete = useCallback(() => {
    setShowStats(true);
  }, []);

  const handleRun = useCallback(() => {
    const simulation = runMonteCarlo({
      capital: Number(capital) || 0,
      monthlyContribution: Number(monthlyContribution) || 0,
      annualReturn: ASSETS[asset],
      years: horizon.years,
    });

    setResult(simulation);
    setHasRun(true);
    setRunId((id) => id + 1);
    setChartExpanded(false);
    setShowChart(false);
    setShowStats(false);

    document
      .getElementById('chart-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (window.chartInstance) {
      window.chartInstance.destroy();
      window.chartInstance = null;
    }

    requestAnimationFrame(() => {
      setChartExpanded(true);
      if (chartContainerRef.current) {
        chartContainerRef.current.style.display = 'block';
      }
    });

    window.setTimeout(() => {
      if (chartContainerRef.current) {
        chartContainerRef.current.style.display = 'block';
      }
      setShowChart(true);
    }, EXPAND_MS);
  }, [capital, monthlyContribution, asset, horizon.years]);

  return (
    <section
      className="simulator section-fade"
      style={{ animationDelay: '0.1s' }}
    >
      <div className="simulator-grid">
        <div className="input-panel panel-card">
          <TerminalInput
            id="capital"
            label="Capital to Invest"
            value={capital}
            onChange={setCapital}
          />

          <div className="field">
            <label htmlFor="asset">Asset</label>
            <select
              id="asset"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            >
              {ASSET_OPTIONS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <span className="field-label">Time Horizon</span>
            <div className="horizon-group" role="group" aria-label="Time horizon">
              {HORIZONS.map((h, index) => (
                <button
                  key={h.label}
                  type="button"
                  className={`horizon-btn ${horizonYears === h.years ? 'active' : ''}`}
                  onClick={() => setHorizonYears(h.years)}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <TerminalInput
            id="monthly"
            label="Monthly Contribution"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
          />

          <button type="button" className="run-btn" onClick={handleRun}>
            Run Simulation
          </button>
        </div>

        <div id="chart-section" className="chart-panel panel-card">
          {!hasRun ? (
            <div className="chart-placeholder">
              <div className="placeholder-icon">◇</div>
              <p>Configure your inputs and run a simulation</p>
              <span>100 stochastic paths · monthly compounding</span>
            </div>
          ) : (
            <>
              <div
                className={`chart-expand ${chartExpanded ? 'is-open' : ''}`}
                style={{
                  height: chartExpanded ? CHART_WRAPPER_HEIGHT : 0,
                  display: 'block',
                  overflow: 'hidden',
                  transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div
                  ref={chartContainerRef}
                  className="chart-container"
                  style={{
                    minHeight: `${CHART_WRAPPER_HEIGHT}px`,
                    height: `${CHART_WRAPPER_HEIGHT}px`,
                    width: '100%',
                    display: showChart ? 'block' : 'none',
                  }}
                >
                  {showChart && result && (
                    <MonteCarloChart
                      key={runId}
                      containerRef={chartContainerRef}
                      labels={result.labels}
                      datasets={result.datasets}
                      yAxisMin={result.yAxisMin}
                      yAxisMax={result.yAxisMax}
                      onRevealComplete={handleRevealComplete}
                    />
                  )}
                </div>
              </div>

              {showStats && result && (
                <div className="stats-grid" key={runId}>
                  <CountUpStat
                    label="Expected Return"
                    amount={result.stats.expectedAmount}
                    percentGain={result.stats.expectedGain}
                    active
                  />
                  <CountUpStat
                    label="Best Case"
                    amount={result.stats.bestAmount}
                    percentGain={result.stats.bestGain}
                    active
                  />
                  <CountUpStat
                    label="Worst Case"
                    amount={result.stats.worstAmount}
                    percentGain={result.stats.worstGain}
                    active
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
