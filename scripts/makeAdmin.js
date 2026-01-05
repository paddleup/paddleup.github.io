
import admin from "firebase-admin";

const certLocation = import.meta.env.VITE_FIREBASE_CERT_LOCATION;
const uid = import.meta.env.VITE_FIREBASE_ADMIN_UID;

admin.initializeApp({
  credential: admin.credential.cert(certLocation),
});

admin.auth().setCustomUserClaims(uid, { admin: true }).then(() => {
  console.log("User is now an admin");
});
