# RNTasksAndNotesApp
React Native Take-Home Assignment

# Tasks & Notes App

This project is a React Native CLI application built with TypeScript. It provides a simple but realistic task and notes manager. Tasks are fetched from the JSONPlaceholder API, while notes are stored locally using AsyncStorage. The app demonstrates clean architecture, sensible state management, and handling of real‑world scenarios such as loading states, error handling, and persistence.

## Setup

To run the application locally

```bash

cd tasks-notes-app
npm install

npx pod-install ios
npm run ios

npm run android

npm start

Architecture
The application is organized into a clear folder structure under src/. Navigation is handled by React Navigation with a stack navigator. Global state for tasks is managed with a custom TasksContext and hooks, while notes are managed with a useNote hook that persists data in AsyncStorage. API calls to JSONPlaceholder are wrapped in tasksService.ts for clarity. Components such as TaskItem, FilterTabs, EmptyState, and ErrorState provide reusable UI elements. Screens include TaskListScreen for listing and filtering tasks, TaskDetailScreen for showing details and editing notes, and AddTaskModal for adding new tasks. A theme provider integrates system light/dark mode.

Tradeoffs
Because JSONPlaceholder is a fake API, mutations such as adding, updating, or deleting tasks are not persisted on the server. To provide a realistic user experience, the app uses optimistic updates and maintains a local cache of deleted task IDs so they do not reappear after refresh. This adds complexity but ensures the UI behaves as expected. The due date input is simplified to a text field in this CLI setup; a native date picker would provide a better experience. Context and hooks were chosen over React Query to keep dependencies minimal and maintain full control over state, though React Query would provide caching and retry logic out of the box.

Improvements
There are several areas where the app could be improved. The UI could be enhanced with a native date picker, swipe‑to‑delete gestures, and a design system for consistent styling. Persistence could be improved by syncing notes and deleted tasks to a backend service instead of relying solely on local storage, or by using MMKV for faster local storage. Testing could be expanded with unit tests for context and hooks and integration tests using Detox. Additional features such as pagination, offline support with background sync, and analytics integration (for example with Firebase or Segment) would make the app more robust and production‑ready.

Project Structure
Code
src/
├─ App.tsx
├─ navigation/
├─ screens/
├─ components/
├─ context/
├─ services/
├─ storage/
├─ theme/
├─ types/
└─ utils/