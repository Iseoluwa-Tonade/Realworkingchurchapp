const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Set the SendGrid API key from the environment variables
sgMail.setApiKey(functions.config().sendgrid.key);

// This is the email address that will receive the notification alerts.
const ADMIN_EMAIL = "your-admin-email@example.com"; // <-- IMPORTANT: Change this to your admin email
const FROM_EMAIL = "notifications@your-church-domain.com"; // <-- IMPORTANT: Change this to a verified SendGrid sender

/**
 * This Cloud Function triggers when a member's status is updated.
 * It sends an email notification to the administrator.
 */
exports.runMemberStatusAutomation = onDocumentUpdated("churches/{churchId}/members/{memberId}", async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();

    if (beforeData.status === afterData.status) {
        functions.logger.log("Status has not changed for member:", event.params.memberId);
        return null;
    }

    functions.logger.log(`Status for ${afterData.name} changed to ${afterData.status}`);

    const msg = {
        to: ADMIN_EMAIL,
        from: FROM_EMAIL,
        subject: `Member Status Update: ${afterData.name}`,
        html: `
            <p>Hello Admin,</p>
            <p>The status for church member <strong>${afterData.name}</strong> has been updated from <strong>${beforeData.status}</strong> to <strong>${afterData.status}</strong>.</p>
            <p>You can view their profile in the church management app.</p>
            <p>Thank you,</p>
            <p>Your Church App</p>
        `,
    };

    try {
        await sgMail.send(msg);
        functions.logger.log("Admin notification email sent successfully.");
    } catch (error) {
        functions.logger.error("Error sending admin notification email:", error);
    }

    return null;
});


/**
 * This is a placeholder for an "on-call" Cloud Function.
 * The client-side "Email Sender" would call this function to securely send emails.
 * This prevents exposing API keys or service credentials on the client side.
 *
 * You would need to integrate an email sending service like SendGrid, Mailgun, etc.
 */
exports.sendEmailToMembers = functions.https.onCall(async (data, context) => {
    // 1. Check for authentication.
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    const { recipientEmails, subject, body } = data;

    // 2. Validate the data.
    if (!Array.isArray(recipientEmails) || !subject || !body) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with recipientEmails, subject, and body."
        );
    }

    // 3. Check user's role (optional but recommended).
    // const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    // const userRole = userDoc.data().role;
    // if (userRole !== 'admin' && userRole !== 'leader') {
    //     throw new functions.https.HttpsError(
    //         "permission-denied",
    //         "You do not have permission to send emails."
    //     );
    // }

    // 4. Integrate with your email provider (e.g., SendGrid).
    console.log("--- SENDING EMAIL (SIMULATED) ---");
    console.log("Recipients:", recipientEmails.join(", "));
    console.log("Subject:", subject);
    console.log("Body:", body);
    console.log("---------------------------------");

    // Example with a real service:
    // const msg = { to: recipientEmails, from: 'no-reply@your-church.com', subject, html: body };
    // await sgMail.send(msg);

    return { success: true, message: `Email sent to ${recipientEmails.length} recipients.` };
});
