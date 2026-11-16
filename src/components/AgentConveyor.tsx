import React from 'react';
import { Check, Loader2, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AGENTS, AgentId } from '../data/scenarios';

interface AgentConveyorProps {
  mode: 'idle' | 'step' | 'final';
  activeAgentId?: AgentId;
}

export const AgentConveyor: React.FC<AgentConveyorProps> = ({
  mode,
  activeAgentId,
}) => {
  const activeIndex = activeAgentId
    ? AGENTS.findIndex((a) => a.id === activeAgentId)
    : -1;

  return (
    <section
      aria-label="Конвейер шести агентов анализа"
      className="stimit-gradient rounded-xl p-4 sm:p-5 text-white shadow-sm border border-[#1B3A6B]/30"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
          Конвейер агентной системы (6 этапов)
        </span>
        <span className="text-xs text-white/75 font-mono tabular-nums">
          {mode === 'idle'
            ? 'Все агенты в режиме ожидания'
            : mode === 'final'
              ? '6 / 6 этапов завершено'
              : `Этап ${activeIndex + 1} из 6`}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {AGENTS.map((agent, index) => {
          let status: 'waiting' | 'working' | 'done' = 'waiting';

          if (mode === 'final') {
            status = 'done';
          } else if (mode === 'step' && activeIndex >= 0) {
            if (index < activeIndex) status = 'done';
            else if (index === activeIndex) status = 'working';
            else status = 'waiting';
          }

          const isWorking = status === 'working';
          const isDone = status === 'done';
          const isFinalReporter = mode === 'final' && index === AGENTS.length - 1;

          return (
            <motion.div
              key={agent.id}
              initial={false}
              animate={{
                scale: isWorking || isFinalReporter ? 1.01 : 1,
                opacity: status === 'waiting' && mode !== 'idle' ? 0.68 : 1,
              }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-lg px-3 py-2.5 border transition-colors ${
                isWorking
                  ? 'bg-white text-[#0F172A] border-white shadow-md'
                  : isDone
                    ? 'bg-white/14 text-white border-white/25'
                    : 'bg-white/6 text-white/85 border-white/12'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <span
                  className={`font-mono text-[11px] font-semibold tabular-nums ${
                    isWorking ? 'text-[#1B3A6B]' : 'text-white/70'
                  }`}
                >
                  0{agent.order}
                </span>

                <span className="shrink-0">
                  {isDone && (
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300"
                      aria-label="Завершено"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}
                  {isWorking && (
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1B3A6B]/10 text-[#1B3A6B]"
                      aria-label="Работает"
                    >
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </span>
                  )}
                  {status === 'waiting' && (
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/60"
                      aria-label="Ожидает"
                    >
                      <Clock className="w-3 h-3" />
                    </span>
                  )}
                </span>
              </div>

              <div
                className={`text-sm font-bold leading-snug truncate ${
                  isWorking ? 'text-[#0F172A]' : 'text-white'
                }`}
              >
                {agent.name}
              </div>

              <div
                className={`text-[11px] mt-0.5 font-medium flex items-center gap-1 ${
                  isWorking
                    ? 'text-[#1B3A6B]'
                    : isDone
                      ? 'text-emerald-200'
                      : 'text-white/65'
                }`}
              >
                <span>
                  {isWorking
                    ? 'работает'
                    : isDone
                      ? isFinalReporter
                        ? 'отчёт готов'
                        : 'готово'
                      : 'ожидает'}
                </span>
              </div>

              {index < AGENTS.length - 1 && (
                <ChevronRight
                  aria-hidden="true"
                  className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 z-10 pointer-events-none"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
