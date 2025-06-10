const { cmd } = require("../command");
const Jimp = require("jimp");

cmd({
  pattern: "fullpp",
  alias: ["setpp", "setdp", "pp"],
  react: "🖼️",
  desc: "Set full image as bot's profile picture",
  category: "tools",
  filename: __filename
}, async (client, message, { isCreator }) => {
  try {
    if (!isCreator) {
      return await client.sendMessage(message.from, {
        text: "📛 This is an *owner-only* command."
      }, { quoted: message });
    }

    const botNumber = client.user.id.split(':')[0] + "@s.whatsapp.net";

    if (message.sender !== botNumber) {
      return message.reply("❌ *Only the bot can run this command for itself.*");
    }

    const quoted = message.quoted;
    if (!quoted || !quoted.mtype || !quoted.mtype.includes("image")) {
      return message.reply("⚠️ *Please reply to an image to set as full DP.*");
    }

    await message.reply("⏳ *Processing image, please wait...*");

    const imageBuffer = await client.downloadMediaMessage(quoted);
    const image = await Jimp.read(imageBuffer);

    // Create blurred background
    const blurredBg = image.clone().cover(640, 640).blur(10);

    // Create centered image
    const centeredImage = image.clone().contain(640, 640);

    // Merge both
    blurredBg.composite(centeredImage, 0, 0);

    const finalImage = await blurredBg.getBufferAsync(Jimp.MIME_JPEG);

    // Update bot's own profile picture
    await client.updateProfilePicture(botNumber, finalImage);

    await message.reply("✅ *Successfully Updated Profile Picture — KHAN-MD*");

  } catch (error) {
    console.error(error);
    message.reply("❌ Error: " + error.message);
  }
});
