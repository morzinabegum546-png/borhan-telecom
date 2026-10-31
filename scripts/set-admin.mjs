// Run LOCALLY only: node scripts/set-admin.mjs admin@email.com
// Needs: npm i firebase-admin  and  GOOGLE_APPLICATION_CREDENTIALS=/path/serviceAccount.json (never commit it)
import admin from 'firebase-admin'
admin.initializeApp({ credential: admin.credential.applicationDefault() })
const u = await admin.auth().getUserByEmail(process.argv[2])
await admin.auth().setCustomUserClaims(u.uid, { admin: true })
console.log('Admin claim set for', u.uid, '- user must sign out and in again.')
