# 🎮 Snack Attack - Complete Action Plan

## Current Analysis
**What You Have:**
- ✅ Three.js setup with camera tweening system
- ✅ Character model with morph targets (smile/sad keyframes)
- ✅ Bubble system for displaying desires
- ✅ 1000 random snack objects scattered in 3D space
- ✅ GLTF asset loading pipeline
- ✅ Basic animation framework

**Critical Gap:** No gameplay mechanics - it's a 3D tech demo, not a game yet.

## 🚀 IMMEDIATE ACTION PLAN (Priority Order)

### Phase 1: Core Gameplay Foundation (Week 1-2)

#### 1.1 **Fix Character Emotion System** 
**File:** `public/js/game.js`
**Problem:** Morph targets exist but not controlled by game events
**Solution:**
```javascript
// Create emotion controller
game.emotions = {
    neutral: 0,
    happy: 1,    // morph target index 0
    sad: 2       // morph target index 1
};

function setCharacterEmotion(emotion, duration = 1000) {
    const character = game.characterMesh; // get from loadscene2
    if (!character) return;
    
    // Reset all morph targets
    character.morphTargetInfluences[0] = 0; // happy
    character.morphTargetInfluences[1] = 0; // sad
    
    // Set target emotion
    switch(emotion) {
        case 'happy':
            new TWEEN.Tween({value: 0})
                .to({value: 1}, duration)
                .onUpdate(function() {
                    character.morphTargetInfluences[0] = this.value;
                })
                .start();
            break;
        case 'sad':
            new TWEEN.Tween({value: 0})
                .to({value: 1}, duration)
                .onUpdate(function() {
                    character.morphTargetInfluences[1] = this.value;
                })
                .start();
            break;
    }
}
```

#### 1.2 **Implement Click Detection System**
**File:** `public/js/game.js`
**Add raycasting for object interaction:**
```javascript
// Add to game init
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
game.isGameActive = false;
game.score = 0;
game.currentDesiredItem = null;

// Click handler
game.renderer.domElement.addEventListener('click', onObjectClick);
game.renderer.domElement.addEventListener('touchstart', onObjectClick); // Mobile

function onObjectClick(event) {
    if (!game.isGameActive) return;
    
    event.preventDefault();
    
    // Calculate mouse position
    const rect = game.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Raycast to find clicked object
    raycaster.setFromCamera(mouse, game.camera);
    const intersects = raycaster.intersectObjects(game.board);
    
    if (intersects.length > 0) {
        handleObjectClick(intersects[0].object);
    }
}

function handleObjectClick(clickedObject) {
    if (!game.currentDesiredItem) return;
    
    const isCorrect = clickedObject.name === game.currentDesiredItem.name;
    
    if (isCorrect) {
        // Correct choice!
        game.score += 10;
        setCharacterEmotion('happy');
        createClickEffect(clickedObject, 'correct');
        showNewDesire();
    } else {
        // Wrong choice!
        game.score = Math.max(0, game.score - 5);
        setCharacterEmotion('sad');
        createClickEffect(clickedObject, 'wrong');
    }
    
    updateScoreDisplay();
}
```

#### 1.3 **Enhanced Desire Bubble System**
**File:** `public/js/game.js`
**Replace current `itemtoeat()` function:**
```javascript
function showNewDesire() {
    if (!game.mainmodel || !game.bubble) return;
    
    // Clear previous desire
    if (game.currentitem) {
        game.bubble.remove(game.currentitem);
    }
    
    // Pick random snack type
    const randomSnack = game.mainmodel[Math.floor(Math.random() * game.mainmodel.length)];
    game.currentDesiredItem = randomSnack;
    
    // Show in bubble
    const desireDisplay = randomSnack.clone();
    desireDisplay.scale.set(0.15, 0.15, 0.15);
    desireDisplay.position.set(0, 0, 0);
    game.bubble.add(desireDisplay);
    game.currentitem = desireDisplay;
    
    // Start desire timer
    game.desireTimeLeft = 4 + Math.random() * 3; // 4-7 seconds
    
    console.log(`🎯 Find: ${randomSnack.name}`);
}

// Update desire timer in animate loop
function updateDesireTimer() {
    if (!game.isGameActive || !game.desireTimeLeft) return;
    
    game.desireTimeLeft -= game.dt / 1000;
    
    if (game.desireTimeLeft <= 0) {
        // Time's up! Show new desire
        showNewDesire();
    }
    
    // Flash bubble when time running out
    if (game.desireTimeLeft < 2 && game.bubble) {
        const flash = Math.sin(Date.now() * 0.01) > 0 ? 1 : 0.5;
        game.bubble.material.opacity = flash;
    }
}
```

