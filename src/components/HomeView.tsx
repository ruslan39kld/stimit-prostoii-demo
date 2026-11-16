import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { AgentConveyor } from './AgentConveyor';

interface HomeViewProps {
  onStartScenario: (scenarioId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartScenario }) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <h1
            className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0F172A] leading-[1.15]"
            style={{ textWrap: 'balance' }}
          >
            Сколько денег потеряла твоя смена?
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
            Демо-стенд агентной системы AI-анализа простоев. Шесть агентов разбирают данные смены, считают OEE и показывают потери в рублях — где теряешь и что чинить первым.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Как смотреть: нажми &quot;Смотреть пример&quot; или выбери сценарий на карточках ниже
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => onStartScenario('scenario-1')}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold text-white bg-[#1B3A6B] rounded-lg hover:bg-[#142D54] active:scale-[0.99] transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2"
            >
              <span>Смотреть пример</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <AgentConveyor mode="idle" />

      <section aria-label="Готовые сценарии смены">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Выберите производственную смену для разбора
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {SCENARIOS.map((sc) => (
            <article
              key={sc.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-[#1B3A6B]/45 transition-colors"
            >
              <div>
                <div className="text-xs font-medium text-slate-500 mb-2">
                  {sc.cardMeta}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {sc.cardTitle}
                </h3>
                <p className="mt-3 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                  {sc.cardDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onStartScenario(sc.id)}
                  className="w-full py-3 px-4 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#1B3A6B] bg-[#1B3A6B]/8 border border-[#1B3A6B]/20 rounded-lg hover:bg-[#1B3A6B] hover:text-white active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
                >
                  <span>Разобрать</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
