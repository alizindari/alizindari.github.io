import { useDeferredValue, useMemo, useState } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LaundryParameterControl from './LaundryParameterControl';

interface SimulatorParameters {
  horizon: number;
  price: number;
  dailyUse: number;
  dryingTime: number;
  capacity: number;
  visitCost: number;
  loadCost: number;
  availability: number;
  failedCheckCost: number;
  shortageCost: number;
}

interface CycleTrial {
  baseCost: number;
  requirements: number[];
  washes: number;
  loads: number;
  failedChecks: number;
}

interface PolicySummary {
  wardrobe: number;
  interval: number;
  meanCost: number;
  runOutRisk: number;
}

interface DetailedOutcome {
  totalCost: number;
  washes: number;
  loads: number;
  failedChecks: number;
  shortageUnits: number;
  ranOut: boolean;
}

const DEFAULTS: SimulatorParameters = {
  horizon: 365,
  price: 20,
  dailyUse: 1,
  dryingTime: 2,
  capacity: 8,
  visitCost: 3.75,
  loadCost: 1.25,
  availability: 70,
  failedCheckCost: 1.5,
  shortageCost: 60,
};

const OPTIMIZATION_RUNS = 220;
const DETAIL_RUNS = 400;

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const formatNumber = (value: number) => numberFormatter.format(value);
const formatCurrency = (value: number) => `${formatNumber(value)} €`;
const formatPercent = (value: number) => `${formatNumber(value)}%`;

const createRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const mixSeed = (seed: number, interval: number, run: number, salt = 0) => {
  const mixed =
    seed ^
    Math.imul(interval + 1, 0x9e3779b1) ^
    Math.imul(run + 1, 0x85ebca6b) ^
    salt;
  return mixed >>> 0;
};

const sampleFailedChecks = (random: () => number, availability: number) => {
  if (availability >= 1) return 0;
  const draw = Math.max(Number.EPSILON, 1 - random());
  return Math.floor(Math.log(draw) / Math.log(1 - availability));
};

const generateCycleTrial = (
  parameters: SimulatorParameters,
  interval: number,
  random: () => number,
): CycleTrial => {
  const availability = parameters.availability / 100;
  const requirements: number[] = [];
  let elapsed = 0;
  let baseCost = 0;
  let washes = 0;
  let loads = 0;
  let failedChecks = 0;

  while (elapsed < parameters.horizon) {
    const failures = sampleFailedChecks(random, availability);
    const cycleLength = interval + failures;
    const remaining = parameters.horizon - elapsed;
    const observedLength = Math.min(cycleLength, remaining);

    requirements.push(parameters.dailyUse * (observedLength + parameters.dryingTime));

    if (cycleLength > remaining) {
      const attemptsBeforeHorizon = Math.max(0, Math.ceil(remaining - interval));
      const observedFailures = Math.min(failures, attemptsBeforeHorizon);
      baseCost += parameters.failedCheckCost * observedFailures;
      failedChecks += observedFailures;
      break;
    }

    const cycleLoads = Math.ceil(
      (parameters.dailyUse * cycleLength) / parameters.capacity,
    );
    baseCost +=
      parameters.visitCost +
      parameters.loadCost * cycleLoads +
      parameters.failedCheckCost * failures;
    washes += 1;
    loads += cycleLoads;
    failedChecks += failures;
    elapsed += cycleLength;
  }

  return { baseCost, requirements, washes, loads, failedChecks };
};

const evaluateTrial = (
  parameters: SimulatorParameters,
  wardrobe: number,
  trial: CycleTrial,
): DetailedOutcome => {
  let shortageUnits = 0;

  trial.requirements.forEach((requiredItems) => {
    shortageUnits += Math.max(0, requiredItems - wardrobe);
  });

  return {
    totalCost:
      parameters.price * wardrobe +
      trial.baseCost +
      parameters.shortageCost * shortageUnits,
    washes: trial.washes,
    loads: trial.loads,
    failedChecks: trial.failedChecks,
    shortageUnits,
    ranOut: shortageUnits > 0,
  };
};

