const FIRMS = [
  {
    name: 'FTMO',
    descriptor: 'Up to $400K per trader',
    nameClass: 'firm-ftmo',
  },
  {
    name: 'Funding Pips',
    descriptor: 'Up to $2M scaling',
    nameClass: 'firm-funding-pips',
  },
  {
    name: 'Alpha Capital Group',
    descriptor: '1.2M+ global traders',
    nameClass: 'firm-alpha',
  },
  {
    name: 'Maven Trading',
    descriptor: 'Verified payouts',
    nameClass: 'firm-maven',
  },
  {
    name: 'Funding Traders',
    descriptor: 'Multi-asset funding',
    nameClass: 'firm-funding-traders',
  },
  {
    name: 'Funding Futures',
    descriptor: 'Rapid evaluation process',
    nameClass: 'firm-funding-futures',
  },
];

const STATS = [
  { value: '$450M+', label: 'Paid out by FTMO to traders' },
  { value: '$120M+', label: 'Paid out by Alpha Capital' },
  { value: '1.2M+', label: 'Traders across all firms' },
];

function FirmCard({ firm }) {
  return (
    <article className="firm-card">
      <p className={`firm-name ${firm.nameClass}`}>{firm.name}</p>
      <p className="firm-descriptor">{firm.descriptor}</p>
    </article>
  );
}

function FirmGroup() {
  return (
    <div className="trust-carousel-group">
      {FIRMS.map((firm) => (
        <FirmCard key={firm.name} firm={firm} />
      ))}
    </div>
  );
}

export default function TrustCarousel() {
  return (
    <section className="trust-section section-fade" style={{ animationDelay: '0.15s' }}>
      <div className="trust-section-inner">
        <header className="trust-header">
          <p className="trust-eyebrow">Proudly Traded With</p>
          <h2 className="trust-title">
            Trusted by traders across billion-dollar prop firms
          </h2>
        </header>

        <div className="trust-stats">
          {STATS.map((stat, index) => (
            <div key={stat.label} className="trust-stat-item">
              {index > 0 && <div className="trust-stat-divider" aria-hidden="true" />}
              <div className="trust-stat-content">
                <span className="trust-stat-value">{stat.value}</span>
                <span className="trust-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="trust-carousel-viewport">
          <div className="trust-carousel-track">
            <FirmGroup />
            <FirmGroup aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