#### 1.4 **Game State Management**
**File:** `public/js/game.js`
**Add game states:**
```javascript
game.states = {
    LOADING: 'loading',
    MENU: 'menu', 
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};

game.currentState = game.states.LOADING;

function startGame() {
    game.currentState = game.states.PLAYING;
    game.isGameActive = true;
    game.score = 0;
    game.gameTime = 0;
    setCharacterEmotion('neutral');
    showNewDesire();
    
    // Hide loading screen
    $('#loading_div').fadeOut(400);
    
    console.log('🎮 Game Started!');
}

// Add to animate function
function updateGame() {
    if (game.currentState === game.states.PLAYING) {
        updateDesireTimer();
        game.gameTime += game.dt;
    }
}
```

### Phase 2: Enhanced Gameplay (Week 2-3)

#### 2.1 **Improved Camera System**
**File:** `public/js/game.js`
**Make camera more engaging:**
```javascript
function tweencamera() {
    if (!game.isGameActive) return;
    
    const mesh = get_random_kid(game.board);
    const distance = getDistance(game.camera.position, mesh.position);
    
    // Faster movement based on game progression
    const speedMultiplier = 1 + (game.score / 100); // Gets faster as score increases
    const maxtime = Math.max(1, (distance * 20) / (1000 * speedMultiplier)); // Minimum 1 second
    
    const from = { 
        x: game.camera.position.x, 
        y: game.camera.position.y,
        z: game.camera.position.z,
        rx: game.camera.rotation.x
    };

    const to = {  
        x: mesh.position.x + (Math.random() - 0.5) * 20, // Add randomness
        y: mesh.position.y + 75 + Math.random() * 30,     // Vary height
        z: mesh.position.z + (Math.random() - 0.5) * 20,
        rx: -Math.PI * 0.5 + (Math.random() - 0.5) * 0.2 // Slight angle variation
    };

    new TWEEN.Tween(from)
        .to(to, maxtime * 1000)
        .easing(TWEEN.Easing.Quadratic.InOut) // Smoother easing
        .onUpdate(function() {
            game.camera.position.set(from.x, from.y, from.z);
            game.camera.rotation.x = from.rx;
        })
        .onComplete(function() {
            if (game.isGameActive) {
                setTimeout(tweencamera, 500); // Shorter pause between moves
            }
        })
        .start();
}
```

#### 2.2 **Visual Feedback System**
**File:** `public/js/effects.js` (NEW FILE)
```javascript
// Create visual effects for interactions
function createClickEffect(object, type) {
    // Particle effect for correct/wrong clicks
    const geometry = new THREE.SphereGeometry(1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
        color: type === 'correct' ? 0x00ff00 : 0xff0000,
        transparent: true
    });
    
    const particles = [];
    for (let i = 0; i < 10; i++) {
        const particle = new THREE.Mesh(geometry, material.clone());
        particle.position.copy(object.position);
        particle.position.add(new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        ));
        game.scene.add(particle);
        particles.push(particle);
    }
    
    // Animate particles
    particles.forEach(particle => {
        new TWEEN.Tween(particle.material)
            .to({opacity: 0}, 1000)
            .onComplete(() => {
                game.scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            })
            .start();
    });
    
    // Flash the clicked object
    const originalColor = object.material.color.clone();
    object.material.color.setHex(type === 'correct' ? 0x00ff00 : 0xff0000);
    
    setTimeout(() => {
        object.material.color.copy(originalColor);
    }, 200);
}

function highlightObject(object, highlight) {
    if (highlight) {
        object.material.emissive.setHex(0x333333);
    } else {
        object.material.emissive.setHex(0x000000);
    }
}
```

#### 2.3 **UI System**
**File:** `public/index.html`
**Add game UI elements:**
```html
<!-- Add before closing body tag -->
<div id="game-ui" style="position: fixed; top: 20px; left: 20px; color: white; font-size: 24px; z-index: 100; display: none;">
    <div>Score: <span id="score-display">0</span></div>
    <div>Time: <span id="time-display">0</span>s</div>
    <div id="desire-timer" style="width: 200px; height: 10px; background: #333; margin: 10px 0;">
        <div id="timer-bar" style="width: 100%; height: 100%; background: #00ff00; transition: width 0.1s;"></div>
    </div>
</div>

<div id="start-menu" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: white; z-index: 100;">
    <h1>Snack Attack</h1>
    <p>Find the snack the character wants!</p>
    <button id="start-button" onclick="startGame()" style="padding: 15px 30px; font-size: 18px;">Start Game</button>
</div>
```

