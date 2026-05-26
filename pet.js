class Pet {
    constructor(type) {
        this.type = type; // 'kucing' or 'harimau'
        this.name = type === 'kucing' ? 'Whiskers' : 'Rajah';
        this.happiness = 100;
        this.energy = 100;
        this.hunger = 0;
        this.lastFed = Date.now();
        this.isSleeping = false;
        this.clothes = 'none';
        this.x = 150;
        this.y = 150;
        this.animationFrame = 0;
        this.direction = 1;
        
        // Color schemes
        this.colors = {
            kucing: {
                body: '#FFA500',
                belly: '#FFE4B5',
                eye: '#000',
                nose: '#FF69B4'
            },
            harimau: {
                body: '#FF8C00',
                stripes: '#8B4513',
                belly: '#FFF8DC',
                eye: '#000',
                nose: '#FF69B4'
            }
        };
    }

    updateStats() {
        const now = Date.now();
        const timePassed = (now - this.lastFed) / 1000 / 60; // minutes

        // Hunger increases over time
        this.hunger = Math.min(100, this.hunger + timePassed * 0.1);

        // Happiness decreases if hungry
        if (this.hunger > 50) {
            this.happiness = Math.max(0, this.happiness - timePassed * 0.2);
        }

        // Energy decreases if not sleeping and activity
        if (!this.isSleeping) {
            this.energy = Math.max(0, this.energy - timePassed * 0.05);
        }

        // Happiness decreases if low energy
        if (this.energy < 30) {
            this.happiness = Math.max(0, this.happiness - timePassed * 0.1);
        }

        this.lastFed = now;
    }

    feed(foodType) {
        if (this.hunger <= 0) {
            return "Hewan sudah kenyang! 😊";
        }

        this.hunger = Math.max(0, this.hunger - 40);
        this.happiness = Math.min(100, this.happiness + 20);
        this.lastFed = Date.now();

        const messages = {
            fish: `${this.name} makan ikan dengan lahap! 🐟 Yum yum!`,
            meat: `${this.name} memakan daging dengan girang! 🍖 Lezat!`,
            milk: `${this.name} minum susu hingga habis! 🥛 Segarr!`
        };

        return messages[foodType] || "Nomnom!";
    }

    play() {
        if (this.energy < 20) {
            return `${this.name} terlalu lelah untuk bermain 😴`;
        }

        this.energy = Math.max(0, this.energy - 30);
        this.happiness = Math.min(100, this.happiness + 40);
        this.hunger = Math.min(100, this.hunger + 20);

        return `${this.name} berlari-larian dengan senang hati! 🎾 Weee!`;
    }

    sleep() {
        this.isSleeping = !this.isSleeping;
        if (this.isSleeping) {
            this.energy = Math.min(100, this.energy + 50);
            return `${this.name} tertidur pulas 😴 Zzzzz...`;
        } else {
            return `${this.name} bangun dan segar kembali! 😴✨`;
        }
    }

    pet() {
        this.happiness = Math.min(100, this.happiness + 15);
        return `${this.name} menikmati belian dari kamu! 🤚 Purr purr!`;
    }

    changeClothes(clothesType) {
        this.clothes = clothesType;
        const messages = {
            none: `${this.name} melepas baju.`,
            shirt: `${this.name} memakai kaos yang keren! 👕`,
            hat: `${this.name} memakai topi bergaya! 🎩`,
            glasses: `${this.name} pakai kacamata keren! 🕶️`,
            crown: `${this.name} jadi terlihat seperti raja/ratu! 👑`
        };
        return messages[clothesType] || "Clothes changed!";
    }
}

