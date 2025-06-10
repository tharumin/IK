const { cmd } = require("../command");
const Jimp = require("jimp");

cmd({
  pattern: "fullpp",
  alias: ["setpp", "setdp", "pp"],
  react: "🍳",
  desc: "Set full image as bot's profile picture",
  category: "tools",
  filename: __filename
}, async (m, sock, { isCreator }) => {
  try {
    // Get bot's JID (new Baileys method)
    const botJid = sock.user.id;
    
    // Check if sender is either bot or creator
    if (m.sender !== botJid && !isCreator) {
      return await sock.sendMessage(m.from, {
        text: "📛 This command can only be used by the bot or its owner."
      }, { quoted: m });
    }

    const quoted = m.quoted;
    if (!quoted || !quoted.mtype || !quoted.mtype.includes("image")) {
      return m.reply("⚠️ *Please reply to an image to set as full DP.*");
    }

    await m.reply("⏳ *Processing image, please wait...*");

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

    await m.reply("✅ *Bot's profile picture updated KHAN-MD*");

  } catch (error) {
    console.error("FullPP Error:", error);
    m.reply("❌ Error: " + error.message);
  }
});
