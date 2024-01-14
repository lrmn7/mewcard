# __About__
**Musicard** is a futuristic music card library designed for Discord bots.

# __Installation__
```
npm install mewcard
```

# __Example__
This example code will generate a music card image and save it.
```js
(async () => {
    const { mewcard } = require("mewcard");
    const fs = require("fs");

    const card = new mewcard()
        .setName("Ghea indrawari")
        .setAuthor("Jiwa yang bersedih")
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

# __Output__
This is the **classic** output of musicard.
![classic](/example/mewwcard.png)

# Originial Source

```
https://github.com/a3pire
```
# Projects
|  Sr.  |            Name            |  Platform  |
|:-----:|:--------------------------:|:----------:|
| **1** | [Mewwme's Music](https://discord.com/api/oauth2/authorize?client_id=928711702596423740&permissions=2184571952&scope=bot%20applications.commands) | discord.js |