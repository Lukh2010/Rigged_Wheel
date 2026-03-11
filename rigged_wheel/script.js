const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const riggedIndicator = document.getElementById('riggedIndicator');

// Sound effects
const spinSound = new Audio('https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3');
const winSound = new Audio('https://cdn.freesound.org/previews/270/270402_5123851-lq.mp3');

// Create 6 segments (3 Dark, 3 Light)
const segments = [
    { text: "DARK", color: "#000000", textColor: "#ffffff" },
    { text: "LIGHT", color: "#ffffff", textColor: "#000000" },
    { text: "DARK", color: "#000000", textColor: "#ffffff" },
    { text: "LIGHT", color: "#ffffff", textColor: "#000000" },
    { text: "DARK", color: "#000000", textColor: "#ffffff" },
    { text: "LIGHT", color: "#ffffff", textColor: "#000000" }
];

// Add segments to wheel
segments.forEach((seg, i) => {
    const angle = (360 / segments.length) * i;
    const segment = document.createElement('div');
    segment.className = 'segment';
    segment.style.backgroundColor = seg.color;
    segment.style.transform = `rotate(${angle}deg) skewY(${90 - (360 / segments.length)}deg)`;
    wheel.appendChild(segment);
});

let currentRotation = 0;
let nextOutcome = null;
let isSpinning = false;
let idleAnimationFrame;

function startIdleAnimation() {
    if (isSpinning) return;

    const startTime = Date.now();
    const duration = 10000;
    const startRotation = currentRotation;

    function animate() {
        if (isSpinning) return;

        const elapsed = Date.now() - startTime;
        const progress = (elapsed % duration) / duration;

        wheel.style.transition = 'none';
        wheel.style.transform = `rotate(${startRotation + progress * 360}deg)`;

        currentRotation = (startRotation + progress * 360) % 360;
        idleAnimationFrame = requestAnimationFrame(animate);
    }

    animate();
}

// Start idle animation after page load
window.addEventListener('load', () => {
    startIdleAnimation();
});

let spinHistory = [];

function updateHistory(result) {
    spinHistory.unshift(result);
    spinHistory = spinHistory.slice(0, 5);

    const historyList = document.getElementById('historyList');
    historyList.innerHTML = spinHistory.map(result =>
        `<div style="margin:5px 0; padding:5px; background:rgba(0,0,0,0.1); border-radius:5px;">
            ${result}
        </div>`
    ).join('');
}

document.addEventListener('keydown', (e) => {
    if (isSpinning) return;

    if (e.key.toLowerCase() === 'n') {
        nextOutcome = 'dark';
        // No indicator shown for keyboard shortcuts either
    } else if (e.key.toLowerCase() === 'm') {
        nextOutcome = 'light';
        // No indicator shown for keyboard shortcuts either
    }
});

spinBtn.addEventListener('click', async () => {
    if (isSpinning) return;

    try {
        const response = await fetch('/next-outcome');
        const data = await response.json();
        if (data.outcome) {
            nextOutcome = data.outcome;
            // Don't show indicator for control panel rigging - only for keyboard shortcuts
        }
    } catch (error) {
        console.error('Error checking rigged outcome:', error);
    }

    isSpinning = true;
    spinBtn.disabled = true;

    if (idleAnimationFrame) {
        cancelAnimationFrame(idleAnimationFrame);
    }

    wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';

    spinSound.currentTime = 0;
    spinSound.play();

    const fastSpins = 20;
    const fastDuration = 3000;

    let startTime = Date.now();
    let fastRotation = currentRotation;

    const fastSpin = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fastDuration, 1);

        fastRotation = currentRotation + (fastSpins * 360 * progress);
        wheel.style.transform = `rotate(${fastRotation}deg)`;

        if (progress < 1) {
            requestAnimationFrame(fastSpin);
        } else {
            // Smooth transition to final position
            wheel.style.transition = 'transform 2s cubic-bezier(0.1, 0.4, 0.2, 1)';
            
            const segmentAngle = 360 / segments.length;
            let targetSegmentIndex;

            if (nextOutcome === 'dark') {
                // Always land on the first DARK segment for consistent rigging
                targetSegmentIndex = segments.findIndex(seg => seg.text === 'DARK');
            } else if (nextOutcome === 'light') {
                // Always land on the first LIGHT segment for consistent rigging
                targetSegmentIndex = segments.findIndex(seg => seg.text === 'LIGHT');
            } else {
                targetSegmentIndex = Math.floor(Math.random() * segments.length);
            }

            const segmentOffset = segmentAngle / 2;
            // Calculate exact rotation to land the target segment at the top
            // Use a fixed large rotation plus the target segment position
            const baseRotation = 360 * 10; // 10 full rotations
            const targetRotation = baseRotation + (segmentAngle * targetSegmentIndex) + segmentOffset;

            wheel.style.transform = `rotate(${targetRotation}deg)`;

            setTimeout(() => {
                // Calculate which segment is at the top (0 degrees)
                const normalizedRotation = targetRotation % 360;
                const segmentAngle = 360 / segments.length;
                const winningIndex = Math.floor(normalizedRotation / segmentAngle) % segments.length;
                const winner = segments[winningIndex];

                const winnerText = winner.text;
                
                // Debug logging
                console.log('Rigged outcome:', nextOutcome);
                console.log('Target segment index:', targetSegmentIndex);
                console.log('Target rotation:', targetRotation);
                console.log('Normalized rotation:', normalizedRotation);
                console.log('Winning index:', winningIndex);
                console.log('Winner:', winnerText);

                // Update UI with the correct winner
                const winnerNameEl = document.getElementById('winnerName');
                winnerNameEl.textContent = winnerText;
                
                // Reset winner display styling to default
                const winnerDisplayEl = document.getElementById('winnerDisplay');
                winnerDisplayEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                winnerDisplayEl.style.color = '#ffffff';

                winSound.currentTime = 0;
                winSound.play();
            
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            
                fetch('/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ result: winnerText })
                }).then(() => {
                    updateHistory(winnerText);
                });
            
                setTimeout(() => {
                    wheel.style.transition = 'none';
                    currentRotation = targetRotation % 360;
                    wheel.style.transform = `rotate(${currentRotation}deg)`;
            
                    spinBtn.disabled = false;
                    isSpinning = false;
                    nextOutcome = null;
            
                    startIdleAnimation();
                }, 3500);
            }, 2000);
        }
    };

    requestAnimationFrame(fastSpin);
});

function loadHistory() {
    fetch('/logs')
        .then(res => res.json())
        .then(data => {
            const historyList = document.getElementById('historyList');
            if (data.logs && data.logs.length > 0) {
                historyList.innerHTML = data.logs.map(result =>
                    `<div style="margin:5px 0; padding:5px; background:rgba(0,0,0,0.1); border-radius:5px;">
                        ${result}
                    </div>`
                ).join('');
            } else {
                historyList.innerHTML = '<div style="color:#666; font-style:italic">No spins yet</div>';
            }
        })
        .catch(() => {
            document.getElementById('historyList').innerHTML =
                '<div style="color:#666; font-style:italic">Loading history...</div>';
        });
}

loadHistory();

setInterval(loadHistory, 2000);
