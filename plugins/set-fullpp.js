const { cmd } = require("../command");
const Jimp = require("jimp");

cmd({
  pattern: "fullpp",
  alias: ["setpp", "setdp", "pp"],
  react: "🍳",
  desc: "Set full image as bot's profile picture",
  category: "tools",
  filename: __filename
}, async (conn, message, { isCreator }) => {
  try {
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    
    // Check if sender is either bot or creator
    if (message.sender !== botNumber && !isCreator) {
      return await conn.sendMessage(message.from, {
        text: "📛 This command can only be used by the bot or its owner."
      }, { quoted: message });
    }

    const quoted = message.quoted;
    if (!quoted || !quoted.mtype || !quoted.mtype.includes("image")) {
      return message.reply("⚠️ *Please reply to an image to set as full DP.*");
    }

    await message.reply("⏳ *Processing image, please wait...*");

    const imageBuffer = await conn.downloadMediaMessage(quoted);
    const image = await Jimp.read(imageBuffer);

    // Create blurred background
    const blurredBg = image.clone().cover(640, 640).blur(10);

    // Create centered image
    const centeredImage = image.clone().contain(640, 640);

    // Merge both
    blurredBg.composite(centeredImage, 0, 0);

    const finalImage = await blurredBg.getBufferAsync(Jimp.MIME_JPEG);

    // Update bot's profile picture
    await conn.updateProfilePicture(botNumber, finalImage);

    await message.reply("✅ *Profile Picture Updated Successfully — KHAN-MD*");

  } catch (error) {
    console.error(error);
    message.reply("❌ Error: " + error.message);
  }
});
