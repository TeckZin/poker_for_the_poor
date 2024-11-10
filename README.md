# Poker for the Poor

**Poker for the Poor** is a web-based poker tracking system designed for home games. The application allows users to create a unique "House ID," which serves as a central hub for tracking multiple poker games, or "sessions." These sessions store game details, player statistics, and results, providing an efficient way to monitor and record home poker games over time.

## Key Features
* **House ID Creation**: Organize poker games under a unique house identifier.
* **Session Management**: Track individual games (sessions) played within a house, including participants, results, and stats.
* **Player Profiles**: Track player performance across multiple sessions.
* **Authentication**: Users can sign up, log in, and manage their poker sessions securely with Firebase Authentication.

## Technologies Used
* **Vue.js (TypeScript)**: For building a modular and scalable front-end.
* **Tailwind CSS**: For flexible and efficient styling.
* **Firebase**:
   * **Firestore**: For real-time database management.
   * **Firebase Authentication**: For user sign-up, log-in, and session security.

## Project Structure
```
.
├── src/                       # Source code for the application
│   ├── App.vue               # Main Vue component
│   ├── assets/               # Styling assets
│   │   └── tailwind.css      # Tailwind configuration
│   ├── components/           # Vue components
│   │   ├── AccountComponents/
│   │   │   ├── LoginComponent.vue
│   │   │   ├── SignOutBarComponent.vue
│   │   │   └── SignUpComponent.vue
│   │   ├── HomeComponents/
│   │   │   └── InputComponent.vue
│   │   ├── HouseComponents/
│   │   │   ├── HostedHouseListComponent.vue
│   │   │   └── HouseStatsComponent.vue
│   │   └── SessionComponents/
│   │       ├── SessionDetailComponent.vue
│   │       ├── SessionEditComponent.vue
│   │       ├── SessionsHouseListComponent.vue
│   │       └── SessionsPlayedListComponent.vue
│   ├── models/               # TypeScript type definitions
│   │   ├── HouseTypes.ts
│   │   ├── PlayerTypes.ts
│   │   └── SessionTypes.ts
│   ├── router/              # Vue Router configuration
│   │   └── router.ts
│   ├── shims-vue.d.ts      # Vue TypeScript declarations
│   ├── store/              # Vuex Store for state management
│   ├── views/              # Application views
│   │   ├── AccountView/
│   │   │   ├── AccountEditPage.vue
│   │   │   ├── AccountPage.vue
│   │   │   └── LoginSignUpPage.vue
│   │   ├── HomeView/
│   │   │   └── HomePage.vue
│   │   ├── HouseView/
│   │   │   ├── CreateHousePage.vue
│   │   │   ├── HousePage.vue
│   │   │   └── ViewHousePage.vue
│   │   ├── OtherView/
│   │   │   ├── EmailVerificationPage.vue
│   │   │   └── NotFoundPage.vue
│   │   └── SessionView/
│   │       ├── CreateSessionPage.vue
│   │       ├── EditSessionPage.vue
│   │       └── SessionDetailPage.vue
│   └── main.ts             # Application entry point
```

## Firebase Configuration
1. **Firestore Rules**: Rules for securing access to the Firestore database.
2. **Authentication**: Firebase Authentication is set up for secure login and registration.
