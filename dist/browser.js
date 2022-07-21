function $7908cb960895d2b8$export$2e2bcd8739ae039(string) {
    if (typeof string !== "string") throw new TypeError("Expected a string");
    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}


let $80728829cff99678$var$userId;
let $80728829cff99678$var$bttvGlobalLookupTable;
let $80728829cff99678$var$bttvChannelLookupTable;
let $80728829cff99678$var$ffzChannelLookupTable;
async function $80728829cff99678$var$getUserId() {
    if ($80728829cff99678$var$userId) return $80728829cff99678$var$userId;
    const queryParameters = new URLSearchParams(window.location.search);
    const channelName = queryParameters.get("channel");
    const userIdResponse = await fetch(`https://decapi.me/twitch/id/${channelName}`);
    $80728829cff99678$var$userId = await userIdResponse.text();
    return $80728829cff99678$var$userId;
}
async function $80728829cff99678$var$getBttvGlobalLookupTable() {
    if ($80728829cff99678$var$bttvGlobalLookupTable) return $80728829cff99678$var$bttvGlobalLookupTable;
    const bttvGlobalEmotesResponse = await fetch("https://api.betterttv.net/3/cached/emotes/global");
    const bttvGlobalEmotes = await bttvGlobalEmotesResponse.json();
    $80728829cff99678$var$bttvGlobalLookupTable = bttvGlobalEmotes.reduce((result, emote)=>{
        const emoteData = {
            id: emote.id,
            type: emote.imageType
        };
        result[emote.code] = emoteData;
        return result;
    }, {});
    return $80728829cff99678$var$bttvGlobalLookupTable;
}
async function $80728829cff99678$var$getBttvChannelLookupTable() {
    if ($80728829cff99678$var$bttvChannelLookupTable) return $80728829cff99678$var$bttvChannelLookupTable;
    const userId1 = await $80728829cff99678$var$getUserId();
    const bttvChannelEmotesResponse = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${userId1}`);
    const bttvChannelEmotesJSON = await bttvChannelEmotesResponse.json();
    const bttvChannelEmotes = bttvChannelEmotesJSON.channelEmotes.concat(bttvChannelEmotesJSON.sharedEmotes);
    $80728829cff99678$var$bttvChannelLookupTable = bttvChannelEmotes.reduce((result, emote)=>{
        const emoteData = {
            id: emote.id,
            type: emote.imageType
        };
        result[emote.code] = emoteData;
        return result;
    }, {});
    return $80728829cff99678$var$bttvChannelLookupTable;
}
async function $80728829cff99678$var$getFfzChannelLookupTable() {
    if ($80728829cff99678$var$ffzChannelLookupTable) return $80728829cff99678$var$ffzChannelLookupTable;
    const userId2 = await $80728829cff99678$var$getUserId();
    const ffzChannelEmotesResponse = await fetch(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${userId2}`);
    const ffzChannelEmotes = await ffzChannelEmotesResponse.json();
    $80728829cff99678$var$ffzChannelLookupTable = ffzChannelEmotes.reduce((result, emote)=>{
        const emoteData = {
            id: emote.id,
            type: emote.imageType
        };
        result[emote.code] = emoteData;
        return result;
    }, {});
    return $80728829cff99678$var$ffzChannelLookupTable;
}
var $80728829cff99678$export$2e2bcd8739ae039 = {
    getBttvGlobalLookupTable: $80728829cff99678$var$getBttvGlobalLookupTable,
    getBttvChannelLookupTable: $80728829cff99678$var$getBttvChannelLookupTable,
    getFfzChannelLookupTable: $80728829cff99678$var$getFfzChannelLookupTable
};


const $d90821c36f906ffc$var$TWITCH_URL_PREFIX = `https://static-cdn.jtvnw.net/emoticons/v2`;
const $d90821c36f906ffc$var$EMOTE_REGEX_PART_1 = "(?:^|(?<=\\s))";
const $d90821c36f906ffc$var$EMOTE_REGEX_PART_2 = "(?:(?=\\s)|$)";
const $d90821c36f906ffc$var$BTTV_URL_PREFIX = "https://cdn.betterttv.net/emote";
const $d90821c36f906ffc$var$FFZ_URL_PREFIX = "https://cdn.betterttv.net/frankerfacez_emote";
// JS standard slice function does not work well with strings that contain
// unicode characters represented by more than one byte. This trick helps solve
// that problem:
const $d90821c36f906ffc$var$unicodeSlice = (string, start, end)=>[
        ...string
    ].slice(start, end).join("");
