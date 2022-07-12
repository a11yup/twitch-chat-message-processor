# Twitch Chat Message Processor

A small utility that processes Twitch chat message data from tmi.js and outputs prendered HTML and other metadata that can be used for custom chat overlays.

## Features

- Transformation of a chat message into HTML string. That includes replacement of emote codes (Twitch, BetterTTV and FrankerFaceZ) with `<img>` tags.
- Fetching of chat users pronouns per message

## Usage

```js
import processMessage from "twitch-chat-message-processor";

processMessage(tags, message);
```

This returns:

```js
{
  messageHTML, // message text with all occurrence of emotes replaced with <img> tags
    pronounsText, // the chatter's pronouns as text (e.g. they/them)
    displayName, // the chatter's display name including capitalization
    userColor; // the chatter's user color as hex code (if set)
}
```
