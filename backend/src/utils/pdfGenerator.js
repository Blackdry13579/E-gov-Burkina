const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const { uploadToCloudinary } = require('../config/cloudinary');
const logger = require('./logger');

// Chemin vers les templates
const TEMPLATES_DIR = path.join(__dirname, '../templates/documents');
const IMAGES_DIR = path.join(__dirname, '../templates/images');

// Chargement du filigrane officiel en Base64
const loadImageB64 = (filename) => {
  try {
    const ext = path.extname(filename).slice(1).toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : 'png';
    const imgPath = path.join(IMAGES_DIR, filename);
    if (fs.existsSync(imgPath)) {
      const buf = fs.readFileSync(imgPath);
      return `data:image/${mime};base64,${buf.toString('base64')}`;
    }
  } catch (e) {
    logger.warn(`⚠️ Image non chargée (${filename}): ${e.message}`);
  }
  return '';
};

const WATERMARK_BASE64       = loadImageB64('filigrane.jpg');
const SIGNATURE_MAIRIE_B64   = loadImageB64('signature mairie.png');
const CACHET_MAIRIE_B64      = loadImageB64('cachet mairie.png');
const SIGNATURE_JUSTICE_B64  = loadImageB64('signature justice.png');
const CACHET_JUSTICE_B64     = loadImageB64('cachet justice.png');

logger.info('✅ Images officielles chargées');

/**
 * Remplace les variables {{clé}} dans un template HTML par les valeurs fournies
 */
const injectVariables = (template, variables) => {
  let output = template;
  for (const key in variables) {
    const value = variables[key] !== undefined && variables[key] !== null ? variables[key] : '';
    const regex = new RegExp(`{{${key}}}`, 'g');
    output = output.replace(regex, value);
  }
  return output;
};

/**
 * Génère un PDF à partir d'un template HTML et des données de la demande
 */
const generateDocumentPDF = async (demande, agent) => {
  try {
    let templateName = 'extrait_naissance.html';
    
    // Déterminer le template selon le type de document ou le service
    const serviceCode = demande.service?.code || '';
    if (serviceCode.includes('CASIER') || demande.typeDocument === 'CASIER_JUDICIAIRE') {
      templateName = 'casier_judiciaire.html';
    } else if (serviceCode.includes('NAT') || demande.typeDocument === 'CERTIFICAT_NATIONALITE') {
      templateName = 'certificat_nationalite.html';
    }

    const templatePath = path.join(TEMPLATES_DIR, templateName);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template non trouvé: ${templatePath}`);
    }

    const template = fs.readFileSync(templatePath, 'utf8');

    // Génération du QR Code de vérification
    const verifyUrl = `https://egov.bf/verify/${demande.reference}`;
    const qrCodeDataUri = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 150,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Préparation exhaustive des variables
    const d = demande.donnees || {};
    const variables = {
      reference: demande.reference,
      qrCode: qrCodeDataUri,
      watermark: WATERMARK_BASE64,
      // Signature et cachet selon le service
      signature: serviceCode.includes('NAT') || serviceCode.includes('CASIER') || demande.service?.nom?.toLowerCase().includes('justice')
        ? SIGNATURE_JUSTICE_B64 : SIGNATURE_MAIRIE_B64,
      cachet: serviceCode.includes('NAT') || serviceCode.includes('CASIER') || demande.service?.nom?.toLowerCase().includes('justice')
        ? CACHET_JUSTICE_B64 : CACHET_MAIRIE_B64,
      lastName: (d.nom || d.nom_usage || '---').toUpperCase(),
      firstName: (d.prenom || d.prenoms || '---').toUpperCase(),
      fullName: `${(d.prenom || '')} ${(d.nom || '')}`.trim().toUpperCase(),
      gender: (d.genre === 'F' || d.sexe === 'F' || d.genre === 'Féminin' || d.sexe === 'Féminin') ? 'Fille' : 'Fils',
      birthDate: d.date_naissance || d.dateNaissance || '---',
      birthPlace: d.lieu_naissance || d.lieuNaissance || '---',
      fatherName: `${(d.prenom_pere || d.prenomPere || '')} ${(d.nom_pere || d.nomPere || '')}`.trim().toUpperCase() || '---',
      motherName: `${(d.prenom_mere || d.prenomMere || '')} ${(d.nom_mere || d.nomMere || '')}`.trim().toUpperCase() || '---',
      address: d.domicile || d.adresse || '---',
      profession: d.profession || 'Employé',
      region: d.region || 'CENTRE',
      province: d.province || 'KADIOGO',
      commune: d.commune || 'OUAGADOUGOU',
      issueDate: d.date_acte_original || new Date().toLocaleDateString('fr-FR'),
      deliveryDate: new Date().toLocaleDateString('fr-FR'),
      deliveryPlace: d.commune || 'OUAGADOUGOU',
      agentName: agent ? `${agent.prenom} ${agent.nom}` : 'Officier État Civil',
      
      // Spécifique Casier
      eanRef: d.num_acte_naissance || '---',
      eanDate: d.date_acte_naissance || '---',
      eanPlace: d.lieu_acte_naissance || '---',
      ministerName: 'Edasso Rodrigue BAYALA',
      generatedDate: new Date().toLocaleString('fr-FR'),
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),

      // Spécifique Nationalité
      courtCity: d.ville_tribunal || 'OUAGADOUGOU',
      tribunalName: d.nom_tribunal || 'GRANDE INSTANCE DE OUAGADOUGOU',
      birthActeRef: d.num_acte_naissance || '---',
      birthActeDate: d.date_acte_naissance || '---',
      birthCommune: d.commune_acte_naissance || '---',
      magistratName: agent ? `${agent.prenom} ${agent.nom}` : 'LE PRÉSIDENT',
      magistratRole: 'MAGISTRAT'
    };

    const finalHtml = injectVariables(template, variables);

    // Génération PDF via Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
    });
    
    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      pageRanges: '1' // Force l'export sur une seule page A4
    });
    
    await browser.close();

    // Conversion du buffer en uri base64 pour l'upload Cloudinary
    const base64Pdf = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
    
    const publicId = `documents/${demande.reference}_${Date.now()}`;
    logger.info(`[PDF] Template ${templateName} injecté. Upload sur Cloudinary...`);
    
    try {
      const uploadResult = await uploadToCloudinary(base64Pdf, 'e-gov-docs/generated', {
        public_id: publicId,
        resource_type: 'raw'
      });

      logger.info(`[PDF] Document généré et uploadé avec succès: ${uploadResult.secure_url}`);

      return {
         url: uploadResult.secure_url,
         publicId: uploadResult.public_id,
         genereLe: new Date(),
         expireLe: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      };
    } catch (uploadError) {
      logger.warn(`[PDF] Échec Cloudinary (${uploadError.message}). Sauvegarde locale...`);
      const fileName = `${demande.reference}_${Date.now()}.pdf`;
      const docsDir = path.join(__dirname, '../../uploads/documents');
      if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
      fs.writeFileSync(path.join(docsDir, fileName), pdfBuffer);
      
      const localUrl = `/uploads/documents/${fileName}`;
      logger.info(`[PDF] Document sauvegardé localement: ${localUrl}`);
      
      return {
         url: localUrl,
         publicId: `local_${fileName}`,
         genereLe: new Date(),
         expireLe: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      };
    }

  } catch (error) {
    logger.error(`Erreur génération PDF: ${error.message}`);
    throw error;
  }
};

module.exports = { generateDocumentPDF, injectVariables };
