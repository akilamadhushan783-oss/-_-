const { cmd } = require("../command");

cmd(
    {
        pattern: "save",
        react: "✅",
        desc: "Resend Status or One-Time View Media",
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
            // Additional variables can be destructured here if needed
        }
    ) => {
        try {
            // Check if the user replied to a message
            if (!quoted) {
                return reply("*Please reply to the Status, One-Time View, or any Media message you want to save/resend!* 🧐");
            }

            // --- Status Media Check ---
            if (quoted.isStatus) {
                // Status media is usually directly available via quoted.fakeObj
                
                await zanta.copyNForward(from, quoted.fakeObj, { 
                    caption: "*✅ Saved and Resent from Status!*",
                    quoted: mek // Quote the original 'save' message
                });
                
                return reply("*Status media successfully resent!* 🥳");
            }

            // --- One-Time View Media Check ---
            if (quoted.isViewOnce) {
                // One-Time View media is saved by copying the fakeObj
                
                await zanta.copyNForward(from, quoted.fakeObj, {
                    caption: "*📸 Saved and Resent from One-Time View!*",
                    quoted: mek
                });
                
                return reply("*One-Time View media successfully saved and resent!* 💾");
            }
            
            // --- Regular Media Check (FIX for TypeError: Cannot read properties of undefined (reading 'includes')) ---
            
            // Determine the message type. We check fakeObj first for consistency, 
            // but use quoted.mtype as a fallback.
            const repliedMtype = quoted.fakeObj ? quoted.fakeObj.mtype : quoted.mtype;

            if (repliedMtype && (
                repliedMtype.includes('imageMessage') || 
                repliedMtype.includes('videoMessage') || 
                repliedMtype.includes('audioMessage') || 
                repliedMtype.includes('documentMessage'))) {
                
                // Use quoted.fakeObj to forward the media content
                await zanta.copyNForward(from, quoted.fakeObj, {
                    caption: "*💾 Saved and Resent!*",
                    quoted: mek
                });

                return reply("*Media successfully resent!* ✨");
            }
            
            // If it's not a Status, OTV, or any recognized media type
            return reply("*The replied message does not contain any Status, One-Time View, or recognizable Media!* 🤷‍♂️");

        } catch (e) {
            console.error(e);
            reply(`*Error saving media:* ${e.message || e}`);
        }
    }
);
