const { cmd } = require("../command");
const Jimp = require("jimp");

cmd({
  pattern: "fullpp",
  alias: ["setpp", "setdp", "pp"],
  react: "💥",
  desc: "Set full image as bot's profile picture",
  category: "tools",
  filename: __filename
}, async (mek, sock, { isCreator }) => {
  try {
    // Get bot's JID
    const botJid = sock.user.id;
    
    // Check if sender is either bot or creator
    if (mek.sender !== botJid && !isCreator) {
      return await sock.sendMessage(mek.from, {
        text: "📛 This command can only be used by the bot or its owner."
      }, { quoted: mek });
    }

    const quoted = mek.quoted;
    if (!quoted || !quoted.mtype || !quoted.mtype.includes("image")) {
      return sock.sendMessage(mek.from, { 
        text: "⚠️ *Please reply to an image to set as full DP.*" 
      }, { quoted: mek });
    }

    await sock.sendMessage(mek.from, { 
      text: "⏳ *Processing image, please wait...*" 
    }, { quoted: mek });

    const imageBuffer = await sock.downloadMediaMessage(quoted);
    const image = await Jimp.read(imageBuffer);

    // Create blurred background
    const blurredBg = image.clone().cover(640, 640).blur(10);

    // Create centered image
    const centeredImage = image.clone().contain(640, 640);

    // Merge both
    blurredBg.composite(centeredImage, 0, 0);

    const finalImage = await blurredBg.getBufferAsync(Jimp.MIME_JPEG);

    // Update bot's profile picture
    await sock.updateProfilePicture(botJid, finalImage);

    await sock.sendMessage(mek.from, { 
      text: "*Profile Pic Updated Successfully • KHAN-MD ✅*" 
    }, { quoted: mek });

  } catch (error) {
    console.error("FullPP Error:", error);
    await sock.sendMessage(mek.from, { 
      text: "❌ Error: " + error.message 
    }, { quoted: mek });
  }
});