class PetGame {
    constructor() {
        this.canvas = document.getElementById('petCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        this.pet = new Pet('kucing');
        this.messageBox = document.getElementById('messageBox');
        
        this.setupEventListeners();
        this.gameLoop();
    }

    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    setupEventListeners() {
        // Pet selection
        document.querySelectorAll('.pet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.pet-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.pet = new Pet(e.target.dataset.pet);
                this.updateUI();
                this.showMessage(`Selamat datang ${this.pet.name}! 🐾`);
            });
        });

        // Food buttons
        document.querySelectorAll('.food-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = this.pet.feed(btn.dataset.food);
                this.showMessage(message);
                this.updateUI();
            });
        });

        // Action buttons
        document.getElementById('playBtn').addEventListener('click', () => {
            const message = this.pet.play();
            this.showMessage(message);
            this.updateUI();
        });

        document.getElementById('sleepBtn').addEventListener('click', () => {
            const message = this.pet.sleep();
            this.showMessage(message);
            this.updateUI();
        });

        document.getElementById('petBtn').addEventListener('click', () => {
            const message = this.pet.pet();
            this.showMessage(message);
            this.updateUI();
        });

        // Clothes buttons
        document.querySelectorAll('.clothes-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = this.pet.changeClothes(btn.dataset.clothes);
                this.showMessage(message);
                this.updateUI();
            });
        });

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    showMessage(text) {
        this.messageBox.textContent = text;
        this.messageBox.style.animation = 'none';
        setTimeout(() => {
            this.messageBox.style.animation = 'slideUp 0.5s ease-out';
        }, 10);
    }

    updateUI() {
        document.getElementById('petName').textContent = this.pet.name;
        document.getElementById('happiness').textContent = Math.round(this.pet.happiness);
        document.getElementById('energy').textContent = Math.round(this.pet.energy);
        document.getElementById('hunger').textContent = Math.round(this.pet.hunger);
        
        document.getElementById('happinessFill').style.width = this.pet.happiness + '%';
        document.getElementById('energyFill').style.width = this.pet.energy + '%';
        document.getElementById('hungerFill').style.width = this.pet.hunger + '%';
    }

    drawPet() {
        const x = this.pet.x;
        const y = this.pet.y;
        const color = this.pet.colors[this.pet.type];
        const ctx = this.ctx;

        ctx.save();

        // Sleeping animation
        if (this.pet.isSleeping) {
            this.drawSleepingPet(x, y, color);
        } else {
            // Movement animation
            this.pet.animationFrame++;
            const bounce = Math.sin(this.pet.animationFrame * 0.05) * 5;
            
            if (this.pet.type === 'kucing') {
                this.drawCat(x, y + bounce, color);
            } else {
                this.drawTiger(x, y + bounce, color);
            }
        }

        // Draw clothes
        this.drawClothes(x, y, color);

        // Draw emotion
        this.drawEmotion(x, y);

        ctx.restore();
    }

    drawCat(x, y, color) {
        const ctx = this.ctx;

        // Body
        ctx.fillStyle = color.body;
        ctx.beginPath();
        ctx.ellipse(x, y, 40, 35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly
        ctx.fillStyle = color.belly;
        ctx.beginPath();
        ctx.ellipse(x, y + 5, 25, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = color.body;
        ctx.beginPath();
        ctx.arc(x, y - 35, 30, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = color.body;
        ctx.beginPath();
        ctx.moveTo(x - 18, y - 60);
        ctx.lineTo(x - 25, y - 80);
        ctx.lineTo(x - 10, y - 58);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 18, y - 60);
        ctx.lineTo(x + 25, y - 80);
        ctx.lineTo(x + 10, y - 58);
        ctx.fill();

        // Inner ears
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(x - 15, y - 60);
        ctx.lineTo(x - 18, y - 70);
        ctx.lineTo(x - 10, y - 58);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 15, y - 60);
        ctx.lineTo(x + 18, y - 70);
        ctx.lineTo(x + 10, y - 58);
        ctx.fill();

        // Eyes
        ctx.fillStyle = color.eye;
        ctx.beginPath();
        ctx.arc(x - 12, y - 35, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 12, y - 35, 6, 0, Math.PI * 2);
        ctx.fill();

        // Eye shine
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(x - 11, y - 36, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 13, y - 36, 2, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = color.nose;
        ctx.beginPath();
        ctx.arc(x, y - 25, 4, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.strokeStyle = color.nose;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - 23);
        ctx.lineTo(x - 6, y - 18);
        ctx.moveTo(x, y - 23);
        ctx.lineTo(x + 6, y - 18);
        ctx.stroke();

        // Tail
        ctx.strokeStyle = color.body;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(x + 55, y + 10, 30, Math.PI, Math.PI * 1.5);
        ctx.stroke();

        // Front paws
        ctx.fillStyle = color.body;
        ctx.beginPath();
        ctx.ellipse(x - 15, y + 35, 8, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(x + 15, y + 35, 8, 15, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawTiger(x, y, color) {
        const ctx = this.ctx;

        // Body
        ctx.fillStyle = color.body;
        ctx.beginPath();
        ctx.ellipse(x, y, 45, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stripes on body
        ctx.strokeStyle = color.stripes;
        ctx.lineWidth = 3;
        for (let i = -3; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x - 40, y + i * 8);
            ctx.lineTo(x + 40, y + i * 8);
            ctx.stroke();
        }

        // Head
        ctx.fillStyle = color.orange;
        ctx.beginPath();
        ctx.arc(x, y - 40, 35, 0, Math.PI * 2);
        ctx.fill();

        // Stripes on face
        ctx.strokeStyle = color.stripes;
        ctx.lineWidth = 2;
        for (let i = -2; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(x - 25, y - 40 + i * 6);
            ctx.lineTo(x + 25, y - 40 + i * 6);
            ctx.stroke();
        }

        // Ears
        ctx.fillStyle = color.body;
        ctx.beginPath();
        ctx.moveTo(x - 20, y - 70);
        ctx.lineTo(x - 30, y - 90);
        ctx.lineTo(x - 10, y - 65);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 20, y - 70);
        ctx.lineTo(x + 30, y - 90);
        ctx.lineTo(x + 10, y - 65);
        ctx.fill();

        // Inner ears
        ctx.fillStyle = '#FFF8DC';
        ctx.beginPath();
        ctx.moveTo(x - 15, y - 70);
        ctx.lineTo(x - 20, y - 80);
        ctx.lineTo(x - 10, y - 68);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 15, y - 70);
        ctx.lineTo(x + 20, y - 80);
        ctx.lineTo(x + 10, y - 68);
        ctx.fill();

        // Eyes
        ctx.fillStyle = color.eye;
        ctx.beginPath();
        ctx.arc(x - 14, y - 38, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 14, y - 38, 7, 0, Math.PI * 2);
        ctx.fill();

        // Eye shine
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(x - 12, y - 40, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 16, y - 40, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = color.nose;
        ctx.beginPath();
        ctx.arc(x, y - 28, 5, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.strokeStyle = color.nose;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - 25);
        ctx.lineTo(x - 8, y - 18);
        ctx.moveTo(x, y - 25);
        ctx.lineTo(x + 8, y - 18);
        ctx.stroke();

        // Tail
        ctx.strokeStyle = color.body;
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(x + 60, y + 15, 35, Math.PI, Math.PI * 1.4);
        ctx.stroke();

        // Tail stripes
        ctx.strokeStyle = color.stripes;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + 60, y + 15, 35, Math.PI, Math.PI * 1.4);
        ctx.stroke();

        // Front paws
        ctx.fillStyle = color.body;
        ctx.beginPath();
        ctx.ellipse(x - 18, y + 38, 10, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(x + 18, y + 38, 10, 18, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSleepingPet(x, y, color) {
        const ctx = this.ctx;
        
        // Draw sleeping position (curled up)
        ctx.fillStyle = color.body;
        ctx.beginPath();
        ctx.ellipse(x - 10, y, 50, 30, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Z's for sleeping
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Z', x + 50, y - 40);
        ctx.font = 'bold 15px Arial';
        ctx.fillText('z', x + 60, y - 20);
        ctx.font = 'bold 12px Arial';
        ctx.fillText('z', x + 70, y);
    }

    drawClothes(x, y, color) {
        const ctx = this.ctx;

        if (this.pet.clothes === 'shirt') {
            ctx.fillStyle = '#FF1493';
            ctx.beginPath();
            ctx.ellipse(x, y + 5, 35, 25, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#C71585';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (this.pet.clothes === 'hat') {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.moveTo(x - 35, y - 35);
            ctx.lineTo(x + 35, y - 35);
            ctx.lineTo(x + 30, y - 55);
            ctx.lineTo(x - 30, y - 55);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#DAA520';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (this.pet.clothes === 'glasses') {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x - 12, y - 35, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x + 12, y - 35, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x - 4, y - 35);
            ctx.lineTo(x + 4, y - 35);
            ctx.stroke();
        }

        if (this.pet.clothes === 'crown') {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI;
                const px = x + Math.cos(angle - Math.PI / 2) * 35;
                const py = y - 55 + Math.sin(angle - Math.PI / 2) * 35;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.lineTo(x + 35, y - 40);
            ctx.lineTo(x - 35, y - 40);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#DAA520';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Crown jewels
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(x, y - 65, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawEmotion(x, y) {
        const ctx = this.ctx;
        let emotion = '😊';

        if (this.pet.hunger > 70) emotion = '😫';
        else if (this.pet.energy < 30) emotion = '😴';
        else if (this.pet.happiness < 30) emotion = '😢';

        ctx.font = 'bold 24px Arial';
        ctx.fillText(emotion, x + 45, y - 55);
    }

    gameLoop() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update stats
        this.pet.updateStats();
        this.updateUI();

        // Draw pet
        this.drawPet();

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PetGame();
});
          
