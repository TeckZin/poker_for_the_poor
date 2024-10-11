
# Poker for the Poor

**Poker for the Poor** is a web-based poker tracking system designed for home games. The application allows users to create a unique "House ID," which serves as a central hub for tracking multiple poker games, or "sessions." These sessions store game details, player statistics, and results, providing an efficient way to monitor and record home poker games over time.

## Key Features

- **House ID Creation**: Organize poker games under a unique house identifier.
- **Session Management**: Track individual games (sessions) played within a house, including participants, results, and stats.
- **Player Profiles**: Track player performance across multiple sessions.
- **Authentication**: Users can sign up, log in, and manage their poker sessions securely with Firebase Authentication.

## Technologies Used

- **Vue.js (TypeScript)**: For building a modular and scalable front-end.
- **Tailwind CSS**: For flexible and efficient styling.
- **Firebase**:
  - **Firestore**: For real-time database management.
  - **Firebase Authentication**: For user sign-up, log-in, and session security.

## Project Structure

\`\`\`bash
.
├── firebase/                  # Firebase configuration and Firestore rules
├── public/                    # Public assets
├── src/                       # Source code for the application
│   ├── assets/                # Styling assets
│   │   └── tailwind.css       # Tailwind configuration
│   ├── components/            # Vue components
│   │   ├── CreateSessionComponent.vue
│   │   ├── InputComponent.vue
│   │   ├── LoginComponent.vue
│   │   ├── SessionDetailComponent.vue
│   │   ├── SignOutBarComponent.vue
│   │   └── SignUpComponent.vue
│   ├── models/                # TypeScript type definitions
│   │   ├── playerTypes.ts
│   │   └── sessionTypes.ts
│   ├── router/                # Vue Router configuration
│   │   └── router.ts
│   ├── store/                 # Vuex Store for state management
│   ├── views/                 # Application views
│   │   ├── AccountPage.vue
│   │   ├── EmailVerificationPage.vue
│   │   ├── HomePage.vue
│   │   ├── HousePage.vue       # Displays house details and sessions
│   │   ├── LoginSignUpPage.vue
│   │   └── NotFoundPage.vue
│   ├── App.vue                # Main Vue component
│   └── main.ts                # Application entry point
├── firestore.rules            # Firestore database rules
├── firebase.json              # Firebase hosting configuration
└── README.md                  # Project documentation
\`\`\`

## Firebase Configuration

1. **Firestore Rules**: Rules for securing access to the Firestore database.
2. **Authentication**: Firebase Authentication is set up for secure login and registration.
