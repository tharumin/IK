const config = require('../config');
const { cmd } = require('../command');
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "obfuscate",
  alias: ["obf", "confuse"],
  desc: "Obfuscate JavaScript code to make it harder to read.",
  category: "utility",
  use: ".obfuscate <code> or reply to code",
  filename: __filename,
}, async (conn, m, msg, { quoted, q, reply }) => {
  try {
    const inputCode = quoted?.text || q;
    if (!inputCode) return reply("❌ Please provide JavaScript code to obfuscate (via reply or args).");

    const obfuscatedCode = JavaScriptObfuscator.obfuscate(inputCode, {
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      debugProtection: true,
      disableConsoleOutput: true,
      stringArray: true,
      stringArrayEncoding: ["base64"],
      rotateStringArray: true,
    }).getObfuscatedCode();

    const fileName = `KHAN.js`;
    const filePath = path.join(__dirname, "../temp", fileName);

    // Ensure temp folder exists
    if (!fs.existsSync(path.join(__dirname, "../temp"))) {
      fs.mkdirSync(path.join(__dirname, "../temp"));
    }

    fs.writeFileSync(filePath, obfuscatedCode);

    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(filePath),
      mimetype: 'application/javascript',
      fileName: fileName,
      caption: "🔐 Here's your obfuscated code*",
    }, { quoted: m });

    fs.unlinkSync(filePath); // Delete after sending
  } catch (error) {
    console.error("Error obfuscating code:", error);
    reply("❌ An error occurred while obfuscating the code.");
  }
});
