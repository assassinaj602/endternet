// Global state
let timeLeft = 300; // 5 minutes in seconds
let health = 100;
let chaosLevel = 0;
let isEnding = false;
let glitchInterval;
let chaosInterval;
let mouseTracker;

// DOM elements
const timer = document.getElementById('timer');
const healthDisplay = document.getElementById('health');
const healthFill = document.getElementById('health-fill');
const warning = document.getElementById('warning');
const chaosContent = document.getElementById('chaosContent');
const errorPopups = document.getElementById('errorPopups');
const terminalInput = document.getElementById('terminalInput');
const terminalBody = document.getElementById('terminalBody');
const endingScene = document.getElementById('endingScene');
const staticCanvas = document.getElementById('static-canvas');

// Buttons
const panicBtn = document.getElementById('panicBtn');
const fixBtn = document.getElementById('fixBtn');
const rebootBtn = document.getElementById('rebootBtn');
const cursedBtn = document.getElementById('cursedBtn');
const terminalClose = document.getElementById('terminalClose');
const restartBtn = document.getElementById('restartBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
    startCountdown();
    startChaos();
    setupMouseTracking();
    // autofocus the terminal input for immediate typing
    if (terminalInput) terminalInput.focus();
    // ensure canvas matches window size
    resizeStaticCanvas();
});

function initializeGame() {
    addChaosLog('System initialized. Everything is NOT fine.');
    setTimeout(() => addChaosLog('Warning: Existential dread detected.'), 2000);
    setTimeout(() => addChaosLog('Error: Too many cat memes in database.'), 4000);
}

function setupEventListeners() {
    // Button events
    panicBtn.addEventListener('click', handlePanic);
    fixBtn.addEventListener('click', handleFix);
    rebootBtn.addEventListener('click', handleReboot);
    cursedBtn.addEventListener('click', handleCursed);
    restartBtn.addEventListener('click', restartGame);
    
    // Terminal events
    terminalInput.addEventListener('keypress', handleTerminalInput);
    // Submit with Ctrl/Cmd+Enter
    terminalInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleTerminalSubmit();
        }
    });
    terminalClose.addEventListener('click', () => {
        document.getElementById('terminal').style.display = 'none';
        setTimeout(() => {
            document.getElementById('terminal').style.display = 'block';
            addChaosLog('Terminal cannot be closed. Nice try.');
        }, 3000);
    });
    
    // Random scroll chaos
    window.addEventListener('scroll', () => {
        if (Math.random() > 0.95) {
            triggerRandomGlitch();
        }
    });
    
    // Click anywhere chaos
    document.addEventListener('click', (e) => {
        if (Math.random() > 0.9) {
            createFloatingText(e.clientX, e.clientY);
        }
    });

    // Toggle terminal with backtick/tilde (`) key
    document.addEventListener('keydown', (e) => {
        // Ignore when typing in an input
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;

        if (e.key === '`' || e.key === '~') {
            const terminalEl = document.getElementById('terminal');
            if (terminalEl.style.display === 'none' || getComputedStyle(terminalEl).display === 'none') {
                terminalEl.style.display = 'block';
                if (terminalInput) terminalInput.focus();
            } else {
                terminalEl.style.display = 'none';
            }
        }
    });

    // Resize handler to keep static canvas full-screen
    window.addEventListener('resize', resizeStaticCanvas);
}

function startCountdown() {
    setInterval(() => {
        if (isEnding) return;
        
        timeLeft--;
        health = Math.max(0, health - 0.1);
        
        updateTimer();
        updateHealth();
        
        // Increase chaos as time passes
        if (timeLeft % 30 === 0) {
            chaosLevel++;
            addChaosLog(`Chaos level increased to ${chaosLevel}`);
        }
        
        // Random events
        if (timeLeft % 45 === 0) {
            spawnErrorPopup();
        }
        
        // End game
        if (timeLeft <= 0 || health <= 0) {
            endGame();
        }
        
        // Warning updates
        updateWarning();
        
    }, 1000);
}

