import React, { useState } from 'react';
import { Send, ArrowRight, Info } from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';

interface FreeQuestionBarProps {
  onSelectScenario: (scenarioId: string) => void;
}

export const FreeQuestionBar: React.FC<FreeQuestionBarProps> = ({
  onSelectScenario,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setSubmittedQuery(trimmed);
    setInputValue('');
  };

  return (
    <section
      aria-label="Поле свободного вопроса"
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <label htmlFor="free-question-input" className="sr-only">
          Написать свой вопрос
        </label>
        <input
          id="free-question-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Написать свой вопрос…"
          className="flex-1 min-w-0 h-11 px-4 text-sm sm:text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/15 transition-colors"
        />
        <button
          type="submit"
          className="h-11 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1B3A6B] rounded-lg hover:bg-[#142D54] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2"
        >
          <span>Отправить</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

      {submittedQuery !== null && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 pt-4 border-t border-slate-200"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#1B3A6B] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-1">
                Ваш запрос: «{submittedQuery}»
              </p>
              <p className="text-sm sm:text-base font-medium text-slate-900">
                Это демо-стенд: показан сценарий работы системы на готовых данных. Выбери один из примеров ниже
              </p>

              <div className="mt-3 flex flex-wrap gap-2.5">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setSubmittedQuery(null);
                      onSelectScenario(sc.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1B3A6B] bg-[#1B3A6B]/8 border border-[#1B3A6B]/20 rounded-lg hover:bg-[#1B3A6B] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>
                      Сценарий {sc.number}: {sc.cardTitle}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
