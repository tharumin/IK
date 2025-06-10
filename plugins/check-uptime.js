const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Inline runtime formatter
        const formatRuntime = (seconds) => {
            seconds = Number(seconds);
            const d = Math.floor(seconds / (3600 * 24));
            const h = Math.floor((seconds % (3600 * 24)) / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            return `${d} day${d !== 1 ? 's' : ''}, ${h} hour${h !== 1 ? 's' : ''}, ${m} minute${m !== 1 ? 's' : ''}, ${s} second${s !== 1 ? 's' : ''}`;
        };

        const uptime = formatRuntime(process.uptime());

        const caption = `╭───『 UPTIME 』───⳹
│
│ ⏱️ ${uptime}
│
╰────────────────⳹
${config.DESCRIPTION}`;

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
