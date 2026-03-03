// ==========================================
// file: main.js
// ==========================================

import { WEAPON_MODELS, WEAPONS_DB, CHARACTERS, EQUIP_DB } from './data.js';
import { 
    updateBadges, showMenu, updateEquipMenuUI, showCharacterSelect, 
    updateBarsUI, updateWeaponsUI, showItemFeedback, closeSettingsModal, showBattlePassModal, showMissionsModal
} from './ui.js';

export const canvas = document.getElementById('gameCanvas'); 
export const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

// --- SALVATAGGI E MEMORIA SICURI ---
export let gameState = "MENU"; export let paused = false; export let frameCount = 0;
export let cheatUnlocked = localStorage.getItem('survivorCheat') === 'true'; 
export let magoUnlocked = localStorage.getItem('survivorMagoUnlocked') === 'true';
export let totalCrystals = parseInt(localStorage.getItem('survivorCrystals')) || 0;
export let unlockedEquip = JSON.parse(localStorage.getItem('survivorUnlockedEquip')) || [];
export let equippedItems = JSON.parse(localStorage.getItem('survivorEquipped')) || { elmo: null, corazza: null, amuleto1: null, amuleto2: null };
export let hasDoubleAmulet = localStorage.getItem('survivorDoubleAmulet') === 'true';
export let charLevels = JSON.parse(localStorage.getItem('survivorCharLevels')) || { 0:1, 1:1, 2:1 };

let gsSaved = JSON.parse(localStorage.getItem('survivorGameStats'));
export let gameStats = gsSaved ? gsSaved : { enemiesKilled: 0, bossesKilled: 0, maxLevelReached: 1, crystalsSpent: 0 };
export let maxLevelReached = parseInt(localStorage.getItem('survivorMaxLevel')) || 1;
maxLevelReached = Math.max(maxLevelReached, gameStats.maxLevelReached);

let todayStr = new Date().toDateString();
let dmSaved = JSON.parse(localStorage.getItem('survivorDaily'));
export let dailyMissions = dmSaved ? dmSaved : { date: todayStr, bossesKilled: 0, levelsGained: 0, itemsBought: 0, claim1: false, claim2: false, claim3: false };
if (dailyMissions.date !== todayStr) { dailyMissions = { date: todayStr, bossesKilled: 0, levelsGained: 0, itemsBought: 0, claim1: false, claim2: false, claim3: false }; localStorage.setItem('survivorDaily', JSON.stringify(dailyMissions)); }

let bpSaved = JSON.parse(localStorage.getItem('survivorBattlePass'));
export let battlePass = bpSaved ? bpSaved : { monthStart: Date.now(), bosses: 0, claims: { 15: false, 30: false, 50: false, 100: false, 150: false } };
if(!battlePass.claims) battlePass.claims = { 15: false, 30: false, 50: false, 100: false, 150: false };
if(battlePass.weekStart && !battlePass.monthStart) { battlePass.monthStart = battlePass.weekStart; delete battlePass.weekStart; }
if(!battlePass.monthStart) battlePass.monthStart = Date.now();
if(Date.now() - battlePass.monthStart > 2592000000) { battlePass = { monthStart: Date.now(), bosses: 0, claims: { 15: false, 30: false, 50: false, 100: false, 150: false } }; localStorage.setItem('survivorBattlePass', JSON.stringify(battlePass)); }

export let selectedCharId = 0; export let savedName = localStorage.getItem('survivorPlayerName') || ""; export let activePlayerName = "Eroe";
window.changeSelectedChar
