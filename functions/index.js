const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * This is a placeholder for a Cloud Function that would be triggered
 * when a member's status is updated in Firestore. This is the "backend"
 * for the "Automations" feature.
 *
 * For example, if a member's status changes to 'Sick', this function could
 * trigger sending a pre-defined email or WhatsApp message.
 */
exports.runMemberStatusAutomation = functions.firestore
    .document("churches/{churchId}/members/{memberId}")
    .onUpdate(async (change, context) => {
        const { churchId, memberId } = context.params;
        const beforeData = change.before.data();
        const afterData = change.after.data();

        // Check if the status has actually changed
        if (beforeData.status === afterData.status) {
            console.log(`Status for member ${memberId} in church ${churchId} has not changed.`);
            return null;
        }

        console.log(`Status for member ${memberId} changed to ${afterData.status}`);

        // 1. Query the 'automations' sub-collection for a matching rule.
        // const automationsRef = admin.firestore().collection(`churches/${churchId}/automations`);
        // const snapshot = await automationsRef.where('trigger.status', '==', afterData.status).get();

        // if (snapshot.empty) {
        //     console.log("No matching automation found.");
        //     return null;
        // }

        // 2. For each matching rule, execute the action (e.g., send email).
        // snapshot.forEach(doc => {
        //     const rule = doc.data();
        //     console.log(`Executing action: ${rule.action.type} for rule: ${rule.name}`);
        //     // Here you would integrate with an email service like SendGrid or a WhatsApp API.
        // });

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
