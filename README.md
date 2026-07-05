# HavenMart - Peer-to-Peer Marketplace

**Final Year Project | BCA (Specialization in CTIS) | 2022-2025 | Assam Downtown University (ADTU)**

A cross-platform mobile marketplace application built with React Native (Expo) that connects local buyers and sellers. Users can browse listings, search by category or keyword, view item details, and communicate via in-app chat.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54 (React Native) with Expo Router |
| Authentication | Clerk (email/password, Google OAuth) |
| Backend / Database | Supabase (PostgreSQL, Realtime, Storage) |
| State Management | React Context API |
| Location | expo-location (GPS, radius-based filtering) |
| Maps | react-native-maps |
| UI | Custom theming (dark/light/system), react-native-reanimated |

## Features

- **User authentication** — Sign up, sign in, password reset, Google OAuth
- **Marketplace listings** — Create, edit, delete listings with photos, price, category, and location
- **Category browsing** — Sidebar navigation to filter items by category
- **Location-based filtering** — Items shown within a configurable radius using device GPS
- **Full-text search** — Search listings with recent search history persistence
- **In-app chat** — Real-time messaging powered by Supabase Realtime
- **Image gallery** — Full-screen image viewing with native share support
- **Dark mode / light mode** — Theme toggle persisted via AsyncStorage
- **Pull-to-refresh** — Refresh listings, categories, and banners on the home screen

## Screens

- **Welcome** — Landing page with hero image, sign-up / sign-in options
- **Home** — Profile header, search bar, image slider, category browser, latest items grid
- **Sell** — Create a new listing with image upload and details form
- **Product Details** — Full product view with image gallery, seller info, and contact button
- **Chat** — Real-time messaging with chat history per listing
- **Profile** — User info, my listings, my chats, theme preferences
- **Search** — Full-text search with recent history and category browsing

## Getting Started

```bash
npm install
npx expo start
```

## Environment Variables

Create a `.env` file with Clerk and Supabase credentials.

## Database

A Supabase PostgreSQL instance with tables for users, posts, categories, sliders, chats, and messages. See `supabase-schema.sql` for the full schema.
