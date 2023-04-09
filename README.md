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
   
   git clone https://github.com/proudCobolWriter/discord-bot

2. Make sure [environment variables](#installation-in-3-steps) are specified

3. Run the project (for **Windows**) :
   ```bash
   bash startup.sh
   ```

### TODO:
- [ ] Fix bad practice when registering (/) commands via ApplicationCommandManager#fetch to retrieve all commands
- [ ] Implement jobs (i.g. updateBotPresence.ts)
- [ ] Do a few starter commands such as Wikipedia article search
- [ ] Add lang folder
- [ ] Add locales
- [ ] Print out .env variables in the case they are missing directly from a "doc" folder in the root directory
- [ ] Remove the role from people who are not in the voice channels in case the bot process got killed