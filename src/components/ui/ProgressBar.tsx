interface ProgressBarProps {
  progress?: number;
  value?: number; 
  className?: string;
  colorClass?: string; 
  size?: string;
  color?: string;
}

export function ProgressBar({ 
  progress, 
  value,
  className = 'h-2', 
  colorClass = 'bg-blue-600' 
}: ProgressBarProps) {
  
  const rawValue = progress ?? value ?? 0;
  const safeValue = isNaN(rawValue) ? 0 : rawValue;
  
  const clampedProgress = Math.min(100, Math.max(0, safeValue));

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full transition-all duration-500 ease-out rounded-full ${colorClass}`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}