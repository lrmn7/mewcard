const canvas = require("@napi-rs/canvas");
const { colorFetch } = require("../functions/colorFetch");

// canvas.GlobalFonts.registerFromPath(`build/structures/font/circularstd-black.otf`, "circular-std");
// canvas.GlobalFonts.registerFromPath(`build/structures/font/notosans-jp-black.ttf`, "noto-sans-jp");
// canvas.GlobalFonts.registerFromPath(`build/structures/font/notosans-black.ttf`, "noto-sans");
// canvas.GlobalFonts.registerFromPath(`build/structures/font/notoemoji-bold.ttf`, "noto-emoji");
// canvas.GlobalFonts.registerFromPath(`build/structures/font/notosans-kr-black.ttf`, "noto-sans-kr");

canvas.GlobalFonts.registerFromPath(`node_modules/mewcard/build/structures/font/circularstd-black.otf`, "circular-std");
canvas.GlobalFonts.registerFromPath(`node_modules/mewcard/build/structures/font/notosans-jp-black.ttf`, "noto-sans-jp");
canvas.GlobalFonts.registerFromPath(`node_modules/mewcard/build/structures/font/notosans-black.ttf`, "noto-sans");
canvas.GlobalFonts.registerFromPath(`node_modules/mewcard/build/structures/font/notoemoji-bold.ttf`, "noto-emoji");
canvas.GlobalFonts.registerFromPath(`node_modules/mewcard/build/structures/font/notosans-kr-black.ttf`, "noto-sans-kr");

