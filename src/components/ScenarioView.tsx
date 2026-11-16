import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MessageSquareText,
  Search,
  ListChecks,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scenario,
  SCENARIOS,
  PriorityOption,
  AGENTS,
} from '../data/scenarios';
import { AgentConveyor } from './AgentConveyor';
import { OeeCard } from './OeeCard';
import { AnimatedCounter } from './AnimatedCounter';

interface ScenarioViewProps {
  scenario: Scenario;
  onGoHome: () => void;
  onSelectScenario: (scenarioId: string) => void;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  scenario,
  onGoHome,
  onSelectScenario,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [altCommentOpen, setAltCommentOpen] = useState(false);
  const [handoffBanner, setHandoffBanner] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<PriorityOption | null>(
    null
  );
  const [showOtherScenarios, setShowOtherScenarios] = useState(false);

  // Reset state whenever scenario changes
  useEffect(() => {
    setStepIndex(0);
    setAltCommentOpen(false);
    setHandoffBanner(null);
    setSelectedOption(null);
    setShowOtherScenarios(false);
  }, [scenario.id]);

  const currentStep = scenario.steps[stepIndex];
  const currentAgent = AGENTS.find((a) => a.id === currentStep.agentId);

  const handleAdvance = (handoff?: string) => {
    setAltCommentOpen(false);
    setHandoffBanner(handoff ?? null);
    setStepIndex((prev) => Math.min(prev + 1, scenario.steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrioritySelect = (option: PriorityOption) => {
    setSelectedOption(option);
    setAltCommentOpen(false);
    setHandoffBanner(null);
    setStepIndex((prev) => Math.min(prev + 1, scenario.steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackStep = () => {
    if (stepIndex === 0) return;
    setAltCommentOpen(false);
    setHandoffBanner(null);
    setShowOtherScenarios(false);
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const otherScenarios = SCENARIOS.filter((s) => s.id !== scenario.id);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Scenario Meta & Step Indicator */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-500">
            Сценарий {scenario.number} · Роль: {scenario.role}
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5 truncate">
            {scenario.cardTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={handleBackStep}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Назад</span>
            </button>
          )}
          <div className="px-3.5 py-1.5 rounded-lg bg-[#1B3A6B]/8 border border-[#1B3A6B]/20 text-[#1B3A6B] font-mono text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap">
            Шаг {stepIndex + 1} из {scenario.totalSteps}
          </div>
        </div>
      </div>

      {/* 6-Agent Conveyor */}
      <AgentConveyor
        mode={currentStep.kind === 'final_report' ? 'final' : 'step'}
        activeAgentId={currentStep.agentId}
      />

      {/* Handoff notice from previous agent if present */}
      {handoffBanner && (
        <div
          role="status"
          className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm font-medium text-emerald-900"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{handoffBanner}</span>
        </div>
      )}

      {/* Main Step Workspace Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${scenario.id}-step-${stepIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 space-y-6"
        >
          {/* Active Agent Header */}
          {currentStep.kind !== 'final_report' && currentAgent && (
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs font-medium text-slate-500">
                  Активный агент · Шаг {stepIndex + 1} из {scenario.totalSteps}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B3A6B] mt-0.5">
                  {currentAgent.name}
                </h2>
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                {currentAgent.subtitle}
              </div>
            </div>
          )}

          {/* STEP KIND: INTAKE */}
          {currentStep.kind === 'intake' && (
            <div className="space-y-5">
              <div className="bg-[#1B3A6B]/5 border border-[#1B3A6B]/15 rounded-lg px-4 py-3 text-sm sm:text-base font-semibold text-[#1B3A6B]">
                {currentStep.statusPanelText}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Данные смены
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentStep.shiftFields.map((field) => (
                    <div
                      key={field.label}
                      className={`rounded-lg px-4 py-3 border ${
                        field.highlight
                          ? 'bg-slate-50 border-slate-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="text-xs font-medium text-slate-500">
                        {field.label}
                      </div>
                      <div className="mt-1 text-sm sm:text-[15px] font-semibold text-slate-900 tabular-nums">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP KIND: COMPLETENESS CHECK */}
          {currentStep.kind === 'completeness' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-base sm:text-lg font-bold text-amber-950">
                    {currentStep.panelText}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1.5">
                    <span>Полнота входных данных</span>
                    <span className="font-mono tabular-nums">
                      {currentStep.fieldsFilled} из {currentStep.fieldsTotal} полей
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-amber-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full"
                      style={{
                        width: `${(currentStep.fieldsFilled / currentStep.fieldsTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-sm text-amber-900 pt-1">
                  <span className="font-semibold">Требуется уточнение:</span>{' '}
                  {currentStep.missingField}
                </div>
              </div>
            </div>
          )}

          {/* STEP KIND: CLASSIFIER */}
          {currentStep.kind === 'classifier' && (
            <div className="space-y-5">
              {currentStep.introPanel && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3.5 text-sm sm:text-base font-medium text-amber-950">
                  {currentStep.introPanel}
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Простои по группам
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-4">Группа простоев</th>
                        <th className="py-3 px-4 text-right">Время</th>
                        <th className="py-3 px-4 text-right hidden sm:table-cell">
                          Доля простоев
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {currentStep.rows.map((row) => (
                        <tr key={row.group} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {row.group}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                            {row.minutes} мин
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums hidden sm:table-cell">
                            {row.sharePercent !== undefined
                              ? `${row.sharePercent}%`
                              : '—'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold text-slate-900">
                        <td className="py-3 px-4">Итого простоев</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                          {currentStep.totalMinutes} мин
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums hidden sm:table-cell">
                          100%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {currentStep.extraNote && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-800">
                  {currentStep.extraNote}
                </div>
              )}

              {currentStep.confirmationQuestion && (
                <div className="bg-[#1B3A6B]/5 border border-[#1B3A6B]/20 rounded-lg px-4 py-3.5 text-sm sm:text-base font-bold text-[#1B3A6B]">
                  {currentStep.confirmationQuestion}
                </div>
              )}
            </div>
          )}

          {/* STEP KIND: ACCOUNTANT (OEE) */}
          {currentStep.kind === 'accountant' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Расчёт OEE (общая эффективность оборудования)
              </h3>
              <OeeCard oee={currentStep.oee} />
            </div>
          )}

          {/* STEP KIND: ECONOMIST + PRIORITY CHOICE */}
          {currentStep.kind === 'economist_choice' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Потери в деньгах
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-4">Статья потерь</th>
                        <th className="py-3 px-4">Расчёт</th>
                        <th className="py-3 px-4 text-right">Сумма</th>
                        <th className="py-3 px-4 text-right">Доля</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {currentStep.losses.map((loss) => (
                        <tr key={loss.reason} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {loss.reason}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs sm:text-sm text-slate-600 tabular-nums">
                            {loss.calculation}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {loss.rublesText}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                            {loss.sharePercent}%
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[#1B3A6B]/5 font-bold text-slate-900">
                        <td className="py-3.5 px-4" colSpan={2}>
                          Итого потери смены (пересчёт на 22 смены: {currentStep.totalMonthText})
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-base sm:text-lg text-[#1B3A6B] tabular-nums whitespace-nowrap">
                          {currentStep.totalShiftText}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                          100%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mt-2.5 text-xs text-slate-500">
                  {currentStep.constantsNote}
                </p>

                {currentStep.highlightLine && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm font-bold text-red-900">
                    {currentStep.highlightLine}
                  </div>
                )}
              </div>

              {/* Detective Hint alongside Economist */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <Search className="w-5 h-5 text-[#1B3A6B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#1B3A6B]">
                    Подсказка Детектива (Парето)
                  </div>
                  <p className="mt-1 text-sm sm:text-base font-medium text-slate-800">
                    {currentStep.detectiveHint}
                  </p>
                </div>
              </div>

              {/* Priority Selection */}
              <div className="pt-2 border-t border-slate-200">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-3">
                  {currentStep.question}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {currentStep.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handlePrioritySelect(opt)}
                      className="w-full text-left px-4 sm:px-5 py-4 rounded-xl border border-slate-200 bg-white hover:border-[#1B3A6B] hover:bg-[#1B3A6B]/[0.03] active:scale-[0.995] transition-all flex items-center justify-between gap-4 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-[#1B3A6B]/10 text-[#1B3A6B] font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-[#1B3A6B] group-hover:text-white transition-colors">
                          {opt.codeLabel}
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-slate-900">
                          {opt.label}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1B3A6B] shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP KIND: FINAL REPORT */}
          {currentStep.kind === 'final_report' && (
            <div className="space-y-7">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    Детектив и Докладчик · Итоговый отчёт смены
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                    Итог анализа
                  </h2>
                </div>

                {selectedOption && (
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Ваш выбор приоритета</div>
                    <div className="text-sm font-bold text-slate-900">
                      {selectedOption.codeLabel}: {selectedOption.label}
                    </div>
                  </div>
                )}
              </div>

              {/* Priority Verdict Card */}
              {selectedOption && (
                <div
                  className={`rounded-xl border p-5 ${
                    selectedOption.isOptimal
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {selectedOption.isOptimal ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
                      )}
                      <span className="text-lg font-extrabold">
                        {selectedOption.verdict}
                      </span>
                    </div>
                    <div className="font-mono text-sm sm:text-base font-extrabold tabular-nums">
                      Оценка разбора: {selectedOption.score}
                    </div>
                  </div>
                  <p className="mt-2.5 text-sm sm:text-base font-medium leading-relaxed">
                    {selectedOption.feedbackText}
                  </p>
                </div>
              )}

              {/* Animated Financial Loss Counter */}
              <div className="stimit-gradient text-white rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/75">
                    Потери за смену
                  </div>
                  <div className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
                    <AnimatedCounter target={currentStep.totalShiftRubles} />
                    <span className="text-lg sm:text-xl font-semibold text-white/85 ml-2">
                      за смену
                    </span>
                  </div>
                </div>

                <div className="sm:border-l sm:border-white/20 sm:pl-6">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/75">
                    В пересчёте на месяц (22 смены)
                  </div>
                  <div className="mt-1 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums">
                    {currentStep.totalMonthText}
                  </div>
                </div>
              </div>

              {/* OEE Summary Card */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Карточка OEE
                </h3>
                <OeeCard oee={currentStep.oee} compactSummary />
              </div>

              {/* Money Losses Table */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Таблица потерь в деньгах
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-4">Причина</th>
                        <th className="py-3 px-4">Объём / минуты</th>
                        <th className="py-3 px-4 text-right">Рубли</th>
                        <th className="py-3 px-4 text-right">Доля %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {currentStep.losses.map((loss) => (
                        <tr key={loss.reason} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {loss.reason}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                            {loss.volume}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {loss.rublesText}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">
                            {loss.sharePercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Main Money Drain One-liner */}
              <div className="bg-[#1B3A6B]/6 border border-[#1B3A6B]/20 rounded-xl px-5 py-4">
                <p className="text-base sm:text-lg font-extrabold text-[#1B3A6B]">
                  {currentStep.mainMoneyDrain}
                </p>
              </div>

              {/* Top-3 Actions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks className="w-5 h-5 text-[#1B3A6B]" />
                  <h3 className="text-base font-bold text-slate-900">
                    Топ-3 действия
                  </h3>
                </div>
                <ol className="space-y-2.5">
                  {currentStep.topActions.map((action, idx) => (
                    <li
                      key={action}
                      className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3"
                    >
                      <span className="w-6 h-6 rounded-md bg-[#1B3A6B] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="text-sm sm:text-base font-medium text-slate-900">
                        {action}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Final Navigation Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOtherScenarios((prev) => !prev)}
                    className="flex-1 py-3.5 px-6 inline-flex items-center justify-center gap-2 text-base font-bold text-white bg-[#1B3A6B] rounded-lg hover:bg-[#142D54] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <span>Пройти другой сценарий</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onGoHome}
                    className="py-3.5 px-6 inline-flex items-center justify-center gap-2 text-base font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Вернуться на главную</span>
                  </button>
                </div>

                {showOtherScenarios && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="text-xs font-semibold text-slate-500">
                      Доступные сценарии для разбора:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {otherScenarios.map((other) => (
                        <button
                          key={other.id}
                          type="button"
                          onClick={() => onSelectScenario(other.id)}
                          className="text-left bg-white border border-slate-200 rounded-lg p-4 hover:border-[#1B3A6B] transition-colors cursor-pointer"
                        >
                          <div className="text-xs text-slate-500">
                            {other.cardMeta}
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            {other.cardTitle}
                          </div>
                          <div className="mt-1.5 text-xs font-semibold text-[#1B3A6B] inline-flex items-center gap-1">
                            <span>Разобрать</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Alternative Reply Agent Comment Box (keeps user on the exact same step) */}
          {altCommentOpen &&
            'alternativeReply' in currentStep &&
            currentStep.alternativeReply && (
              <div
                role="status"
                aria-live="polite"
                className="bg-slate-50 border border-slate-300 rounded-xl p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <MessageSquareText className="w-5 h-5 text-[#1B3A6B] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-[#1B3A6B]">
                      {currentStep.alternativeReply.agentName} отвечает на вопрос «
                      {currentStep.alternativeReply.label}»
                    </div>
                    <p className="mt-1.5 text-sm sm:text-base text-slate-900 leading-relaxed font-medium">
                      {currentStep.alternativeReply.response}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setAltCommentOpen(false)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Скрыть комментарий
                  </button>
                </div>
              </div>
            )}

          {/* Step Reply Buttons (Steps with primary + alternative replies) */}
          {'primaryReply' in currentStep && (
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleAdvance(
                    'handoffNote' in currentStep
                      ? currentStep.handoffNote
                      : undefined
                  )
                }
                className="flex-1 py-3.5 px-6 inline-flex items-center justify-center gap-2 text-base font-bold text-white bg-[#1B3A6B] rounded-lg hover:bg-[#142D54] active:scale-[0.99] transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2"
              >
                <span>{currentStep.primaryReply}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setAltCommentOpen(true)}
                className="py-3.5 px-5 inline-flex items-center justify-center text-sm sm:text-base font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                {currentStep.alternativeReply.label}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