/*
  This function takes the Twitch message's `emotes` data to inject
  one `<img>` tag per emote into the message that.

  For example for this emotes object...

  {
    "9080864508308403": "2-4",
    "1010283120381084": "70-72",
  }

  ...this means that characters 2-4 in the message string need
  to be replaced with an `<img>` tag which has an URL to the image
  for the emote with the ID 9080864508308403.
*/ const $d90821c36f906ffc$var$replaceTwitchStandardEmotes = (message, emotes)=>{
    // Twitch didn't recognize any emotes in the message.
    // So we just return the original message.
    if (!emotes) return message;
    let result = message;
    const replacementMap = {};
    for (const [emoteId, occurenceIndices] of Object.entries(emotes)){
        const [startIndex, endIndex] = occurenceIndices[0].split("-");
        const emoteText = $d90821c36f906ffc$var$unicodeSlice(message, Number(startIndex), Number(endIndex) + 1);
        replacementMap[emoteText] = `<img src="${$d90821c36f906ffc$var$TWITCH_URL_PREFIX}/${emoteId}/default/light/2.0" alt="emote" />`;
    }
    for (const [emoteText, replacement] of Object.entries(replacementMap)){
        const emotePattern = new RegExp(`${$d90821c36f906ffc$var$EMOTE_REGEX_PART_1}${(0, $7908cb960895d2b8$export$2e2bcd8739ae039)(emoteText)}${$d90821c36f906ffc$var$EMOTE_REGEX_PART_2}`, "g");
        result = result.replaceAll(emotePattern, replacement);
    }
    return result;
};
/*
  This function scans the message text for occurences of bttv emote codes.

  It uses the global bttv emotes list and for each emote code (e.g. SourPls),
  it replaces that code with an `<img>` tag with the URL to that bttv emote.
*/ const $d90821c36f906ffc$var$replaceBTTVGlobalEmotes = async (message)=>{
    const bttvGlobalLookupTable = await (0, $80728829cff99678$export$2e2bcd8739ae039).getBttvGlobalLookupTable();
    const bttvGlobalEmoteCodes = Object.keys(bttvGlobalLookupTable);
    // Check if there are any global emote codes found in the message...
    const noGlobalEmoteCodeFound = bttvGlobalEmoteCodes.every((emoteCode)=>!message.includes(emoteCode));
    // ... and if not just return the original message
    if (noGlobalEmoteCodeFound) return message;
    // Else do the work: Go through each code and if you find it replace it respectively.
    let result = message;
    bttvGlobalEmoteCodes.forEach((emoteCode)=>{
        const escapedEmoteCode = (0, $7908cb960895d2b8$export$2e2bcd8739ae039)(emoteCode);
        const emoteRegexp = new RegExp(`\\b${escapedEmoteCode}\\b`, "g");
        result = result.replaceAll(emoteRegexp, (matchedEmoteCode)=>{
            const emoteId = bttvGlobalLookupTable[matchedEmoteCode].id;
            return `<img src="${$d90821c36f906ffc$var$BTTV_URL_PREFIX}/${emoteId}/2x" />`;
        });
    });
    return result;
};
const $d90821c36f906ffc$var$replaceBTTVChannelEmotes = async (message)=>{
    const bttvChannelLookupTable = await (0, $80728829cff99678$export$2e2bcd8739ae039).getBttvChannelLookupTable();
    const bttvChannelEmoteCodes = Object.keys(bttvChannelLookupTable);
    // Check if there are any channel emote codes found in the message...
    const noChannelEmoteCodeFound = bttvChannelEmoteCodes.every((emoteCode)=>!message.includes(emoteCode));
    // ... and if not just return the original message
    if (noChannelEmoteCodeFound) return message;
    // Else do the work: Go through each code and if you find it replace it respectively.
    let result = message;
    bttvChannelEmoteCodes.forEach((emoteCode)=>{
        const escapedEmoteCode = (0, $7908cb960895d2b8$export$2e2bcd8739ae039)(emoteCode);
        const emoteRegexp = new RegExp(`\\b${escapedEmoteCode}\\b`, "g");
        result = result.replaceAll(emoteRegexp, (matchedEmoteCode)=>{
            const emoteId = bttvChannelLookupTable[matchedEmoteCode].id;
            return `<img src="${$d90821c36f906ffc$var$BTTV_URL_PREFIX}/${emoteId}/2x" />`;
        });
    });
    return result;
};
const $d90821c36f906ffc$var$replaceFFZChannelEmotes = async (message)=>{
    const ffzChannelLookupTable = await (0, $80728829cff99678$export$2e2bcd8739ae039).getFfzChannelLookupTable();
    const ffzChannelEmoteCodes = Object.keys(ffzChannelLookupTable);
    // Check if there are any channel emote codes found in the message...
    const noChannelEmoteCodeFound = ffzChannelEmoteCodes.every((emoteCode)=>!message.includes(emoteCode));
    // ... and if not just return the original message
    if (noChannelEmoteCodeFound) return message;
    // Else do the work: Go through each code and if you find it replace it respectively.
    let result = message;
    ffzChannelEmoteCodes.forEach((emoteCode)=>{
        const escapedEmoteCode = (0, $7908cb960895d2b8$export$2e2bcd8739ae039)(emoteCode);
        const emoteRegexp = new RegExp(`\\b${escapedEmoteCode}\\b`, "g");
        result = result.replaceAll(emoteRegexp, (matchedEmoteCode)=>{
            const emoteId = ffzChannelLookupTable[matchedEmoteCode].id;
            return `<img src="${$d90821c36f906ffc$var$FFZ_URL_PREFIX}/${emoteId}/2" />`;
        });
    });
    return result;
};
const $d90821c36f906ffc$var$replaceEmotesWithImageTags = async (message, emotes)=>{
    let result = message;
    result = $d90821c36f906ffc$var$replaceTwitchStandardEmotes(result, emotes);
    result = await $d90821c36f906ffc$var$replaceBTTVGlobalEmotes(result);
    result = await $d90821c36f906ffc$var$replaceBTTVChannelEmotes(result);
    result = await $d90821c36f906ffc$var$replaceFFZChannelEmotes(result);
    return result;
};
var $d90821c36f906ffc$export$2e2bcd8739ae039 = $d90821c36f906ffc$var$replaceEmotesWithImageTags;


