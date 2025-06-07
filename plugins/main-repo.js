const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch information about a GitHub repository.",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/JawadYT36/KHAN-MD';

    try {
        // Extract username and repository name
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        // Fetch repo info using axios
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);

        if (response.status !== 200 || !response.data) {
            throw new Error("GitHub API request failed.");
        }

        const repoData = response.data;

        const formattedInfo = `*BOT NAME:*\n> ${repoData.name}\n\n*OWNER NAME:*\n> ${repoData.owner.login}\n\n*STARS:*\n> ${repoData.stargazers_count}\n\n*FORKS:*\n> ${repoData.forks_count}\n\n*GITHUB LINK:*\n> ${repoData.html_url}\n\n*DESCRIPTION:*\n> ${repoData.description || 'No description'}\n\n*Don't Forget To Star and Fork Repository*\n\n> *© Powered By JawadTechX 🖤*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/7zfdcq.jpg' },
            caption: formattedInfo,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363354023106228@newsletter',
                    newsletterName: 'JawadTechX',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in .repo command:", error.message);
        reply("❌ Could not fetch repository info. Please try again later.");
    }
});  
