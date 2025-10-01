# PWA with Push Notifications, Capacitor, and Vite

This project is a Progressive Web App (PWA) with push notification support, built with a Node.js backend and a Vite-powered frontend. It's also configured to be wrapped as a native iOS or Android application using Capacitor.

## Features

-   Node.js and Express backend for push notifications.
-   Vite for fast frontend development and optimized builds.
-   Service Worker for offline access and push notifications.
-   Web App Manifest for installability.
-   Capacitor for native iOS and Android builds.

## Project Structure

-   `/frontend`: Contains all the frontend source code (HTML, JS, CSS).
-   `/dist`: The build output directory for the frontend. This is the directory that gets deployed and used by Capacitor.
-   `/index.js`: The backend server.

## Setup and Running

1.  **Install dependencies:**

    ```sh
    npm install
    ```

2.  **Create Environment File:**

    Create a `.env` file in the root of the project for the backend. You can copy the `.env.sample` file:

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

4.  **Run the application:**

    You need to run the backend and frontend in two separate terminals.

    **Terminal 1: Start the backend**

    ```sh
    npm run start:backend
    ```

    **Terminal 2: Start the frontend**

    ```sh
    npm run dev
    ```

    The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).

## API Configuration

The frontend uses Vite's environment variables to connect to the backend API.

-   **For local development**, no configuration is needed. The Vite dev server will proxy API requests to the backend running on `http://localhost:3000`.

-   **For production or native apps**, you need to create a `.env.production` file in the project root and set the `VITE_API_URL` to the URL of your deployed backend:

    ```
    VITE_API_URL=https://your-api.com
    ```

## Capacitor (Native Apps)

To build a native iOS or Android app, you can use Capacitor.

1.  **Build the frontend:**

    Before adding a platform or syncing, you need to create a production build of the frontend.

    ```sh
    npm run build
    ```

2.  **Add a platform:**

    ```sh
    npx cap add ios
    npx cap add android
    ```

3.  **Sync your web app with the native project:**

    The `sync` command will copy the contents of the `dist` directory into the native project.

    ```sh
    npx cap sync
    ```

4.  **Open the native project:**

    ```sh
    npx cap open ios
    npx cap open android
    ```

5.  **Run the app:**

    You can run the app from Xcode or Android Studio.

    **Important Note on Push Notifications:** The current push notification implementation uses the Web Push Protocol, which works for web browsers but **not** for native iOS apps. To enable push notifications on the native iOS app, you will need to configure Apple's Push Notification service (APNs) and use a library like `@capacitor/push-notifications` to handle them.

## Deployment

-   **Frontend**: Build the frontend using `npm run build` and deploy the contents of the `dist` directory to a static hosting service like Netlify, Vercel, or GitHub Pages.
-   **Backend**: The Node.js server can be deployed to a platform like Heroku, Render, or a VPS.

When deploying separately, remember to:
1.  Set the `VITE_API_URL` in your production environment (e.g., in a `.env.production` file or your hosting provider's settings) to point to your backend's URL.
2.  Configure CORS on the backend to allow requests from your frontend's domain.

## Live Updates (Remote Loading)

You can configure your native app to load the web content from a remote server, allowing you to deploy updates to your frontend without resubmitting to the App Store.

**Note:** This method does not have an offline fallback. If the remote server is unreachable, the app will not load. For a more robust solution with offline support, consider using a service like [Capacitor Appflow](https://capacitorjs.com/appflow).

To enable remote loading:

1.  **Build and Deploy Frontend:**
    Build your frontend for production:
    ```sh
    npm run build
    ```
    Deploy the contents of the `dist` directory to a static hosting service (e.g., Netlify, Vercel).

2.  **Configure `capacitor.config.json`:**
    Add a `server` object to your `capacitor.config.json` file, pointing to the URL of your deployed frontend.

    ```json
    {
      "appId": "com.mypushpwa.app",
      "appName": "Push PWA",
      "webDir": "dist",
      "server": {
        "url": "https://your-deployed-pwa.com",
        "cleartext": false
      }
    }
    ```
    -   Replace `"https://your-deployed-pwa.com"` with your actual deployment URL.
    -   `"cleartext": false` is a security measure that prevents the app from loading content from unencrypted `http://` URLs.

3.  **Sync and Run:**
    Sync your Capacitor project and run your native app. It will now load the content from the remote URL.

    ```sh
    npx cap sync
    npx cap open ios
    ```