class mewcard {
    constructor(options) {
        this.name = options?.name ?? null;
        this.author = options?.author ?? null;
        this.color = options?.color ?? null;
        this.theme = options?.theme ?? null;
        this.brightness = options?.brightness ?? null;
        this.thumbnail = options?.thumbnail ?? null;
        this.progress = options?.progress ?? null;
        this.starttime = options?.startTime ?? null;
        this.endtime = options?.endTime ?? null;
        this.requester = options?.requester ?? null
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setAuthor(author) {
        this.author = author;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    setTheme(theme) {
        this.theme = 'classic';
        return this;
    }

    setBrightness(brightness) {
        this.brightness = brightness;
        return this;
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }

    setProgress(progress) {
        this.progress = progress;
        return this;
    }

    setStartTime(starttime) {
        this.starttime = starttime;
        return this;
    }

    setEndTime(endtime) {
        this.endtime = endtime;
        return this;
    }

    setRequester(requester) {
        this.requester = `${requester}`;
        return this;
    }

    async build() {
        if (!this.name) throw new Error('Missing name parameter');
        if (!this.author) throw new Error('Missing author parameter');
        if (!this.requester) throw new Error('Missing requester parameter');
        if (!this.color) this.setColor('ff0000');
        if (!this.theme) this.setTheme('classic');
        if (!this.brightness) this.setBrightness(0);
        if (!this.thumbnail) this.setThumbnail('https://s6.imgcdn.dev/Opo4a.jpg');
        if (!this.progress) this.setProgress(0);
        if (!this.starttime) this.setStartTime('0:00');
        if (!this.endtime) this.setEndTime('0:00');

        let validatedProgress = parseFloat(this.progress);
        if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) throw new Error('Invalid progress parameter, must be between 0 to 100');

        if (validatedProgress < 2) validatedProgress = 2;
        if (validatedProgress > 99) validatedProgress = 99;

        const validatedStartTime = this.starttime || '0:00';
        const validatedEndTime = this.endtime || '0:00';

        const validatedColor = await colorFetch(
            this.color || 'ff0000',
            parseInt(this.brightness) || 0,
            this.thumbnail
        );

        if (this.name.replace(/\s/g, '').length > 15) this.name = `${this.name.slice(0, 15)}...`;
        if (this.author.replace(/\s/g, '').length > 15) this.author = `${this.author.slice(0, 15)}...`;
        if (this.requester.replace(/\s/g, '').length > 35) this.requester = `${this.requester.slice(0, 35)}...`;

        if (this.theme == 'classic') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;


            const progressBarCanvas = canvas.createCanvas(670, 25);
            const progressBarCtx = progressBarCanvas.getContext('2d');
            const cornerRadius = 10;
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(670 - cornerRadius, 0);
            progressBarCtx.arc(670 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(670, 25 - cornerRadius);
            progressBarCtx.arc(670 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = '#ababab';
            progressBarCtx.fill();
            progressBarCtx.beginPath();
            progressBarCtx.moveTo(cornerRadius, 0);
            progressBarCtx.lineTo(progressBarWidth - cornerRadius, 0);
            progressBarCtx.arc(progressBarWidth - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
            progressBarCtx.lineTo(progressBarWidth, 25);
            progressBarCtx.lineTo(cornerRadius, 25);
            progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
            progressBarCtx.lineTo(0, cornerRadius);
            progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
            progressBarCtx.closePath();
            progressBarCtx.fillStyle = `#${validatedColor}`;
            progressBarCtx.fill();

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            // Daftar URL gambar yang dapat dipilih secara acak
            const imageUrls = [
                "https://cdn.is-a.fun/mewcard/themes2/1.png",
                "https://cdn.is-a.fun/mewcard/themes2/2.png",
                "https://cdn.is-a.fun/mewcard/themes2/3.png",
                "https://cdn.is-a.fun/mewcard/themes2/4.png",
                "https://cdn.is-a.fun/mewcard/themes2/5.png",
                "https://cdn.is-a.fun/mewcard/themes2/6.png",
                "https://cdn.is-a.fun/mewcard/themes2/7.png",
                "https://cdn.is-a.fun/mewcard/themes2/8.png",
                "https://cdn.is-a.fun/mewcard/themes2/9.png",
                "https://cdn.is-a.fun/mewcard/themes2/10.png",
                "https://cdn.is-a.fun/mewcard/themes2/11.png",
                "https://cdn.is-a.fun/mewcard/themes2/12.png",
                "https://cdn.is-a.fun/mewcard/themes2/13.png",
                "https://cdn.is-a.fun/mewcard/themes2/14.png",
                "https://cdn.is-a.fun/mewcard/themes2/15.png",
                "https://cdn.is-a.fun/mewcard/themes2/16.png",
                "https://cdn.is-a.fun/mewcard/themes2/17.png",
                "https://cdn.is-a.fun/mewcard/themes2/18.png",
                "https://cdn.is-a.fun/mewcard/themes2/19.png",
                "https://cdn.is-a.fun/mewcard/themes2/20.png",
                "https://cdn.is-a.fun/mewcard/themes2/21.png",
                "https://cdn.is-a.fun/mewcard/themes2/22.png",
                "https://cdn.is-a.fun/mewcard/themes2/23.png",
                "https://cdn.is-a.fun/mewcard/themes2/24.png",
                "https://cdn.is-a.fun/mewcard/themes2/25.png",
                "https://cdn.is-a.fun/mewcard/themes2/26.png",
                "https://cdn.is-a.fun/mewcard/themes2/27.png",
                "https://cdn.is-a.fun/mewcard/themes2/28.png",
                "https://cdn.is-a.fun/mewcard/themes2/29.png",
                "https://cdn.is-a.fun/mewcard/themes2/30.png",
                "https://cdn.is-a.fun/mewcard/themes2/31.png",
                "https://cdn.is-a.fun/mewcard/themes2/32.png",
                "https://cdn.is-a.fun/mewcard/themes2/33.png",
                "https://cdn.is-a.fun/mewcard/themes2/34.png",
                "https://cdn.is-a.fun/mewcard/themes2/35.png",
                "https://cdn.is-a.fun/mewcard/themes2/36.png",
                "https://cdn.is-a.fun/mewcard/themes2/37.png",
                "https://cdn.is-a.fun/mewcard/themes2/38.png",
                "https://cdn.is-a.fun/mewcard/themes2/39.png",
                "https://cdn.is-a.fun/mewcard/themes2/40.png",
                "https://cdn.is-a.fun/mewcard/themes2/41.png",
                "https://cdn.is-a.fun/mewcard/themes2/42.png",
                "https://cdn.is-a.fun/mewcard/themes2/43.png",
                "https://cdn.is-a.fun/mewcard/themes2/44.png",
                "https://cdn.is-a.fun/mewcard/themes2/45.png",
                "https://cdn.is-a.fun/mewcard/themes2/46.png",
                "https://cdn.is-a.fun/mewcard/themes2/47.png",
                "https://cdn.is-a.fun/mewcard/themes2/48.png",
                "https://cdn.is-a.fun/mewcard/themes2/49.png",
                "https://cdn.is-a.fun/mewcard/themes2/50.png",
            ];

            // Fungsi untuk memilih URL gambar secara acak
            function getRandomImageUrl() {
                const randomIndex = Math.floor(Math.random() * imageUrls.length);
                return imageUrls[randomIndex];
            }

            // Mengambil gambar secara acak
            const backgroundUrl = getRandomImageUrl();
            const background = await canvas.loadImage(backgroundUrl);
            ctx.drawImage(background, 0, 0, frame.width, frame.height);

            const thumbnailCanvas = canvas.createCanvas(800, 200); // Mengubah lebar kanvas
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            thumbnailImage = await canvas.loadImage(this.thumbnail, {
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                    }
                }
            }).catch(() => {
                thumbnailImage = canvas.loadImage(`https://s6.imgcdn.dev/Opo4a.jpg`);
            })

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#fff'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#000000', '#FF0000', '#FFFFFF', '#800080', '#000080', '#2F4F4F'];

            // Fungsi untuk memilih warna secara acak dari array di atas
            function getRandomColor() {
                return allowedColors[Math.floor(Math.random() * allowedColors.length)];
            }

            // Mengatur warna teks secara acak dari array yang diizinkan
            ctx.font = "bold 38px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.fillText(this.name, 250, 100);

            // Teks "author" dengan warna dan ukuran font yang berbeda
            const authorText = this.author;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 22px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(authorText, 250, 140);

            // Mengukur lebar teks "author" untuk menentukan posisi teks "requester"
            const authorTextWidth = ctx.measureText(authorText).width;

            // Teks "requester" dengan warna dan ukuran font yang berbeda
            const requesterText = this.requester;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 22px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140); // Mengatur posisi "requester" setelah "author"

            return frame.toBuffer("image/png");
        } else {
            throw new Error('Invalid theme parameter, must be classic');
        }
    }
}

module.exports = { mewcard };