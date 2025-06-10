const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show fake bot uptime with image caption",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const caption = `╭───『 UPTIME V-5 』───⳹
│
│ ⏱️ 25 days, 22 hours, 30 minutes, 16 seconds
│
╰────────────────⳹
*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ JawadTechX 💜*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/7zfdcq.jpg' },
            caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363354023106228@newsletter',
                    newsletterName: config.OWNER_NAME || 'JawadTechX',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
