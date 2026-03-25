const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send PIN email to admin
 * @param {string} adminEmail 
 * @param {string} pin 
 */
const sendAdminPinEmail = async (adminEmail, pin) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: adminEmail,
    subject: '🔐 Code PIN - Connexion Admin E-Gov Burkina',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="
        font-family: 'Public Sans', Arial, sans-serif;
        background: #f0f4f8;
        margin: 0;
        padding: 20px;
      ">
        <div style="
          max-width: 480px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        ">
          <!-- Header -->
          <div style="
            background: #1a237e;
            padding: 32px 24px;
            text-align: center;
          ">
            <h1 style="
              color: white;
              font-size: 22px;
              margin: 0;
              font-weight: bold;
            ">E-Gov Burkina</h1>
            <p style="
              color: rgba(255,255,255,0.7);
              font-size: 12px;
              margin: 6px 0 0;
              letter-spacing: 2px;
              text-transform: uppercase;
            ">Portail Officiel</p>
            <!-- Gold line -->
            <div style="
              width: 40px;
              height: 2px;
              background: #d4af37;
              margin: 12px auto 0;
            "></div>
          </div>

          <!-- Body -->
          <div style="padding: 32px 24px;">
            <p style="
              color: #64748b;
              font-size: 14px;
              margin: 0 0 24px;
            ">
              Bonjour Administrateur,
            </p>
            <p style="
              color: #1e293b;
              font-size: 14px;
              margin: 0 0 24px;
              line-height: 1.6;
            ">
              Une tentative de connexion à votre espace administrateur a été détectée. 
              Voici votre code PIN de confirmation :
            </p>

            <!-- PIN Box -->
            <div style="
              background: #f0f4f8;
              border: 2px dashed #1a237e;
              border-radius: 12px;
              padding: 24px;
              text-align: center;
              margin: 0 0 24px;
            ">
              <p style="
                color: #94a3b8;
                font-size: 11px;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin: 0 0 12px;
              ">VOTRE CODE PIN</p>
              <h2 style="
                color: #1a237e;
                font-size: 42px;
                font-weight: bold;
                letter-spacing: 16px;
                margin: 0;
                font-family: monospace;
              ">${pin}</h2>
              <p style="
                color: #94a3b8;
                font-size: 12px;
                margin: 12px 0 0;
              ">
                ⏱ Valable <strong>${process.env.PIN_EXPIRY_MINUTES} minutes</strong> seulement
              </p>
            </div>

            <!-- Warning -->
            <div style="
              background: #fef3c7;
              border-left: 4px solid #d97706;
              border-radius: 8px;
              padding: 14px 16px;
              margin: 0 0 24px;
            ">
              <p style="
                color: #92400e;
                font-size: 12px;
                margin: 0;
                line-height: 1.6;
              ">
                ⚠️ Si vous n'êtes pas à l'origine de cette demande, ignorez cet email et changez votre mot de passe immédiatement.
              </p>
            </div>

            <p style="
              color: #94a3b8;
              font-size: 11px;
              text-align: center;
              margin: 0;
            ">
              Ne partagez jamais ce code avec quelqu'un d'autre.
            </p>
          </div>

          <!-- Footer -->
          <div style="
            background: #f8fafc;
            padding: 16px 24px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          ">
            <p style="
              color: #94a3b8;
              font-size: 10px;
              margin: 0;
              letter-spacing: 1px;
              text-transform: uppercase;
            ">
              © 2026 Gouvernement du Burkina Faso — E-Gov
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending PIN email:', error);
    throw new Error('Could not send PIN email');
  }
};

module.exports = { sendAdminPinEmail };
