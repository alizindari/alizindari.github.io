import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LaundryParameterControl from './LaundryParameterControl';

const DEFAULTS = {
  horizon: 365,
  price: 20,
  washCost: 5,
  dailyUse: 1,
  dryingTime: 2,
};

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const formatNumber = (value: number) => numberFormatter.format(value);
const formatCurrency = (value: number) => `${formatNumber(value)} €`;

interface ResultMetricProps {
  label: string;
  value: string;
  className?: string;
}

const ResultMetric = ({ label, value, className = '' }: ResultMetricProps) => (
  <div className={`min-w-0 px-3 py-4 sm:px-4 ${className}`}>
    <div className="text-xs text-muted-foreground sm:text-sm">{label}</div>
    <div className="mt-1 break-words text-lg font-semibold tabular-nums text-foreground sm:text-xl">
      {value}
    </div>
  </div>
);

const LaundryModelPlayground = () => {
  const [horizon, setHorizon] = useState(DEFAULTS.horizon);
  const [price, setPrice] = useState(DEFAULTS.price);
  const [washCost, setWashCost] = useState(DEFAULTS.washCost);
  const [dailyUse, setDailyUse] = useState(DEFAULTS.dailyUse);
  const [dryingTime, setDryingTime] = useState(DEFAULTS.dryingTime);

  const model = useMemo(() => {
    const optimalInterval = Math.sqrt((washCost * horizon) / (price * dailyUse));
    const optimalWardrobe = dailyUse * (optimalInterval + dryingTime);
    const washes = horizon / optimalInterval;
    const clothingCost = price * optimalWardrobe;
    const laundryCost = (washCost * horizon) / optimalInterval;
    const totalCost = clothingCost + laundryCost;

    const minimumWardrobe = Math.floor(dailyUse * dryingTime) + 1;
    const maximumCandidate = Math.ceil(optimalWardrobe) + 3;
    const practicalChoices = Array.from(
      { length: maximumCandidate - minimumWardrobe + 1 },
      (_, index) => minimumWardrobe + index,
    ).map((wardrobe) => {
      const interval = wardrobe / dailyUse - dryingTime;
      return {
        wardrobe,
        interval,
        washes: horizon / interval,
        totalCost: price * wardrobe + (washCost * horizon) / interval,
      };
    });

    const practical = practicalChoices.reduce((best, choice) =>
      choice.totalCost < best.totalCost ? choice : best,
    );

    const chartStart = Math.max(0.25, optimalInterval * 0.25);
    const chartEnd = optimalInterval * 2.5;
    const chartData = Array.from({ length: 61 }, (_, index) => {
      const interval = chartStart + ((chartEnd - chartStart) * index) / 60;
      return {
        interval,
        clothes: price * dailyUse * (interval + dryingTime),
        washing: (washCost * horizon) / interval,
        total:
          price * dailyUse * (interval + dryingTime) +
          (washCost * horizon) / interval,
      };
    });

    return {
      optimalInterval,
      optimalWardrobe,
      washes,
      totalCost,
      practical,
      chartData,
    };
  }, [dailyUse, dryingTime, horizon, price, washCost]);

  const resetModel = () => {
    setHorizon(DEFAULTS.horizon);
    setPrice(DEFAULTS.price);
    setWashCost(DEFAULTS.washCost);
    setDailyUse(DEFAULTS.dailyUse);
    setDryingTime(DEFAULTS.dryingTime);
  };

  return (
    <section className="mt-8 border-t border-border pt-7 sm:mt-10 sm:pt-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Try the model</h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Change the assumptions and watch the optimum move.
          </p>
        </div>
        <button
          type="button"
          onClick={resetModel}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          title="Reset parameters"
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-0">
        <div className="space-y-5 lg:border-r lg:border-border lg:pr-7">
          <LaundryParameterControl
            id="laundry-horizon"
            label="Time horizon"
            value={horizon}
            min={30}
            max={1095}
            step={5}
            unit="days"
            onChange={setHorizon}
          />
          <LaundryParameterControl
            id="laundry-price"
            label="Price per item"
            value={price}
            min={5}
            max={100}
            step={1}
            unit="€"
            onChange={setPrice}
          />
          <LaundryParameterControl
            id="laundry-wash-cost"
            label="Effective wash cost"
            value={washCost}
            min={0.25}
            max={25}
            step={0.25}
            unit="€"
            onChange={setWashCost}
          />
          <LaundryParameterControl
            id="laundry-daily-use"
            label="Daily use"
            value={dailyUse}
            min={1}
            max={5}
            step={1}
            unit="items"
            onChange={setDailyUse}
          />
          <LaundryParameterControl
            id="laundry-drying-time"
            label="Drying time"
            value={dryingTime}
            min={0}
            max={7}
            step={0.5}
            unit="days"
            onChange={setDryingTime}
          />
        </div>

        <div className="min-w-0 lg:pl-7">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-base font-semibold text-foreground sm:text-lg">
              Cost over the time horizon
            </h3>
            <span className="text-xs tabular-nums text-muted-foreground sm:text-sm">
              optimum: {formatNumber(model.optimalInterval)} days
            </span>
          </div>
          <div
            className="mt-3 h-[290px] w-full sm:h-[320px]"
            role="img"
            aria-label="Clothing, washing, and total cost as the washing interval changes"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={model.chartData}
                margin={{ top: 10, right: 8, bottom: 12, left: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 5"
                />
                <XAxis
                  type="number"
                  dataKey="interval"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => formatNumber(Number(value))}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  label={{
                    value: 'Days between washes',
                    position: 'insideBottom',
                    offset: -7,
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 12,
                  }}
                />
                <YAxis
                  width={58}
                  tickFormatter={(value) => `${formatNumber(Number(value))} €`}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(Number(value)),
                    name,
                  ]}
                  labelFormatter={(value) => `${formatNumber(Number(value))} days`}
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 6,
                    color: 'hsl(var(--foreground))',
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: 13,
                  }}
                  itemStyle={{ padding: 0 }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={34}
                  iconType="plainline"
                  wrapperStyle={{
                    color: 'hsl(var(--muted-foreground))',
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: 12,
                  }}
                />
                <ReferenceLine
                  x={model.optimalInterval}
                  stroke="hsl(var(--foreground))"
                  strokeDasharray="4 4"
                  strokeOpacity={0.45}
                />
                <ReferenceDot
                  x={model.optimalInterval}
                  y={model.totalCost}
                  r={4}
                  fill="hsl(var(--foreground))"
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="clothes"
                  name="Clothes"
                  stroke="#d97745"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="washing"
                  name="Washing"
                  stroke="#2a9d8f"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 border-y border-border sm:grid-cols-4">
        <ResultMetric label="Washing interval" value={`${formatNumber(model.optimalInterval)} days`} />
        <ResultMetric
          label="Wardrobe size"
          value={`${formatNumber(model.optimalWardrobe)} items`}
          className="border-l border-border"
        />
        <ResultMetric
          label="Expected washes"
          value={formatNumber(model.washes)}
          className="border-t border-border sm:border-l sm:border-t-0"
        />
        <ResultMetric
          label="Total cost"
          value={formatCurrency(model.totalCost)}
          className="border-l border-t border-border sm:border-t-0"
        />
      </div>

      <div className="mt-4 flex flex-col gap-1 text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:text-base">
        <span className="font-semibold text-foreground">Practical integer choice</span>
        <span className="text-muted-foreground sm:text-right">
          {model.practical.wardrobe} items · wash every {formatNumber(model.practical.interval)} days ·{' '}
          {formatNumber(model.practical.washes)} washes · {formatCurrency(model.practical.totalCost)}
        </span>
      </div>
    </section>
  );
};

export default LaundryModelPlayground;
