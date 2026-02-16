/**
 * OMEGA PROXY - INTEGRATED SYSTEM SCRIPT
 * Consolidated & Bug-Fixed Version
 */

// --- 1. GLOBAL SETTINGS & TRANSLATIONS ---
const translations = {
    en: { welcomeMessage: "WELCOME TO THE OMEGA PROXY", searchPlaceholder: "ENTER QUANTUM QUERY", networkStatus: "QUANTUM NETWORK: ", standbySatus: "STANDBY", activeStatus: "ACTIVE" },
    es: { welcomeMessage: "BIENVENIDO AL PROXY OMEGA", searchPlaceholder: "INGRESE CONSULTA CUÁNTICA", networkStatus: "RED CUÁNTICA: ", standbySatus: "EN ESPERA", activeStatus: "ACTIVA" },
    fr: { welcomeMessage: "BIENVENUE SUR LE PROXY OMEGA", searchPlaceholder: "ENTREZ LA REQUÊTE QUANTIQUE", networkStatus: "RÉSEAU QUANTIQUE : ", standbySatus: "EN ATTENTE", activeStatus: "ACTIF" },
    de: { welcomeMessage: "WILLKOMMEN BEI OMEGA PROXY", searchPlaceholder: "QUANTENABFRAGE EINGEBEN", networkStatus: "QUANTENNETZWERK: ", standbySatus: "BEREITSCHAFT", activeStatus: "AKTIV" }
};

const aiPersonalities = {
    default: { name: "Quantum AI", greeting: "Hello! I'm your Quantum AI assistant.", style: { color: "#00ffcc", background: "rgba(0, 255, 204, 0.1)" } },
    hacker: { name: "H4X0R AI", greeting: "Yo. Encrypted communication established.", style: { color: "#33ff33", background: "rgba(51, 255, 51, 0.1)" } },
    scientific: { name: "Research Assistant", greeting: "Greetings. Prepared for complex queries.", style: { color: "#ff00ff", background: "rgba(255, 0, 255, 0.1)" } }
};

// --- 2. CORE SYSTEM INITIALIZATION ---
window.addEventListener('load', () => {
    // Load Preferences
    if (localStorage.getItem('selectedBg')) changeBg(localStorage.getItem('selectedBg'));
    if (localStorage.getItem('selectedTheme')) changeTheme(localStorage.getItem('selectedTheme'));
    
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    changeLanguage(savedLang);

    // Initialize Name UI
    updateNameUI(localStorage.getItem('savedUserName'));

    // Initialize Panic Key
    updatePanicKeyListener();
    const savedPanic = localStorage.getItem('panicKey');
    if (savedPanic) {
        const display = document.getElementById('currentPanicKeyDisplay');
        if (display) display.textContent = `Current Panic Key: ${savedPanic.toUpperCase()}`;
    }

    // Initialize Chat & Systems
    loadSavedMessages();
    populateSystemInfo();
    capturePerformanceMetrics();
    refreshLocalStorageView();

    // Default Tab
    const defaultTab = document.querySelector(".tablinks");
    if (defaultTab) defaultTab.click();

    // Initial Cursor
    changeCursor('default');

    // Global Enter Key Listeners
    setupEnterKeyListeners();
});

// --- 3. UI & TAB SYSTEM ---
function openCity(evt, cityName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";
    
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");

    const target = document.getElementById(cityName);
    if (target) target.style.display = "block";
    evt.currentTarget.classList.add("active");
}

function openNewYorkAndParis(evt) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";

    if(document.getElementById("NewYork")) document.getElementById("NewYork").style.display = "block";
    if(document.getElementById("Paris")) document.getElementById("Paris").style.display = "block";

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");
    evt.currentTarget.classList.add("active");
}

function changeBg(bgType) {
    const wrapper = document.getElementById('bg-wrapper');
    if (wrapper) {
        wrapper.className = ''; 
        wrapper.classList.add(`bg-${bgType}`);
        localStorage.setItem('selectedBg', bgType);
    }
}

function changeTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('selectedTheme', themeName);
}

// --- 4. CURSOR SYSTEM ---
let currentMoveHandler = null;

function changeCursor(cursorType) {
    const elementsToRemove = ['#particle-canvas', '.cursor-head', '.blood-cursor', '.cursor-dot', '.cursor-outline', '.minimalist-cursor'];
    elementsToRemove.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
    window.removeEventListener('mousemove', currentMoveHandler);
    document.body.style.cursor = 'default';

    if (cursorType === 'default') {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        const outline = document.createElement('div');
        outline.className = 'cursor-outline';
        document.body.append(dot, outline);

        currentMoveHandler = (e) => {
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;
            outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: 'forwards' });
        };
    } else if (cursorType === 'minimalist') {
        const cursor = document.createElement('div');
        cursor.className = 'minimalist-cursor';
        Object.assign(cursor.style, {
            position: 'fixed', width: '12px', height: '12px', borderRadius: '50%',
            backgroundColor: 'rgba(0, 255, 255, 0.7)', border: '2px solid #fff',
            pointerEvents: 'none', zIndex: '999999', transform: 'translate(-50%, -50%)'
        });
        document.body.appendChild(cursor);
        currentMoveHandler = (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        };
    }
    // Note: Add logic for 'blood' and 'particle' here if needed.
    window.addEventListener('mousemove', currentMoveHandler);
}

