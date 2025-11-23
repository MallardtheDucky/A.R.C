import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Shield, Users, AlertTriangle, Lock,
  ArrowLeft, Folder, FileText, X, Mail, Map as MapIcon,
  Activity, Cpu, Radio, Crosshair, Menu, Zap, Fingerprint, Eye,
  Skull, FileWarning, Search, Anchor, Thermometer, Database,
  TrendingUp, Wifi
} from 'lucide-react';

// --- LORE & DATA ---

const CURRENT_DATE = "23.10.2275";

const EMAILS = [
  {
    id: 'msg_001',
    from: 'Caldwell, V. (Overseer)',
    to: 'Drake, R. (Security Chief)',
    subject: 'Simulation 55-C ("Rogue Army" Scenario)',
    date: '23.10.2275',
    body: `Roland,\n\nI reviewed the logs from the "Rogue US Army" simulation.\n\nIt is terrifying. We programmed the holographic enemies to use Pre-War T-51b tactics. The result? Our 10mm rounds bounced off their plating. Our T-45d suits—our heaviest assets—were outmaneuvered by the theoretical T-51b algorithms in 12 minutes.\n\nWe have to assume that if we open that door, we might face technology equal to or greater than our own. We aren't the only ones Vault-Tec gave toys to.\n\nKeep this quiet.\n\n- V.C.`
  },
  {
    id: 'msg_002',
    from: 'Volkova, N. (Chief Eng)',
    to: 'Maintenance Division',
    subject: 'Mr. Handy Unit 38 ("Barnaby") Decommission',
    date: '22.10.2275',
    body: `It is with regret that I am pulling Unit 38 ("Barnaby") from the cafeteria rotation.\n\nAfter 198 years of continuous operation without a factory reset, his personality matrix has fragmented. Yesterday he attempted to serve "Radiation Soup" by trying to ladle water directly from the reactor coolant line.\n\nWe cannot wipe him; we lost the RobCo factory software in the '50s. We can only salvage him for parts.\n\n- Natasha`
  },
  {
    id: 'msg_003',
    from: 'Dr. Morrison (Chief Medical)',
    to: 'Caldwell, V. (Overseer)',
    subject: 'Case Study: The "Grey Drift"',
    date: '20.10.2275',
    body: `Vincent,\n\nThe "Grey Drift" isn't just a slang term anymore. I have a clinical case.\n\nSubject: Child 44-A (Born 2270).\nSymptoms: Extreme lethargy, photosensitivity, and a depressed immune response.\n\nIt's the genetic bottleneck. We are 198 years deep in a closed loop. The DNA is unraveling. If we do not introduce external genetic material within one generation, we risk a cascade failure.\n\n- James`
  },
  {
    id: 'msg_004',
    from: 'Torres, M. (Reclamationist)',
    to: 'Council All',
    subject: 'The Unknown Signal',
    date: '18.10.2275',
    body: `I was in the comms room during the seismic event yesterday. I heard it.\n\nThrough the static, for three seconds: Music. American marching music. And a voice. It sounded like... a President?\n\nAshford claims it's a "Ghost Signal"—a pre-war automated loop. But it sounded crisp. It sounded NEW.\n\nSomeone is rebuilding America up there.\n\n- Michaela`
  }
];

