const admin = require('firebase-admin');
const serviceAccount = require('/home/hp/Downloads/iedc-cuk-firebase-adminsdk-fbsvc-8d4794c967.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanup() {
  const adminsSnap = await db.collection('admins').get();
  const leadsSnap = await db.collection('leads').get();

  const activeLeadEmails = new Set();
  leadsSnap.forEach(doc => {
    activeLeadEmails.add(doc.data().email.toLowerCase());
  });

  let deleted = 0;
  for (const doc of adminsSnap.docs) {
    const adminData = doc.data();
    if (adminData.isLead === true) {
      if (!activeLeadEmails.has(adminData.email.toLowerCase())) {
        console.log(`Ghost admin found: ${adminData.email}. Deleting...`);
        await db.collection('admins').doc(doc.id).delete();
        deleted++;
      }
    }
  }
  console.log(`Cleanup complete. Deleted ${deleted} ghost admins.`);
  process.exit(0);
}

cleanup().catch(console.error);
