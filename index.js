require("dotenv").config();
const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  "mailto:your@email.com",
  publicVapidKey,
  privateVapidKey,
);

// Initialize subscriptions array
let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
  console.log(
    "New subscription added. Total subscriptions:",
    subscriptions.length,
  );
});

app.get("/vapidPublicKey", (req, res) => {
  res.json({ publicKey: process.env.PUBLIC_VAPID_KEY });
});

// Serve the send page
app.get("/send", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "send.html"));
});

// Update the send-notification route
app.post("/send-notification", (req, res) => {
  const { title, message, taskId } = req.body;
  const payload = JSON.stringify({ title, body: message, data: { taskId } });

  console.log("Sending notifications to", subscriptions.length, "subscribers");

  Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(subscription, payload),
    ),
  )
    .then(() => {
      console.log("Notifications sent successfully");
      res.status(200).json({ message: "Notifications sent successfully." });
    })
    .catch((err) => {
      console.error("Error sending notifications:", err);
      res.status(500).json({ error: "Failed to send notifications." });
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
