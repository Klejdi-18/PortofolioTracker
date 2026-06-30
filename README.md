# Portfolio Tracker

## Overview

Portfolio Tracker is a mobile application built with **React Native (Expo)** and **Supabase** that allows users to manage their personal project portfolio. Users can securely sign in, add projects, view them in a clean card-based interface, delete projects, and open project links directly in their browser.

The application also includes a dashboard that provides a simple statistical overview of the user's portfolio.

---

## Features

* User authentication with Supabase (Email & Password)
* Secure user-specific project management
* Create new projects
* View projects in card layout
* Delete projects
* Open project URLs using `Linking.openURL()`
* Dashboard with project statistics
* Responsive and clean mobile interface
* Row Level Security (RLS) to ensure users only access their own data

---

## Technologies Used

* React Native
* Expo
* Supabase
* JavaScript
* React Hooks (`useState`, `useEffect`)
* React Navigation

---

## Database Structure

### projects

| Field   | Type | Description               |
| ------- | ---- | ------------------------- |
| id      | UUID | Unique project identifier |
| title   | Text | Project title             |
| url     | Text | Project URL               |
| user_id | UUID | Owner of the project      |

---

## Application Structure

```text
/components
    ProjectCard.js

/screens
    HomeScreen.js
    AddProjectScreen.js
    DashboardScreen.js

/services
    supabaseClient.js

App.js
```

---

## Main Screens

### Home Screen

* Displays all user projects.
* Shows each project as a card.
* Includes an **Open Project** button.
* Allows project deletion.

### Add Project Screen

* Add a new project by entering:

  * Project title
  * Project URL

### Dashboard Screen

Displays:

* Total number of projects
* Recently added projects
* Simple portfolio statistics

---

## Authentication

The application uses **Supabase Authentication** with email and password.

Each authenticated user can only access their own projects through **Row Level Security (RLS)**.

---

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/portfolio-tracker.git
```

2. Install dependencies

```bash
npm install
```

3. Configure Supabase

Create a `.env` file and add:

```env
EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

4. Start the project

```bash
npx expo start
```

---

## Future Improvements

* Edit existing projects
* Search and filter projects
* Favorite projects
* Project categories
* Dark mode
* Better animations
* Pagination for large project lists

---

## Author

Created as a React Native (Expo) project using Supabase for backend services.