**File:** `public/js/ui.js` (NEW FILE)
```javascript
function updateScoreDisplay() {
    document.getElementById('score-display').textContent = game.score;
}

function updateTimeDisplay() {
    const time = Math.floor(game.gameTime / 1000);
    document.getElementById('time-display').textContent = time;
}

function updateDesireTimer() {
    if (!game.desireTimeLeft) return;
    
    const maxTime = 7; // Maximum desire time
    const percentage = (game.desireTimeLeft / maxTime) * 100;
    document.getElementById('timer-bar').style.width = percentage + '%';
    
    // Change color based on time left
    const timerBar = document.getElementById('timer-bar');
    if (percentage > 50) {
        timerBar.style.background = '#00ff00'; // Green
    } else if (percentage > 25) {
        timerBar.style.background = '#ffff00'; // Yellow
    } else {
        timerBar.style.background = '#ff0000'; // Red
    }
}

function showGameUI() {
    document.getElementById('game-ui').style.display = 'block';
    document.getElementById('start-menu').style.display = 'none';
}
```

### Phase 3: Polish & Features (Week 3-4)

#### 3.1 **Sound System**
**File:** `public/js/audio.js` (NEW FILE)
```javascript
// Add Web Audio API sounds
game.sounds = {};

function loadSounds() {
    // Use Howler.js or Web Audio API
    game.sounds.correct = new Audio('sounds/correct.mp3');
    game.sounds.wrong = new Audio('sounds/wrong.mp3');
    game.sounds.background = new Audio('sounds/background.mp3');
}

function playSound(soundName) {
    if (game.sounds[soundName]) {
        game.sounds[soundName].play();
    }
}
```

#### 3.2 **Progressive Difficulty**
```javascript
function getDifficultySettings() {
    const level = Math.floor(game.score / 50); // New level every 50 points
    
    return {
        desireTime: Math.max(2, 7 - level * 0.5), // Faster desires
        cameraSpeed: 1 + level * 0.3,             // Faster camera
        bonusPoints: level > 2 ? 2 : 1            // More points at higher levels
    };
}
```

#### 3.3 **Mobile Optimization**
**File:** `public/js/mobile.js` (NEW FILE)
```javascript
// Touch controls and mobile optimizations
function initMobileControls() {
    // Disable zoom
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, {passive: false});
    
    // Optimize for mobile performance
    if (isMobile()) {
        // Reduce particle count
        // Lower texture resolution
        // Reduce number of visible objects
    }
}
```

## 🎯 IMPLEMENTATION ORDER

**Week 1:**
1. Fix character emotions (morph targets)
2. Add click detection
3. Implement basic desire system
4. Add game states

**Week 2:**
1. Enhanced camera movement
2. Visual effects system
3. Basic UI
4. Scoring system

**Week 3:**
1. Sound system
2. Progressive difficulty
3. Mobile optimization
4. Performance improvements

**Week 4:**
1. Polish and bug fixes
2. Balancing
3. Additional features
4. Testing

## 🚨 CRITICAL FIXES NEEDED

### 1. **Character Mesh Reference**
In `loadscene2()`, store character reference:
```javascript
game.characterMesh = object.children[2].children[0]; // The morph target object
```

### 2. **Remove GUI Debug Interface**
Comment out the GUI morph controls in production:
```javascript
// let gui = new GUI(); // Remove in final version
```

### 3. **Performance Optimization**
Reduce number of objects from 1000 to 200-300 for better performance:
```javascript
var amount = 250; // Instead of 1000
```

### 4. **Memory Management**
Add cleanup for clicked objects and effects to prevent memory leaks.

## 🎮 FINAL RESULT

After implementing this plan, you'll have:
- ✅ **Working "desire bubble" gameplay**
- ✅ **Character emotions responding to player actions**
- ✅ **Fast-paced, engaging camera movement**
- ✅ **Progressive difficulty scaling**
- ✅ **Visual and audio feedback**
- ✅ **Mobile-ready controls**
- ✅ **Complete scoring system**
- ✅ **Professional UI/UX**

**Total Development Time:** 3-4 weeks
**Result:** Fully playable, engaging game ready for app store submission!

Would you like me to start implementing any specific part of this plan?
