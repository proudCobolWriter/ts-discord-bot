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

## root **.env** variable(s)

```
TOKEN <- The token of the Discord bot
```

## Installation in 3 steps

1. **Clone** the repo
   ```bash
   git clone https://github.com/proudCobolWriter/ts-discord-bot.git
   ```

2. Make sure the ``TOKEN`` [**environment variable**](#root-env-variables) is specified (optional; you can skip to the last step)

3. **C**hange **d**irectory to ``ts-discord-bot`` using the ``cd`` command

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
- [ ] Release a few starter commands such as Wikipedia article search
- [ ] Include the filename in stack-free logs

<br>

[^1]: Both syntaxes (``bash`` and ``sh``) work on **Linux/UNIX** systems.