const $019e904645a842bc$var$PRONOUNS_URL_PREFIX = `https://pronouns.alejo.io/api`;
let $019e904645a842bc$var$pronounNames;
let $019e904645a842bc$var$userPronouns = {};
const $019e904645a842bc$var$fetchAllPronounNames = async ()=>{
    if ($019e904645a842bc$var$pronounNames) return $019e904645a842bc$var$pronounNames;
    const pronounsJSON = await fetch(`${$019e904645a842bc$var$PRONOUNS_URL_PREFIX}/pronouns`);
    $019e904645a842bc$var$pronounNames = await pronounsJSON.json();
    $019e904645a842bc$var$pronounNames = $019e904645a842bc$var$pronounNames.reduce((result, pronoun)=>{
        result[pronoun.name] = pronoun.display;
        return result;
    }, {});
    return $019e904645a842bc$var$pronounNames;
};
const $019e904645a842bc$export$8d8ae72bca7669b1 = async (username)=>{
    if (!$019e904645a842bc$var$pronounNames) await $019e904645a842bc$var$fetchAllPronounNames();
    const userPronounsJSON = await fetch(`${$019e904645a842bc$var$PRONOUNS_URL_PREFIX}/users/${username}`);
    const userPronounsData = await userPronounsJSON.json();
    const pronounId = userPronounsData?.[0]?.pronoun_id;
    if (pronounId) $019e904645a842bc$var$userPronouns[username] = $019e904645a842bc$var$pronounNames[pronounId];
    return $019e904645a842bc$var$userPronouns[username];
};


const $d832f2ef8a5ce6ac$var$processMessage = async (tags, message)=>{
    const messageHTMLWithEmotesReplaced = await (0, $d90821c36f906ffc$export$2e2bcd8739ae039)(message, tags.emotes);
    const userPronouns = await (0, $019e904645a842bc$export$8d8ae72bca7669b1)(tags.username);
    return {
        messageHTML: messageHTMLWithEmotesReplaced,
        pronounsText: userPronouns,
        displayName: tags["display-name"],
        userColor: tags.color
    };
};
var $d832f2ef8a5ce6ac$export$2e2bcd8739ae039 = $d832f2ef8a5ce6ac$var$processMessage;


export {$d832f2ef8a5ce6ac$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=browser.js.map