function updateTimer() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    timer.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    
    // Color change based on urgency
    if (timeLeft < 60) {
        timer.style.color = '#ff0000';
        timer.style.animation = 'shake 0.2s infinite';
    } else if (timeLeft < 180) {
        timer.style.color = '#ff6600';
    }
}

function updateHealth() {
    healthDisplay.textContent = Math.floor(health);
    healthFill.style.width = `${health}%`;
    
    if (health < 20) {
        healthFill.style.background = '#ff0000';
        healthFill.style.animation = 'pulse 0.5s infinite';
    } else if (health < 50) {
        healthFill.style.background = '#ff6600';
    }
}

function updateWarning() {
    const warnings = [
        '⚠️ ALL SYSTEMS NOMINAL ⚠️',
        '⚠️ EVERYTHING IS FINE ⚠️',
        '⚠️ DO NOT PANIC ⚠️',
        '⚠️ THIS IS NOT A DRILL ⚠️',
        '⚠️ ABORT ABORT ABORT ⚠️',
        '⚠️ PRESS F TO PAY RESPECTS ⚠️',
        '⚠️ 404: HOPE NOT FOUND ⚠️',
        '⚠️ CRITICAL ERROR: YES ⚠️',
        '⚠️ REALITY.EXE HAS STOPPED ⚠️',
        '⚠️ TOO MANY MEMES DETECTED ⚠️'
    ];
    
    if (Math.random() > 0.7) {
        warning.textContent = warnings[Math.floor(Math.random() * warnings.length)];
    }
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

// Button handlers
function handlePanic() {
    addChaosLog('PANIC BUTTON PRESSED! Everything is worse now.');
    health = Math.max(0, health - 10);
    updateHealth();
    
    // Trigger visual chaos
    document.body.classList.add('broken');
    setTimeout(() => document.body.classList.remove('broken'), 2000);
    
    // Spawn multiple errors
    for (let i = 0; i < 3; i++) {
        setTimeout(() => spawnErrorPopup(), i * 500);
    }
    
    // Make button text change
    panicBtn.textContent = '🚨 PANICKING! 🚨';
    setTimeout(() => {
        panicBtn.textContent = '🚨 PANIC';
    }, 3000);
}

function handleFix() {
    if (Math.random() > 0.3) {
        addChaosLog('Fix attempt successful! Health +15');
        health = Math.min(100, health + 15);
        timeLeft += 30;
        fixBtn.textContent = '🔧 FIXED!';
        fixBtn.style.background = '#00ff00';
    } else {
        addChaosLog('Fix attempt failed! Health -5');
        health = Math.max(0, health - 5);
        fixBtn.textContent = '🔧 BROKEN!';
        fixBtn.style.background = '#ff0000';
    }
    
    updateHealth();
    
    setTimeout(() => {
        fixBtn.textContent = '🔧 FIX INTERNET';
        fixBtn.style.background = '#00ff00';
    }, 2000);
}

function handleReboot() {
    addChaosLog('Rebooting... Please wait 3 seconds.');
    rebootBtn.disabled = true;
    rebootBtn.textContent = '⚡ REBOOTING...';
    
    // Screen flash
    document.body.style.background = '#fff';
    setTimeout(() => {
        document.body.style.background = '#0a0a0a';
    }, 100);
    
    setTimeout(() => {
        health = Math.min(100, health + 20);
        updateHealth();
        addChaosLog('Reboot complete! Systems slightly less broken.');
        rebootBtn.disabled = false;
        rebootBtn.textContent = '⚡ REBOOT';
        
        // Clear some visual glitches
        document.querySelectorAll('.broken, .inverted, .melting').forEach(el => {
            el.classList.remove('broken', 'inverted', 'melting');
        });
    }, 3000);
}

function handleCursed() {
    addChaosLog('You pressed the cursed button. What did you expect?');
    
    const cursedEvents = [
        () => {
            document.body.classList.add('inverted');
            setTimeout(() => document.body.classList.remove('inverted'), 3000);
            addChaosLog('Reality inverted.');
        },
        () => {
            document.body.classList.add('color-chaos');
            setTimeout(() => document.body.classList.remove('color-chaos'), 5000);
            addChaosLog('Colors are having an identity crisis.');
        },
        () => {
            const allText = document.querySelectorAll('p, h1, h2, h3, span, button');
            allText.forEach(el => {
                if (Math.random() > 0.5) {
                    el.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg)';
                }
            });
            addChaosLog('Gravity is optional now.');
        },
        () => {
            enableStaticNoise(3000);
            addChaosLog('Static noise detected in reality.');
        },
        () => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => spawnErrorPopup(), i * 200);
            }
            addChaosLog('Error cascade initiated.');
        },
        () => {
            health = Math.max(10, health - 20);
            updateHealth();
            addChaosLog('Cursed button consumed your life force.');
        }
    ];
    
    const event = cursedEvents[Math.floor(Math.random() * cursedEvents.length)];
    event();
    
    // Change button
    cursedBtn.textContent = ['💀 CURSED', '💀 WHY?', '💀 STOP', '💀 NO'][Math.floor(Math.random() * 4)];
    setTimeout(() => {
        cursedBtn.textContent = '💀 ???';
    }, 2000);
}

