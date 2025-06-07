const { cmd } = require('../command');

cmd({
    pattern: "chai",
    alias: ["tea", "chay", "cha", "chah"],
    desc: "Brews you a fantastic cup of chai with the famous meme!",
    category: "tools",
    react: "☕",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // making
        const brewingMsg = await conn.sendMessage(from, { 
            text: 'Brewing your chai... ☕' 
        }, { quoted: mek });

        // Chai brewing animation with fun steps
        const chaiSteps = [
            "Boiling water... 💦",
            "Adding Assam tea leaves... 🍃",
            "Pouring fresh milk... 🥛",
            "Crushing ginger & cardamom... 🧄🌿",
            "Adding just the right sugar... ⚖️",
            "Letting it boil to perfection... ♨️",
            "*Aroma intensifies* 👃🤤",
            "Straining the tea... 🕳️",
            "Pouring into cup... 🫖",
            "Almost ready... ⏳"
        ];

        // Show each step with delay
        for (const step of chaiSteps) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            await conn.relayMessage(
                from,
                {
                    protocolMessage: {
                        key: brewingMsg.key,
                        type: 14,
                        editedMessage: {
                            conversation: step,
                        },
                    },
                },
                {}
            );
        }

        // Final text message
        await conn.sendMessage(from, { 
            text: 'Your masala chai is ready! ☕✨ Wait sending you...' 
        }, { quoted: mek });

        // Send the famous meme image
        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/dyzdgl.jpg" },
            caption: "- *The Tea Was Fantastic* ☕\n> _(Remember 2019 😂💀🗿)_ \n- *2019 X 2025 🗿😎*",
            mimetype: "image/jpeg"
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ *Chai spilled!* ${e.message}\n_Better luck next time!_`);
    }
});