const quantile = (sortedValues: number[], probability: number) => {
  const position = (sortedValues.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
};

const buildHistogram = (values: number[], binCount = 12) => {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const width = maximum === minimum ? 1 : (maximum - minimum) / binCount;
  const bins = Array.from({ length: binCount }, (_, index) => ({
    midpoint: minimum + width * (index + 0.5),
    count: 0,
  }));

  values.forEach((value) => {
    const index = Math.min(binCount - 1, Math.floor((value - minimum) / width));
    bins[index].count += 1;
  });

  return bins;
};

const runSimulation = (parameters: SimulatorParameters, seed: number) => {
  const availability = parameters.availability / 100;
  const baselineInterval = Math.sqrt(
    ((parameters.visitCost + parameters.loadCost) * parameters.horizon) /
      (parameters.price * parameters.dailyUse),
  );
  const maximumInterval = Math.min(
    50,
    Math.max(
      21,
      Math.ceil((3 * parameters.capacity) / parameters.dailyUse),
      Math.ceil(2.2 * baselineInterval),
    ),
  );
  const tailBuffer = availability >= 1
    ? 3
    : Math.ceil(Math.log(0.001) / Math.log(1 - availability)) + 1;
  const maximumBufferDays = Math.min(20, Math.max(6, tailBuffer));
  const policiesByInterval = new Map<number, PolicySummary[]>();
  let recommendation: PolicySummary | null = null;

  for (let interval = 1; interval <= maximumInterval; interval += 1) {
    const minimumWardrobe = Math.ceil(
      parameters.dailyUse * (interval + parameters.dryingTime),
    );
    const maximumWardrobe =
      minimumWardrobe + Math.ceil(parameters.dailyUse * maximumBufferDays);
    const candidateCount = maximumWardrobe - minimumWardrobe + 1;
    const costSums = Array(candidateCount).fill(0);
    const runOutCounts = Array(candidateCount).fill(0);

    for (let run = 0; run < OPTIMIZATION_RUNS; run += 1) {
      const random = createRandom(mixSeed(seed, interval, run));
      const trial = generateCycleTrial(parameters, interval, random);

      for (let index = 0; index < candidateCount; index += 1) {
        const wardrobe = minimumWardrobe + index;
        const outcome = evaluateTrial(parameters, wardrobe, trial);
        costSums[index] += outcome.totalCost;
        if (outcome.ranOut) runOutCounts[index] += 1;
      }
    }

    const intervalPolicies: PolicySummary[] = [];

    for (let index = 0; index < candidateCount; index += 1) {
      const summary: PolicySummary = {
        wardrobe: minimumWardrobe + index,
        interval,
        meanCost: costSums[index] / OPTIMIZATION_RUNS,
        runOutRisk: (100 * runOutCounts[index]) / OPTIMIZATION_RUNS,
      };
      intervalPolicies.push(summary);

      if (
        !recommendation ||
        summary.meanCost < recommendation.meanCost ||
        (summary.meanCost === recommendation.meanCost &&
          summary.runOutRisk < recommendation.runOutRisk)
      ) {
        recommendation = summary;
      }
    }

    policiesByInterval.set(interval, intervalPolicies);
  }

  if (!recommendation) {
    throw new Error('The simulator could not evaluate a policy.');
  }

  const outcomes = Array.from({ length: DETAIL_RUNS }, (_, run) => {
    const random = createRandom(
      mixSeed(seed, recommendation.interval, run, 0x27d4eb2d),
    );
    const trial = generateCycleTrial(parameters, recommendation.interval, random);
    return evaluateTrial(parameters, recommendation.wardrobe, trial);
  });
  const costs = outcomes.map((outcome) => outcome.totalCost).sort((a, b) => a - b);
  const average = (selector: (outcome: DetailedOutcome) => number) =>
    outcomes.reduce((sum, outcome) => sum + selector(outcome), 0) / outcomes.length;
  const detailedRisk =
    (100 * outcomes.filter((outcome) => outcome.ranOut).length) / outcomes.length;
  const bufferDays = Math.max(
    0,
    Math.floor(
      recommendation.wardrobe / parameters.dailyUse -
        recommendation.interval -
        parameters.dryingTime,
    ),
  );
  const frontier = (policiesByInterval.get(recommendation.interval) ?? [])
    .map((policy) => ({
      wardrobe: policy.wardrobe,
      cost: policy.meanCost,
      risk: policy.runOutRisk,
      interval: policy.interval,
    }));

  return {
    recommendation,
    frontier,
    histogram: buildHistogram(costs),
    details: {
      meanCost: average((outcome) => outcome.totalCost),
      lowerCost: quantile(costs, 0.05),
      upperCost: quantile(costs, 0.95),
      runOutRisk: detailedRisk,
      averageWashes: average((outcome) => outcome.washes),
      averageLoads: average((outcome) => outcome.loads),
      averageFailedChecks: average((outcome) => outcome.failedChecks),
      averageShortage: average((outcome) => outcome.shortageUnits),
      bufferDays,
    },
  };
};

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

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 6,
  color: 'hsl(var(--foreground))',
  fontFamily: "'Times New Roman', Times, serif",
  fontSize: 13,
};