const FILE_SYSTEM = {
  root: {
    id: 'root',
    name: 'MAIN DRIVE',
    type: 'folder',
    children: ['mission', 'military', 'admin', 'engineering', 'medical', 'classified']
  },
  mission: {
    id: 'mission',
    name: 'MISSION PROFILE',
    type: 'folder',
    children: ['project_ark', 'langston_memo', 'timeline_events']
  },
  project_ark: {
    id: 'project_ark',
    name: 'PROJECT_OVERVIEW.TXT',
    type: 'file',
    content: `SUBJECT: The A.R.C. (Vault 254)\nCLASSIFICATION: V-TEC EYES ONLY\n\nThe Administrative Reclamation Command is a CONTROL VAULT designed to preserve the corporate hierarchy of Vault-Tec.\n\nCORE MANDATE:\n1. SURVIVE the nuclear exchange.\n2. WAIT for the "Great Silence" (estimated 20 years post-war).\n3. AWAKEN the 120 Executives.\n4. RESTRUCTURE the United States under corporate governance.\n\nCURRENT STATUS: CRITICAL FAILURE OF STEP 2.\nThe surface is not silent; it is screaming.`
  },
  langston_memo: {
    id: 'langston_memo',
    name: 'LANGSTON_MEMO.LOG',
    type: 'file',
    content: `FROM: Frederick Langston, Board of Directors\nDATE: August 14, 2076\n\n"We are the architects of the future."\n\nLet the politicians in Washington burn. When the smoke clears, the world will need Management. It will need Structure. It will need Us.\n\nWe will sleep through the chaos. And when we wake, we will not be rebuilding a democracy. We will be building a Department.`
  },
  timeline_events: {
    id: 'timeline_events',
    name: 'HISTORY_LOG.DAT',
    type: 'file',
    content: `[2077.10.23] The Great Seal. 120 Executives frozen. 369 Staff active.\n[2102.05.20] Overseer Caldwell I cancels opening. "Atmosphere toxic."\n[2180.11.02] The "Deep Tremor." A massive seismic event shakes the vault.\n[2245.03.15] The "Static Age" begins. Comms pick up increased encrypted chatter.\n[2275.10.23] PRESENT DAY. 198 Years of Silence.`
  },
  military: {
    id: 'military',
    name: 'SECURITY & DEFENSE',
    type: 'folder',
    children: ['force_manifest', 'arsenal_count', 'death_spiral', 'simulation_logs', 'surface_threats']
  },
  force_manifest: {
    id: 'force_manifest',
    name: 'ROSTER_ACTIVE.DB',
    type: 'file',
    content: `COMMANDER: Chief Roland Drake\nACTIVE FORCE: 120 Personnel\n\nPLATOON ALPHA ("The Wall")\n- Duty: The Great Door\n- Mental State: High paranoia.\n\nPLATOON BETA ("The Watch")\n- Duty: Internal Order\n\nPLATOON GAMMA ("The Reserve")\n- Duty: Maintenance & Training`
  },
  arsenal_count: {
    id: 'arsenal_count',
    name: 'ARMORY_INVENTORY.TXT',
    type: 'file',
    content: `WARNING: NON-REPLENISHABLE STOCKPILE\n\nSMALL ARMS:\n- 10mm Pistols (N99): 150 Units\n- R91 Assault Rifles: 200 Units (Wood stocks rotting)\n\nHEAVY EQUIPMENT:\n- T-45d Power Armor: 20 Suits (18 Operational)\n\nMISSING CAPABILITIES:\n- NO indirect fire support.\n- NO air support.\n- NO anti-armor weaponry.`
  },
  death_spiral: {
    id: 'death_spiral',
    name: 'THREAT_DEATH_SPIRAL.DOC',
    type: 'file',
    content: `STRATEGIC ASSESSMENT: "THE DEATH SPIRAL"\n\nTHE MATH:\nWe cannot build guns. We cannot build bullets. We cannot build armor.\n\nIf we win a battle but lose 10 Rifles, we have permanently lost 5% of our combat power.\n\nCONCLUSION:\nVictory is mathematically impossible in a sustained conflict. Our only defense is obscurity.`
  },
  simulation_logs: {
    id: 'simulation_logs',
    name: 'WAR_GAME_RESULTS.LOG',
    type: 'file',
    content: `SCENARIO: "Communist Invasion Force"\nRESULT: DEFEAT. (Stealth suits overwhelmed T-45s).\n\nSCENARIO: "Civilian Riot"\nRESULT: VICTORY.\n\nSCENARIO: "Rogue US Army Remnant"\nRESULT: TOTAL DEFEAT in 14 minutes.\nNOTE: Our ballistic vests offered zero resistance to Plasma weaponry.`
  },
  surface_threats: {
    id: 'surface_threats',
    name: 'SURFACE_SENSOR_LOGS.DAT',
    type: 'file',
    content: `[2275.05.12] SEISMIC: Heavy rhythmic vibrations detected. Mass > 2,000kg.\n\n[2275.08.14] ACOUSTIC: High-pitch turbine whine. Supersonic flight detected.\n\n[2275.10.01] RADIATION: Spike in background Rads. Wind from D.C. Ruins.`
  },
  admin: {
    id: 'admin',
    name: 'ADMINISTRATION',
    type: 'folder',
    children: ['factions', 'council_minutes', 'census', 'goat_results', 'contraband_list']
  },
  factions: {
    id: 'factions',
    name: 'POLITICAL_LANDSCAPE.DOC',
    type: 'file',
    content: `INTERNAL FACTION SUMMARY (2275)\n\n1. LOYALISTS (Overseer Caldwell)\nStatus Quo. The vault is a Holy Sanctuary.\n\n2. RECLAMATIONISTS (Torres)\nBelieve the surface is safe and we are being held prisoner.\n\n3. PRESERVATIONISTS (Ashford)\nCult of safety. Refuse to look at photos of the "Hellscape."\n\n4. INNOVATORS (Volkova)\nEngineers tearing apart walls for parts.`
  },
  council_minutes: {
    id: 'council_minutes',
    name: 'COUNCIL_TRANSCRIPTS_OCT.TXT',
    type: 'file',
    content: `TRANSCRIPT [2275.10.15]\n\nTORRES (Reclamation): "We are eating algae paste while a world exists above us! The sensors are clear!"\n\nASHFORD (Preservation): "The sensors are lying! Or they are broken! Do you want to open the door and let the radiation cook our children?"\n\nCALDWELL (Overseer): "Enough. Until we have visual confirmation, the door stays shut."\n\nTORRES: "Then let me send a drone!"\n\nCALDWELL: "We don't have any drones left, Michaela. You used the last one for target practice."`
  },
  census: {
    id: 'census',
    name: 'POPULATION_STATS.DAT',
    type: 'file',
    content: `TOTAL POPULATION: 1,000\n- Active: 880\n- Cryo: 120\n\nGENETIC DIVERSITY: CRITICAL\nWe are essentially cloning clones of clones.`
  },
  goat_results: {
    id: 'goat_results',
    name: 'GOAT_ASSIGNMENTS.TXT',
    type: 'file',
    content: `CLASS OF 2275:\n\n- Johnson, T. > Waste Recycler.\n- Miller, S. > Security.\n- Vance, A. > Archives (Obsessed with pre-war maps).`
  },
  contraband_list: {
    id: 'contraband_list',
    name: 'CONFISCATED_ITEMS.LOG',
    type: 'file',
    content: `1. "Grognak the Barbarian" Comic (Issue #4)\nReason: Depicts surface violence as "heroic."\n\n2. Home-made Radio Receiver\nReason: Unauthorized frequency scanning.\n\n3. "The Sky Book"\nReason: Child's drawing of the sun. Deemed destabilizing.`
  },
  engineering: {
    id: 'engineering',
    name: 'ENGINEERING DEPT',
    type: 'folder',
    children: ['reactor_status', 'water_chip', 'maintenance_schedule']
  },
  reactor_status: {
    id: 'reactor_status',
    name: 'REACTOR_DIAGNOSTICS.LOG',
    type: 'file',
    content: `SYSTEM: General Atomics V-Series\nSTATUS: ONLINE (DEGRADED)\n\nTHE VIBRATION:\nThe primary turbine has a wobble. We call it "The Heartbeat." If we shut it down, the Executives die.`
  },
  water_chip: {
    id: 'water_chip',
    name: 'WATER_PURIFICATION.SYS',
    type: 'file',
    content: `COMPONENT: Water Chip (Model 2077-B)\nSTATUS: FUNCTIONAL\n\nWe are using the last spare. If this chip breaks, we have to open the door.`
  },
  maintenance_schedule: {
    id: 'maintenance_schedule',
    name: 'MAINTENANCE_ROTA.XLS',
    type: 'file',
    content: `ROTA:\n\n- Level 1 (Admin): Daily\n- Level 4 (Reactor): Hourly\n- Level 5 (Geo-Thermal): WEEKLY ONLY (Too hot for extended shifts)`
  },
  medical: {
    id: 'medical',
    name: 'MEDICAL DATABASE',
    type: 'folder',
    children: ['psych_profiles', 'patient_zero', 'supply_manifest']
  },
  psych_profiles: {
    id: 'psych_profiles',
    name: 'PSYCH_PROFILES_VAULT_FEVER.DB',
    type: 'file',
    content: `DATABASE: PSYCHOLOGICAL TRACKING\nCONDITION: "VAULT FEVER" (Acute Claustrophobia)\n\nSTATS:\n- Mild Symptoms: 34% of Pop.\n- Acute Symptoms: 12% of Pop.\n\nNOTEABLE CASES:\n\nCASE 102 (Officer Miller): Found clawing at the blast door paint. Sedated.\n\nCASE 89 (Engineer Wu): Claims the humming of the reactor is a "voice." Recommended for audio isolation.\n\nANALYSIS: The human mind was not designed for 200 years of concrete walls. The "Reclamationist" movement is a symptom of mass panic, not logic.`
  },
  patient_zero: {
    id: 'patient_zero',
    name: 'CASE_STUDY_GREY_DRIFT.DOC',
    type: 'file',
    content: `SEE EMAIL MSG_003 FOR SUMMARY.`
  },
  supply_manifest: {
    id: 'supply_manifest',
    name: 'MED_SUPPLY.LOG',
    type: 'file',
    content: `STIMPAKS: 45 (CRITICAL)\nRAD-X: 200\nRADAWAY: 50\nMENTATS: 0 (Banned by Overseer)\n\nNOTE: We are synthesizing Stimpaks from fungal extract. Efficacy is 60% of pre-war standard.`
  },
  classified: {
    id: 'classified',
    name: 'RESTRICTED AREA',
    type: 'folder',
    locked: true,
    children: ['executive_manifest', 'wakeup_protocol', 'overseer_journal']
  },
  executive_manifest: {
    id: 'executive_manifest',
    name: 'EXECUTIVE_BOARD_LIST.ENC',
    type: 'file',
    content: `*** EYES ONLY ***\n\nCRYO-POD 001: Frederick Langston (Board Member)\nCRYO-POD 002: Leonard Vance (CEO)\nCRYO-POD 120: S. Calvin\n\nNOTE: Pod 089 is showing fluctuating power levels. The occupant may be suffering from "Freezer Burn" (Neural decay).`
  },
  wakeup_protocol: {
    id: 'wakeup_protocol',
    name: 'RECLAMATION_DAY.EXE',
    type: 'file',
    content: `PROTOCOL 77-RECLAIM\n\nStep 1: Unseal Blast Doors.\nStep 2: Establish perimeter.\nStep 3: Initiate Thaw Cycle (12 Hours).\n\nWARNING: We have never tested the thawing process. Pre-war estimates suggested a 15% lethality rate.`
  },
  overseer_journal: {
    id: 'overseer_journal',
    name: 'OVERSEER_PRIVATE.LOG',
    type: 'file',
    content: `They look to me for hope. I have none.\n\nThe sensors show radiation spikes. The radio picks up signals I can't decode. The reactor is shaking the floorboards.\n\nMy grandfather told me the surface was a graveyard. But the sensors say it's alive. And if it's alive, it's had 200 years to get strong.`
  }
};

