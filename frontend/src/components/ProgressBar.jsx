function ProgressBar({ value = 0, color, label, showValue = true }) {
  const progress = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-bar" aria-label={label ? `${label}: ${progress}%` : `${progress}%`}>
      <span className="progress-bar__track"><span className="progress-bar__value" style={{ width: `${progress}%`, background: color }} /></span>
      {showValue && <strong>{progress}%</strong>}
    </div>
  );
}

export default ProgressBar;
