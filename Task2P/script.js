console.log("SCRIPT.JS IS WORKING");
const subscribeForm = document.getElementById("subscribeForm");
const subscribeMessage = document.getElementById("subscribeMessage");

console.log("FORM:", subscribeForm);
subscribeForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    console.log("SUBMIT BUTTON WORKED");

    const email = document.getElementById("email").value;

    console.log("EMAIL:", email);

    const formData = new URLSearchParams();
    formData.append("email", email);

    try {

        const response = await fetch("/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        const result = await response.text();

        if (response.ok) {
            subscribeMessage.textContent =
                "Successfully subscribed! Please check your email.";
            subscribeForm.reset();
        } else {
            subscribeMessage.textContent =
                result || "Subscription failed.";
        }

    } catch (error) {

        console.error(error);

        subscribeMessage.textContent =
            "Unable to connect to the server.";

    }

});