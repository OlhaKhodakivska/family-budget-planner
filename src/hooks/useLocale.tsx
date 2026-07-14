import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Language } from '../types/budget';
import {
  convertFromBaseCurrency,
  convertToBaseCurrency,
  formatCurrencyValue,
  formatDateValue,
  parseMoney,
  toMoneyNumber,
} from '../utils/budget';

const languageKey = 'family-budget-language';
const exchangeRateKey = 'family-budget-eur-uah-rate';
const exchangeRateUrl = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=EUR&json';

const dictionary = {
  en: {
    appTitle: 'Family Budget',
    brandSubtitle: 'Home finance control',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    closeModal: 'Close modal',
    loading: 'Loading',
    themeSwitch: 'Theme switch',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    budgetNavigation: 'Budget navigation',
    language: 'Language',
    footer: 'Made by Khodakivska O.',
    footerContact: 'Questions and suggestions:',
    overview: 'Overview',
    income: 'Income',
    expenses: 'Expenses',
    creditCards: 'Credit Cards',
    savings: 'Savings',
    netBalance: 'Net balance',
    heroTitle: 'Family budget under control',
    heroSubtitle: 'Track income, expenses, credit limits, debts, and savings in one responsive dashboard.',
    financialPulse: 'Financial pulse',
    updating: 'Updating',
    financialTotals: 'Financial totals',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    totalSavings: 'Total Savings',
    creditAvailable: 'Credit Available',
    incomeSubtitle: 'Salary, gifts, and custom income entries',
    expensesSubtitle: 'Rent, groceries, cosmetics, pets, hobbies, and more',
    category: 'Category',
    customCategory: 'Custom category',
    label: 'Label',
    amount: 'Amount',
    date: 'Date',
    monthlySalary: 'Monthly salary',
    freelanceBonus: 'Freelance, bonus...',
    receiptNote: 'Receipt note',
    medicineSchool: 'Medicine, school...',
    addIncome: 'Add income',
    addExpense: 'Add expense',
    noIncome: 'No income entries yet.',
    noExpenses: 'No expense entries yet.',
    cardName: 'Card name',
    creditLimit: 'Credit limit',
    currentDebt: 'Current balance debt',
    addCard: 'Add card',
    noCards: 'No credit cards yet.',
    cardPlaceholder: 'Mono, Privat',
    usedFrom: 'used from',
    removeCard: 'Remove',
    limit: 'Limit',
    debt: 'Debt',
    available: 'Available',
    currentSavingsPool: 'Current savings pool',
    savingsGoal: 'Savings goal or note',
    transferAmount: 'Transfer amount',
    emergencyFund: 'Emergency fund',
    addTransfer: 'Add transfer',
    noSavings: 'No savings transfers yet.',
    salary: 'Salary',
    gifts: 'Gifts',
    otherIncome: 'Other income',
    rent: 'Rent',
    groceries: 'Groceries',
    cosmetics: 'Cosmetics',
    pets: 'Pets',
    hobby: 'Hobby',
    exchangeRate: 'NBU rate',
    rateUnavailable: 'Rate unavailable',
    inputCurrency: 'Input currency',
    dreamsGoals: 'Dreams and Goals',
    savedGoals: 'Saved goals',
    dreamsSubtitle: 'Plan the path, steps, and potential costs for the things you want to reach.',
    goalTitle: 'Goal title',
    planNote: 'Plan note',
    stepText: 'Step',
    stepCost: 'Potential cost',
    addStep: 'Add step',
    saveGoal: 'Save goal',
    noDreams: 'No dreams or goals yet.',
    potentialCost: 'Potential cost',
    created: 'Created',
    removeGoal: 'Remove goal',
    goalSteps: 'Steps to reach',
    dreamPlaceholder: 'Trip, home, course...',
    planPlaceholder: 'Write the plan and important details...',
    stepPlaceholder: 'Describe the next step',
  },
  uk: {
    appTitle: 'Сімейний бюджет',
    brandSubtitle: 'Контроль домашніх фінансів',
    openMenu: 'Відкрити меню',
    closeMenu: 'Закрити меню',
    closeModal: 'Закрити вікно',
    loading: 'Завантаження',
    themeSwitch: 'Перемикач теми',
    lightTheme: 'Світла',
    darkTheme: 'Темна',
    budgetNavigation: 'Навігація бюджету',
    language: 'Мова',
    footer: 'Зроблено Ходаківською О.',
    footerContact: 'Питання і пропозиції надсилайте:',
    overview: 'Огляд',
    income: 'Доходи',
    expenses: 'Витрати',
    creditCards: 'Кредитні картки',
    savings: 'Заощадження',
    netBalance: 'Баланс',
    heroTitle: 'Сімейний бюджет під контролем',
    heroSubtitle: 'Ведіть доходи, витрати, кредитні ліміти, борги та заощадження в одному адаптивному дашборді.',
    financialPulse: 'Фінансовий пульс',
    updating: 'Оновлення',
    financialTotals: 'Фінансові підсумки',
    totalIncome: 'Усього доходів',
    totalExpenses: 'Усього витрат',
    totalSavings: 'Усього заощаджень',
    creditAvailable: 'Доступний кредит',
    incomeSubtitle: 'Зарплата, подарунки та власні статті доходів',
    expensesSubtitle: 'Оренда, продукти, косметика, тварини, хобі та інше',
    category: 'Категорія',
    customCategory: 'Власна категорія',
    label: 'Назва',
    amount: 'Сума',
    date: 'Дата',
    monthlySalary: 'Місячна зарплата',
    freelanceBonus: 'Фриланс, бонус...',
    receiptNote: 'Опис чека',
    medicineSchool: 'Ліки, школа...',
    addIncome: 'Додати дохід',
    addExpense: 'Додати витрату',
    noIncome: 'Доходів ще немає.',
    noExpenses: 'Витрат ще немає.',
    cardName: 'Назва картки',
    creditLimit: 'Кредитний ліміт',
    currentDebt: 'Поточна заборгованість',
    addCard: 'Додати картку',
    noCards: 'Кредитних карток ще немає.',
    cardPlaceholder: 'Mono, Privat',
    usedFrom: 'використано з',
    removeCard: 'Видалити',
    limit: 'Ліміт',
    debt: 'Борг',
    available: 'Доступно',
    currentSavingsPool: 'Поточні заощадження',
    savingsGoal: 'Ціль або примітка',
    transferAmount: 'Сума переказу',
    emergencyFund: 'Резервний фонд',
    addTransfer: 'Додати переказ',
    noSavings: 'Переказів у заощадження ще немає.',
    salary: 'Зарплата',
    gifts: 'Подарунки',
    otherIncome: 'Інший дохід',
    rent: 'Оренда',
    groceries: 'Продукти',
    cosmetics: 'Косметика',
    pets: 'Тварини',
    hobby: 'Хобі',
    exchangeRate: 'Курс НБУ',
    rateUnavailable: 'Курс недоступний',
    inputCurrency: 'Валюта вводу',
    dreamsGoals: 'Мрії та цілі',
    savedGoals: 'Збережені цілі',
    dreamsSubtitle: 'Плануйте шлях, кроки та потенційні витрати для того, чого хочете досягти.',
    goalTitle: 'Назва цілі',
    planNote: 'Замітка до плану',
    stepText: 'Крок',
    stepCost: 'Потенційні витрати',
    addStep: 'Додати крок',
    saveGoal: 'Зберегти ціль',
    noDreams: 'Мрій або цілей ще немає.',
    potentialCost: 'Потенційні витрати',
    created: 'Створено',
    removeGoal: 'Видалити ціль',
    goalSteps: 'Кроки до досягнення',
    dreamPlaceholder: 'Подорож, житло, курс...',
    planPlaceholder: 'Опишіть план і важливі деталі...',
    stepPlaceholder: 'Опишіть наступний крок',
  },
} as const;

