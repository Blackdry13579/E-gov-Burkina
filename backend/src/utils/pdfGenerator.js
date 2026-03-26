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
 * Génère un PDF à partir des données de la demande en utilisant PDFKit
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

      // --- DONNÉES ET CONTEXTE ---
      const d = demande.donnees || {};
      const serviceCode = (demande.service?.code || '').toUpperCase();
      const typeDoc = (demande.typeDocument || '').toUpperCase();
      
      const isCasier = serviceCode.includes('CASIER') || typeDoc === 'CASIER_JUDICIAIRE';
      const isNationalite = serviceCode.includes('NAT') || typeDoc === 'CERTIFICAT_NATIONALITE';
      const isJustice = isCasier || isNationalite || demande.service?.nom?.toLowerCase().includes('justice');

      // --- RÉSOLUTION DES TYPES ---
      if (isCasier) {
        await drawCasierJudiciaire(doc, demande, agent);
      } else if (isNationalite) {
        await drawCertificatNationalite(doc, demande, agent);
      } else {
        await drawExtraitNaissance(doc, demande, agent);
      }

      doc.end();

    } catch (error) {
      logger.error(`Erreur génération PDFKit: ${error.message}`);
      reject(error);
    }
  });
};

// =============================================================================
// --- LAYOUT: EXTRAIT DE NAISSANCE ---
// =============================================================================
async function drawExtraitNaissance(doc, demande, agent) {
  const d = demande.donnees || {};
  drawCommonHeader(doc, d, false);

  // Titre
  doc.moveDown(4);
  doc.fontSize(22).font('Helvetica-Bold').fillColor('#1a1a2e');
  doc.text("EXTRAIT D'ACTE DE NAISSANCE", 50, 220, { align: 'center' });
  doc.fontSize(12).font('Helvetica').fillColor('black');
  doc.text(`N° ${demande.reference} du ${d.date_acte_original || new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });

  // Corps
  doc.moveDown(3);
  let currentY = 320;
  const drawField = (label, value) => {
    doc.fontSize(12).font('Helvetica-Bold').text(label, 70, currentY);
    doc.font('Helvetica').text((value || '---').toUpperCase(), 180, currentY);
    doc.moveTo(180, currentY + 12).lineTo(520, currentY + 12).strokeColor('#666').lineWidth(0.5).stroke();
    currentY += 35;
  };

  drawField('Nom :', d.nom);
  drawField('Prénom(s) :', d.prenom);
  drawField('Né(e) le :', d.date_naissance);
  drawField('À :', d.lieu_naissance);
  drawField('Fils / Fille de :', `${d.prenom_pere || ''} ${d.nom_pere || ''}`.trim());
  drawField('Et de :', `${d.prenom_mere || ''} ${d.nom_mere || ''}`.trim());

  await drawCommonFooter(doc, demande, agent, "L'Officier de l'Etat Civil", false);
}

// =============================================================================
// --- LAYOUT: CASIER JUDICIAIRE ---
// =============================================================================
async function drawCasierJudiciaire(doc, demande, agent) {
  const d = demande.donnees || {};
  drawCommonHeader(doc, d, true, "MINISTERE DE LA JUSTICE ET DES DROITS\nHUMAINS, CHARGE DES RELATIONS AVEC\nLES INSTITUTIONS\n***********\nCASIER JUDICIAIRE CENTRAL");

  // Titre dans une boîte
  const title = "BULLETIN N°3 DU CASIER JUDICIAIRE";
  doc.fontSize(16).font('Helvetica-Bold').fillColor('black');
  const titleWidth = doc.widthOfString(title) + 40;
  doc.rect((595 - titleWidth) / 2, 180, titleWidth, 30).stroke();
  doc.text(title, 50, 190, { align: 'center' });

  doc.moveDown(1.5);
  doc.fontSize(13).text(`N° : ${demande.reference}`, { align: 'center' });

  // Corps
  doc.moveDown(2);
  doc.fontSize(13).font('Helvetica');
  const genderPrefix = (d.genre === 'Féminin') ? 'La nommée' : 'Le nommé';
  
  doc.text(`${genderPrefix} `, 70, 260, { continued: true })
     .font('Helvetica-Bold').text(`${(d.nom || '').toUpperCase()} ${(d.prenom || '').toUpperCase()}`)
     .font('Helvetica').text(`${(d.genre === 'Féminin') ? 'Fille' : 'Fils'} de `, { continued: true })
     .font('Helvetica-Bold').text(`${(d.nom_pere || d.prenom_pere || '---').toUpperCase()}`)
     .font('Helvetica').text(`Et de `, { continued: true })
     .font('Helvetica-Bold').text(`${(d.nom_mere || d.prenom_mere || '---').toUpperCase()}`)
     .font('Helvetica').text(`Né(e) le ${d.date_naissance || '---'} à ${d.lieu_naissance || '---'}`)
     .text(`Domicile : ${d.adresse || d.domicile || '---'}`)
     .text(`Nationalité : BURKINABÈ`)
     .text(`Profession : ${d.profession || '---'}`);

  // Table des condamnations
  doc.moveDown(2);
  const tableY = doc.y + 10;
  doc.lineWidth(1).strokeColor('black');
  doc.rect(70, tableY, 450, 80).stroke(); // Cadre de la table
  
  // En-tête de table
  doc.fontSize(8).font('Helvetica-Bold');
  doc.text("Dates des condamnations / Cours ou tribunaux / Natures des crimes / Date commission / Durée peines", 75, tableY + 5, { width: 330 });
  doc.text("Observations", 420, tableY + 5, { width: 90, align: 'center' });
  
  doc.moveTo(410, tableY).lineTo(410, tableY + 80).stroke(); // Séparateur observations

  // Contenu NEANT
  doc.fontSize(30).font('Helvetica-Bold').text("NÉANT", 70, tableY + 30, { width: 340, align: 'center', characterSpacing: 10 });
  
  // Observations techniques
  doc.fontSize(7).font('Helvetica').text(`Extrait d'Acte de Naissance\nN°${d.num_acte_naissance || '---'} du ${d.date_acte_naissance || '---'}\nde ${d.commune || '---'}`, 415, tableY + 25, { width: 100 });

  await drawCommonFooter(doc, demande, agent, "Le Ministre, Garde des Sceaux", true);
}

// =============================================================================
// --- LAYOUT: CERTIFICAT DE NATIONALITE ---
// =============================================================================
async function drawCertificatNationalite(doc, demande, agent) {
  const d = demande.donnees || {};
  
  // Header spécial Nationalité
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text("COUR D'APPEL", 50, 50, { width: 180, align: 'center' });
  doc.font('Helvetica').text(`de ${d.ville_tribunal || 'OUAGADOUGOU'}`, { width: 180, align: 'center' });
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text("TRIBUNAL DE GRANDE INSTANCE", { width: 180, align: 'center' });
  doc.font('Helvetica').text(`de ${d.ville_tribunal || 'OUAGADOUGOU'}`, { width: 180, align: 'center' });

  doc.fontSize(15).font('Helvetica-Bold').text('BURKINA FASO', 395, 55, { width: 150, align: 'center' });
  doc.fontSize(9).font('Helvetica-Oblique').text('Unité – Progrès – Justice', { width: 150, align: 'center' });

  // Titre
  doc.moveDown(2);
  doc.fontSize(22).font('Helvetica-Bold').text("CERTIFICAT DE NATIONALITÉ BURKINABÈ", 50, 150, { align: 'center' });

  // Drapeau dessiné
  const flagX = 267, flagY = 190;
  doc.rect(flagX, flagY, 60, 20).fill('#EF2B2D'); // Rouge
  doc.rect(flagX, flagY + 20, 60, 20).fill('#009A00'); // Vert
  doc.fontSize(15).fillColor('#FCD116').text('★', flagX + 22, flagY + 12); // Étoile simplifiée
  
  doc.fillColor('black');
  doc.moveDown(3);
  doc.fontSize(14).font('Helvetica-Bold').text(`N° ${demande.reference}`, { align: 'center' });

  doc.moveDown(1);
  doc.fontSize(13).font('Helvetica-Bold').text(`LE PRÉSIDENT DU TRIBUNAL DE ${d.nom_tribunal || 'GRANDE INSTANCE'}`, { align: 'center' });
  
  doc.moveDown(1);
  doc.fontSize(12).font('Helvetica-Bold').text("CERTIFIE AU VU DES PIÈCES SUIVANTES :", 70);
  
  doc.moveDown(1);
  doc.font('Helvetica').fontSize(11).text(`1° Extrait d'acte de naissance n°${d.num_acte_naissance || '---'} du ${d.date_acte_naissance || '---'}, délivré par l'officier de l'état civil de ${d.commune_acte_naissance || '---'}, attestant que `, 70, doc.y, { width: 450, continued: true, align: 'justify' })
     .font('Helvetica-Bold').text(`${(d.prenom || '')} ${(d.nom || '')}`.toUpperCase(), { continued: true })
     .font('Helvetica').text(`, fils de ${d.nom_pere || '---'} et de ${d.nom_mere || '---'}, est né(e) à ${d.lieu_naissance || '---'}, le ${d.date_naissance || '---'} ;`);

  doc.moveDown(2);
  doc.font('Helvetica-Bold').text(`Que ${(d.prenom || '')} ${(d.nom || '')}`.toUpperCase(), 70, doc.y, { width: 450, continued: true, align: 'justify' })
     .text(`, né(e) à ${d.lieu_naissance || '---'}, le ${d.date_naissance || '---'}, possède la Nationalité Burkinabè comme étant né(e) au Burkina Faso d'un père qui y est lui-même né (Art 144 du Code des Personnes et de la Famille).`);

  await drawCommonFooter(doc, demande, agent, "Le Président du Tribunal", true);
}

// =============================================================================
// --- HELPERS COMMUNS ---
// =============================================================================

function drawCommonHeader(doc, d, isJustice, customLeft) {
  const region = (d.region || 'CENTRE').toUpperCase();
  const province = (d.province || 'KADIOGO').toUpperCase();
  const commune = (d.commune || 'OUAGADOUGOU').toUpperCase();

  // Gauche
  doc.fontSize(10).font('Helvetica-Bold').fillColor('black');
  if (customLeft) {
    doc.text(customLeft, 50, 50, { width: 180, align: 'center' });
  } else {
    doc.text(`RÉGION DU ${region}`, 50, 50, { width: 150, align: 'center' });
    doc.text('-=-=-=-=-=-', { width: 150, align: 'center' });
    doc.text(`PROVINCE DU ${province}`, { width: 150, align: 'center' });
    doc.text('-=-=-=-=-=-', { width: 150, align: 'center' });
    doc.text(`COMMUNE DE ${commune}`, { width: 150, align: 'center' });
    doc.text('-=-=-=-=-=-', { width: 150, align: 'center' });
    doc.text(isJustice ? 'TRIBUNAL' : 'MAIRIE', { width: 150, align: 'center' });
  }

  // Centre (Armoiries)
  const coatPath = getImagePath('filigrane.jpg');
  if (coatPath) doc.image(coatPath, 257, 45, { width: 80 });

  // Droite
  doc.fontSize(14).font('Helvetica-Bold');
  doc.text('BURKINA FASO', 395, 55, { width: 150, align: 'center' });
  doc.fontSize(9).font('Helvetica-Oblique');
  doc.text('Unité – Progrès – Justice', { width: 150, align: 'center' });
}

async function drawCommonFooter(doc, demande, agent, title, isJustice) {
  const footerY = 640;
  const d = demande.donnees || {};
  
  if (!isJustice) {
    doc.fontSize(11).font('Helvetica-Bold').text(`Certifie le présent extrait conforme aux indications portées sur le registre.`, 70, footerY - 40);
  }
  
  doc.fontSize(11).font('Helvetica');
  const deliveryPlace = d.commune || d.ville_tribunal || 'OUAGADOUGOU';
  doc.text(`Fait et délivré à ${deliveryPlace}, le ${new Date().toLocaleDateString('fr-FR')}`, 70, footerY - 20);

  // QR Code
  const verifyUrl = `https://egov.bf/verify/${demande.reference}`;
  const qrBuffer = await QRCode.toBuffer(verifyUrl, { margin: 1, width: 90 });
  doc.image(qrBuffer, 70, footerY + 20, { width: 80 });
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#444').text('VALIDATION NUMÉRIQUE', 70, footerY + 105);

  // Cachet et Signature
  const cachet = getImagePath(isJustice ? 'cachet justice.png' : 'cachet mairie.png');
  const signature = getImagePath(isJustice ? 'signature justice.png' : 'signature mairie.png');

  const sideBlockX = 350;
  doc.fillColor('black').fontSize(11).font('Helvetica-Bold');
  doc.text(title, sideBlockX, footerY + 10, { width: 180, align: 'center' });

  if (cachet) doc.image(cachet, sideBlockX + 40, footerY + 30, { width: 90 });
  if (signature) doc.image(signature, sideBlockX + 25, footerY + 60, { width: 120 });

  doc.fontSize(12).font('Helvetica-Bold');
  const name = agent ? `${agent.prenom} ${agent.nom}` : (isJustice ? 'LE MAGISTRAT' : 'L\'OFFICIER');
  doc.text(name, sideBlockX, footerY + 130, { width: 180, align: 'center' });
}

/**
 * Upload le buffer sur Cloudinary
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
    logger.warn(`[PDFKit] Échec Cloudinary. Sauvegarde locale...`);
    const fileName = `${demande.reference}_${Date.now()}.pdf`;
    const docsDir = path.join(__dirname, '../../uploads/documents');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    fs.writeFileSync(path.join(docsDir, fileName), pdfBuffer);
    return { url: `/uploads/documents/${fileName}`, publicId: `local_${fileName}`, genereLe: new Date() };
  }
}

module.exports = { generateDocumentPDF };
