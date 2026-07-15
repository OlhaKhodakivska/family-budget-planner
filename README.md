# Family Budget Planner

A responsive family finance dashboard for tracking income, expenses, credit cards, savings, and personal goals in one place.

This project was created as part of the **DCI** learning program for the topic **Understanding Agentic Programming**. The goal was to practice building a complete frontend application while using an agentic development workflow: breaking the task into features, iterating on structure and UI, and refining the implementation through focused feedback.

## Features

- Dashboard overview with total income, expenses, savings, net balance, and available credit
- Income and expense tracking with predefined and custom categories
- Credit card management with limits, debt, and available balance calculations
- Savings tracker with transfer history
- Dreams and goals planner with step-by-step cost planning
- English and Ukrainian interface
- EUR/UAH currency handling with exchange-rate loading from the National Bank of Ukraine API
- Light and dark themes with saved user preference
- Persistent local data using `localStorage`
- Responsive layout for desktop and mobile screens

## Tech Stack

- **React 19** - component-based UI development
- **TypeScript** - typed application state, props, utility functions, and domain models
- **Vite 6** - fast development server and production build tooling
- **CSS Modules** - scoped component styles
- **Global CSS custom properties** - shared colors, spacing, themes, and layout tokens
- **React Hooks** - state and behavior composition with `useState`, `useEffect`, `useMemo`, `useReducer`, and custom hooks
- **Context API** - locale state and translation access across the app
- **localStorage** - client-side persistence for budget data, language, theme, and cached exchange rate
- **Fetch API** - loading EUR to UAH exchange-rate data from the NBU API
- **Intl.NumberFormat** - localized currency formatting
- **lucide-react** - icon system for navigation, actions, and dashboard cards
- **gh-pages** - deployment support for GitHub Pages

## Architecture

The application follows a component-oriented structure inspired by atomic design:

- `src/components/atoms` - reusable UI primitives such as buttons, inputs, badges, spinners, and toggles
- `src/components/molecules` - composed UI elements such as metric cards, form fields, category rows, and credit card items
- `src/components/organisms` - feature sections such as income, expenses, savings, credit cards, modals, and goals
- `src/components/templates` - layout-level components
- `src/pages` - page-level dashboard composition
- `src/hooks` - custom hooks for budget state, theme, and locale
- `src/utils` - calculation, formatting, parsing, and helper utilities
- `src/types` - TypeScript domain types for the budget model

Budget data is managed with a reducer-based store in `useBudgetStore`. Derived totals are calculated with memoized utility functions, while user preferences and budget entries are stored locally in the browser.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local URL shown in the terminal.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

The project is configured for GitHub Pages deployment with the base path:

```ts
base: '/budget-planner/'
```

Live page:

```text
https://OlhaKhodakivska.github.io/budget-planner/
```

To deploy:

```bash
npm run deploy
```

## Learning Context

This work was completed during DCI training under the topic **Understanding Agentic Programming**. The project demonstrates how an agentic programming workflow can support frontend development by helping with:

- translating requirements into a working application structure
- designing reusable components
- improving UI consistency
- organizing state and derived calculations
- documenting the final project for GitHub

## Author

Created by **Khodakivska O.**
