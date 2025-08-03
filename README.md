# Church Management System

This is a comprehensive church management application designed to help church administrators and leaders manage their congregation effectively. It's built with a modern tech stack and provides a suite of tools for member management, communication, resource sharing, and financial tracking.

## Features

- **Dashboard**: An at-a-glance overview of key church metrics, including member counts, attendance trends, and recent giving.
- **Member Management**: A complete directory of church members. Add new members, view and edit profiles, and track member status (e.g., Active, Sick, Traveled).
- **Group Management**: Create and manage small groups, ministry teams, or classes. Each group has its own member list and a dedicated real-time chat.
- **Attendance Tracking**: Log attendance for services and events, either by a simple headcount or by checking in individual members.
- **Giving & Donations**: Record tithes and offerings from members, categorized by fund (e.g., Tithes & Offerings, Building Fund).
- **Resource Hub**: Publish and manage resources for your church, such as daily devotions and sermon outlines.
- **Communication Tools**:
    - **Internal Notes**: Log communications with members to keep your team aligned.
    - **Email Sender**: Compose and send emails to the entire congregation or to specific filtered groups.
- **Automations**: Create rules to automate follow-ups. For example, automatically trigger a "thinking of you" message when a member's status is marked as "Sick."
- **Role-Based Access Control (RBAC)**: The application is designed for multiple users with different roles (e.g., `admin`, `leader`). Access to sensitive information and features is restricted based on the logged-in user's role.
- **Dark Mode**: A sleek dark mode for comfortable viewing in low-light environments.

## Tech Stack

### Frontend

- **Framework**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charting**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend

- **Platform**: [Firebase](https://firebase.google.com/)
- **Database**: [Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Serverless Functions**: [Firebase Cloud Functions](https://firebase.google.com/docs/functions)

## Project Setup

To run this project locally, you will need to have [Node.js](https://nodejs.org/) and `npm` installed.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

Install all the necessary frontend packages.

```bash
npm install
```

### 3. Set up Firebase

This project requires a Firebase project to handle the backend.

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Firestore**: In the Firebase console, go to the "Firestore Database" section and create a database.
3.  **Enable Authentication**: Go to the "Authentication" section and enable at least one sign-in method (e.g., Email/Password).
4.  **Get Firebase Config**: In your project settings, find your web app's Firebase configuration snippet. It will look something like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "...",
      appId: "..."
    };
    ```
5.  **Create an Environment File**: In the root of the project, create a file named `.env.local` and add your Firebase config variables to it. The `react-scripts` build system will automatically pick these up.

    ```
    REACT_APP_FIREBASE_API_KEY="AIza..."
    REACT_APP_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
    REACT_APP_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="..."
    REACT_APP_FIREBASE_APP_ID="..."
    ```
    You will then need to update `src/firebase/config.js` to read from these environment variables instead of the placeholder `__firebase_config`.

### 4. Deploy Backend Rules and Functions

- **Firestore Rules**: Deploy the security rules defined in `firestore.rules` to your Firebase project using the Firebase CLI.
  ```bash
  firebase deploy --only firestore:rules
  ```
- **Cloud Functions**: Deploy the backend functions located in the `functions` directory.
  ```bash
  cd functions
  npm install
  cd ..
  firebase deploy --only functions
  ```

### 5. Run the Application

Once the dependencies are installed and your environment is configured, you can start the local development server.

```bash
npm start
```

The application should now be running on `http://localhost:3000`.
