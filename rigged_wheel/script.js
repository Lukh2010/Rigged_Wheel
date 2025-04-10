const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');

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

startIdleAnimation();

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
        riggedIndicator.textContent = 'NEXT SPIN: DARK';
        riggedIndicator.style.backgroundColor = '#000000';
        riggedIndicator.style.color = '#ffffff';
        riggedIndicator.style.opacity = '1';
        setTimeout(() => { riggedIndicator.style.opacity = '0'; }, 2000);
    } else if (e.key.toLowerCase() === 'm') {
        nextOutcome = 'light';
        riggedIndicator.textContent = 'NEXT SPIN: LIGHT';
        riggedIndicator.style.backgroundColor = '#ffffff';
        riggedIndicator.style.color = '#000000';
        riggedIndicator.style.opacity = '1';
        setTimeout(() => { riggedIndicator.style.opacity = '0'; }, 2000);
    }
});

spinBtn.addEventListener('click', async () => {
    if (isSpinning) return;

    try {
        const response = await fetch('/next-outcome');
        const data = await response.json();
        if (data.outcome) {
            nextOutcome = data.outcome;
            riggedIndicator.textContent = `NEXT SPIN: ${data.outcome.toUpperCase()}`;
            riggedIndicator.style.backgroundColor = data.outcome === 'dark' ? '#000000' : '#ffffff';
            riggedIndicator.style.color = data.outcome === 'dark' ? '#ffffff' : '#000000';
            riggedIndicator.style.opacity = '1';
            setTimeout(() => { riggedIndicator.style.opacity = '0'; }, 2000);
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
            const segmentAngle = 360 / segments.length;
            let targetSegmentIndex;

            if (nextOutcome === 'dark') {
                const darkIndices = segments.map((seg, i) => seg.text === 'DARK' ? i : -1).filter(i => i !== -1);
                targetSegmentIndex = darkIndices[Math.floor(Math.random() * darkIndices.length)];
            } else if (nextOutcome === 'light') {
                const lightIndices = segments.map((seg, i) => seg.text === 'LIGHT' ? i : -1).filter(i => i !== -1);
                targetSegmentIndex = lightIndices[Math.floor(Math.random() * lightIndices.length)];
            } else {
                targetSegmentIndex = Math.floor(Math.random() * segments.length);
            }

            const segmentOffset = segmentAngle / 2;
            const targetRotation = 1440 + (segmentAngle * targetSegmentIndex) + segmentOffset;

            wheel.style.transition = 'transform 2s cubic-bezier(0.1, 0.4, 0.2, 1)';
            wheel.style.transform = `rotate(${targetRotation}deg)`;

            setTimeout(() => {
                const normalizedRotation = (360 - (targetRotation % 360)) % 360;
                const winningIndex = Math.floor(normalizedRotation / segmentAngle);
                const winner = segments[winningIndex];
                
                // Set the winner text to the opposite of what was calculated
                const winnerText = winner.text === "DARK" ? "LIGHT" : "DARK";

                // Update UI with the correct winner (always black text on white background)
                document.getElementById('winnerName').textContent = winnerText;
                document.getElementById('winnerName').style.color = '#000000';
                document.getElementById('winnerDisplay').style.backgroundColor = '#ffffff';
            
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
