// ARTIFY - GENERATIVE ART ENGINE
const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");

const complexity = document.getElementById("complexity");
const complexityValue = document.getElementById("complexityValue");

// Colour palettes for different moods
const palettes = {
    dreamy: ["#a855f7", "#ec4899", "#60a5fa", "#f0abfc"],
    cyberpunk: ["#00f5ff", "#ff00e5", "#7c3aed", "#ffffff"],
    sunset: ["#ff512f", "#f09819", "#ff6b9d", "#ffd166"],
    ocean: ["#0077b6", "#00b4d8", "#48cae4", "#90e0ef"],
    monochrome: ["#ffffff", "#aaaaaa", "#666666", "#dddddd"]
};

// Update complexity number
complexity.addEventListener("input", function () {
    complexityValue.textContent = this.value;
});

// Random number generator
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Main artwork generator
function generateArt() {

    const style = document.getElementById("artStyle").value;
    const mood = document.getElementById("artMood").value;
    const level = Number(complexity.value);
    const symmetry = Number(document.getElementById("symmetry").value);

    const colors = palettes[mood];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark background
    ctx.fillStyle = "#090912";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Choose drawing algorithm
    if (style === "geometric") {
        drawGeometric(colors, level, symmetry);
    }

    else if (style === "flowing") {
        drawFlowing(colors, level);
    }

    else if (style === "fractal") {
        drawFractal(colors, level, symmetry);
    }

    document.getElementById("artMessage").textContent =
        "✨ Your artwork has been generated!";

}

// GEOMETRIC ART
function drawGeometric(colors, level, symmetry) {

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const count = Math.round(level * 1.5) + 20;

    for (let i = 0; i < count; i++) {

        const angle = (Math.PI * 2 / symmetry) * i;
        const radius = random(30, 220);

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();

        const sides = Math.floor(random(3, 8));
        const size = random(10, 45);

        for (let j = 0; j < sides; j++) {

            const a = (Math.PI * 2 / sides) * j;

            const px = Math.cos(a) * size;
            const py = Math.sin(a) * size;

            if (j === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.closePath();

        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = random(1, 3);
        ctx.globalAlpha = random(0.5, 1);

        ctx.stroke();

        ctx.restore();
    }

    // Add decorative circles
    for (let i = 0; i < 35; i++) {

        ctx.beginPath();

        ctx.arc(
            random(0, canvas.width),
            random(0, canvas.height),
            random(2, 8),
            0,
            Math.PI * 2
        );

        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
    }
}

// FLOWING ART
function drawFlowing(colors, level) {

    const lines = Math.round(level * 1.5) + 20;

    for (let i = 0; i < lines; i++) {

        ctx.beginPath();

        const startY = random(0, canvas.height);
        const amplitude = random(20, 100);
        const frequency = random(0.008, 0.025);
        const phase = random(0, Math.PI * 2);

        for (let x = 0; x <= canvas.width; x += 3) {

            const y = startY +
                Math.sin(x * frequency + phase) * amplitude +
                Math.sin(x * frequency * 2) * 20;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = random(1, 3);
        ctx.globalAlpha = random(0.3, 0.9);

        ctx.stroke();
    }

    ctx.globalAlpha = 1;
}

// FRACTAL ART
function drawFractal(colors, level, symmetry) {

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const branches = symmetry;
    const depth = Math.min(5, Math.ceil(level / 20));

    function branch(x, y, angle, length, depth, color) {

        if (depth === 0 || length < 3) return;

        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = color;
        ctx.lineWidth = depth * 0.8;
        ctx.globalAlpha = 0.75;

        ctx.stroke();

        branch(
            endX, endY,
            angle - 0.45,
            length * 0.72,
            depth - 1,
            color
        );

        branch(
            endX, endY,
            angle + 0.45,
            length * 0.72,
            depth - 1,
            color
        );
    }

    for (let i = 0; i < branches; i++) {

        const angle = (Math.PI * 2 / branches) * i;

        branch(
            centerX,
            centerY,
            angle,
            110,
            depth,
            colors[i % colors.length]
        );
    }

    ctx.globalAlpha = 1;
}

// SURPRISE ME
function surpriseMe() {

    const styles = ["geometric", "flowing", "fractal"];
    const moods = ["dreamy", "cyberpunk", "sunset", "ocean", "monochrome"];
    const symmetries = ["4", "6", "8", "12"];

    document.getElementById("artStyle").value =
        styles[Math.floor(Math.random() * styles.length)];

    document.getElementById("artMood").value =
        moods[Math.floor(Math.random() * moods.length)];

    document.getElementById("symmetry").value =
        symmetries[Math.floor(Math.random() * symmetries.length)];

    complexity.value = Math.floor(random(20, 100));
    complexityValue.textContent = complexity.value;

    generateArt();
}

// SAVE ARTWORK
function saveArtwork() {

    const image = canvas.toDataURL("image/png");

    let gallery = JSON.parse(
        localStorage.getItem("artifyGallery") || "[]"
    );

    gallery.push({
        image: image,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("artifyGallery", JSON.stringify(gallery));

    document.getElementById("artMessage").textContent =
        "♡ Artwork saved to your gallery!";
}

// DOWNLOAD ARTWORK
function downloadArt() {

    const link = document.createElement("a");

    link.download = "ARTIFY-masterpiece.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
}

// OPEN STUDIO
function openStudio() {

    document.getElementById("studio").scrollIntoView({
        behavior: "smooth"
    });

}

// Generate an initial artwork
generateArt();