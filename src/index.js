import replaceEmotesWithImageTags from "./emotes.js";
import { fetchPronounsForUser } from "./pronouns.js";

const processMessage = async (tags, message) => {
  const messageHTMLWithEmotesReplaced = await replaceEmotesWithImageTags(
    message,
    tags.emotes
  );

  const userPronouns = await fetchPronounsForUser(tags.username);

  return {
    messageHTML: messageHTMLWithEmotesReplaced,
    pronounsText: userPronouns,
    displayName: tags["display-name"],
    userColor: tags.color,
  };
};

export default processMessage;
