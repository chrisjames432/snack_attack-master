// Audio system for Snack Attack
class GameAudio {
    constructor() {
        this.sounds = {};
        this.audioContext = null;
        this.enabled = true;
    }

    init() {
        // Create simple beep sounds using Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }

    playBeep(frequency = 440, duration = 200, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    playCorrect() {
        // Happy ascending sound
        this.playBeep(523, 150); // C5
        setTimeout(() => this.playBeep(659, 150), 100); // E5
        setTimeout(() => this.playBeep(784, 200), 200); // G5
    }

    playWrong() {
        // Sad descending sound
        this.playBeep(400, 300, 'sawtooth');
        setTimeout(() => this.playBeep(300, 400, 'sawtooth'), 150);
    }

    playCombo() {
        // Exciting combo sound
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playBeep(440 + i * 110, 100), i * 50);
        }
    }
}

// Create global audio instance
window.gameAudio = new GameAudio();

export { GameAudio };
