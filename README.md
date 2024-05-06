<br />
<p align="center">
  <a href="https://discord.gg/6EXgrmtkPX">
    <img src="https://cdn.meww.me/bot/mewwme/mehelp.png" alt="Mewwme" >
  </a>

  <h1 align="center">M E W C A R D</h1>

  <p align="center"> Mewcard is a futuristic music card library designed for Discord bots.
    <br />
    <br />
    <a href="https://github.com/lrmn7/helpdesk/issues">Report Issues & Give Suggestions</a>
    ·
    <a href="https://discord.com/oauth2/authorize?client_id=928711702596423740&permissions=8&scope=bot+applications.commands">Invite</a>
    ·
    <a href="https://discord.gg/6EXgrmtkPX">Support Server</a>
  </p>

# __Installation__
```
npm install mewcard
yarn add mewcard
pnpm install mewcard
```

# __Example__
This example code will generate a music card image and save it.
```js
(async () => {
    const { mewcard } = require("mewcard");
    const fs = require("fs");

    const card = new mewcard()
        .setName("Bunga Hati")
        .setAuthor("Salma Salsabil")
        .setColor("auto")
        .setTheme("classic")
        .setBrightness(50)
        .setThumbnail("https://cdn.discordapp.com/attachments/1194410866209206412/1196152611594838026/mewwme.png")
        .setRequester("romanromannya")

    const cardBuffer = await card.build();

    fs.writeFileSync(`mewcard.png`, cardBuffer);
    console.log("Done!");
})()
```

# __Available Themes__
- `themes1`, `themes2`, `themes3`, to `themes18`
- `mewwme`, `mewwme1` (Mewwme's theme, which is based on Mewwme's profile picture.)

# __Card Available__
![classic](/example/8.png)
![classic](/example/14.png)
![classic](/example/15.png)

# Projects
|  Sr.  |            Name            |  Platform  |
|:-----:|:--------------------------:|:----------:|
| **1** | [Mewwme's Music](https://discord.com/oauth2/authorize?client_id=928711702596423740&permissions=8&scope=bot+applications.commands) | discord.js |