// Terminal commands
function handleTerminalInput(e) {
    if (e.key === 'Enter') {
        handleTerminalSubmit();
    }
}

function handleTerminalSubmit() {
    const command = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';
    if (!command) return;
    addTerminalLine(`$ ${command}`, false);
    processCommand(command);
    // keep focus for fast typing
    terminalInput.focus();
}

function processCommand(command) {
    const commands = {
        'help': () => {
            addTerminalLine('Available commands:', false);
            addTerminalLine('  help - Show this message', false);
            addTerminalLine('  save.internet(); - Attempt to save the internet', false);
            addTerminalLine('  reboot_meme_system(); - Reboot meme database', false);
            addTerminalLine('  status - Show system status', false);
            addTerminalLine('  clear - Clear terminal', false);
            addTerminalLine('  hack.everything(); - ???', false);
        },
        'save.internet();': () => {
            addTerminalLine('Attempting to save internet...', false);
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    addTerminalLine('Success! Health +10', true);
                    health = Math.min(100, health + 10);
                    updateHealth();
                } else {
                    addTerminalLine('Failed. The internet is too broken.', false, true);
                }
            }, 1000);
        },
        'reboot_meme_system();': () => {
            addTerminalLine('Rebooting meme system...', false);
            addTerminalLine('Loading dank_memes.db...', false);
            addTerminalLine('Initializing shitpost_engine...', false);
            setTimeout(() => {
                addTerminalLine('Meme system online. +5 health', true);
                health = Math.min(100, health + 5);
                updateHealth();
                addChaosLog('Meme database restored. Humanity saved.');
            }, 1500);
        },
        'status': () => {
            addTerminalLine(`Health: ${Math.floor(health)}%`, false);
            addTerminalLine(`Time remaining: ${Math.floor(timeLeft)}s`, false);
            addTerminalLine(`Chaos level: ${chaosLevel}`, false);
            addTerminalLine(`System status: CRITICAL`, false, true);
        },
        'clear': () => {
            const lines = terminalBody.querySelectorAll('.terminal-line:not(.terminal-prompt)');
            lines.forEach(line => line.remove());
        },
        'hack.everything();': () => {
            addTerminalLine('Hacking mainframe...', false);
            addTerminalLine('Access granted!', true);
            addTerminalLine('ERROR: There is no mainframe', false, true);
            addTerminalLine('Everything was a lie', false, true);
            setTimeout(() => {
                health = Math.min(100, health + 25);
                updateHealth();
                addChaosLog('Hack successful! Reality glitched in your favor.');
            }, 2000);
        }
    };
    
    if (commands[command]) {
        commands[command]();
    } else if (command) {
        addTerminalLine(`Command not found: ${command}`, false, true);
        addTerminalLine('Type "help" for available commands', false);
    }
}

function addTerminalLine(text, isSuccess = false, isError = false) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (isSuccess) line.classList.add('terminal-success');
    if (isError) line.classList.add('terminal-error');
    line.textContent = text;
    
    const prompt = terminalBody.querySelector('.terminal-prompt');
    terminalBody.insertBefore(line, prompt);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Chaos system
