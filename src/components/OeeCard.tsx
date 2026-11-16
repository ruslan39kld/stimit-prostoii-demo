import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { OeeBreakdown } from '../data/scenarios';

interface OeeCardProps {
  oee: OeeBreakdown;
  compactSummary?: boolean;
}

export const OeeCard: React.FC<OeeCardProps> = ({
  oee,
  compactSummary = false,
}) => {
  const toneStyles =
    oee.tone === 'critical'
      ? {
          box: 'bg-red-50 border-red-200 text-red-900',
          accentText: 'text-red-700',
          barColor: 'bg-red-600',
          Icon: AlertTriangle,
        }
      : oee.tone === 'reserve'
        ? {
            box: 'bg-amber-50 border-amber-200 text-amber-950',
            accentText: 'text-amber-700',
            barColor: 'bg-amber-500',
            Icon: AlertCircle,
          }
        : {
            box: 'bg-emerald-50 border-emerald-200 text-emerald-950',
            accentText: 'text-emerald-700',
            barColor: 'bg-emerald-600',
            Icon: CheckCircle2,
          };

  const VerdictIcon = toneStyles.Icon;

  const factors = [
    {
      label: 'Доступность',
      percent: oee.availability.percent,
      detail: oee.availability.detail,
    },
    {
      label: 'Производительность',
      percent: oee.performance.percent,
      detail: oee.performance.detail,
    },
    {
      label: 'Качество',
      percent: oee.quality.percent,
      detail: oee.quality.detail,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {factors.map((f) => (
          <div
            key={f.label}
            className="bg-slate-50 border border-slate-200 rounded-lg p-4"
          >
            <div className="text-xs font-semibold text-slate-500">
              {f.label}
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
              {f.percent}%
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1B3A6B] rounded-full"
                style={{ width: `${f.percent}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-600">{f.detail}</div>
          </div>
        ))}
      </div>

      <div
        className={`border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${toneStyles.box}`}
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide opacity-75">
            Формула OEE
          </div>
          <div className="mt-1 font-mono text-sm sm:text-base font-semibold tabular-nums">
            {oee.availability.percent}% × {oee.performance.percent}% ×{' '}
            {oee.quality.percent}% ={' '}
            <span className="text-xl sm:text-2xl font-extrabold">
              {oee.totalPercent}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <VerdictIcon className={`w-6 h-6 shrink-0 ${toneStyles.accentText}`} />
          <div>
            <div className={`text-base sm:text-lg font-extrabold ${toneStyles.accentText}`}>
              {compactSummary ? oee.verdictSummary : oee.verdictTitle}
            </div>
            <div className="text-xs opacity-80">
              Шкала: ≥85% мировой уровень · 60–85% резерв · &lt;60% критично
            </div>
          </div>
        </div>
      </div>

      {oee.comment && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm sm:text-base font-medium text-slate-800">
          <span className="font-bold text-[#1B3A6B]">Счетовод:</span>{' '}
          {oee.comment}
        </div>
      )}
    </div>
  );
};
