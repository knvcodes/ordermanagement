import '../../styles/common/spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div className="spinner-wrapper">
      <div className={`spinner spinner-${size}`} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
