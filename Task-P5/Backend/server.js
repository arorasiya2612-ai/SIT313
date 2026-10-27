const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Mailjet = require("node-mailjet");

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));


// Mailjet setup
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);

// Subscribe route
app.post("/subscribe", async function (req, res) {

    const email = req.body.email;

    console.log("Subscriber:", email);

   if (typeof email !== "string" || !email.trim()) {
    return res.status(400).send("Email is required.");
}

const cleanEmail = email.trim();

if (
    !cleanEmail.includes("@") ||
    !cleanEmail.includes(".") ||
    cleanEmail.includes(" ") ||
    cleanEmail.startsWith("@") ||
    cleanEmail.endsWith("@")
) {
    return res.status(400).send("Please enter a valid email address.");
}
    try {

        const request = mailjet
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "arorasiya2612@gmail.com",
                            Name: "DEV@Deakin"
                        },

                        To: [
                            {
                                Email: cleanEmail
                            }
                        ],

                        Subject: "Welcome to DEV@Deakin",

                        TextPart:
                            "Welcome to DEV@Deakin! Thank you for subscribing to our Daily Insider.",

                        HTMLPart: `
                            <h2>Welcome to DEV@Deakin!</h2>

                            <p>
                                Thank you for subscribing to our Daily Insider.
                            </p>

                            <p>
                                You will now receive our latest updates and news.
                            </p>
                        `
                    }
                ]
            });

        const response = await request;
        console.log("Mailjet HTTP Status:", response.response.status);

console.log("Email sent successfully!");
console.log("Recipient:", cleanEmail);
console.log("Mailjet Status:", response.body.Messages[0].Status);

res.status(200).send("Subscription successful! Welcome email sent.");


    } catch (error) {

        console.error("Mailjet error:", error);

        res
            .status(500)
            .send("Failed to send welcome email.");
    }
});

app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`);
});