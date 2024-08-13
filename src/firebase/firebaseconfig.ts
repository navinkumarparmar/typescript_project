import admin from 'firebase-admin';
import * as serviceAccount from '../config/serviceAccount.json'; // Adjust the path accordingly

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com'
});

export default admin;
