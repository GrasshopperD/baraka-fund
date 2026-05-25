export default function TerminalInput({ id, label, value, onChange }) {
  const handleChange = (event) => {
    const sanitized = event.target.value.replace(/[^0-9.]/g, '');
    onChange(sanitized);
  };

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="terminal-input-wrap">
        <span className="terminal-prefix" aria-hidden="true">
          $
        </span>
        <span className="terminal-divider" aria-hidden="true" />
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className="terminal-input"
          value={value}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
