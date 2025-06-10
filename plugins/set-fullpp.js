const { cmd } = require("../command");
const Jimp = require("jimp");

cmd({
  pattern: "fullpp",
  alias: ["setpp", "setdp", "pp"],
  react: "💐",
  desc: "Set full image as bot's profile picture",
  category: "tools",
  filename: __filename
}, async (m, conn, { isCreator }) => {
  try {
    // Get bot's JID
    const botJid = conn.user.id;
    
    // Check if sender is either bot or creator
    if (m.sender !== botJid && !isCreator) {
      return await conn.sendMessage(m.chat, { 
        text: "📛 This command can only be used by the bot or its owner." 
      }, { quoted: m });
    }

    if (!m.quoted || !m.quoted.mtype || !m.quoted.mtype.includes("image")) {
      return await conn.sendMessage(m.chat, { 
        text: "⚠️ *Please reply to an image to set as full DP.*" 
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { 
      text: "⏳ *Processing image, please wait...*" 
    }, { quoted: m });

    const imageBuffer = await conn.downloadMediaMessage(m.quoted);
    const image = await Jimp.read(imageBuffer);

    // Create blurred background
    const blurredBg = image.clone().cover(640, 640).blur(10);

    // Create centered image
    const centeredImage = image.clone().contain(640, 640);

    // Merge both
    blurredBg.composite(centeredImage, 0, 0);

    const finalImage = await blurredBg.getBufferAsync(Jimp.MIME_JPEG);

    // Update bot's profile picture
    await conn.updateProfilePicture(botJid, finalImage);

    await conn.sendMessage(m.chat, { 
      text: "*Profile Picture Updated Successfully — KHAN-MD* ✅" 
    }, { quoted: m });

  } catch (error) {
    console.error("FullPP Error:", error);
    await conn.sendMessage(m.chat, { 
      text: "❌ Error: " + error.message 
    }, { quoted: m });
  }
});
