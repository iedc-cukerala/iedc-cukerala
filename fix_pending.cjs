const admin = require('firebase-admin');
const serviceAccount = require('/home/hp/Downloads/iedc-cuk-firebase-adminsdk-fbsvc-8d4794c967.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

async function fix() {
  const leadsSnap = await db.collection('leads').get();
  let fixed = 0;
  for (const doc of leadsSnap.docs) {
    const data = doc.data();
    console.log(`Lead: ${data.email} | Status: ${data.status} | UID: ${data.uid}`);
    if (data.status === 'pending') {
      await db.collection('leads').doc(doc.id).update({ status: 'active' });
      fixed++;
      console.log(`-> Changed status to active for ${data.email}`);
    }
  }
  
  // Let's also forcefully clean any ghost admins whose emails are NOT in the leads list
  const activeLeadEmails = new Set();
  leadsSnap.forEach(doc => {
    activeLeadEmails.add(doc.data().email.toLowerCase());
  });
  
  const adminsSnap = await db.collection('admins').get();
  let deletedGhosts = 0;
  for (const doc of adminsSnap.docs) {
    const adminData = doc.data();
    if (adminData.isLead === true) {
      if (!activeLeadEmails.has(adminData.email.toLowerCase())) {
        await db.collection('admins').doc(doc.id).delete();
        deletedGhosts++;
        console.log(`-> Deleted ghost admin for ${adminData.email}`);
      }
    }
  }

  console.log(`Fixed ${fixed} pending leads. Deleted ${deletedGhosts} ghosts.`);
  process.exit(0);
}

fix().catch(console.error);
