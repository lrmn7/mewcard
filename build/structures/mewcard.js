const canvas = require("@napi-rs/canvas");
const { colorFetch } = require("../functions/colorFetch");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

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
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-bun/build/structures/font/Chewy-Regular.ttf`, "chewy");
canvas.GlobalFonts.registerFromPath(`node_modules/musicard-bun/build/structures/font/Space.ttf`, "space");


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
        this.theme = theme || 'mewwme';
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
        if (!this.theme) this.setTheme('mewwme');
        if (!this.brightness) this.setBrightness(0);
        if (!this.thumbnail) this.setThumbnail('https://cdn.meww.me/assets/thumbnail.png');
        if (!this.progress) this.setProgress(0);
        if (!this.starttime) this.setStartTime('0:00');
        if (!this.endtime) this.setEndTime('0:00');

        let validatedProgress = parseFloat(this.progress);
        if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) throw new Error('Invalid progress parameter, must be between 0 to 100');

        if (validatedProgress < 2) validatedProgress = 2;
        if (validatedProgress > 99) validatedProgress = 99;

        const validatedColor = await colorFetch(
            this.color || 'ff0000',
            parseInt(this.brightness) || 0,
            this.thumbnail
        );

        if (this.name.replace(/\s/g, '').length > 15) this.name = `${this.name.slice(0, 15)}...`;
        if (this.author.replace(/\s/g, '').length > 15) this.author = `${this.author.slice(0, 15)}`;
        if (this.requester.replace(/\s/g, '').length > 12) this.requester = `${this.requester.slice(0, 10)}...`;

        if (this.theme == 'mewwme') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            // Daftar URL gambar yang dapat dipilih secara acak
            const imageUrls = [
                "https://cdn.meww.me/assets/mews-card1.png",
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/assets/thumbnail.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#f2d7b7'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#77797c', '#0641c7', '#967e58', '#628fa4', '#d34d52', '#f00c8f'];

            // Fungsi untuk memilih warna secara acak dari array di atas
            function getRandomColor() {
                return allowedColors[Math.floor(Math.random() * allowedColors.length)];
            }

            // Mengatur warna teks secara acak dari array yang diizinkan
            ctx.font = "bold 50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.fillText(this.name, 250, 103);

            // Teks "author" dengan warna dan ukuran font yang berbeda
            const authorText = this.author;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 34px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(authorText, 250, 143);

            // Mengukur lebar teks "author" untuk menentukan posisi teks "requester"
            const authorTextWidth = ctx.measureText(authorText).width;

            // Teks "requester" dengan warna dan ukuran font yang berbeda
            const requesterText = this.requester;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 34px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(requesterText, 250 + authorTextWidth + 10, 143); // Mengatur posisi "requester" setelah "author"

            return frame.toBuffer("image/png");
        } else if (this.theme == 'kobokanaeru') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;
            const imageUrls = [
                "https://cdn.meww.me/mewcard/KoboKanaeru/1.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/2.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/3.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/4.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/5.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/6.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/7.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/8.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/9.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/10.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/11.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/12.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/13.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/14.png",
                "https://cdn.meww.me/mewcard/KoboKanaeru/15.png",
            ];
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/KoboKanaeru/kobokanaeru.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#79b8d5'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#79b8d5', '#90979a', '#f89f96', '#d0cfcd', '#fcd0d1', '#fefefe'];

            // Fungsi untuk memilih warna secara acak dari array di atas
            function getRandomColor() {
                return allowedColors[Math.floor(Math.random() * allowedColors.length)];
            }

            // Mengatur warna teks secara acak dari array yang diizinkan
            ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.fillText(this.name, 250, 100);

            // Teks "author" dengan warna dan ukuran font yang berbeda
            const authorText = this.author;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 26px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(authorText, 250, 140);

            // Mengukur lebar teks "author" untuk menentukan posisi teks "requester"
            const authorTextWidth = ctx.measureText(authorText).width;

            // Teks "requester" dengan warna dan ukuran font yang berbeda
            const requesterText = this.requester;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 26px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140); // Mengatur posisi "requester" setelah "author"

            return frame.toBuffer("image/png");
        } else if (this.theme == 'vestiazeta') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;
            const imageUrls = [
                "https://cdn.meww.me/mewcard/VestiaZeta/1.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/2.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/3.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/4.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/5.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/6.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/7.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/8.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/9.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/10.png",
                "https://cdn.meww.me/mewcard/VestiaZeta/11.png",
            ];
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/VestiaZeta/vestiazeta.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#f2d7b7'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#b6b5ba', '#b2a085', '#747fa6', '#fef7f1', '#d6d5dd', '#b0c8ea'];

            // Fungsi untuk memilih warna secara acak dari array di atas
            function getRandomColor() {
                return allowedColors[Math.floor(Math.random() * allowedColors.length)];
            }

            // Mengatur warna teks secara acak dari array yang diizinkan
            ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.fillText(this.name, 250, 100);

            // Teks "author" dengan warna dan ukuran font yang berbeda
            const authorText = this.author;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 26px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(authorText, 250, 140);

            // Mengukur lebar teks "author" untuk menentukan posisi teks "requester"
            const authorTextWidth = ctx.measureText(authorText).width;

            // Teks "requester" dengan warna dan ukuran font yang berbeda
            const requesterText = this.requester;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 26px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140); // Mengatur posisi "requester" setelah "author"

            return frame.toBuffer("image/png");
        } else if (this.theme == 'cute') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;
            const imageUrls = [
                "https://cdn.meww.me/mewcard/Cute/1.png",
                "https://cdn.meww.me/mewcard/Cute/2.png",
                "https://cdn.meww.me/mewcard/Cute/3.png",
                "https://cdn.meww.me/mewcard/Cute/4.png",
                "https://cdn.meww.me/mewcard/Cute/5.png",
                "https://cdn.meww.me/mewcard/Cute/6.png",
                "https://cdn.meww.me/mewcard/Cute/7.png",
                "https://cdn.meww.me/mewcard/Cute/8.png",
                "https://cdn.meww.me/mewcard/Cute/9.png",
                "https://cdn.meww.me/mewcard/Cute/10.png",
            ];
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/VestiaZeta/vestiazeta.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#f4e0c7'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#96dcfc', '#b6b5ba', '#f4e0c7', '#e2b379', '#f9cfc2', '#ff4158'];

            // Fungsi untuk memilih warna secara acak dari array di atas
            function getRandomColor() {
                return allowedColors[Math.floor(Math.random() * allowedColors.length)];
            }

            // Mengatur warna teks secara acak dari array yang diizinkan
            ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.fillText(this.name, 250, 100);

            // Teks "author" dengan warna dan ukuran font yang berbeda
            const authorText = this.author;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 26px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(authorText, 250, 140);

            // Mengukur lebar teks "author" untuk menentukan posisi teks "requester"
            const authorTextWidth = ctx.measureText(authorText).width;

            // Teks "requester" dengan warna dan ukuran font yang berbeda
            const requesterText = this.requester;
            ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
            ctx.font = "bold 26px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140); // Mengatur posisi "requester" setelah "author"

            return frame.toBuffer("image/png");
        } else if (this.theme == 'yui') {
                const frame = canvas.createCanvas(800, 200);
                const ctx = frame.getContext("2d");
    
                const circleCanvas = canvas.createCanvas(1000, 1000);
                const circleCtx = circleCanvas.getContext('2d');
    
                const circleRadius = 20;
                const circleY = 97;
    
                // Daftar URL gambar yang dapat dipilih secara acak
                const imageUrls = [
                    "https://cdn.meww.me/mewcard/mewwme/1.png",
                    "https://cdn.meww.me/mewcard/mewwme/2.png",
                    "https://cdn.meww.me/mewcard/mewwme/3.png",
                    "https://cdn.meww.me/mewcard/mewwme/4.png",
                    "https://cdn.meww.me/mewcard/mewwme/5.png",
                    "https://cdn.meww.me/mewcard/mewwme/6.png",
                    "https://cdn.meww.me/mewcard/mewwme/7.png",
                    "https://cdn.meww.me/mewcard/mewwme/8.png",
                    "https://cdn.meww.me/mewcard/mewwme/9.png",
                    "https://cdn.meww.me/mewcard/mewwme/10.png",
                    "https://cdn.meww.me/mewcard/mewwme/11.png",
                    "https://cdn.meww.me/mewcard/mewwme/12.png",
                    "https://cdn.meww.me/mewcard/mewwme/13.png",
                    "https://cdn.meww.me/mewcard/mewwme/14.png",
                    "https://cdn.meww.me/mewcard/mewwme/15.png",
                    "https://cdn.meww.me/mewcard/mewwme/16.png",
                    "https://cdn.meww.me/mewcard/mewwme/17.png",
                    "https://cdn.meww.me/mewcard/mewwme/18.png",
                    "https://cdn.meww.me/mewcard/mewwme/19.png",
                    "https://cdn.meww.me/mewcard/mewwme/20.png",
                    "https://cdn.meww.me/mewcard/mewwme/21.png",
                    "https://cdn.meww.me/mewcard/mewwme/22.png",
                    "https://cdn.meww.me/mewcard/mewwme/23.png",
                    "https://cdn.meww.me/mewcard/mewwme/24.png",
                    "https://cdn.meww.me/mewcard/mewwme/25.png",
                    "https://cdn.meww.me/mewcard/mewwme/26.png",
                    "https://cdn.meww.me/mewcard/mewwme/27.png",
                    "https://cdn.meww.me/mewcard/mewwme/28.png",
                    "https://cdn.meww.me/mewcard/mewwme/29.png",
                    "https://cdn.meww.me/mewcard/mewwme/30.png",
                    "https://cdn.meww.me/mewcard/mewwme/31.png",
                    "https://cdn.meww.me/mewcard/mewwme/32.png",
                    "https://cdn.meww.me/mewcard/mewwme/33.png",
                    "https://cdn.meww.me/mewcard/mewwme/34.png",
                    "https://cdn.meww.me/mewcard/mewwme/35.png",
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
    
                try {
                    thumbnailImage = await canvas.loadImage(this.thumbnail, {
                        requestOptions: {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                            }
                        }
                    });
                } catch (error) {
                    // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                    console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                    thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/assets/thumbnail.png`); // Gunakan gambar default atau URL alternatif
                }
    
                const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
                const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
                const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;
    
    
    
                thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
    
    
                // Menggambar thumbnail
                ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);
    
                // Menambahkan border putih
                ctx.strokeStyle = '#f2d7b7'; // Warna border putih
                ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
                ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border
    
    
                // Fungsi untuk menghasilkan warna heksadesimal acak
                // Array warna yang diizinkan
                const allowedColors = ['#f2d7b7', '#fbc5f9', '#00ff2a', '#ff00a8', '#00ffe4', '#ff6000'];
    
                // Fungsi untuk memilih warna secara acak dari array di atas
                function getRandomColor() {
                    return allowedColors[Math.floor(Math.random() * allowedColors.length)];
                }
    
                // Mengatur warna teks secara acak dari array yang diizinkan
                ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
                ctx.fillText(this.name, 250, 100);
    
                // Teks "author" dengan warna dan ukuran font yang berbeda
                const authorText = this.author;
                ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
                ctx.font = "bold 26px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                ctx.fillText(authorText, 250, 140);
    
                // Mengukur lebar teks "author" untuk menentukan posisi teks "requester"
                const authorTextWidth = ctx.measureText(authorText).width;
    
                // Teks "requester" dengan warna dan ukuran font yang berbeda
                const requesterText = this.requester;
                ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
                ctx.font = "bold 26px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140); // Mengatur posisi "requester" setelah "author"
    
                return frame.toBuffer("image/png");
        } else if (this.theme == 'themes1') {
            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes1/1.png`);

            const thumbnailCanvas = canvas.createCanvas(650, 650);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');


            let thumbnailImage;

           
            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes8/thumbnail.png`); // Gunakan gambar default atau URL alternatif
            }
            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 450);


            ctx.fillStyle = `#${validatedColor}`;
            ctx.font = `75px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 490, 180); 

            ctx.fillStyle = '#f40cb5';
            ctx.font = `55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 510, 260); 

            ctx.fillStyle = '#0cf4bb';
            ctx.font = `50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.requester, 520, 330);

           ctx.drawImage(thumbnailCanvas, 70, 50, 350, 350);

            return image.toBuffer('image/png');
        } else if (this.theme == 'themes2') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            // Daftar URL gambar yang dapat dipilih secara acak
            const imageUrls = [
                "https://cdn.meww.me/mewcard/themes2/1.png",
                "https://cdn.meww.me/mewcard/themes2/2.png",
                "https://cdn.meww.me/mewcard/themes2/3.png",
                "https://cdn.meww.me/mewcard/themes2/4.png",
                "https://cdn.meww.me/mewcard/themes2/5.png",
                "https://cdn.meww.me/mewcard/themes2/6.png",
                "https://cdn.meww.me/mewcard/themes2/7.png",
                "https://cdn.meww.me/mewcard/themes2/8.png",
                "https://cdn.meww.me/mewcard/themes2/9.png",
                "https://cdn.meww.me/mewcard/themes2/10.png",
                "https://cdn.meww.me/mewcard/themes2/11.png",
                "https://cdn.meww.me/mewcard/themes2/12.png",
                "https://cdn.meww.me/mewcard/themes2/13.png",
                "https://cdn.meww.me/mewcard/themes2/14.png",
                "https://cdn.meww.me/mewcard/themes2/15.png",
                "https://cdn.meww.me/mewcard/themes2/16.png",
                "https://cdn.meww.me/mewcard/themes2/17.png",
                "https://cdn.meww.me/mewcard/themes2/18.png",
                "https://cdn.meww.me/mewcard/themes2/19.png",
                "https://cdn.meww.me/mewcard/themes2/20.png",
                "https://cdn.meww.me/mewcard/themes2/21.png",
                "https://cdn.meww.me/mewcard/themes2/22.png",
                "https://cdn.meww.me/mewcard/themes2/23.png",
                "https://cdn.meww.me/mewcard/themes2/24.png",
                "https://cdn.meww.me/mewcard/themes2/25.png",
                "https://cdn.meww.me/mewcard/themes2/26.png",
                "https://cdn.meww.me/mewcard/themes2/27.png",
                "https://cdn.meww.me/mewcard/themes2/28.png",
                "https://cdn.meww.me/mewcard/themes2/29.png",
                "https://cdn.meww.me/mewcard/themes2/30.png",
                "https://cdn.meww.me/mewcard/themes2/31.png",
                "https://cdn.meww.me/mewcard/themes2/32.png",
                "https://cdn.meww.me/mewcard/themes2/33.png",
                "https://cdn.meww.me/mewcard/themes2/34.png",
                "https://cdn.meww.me/mewcard/themes2/35.png",
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/assets/thumbnail.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#f2d7b7'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#f2d7b7', '#cc8eca', '#00ff2a', '#13776c', '#ff6000'];

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
        } else if (this.theme == 'themes3') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            // Daftar URL gambar yang dapat dipilih secara acak
            const imageUrls = [
                "https://cdn.meww.me/mewcard/themes3/1.png",
                "https://cdn.meww.me/mewcard/themes3/2.png",
                "https://cdn.meww.me/mewcard/themes3/4.png",
                "https://cdn.meww.me/mewcard/themes3/5.png",
                "https://cdn.meww.me/mewcard/themes3/3.png",
                "https://cdn.meww.me/mewcard/themes3/6.png",
                "https://cdn.meww.me/mewcard/themes3/7.png",
                "https://cdn.meww.me/mewcard/themes3/8.png",
                "https://cdn.meww.me/mewcard/themes3/9.png",
                "https://cdn.meww.me/mewcard/themes3/10.png",
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/assets/thumbnail.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#f2d7b7'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border

            const allowedColors = ['#f2d7b7', '#cc8eca', '#00ff2a', '#13776c', '#ffffff'];

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
        } else if (this.theme == 'themes4') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            // Daftar URL gambar yang dapat dipilih secara acak
            const imageUrls = [
                "https://cdn.meww.me/mewcard/themes4/1.png",
                "https://cdn.meww.me/mewcard/themes4/2.png",
                "https://cdn.meww.me/mewcard/themes4/4.png",
                "https://cdn.meww.me/mewcard/themes4/5.png",
                "https://cdn.meww.me/mewcard/themes4/3.png",
                "https://cdn.meww.me/mewcard/themes4/6.png",
                "https://cdn.meww.me/mewcard/themes4/7.png",
                "https://cdn.meww.me/mewcard/themes4/8.png",
                "https://cdn.meww.me/mewcard/themes4/9.png",
                "https://cdn.meww.me/mewcard/themes4/10.png",
                "https://cdn.meww.me/mewcard/themes4/11.png",
                "https://cdn.meww.me/mewcard/themes4/12.png",
                "https://cdn.meww.me/mewcard/themes4/13.png",
                "https://cdn.meww.me/mewcard/themes4/14.png",
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes4/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#00ffff'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#f2d7b7', '#504e4d', '#5b0656', '#eb6e68', '#ff6000'];

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
        } else if (this.theme == 'themes5') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            // Daftar URL gambar yang dapat dipilih secara acak
            const imageUrls = [
                "https://cdn.meww.me/mewcard/themes5/1.png",
                "https://cdn.meww.me/mewcard/themes5/2.png",
                "https://cdn.meww.me/mewcard/themes5/4.png",
                "https://cdn.meww.me/mewcard/themes5/5.png",
                "https://cdn.meww.me/mewcard/themes5/3.png",
                "https://cdn.meww.me/mewcard/themes5/6.png",
                "https://cdn.meww.me/mewcard/themes5/7.png",
                "https://cdn.meww.me/mewcard/themes5/8.png",
                "https://cdn.meww.me/mewcard/themes5/9.png",
                "https://cdn.meww.me/mewcard/themes5/10.png",
                "https://cdn.meww.me/mewcard/themes5/11.png",
                "https://cdn.meww.me/mewcard/themes5/12.png",
                "https://cdn.meww.me/mewcard/themes5/13.png",
                "https://cdn.meww.me/mewcard/themes5/14.png",
                "https://cdn.meww.me/mewcard/themes5/15.png",
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes5/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#242424'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#f2d7b7', '#ffffff', '#00d8ff'];

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
        } else if (this.theme == 'themes6') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            // Daftar URL gambar yang dapat dipilih secara acak
            const imageUrls = [
                "https://cdn.meww.me/mewcard/themes6/1.png",
                "https://cdn.meww.me/mewcard/themes6/2.png",
                "https://cdn.meww.me/mewcard/themes6/4.png",
                "https://cdn.meww.me/mewcard/themes6/3.png",
                "https://cdn.meww.me/mewcard/themes6/5.png",
                "https://cdn.meww.me/mewcard/themes6/6.png",
                "https://cdn.meww.me/mewcard/themes6/7.png",
                "https://cdn.meww.me/mewcard/themes6/8.png",
                "https://cdn.meww.me/mewcard/themes6/9.png",
                "https://cdn.meww.me/mewcard/themes6/10.png",
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes6/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#f2d7b7'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#f2d7b7', '#ffffff', '#00d8ff'];

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
        } else if (this.theme == 'themes7') {
            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            // Daftar URL gambar yang dapat dipilih secara acak
            const imageUrls = [
                "https://cdn.meww.me/mewcard/themes7/1.png",
                "https://cdn.meww.me/mewcard/themes7/2.png",
                "https://cdn.meww.me/mewcard/themes7/4.png",
                "https://cdn.meww.me/mewcard/themes7/3.png",
                "https://cdn.meww.me/mewcard/themes7/5.png",
                "https://cdn.meww.me/mewcard/themes7/6.png",
                "https://cdn.meww.me/mewcard/themes7/7.png",
                "https://cdn.meww.me/mewcard/themes7/9.png",
                "https://cdn.meww.me/mewcard/themes7/8.png",
                "https://cdn.meww.me/mewcard/themes7/10.png",
                "https://cdn.meww.me/mewcard/themes7/11.png",
                "https://cdn.meww.me/mewcard/themes7/12.png",
                "https://cdn.meww.me/mewcard/themes7/13.png",
                "https://cdn.meww.me/mewcard/themes7/14.png",
                "https://cdn.meww.me/mewcard/themes7/15.png",
                "https://cdn.meww.me/mewcard/themes7/16.png",
                "https://cdn.meww.me/mewcard/themes7/17.png",
                "https://cdn.meww.me/mewcard/themes7/18.png",
                "https://cdn.meww.me/mewcard/themes7/19.png",
                "https://cdn.meww.me/mewcard/themes7/20.png",
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes7/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#169fd8'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#f2d7b7', '#ffffff', '#00d8ff'];

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
        } else if (this.theme == 'themes8') {
            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes8/1.png`);

            const thumbnailCanvas = canvas.createCanvas(564, 564);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;


            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes8/thumbnail.png`); // Gunakan gambar default atau URL alternatif
            }
            

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');
            

            ctx.drawImage(background, 0, 0, 1280, 450);

            ctx.fillStyle = `#${validatedColor}`;
            ctx.font = `65px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 70, 120);

            ctx.fillStyle = '#b8b8b8';
            ctx.font = `50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 75, 220);

            ctx.fillStyle = '#b8b8b8';
            ctx.font = `45px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText("Request by " + this.requester, 80, 380, 670, 25);

            ctx.drawImage(thumbnailCanvas, 837, 8, 435, 435);

            return image.toBuffer('image/png');
        } else if (this.theme == 'themes9') {
            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes9/1.png`);

            const thumbnailCanvas = canvas.createCanvas(650, 650);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');


            let thumbnailImage;

           
            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes9/no.png`); // Gunakan gambar default atau URL alternatif
            }
            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 450);


            ctx.fillStyle = `#${validatedColor}`;
            ctx.font = `75px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 490, 180); 

            ctx.fillStyle = '#f40cb5';
            ctx.font = `55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 510, 260); 

            ctx.fillStyle = '#0cf4bb';
            ctx.font = `50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.requester, 520, 330);

           ctx.drawImage(thumbnailCanvas, 70, 50, 350, 350);

            return image.toBuffer('image/png');
        } else if (this.theme == 'themes10') {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes10/1.png`);

            const thumbnailCanvas = canvas.createCanvas(650, 650);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');


            let thumbnailImage;

           
            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes10/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 450);


            ctx.fillStyle = `#${validatedColor}`;
            ctx.font = `75px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 430, 200); 

            ctx.fillStyle = '#f40cb5';
            ctx.font = `55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 440, 280); 

            ctx.fillStyle = '#ffffff';
            ctx.font = `50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.requester, 450, 350);

            const thumbnailMaskCanvas = canvas.createCanvas(thumbnailCanvas.width, thumbnailCanvas.height);
            const thumbnailMaskCtx = thumbnailMaskCanvas.getContext('2d');
            const thumbnailMaskRadius = thumbnailCanvas.width / 2;
            
            thumbnailMaskCtx.beginPath();
            thumbnailMaskCtx.arc(thumbnailMaskRadius, thumbnailMaskRadius, thumbnailMaskRadius, 0, 2 * Math.PI);
            thumbnailMaskCtx.closePath();
            thumbnailMaskCtx.fillStyle = '#000'; // You can change the color to any color you prefer
            thumbnailMaskCtx.fill();
            
          
            thumbnailCtx.globalCompositeOperation = 'destination-in';
            thumbnailCtx.drawImage(thumbnailMaskCanvas, 0, 0);
            thumbnailCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(thumbnailCanvas, 57, 105, 288, 288);

            return image.toBuffer('image/png');
        } else if (this.theme == 'themes11') {
            const frame = canvas.createCanvas(3264, 765);
            const ctx = frame.getContext("2d");

            const background = await canvas.loadImage("https://cdn.meww.me/mewcard/themes11/1.png");
            ctx.drawImage(background, 0, 0, frame.width, frame.height);

            const thumbnailCanvas = canvas.createCanvas(650, 650);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            
            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes11/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            ctx.save();
            ctx.beginPath();
            ctx.arc(400, 382.5, 300, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(thumbnailCanvas, 75, 60, 650, 650);
            ctx.restore();

            ctx.font = "bold 150px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillStyle = `#${validatedColor}`;
            ctx.fillText(this.name, 800, 300);

            ctx.font = "bold 100px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
            ctx.fillStyle = "#787878";
            ctx.fillText(this.author, 800, 450);

            ctx.fillStyle = '#ffffff';
            ctx.font = `bold 80px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText("Request by " + this.requester, 800, 555);



            return frame.toBuffer("image/png");
        } else if (this.theme === "themes12") {
            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes12/1.png`);

            const thumbnailCanvas = canvas.createCanvas(650, 650);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');


            let thumbnailImage;

           
            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes12/no.png`); // Gunakan gambar default atau URL alternatif
            }
            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 450);


            ctx.fillStyle = `#ffffff`;
            ctx.font = `75px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 490, 180); 

            ctx.fillStyle = '#f2d7b7';
            ctx.font = `55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 510, 260); 

            ctx.fillStyle = '#cdcdcd';
            ctx.font = `50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.requester, 520, 330);

           ctx.drawImage(thumbnailCanvas, 70, 50, 350, 350);

            return image.toBuffer('image/png');
        } else if (this.theme === "themes13") {
            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes13/1.png`);

            const thumbnailCanvas = canvas.createCanvas(650, 650);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');


            let thumbnailImage;

           
            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes13/no.png`); // Gunakan gambar default atau URL alternatif
            }
            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 450);


            ctx.fillStyle = `#ffffff`;
            ctx.font = `75px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 490, 180); 

            ctx.fillStyle = '#f2d7b7';
            ctx.font = `55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 510, 260); 

            ctx.fillStyle = `#${validatedColor}`;
            ctx.font = `50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.requester, 520, 330);

           ctx.drawImage(thumbnailCanvas, 70, 50, 350, 350);

            return image.toBuffer('image/png');
        } else if (this.theme === "themes14") {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;
            const image = canvas.createCanvas(1280, 450);
            const ctx = image.getContext('2d');
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

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes14/1.png`);

            const thumbnailCanvas = canvas.createCanvas(650, 650);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes14/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const bg2 = await canvas.loadImage("https://cdn.meww.me/mewcard/themes14/2.png")

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 450);
            ctx.drawImage(bg2, 0, 0, 1280, 450);

            // Apply fade effect between background and upper parts
            const gradient = ctx.createLinearGradient(0, 0, 0, 450);
            gradient.addColorStop(0, 'rgba(0,0,0,0.1)'); // Fully transparent
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.1)'); // 50% transparent
            gradient.addColorStop(1, 'rgba(0,0,0,0.1)'); // Fully opaque

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 450);
            ctx.fillStyle = `#f2d7b7`;
            ctx.font = `70px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 450, 200); 

            ctx.fillStyle = '#fcfcfc';
            ctx.font = `50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 460, 280); 

            ctx.fillStyle = `#${validatedColor}`;
            ctx.font = `40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.requester, 460, 340);
            ctx.save();

            const thumbnailMaskCanvas = canvas.createCanvas(thumbnailCanvas.width, thumbnailCanvas.height);
            const thumbnailMaskCtx = thumbnailMaskCanvas.getContext('2d');
            const thumbnailMaskRadius = thumbnailCanvas.width / 2;
            
            thumbnailMaskCtx.beginPath();
            thumbnailMaskCtx.arc(thumbnailMaskRadius, thumbnailMaskRadius, thumbnailMaskRadius, 0, 2 * Math.PI);
            thumbnailMaskCtx.closePath();
            thumbnailMaskCtx.fillStyle = '#000'; // You can change the color to any color you prefer
            thumbnailMaskCtx.fill();
            
          
            thumbnailCtx.globalCompositeOperation = 'destination-in';
            thumbnailCtx.drawImage(thumbnailMaskCanvas, 0, 0);
            thumbnailCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(thumbnailCanvas, 57, 105, 288, 288);

            return image.toBuffer('image/png');
        } else if (this.theme === "themes15") {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;
            const image = canvas.createCanvas(1280, 350);
            const ctx = image.getContext('2d');
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

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes15/1.png`);

            const thumbnailCanvas = canvas.createCanvas(500, 500);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes14/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const bg2 = await canvas.loadImage("https://cdn.meww.me/mewcard/themes14/2.png")

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 350);
            ctx.drawImage(bg2, 0, 0, 1280, 350);

            // Apply fade effect between background and upper parts
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(0,0,0,0.1)'); // Fully transparent
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.1)'); // 50% transparent
            gradient.addColorStop(1, 'rgba(0,0,0,0.1)'); // Fully opaque

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 350);
            ctx.fillStyle = `#f2d7b7`;
            ctx.font = `60px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 430, 155); 

            ctx.fillStyle = '#fcfcfc';
            ctx.font = `45px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 430, 220); 

            ctx.fillStyle = `#f2d7b7`;
            ctx.font = `35px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText("Request by " + this.requester, 430, 270);
            ctx.save();

            const thumbnailMaskCanvas = canvas.createCanvas(thumbnailCanvas.width, thumbnailCanvas.height);
            const thumbnailMaskCtx = thumbnailMaskCanvas.getContext('2d');
            const thumbnailMaskRadius = thumbnailCanvas.width / 2;
            
            thumbnailMaskCtx.beginPath();
            thumbnailMaskCtx.arc(thumbnailMaskRadius, thumbnailMaskRadius, thumbnailMaskRadius, 0, 2 * Math.PI);
            thumbnailMaskCtx.closePath();
            thumbnailMaskCtx.fillStyle = '#000'; // You can change the color to any color you prefer
            thumbnailMaskCtx.fill();
            
          
            thumbnailCtx.globalCompositeOperation = 'destination-in';
            thumbnailCtx.drawImage(thumbnailMaskCanvas, 0, 0);
            thumbnailCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(thumbnailCanvas, 80, 68, 250, 250);

            return image.toBuffer('image/png');
        } else if (this.theme === "themes16") {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;
            const image = canvas.createCanvas(1280, 350);
            const ctx = image.getContext('2d');
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

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes16/1.png`);

            const thumbnailCanvas = canvas.createCanvas(500, 500);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes16/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const bg2 = await canvas.loadImage("https://cdn.meww.me/mewcard/themes16/2.png")

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 350);
            ctx.drawImage(bg2, 0, 0, 1280, 350);

            // Apply fade effect between background and upper parts
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(0,0,0,0.1)'); // Fully transparent
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.1)'); // 50% transparent
            gradient.addColorStop(1, 'rgba(0,0,0,0.1)'); // Fully opaque

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 350);
            ctx.fillStyle = `#2d312f`;
            ctx.font = `60px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 430, 155); 

            ctx.fillStyle = '#f2d7b7';
            ctx.font = `45px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 430, 210); 

            ctx.fillStyle = `#ffffff`;
            ctx.font = `35px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText("Request by " + this.requester, 430, 260);
            ctx.save();

            const thumbnailMaskCanvas = canvas.createCanvas(thumbnailCanvas.width, thumbnailCanvas.height);
            const thumbnailMaskCtx = thumbnailMaskCanvas.getContext('2d');
            const thumbnailMaskRadius = thumbnailCanvas.width / 2;
            
            thumbnailMaskCtx.beginPath();
            thumbnailMaskCtx.arc(thumbnailMaskRadius, thumbnailMaskRadius, thumbnailMaskRadius, 0, 2 * Math.PI);
            thumbnailMaskCtx.closePath();
            thumbnailMaskCtx.fillStyle = '#000'; // You can change the color to any color you prefer
            thumbnailMaskCtx.fill();
            
          
            thumbnailCtx.globalCompositeOperation = 'destination-in';
            thumbnailCtx.drawImage(thumbnailMaskCanvas, 0, 0);
            thumbnailCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(thumbnailCanvas, 80, 68, 250, 250);

            return image.toBuffer('image/png');
        } else if (this.theme === "themes17") {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;
            const image = canvas.createCanvas(1280, 350);
            const ctx = image.getContext('2d');
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

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes17/1.png`);

            const thumbnailCanvas = canvas.createCanvas(500, 500);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes14/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const bg2 = await canvas.loadImage("https://cdn.meww.me/mewcard/themes14/2.png")

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 350);
            ctx.drawImage(bg2, 0, 0, 1280, 350);

            // Apply fade effect between background and upper parts
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(0,0,0,0.1)'); // Fully transparent
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.1)'); // 50% transparent
            gradient.addColorStop(1, 'rgba(0,0,0,0.1)'); // Fully opaque

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 350);
            ctx.fillStyle = `#f2d7b7`;
            ctx.font = `60px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 430, 155); 

            ctx.fillStyle = '#fcfcfc';
            ctx.font = `45px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 430, 220); 

            ctx.fillStyle = `#f2d7b7`;
            ctx.font = `35px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText("Request by " + this.requester, 430, 270);
            ctx.save();

            const thumbnailMaskCanvas = canvas.createCanvas(thumbnailCanvas.width, thumbnailCanvas.height);
            const thumbnailMaskCtx = thumbnailMaskCanvas.getContext('2d');
            const thumbnailMaskRadius = thumbnailCanvas.width / 2;
            
            thumbnailMaskCtx.beginPath();
            thumbnailMaskCtx.arc(thumbnailMaskRadius, thumbnailMaskRadius, thumbnailMaskRadius, 0, 2 * Math.PI);
            thumbnailMaskCtx.closePath();
            thumbnailMaskCtx.fillStyle = '#000'; // You can change the color to any color you prefer
            thumbnailMaskCtx.fill();
            
          
            thumbnailCtx.globalCompositeOperation = 'destination-in';
            thumbnailCtx.drawImage(thumbnailMaskCanvas, 0, 0);
            thumbnailCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(thumbnailCanvas, 80, 68, 250, 250);

            return image.toBuffer('image/png');
        } else if (this.theme === "themes18") {

            const progressBarWidth = (validatedProgress / 100) * 670;
            const circleX = progressBarWidth + 60;
            const image = canvas.createCanvas(1280, 350);
            const ctx = image.getContext('2d');
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

            circleCtx.beginPath();
            circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
            circleCtx.fillStyle = `#${validatedColor}`;
            circleCtx.fill();

            const background = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes18/1.png`);

            const thumbnailCanvas = canvas.createCanvas(500, 500);
            const thumbnailCtx = thumbnailCanvas.getContext('2d');

            let thumbnailImage;

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes14/no.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

            const cornerRadius2 = 45;

            thumbnailCtx.beginPath();
            thumbnailCtx.moveTo(0 + cornerRadius2, 0);
            thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
            thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
            thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
            thumbnailCtx.closePath();
            thumbnailCtx.clip();

            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

            const bg2 = await canvas.loadImage("https://cdn.meww.me/mewcard/themes14/2.png")

            // Draw the background
            ctx.drawImage(background, 0, 0, 1280, 350);
            ctx.drawImage(bg2, 0, 0, 1280, 350);

            // Apply fade effect between background and upper parts
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(0,0,0,0.1)'); // Fully transparent
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.1)'); // 50% transparent
            gradient.addColorStop(1, 'rgba(0,0,0,0.1)'); // Fully opaque

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1280, 350);
            ctx.fillStyle = `#f2d7b7`;
            ctx.font = `60px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.name, 430, 155); 

            ctx.fillStyle = '#fcfcfc';
            ctx.font = `45px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText(this.author, 430, 220); 

            ctx.fillStyle = `#f2d7b7`;
            ctx.font = `35px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr`;
            ctx.fillText("Request by " + this.requester, 430, 270);
            ctx.save();

            const thumbnailMaskCanvas = canvas.createCanvas(thumbnailCanvas.width, thumbnailCanvas.height);
            const thumbnailMaskCtx = thumbnailMaskCanvas.getContext('2d');
            const thumbnailMaskRadius = thumbnailCanvas.width / 2;
            
            thumbnailMaskCtx.beginPath();
            thumbnailMaskCtx.arc(thumbnailMaskRadius, thumbnailMaskRadius, thumbnailMaskRadius, 0, 2 * Math.PI);
            thumbnailMaskCtx.closePath();
            thumbnailMaskCtx.fillStyle = '#000'; // You can change the color to any color you prefer
            thumbnailMaskCtx.fill();
            
          
            thumbnailCtx.globalCompositeOperation = 'destination-in';
            thumbnailCtx.drawImage(thumbnailMaskCanvas, 0, 0);
            thumbnailCtx.globalCompositeOperation = 'source-over';
            ctx.drawImage(thumbnailCanvas, 80, 68, 250, 250);

            return image.toBuffer('image/png');

        } else if (this.theme === "mewwme1") {

            const frame = canvas.createCanvas(800, 200);
            const ctx = frame.getContext("2d");

            const circleCanvas = canvas.createCanvas(1000, 1000);
            const circleCtx = circleCanvas.getContext('2d');

            const circleRadius = 20;
            const circleY = 97;

            // Daftar URL gambar yang dapat dipilih secara acak
            const imageUrls = [
                "https://cdn.meww.me/mewcard/mewwme1/1.png",
                "https://cdn.meww.me/mewcard/mewwme1/2.png",
                "https://cdn.meww.me/mewcard/mewwme1/3.png",
                "https://cdn.meww.me/mewcard/mewwme1/4.png",
                "https://cdn.meww.me/mewcard/mewwme1/5.png",
                "https://cdn.meww.me/mewcard/mewwme1/6.png",
                "https://cdn.meww.me/mewcard/mewwme1/7.png",
                "https://cdn.meww.me/mewcard/mewwme1/8.png",
                "https://cdn.meww.me/mewcard/mewwme1/9.png",
                "https://cdn.meww.me/mewcard/mewwme1/10.png",
                "https://cdn.meww.me/mewcard/mewwme1/11.png",
                "https://cdn.meww.me/mewcard/mewwme1/12.png",
                "https://cdn.meww.me/mewcard/mewwme1/13.png",
                "https://cdn.meww.me/mewcard/mewwme1/14.png",
                "https://cdn.meww.me/mewcard/mewwme1/15.png",
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

            try {
                thumbnailImage = await canvas.loadImage(this.thumbnail, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                        }
                    }
                });
            } catch (error) {
                // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/assets/thumbnail.png`); // Gunakan gambar default atau URL alternatif
            }

            const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
            const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
            const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;



            thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);


            // Menggambar thumbnail
            ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

            // Menambahkan border putih
            ctx.strokeStyle = '#f2d7b7'; // Warna border putih
            ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
            ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border


            // Fungsi untuk menghasilkan warna heksadesimal acak
            // Array warna yang diizinkan
            const allowedColors = ['#f2d7b7'];

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

        } else if (this.theme === "themes19") {
                const frame = canvas.createCanvas(800, 200);
                const ctx = frame.getContext("2d");
    
                const circleCanvas = canvas.createCanvas(1000, 1000);
                const circleCtx = circleCanvas.getContext('2d');
    
                const circleRadius = 20;
                const circleY = 97;
    
                // Daftar URL gambar yang dapat dipilih secara acak
                const imageUrls = [
                    "https://cdn.meww.me/mewcard/themes19/1.png",
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
    
                try {
                    thumbnailImage = await canvas.loadImage(this.thumbnail, {
                        requestOptions: {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                            }
                        }
                    });
                } catch (error) {
                    // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                    console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                    thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/themes19/thumbnail.png`); // Gunakan gambar default atau URL alternatif
                }
    
                const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
                const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
                const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;
    
    
    
                thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
    
    
                // Menggambar thumbnail
                ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);
    
                // Menambahkan border putih
                ctx.strokeStyle = '#ffffff'; // Warna border putih
                ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
                ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border
    
    
                // Fungsi untuk menghasilkan warna heksadesimal acak
                // Array warna yang diizinkan
                const allowedColors = ['#ffffff'];
    
                // Fungsi untuk memilih warna secara acak dari array di atas
                function getRandomColor() {
                    return allowedColors[Math.floor(Math.random() * allowedColors.length)];
                }
    
                // Mengatur warna teks secara acak dari array yang diizinkan
                ctx.font = "bold 50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
                ctx.fillText(this.name, 250, 100);
    
                // Teks "author" dengan warna dan ukuran font yang berbeda
                const authorText = this.author;
                ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
                ctx.font = "bold 28px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                ctx.fillText(authorText, 250, 140);
    
                // Mengukur lebar teks "author" untuk menentukan posisi teks "requester"
                const authorTextWidth = ctx.measureText(authorText).width;
    
                // Teks "requester" dengan warna dan ukuran font yang berbeda
                const requesterText = `• ${this.requester}`;
                ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
                ctx.font = "bold 28px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140); // Mengatur posisi "requester" setelah "author"
    
                return frame.toBuffer("image/png");
            } else if (this.theme === "miko") {
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
                        "https://miko-radio.github.io/cdn/mikocard/theme1/1.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/2.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/3.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/4.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/5.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/6.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/7.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/8.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/9.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/10.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/11.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/12.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/13.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/14.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/15.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/16.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/17.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/18.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/19.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/20.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/21.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/22.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/23.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/24.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/25.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/26.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/27.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/28.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/29.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/30.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/31.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/32.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/33.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/34.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme1/35.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme2/1.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme2/2.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme2/3.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme2/4.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme2/5.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme2/6.png",
                        "https://miko-radio.github.io/cdn/mikocard/theme2/7.png",
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
        
                    let thumbnailImage = null;
        
                    try {
                        thumbnailImage = await canvas.loadImage(this.thumbnail, {
                            requestOptions: {
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                                }
                            }
                        });
                    } catch (error) {
                        // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                        console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]. now using default thumbnail.');
                        thumbnailImage = await canvas.loadImage(`https://miko-radio.github.io/cdn/mikocard/default-thumbnail.png`); // Gunakan gambar default atau URL alternatif
                    }
        
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
                    const allowedColors = ['#ffe0a9', '#ffffff', '#ffa300', '#00f0ff', '#e40dc3', '#76dc98'];
        
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
                } else if (this.theme == 'blank') {
                    const frame = canvas.createCanvas(800, 200);
                    const ctx = frame.getContext("2d");
        
                    const circleCanvas = canvas.createCanvas(1000, 1000);
                    const circleCtx = circleCanvas.getContext('2d');
        
                    const circleRadius = 20;
                    const circleY = 97;
        
                    // Daftar URL gambar yang dapat dipilih secara acak
                    const imageUrls = [
                        "https://cdn.meww.me/mewcard/blank.png",
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
        
                    try {
                        thumbnailImage = await canvas.loadImage(this.thumbnail, {
                            requestOptions: {
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                                }
                            }
                        });
                    } catch (error) {
                        // Mengatasi kesalahan ketika gambar tidak dapat dimuat
                        console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
                        thumbnailImage = await canvas.loadImage(`https://cdn.meww.me/mewcard/thumbnail-blank.png`); // Gunakan gambar default atau URL alternatif
                    }
        
                    const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
                    const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
                    const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;
        
        
        
                    thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
        
        
                    // Menggambar thumbnail
                    ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);
        
                    // Menambahkan border putih
                    ctx.strokeStyle = '#f2d7b7'; // Warna border putih
                    ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
                    ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border
        
        
                    // Fungsi untuk menghasilkan warna heksadesimal acak
                    // Array warna yang diizinkan
                    const allowedColors = ['#f2d7b7', '#ffffff', '#00d8ff'];
        
                    // Fungsi untuk memilih warna secara acak dari array di atas
                    function getRandomColor() {
                        return allowedColors[Math.floor(Math.random() * allowedColors.length)];
                    }
        
                    // Mengatur warna teks secara acak dari array yang diizinkan
                    ctx.font = "bold 40px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                    ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
                    ctx.fillText(this.name, 250, 100);
        
                    // Teks "author" dengan warna dan ukuran font yang berbeda
                    const authorText = this.author;
                    ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
                    ctx.font = "bold 24px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                    ctx.fillText(authorText, 250, 140);
        
                    // Mengukur lebar teks "author" untuk menentukan posisi teks "requester"
                    const authorTextWidth = ctx.measureText(authorText).width;
        
                    // Teks "requester" dengan warna dan ukuran font yang berbeda
                    const requesterText = this.requester;
                    ctx.fillStyle = getRandomColor(); // Menggunakan fungsi untuk warna acak dari array yang diizinkan
                    ctx.font = "bold 24px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
                    ctx.fillText(requesterText, 250 + authorTextWidth + 10, 140); // Mengatur posisi "requester" setelah "author"
        
                    return frame.toBuffer("image/png");

        } else {
            throw new Error('Invalid theme parameter, must be "mewwme" | "themes1" | "themes2" | "themes3" | "themes4" | "themes5" | "themes6" | "themes7" | "themes8" | "themes9" | "themes10" | "themes11" | "themes12" | "themes13" | "themes14" | "themes15" | "themes16" | "themes17" | "themes18" | "mewwme1" | "themes19" | "miko" | "blank"');
        }
    }
}

module.exports = { mewcard };