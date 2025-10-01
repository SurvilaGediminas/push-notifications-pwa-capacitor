# push-notifications

## Progressive Web App (PWA) Features

This project is a PWA with push notification support.

### Features

- Service Worker for offline access and push notifications
- Web App Manifest for installability
- Push notifications using VAPID keys

### Setup

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Generate VAPID keys:**

   ```sh
   node generate-vapid-keys.js
   ```

   Copy the generated keys to a `.env` file:

   ```
   PUBLIC_VAPID_KEY="Your_Public_VAPID_Key"
   PRIVATE_VAPID_KEY="Your_Private_VAPID_Key"
   ```

3. **Start the server:**

   ```sh
   npm start
   ```

4. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
   - Click "Subscribe to Notifications" to enable push notifications.
   - Use the "Send Notification" page to send push messages.

### PWA Usage

- You can install the app to your device from your browser.
- The app works offline and receives push notifications.

### Development Notes

- Service worker caches static assets for offline use.
- Push notifications require HTTPS in production.
