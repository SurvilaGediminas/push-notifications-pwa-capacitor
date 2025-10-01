require("dotenv").config();
const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ subscriptions: [] }).write();

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

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  db.get("subscriptions").push(subscription).write();
  res.status(201).json({});
  console.log(
    "New subscription added. Total subscriptions:",
    db.get("subscriptions").size().value(),
  );
});

app.post("/unsubscribe", (req, res) => {
  const subscription_to_delete = req.body;
  db.get("subscriptions")
    .remove({ endpoint: subscription_to_delete.endpoint })
    .write();
  res.status(200).json({});
  console.log(
    "Subscription removed. Total subscriptions:",
    db.get("subscriptions").size().value(),
  );
});

app.get("/vapidPublicKey", (req, res) => {
  res.json({ publicKey: process.env.PUBLIC_VAPID_KEY });
});

app.get("/send", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "send.html"));
});

app.post("/send-notification", (req, res) => {
  const { title, message, taskId } = req.body;
  const payload = JSON.stringify({ title, body: message, data: { taskId } });
  const subscriptions = db.get("subscriptions").value();

  console.log("Sending notifications to", subscriptions.length, "subscribers");

  Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(subscription, payload).catch((err) => {
        if (err.statusCode === 410) {
          console.log("Subscription has expired or is no longer valid: ", err);
          return db
            .get("subscriptions")
            .remove({ endpoint: subscription.endpoint })
            .write();
        } else {
          console.error("Error sending notification:", err);
        }
      }),
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