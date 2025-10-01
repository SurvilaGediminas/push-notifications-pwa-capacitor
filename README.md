# PWA with Push Notifications and Capacitor

This project is a Progressive Web App (PWA) with push notification support, and it's also configured to be wrapped as a native iOS or Android application using Capacitor.

## Features

-   Service Worker for offline access and push notifications
-   Web App Manifest for installability
-   Push notifications using VAPID keys
-   Capacitor for native iOS and Android builds

## Setup and Running

1.  **Install dependencies:**

    ```sh
    npm install
    ```

2.  **Create Environment File:**

    Create a `.env` file in the root of the project. You can copy the `.env.sample` file:

    ```sh
    cp .env.sample .env
    ```

3.  **Generate VAPID keys:**

    ```sh
    node generate-vapid-keys.js
    ```

    Copy the generated `publicKey` and `privateKey` to your `.env` file:

    ```
    PUBLIC_VAPID_KEY="Your_Public_VAPID_Key"
    PRIVATE_VAPID_KEY="Your_Private_VAPID_Key"
    ```

4.  **Start the server for local development:**

    ```sh
    npm start
    ```

5.  **Access the app:**
    -   Open [http://localhost:3000](http://localhost:3000) in your browser.
    -   Click "Subscribe to Notifications" to enable push notifications.
    -   Use the "Send Notification" page ([http://localhost:3000/send](http://localhost:3000/send)) to send push messages.

## API Configuration

The frontend needs to know the URL of the backend API. This is configured in the `public/config.js` file.

-   **For local development**, the `API_URL` should be `http://localhost:3000`:

    ```javascript
    // public/config.js
    const API_URL = 'http://localhost:3000';
    ```

-   **For production or native apps**, you should change this to the URL of your deployed backend:

    ```javascript
    // public/config.js
    const API_URL = 'https://your-api.com';
    ```

## Capacitor (Native Apps)

To build a native iOS or Android app, you can use Capacitor.

1.  **Add a platform:**

    ```sh
    npx cap add ios
    npx cap add android
    ```

2.  **Sync your web app with the native project:**

    Before building your native app, you need to sync your web assets. Make sure you have updated the `API_URL` in `public/config.js` to your production API endpoint.

    ```sh
    npx cap sync
    ```

3.  **Open the native project:**

    ```sh
    npx cap open ios
    npx cap open android
    ```

4.  **Run the app:**

    You can run the app from Xcode or Android Studio.

    **Important Note on Push Notifications:** The current push notification implementation uses the Web Push Protocol, which works for web browsers but **not** for native iOS apps. To enable push notifications on the native iOS app, you will need to configure Apple's Push Notification service (APNs) and use a library like `@capacitor/push-notifications` to handle them.

## Deployment

It is recommended to deploy the frontend and backend separately.

-   **Frontend**: The `public` directory can be deployed to a static hosting service like Netlify, Vercel, or GitHub Pages.
-   **Backend**: The Node.js server can be deployed to a platform like Heroku, Render, or a VPS.

When deploying separately, remember to:
1.  Configure the `API_URL` in `public/config.js` to point to your backend's URL.
2.  Configure CORS on the backend to allow requests from your frontend's domain.