<div align="center">
<img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white">
<img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white">
<img src="https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD">
</div>

# ts-discord-bot
 A bot written in TypeScript made for a French community server
> **Note**
> **All debug logs are written in French due to the bot being centered around a French Discord server.**

## root **.env** variables

```js
TOKEN // The token of the Discord bot
ROLE_ID // The role ID that is given when a member joins any of the VOICE_CHANNELS_IDS
GUILD_ID // The guild ID where the above takes place
VOICE_CHANNELS_IDS // The IDs of the voice channels where members should receive the role once they connect to them
```

## Installation in 3 steps

1. **Clone** the repo
   ```bash
   git clone https://github.com/proudCobolWriter/ts-discord-bot.git
   ```

2. Make sure all [**environment variables**](#root-env-variables) are specified (you can run skip to the last step)

3. **Change dir**ectory to ts-discord-bot using the ``cd`` command

4. **Run** the shell script within ``ts-discord-bot`` :

   * for **Windows** with **Git Bash** ⬇️
   ```
   bash startup.sh
   ```
   * for **Linux/UNIX**[^1] ⬇️
   ```
   sh startup.sh
   ```

### TODO:
- [ ] Do a few starter commands such as Wikipedia article search
- [ ] Add locales (translate updateBotPresence.ts "members")
- [ ] Fix logger and add rotating
- [ ] "To add onto this: fetching all commands only to compare and deploy if changes are detected is worse practice than just deploying on every start. Because discord compares the payload to your currently deployed commands and only applies changes anyway. So you trade 1 request with comparison maintained by discord against 1 + x requests with added local comparison that won’t be maintained by discord"

<br>

[^1]: Both syntaxes (``bash`` and ``sh``) work on **Linux/UNIX** systems.