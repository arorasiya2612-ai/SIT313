const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const FormData = require("form-data");
const Mailgun = require("mailgun.js");

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static("."));

// Mailgun setup
const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY
});

// Subscribe route
app.post("/subscribe", async function (req, res) {

    const email = req.body.email;

    console.log("Subscriber:", email);

    if (!email) {
        return res.status(400).send("Email is required.");
    }

    try {

        const response = await mg.messages.create(
            process.env.MAILGUN_DOMAIN,
            {
                from: `DEV@Deakin <postmaster@${process.env.MAILGUN_DOMAIN}>`,
                to: [email],
                subject: "Welcome to DEV@Deakin",
                text: "Welcome to DEV@Deakin! Thank you for subscribing to our Daily Insider.",
                html: `
                    <h2>Welcome to DEV@Deakin!</h2>
                    <p>Thank you for subscribing to our Daily Insider.</p>
                    <p>You will now receive our latest updates and news.</p>
                `
            }
        );

        console.log("Mailgun response:", response);

        res.status(200).send("Subscription successful! Welcome email sent.");

    } catch (error) {

        console.error("Mailgun error:", error);

        res.status(500).send("Failed to send welcome email.");

    }

});

app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`);
});