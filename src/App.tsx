import { useState } from 'react';
import { SCENARIOS } from './data/scenarios';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ScenarioView } from './components/ScenarioView';
import { FreeQuestionBar } from './components/FreeQuestionBar';

export default function App() {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const activeScenario = activeScenarioId
    ? SCENARIOS.find((sc) => sc.id === activeScenarioId) ?? null
    : null;

  const handleSelectScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveScenarioId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#0F172A]">
      <Header
        activeScenarioId={activeScenarioId}
        onGoHome={handleGoHome}
        onSelectScenario={handleSelectScenario}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {activeScenario ? (
          <ScenarioView
            scenario={activeScenario}
            onGoHome={handleGoHome}
            onSelectScenario={handleSelectScenario}
          />
        ) : (
          <HomeView onStartScenario={handleSelectScenario} />
        )}

        <FreeQuestionBar onSelectScenario={handleSelectScenario} />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>AI-анализ простоев (OEE) · Автономный демо-стенд</span>
          <span>Расчёт: фонд времени · OEE · потери в рублях · Парето</span>
        </div>
      </footer>
    </div>
  );
}