// --- COMPONENTS ---

const CRTOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
    {/* Scanlines - darker and tighter for v3.0 */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,3px_100%]"></div>
    {/* Subtle Flicker */}
    <div className="absolute inset-0 bg-white opacity-[0.015] animate-flicker"></div>
    {/* Vignette / Screen Burn */}
    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_50%,rgba(0,0,0,0.7)_100%)]"></div>
    {/* Tube Curve Effect (Pseudo) */}
    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]"></div>
  </div>
);

const BootSequence = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const endRef = useRef(null);
  const bootText = [
    "ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL",
    "COPYRIGHT 2075-2077 ROBCO INDUSTRIES",
    "-SERVER B-",
    "> BIOS CHECK... OK",
    "> LOADING KERNEL... OK",
    "> CHECKING MEMORY... 64KB OK",
    "> MOUNTING VOLUMES... OK",
    "> LOADING MAP MODULE V3.0... INSTALLED",
    "> LOADING MEDICAL DB... INSTALLED",
    "> CONNECTING TO VAULT 254 LOCAL... ESTABLISHED",
    "> INITIALIZING GRAPHICAL INTERFACE...",
    "WELCOME, OVERSEER."
  ];

  useEffect(() => {
    let delay = 0;
    bootText.forEach((line, index) => {
      delay += Math.random() * 200 + 50;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        endRef.current?.scrollIntoView({ behavior: "smooth" });
        if (index === bootText.length - 1) {
          setTimeout(onComplete, 1200);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="flex flex-col h-full justify-start items-start p-4 md:p-8 font-mono text-green-500 text-sm md:text-xl leading-relaxed overflow-y-auto">
      {lines.map((line, i) => (
        <div key={i} className="animate-pulse-fast">{line}</div>
      ))}
      <div ref={endRef} />
      <div className="animate-blink bg-green-500 h-4 w-2 md:h-6 md:w-3 mt-2 inline-block"></div>
    </div>
  );
};

const WindowHeader = ({ icon: Icon, title, onClose }) => (
  <div className="bg-green-900/40 p-2 md:p-3 border-b border-green-700 flex justify-between items-center touch-none shrink-0">
    <div className="flex items-center gap-2 text-green-400 font-bold text-sm md:text-base">
      <Icon size={18} />
      <span>{title}</span>
    </div>
    <button onClick={onClose} className="text-green-500 hover:text-green-200 p-1 md:p-0 active:bg-green-800 rounded" aria-label="Close">
      <X size={20} />
    </button>
  </div>
);

// --- TERMINAL APP ---
const TerminalApp = ({ onClose }) => {
  const [path, setPath] = useState(['root']);
  const [viewingFile, setViewingFile] = useState(null);
  const [unlocked, setUnlocked] = useState([]);
  const [unlockInput, setUnlockInput] = useState('');
  const [unlockTarget, setUnlockTarget] = useState(null);

  const currentFolder = FILE_SYSTEM[path[path.length - 1]];

  const handleNavigate = (id) => {
    const item = FILE_SYSTEM[id];
    if (item.type === 'file') {
      setViewingFile(id);
    } else {
      if (item.locked && !unlocked.includes(id)) {
        setUnlockTarget(id);
      } else {
        setPath([...path, id]);
      }
    }
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (unlockInput.toUpperCase() === 'ADMIN_KEY') {
      setUnlocked([...unlocked, unlockTarget]);
      setPath([...path, unlockTarget]);
      setUnlockTarget(null);
      setUnlockInput('');
    } else {
      setUnlockInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border-2 border-green-700 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
      <WindowHeader icon={Terminal} title="ROBCO FILE EXPLORER" onClose={onClose} />
      <div className="flex-1 p-2 md:p-4 overflow-hidden flex flex-col relative">
        {unlockTarget ? (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in p-4 text-center">
            <Lock size={48} className="text-red-500 mb-4 animate-pulse" />
            <h3 className="text-red-500 font-bold text-lg md:text-xl mb-4">SECURITY CLEARANCE REQUIRED</h3>
            <form onSubmit={handleUnlock} className="flex flex-col gap-3 w-full max-w-xs">
              <input
                autoFocus
                type="text"
                value={unlockInput}
                onChange={e => setUnlockInput(e.target.value)}
                className="bg-black border border-green-500 text-green-500 p-3 text-center focus:outline-none uppercase text-lg"
                placeholder="ENTER PASSWORD"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setUnlockTarget(null)} className="flex-1 border border-green-800 text-green-800 p-3">CANCEL</button>
                <button type="submit" className="flex-1 bg-green-900 text-green-100 p-3 font-bold">AUTH</button>
              </div>
            </form>
          </div>
        ) : viewingFile ? (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="flex justify-between items-center mb-2 md:mb-4 border-b border-green-800 pb-2 shrink-0">
              <span className="text-green-300 font-bold uppercase truncate pr-2 text-sm md:text-base">{FILE_SYSTEM[viewingFile].name}</span>
              <button onClick={() => setViewingFile(null)} className="text-xs border border-green-500 px-3 py-1 active:bg-green-900">CLOSE</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
              <pre className="whitespace-pre-wrap font-mono text-green-400 text-xs md:text-sm leading-relaxed">
                {FILE_SYSTEM[viewingFile].content}
              </pre>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2 md:mb-4 text-xs text-green-600 border-b border-green-900 pb-2 overflow-x-auto whitespace-nowrap shrink-0">
              {path.length > 1 && (
                <button onClick={() => setPath(path.slice(0, -1))} className="hover:text-green-400 flex items-center p-1">
                  <ArrowLeft size={14} /> UP
                </button>
              )}
              {path.map(id => ` / ${FILE_SYSTEM[id].name}`)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar pb-8">
              {currentFolder.children.map(childId => {
                const child = FILE_SYSTEM[childId];
                const isLocked = child.locked && !unlocked.includes(childId);
                return (
                  <button
                    key={childId}
                    onClick={() => handleNavigate(childId)}
                    className={`flex items-start gap-3 p-3 md:p-4 border transition-all text-left active:bg-green-900/40 
                      ${isLocked ? 'border-red-900/50 hover:border-red-500' : 'border-green-900 hover:border-green-400 hover:bg-green-900/20'}
                    `}
                  >
                    {child.type === 'folder' 
                      ? (isLocked ? <Lock className="text-red-500 mt-1 min-w-[20px]" size={20}/> : <Folder className="text-yellow-500 mt-1 min-w-[20px]" size={20}/>) 
                      : <FileText className="text-blue-400 mt-1 min-w-[20px]" size={20}/> 
                    }
                    <div className="overflow-hidden">
                      <div className={`font-bold text-sm truncate ${isLocked ? 'text-red-400' : 'text-green-300'}`}>{child.name}</div>
                      <div className="text-[10px] text-green-700">{child.type === 'folder' ? 'DIR' : 'FILE'}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- MAIL APP ---
const MailApp = ({ onClose }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div className="flex flex-col h-full bg-black border-2 border-green-700 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
      <WindowHeader icon={Mail} title="FLASHMAIL v1.0" onClose={onClose} />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className={`w-full md:w-1/3 border-b md:border-b-0 md:border-r border-green-800 overflow-y-auto custom-scrollbar ${selected ? 'hidden md:block' : 'block'}`}>
          {EMAILS.map(email => (
            <button key={email.id} onClick={() => setSelected(email)} className={`w-full text-left p-3 md:p-4 border-b border-green-900 active:bg-green-900/30 transition-colors ${selected?.id === email.id ? 'bg-green-900/50' : ''}`}>
              <div className="font-bold text-green-300 text-xs md:text-sm truncate">{email.from}</div>
              <div className="text-green-500 text-xs md:text-sm truncate">{email.subject}</div>
              <div className="text-green-700 text-[10px] mt-1 text-right">{email.date}</div>
            </button>
          ))}
        </div>
        <div className={`flex-1 p-4 overflow-y-auto bg-black custom-scrollbar ${!selected ? 'hidden md:block' : 'block'}`}>
          {selected ? (
            <div className="animate-fade-in pb-10">
              <button onClick={() => setSelected(null)} className="md:hidden mb-4 text-xs flex items-center gap-1 text-green-600 border border-green-800 px-2 py-1 rounded">
                <ArrowLeft size={12}/> BACK TO INBOX
              </button>
              <div className="border-b border-green-800 pb-4 mb-4">
                <div className="text-green-600 text-xs">FROM: <span className="text-green-300">{selected.from}</span></div>
                <div className="text-green-600 text-xs">TO: <span className="text-green-300">{selected.to}</span></div>
                <div className="text-green-600 text-xs">DATE: <span className="text-green-300">{selected.date}</span></div>
                <div className="text-base md:text-xl font-bold text-green-400 mt-2">{selected.subject}</div>
              </div>
              <div className="text-green-400 whitespace-pre-wrap font-mono leading-relaxed text-sm md:text-base">{selected.body}</div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-green-800 text-sm">SELECT MESSAGE</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAP APP ---
const DiagnosticCard = ({ room, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-black border-2 border-green-500 p-4 max-w-sm w-full shadow-[0_0_30px_rgba(0,255,0,0.15)] animate-fade-in">
        <div className="flex justify-between items-center mb-4 border-b border-green-800 pb-2">
          <h3 className="text-green-400 font-bold uppercase flex items-center gap-2">
            <Activity size={16}/> {room.name} DIAGNOSTICS
          </h3>
          <button onClick={onClose}><X size={16} className="text-green-600 hover:text-green-300"/></button>
        </div>
        
        {room.type === 'reactor' && (
          <div className="space-y-3 font-mono text-sm text-green-300">
             <div className="flex justify-between"><span>OUTPUT:</span> <span className="animate-pulse">98.4%</span></div>
             <div className="flex justify-between"><span>CORE TEMP:</span> <span className="text-yellow-500">4800K (HIGH)</span></div>
             <div className="flex justify-between"><span>TURBINE VIB:</span> <span className="text-red-500 animate-blink">CRITICAL</span></div>
             <div className="h-20 bg-green-900/20 border border-green-800 mt-2 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end">
                   {[...Array(20)].map((_,i) => (
                     <div key={i} className="flex-1 bg-green-500 mx-[1px]" style={{height: `${Math.random() * 60 + 20}%`, opacity: 0.5}}></div>
                   ))}
                </div>
                <div className="absolute top-1 left-1 text-[10px] text-green-600">HARMONIC RESONANCE</div>
             </div>
             <div className="text-[10px] text-green-600 mt-2">SHIFT LOG: Engineer Wu reports audible humming from coolant pipes.</div>
          </div>
        )}

        {room.type === 'cryo' && (
          <div className="space-y-3 font-mono text-sm text-green-300">
             <div className="flex justify-between"><span>ACTIVE PODS:</span> <span>120/120</span></div>
             <div className="flex justify-between"><span>POWER DRAW:</span> <span>1.2 MW</span></div>
             <div className="flex justify-between"><span>STABILITY:</span> <span className="text-green-500">99.2%</span></div>
             <div className="border border-green-800 p-2 mt-2 bg-green-900/10">
                <div className="text-[10px] text-green-600 mb-1">POD 089 VITALS</div>
                <div className="w-full bg-black h-1 mb-1"><div className="bg-red-500 h-full w-[40%] animate-pulse"></div></div>
                <div className="text-[10px] text-red-400">WARNING: NEURAL DECAY DETECTED</div>
             </div>
          </div>
        )}

        {room.type === 'cafeteria' && (
          <div className="space-y-3 font-mono text-sm text-green-300">
             <div className="flex justify-between"><span>RATIONS:</span> <span>4200 UNITS</span></div>
             <div className="flex justify-between"><span>WATER:</span> <span>RECYCLED (96%)</span></div>
             <div className="border-t border-green-800 pt-2 mt-2">
                <div className="text-[10px] text-green-600">TODAY'S MENU:</div>
                <div>- Algae Paste (Spicy)</div>
                <div>- Reconstituted Soy</div>
                <div>- "Coffee" (Chicory)</div>
             </div>
             <div className="text-[10px] text-yellow-600 mt-2">LOG: Mr. Handy Unit 38 removed for repairs.</div>
          </div>
        )}

        {room.type === 'comms' && (
          <div className="space-y-3 font-mono text-sm text-green-300">
             <div className="flex justify-between"><span>STATUS:</span> <span className="text-yellow-500">RECEIVING</span></div>
             <div className="flex justify-between"><span>SOURCE:</span> <span>UNKNOWN (EXT.)</span></div>
             
             <div className="border border-green-800 p-2 mt-2 bg-black relative h-32 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                   {[...Array(30)].map((_,i) => (
                      <div key={i} className="w-1 bg-green-400 animate-pulse" 
                           style={{
                             height: `${Math.random() * 100}%`, 
                             animationDuration: `${Math.random() * 0.5 + 0.2}s`
                           }}>
                      </div>
                   ))}
                </div>
                <div className="absolute top-2 left-2 text-[10px] bg-black/50 px-1">SPECTRAL ANALYSIS</div>
                <div className="absolute bottom-2 right-2 text-[10px] text-red-500 font-bold animate-blink">GHOST SIGNAL DETECTED</div>
             </div>
             
             <div className="text-[10px] text-green-600 mt-2">
               AUDIO FRAGMENT RECOVERED: "...glory...old...flag..."
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

const MapRoom = ({ name, restricted, status, size = "normal", type, onClick }) => (
  <button 
    onClick={onClick}
    disabled={!type}
    className={`
      border-2 p-2 relative group overflow-hidden transition-all min-h-[60px] flex flex-col justify-between text-left
      ${size === 'large' ? 'col-span-2' : 'col-span-1'}
      ${restricted 
        ? 'border-red-900/50 bg-red-900/5 hover:bg-red-900/20' 
        : type 
          ? 'border-green-600 bg-green-900/20 hover:bg-green-800/40 hover:scale-[1.02] cursor-pointer' 
          : 'border-green-800/50 bg-green-900/5 cursor-default'
      }
    `}
  >
    <div className={`text-[10px] md:text-xs font-bold flex justify-between w-full ${restricted ? 'text-red-500' : type ? 'text-green-300 group-hover:text-white' : 'text-green-500'}`}>
      {name}
      {type && <Search size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
    </div>
    <div className="text-[8px] md:text-[10px] text-green-700 font-mono flex items-center gap-1">
      <div className={`w-1 h-1 rounded-full ${restricted ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
      {status}
    </div>
  </button>
);

const MapLevel = ({ depth, name, children }) => (
  <div className="flex gap-4 relative pl-8 pb-8">
    <div className="absolute left-0 top-0 bottom-0 w-4 border-r-2 border-dashed border-green-800 flex flex-col items-center py-2">
      <div className="w-2 h-2 bg-green-800 rounded-full mb-2"></div>
      <span className="text-[8px] text-green-800 -rotate-90 whitespace-nowrap mt-8 origin-center">{depth}</span>
    </div>
    <div className="flex-1">
      <h3 className="text-xs font-bold text-green-600 mb-2 border-b border-green-900 inline-block px-2">{name}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {children}
      </div>
    </div>
  </div>
);

const MapApp = ({ onClose }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="flex flex-col h-full bg-black border-2 border-green-700 shadow-[0_0_20px_rgba(0,255,0,0.2)] relative">
      <WindowHeader icon={MapIcon} title="VAULT ARCHITECT 3.0" onClose={onClose} />
      
      {selectedRoom && <DiagnosticCard room={selectedRoom} onClose={() => setSelectedRoom(null)} />}

      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        
        {/* Surface */}
        <div className="mb-4 text-center">
          <div className="inline-block border border-yellow-800 text-yellow-700 px-4 py-1 text-xs mb-2">SURFACE // ZONE RED</div>
          <div className="h-8 w-px bg-green-800 mx-auto"></div>
          <div className="w-32 h-4 border-t-2 border-x-2 border-green-600 mx-auto rounded-t-lg bg-green-900/20"></div>
        </div>

        {/* Level 1 */}
        <MapLevel depth="L1 -50m" name="ADMINISTRATION">
          <MapRoom name="ENTRANCE" status="SEALED" size="large" />
          <MapRoom name="SECURITY" status="ACTIVE" />
          <MapRoom name="COMMS" status="SIGNAL DETECTED" type="comms" onClick={() => setSelectedRoom({name: 'COMMS', type: 'comms'})} />
        </MapLevel>

        {/* Level 2 */}
        <MapLevel depth="L2 -100m" name="HABITATION">
          <MapRoom name="RESIDENTIAL A" status="98% CAP" size="large" />
          <MapRoom name="RESIDENTIAL B" status="100% CAP" size="large" />
          <MapRoom name="CAFETERIA" status="OPEN" type="cafeteria" onClick={() => setSelectedRoom({name: 'CAFETERIA', type: 'cafeteria'})} />
          <MapRoom name="ATRIUM" status="LIGHTS ON" />
        </MapLevel>

        {/* Level 3 */}
        <MapLevel depth="L3 -200m" name="OPERATIONS">
          <MapRoom name="HYDROPONICS" status="YIELD LOW" />
          <MapRoom name="MEDICAL" status="ACTIVE" />
          <MapRoom name="WATER PURIFICATION" status="OPTIMAL" size="large" />
        </MapLevel>

        {/* Level 4 */}
        <MapLevel depth="L4 -400m" name="RESTRICTED">
          <MapRoom name="REACTOR" status="98.4%" type="reactor" onClick={() => setSelectedRoom({name: 'REACTOR', type: 'reactor'})} />
          <MapRoom name="ENGINEERING" status="ACTIVE" />
          <MapRoom name="CRYO-BAY" status="STASIS LOCK" restricted size="large" type="cryo" onClick={() => setSelectedRoom({name: 'CRYO-BAY', type: 'cryo'})} />
        </MapLevel>

        {/* Level 5 (New) */}
        <MapLevel depth="L5 -650m" name="GEOTHERMAL & STORAGE">
           <MapRoom name="DEEP STORAGE" status="LOCKED" size="large" />
           <MapRoom name="GEO-PUMPS" status="HIGH TEMP" />
           <MapRoom name="AUXILIARY" status="OFFLINE" />
        </MapLevel>

      </div>
      <div className="p-2 border-t border-green-800 text-[10px] text-green-600 flex justify-between px-4 shrink-0 bg-black">
        <span>INTEGRITY: 100%</span>
        <span>SEALED: 198 YEARS</span>
      </div>
    </div>
  );
};


// --- STATUS APP ---
const StatusApp = ({ onClose }) => (
  <div className="flex flex-col h-full bg-black border-2 border-green-700 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
    <WindowHeader icon={Activity} title="SYSTEM MONITOR" onClose={onClose} />
    <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-10">

      {/* Reactor */}
      <div className="border border-green-600 p-3 md:p-4 bg-green-900/5">
        <h3 className="text-green-300 font-bold mb-4 flex items-center gap-2 text-sm md:text-base"><Cpu size={16}/> REACTOR OUTPUT</h3>
        <div className="h-4 w-full bg-green-900/50 mb-1">
          <div className="h-full bg-green-500 w-[98%] animate-pulse"></div>
        </div>
        <div className="text-right text-xs text-green-400">98.4% NOMINAL</div>
        
        <div className="mt-4 space-y-2">
           <div className="flex justify-between text-xs text-green-600"><span>COOLANT PUMP A</span> <span>OK</span></div>
           <div className="flex justify-between text-xs text-green-600"><span>COOLANT PUMP B</span> <span className="text-yellow-500 animate-blink">VIBRATION</span></div>
           <div className="flex justify-between text-xs text-green-600"><span>TURBINE</span> <span>OK</span></div>
        </div>
      </div>

      {/* Life Support */}
      <div className="border border-green-600 p-3 md:p-4 bg-green-900/5">
        <h3 className="text-green-300 font-bold mb-4 flex items-center gap-2 text-sm md:text-base"><Users size={16}/> LIFE SUPPORT</h3>
        <div className="flex justify-between items-end h-16 md:h-20 gap-2 mb-2">
           <div className="w-1/4 bg-green-900/30 h-full relative"><div className="absolute bottom-0 w-full bg-green-500 h-[80%]"></div></div>
           <div className="w-1/4 bg-green-900/30 h-full relative"><div className="absolute bottom-0 w-full bg-green-500 h-[82%]"></div></div>
           <div className="w-1/4 bg-green-900/30 h-full relative"><div className="absolute bottom-0 w-full bg-green-500 h-[79%]"></div></div>
           <div className="w-1/4 bg-green-900/30 h-full relative"><div className="absolute bottom-0 w-full bg-green-500 h-[81%]"></div></div>
        </div>
        <div className="text-center text-xs text-green-400">O2 LEVELS STABLE</div>
      </div>

      {/* Sensors with Seismic Graph */}
      <div className="border border-red-900 p-3 md:p-4 col-span-1 md:col-span-2 bg-red-900/10">
        <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2 text-sm md:text-base"><Radio size={16}/> SURFACE SENSORS</h3>
        
        {/* New Seismic Visual */}
        <div className="mb-4 h-16 border-b border-red-900/50 flex items-end gap-[2px] overflow-hidden opacity-80">
           {[...Array(60)].map((_, i) => (
             <div 
               key={i} 
               className="flex-1 bg-red-500" 
               style={{
                 height: `${Math.random() * 20 + 5}%`,
                 animation: `pulse-fast ${Math.random() + 0.5}s infinite`
               }}
              ></div>
           ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
           <div className="p-2 border border-green-800 text-green-600">SEISMIC<br/><span className="text-yellow-500 animate-pulse">ACTIVITY</span></div>
           <div className="p-2 border border-green-800 text-green-600">AUDIO<br/><span className="text-green-400">STATIC</span></div>
           <div className="p-2 border border-green-800 text-green-600">THERMAL<br/><span className="text-green-400">NORMAL</span></div>
           <div className="p-2 border border-red-800 text-red-500 animate-pulse">RADS<br/>HIGH</div>
        </div>
        <div className="mt-2 text-[10px] text-red-400 font-mono">
           ALERT: Unidentified high-frequency signal detected on Channel 9.
        </div>
      </div>

    </div>
  </div>
);

const DesktopIcon = ({ label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-2 md:p-4 rounded hover:bg-green-900/20 active:bg-green-900/40 group w-20 md:w-24 transition-all"
  >
    <div className="text-green-500 group-hover:text-green-300 group-hover:scale-110 transition-transform bg-black/50 p-2 rounded-lg border border-transparent group-hover:border-green-500/30">
      <Icon size={32} md={40} strokeWidth={1.5} className="w-8 h-8 md:w-10 md:h-10" />
    </div>
    <span className="text-[10px] md:text-xs font-bold text-green-600 group-hover:text-green-400 bg-black/70 px-2 py-1 rounded w-full text-center truncate border border-transparent group-hover:border-green-800">
      {label}
    </span>
  </button>
);

const MainInterface = () => {
  const [activeApp, setActiveApp] = useState(null); 
  const [showNote, setShowNote] = useState(false);

  return (
    <div className="h-full flex flex-col relative">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-40 h-40 md:w-64 md:h-64 border-4 border-green-500 rounded-full flex items-center justify-center">
          <div className="text-6xl md:text-9xl font-bold text-green-500 tracking-tighter">V</div>
        </div>
      </div>

      {/* Desktop Area */}
      <div className="flex-1 p-4 md:p-6 flex content-start flex-wrap gap-2 md:gap-4 relative z-10 overflow-y-auto">
        <DesktopIcon label="TERMINAL" icon={Terminal} onClick={() => setActiveApp('terminal')} />
        <DesktopIcon label="MAIL" icon={Mail} onClick={() => setActiveApp('mail')} />
        <DesktopIcon label="MAPS v3" icon={MapIcon} onClick={() => setActiveApp('map')} />
        <DesktopIcon label="STATUS" icon={Activity} onClick={() => setActiveApp('status')} />

        {/* Sticky Note */}
        <div 
          onClick={() => setShowNote(!showNote)}
          className={`
            absolute bottom-12 right-4 md:bottom-10 md:right-10
            bg-[#fef9c3] text-black p-3 md:p-4 w-40 md:w-48
            rotate-2 shadow-lg cursor-pointer transition-all duration-300
            ${showNote ? 'scale-110 z-50 rotate-0 opacity-100' : 'opacity-80 hover:opacity-100 hover:scale-105'}
          `}
        >
          <div className="text-[10px] border-b border-black/20 mb-1 pb-1 font-bold flex justify-between">
            <span>REMINDER</span>
            {showNote && <X size={12}/>}
          </div>
          <div className="font-handwriting text-xs leading-relaxed select-none">
            Don't forget the Override Key: <br/>
            <span className="font-mono bg-black/10 px-1 mt-1 inline-block font-bold">ADMIN_KEY</span>
            <br/><br/>
            - Drake
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div className="h-10 md:h-12 border-t-2 border-green-700 bg-green-900/20 flex items-center px-2 md:px-4 justify-between z-20 shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <button className="bg-green-700 text-black px-3 py-1 font-bold text-xs hover:bg-green-500 flex items-center gap-1">
             <Menu size={12} className="hidden md:block"/> START
          </button>
          <div className="h-6 w-px bg-green-800"></div>
          {activeApp && (
            <div className="px-3 py-1 bg-green-900/40 border border-green-600 text-green-300 text-[10px] md:text-xs font-bold uppercase shadow-[0_0_10px_rgba(74,222,128,0.2)] truncate max-w-[100px] md:max-w-none">
              {activeApp}
            </div>
          )}
        </div>
        <div className="text-[10px] md:text-xs text-green-600 font-mono flex items-center gap-2">
          <span className="hidden md:inline">VAULT 254 // ONLINE //</span> {CURRENT_DATE}
        </div>
      </div>

      {/* Modal Windows */}
      {activeApp && (
        <div className="absolute inset-0 md:inset-10 z-40 p-2 md:p-0 bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none animate-fade-in">
          {activeApp === 'terminal' && <TerminalApp onClose={() => setActiveApp(null)} />}
          {activeApp === 'mail' && <MailApp onClose={() => setActiveApp(null)} />}
          {activeApp === 'map' && <MapApp onClose={() => setActiveApp(null)} />}
          {activeApp === 'status' && <StatusApp onClose={() => setActiveApp(null)} />}
        </div>
      )}

    </div>
  );
};

export default function App() {
  const [booted, setBooted] = useState(false);
  const [crtOn, setCrtOn] = useState(false);

  useEffect(() => {
    setTimeout(() => setCrtOn(true), 100);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono overflow-hidden selection:bg-green-500 selection:text-black cursor-default touch-manipulation">
      
      {/* CRT Visual Layer */}
      <CRTOverlay />

      <div className={`h-full w-full p-2 md:p-8 transition-all duration-300 ${crtOn ? 'opacity-100' : 'opacity-0'}`}>
        {/* Monitor Frame */}
        <div className="h-full w-full border-[2px] md:border-[16px] border-[#1a1a1a] rounded-lg md:rounded-3xl bg-[#0a0a0a] relative shadow-[0_0_0_2px_#333,0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col box-border">
          
          {/* Screen Glass Reflection (Desktop Only) */}
          <div className="hidden md:block absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/5 to-transparent rounded-tr-xl pointer-events-none z-40"></div>
          
          {/* Screen Content */}
          <div className="flex-1 overflow-hidden bg-black text-shadow-glow relative z-10">
            {!booted ? (
              <BootSequence onComplete={() => setBooted(true)} />
            ) : (
              <MainInterface />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}