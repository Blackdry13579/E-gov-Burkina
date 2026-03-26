const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const { uploadToCloudinary } = require('../config/cloudinary');
const logger = require('./logger');

const IMAGES_DIR = path.join(__dirname, '../templates/images');

// Fonction pour obtenir le chemin d'une image
const getImagePath = (filename) => {
  const imgPath = path.join(IMAGES_DIR, filename);
  return fs.existsSync(imgPath) ? imgPath : null;
};

/**
 * Génère un PDF à partir des données de la demande en utilisant PDFKit (plus léger que Puppeteer)
 */
const generateDocumentPDF = async (demande, agent) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Document E-Gov - ${demande.reference}`,
          Author: 'E-Gov Burkina Faso'
        }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(chunks);
        try {
          const result = await uploadBufferToCloudinary(pdfBuffer, demande);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });

      // --- DONNÉES ---
      const d = demande.donnees || {};
      const serviceCode = demande.service?.code || '';
      const isJustice = serviceCode.includes('NAT') || serviceCode.includes('CASIER') || demande.service?.nom?.toLowerCase().includes('justice');
      
      const region = (d.region || 'CENTRE').toUpperCase();
      const province = (d.province || 'KADIOGO').toUpperCase();
      const commune = (d.commune || 'OUAGADOUGOU').toUpperCase();
      const reference = demande.reference;
      const issueDate = d.date_acte_original || new Date().toLocaleDateString('fr-FR');

      // --- EN-TÊTE ---
      // Gauche
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text(`RÉGION DU ${region}`, 50, 50, { width: 150, align: 'center' });
      doc.text('-=-=-=-=-=-', { width: 150, align: 'center' });
      doc.text(`PROVINCE DU ${province}`, { width: 150, align: 'center' });
      doc.text('-=-=-=-=-=-', { width: 150, align: 'center' });
      doc.text(`COMMUNE DE ${commune}`, { width: 150, align: 'center' });
      doc.text('-=-=-=-=-=-', { width: 150, align: 'center' });
      doc.text(isJustice ? 'TRIBUNAL' : 'MAIRIE', { width: 150, align: 'center' });
      doc.text('-=-=-=-=-=-', { width: 150, align: 'center' });
      doc.text(isJustice ? 'SERVICE CIVIL' : 'ETAT CIVIL', { width: 150, align: 'center' });

      // Centre (Armoiries)
      const coatPath = getImagePath('filigrane.jpg');
      if (coatPath) {
        doc.image(coatPath, 257, 45, { width: 80 });
      }

      // Droite
      doc.fontSize(14).font('Helvetica-Bold');
      doc.text('BURKINA FASO', 395, 55, { width: 150, align: 'center' });
      doc.fontSize(9).font('Helvetica-Oblique');
      doc.text('Unité – Progrès – Justice', { width: 150, align: 'center' });

      // --- TITRE ---
      doc.moveDown(4);
      let title = "EXTRAIT D'ACTE DE NAISSANCE";
      if (serviceCode.includes('CASIER')) title = "EXTRAIT DU CASIER JUDICIAIRE\n(Bulletin N°3)";
      if (serviceCode.includes('NAT')) title = "CERTIFICAT DE NATIONALITÉ\nBURKINABÈ";

      doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e');
      doc.text(title, 50, 220, { align: 'center' });
      doc.fontSize(12).font('Helvetica').fillColor('black');
      doc.text(`N° ${reference} du ${issueDate}`, { align: 'center' });

      // --- CORPS DU DOCUMENT ---
      doc.moveDown(3);
      const fieldYStart = 320;
      let currentY = fieldYStart;

      const drawField = (label, value) => {
        doc.fontSize(12).font('Helvetica-Bold').text(label, 70, currentY);
        doc.font('Helvetica').text(value.toUpperCase() || '---', 180, currentY);
        doc.moveTo(180, currentY + 12).lineTo(520, currentY + 12).strokeColor('#666').lineWidth(0.5).stroke();
        currentY += 35;
      };

      if (serviceCode.includes('CASIER')) {
          drawField('Nom :', d.nom || '---');
          drawField('Prénom(s) :', d.prenom || '---');
          drawField('Né le :', d.date_naissance || '---');
          drawField('À :', d.lieu_naissance || '---');
          drawField('Profession :', d.profession || '---');
          drawField('Usage :', d.usage || '---');
      } else {
          drawField('Nom :', d.nom || '---');
          drawField('Prénom(s) :', d.prenom || '---');
          drawField('Né(e) le :', d.date_naissance || '---');
          drawField('À :', d.lieu_naissance || '---');
          drawField('Fils/Fille de :', `${d.prenom_pere || ''} ${d.nom_pere || ''}`.trim() || '---');
          drawField('Et de :', `${d.prenom_mere || ''} ${d.nom_mere || ''}`.trim() || '---');
      }

      // --- BAS DE PAGE ---
      doc.moveDown(2);
      const footerY = 620;
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text(`Certifie le présent extrait conforme aux indications portées sur le registre.`, 70, footerY - 40);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Délivré à ${commune}, le ${new Date().toLocaleDateString('fr-FR')}`, 70, footerY - 20);

      // QR Code
      const verifyUrl = `https://egov.bf/verify/${reference}`;
      const qrBuffer = await QRCode.toBuffer(verifyUrl, { margin: 1, width: 90 });
      doc.image(qrBuffer, 70, footerY + 20, { width: 80 });
      doc.fontSize(8).text('Scannez pour vérifier', 70, footerY + 105);

      // Cachet et Signature
      const cachet = getImagePath(isJustice ? 'cachet justice.png' : 'cachet mairie.png');
      const signature = getImagePath(isJustice ? 'signature justice.png' : 'signature mairie.png');

      const sideBlockX = 350;
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text(isJustice ? "Pour le Procureur," : "L'Officier de l'Etat Civil", sideBlockX, footerY + 10, { width: 180, align: 'center' });

      if (cachet) doc.image(cachet, sideBlockX + 40, footerY + 30, { width: 90, opacity: 0.8 });
      if (signature) doc.image(signature, sideBlockX + 25, footerY + 60, { width: 120 });

      doc.fontSize(12).font('Helvetica-Bold');
      doc.text(agent ? `${agent.prenom} ${agent.nom}` : (isJustice ? 'LE MAGISTRAT' : 'L\'OFFICIER'), sideBlockX, footerY + 130, { width: 180, align: 'center' });

      doc.end();

    } catch (error) {
      logger.error(`Erreur génération PDFKit: ${error.message}`);
      reject(error);
    }
  });
};

/**
 * Upload le buffer sur Cloudinary ou sauvegarde locale
 */
async function uploadBufferToCloudinary(pdfBuffer, demande) {
  const base64Pdf = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
  const publicId = `documents/${demande.reference}_${Date.now()}`;
  
  try {
    const uploadResult = await uploadToCloudinary(base64Pdf, 'e-gov-docs/generated', {
      public_id: publicId,
      resource_type: 'raw'
    });
    return {
       url: uploadResult.secure_url,
       publicId: uploadResult.public_id,
       genereLe: new Date(),
       expireLe: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    };
  } catch (uploadError) {
    logger.warn(`[PDFKit] Échec Cloudinary (${uploadError.message}). Sauvegarde locale...`);
    const fileName = `${demande.reference}_${Date.now()}.pdf`;
    const docsDir = path.join(__dirname, '../../uploads/documents');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    fs.writeFileSync(path.join(docsDir, fileName), pdfBuffer);
    return {
       url: `/uploads/documents/${fileName}`,
       publicId: `local_${fileName}`,
       genereLe: new Date(),
       expireLe: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    };
  }
}

module.exports = { generateDocumentPDF };