// --- 5. NAME & PANIC SYSTEM ---
function updateNameUI(name) {
    const display = document.querySelector('.system-value');
    const header = document.querySelector('h1');
    const welcome = document.getElementById('welcomeUser');
    const upName = name ? name.toUpperCase() : null;

    if (display) display.textContent = upName || 'N/A';
    if (header) header.textContent = upName ? `WELCOME TO THE OMEGA PROXY, ${upName}` : 'WELCOME,';
    if (welcome) welcome.textContent = upName ? `WELCOME, ${upName}` : 'WELCOME, GUEST';
}

function saveName() {
    const input = document.getElementById('nameInput');
    if (input && input.value.trim()) {
        localStorage.setItem('savedUserName', input.value.trim());
        updateNameUI(input.value.trim());
        input.value = '';
    }
}

function panicKeyHandler(event) {
    const key = localStorage.getItem('panicKey') || 'enter';
    if (event.key.toLowerCase() === key) window.location.href = 'https://classroom.google.com';
}

function updatePanicKeyListener() {
    document.removeEventListener('keydown', panicKeyHandler);
    document.addEventListener('keydown', panicKeyHandler);
}

function savePanicKey() {
    const input = document.getElementById('panicKeyInput');
    if (input && input.value.trim()) {
        const key = input.value.trim().toLowerCase();
        localStorage.setItem('panicKey', key);
        document.getElementById('currentPanicKeyDisplay').textContent = `Current Panic Key: ${key.toUpperCase()}`;
        updatePanicKeyListener();
        input.value = '';
    }
}

// --- 6. CHAT & CHILLZONE ---
function sendChillzoneMessage() {
    const nameEl = document.getElementById('chillzoneNameInput');
    const msgEl = document.getElementById('chillzoneMessageInput');
    const logEl = document.getElementById('chillzoneChatLog');

    if (!msgEl.value.trim()) return;

    const name = nameEl.value.trim() || "GUEST_" + Math.floor(Math.random()*999);
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg-user';
    msgDiv.innerHTML = `> ${name}: ${msgEl.value}`;
    logEl.appendChild(msgDiv);

    let messages = JSON.parse(localStorage.getItem('chillzoneMessages') || '[]');
    messages.push({ name: name, message: msgEl.value, timestamp: new Date().toISOString() });
    localStorage.setItem('chillzoneMessages', JSON.stringify(messages));

    logEl.scrollTop = logEl.scrollHeight;
    msgEl.value = "";
    refreshLocalStorageView();
}

function loadSavedMessages() {
    const logEl = document.getElementById('chillzoneChatLog');
    if (!logEl) return;
    const messages = JSON.parse(localStorage.getItem('chillzoneMessages') || '[]');
    logEl.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'msg-user';
        div.innerHTML = `> ${msg.name}: ${msg.message}`;
        logEl.appendChild(div);
    });
    logEl.scrollTop = logEl.scrollHeight;
}

// --- 7. DEV TOOLS & DIAGNOSTICS ---
function executeDevCommand() {
    const input = document.getElementById('devConsoleInput');
    const output = document.getElementById('devConsoleOutput');
    try {
        const result = eval(input.value);
        output.value += `> ${input.value}\n${result}\n\n`;
    } catch (e) {
        output.value += `Error: ${e}\n\n`;
    }
    input.value = '';
    output.scrollTop = output.scrollHeight;
}

function populateSystemInfo() {
    if(document.getElementById('userAgentInfo')) document.getElementById('userAgentInfo').textContent = navigator.userAgent;
    if(document.getElementById('screenInfo')) document.getElementById('screenInfo').textContent = `${screen.width}x${screen.height}`;
}

function capturePerformanceMetrics() {
    if (window.performance && window.performance.memory) {
        const mem = document.getElementById('memoryUsage');
        if (mem) mem.textContent = `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB`;
    }
}

function refreshLocalStorageView() {
    const table = document.getElementById('localStorageEntries');
    if (!table) return;
    table.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const row = table.insertRow();
        row.insertCell(0).textContent = key;
        row.insertCell(1).textContent = localStorage.getItem(key);
    }
}

// --- 8. HELPERS ---
function changeLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    const trans = translations[lang];
    if (document.querySelector('h1')) document.querySelector('h1').textContent = trans.welcomeMessage;
    const search = document.getElementById('quantum-search-input');
    if (search) search.placeholder = trans.searchPlaceholder;
}

function setupEnterKeyListeners() {
    const pairs = [
        { id: 'chillzoneMessageInput', fn: sendChillzoneMessage },
        { id: 'devConsoleInput', fn: executeDevCommand },
        { id: 'quantum-search-input', fn: () => { /* performQuantumSearch logic here */ } }
    ];
    pairs.forEach(p => {
        const el = document.getElementById(p.id);
        if (el) el.addEventListener('keypress', (e) => { if (e.key === 'Enter') p.fn(); });
    });
}
