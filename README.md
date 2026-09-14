# StudyPath 🎓

StudyPath is a comprehensive study abroad consultancy and university discovery mobile application built with **React Native**, **Expo Router**, **NativeWind (Tailwind CSS)**, and **Supabase**.

---

## ✨ Features

- **Global University Discovery**: Browse top universities, filter by countries, and view global rankings.
- **Academic Programs**: Detailed program specs, duration, yearly tuition, and requirements.
- **Scholarship Finder**: Explore fully-funded and partially-funded scholarships with upcoming application deadlines.
- **Program Comparison**: Side-by-side comparison of tuition, duration, language, and next deadlines.
- **Application Tracking**: Manage application status from draft, submitted, under review to accepted.
- **User Authentication & Profile**: Supabase Auth with custom student profiles and onboarding flows.
- **Admin Dashboard**: Data sources overview, scraping jobs monitoring, and catalog management.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev) / React Native (SDK 52)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS v3/v4)
- **Icons**: `@expo/vector-icons` (MaterialIcons & SF Symbols)
- **Backend & Database**: [Supabase](https://supabase.com) (PostgreSQL, Auth, RLS)
- **State & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+) or Bun
- Expo Go app on iOS/Android or an emulator

### 2. Installation
```bash
npm install
# or
bun install
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Running the Project
```bash
npx expo start
```
- Press `i` for iOS simulator.
- Press `a` for Android emulator.
- Press `w` for web preview.

---

## 📁 Project Structure

```
studypath/
├── app/                 # Expo Router file-based screens & layouts
│   ├── (auth)/          # Authentication flow (login, signup, setup)
│   ├── (tabs)/          # Main tabs (explore, scholarships, deadlines, home)
│   ├── admin/           # Admin management & data scraping logs
│   ├── compare.tsx      # Side-by-side program comparison
│   └── _layout.tsx      # Root providers & stack navigation
├── components/          # Reusable UI components & layouts
├── hooks/               # React Query data hooks
├── lib/                 # Supabase client & utility formatters
├── services/            # API & Supabase database queries
└── types/               # TypeScript definitions
```

---

## 📄 License
Private & Proprietary.

