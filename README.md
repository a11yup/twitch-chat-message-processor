# Twitch Chat Message Processor

A small utility that processes Twitch chat message data from tmi.js and outputs prendered HTML and other metadata that can be used for custom chat overlays.

## Features

- Transformation of a chat message into an HTML string that includes replacements of emote codes (Twitch, BetterTTV and FrankerFaceZ) with respective `<img>` tags.
- Fetching of chat users pronouns per message

## Setup

*Important*: Currently only works as ES module.

Include the script in your HTML file. Make sure to specify the right version by replacing the `v1.0.0` with any existing version tag in this repository.

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/a11yup/twitch-chat-message-processor@v1.0.0/dist/browser.min.js"></script>
```

## Usage

In any of your JavaScript on your page you can then import and use the main function like this:

```js
import processMessage from "twitch-chat-message-processor";

// ...listen to messages with tmi.js and get `tags` and `message`

// Use tags and message provided by tmi.js and pass it into the function
const processedMessageData = processMessage(tags, message);
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
