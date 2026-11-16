export type AgentId =
  | 'receiver'
  | 'classifier'
  | 'accountant'
  | 'economist'
  | 'detective'
  | 'reporter';

export interface AgentMeta {
  id: AgentId;
  order: number;
  name: string;
  subtitle: string;
}

export const AGENTS: AgentMeta[] = [
  { id: 'receiver', order: 1, name: 'Приёмщик', subtitle: 'Полнота данных' },
  { id: 'classifier', order: 2, name: 'Классификатор', subtitle: 'Группы простоев' },
  { id: 'accountant', order: 3, name: 'Счетовод', subtitle: 'Формула OEE' },
  { id: 'economist', order: 4, name: 'Экономист', subtitle: 'Потери в рублях' },
  { id: 'detective', order: 5, name: 'Детектив', subtitle: 'Парето потерь' },
  { id: 'reporter', order: 6, name: 'Докладчик', subtitle: 'Итоговый отчёт' },
];

export type OeeTone = 'critical' | 'reserve' | 'world';

export interface ShiftDataField {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface AlternativeReply {
  label: string;
  agentName: string;
  response: string;
}

export interface DowntimeGroupRow {
  group: string;
  minutes: number;
  sharePercent?: number;
}

export interface OeeBreakdown {
  availability: { percent: number; detail: string };
  performance: { percent: number; detail: string };
  quality: { percent: number; detail: string };
  totalPercent: number;
  verdictTitle: string;
  verdictSummary: string;
  tone: OeeTone;
  comment?: string;
}

export interface MoneyLossRow {
  reason: string;
  volume: string;
  calculation: string;
  rubles: number;
  rublesText: string;
  sharePercent: number;
}

export interface PriorityOption {
  id: 'A' | 'B' | 'C';
  codeLabel: string;
  label: string;
  isOptimal: boolean;
  verdict: 'Приоритет верный' | 'Приоритет спорный';
  score: string;
  feedbackText: string;
}

export type StepPayload =
  | {
      kind: 'intake';
      agentId: AgentId;
      statusPanelText: string;
      completenessNote?: string;
      shiftFields: ShiftDataField[];
      primaryReply: string;
      handoffNote?: string;
      alternativeReply: AlternativeReply;
    }
  | {
      kind: 'completeness';
      agentId: AgentId;
      panelText: string;
      fieldsFilled: number;
      fieldsTotal: number;
      missingField: string;
      primaryReply: string;
      handoffNote: string;
      alternativeReply: AlternativeReply;
    }
  | {
      kind: 'classifier';
      agentId: AgentId;
      introPanel?: string;
      rows: DowntimeGroupRow[];
      totalMinutes: number;
      extraNote?: string;
      confirmationQuestion?: string;
      primaryReply: string;
      alternativeReply: AlternativeReply;
    }
  | {
      kind: 'accountant';
      agentId: AgentId;
      oee: OeeBreakdown;
      primaryReply: string;
      alternativeReply: AlternativeReply;
    }
  | {
      kind: 'economist_choice';
      agentId: AgentId;
      losses: MoneyLossRow[];
      totalShiftRubles: number;
      totalShiftText: string;
      totalMonthText: string;
      constantsNote: string;
      highlightLine?: string;
      detectiveHint: string;
      question: string;
      options: PriorityOption[];
    }
  | {
      kind: 'final_report';
      agentId: AgentId;
      oee: OeeBreakdown;
      losses: MoneyLossRow[];
      totalShiftRubles: number;
      totalShiftText: string;
      totalMonthText: string;
      mainMoneyDrain: string;
      topActions: string[];
    };

export interface Scenario {
  id: string;
  number: number;
  cardTitle: string;
  cardMeta: string;
  cardDescription: string;
  role: string;
  totalSteps: number;
  steps: StepPayload[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'scenario-1',
    number: 1,
    cardTitle: 'Ночная смена: встал фрезерный станок',
    cardMeta: 'Сценарий 1 · Механический цех · 6 шагов',
    cardDescription:
      'Станок встал на 95 минут. OEE 52% — критично. Потери 76 000 ₽ за смену.',
    role: 'Мастер ночной смены механического цеха',
    totalSteps: 6,
    steps: [
      {
        kind: 'intake',
        agentId: 'receiver',
        statusPanelText: 'Приёмщик: принимаю данные смены…',
        shiftFields: [
          {
            label: 'Участок и оборудование',
            value: 'Линия фрезерных станков, ведущий станок ФС-7',
          },
          { label: 'Смена', value: '480 мин' },
          {
            label: 'Плановые остановки',
            value: '50 мин (перерывы 30 + плановая переналадка 20)',
          },
          { label: 'Фонд рабочего времени', value: '430 мин', highlight: true },
          { label: 'План выпуска', value: '240 деталей' },
          { label: 'Идеальный цикл', value: '1,2 мин/деталь' },
          { label: 'Факт выпуска', value: '200 деталей, из них брак 14', highlight: true },
          {
            label: 'Зафиксированные простои',
            value:
              'Поломка станка ФС-7 (шпиндель) 95 мин, ожидание наладчика 25 мин, нехватка заготовок 20 мин',
          },
          {
            label: 'Расценки',
            value:
              'Час простоя линии 18 000 ₽, маржа с детали 450 ₽, себестоимость детали 1 100 ₽',
          },
        ],
        primaryReply: 'Данные верные, запускай анализ',
        alternativeReply: {
          label: 'Откуда взялась цена часа простоя?',
          agentName: 'Приёмщик',
          response:
            'Это демо-константа сценария: 18 000 ₽/час. В боевой системе она считается из учёта: зарплата простаивающих, аренда, упущенная маржа.',
        },
      },
      {
        kind: 'completeness',
        agentId: 'receiver',
        panelText:
          'Проверка полноты: 9 из 10 полей заполнены. Не указано: было ли плановое ТО.',
        fieldsFilled: 9,
        fieldsTotal: 10,
        missingField: 'Было ли плановое ТО в течение смены',
        primaryReply: 'Планового ТО не было — все остановки внеплановые',
        handoffNote: 'Данные приняты. Передаю Классификатору.',
        alternativeReply: {
          label: 'А зачем это знать?',
          agentName: 'Приёмщик',
          response:
            'Плановые остановки вычитаются из фонда времени и не портят OEE. Внеплановые — чистая потеря. От ответа зависит расчёт.',
        },
      },
      {
        kind: 'classifier',
        agentId: 'classifier',
        rows: [
          {
            group: 'Оборудование (поломка шпинделя)',
            minutes: 95,
            sharePercent: 68,
          },
          {
            group: 'Организационные (ожидание наладчика)',
            minutes: 25,
            sharePercent: 18,
          },
          {
            group: 'Материалы (нет заготовок)',
            minutes: 20,
            sharePercent: 14,
          },
        ],
        totalMinutes: 140,
        confirmationQuestion: 'Поломку фиксирую как "шпиндельный узел" — верно?',
        primaryReply: 'Да, шпиндель. Мастер участка подтвердил',
        alternativeReply: {
          label: 'Точно не знаю',
          agentName: 'Классификатор',
          response:
            'Зафиксировано: "оборудование, узел не уточнён". На расчёт не влияет, но в отчёте помечу как пробел в данных.',
        },
      },
      {
        kind: 'accountant',
        agentId: 'accountant',
        oee: {
          availability: { percent: 67, detail: 'время работы 290 из 430 мин' },
          performance: { percent: 83, detail: '240 мин идеального времени из 290' },
          quality: { percent: 93, detail: '186 годных из 200' },
          totalPercent: 52,
          verdictTitle: 'КРИТИЧНО — ниже 60%',
          verdictSummary: 'OEE 52% — критично',
          tone: 'critical',
        },
        primaryReply: 'Покажи, сколько это в деньгах',
        alternativeReply: {
          label: '52% — это много или мало?',
          agentName: 'Счетовод',
          response:
            'Мировой уровень OEE — 85%. У вас 52%: почти половина фонда времени уходит не в продукцию.',
        },
      },
      {
        kind: 'economist_choice',
        agentId: 'economist',
        losses: [
          {
            reason: 'Простои',
            volume: '140 мин',
            calculation: '140 мин × 300 ₽/мин',
            rubles: 42000,
            rublesText: '42 000 ₽',
            sharePercent: 55,
          },
          {
            reason: 'Работа медленнее цикла',
            volume: '≈41 деталь',
            calculation: '≈41 деталь × 450 ₽',
            rubles: 18500,
            rublesText: '18 500 ₽',
            sharePercent: 24,
          },
          {
            reason: 'Брак',
            volume: '14 шт',
            calculation: '14 × 1 100 ₽',
            rubles: 15400,
            rublesText: '15 400 ₽',
            sharePercent: 20,
          },
        ],
        totalShiftRubles: 76000,
        totalShiftText: '76 000 ₽ за смену',
        totalMonthText: '≈1,67 млн ₽ в месяц',
        constantsNote:
          'Константы расчёта: 300 ₽/мин (18 000 ₽/час), маржа с детали 450 ₽, себестоимость детали 1 100 ₽, пересчёт на 22 смены в месяц.',
        detectiveHint:
          'По Парето: поломка + ожидание наладчика = 120 мин из 140 — это 86% времени простоёв.',
        question: 'Бюджет на улучшения один. Что чинить первым?',
        options: [
          {
            id: 'A',
            codeLabel: 'А',
            label: 'Регламент вызова наладчика (закрывает 25 мин)',
            isOptimal: false,
            verdict: 'Приоритет спорный',
            score: '70/100',
            feedbackText:
              'Мера полезная, но закрывает 25 мин из 140: эффект 7 500 ₽ за смену. Главный сток денег — шпиндель: 95 минут.',
          },
          {
            id: 'B',
            codeLabel: 'Б',
            label: 'Ремонт и ТО шпиндельного узла (закрывает 95 мин)',
            isOptimal: true,
            verdict: 'Приоритет верный',
            score: '92/100',
            feedbackText:
              'Ремонт шпиндельного узла вернёт до 28 500 ₽ за смену — около 630 тыс ₽ в месяц',
          },
          {
            id: 'C',
            codeLabel: 'В',
            label: 'Буфер заготовок на 2 часа (закрывает 20 мин)',
            isOptimal: false,
            verdict: 'Приоритет спорный',
            score: '70/100',
            feedbackText:
              'Мера полезная, но закрывает 20 мин из 140: эффект 6 000 ₽ за смену. Главный сток денег — шпиндель: 95 минут.',
          },
        ],
      },
      {
        kind: 'final_report',
        agentId: 'reporter',
        oee: {
          availability: { percent: 67, detail: 'время работы 290 из 430 мин' },
          performance: { percent: 83, detail: '240 мин идеального времени из 290' },
          quality: { percent: 93, detail: '186 годных из 200' },
          totalPercent: 52,
          verdictTitle: 'КРИТИЧНО — ниже 60%',
          verdictSummary: 'OEE 52% — критично',
          tone: 'critical',
        },
        losses: [
          {
            reason: 'Простои',
            volume: '140 мин',
            calculation: '140 мин × 300 ₽/мин',
            rubles: 42000,
            rublesText: '42 000 ₽',
            sharePercent: 55,
          },
          {
            reason: 'Работа медленнее цикла',
            volume: '≈41 деталь',
            calculation: '≈41 деталь × 450 ₽',
            rubles: 18500,
            rublesText: '18 500 ₽',
            sharePercent: 24,
          },
          {
            reason: 'Брак',
            volume: '14 шт',
            calculation: '14 × 1 100 ₽',
            rubles: 15400,
            rublesText: '15 400 ₽',
            sharePercent: 20,
          },
        ],
        totalShiftRubles: 76000,
        totalShiftText: '76 000 ₽ за смену',
        totalMonthText: '≈1,67 млн ₽ в месяц',
        mainMoneyDrain:
          'Главный сток денег: оборудование и ожидание наладчика — 86% времени простоёв',
        topActions: [
          'ремонт и регламент ТО шпиндельного узла',
          'регламент вызова наладчика (приезд за 10 минут)',
          'буфер заготовок на 2 часа работы',
        ],
      },
    ],
  },
  {
    id: 'scenario-2',
    number: 2,
    cardTitle: 'Сборочная линия: шесть переналадок за смену',
    cardMeta: 'Сценарий 2 · Сборочный цех · 5 шагов',
    cardDescription:
      'Каждая переналадка дольше нормы. OEE 71% — есть резерв. Потери 42 000 ₽ за смену.',
    role: 'Мастер дневной смены сборочного цеха',
    totalSteps: 5,
    steps: [
      {
        kind: 'intake',
        agentId: 'receiver',
        statusPanelText: 'Приёмщик: данные полные, 10 из 10',
        completenessNote: 'Все обязательные поля заполнены (10 из 10).',
        shiftFields: [
          { label: 'Участок и оборудование', value: 'Сборочная линия АЛ-2' },
          { label: 'Смена', value: '480 мин' },
          { label: 'Плановые остановки', value: '30 мин' },
          { label: 'Фонд рабочего времени', value: '450 мин', highlight: true },
          { label: 'План выпуска', value: '500 изделий' },
          { label: 'Идеальный цикл', value: '0,8 мин' },
          { label: 'Факт выпуска', value: '410 изделий, брак 9', highlight: true },
          {
            label: 'Зафиксированные простои',
            value:
              'Переналадки сверх нормы 48 мин (6 переналадок по 18 мин при норме 10), микроостановки 32 мин',
          },
          {
            label: 'Расценки',
            value: 'Час простоя 12 000 ₽, маржа 380 ₽, себестоимость 700 ₽',
          },
        ],
        primaryReply: 'Запускай анализ',
        alternativeReply: {
          label: 'Что такое микроостановки?',
          agentName: 'Приёмщик',
          response:
            'Остановки короче 5 минут: подклинило конвейер, поправил деталь. По одной — мелочь, за смену набежало 32 минуты.',
        },
      },
      {
        kind: 'classifier',
        agentId: 'classifier',
        introPanel:
          'В журнале переналадки записаны как "плановые". Норма — 10 минут, факт — 18. Сверх нормы: 8 мин × 6 = 48 мин — это потеря, не план.',
        rows: [
          {
            group: 'Переналадка сверх нормы',
            minutes: 48,
            sharePercent: 60,
          },
          {
            group: 'Микроостановки',
            minutes: 32,
            sharePercent: 40,
          },
        ],
        totalMinutes: 80,
        primaryReply: 'Согласен: сверхнорматив — потеря',
        alternativeReply: {
          label: 'Почему не всё в план?',
          agentName: 'Классификатор',
          response:
            'Нормативные 10 минут уже сидят в плановых остановках. Всё, что дольше нормы, — съеденное время смены.',
        },
      },
      {
        kind: 'accountant',
        agentId: 'accountant',
        oee: {
          availability: { percent: 82, detail: '370 из 450 мин' },
          performance: { percent: 89, detail: '328 из 370' },
          quality: { percent: 98, detail: '401 из 410' },
          totalPercent: 71,
          verdictTitle: 'ЕСТЬ РЕЗЕРВ (60–85%)',
          verdictSummary: 'OEE 71% — есть резерв',
          tone: 'reserve',
        },
        primaryReply: 'Покажи деньги',
        alternativeReply: {
          label: 'Что тянет вниз?',
          agentName: 'Счетовод',
          response:
            'Доступность 82% — главный минус: 80 минут смены линия стояла. Качество и скорость почти в норме.',
        },
      },
      {
        kind: 'economist_choice',
        agentId: 'economist',
        losses: [
          {
            reason: 'Недовыпуск по скорости',
            volume: '52 изделия',
            calculation: '52 изделия × 380 ₽',
            rubles: 19800,
            rublesText: '19 800 ₽',
            sharePercent: 47,
          },
          {
            reason: 'Простои',
            volume: '80 мин',
            calculation: '80 мин × 200 ₽/мин',
            rubles: 16000,
            rublesText: '16 000 ₽',
            sharePercent: 38,
          },
          {
            reason: 'Брак',
            volume: '9 шт',
            calculation: '9 × 700 ₽',
            rubles: 6300,
            rublesText: '6 300 ₽',
            sharePercent: 15,
          },
        ],
        totalShiftRubles: 42000,
        totalShiftText: '42 000 ₽ за смену',
        totalMonthText: '≈0,9 млн ₽ в месяц',
        constantsNote:
          'Константы расчёта: 200 ₽/мин (12 000 ₽/час), маржа 380 ₽, себестоимость 700 ₽, пересчёт на 22 смены в месяц.',
        detectiveHint:
          'Переналадки сверх нормы — 48 из 80 минут, это 60% времени простоёв.',
        question: 'Что делаем с переналадками?',
        options: [
          {
            id: 'A',
            codeLabel: 'А',
            label: 'SMED-разбор переналадки вместе с наладчиком',
            isOptimal: true,
            verdict: 'Приоритет верный',
            score: '90/100',
            feedbackText:
              'Возврат переналадки к нормативу вернёт 9 600 ₽ за смену — около 210 тыс ₽ в месяц, почти без вложений',
          },
          {
            id: 'B',
            codeLabel: 'Б',
            label: 'Штрафы мастерам за медленную наладку',
            isOptimal: false,
            verdict: 'Приоритет спорный',
            score: '65/100',
            feedbackText:
              'Штраф не ускоряет наладку: причина обычно в организации — оснастку ищут в процессе. Эффект близок к нулю, плюс конфликт в смене.',
          },
          {
            id: 'C',
            codeLabel: 'В',
            label: 'Просить второй пост наладки',
            isOptimal: false,
            verdict: 'Приоритет спорный',
            score: '70/100',
            feedbackText:
              'Работает, но дорого: второй пост — это ставка и оборудование. Сначала SMED: часто половина времени наладки — это поиск и подготовка.',
          },
        ],
      },
      {
        kind: 'final_report',
        agentId: 'reporter',
        oee: {
          availability: { percent: 82, detail: '370 из 450 мин' },
          performance: { percent: 89, detail: '328 из 370' },
          quality: { percent: 98, detail: '401 из 410' },
          totalPercent: 71,
          verdictTitle: 'ЕСТЬ РЕЗЕРВ (60–85%)',
          verdictSummary: 'OEE 71% — есть резерв',
          tone: 'reserve',
        },
        losses: [
          {
            reason: 'Недовыпуск по скорости',
            volume: '52 изделия',
            calculation: '52 изделия × 380 ₽',
            rubles: 19800,
            rublesText: '19 800 ₽',
            sharePercent: 47,
          },
          {
            reason: 'Простои',
            volume: '80 мин',
            calculation: '80 мин × 200 ₽/мин',
            rubles: 16000,
            rublesText: '16 000 ₽',
            sharePercent: 38,
          },
          {
            reason: 'Брак',
            volume: '9 шт',
            calculation: '9 × 700 ₽',
            rubles: 6300,
            rublesText: '6 300 ₽',
            sharePercent: 15,
          },
        ],
        totalShiftRubles: 42000,
        totalShiftText: '42 000 ₽ за смену',
        totalMonthText: '≈0,9 млн ₽ в месяц',
        mainMoneyDrain:
          'Главный сток денег: переналадки дольше нормы — 60% времени простоёв',
        topActions: [
          'SMED-разбор: всё, что можно подготовить заранее, готовить до остановки',
          'стандарт-работа переналадки с хронометражем',
          'учёт микроостановок с причинами',
        ],
      },
    ],
  },
  {
    id: 'scenario-3',
    number: 3,
    cardTitle: 'Прессовый участок: план есть, качества нет',
    cardMeta: 'Сценарий 3 · Прессовый участок · 5 шагов',
    cardDescription:
      'Брак 10%. OEE 78%, а потери самые большие — 96 000 ₽ за смену.',
    role: 'Мастер смены прессового участка',
    totalSteps: 5,
    steps: [
      {
        kind: 'intake',
        agentId: 'receiver',
        statusPanelText: 'Приёмщик: данные смены приняты',
        shiftFields: [
          { label: 'Участок и оборудование', value: 'Пресс П-12' },
          { label: 'Смена', value: '480 мин' },
          { label: 'Плановые остановки', value: '30 мин' },
          { label: 'Фонд рабочего времени', value: '450 мин', highlight: true },
          { label: 'План выпуска', value: '800 штук' },
          { label: 'Идеальный цикл', value: '0,5 мин' },
          { label: 'Факт выпуска', value: '780 штук, брак 78', highlight: true },
          { label: 'Зафиксированные простои', value: 'Внеплановая замена оснастки 35 мин' },
          {
            label: 'Расценки',
            value: 'Час простоя 12 000 ₽, маржа 300 ₽, себестоимость 950 ₽',
          },
        ],
        primaryReply: 'Запускай анализ',
        alternativeReply: {
          label: '78 бракованных из 780 — это много?',
          agentName: 'Приёмщик',
          response:
            '10% брака — очень много. В серийном производстве рабочая норма обычно 1–2%.',
        },
      },
      {
        kind: 'classifier',
        agentId: 'classifier',
        rows: [
          {
            group: 'Оснастка (внеплановая замена)',
            minutes: 35,
            sharePercent: 100,
          },
        ],
        totalMinutes: 35,
        extraNote: 'Брак: 78 шт — группа "Качество", во времени простоёв не учитывается.',
        primaryReply: 'Подтвердить',
        alternativeReply: {
          label: 'Почему брак — не простой?',
          agentName: 'Классификатор',
          response:
            'Брак не останавливает линию, но съедает время и материал. В OEE это третий множитель — качество, а в деньгах часто самый дорогой.',
        },
      },
      {
        kind: 'accountant',
        agentId: 'accountant',
        oee: {
          availability: { percent: 92, detail: '415 из 450' },
          performance: { percent: 94, detail: '390 из 415' },
          quality: { percent: 90, detail: '702 из 780' },
          totalPercent: 78,
          verdictTitle: 'ЕСТЬ РЕЗЕРВ',
          verdictSummary: 'OEE 78% — есть резерв',
          tone: 'reserve',
          comment: 'Лучший OEE из трёх сценариев. Но не расслабляйся: смотри деньги.',
        },
        primaryReply: 'Покажи деньги',
        alternativeReply: {
          label: '78% — вроде неплохо?',
          agentName: 'Счетовод',
          response:
            'По шкале — да. Но OEE не показывает, сколько стоит каждый процент потерь. Это покажет Экономист.',
        },
      },
      {
        kind: 'economist_choice',
        agentId: 'economist',
        losses: [
          {
            reason: 'Брак',
            volume: '78 шт',
            calculation: '78 × 950 ₽',
            rubles: 74100,
            rublesText: '74 100 ₽',
            sharePercent: 77,
          },
          {
            reason: 'Недовыпуск по скорости',
            volume: '50 шт',
            calculation: '50 шт × 300 ₽',
            rubles: 15000,
            rublesText: '15 000 ₽',
            sharePercent: 16,
          },
          {
            reason: 'Простой',
            volume: '35 мин',
            calculation: '35 мин × 200 ₽/мин',
            rubles: 7000,
            rublesText: '7 000 ₽',
            sharePercent: 7,
          },
        ],
        totalShiftRubles: 96000,
        totalShiftText: '96 000 ₽ за смену',
        totalMonthText: '≈2,1 млн ₽ в месяц — самые большие потери из трёх сценариев',
        constantsNote:
          'Константы расчёта: 200 ₽/мин (12 000 ₽/час), маржа 300 ₽, себестоимость 950 ₽, пересчёт на 22 смены в месяц.',
        highlightLine: '77% всех потерь — брак.',
        detectiveHint: 'Линия стоит мало, но штампует брак на 74 тыс ₽ за смену.',
        question: 'Что делаем первым?',
        options: [
          {
            id: 'A',
            codeLabel: 'А',
            label: 'Аудит параметров пресса и входного материала',
            isOptimal: true,
            verdict: 'Приоритет верный',
            score: '90/100',
            feedbackText:
              'Снижение брака с 10% до 2% вернёт около 59 000 ₽ за смену — до 1,3 млн ₽ в месяц',
          },
          {
            id: 'B',
            codeLabel: 'Б',
            label: 'Ужесточить приёмку на выходе',
            isOptimal: false,
            verdict: 'Приоритет спорный',
            score: '65/100',
            feedbackText:
              'Приёмка отбракует те же детали, только позже: деньги на их изготовление уже потрачены. Это лечение симптома, не причины.',
          },
          {
            id: 'C',
            codeLabel: 'В',
            label: 'Заменить оснастку',
            isOptimal: false,
            verdict: 'Приоритет спорный',
            score: '70/100',
            feedbackText:
              'Дорого и вслепую: причина брака не доказана. Если дело в параметрах или материале, новая оснастка даст тот же брак.',
          },
        ],
      },
      {
        kind: 'final_report',
        agentId: 'reporter',
        oee: {
          availability: { percent: 92, detail: '415 из 450' },
          performance: { percent: 94, detail: '390 из 415' },
          quality: { percent: 90, detail: '702 из 780' },
          totalPercent: 78,
          verdictTitle: 'ЕСТЬ РЕЗЕРВ',
          verdictSummary: 'OEE 78% — есть резерв',
          tone: 'reserve',
        },
        losses: [
          {
            reason: 'Брак',
            volume: '78 шт',
            calculation: '78 × 950 ₽',
            rubles: 74100,
            rublesText: '74 100 ₽',
            sharePercent: 77,
          },
          {
            reason: 'Недовыпуск по скорости',
            volume: '50 шт',
            calculation: '50 шт × 300 ₽',
            rubles: 15000,
            rublesText: '15 000 ₽',
            sharePercent: 16,
          },
          {
            reason: 'Простой',
            volume: '35 мин',
            calculation: '35 мин × 200 ₽/мин',
            rubles: 7000,
            rublesText: '7 000 ₽',
            sharePercent: 7,
          },
        ],
        totalShiftRubles: 96000,
        totalShiftText: '96 000 ₽ за смену',
        totalMonthText: '≈2,1 млн ₽ в месяц',
        mainMoneyDrain: 'Главный сток денег: брак — 77% всех потерь смены',
        topActions: [
          'аудит параметров пресса (температура, давление, выдержка) и входной контроль материала',
          'контроль первой детали после каждой наладки',
          'карта причин брака по дням',
        ],
      },
    ],
  },
];
