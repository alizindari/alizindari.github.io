import { Slider } from '@/components/ui/slider';

interface LaundryParameterControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

const LaundryParameterControl = ({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: LaundryParameterControlProps) => {
  const updateValue = (nextValue: number) => {
    if (!Number.isFinite(nextValue)) return;
    onChange(Math.min(max, Math.max(min, nextValue)));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="flex shrink-0 items-center justify-end gap-1.5">
          <input
            id={id}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => updateValue(Number(event.target.value))}
            className="h-8 w-[4.75rem] rounded-md border border-border bg-background px-2 text-right text-sm tabular-nums text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <span className="w-12 text-left text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <Slider
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([nextValue]) => updateValue(nextValue)}
      />
    </div>
  );
};

export default LaundryParameterControl;