const LaundryStochasticSimulator = () => {
  const [parameters, setParameters] = useState<SimulatorParameters>({ ...DEFAULTS });
  const [seed, setSeed] = useState(20260809);
  const deferredParameters = useDeferredValue(parameters);
  const simulation = useMemo(
    () => runSimulation(deferredParameters, seed),
    [deferredParameters, seed],
  );
  const isUpdating = deferredParameters !== parameters;

  const updateParameter =
    (key: keyof SimulatorParameters) => (value: number) => {
      setParameters((current) => ({ ...current, [key]: value }));
    };

  const resetSimulator = () => {
    setParameters({ ...DEFAULTS });
    setSeed(20260809);
  };

  return (
    <section className="mt-10 border-t border-border pt-8 sm:mt-12 sm:pt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Full stochastic simulator
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Random availability, capacity, drying, and costs in one model.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setSeed((current) => current + 1)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            title="Run a new random sample"
          >
            <RefreshCw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Rerun</span>
          </button>
          <button
            type="button"
            onClick={resetSimulator}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            title="Reset simulator"
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 xl:grid-cols-[18.5rem_minmax(0,1fr)] xl:gap-0">
        <div className="space-y-7 xl:border-r xl:border-border xl:pr-7">
          <div className="space-y-5">
            <h3 className="border-b border-border pb-2 text-base font-semibold text-foreground">
              Wardrobe and use
            </h3>
            <LaundryParameterControl
              id="sim-horizon"
              label="Time horizon"
              value={parameters.horizon}
              min={90}
              max={730}
              step={5}
              unit="days"
              onChange={updateParameter('horizon')}
            />
            <LaundryParameterControl
              id="sim-price"
              label="Price per item"
              value={parameters.price}
              min={5}
              max={100}
              step={1}
              unit="€"
              onChange={updateParameter('price')}
            />
            <LaundryParameterControl
              id="sim-daily-use"
              label="Daily use"
              value={parameters.dailyUse}
              min={1}
              max={3}
              step={1}
              unit="items"
              onChange={updateParameter('dailyUse')}
            />
            <LaundryParameterControl
              id="sim-drying-time"
              label="Drying time"
              value={parameters.dryingTime}
              min={0}
              max={7}
              step={0.5}
              unit="days"
              onChange={updateParameter('dryingTime')}
            />
          </div>

          <div className="space-y-5">
            <h3 className="border-b border-border pb-2 text-base font-semibold text-foreground">
              Laundry
            </h3>
            <LaundryParameterControl
              id="sim-capacity"
              label="Load capacity"
              value={parameters.capacity}
              min={4}
              max={20}
              step={1}
              unit="items"
              onChange={updateParameter('capacity')}
            />
            <LaundryParameterControl
              id="sim-visit-cost"
              label="Successful visit"
              value={parameters.visitCost}
              min={0}
              max={15}
              step={0.25}
              unit="€"
              onChange={updateParameter('visitCost')}
            />
            <LaundryParameterControl
              id="sim-load-cost"
              label="Cost per load"
              value={parameters.loadCost}
              min={0.25}
              max={10}
              step={0.25}
              unit="€"
              onChange={updateParameter('loadCost')}
            />
          </div>

          <div className="space-y-5">
            <h3 className="border-b border-border pb-2 text-base font-semibold text-foreground">
              Uncertainty
            </h3>
            <LaundryParameterControl
              id="sim-availability"
              label="Machine availability"
              value={parameters.availability}
              min={30}
              max={100}
              step={5}
              unit="%"
              onChange={updateParameter('availability')}
            />
            <LaundryParameterControl
              id="sim-failed-cost"
              label="Failed check"
              value={parameters.failedCheckCost}
              min={0}
              max={10}
              step={0.25}
              unit="€"
              onChange={updateParameter('failedCheckCost')}
            />
            <LaundryParameterControl
              id="sim-shortage-cost"
              label="Shortage per item"
              value={parameters.shortageCost}
              min={5}
              max={150}
              step={5}
              unit="€"
              onChange={updateParameter('shortageCost')}
            />
          </div>
        </div>

        <div className={`min-w-0 transition-opacity xl:pl-7 ${isUpdating ? 'opacity-65' : ''}`}>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-base font-semibold text-foreground sm:text-lg">
              Recommended policy
            </h3>
            <span className="text-xs text-muted-foreground sm:text-sm">
              {isUpdating ? 'Updating…' : `${OPTIMIZATION_RUNS} runs per policy`}
            </span>
          </div>

          <div
            className="mt-3 grid grid-cols-2 border-y border-border sm:grid-cols-4"
            aria-live="polite"
          >
            <ResultMetric
              label="Wardrobe"
              value={`${simulation.recommendation.wardrobe} items`}
            />
            <ResultMetric
              label="Planned interval"
              value={`${simulation.recommendation.interval} days`}
              className="border-l border-border"
            />
            <ResultMetric
              label="Mean total cost"
              value={formatCurrency(simulation.details.meanCost)}
              className="border-t border-border sm:border-l sm:border-t-0"
            />
            <ResultMetric
              label="Run-out chance"
              value={formatPercent(simulation.details.runOutRisk)}
              className="border-l border-t border-border sm:border-t-0"
            />
          </div>

          <div className="mt-4 text-sm text-muted-foreground sm:text-base">
            This policy keeps a buffer for about{' '}
            <span className="font-semibold text-foreground">
              {simulation.details.bufferDays} failed days
            </span>
            .
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-2">
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                  Cost and shortage risk
                </h3>
                <span className="text-xs text-muted-foreground">
                  interval: {simulation.recommendation.interval} days
                </span>
              </div>
              <div
                className="mt-3 h-[300px] w-full"
                role="img"
                aria-label="Expected cost and run-out probability by wardrobe size"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={simulation.frontier}
                    margin={{ top: 8, right: 3, bottom: 12, left: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="hsl(var(--border))"
                      strokeDasharray="3 5"
                    />
                    <XAxis
                      dataKey="wardrobe"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      label={{
                        value: 'Wardrobe size',
                        position: 'insideBottom',
                        offset: -7,
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      yAxisId="cost"
                      width={55}
                      tickFormatter={(value) => `${Math.round(Number(value))} €`}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="risk"
                      orientation="right"
                      width={38}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${Math.round(Number(value))}%`}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'Run-out risk'
                          ? formatPercent(Number(value))
                          : formatCurrency(Number(value)),
                        name,
                      ]}
                      labelFormatter={(value) => `${value} items`}
                      contentStyle={tooltipStyle}
                      itemStyle={{ padding: 0 }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      height={32}
                      iconType="plainline"
                      wrapperStyle={{
                        color: 'hsl(var(--muted-foreground))',
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: 11,
                      }}
                    />
                    <ReferenceLine
                      yAxisId="cost"
                      x={simulation.recommendation.wardrobe}
                      stroke="hsl(var(--foreground))"
                      strokeDasharray="4 4"
                      strokeOpacity={0.45}
                    />
                    <Line
                      yAxisId="cost"
                      type="monotone"
                      dataKey="cost"
                      name="Expected cost"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="risk"
                      type="monotone"
                      dataKey="risk"
                      name="Run-out risk"
                      stroke="#d97745"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3 }}
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-foreground sm:text-lg">
                Cost distribution
              </h3>
              <div
                className="mt-3 h-[300px] w-full"
                role="img"
                aria-label="Distribution of total simulated costs for the recommended policy"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={simulation.histogram}
                    margin={{ top: 40, right: 5, bottom: 12, left: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="hsl(var(--border))"
                      strokeDasharray="3 5"
                    />
                    <XAxis
                      dataKey="midpoint"
                      interval={2}
                      tickFormatter={(value) => `${Math.round(Number(value))} €`}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      label={{
                        value: 'Total cost',
                        position: 'insideBottom',
                        offset: -7,
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      width={34}
                      allowDecimals={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatNumber(Number(value)), 'Runs']}
                      labelFormatter={(value) => `around ${formatCurrency(Number(value))}`}
                      contentStyle={tooltipStyle}
                      itemStyle={{ padding: 0 }}
                    />
                    <Bar
                      dataKey="count"
                      name="Runs"
                      fill="#2a9d8f"
                      radius={[3, 3, 0, 0]}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 border-y border-border sm:grid-cols-4">
            <ResultMetric
              label="90% cost range"
              value={`${formatNumber(simulation.details.lowerCost)}–${formatCurrency(simulation.details.upperCost)}`}
            />
            <ResultMetric
              label="Successful washes"
              value={formatNumber(simulation.details.averageWashes)}
              className="border-l border-border"
            />
            <ResultMetric
              label="Machine loads"
              value={formatNumber(simulation.details.averageLoads)}
              className="border-t border-border sm:border-l sm:border-t-0"
            />
            <ResultMetric
              label="Failed checks"
              value={formatNumber(simulation.details.averageFailedChecks)}
              className="border-l border-t border-border sm:border-t-0"
            />
          </div>

          {simulation.details.averageShortage > 0 && (
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Average shortage: {formatNumber(simulation.details.averageShortage)} items over the
              horizon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LaundryStochasticSimulator;
