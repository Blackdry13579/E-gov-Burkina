require('dotenv').config();
const { uploadToCloudinary } = require('./src/config/cloudinary');

(async () => {
  try {
    console.log("Testing Cloudinary upload...");
    const sampleBase64 = "data:text/plain;base64,SGVsbG8gV29ybGQ="; // "Hello World"
    const uploadResult = await uploadToCloudinary(sampleBase64, 'e-gov-docs/test', {
      resource_type: 'raw'
    });
    console.log("Upload successful:", uploadResult.secure_url);
  } catch (e) {
    console.error("Cloudinary upload failed:", e);
  }
})();
