const { cmd } = require("../command");

cmd(
    {
        pattern: "save",
        react: "✅", // Final Success Emoji
        desc: "Resend Status or One-Time View Media (Final Corrected Version)",
        category: "general",
        filename: __filename,
    },
    async (
        zanta,
        mek,
        m,
        {
            from,
            quoted,
            reply,
        }
    ) => {
        try {
            if (!quoted) {
                return reply("*කරුණාකර Status/Media Message එකකට reply කරන්න!* 🧐");
            }

            // ⚠️ FINAL FIX: Use quoted.quoted first, then fallback to quoted.fakeObj ⚠️
            let mediaMessage = quoted.quoted || quoted.fakeObj;
            let saveCaption = "*💾 Saved and Resent!*";
            
            if (!mediaMessage) {
                // Now, if this fails, it means there is no quoted message (or a text message only).
                return reply("*⚠️ Media Content එක හඳුනාගැනීමට අසමත් විය. (Media Data නැත)*");
            }
            
            // Identify the message type for the caption
            if (quoted.isStatus || quoted.message?.contextInfo?.remoteJid === "status@broadcast") {
                saveCaption = "*✅ Status Media Saved!*";
            } else if (quoted.isViewOnce || mediaMessage.viewOnceMessage) {
                 saveCaption = "*📸 One-Time View Saved!*";
            }
            
            // Forward the media
            // mediaMessage is now the correctly located message object (videoMessage, imageMessage, etc.)
            await zanta.copyNForward(from, mediaMessage, {
                caption: saveCaption,
                quoted: mek
            });

            return reply("*වැඩේ හරි 🙃✅*");

        } catch (e) {
            console.error(e);
            reply(`*Error saving media (Final Attempt):* ${e.message || e}`);
        }
    }
);
