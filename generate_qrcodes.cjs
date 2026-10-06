const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Initialize Firebase Admin SDK
const serviceAccount = require('/home/hp/Downloads/iedc-cuk-firebase-adminsdk-fbsvc-8d4794c967.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// Output directory
const outputDir = '/home/hp/Downloads/Lead_QRCodes';

// Slugify helper
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

async function generateQRCodes() {
    try {
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir, { recursive: true });
        }

        console.log("Fetching active leads from Firestore...");
        const snapshot = await db.collection('leads').where('status', '==', 'active').get();
        
        if (snapshot.empty) {
            console.log('No active leads found.');
            return;
        }

        console.log(`Found ${snapshot.size} active leads. Generating QR codes...`);
        
        for (const doc of snapshot.docs) {
            const lead = doc.data();
            if (!lead.name || !lead.role) continue;

            const profileUrl = `https://iedc-cuk.web.app/lead/${slugify(lead.role)}`;
            
            // Clean up name for file naming
            const safeName = lead.name.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, '_');
            const safeRole = lead.role.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, '_');
            
            const fileName = `${safeName}_${safeRole}_QRCode.png`;
            const filePath = path.join(outputDir, fileName);

            // Generate QR code
            await QRCode.toFile(filePath, profileUrl, {
                color: {
                    dark: '#000000',  // Black dots
                    light: '#FFFFFF' // White background
                },
                width: 500,
                margin: 2
            });

            console.log(`Generated QR Code for ${lead.name} -> ${fileName}`);
        }
        
        console.log(`All QR codes successfully saved to ${outputDir}`);
    } catch (error) {
        console.error("Error generating QR codes:", error);
    }
}

generateQRCodes();
