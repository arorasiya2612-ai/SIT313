
const express = require("express");
const dotenv = require("dotenv");
const Mailjet = require("node-mailjet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.on("finish", () => {
        console.log(
            `${req.method} ${req.originalUrl} - HTTP Status: ${res.statusCode}`
        );
    });

    next();
});

// --------------------------------------------------
// FIREBASE ADMIN SETUP
// --------------------------------------------------

const serviceAccountPath = path.resolve(
  __dirname,
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    "./serviceAccountKey.json"
);

const serviceAccount = require(serviceAccountPath);

const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount)
    });

const db = getFirestore(firebaseApp);
const usersCollection = db.collection("users");

// --------------------------------------------------
// MAILJET SETUP
// --------------------------------------------------

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

// --------------------------------------------------
// VALIDATE EMAIL
// --------------------------------------------------

function isValidEmail(email) {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

// --------------------------------------------------
// AUTHENTICATE JWT
// --------------------------------------------------

function authenticateToken(req, res, next) {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing from .env");

    return res.status(500).json({
      message: "Server authentication is not configured."
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please log in first."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your session is invalid or has expired. Please log in again."
    });
  }
}

// --------------------------------------------------
// 1. REGISTER
// POST /api/register
// --------------------------------------------------

app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      !isValidEmail(email) ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Enter a name, a valid email and a password of at least 8 characters."
      });
    }

    if (
      confirmPassword !== undefined &&
      password !== confirmPassword
    ) {
      return res.status(400).json({
        message: "Passwords do not match."
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await usersCollection
      .where("email", "==", cleanEmail)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await usersCollection.add({
      fullName: fullName.trim(),
      email: cleanEmail,
      passwordHash,
      plan: "free",
      createdAt: FieldValue.serverTimestamp()
    });

    return res.status(201).json({
      message: "Account created successfully. Please log in."
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Unable to create your account. Please try again."
    });
  }
});

// --------------------------------------------------
// 2. LOGIN
// POST /api/login
// --------------------------------------------------

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      !isValidEmail(email) ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Enter a valid email and password."
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const userSnapshot = await usersCollection
      .where("email", "==", cleanEmail)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    if (
      typeof userData.passwordHash !== "string" ||
      !(await bcrypt.compare(password, userData.passwordHash))
    ) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = jwt.sign(
      {
        uid: userDoc.id,
        email: userData.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: userDoc.id,
        fullName: userData.fullName,
        email: userData.email,
        plan: userData.plan || "free"
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to log in. Please try again."
    });
  }
});

// --------------------------------------------------
// 3. GET CURRENT USER
// GET /api/me
// --------------------------------------------------

app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const userDoc = await usersCollection.doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: "User account not found."
      });
    }

    const userData = userDoc.data();

    return res.json({
      user: {
        id: userDoc.id,
        fullName: userData.fullName,
        email: userData.email,
        plan: userData.plan || "free"
      }
    });
  } catch (error) {
    console.error("Current user error:", error);

    return res.status(500).json({
      message: "Unable to retrieve your account."
    });
  }
});

// --------------------------------------------------
// 4. UPGRADE FREE USER TO PAID
// POST /api/upgrade
// Demonstration only; no real payment is processed.
// --------------------------------------------------

app.post("/api/upgrade", authenticateToken, async (req, res) => {
  try {
    const { cardholderName, cardNumber, expiry, cvv } = req.body;

    if (
      typeof cardholderName !== "string" ||
      cardholderName.trim().length < 2 ||
      typeof cardNumber !== "string" ||
      !/^\d{16}$/.test(cardNumber.replace(/\s/g, "")) ||
      typeof expiry !== "string" ||
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ||
      typeof cvv !== "string" ||
      !/^\d{3,4}$/.test(cvv)
    ) {
      return res.status(400).json({
        message: "Please enter valid demonstration payment details."
      });
    }

    const userRef = usersCollection.doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: "User account not found."
      });
    }

    if ((userDoc.data().plan || "free") === "paid") {
      return res.status(409).json({
        message: "Your account is already on the Paid plan."
      });
    }

    // Never store payment-card details in Firestore.
    await userRef.update({
      plan: "paid",
      upgradedAt: FieldValue.serverTimestamp()
    });

    return res.json({
      message: "Your account has been upgraded to the Paid plan.",
      plan: "paid"
    });
  } catch (error) {
    console.error("Upgrade error:", error);

    return res.status(500).json({
      message: "Unable to upgrade your plan. Please try again."
    });
  }
});

// --------------------------------------------------
// 5. EXISTING NEWSLETTER ROUTE
// POST /subscribe
// --------------------------------------------------

app.post("/subscribe", async (req, res) => {
  const email = req.body.email;

  if (!isValidEmail(email)) {
    return res.status(400).send(
      "Please enter a valid email address."
    );
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const response = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "arorasiya2612@gmail.com",
              Name: "DEV@Deakin"
            },
            To: [{ Email: cleanEmail }],
            Subject: "Welcome to DEV@Deakin",
            TextPart:
              "Welcome to DEV@Deakin! Thank you for subscribing to our Daily Insider.",
            HTMLPart: `
              <h2>Welcome to DEV@Deakin!</h2>
              <p>Thank you for subscribing to our Daily Insider.</p>
              <p>You will now receive our latest updates and news.</p>
            `
          }
        ]
      });

    console.log(
      "Mailjet status:",
      response.body.Messages[0].Status
    );

    return res.status(200).send(
      "Subscription successful! Welcome email sent."
    );
  } catch (error) {
    console.error("Mailjet error:", error);

    return res.status(500).send(
      "Failed to send welcome email."
    );
  }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
