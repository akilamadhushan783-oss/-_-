const { cmd } = require("../command");

cmd(
    {
        pattern: "save",
        react: "🐛", // Debugging emoji
        desc: "Resend Status or One-Time View Media (Debugging Version)",
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
                return reply("*කරුණාකර ඔබට save කර ගැනීමට අවශ්‍ය Status/Media Message එකකට reply කරන්න!* 🧐");
            }

            // ⚠️ DEBUGGING STEP: Print the entire quoted object to the console ⚠️
            console.log("--- START SAVE.JS DEBUG LOG ---");
            console.log("QUOTED OBJECT:", JSON.stringify(quoted, null, 2));
            console.log("--- END SAVE.JS DEBUG LOG ---");
            
            // Core logic (Simplified as before)
            let mediaMessage = quoted.fakeObj;
            let saveCaption = "*💾 Saved and Resent!*";
            
            if (!mediaMessage) {
                // This error message is what you keep receiving.
                return reply("*⚠️ Media Content එක හඳුනාගැනීමට නොහැකි විය. console log එක පරීක්ෂා කර එහි අන්තර්ගතය ලබා දෙන්න.*");
            }
            
            // Identify the message type for the caption
            if (quoted.isStatus) {
                saveCaption = "*✅ Status Media Saved!*";
            } else if (quoted.isViewOnce) {
                 saveCaption = "*📸 One-Time View Saved!*";
            }
            
            // Forward the media
            await zanta.copyNForward(from, mediaMessage, {
                caption: saveCaption,
                quoted: mek
            });

            return reply("*Media successfully processed and resent!* ✨");

        } catch (e) {
            console.error(e);
            reply(`*Error saving media:* ${e.message || e}`);
        }
    }
);
