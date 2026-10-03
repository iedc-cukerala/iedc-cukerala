const admin = require('firebase-admin');
const serviceAccount = require('/home/hp/Downloads/iedc-cuk-firebase-adminsdk-fbsvc-8d4794c967.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

async function cleanGhosts() {
  const leadsSnap = await db.collection('leads').get();
  const activeLeadEmails = new Set();
  leadsSnap.forEach(doc => {
    activeLeadEmails.add(doc.data().email.toLowerCase());
  });
  activeLeadEmails.add('iedctech@cukerala.ac.in'); // Never delete superadmin

  const adminsSnap = await db.collection('admins').get();
  let deletedGhosts = 0;
  for (const doc of adminsSnap.docs) {
    const adminData = doc.data();
    if (adminData.email && !activeLeadEmails.has(adminData.email.toLowerCase())) {
      await db.collection('admins').doc(doc.id).delete();
      deletedGhosts++;
      console.log(`-> NUKE GHOST ADMIN: ${adminData.email}`);
    }
  }

  console.log(`Cleanup complete. Deleted ${deletedGhosts} ghosts.`);
  process.exit(0);
}

cleanGhosts().catch(console.error);