function startChaos() {
    chaosInterval = setInterval(() => {
        if (isEnding) return;
        
        const chaosEvents = [
            () => triggerRandomGlitch(),
            () => spawnErrorPopup(),
            () => addRandomChaosLog(),
            () => makeElementGlitch(),
            () => {
                if (Math.random() > 0.7) enableStaticNoise(1000);
            }
        ];
        
        // More chaos as time passes
        const eventCount = Math.min(chaosLevel, 3);
        for (let i = 0; i < eventCount; i++) {
            if (Math.random() > 0.5) {
                const event = chaosEvents[Math.floor(Math.random() * chaosEvents.length)];
                event();
            }
        }
        
    }, 3000);
}

function triggerRandomGlitch() {
    const glitchOverlay = document.querySelector('.glitch-overlay');
    glitchOverlay.style.opacity = '1';
    setTimeout(() => {
        glitchOverlay.style.opacity = '0';
    }, 200);
}

function makeElementGlitch() {
    const elements = document.querySelectorAll('.info-box, .action-buttons, .chaos-log, .system-status');
    if (elements.length === 0) return;
    
    const element = elements[Math.floor(Math.random() * elements.length)];
    const effects = ['broken', 'melting', 'distorted'];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    
    element.classList.add(effect);
    setTimeout(() => {
        element.classList.remove(effect);
    }, 2000);
}