type TranslationKey = keyof typeof dictionary.en;

interface LocaleContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  eurToUahRate: number | null;
  exchangeDate: string | null;
  t: (key: TranslationKey) => string;
  formatCurrency: (value: number) => string;
  parseInputAmount: (value: string) => number;
  formatDate: (value: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const getInitialLanguage = (): Language => {
  try {
    const stored = window.localStorage.getItem(languageKey);
    return stored === 'uk' ? 'uk' : 'en';
  } catch {
    return 'en';
  }
};

const getCachedExchangeRate = (): { rate: number; date: string } | null => {
  try {
    const stored = window.localStorage.getItem(exchangeRateKey);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as { rate?: unknown; date?: unknown };
    const rate = toMoneyNumber(parsed.rate);
    return rate > 0 && typeof parsed.date === 'string' ? { rate, date: parsed.date } : null;
  } catch {
    return null;
  }
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [exchangeRate, setExchangeRate] = useState(getCachedExchangeRate);

  useEffect(() => {
    window.localStorage.setItem(languageKey, language);
    document.documentElement.lang = language === 'uk' ? 'uk' : 'en';
  }, [language]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(exchangeRateUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load exchange rate');
        return response.json() as Promise<Array<{ rate: number; exchangedate: string }>>;
      })
      .then(([rateData]) => {
        if (!rateData || !Number.isFinite(rateData.rate)) return;

        const nextRate = { rate: rateData.rate, date: rateData.exchangedate };
        setExchangeRate(nextRate);
        window.localStorage.setItem(exchangeRateKey, JSON.stringify(nextRate));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      });

    return () => controller.abort();
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      language,
      setLanguage,
      eurToUahRate: exchangeRate?.rate ?? null,
      exchangeDate: exchangeRate?.date ?? null,
      t: (key) => dictionary[language][key],
      formatCurrency: (amount) =>
        formatCurrencyValue(convertFromBaseCurrency(amount, language, exchangeRate?.rate ?? null), language),
      parseInputAmount: (amount) => convertToBaseCurrency(parseMoney(amount), language, exchangeRate?.rate ?? null),
      formatDate: (date) => formatDateValue(date, language),
    }),
    [exchangeRate?.date, exchangeRate?.rate, language],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return value;
};
