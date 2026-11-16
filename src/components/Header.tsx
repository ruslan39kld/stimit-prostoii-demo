import React from 'react';
import { SCENARIOS } from '../data/scenarios';

interface HeaderProps {
  activeScenarioId: string | null;
  onGoHome: () => void;
  onSelectScenario: (scenarioId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScenarioId,
  onGoHome,
  onSelectScenario,
}) => {
  return (
    <header className="stimit-gradient text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={onGoHome}
          className="text-left text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
        >
          AI-анализ простоев (OEE)
        </button>

        <nav
          aria-label="Навигация по сценариям"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80"
        >
          <button
            type="button"
            onClick={onGoHome}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
              activeScenarioId === null
                ? 'text-white border-white'
                : 'border-transparent hover:text-white hover:border-white/40'
            }`}
          >
            Обзор
          </button>
          {SCENARIOS.map((sc) => {
            const isActive = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectScenario(sc.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                  isActive
                    ? 'text-white border-white'
                    : 'border-transparent hover:text-white hover:border-white/40'
                }`}
              >
                Сценарий {sc.number}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          {activeScenarioId === null ? (
            <button
              type="button"
              onClick={() => onSelectScenario('scenario-1')}
              className="px-4 py-2 text-sm font-semibold text-[#1B3A6B] bg-white rounded-lg hover:bg-slate-100 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Смотреть пример
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoHome}
              className="px-4 py-2 text-sm font-semibold text-white bg-white/12 border border-white/25 rounded-lg hover:bg-white/20 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              На главную
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