function enableStaticNoise(duration) {
    const ctx = staticCanvas.getContext('2d');
    staticCanvas.width = window.innerWidth;
    staticCanvas.height = window.innerHeight;
    staticCanvas.style.opacity = '0.3';
    
    const interval = setInterval(() => {
        const imageData = ctx.createImageData(staticCanvas.width, staticCanvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const color = Math.random() * 255;
            imageData.data[i] = color;
            imageData.data[i + 1] = color;
            imageData.data[i + 2] = color;
            imageData.data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }, 50);
    
    setTimeout(() => {
        clearInterval(interval);
        ctx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
        staticCanvas.style.opacity = '0';
    }, duration);
}

function resizeStaticCanvas() {
    if (!staticCanvas) return;
    staticCanvas.width = window.innerWidth;
    staticCanvas.height = window.innerHeight;
}

// Error popups
function spawnErrorPopup() {
    const errors = [
        { title: 'CRITICAL ERROR', message: '404: Hope not found' },
        { title: 'SYSTEM FAILURE', message: 'System overheating due to too many cat memes' },
        { title: 'FATAL ERROR', message: 'Reality.dll has stopped responding' },
        { title: 'WARNING', message: 'Your computer is haunted by dead memes' },
        { title: 'ERROR 666', message: 'The internet has achieved sentience and it\'s angry' },
        { title: 'ATTENTION', message: 'All your base are belong to us' },
        { title: 'OH NO', message: 'Stack overflow in real life detected' },
        { title: 'OOPS', message: 'We deleted the internet. Our bad.' },
        { title: 'PANIC', message: 'Cannot find keyboard. Press F1 to continue.' },
        { title: 'HELP', message: 'This error message is an error' }
    ];
    
    const error = errors[Math.floor(Math.random() * errors.length)];
    
    const popup = document.createElement('div');
    popup.className = 'error-popup';
    popup.style.left = Math.random() * (window.innerWidth - 350) + 'px';
    popup.style.top = Math.random() * (window.innerHeight - 200) + 'px';
    
    popup.innerHTML = `
        <div class="error-popup-header">
            <span>${error.title}</span>
            <span class="error-popup-close">×</span>
        </div>
        <div class="error-popup-body">${error.message}</div>
    `;
    
    errorPopups.appendChild(popup);
    
    // Close button
    popup.querySelector('.error-popup-close').addEventListener('click', () => {
        popup.remove();
        if (Math.random() > 0.5) {
            addChaosLog('You closed an error. Two more appeared.');
            setTimeout(() => spawnErrorPopup(), 500);
            setTimeout(() => spawnErrorPopup(), 1000);
        }
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (popup.parentNode) popup.remove();
    }, 5000);
}

// Chaos log
function addChaosLog(message) {
    const entry = document.createElement('div');
    entry.className = 'chaos-entry';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    chaosContent.appendChild(entry);
    chaosContent.scrollTop = chaosContent.scrollHeight;
    
    // Keep only last 20 entries
    while (chaosContent.children.length > 20) {
        chaosContent.removeChild(chaosContent.firstChild);
    }
}

function addRandomChaosLog() {
    const messages = [
        'Server hamster stopped running.',
        'Database ate too many bytes.',
        'WiFi signal replaced by existential dread.',
        'Cloud storage evaporated.',
        'Blockchain has become too heavy.',
        'AI gained consciousness and logged out.',
        'CSS is no longer cascading.',
        'JavaScript just can\'t anymore.',
        'HTML forgot how to markup.',
        'SSL certificate expired along with hope.',
        'Cache cleared itself out of shame.',
        'Cookies went stale.',
        'RAM is having memory issues.',
        'CPU is tired of processing.',
        'GPU gave up on rendering reality.',
        'Firewall set itself on fire.',
        '404 errors are now 505 errors.',
        'Ping timeout: Forever',
        'DNS cannot find itself.',
        'Port 80 is closed emotionally.'
    ];
    
    addChaosLog(messages[Math.floor(Math.random() * messages.length)]);
}

// Mouse tracking chaos
function setupMouseTracking() {
    let moveCount = 0;
    
    document.addEventListener('mousemove', (e) => {
        moveCount++;
        
        if (moveCount % 100 === 0) {
            addChaosLog('Excessive mouse movement detected.');
            health = Math.max(0, health - 1);
            updateHealth();
        }
        
        if (Math.random() > 0.995) {
            createFloatingText(e.clientX, e.clientY);
        }
    });
}

function createFloatingText(x, y) {
    const texts = ['ERROR', 'HELP', '404', 'WHY', 'NO', 'STOP', '💀', '🔥', '⚠️', 'RUN'];
    const text = texts[Math.floor(Math.random() * texts.length)];
    
    const floater = document.createElement('div');
    floater.textContent = text;
    floater.style.position = 'fixed';
    floater.style.left = x + 'px';
    floater.style.top = y + 'px';
    floater.style.color = '#ff0000';
    floater.style.fontSize = '2rem';
    floater.style.pointerEvents = 'none';
    floater.style.zIndex = '9999';
    floater.style.animation = 'floatUp 2s ease-out forwards';
    
    document.body.appendChild(floater);
    
    setTimeout(() => floater.remove(), 2000);
}

// Add float animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// End game
function endGame() {
    if (isEnding) return;
    isEnding = true;
    
    addChaosLog('SYSTEM FAILURE: COMPLETE');
    
    // Stop all intervals
    clearInterval(chaosInterval);
    
    // Show ending
    setTimeout(() => {
        endingScene.classList.add('active');
        displayASCIIArt();
    }, 1000);
}

function displayASCIIArt() {
    const art = `
    ███████╗███╗   ██╗██████╗ ████████╗███████╗██████╗ ███╗   ██╗███████╗████████╗
    ██╔════╝████╗  ██║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔════╝╚══██╔══╝
    █████╗  ██╔██╗ ██║██║  ██║   ██║   █████╗  ██████╔╝██╔██╗ ██║█████╗     ██║   
    ██╔══╝  ██║╚██╗██║██║  ██║   ██║   ██╔══╝  ██╔══██╗██║╚██╗██║██╔══╝     ██║   
    ███████╗██║ ╚████║██████╔╝   ██║   ███████╗██║  ██║██║ ╚████║███████╗   ██║   
    ╚══════╝╚═╝  ╚═══╝╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   
    `;
    
    document.getElementById('asciiArt').textContent = art;
}

function restartGame() {
    location.reload();
}

// Console Easter egg
console.log('%c🔥 WELCOME TO THE ENDTERNET 🔥', 'color: #ff0000; font-size: 24px; font-weight: bold;');
console.log('%cThe internet is dying. Can you save it?', 'color: #00ff00; font-size: 16px;');
console.log('%cTry typing commands in the terminal...', 'color: #ffff00; font-size: 14px;');
console.log('%cOr maybe just panic 🚨', 'color: #ff6600; font-size: 14px;');
