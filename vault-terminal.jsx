import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Shield, Users, AlertTriangle, Lock, 
  ArrowLeft, Folder, FileText, X, Mail, Map as MapIcon, 
  Activity, Cpu, Radio, Crosshair, Menu, Zap, Fingerprint, Eye,
  Skull, FileWarning, Search
} from 'lucide-react';

/* --------------------------------------------------------------------------------
   LORE DATABASE: VAULT 254 (ISOLATIONIST EDITION - 2275)
   -------------------------------------------------------------------------------- */

const CURRENT_DATE = "23.10.2275";

const EMAILS = [
  {
    id: 'msg_001',
    from: 'Caldwell, V. (Overseer)',
    to: 'Drake, R. (Security Chief)',
    subject: 'Simulation 55-C ("Rogue Army" Scenario)',
    date: '23.10.2275',
    body: `Roland,\n\nI reviewed the logs from the "Rogue US Army" simulation. \n\nIt is terrifying. We programmed the holographic enemies to use Pre-War T-51b tactics, assuming that if anyone survived up there, it would be the military. The result? Our 10mm rounds bounced off their plating. Our T-45d suits—our heaviest assets—were outmaneuvered by the theoretical T-51b algorithms.\n\nWe have to assume that if we open that door, we might face technology equal to or greater than our own. We aren't the only ones Vault-Tec gave toys to. \n\nKeep this quiet. If the Reclamationists find out we lost a theoretical war in 12 minutes, they'll just demand we wake the Executives to "authorize heavier weapons" we don't even have.\n\n- V.C.`
  },
  {
    id: 'msg_002',
    from: 'Volkova, N. (Chief Eng)',
    to: 'Maintenance Division',
    subject: 'Mr. Handy Unit 38 ("Barnaby") Decommission',
    date: '22.10.2275',
    body: `It is with regret that I am pulling Unit 38 ("Barnaby") from the cafeteria rotation. \n\nAfter 198 years of continuous operation without a factory reset, his personality matrix has fragmented. Yesterday he attempted to serve "Radiation Soup" by trying to ladle water directly from the reactor coolant line. \n\nWe cannot wipe him; we lost the RobCo factory software in the '50s. We can only salvage him for parts. \n\nThis leaves us with 99 operational Handies. Please treat your robotic assistants with care. They are dying, just like the reactor pumps.\n\n- Natasha`
  },
  {
    id: 'msg_003',
    from: 'Dr. Morrison (Chief Medical)',
    to: 'Caldwell, V. (Overseer)',
    subject: 'Case Study: The "Grey Drift"',
    date: '20.10.2275',
    body: `Vincent,\n\nThe "Grey Drift" isn't just a slang term anymore. I have a clinical case.\n\nSubject: Child 44-A (Born 2270).\nSymptoms: Extreme lethargy, photosensitivity, and a depressed immune response to standard fungal spores. \n\nIt's the genetic bottleneck. We are 198 years deep in a closed loop. We are essentially cloning clones of clones at this point. The DNA is unraveling.\n\nIf we do not introduce external genetic material within one generation, we risk a cascade failure of the population's viability. I don't care if the surface is inhabited by monsters; we need their blood.\n\n- James`
  },
  {
    id: 'msg_004',
    from: 'Torres, M. (Reclamationist)',
    to: 'Council_All',
    subject: 'The Unknown Signal',
    date: '18.10.2275',
    body: `I was in the comms room during the seismic event yesterday. I heard it. \n\nThrough the static, for three seconds: Music. American marching music. And a voice. It sounded like... a President? Or a General? \n\nAshford claims it's a "Ghost Signal"—a pre-war automated loop bouncing off the ionosphere. But it sounded crisp. It sounded NEW. \n\nSomeone is rebuilding America up there, and we are hiding in a hole growing fungus. We are missing our purpose.\n\n- Michaela`
  }
];

const FILE_SYSTEM = {
  root: {
    id: 'root',
    name: 'MAIN DRIVE',
    type: 'folder',
    children: ['mission', 'military', 'admin', 'engineering', 'classified']
  },
  
  // --- MISSION ---
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
    content: `SUBJECT: The A.R.C. (Vault 254)\nCLASSIFICATION: V-TEC EYES ONLY\n\nThe Administrative Reclamation Command is a CONTROL VAULT designed to preserve the corporate hierarchy of Vault-Tec.\n\nCORE MANDATE:\n1. SURVIVE the nuclear exchange.\n2. WAIT for the "Great Silence" (estimated 20 years post-war).\n3. AWAKEN the 120 Executives.\n4. RESTRUCTURE the United States under corporate governance.\n\nCURRENT STATUS: CRITICAL FAILURE OF STEP 2.\nThe "Great Silence" never occurred. Atmospheric sensors indicate chaotic weather patterns and intermittent high-band radio activity. The surface is not silent; it is screaming. We simply do not know why.`
  },
  langston_memo: {
    id: 'langston_memo',
    name: 'LANGSTON_MEMO.LOG',
    type: 'file',
    content: `FROM: Frederick Langston, Board of Directors\nDATE: August 14, 2076\n\n"We are the architects of the future."\n\nLet the politicians in Washington burn. Let the generals play with their toys until they break them. When the smoke clears, the world will need Management. It will need Structure. It will need Us.\n\nWe will sleep through the chaos. And when we wake, we will not be rebuilding a democracy. We will be building a Department.`
  },
  timeline_events: {
    id: 'timeline_events',
    name: 'HISTORY_LOG.DAT',
    type: 'file',
    content: `[2077.10.23] The Great Seal. 120 Executives frozen. 369 Staff active.\n[2102.05.20] Overseer Caldwell I cancels opening. "Atmosphere toxic."\n[2180.11.02] The "Deep Tremor." A massive seismic event shakes the vault. Believed to be a secondary nuclear detonation nearby, or a massive structural collapse on the surface.\n[2245.03.15] The "Static Age" begins. Comms pick up increased encrypted chatter. We cannot decipher it.\n[2275.10.23] PRESENT DAY. 198 Years of Silence.`
  },

  // --- MILITARY ---
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
    content: `COMMANDER: Chief Roland Drake\n\nACTIVE FORCE: 120 Personnel\n\nPLATOON ALPHA ("The Wall")\n- Duty: The Great Door\n- Mental State: High paranoia. They stare at the blast door monitors 24/7 waiting for a knock that never comes.\n\nPLATOON BETA ("The Watch")\n- Duty: Internal Order\n- Mental State: Strained. Policing your own cousins and neighbors creates friction.\n\nPLATOON GAMMA ("The Reserve")\n- Duty: Maintenance & Training\n- Mental State: Boredom. Most "accidental discharges" happen in Gamma.`
  },
  arsenal_count: {
    id: 'arsenal_count',
    name: 'ARMORY_INVENTORY.TXT',
    type: 'file',
    content: `WARNING: NON-REPLENISHABLE STOCKPILE\n\nSMALL ARMS:\n- 10mm Pistols (N99): 150 Units\n- R91 Assault Rifles: 200 Units (Wood stocks rotting, replaced with polymer scrap)\n\nHEAVY EQUIPMENT:\n- T-45d Power Armor: 20 Suits\n  > Operational: 18\n  > Servos Seized: 2\n  > Note: These suits are 200 years old. Rubber seals are cracking. Hydraulic fluid leaks are common.\n\nMISSING CAPABILITIES:\n- We have NO indirect fire support (Mortars/Howitzers).\n- We have NO air support.\n- We have NO anti-armor weaponry beyond limited grenades.`
  },
  death_spiral: {
    id: 'death_spiral',
    name: 'THREAT_ANALYSIS_DEATH_SPIRAL.DOC',
    type: 'file',
    content: `STRATEGIC ASSESSMENT: "THE DEATH SPIRAL"\n\nPREMISE: We engage a hostile surface force of unknown capability.\n\nTHE MATH:\nWe cannot build guns. We cannot build bullets (at scale). We cannot build armor.\n\nIf we win a battle but lose 10 Rifles and 2 Soldiers, we have permanently lost 5% of our combat power. \n\nIf the enemy is a "Scavenger Tribe," they can recruit more bodies. We cannot.\nIf the enemy is a "Technological Power," they can manufacture weapons. We cannot.\n\nCONCLUSION:\nVictory is mathematically impossible in a sustained conflict. Our only defense is obscurity. We must never be found.`
  },
  simulation_logs: {
    id: 'simulation_logs',
    name: 'WAR_GAME_RESULTS.LOG',
    type: 'file',
    content: `SIMULATION PARAMETERS: PRE-WAR DATA EXTRAPOLATION\n\nSCENARIO: "Communist Invasion Force"\nRESULT: DEFEAT. (Our T-45s overwhelmed by Hei Gui stealth suits).\n\nSCENARIO: "Civilian Riot (Class 5)"\nRESULT: VICTORY. (Tear gas and crowd control effective).\n\nSCENARIO: "Rogue US Army Remnant"\nRESULT: TOTAL DEFEAT in 14 minutes.\nNOTE: The simulation assumes the Rogue Army possesses T-51b armor and Plasma weaponry (technology rumored to be in prototype phase in 2077). Our ballistic vests offered zero resistance.`
  },
  surface_threats: {
    id: 'surface_threats',
    name: 'SURFACE_SENSOR_LOGS.DAT',
    type: 'file',
    content: `SENSOR ARRAY (PASSIVE MODE ONLY)\n\n[2275.05.12] SEISMIC: Heavy rhythmic vibrations detected directly overhead. Pattern suggests bi-pedal movement but mass exceeds 2,000kg. \nTHEORY: Giant Fauna? Or heavy construction equipment? \n\n[2275.08.14] ACOUSTIC: High-pitch turbine whine detected. Moving fast. Doppler shift indicates supersonic flight.\nTHEORY: Pre-war aircraft? It sounded too clean to be a scavenger jury-rig. Who is flying jets 200 years later?\n\n[2275.10.01] RADIATION: Spike in background Rads. Wind patterns suggest a source from the D.C. Ruins. \nTHEORY: Did another bomb go off?`
  },

  // --- ADMIN ---
  admin: {
    id: 'admin',
    name: 'ADMINISTRATION',
    type: 'folder',
    children: ['factions', 'census', 'goat_results', 'contraband_list']
  },
  factions: {
    id: 'factions',
    name: 'POLITICAL_LANDSCAPE.DOC',
    type: 'file',
    content: `INTERNAL FACTION SUMMARY (2275)\n\n1. LOYALISTS (Overseer Caldwell)\n   Status Quo. They believe the vault is a Holy Sanctuary. To leave is to die.\n\n2. RECLAMATIONISTS (Torres)\n   They believe the Sensors are lying. They think the surface is safe and the Overseer is keeping us here to maintain power.\n\n3. PRESERVATIONISTS (Ashford)\n   They have evolved into a near-cult of safety. Some refuse to even look at photos of the surface, calling it "The Hellscape."\n\n4. INNOVATORS (Volkova)\n   Frustrated engineers. They are tearing apart non-essential walls just to get copper wire for their unauthorized projects.\n\n5. THE GUARDS (Drake)\n   They are restless. A standing army with no enemy eventually finds one within.`
  },
  census: {
    id: 'census',
    name: 'POPULATION_STATS.DAT',
    type: 'file',
    content: `TOTAL POPULATION: 1,000\n- Active: 880\n- Cryo: 120\n\nTHE "GREY DRIFT":\nMedical's slang for our genetic stagnation. We look too much alike. The gene pool is a puddle. \n\nPSYCHOLOGICAL PROFILE:\n- Depression Rate: 45%\n- "Vault Fever" (Claustrophobia): 12%\n- Agoraphobia (Fear of Outside): 85%\n\nMost residents are terrified of the concept of "The Sky." They ask if the blue light burns.`
  },
  goat_results: {
    id: 'goat_results',
    name: 'RECENT_GOAT_ASSIGNMENTS.TXT',
    type: 'file',
    content: `CLASS OF 2275 ASSIGNMENTS:\n\n- Johnson, T. -> Waste Recycler. (Note: Subject requested "Anything but the Reactor," cited fear of radiation leaks).\n\n- Miller, S. -> Security. (Note: Aggressive tendencies. Punched the instructor during the "Grandmother" scenario).\n\n- Vance, A. -> Archives. (Note: Obsessed with pre-war maps. Caught trying to calculate the Vault's exact GPS coordinates).`
  },
  contraband_list: {
    id: 'contraband_list',
    name: 'CONFISCATED_ITEMS.LOG',
    type: 'file',
    content: `SECURITY LOCKER 44 CONTENTS:\n\n1. "Grognak the Barbarian" Comic (Issue #4)\n   Reason: Depicts surface violence as "heroic."\n\n2. Home-made Radio Receiver\n   Reason: Unauthorized frequency scanning. Confiscated from Engineering Apprentice Wu.\n\n3. "The Sky Book"\n   Reason: A child's drawing book filled with pictures of the sun. Deemed "Psychologically Destabilizing" by the Preservationists.`
  },

  // --- ENGINEERING ---
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
    content: `SYSTEM: General Atomics V-Series\nSTATUS: ONLINE (DEGRADED)\n\nTHE VIBRATION:\nThe primary turbine has a wobble. It started in 2260. It's getting worse. We call it "The Heartbeat." You can feel it in the floor on Level 4.\n\nWe don't have the bearings to fix it. If we shut it down to overhaul it, we lose power to Cryo. If we lose power to Cryo, the Executives die. If the Executives die, the mission ends.\n\nSo we let it wobble.`
  },
  water_chip: {
    id: 'water_chip',
    name: 'WATER_PURIFICATION.SYS',
    type: 'file',
    content: `COMPONENT: Water Chip (Model 2077-B)\nSTATUS: FUNCTIONAL\n\nWe are using the last spare. The original failed in 2150. The first spare cracked in 2210. This is it. \n\nWe are filtering urine, sweat, and reactor runoff through a chip that is 198 years old. If this chip breaks, we have to open the door to find water. And if we open the door, the Preservationists might riot.`
  },

  // --- CLASSIFIED ---
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
    content: `*** EYES ONLY ***\n\nCRYO-POD 001: Frederick Langston (Board Member)\nCRYO-POD 002: Leonard Vance (CEO)\nCRYO-POD 003: Sarah Halloway (Director)\nCRYO-POD 004: Marcus Thorne (VP Ops)\nCRYO-POD 005: [CORRUPTED DATA]\n...\nCRYO-POD 120: S. Calvin\n\nNOTE: Pod 089 is showing fluctuating power levels. The occupant may be suffering from "Freezer Burn" (Neural decay). Do not thaw unless necessary.`
  },
  wakeup_protocol: {
    id: 'wakeup_protocol',
    name: 'RECLAMATION_DAY.EXE',
    type: 'file',
    content: `PROTOCOL 77-RECLAIM\n\nStep 1: Unseal Blast Doors.\nStep 2: Establish perimeter.\nStep 3: Initiate Thaw Cycle (12 Hours).\n\nWARNING: We have never tested the thawing process. Pre-war estimates suggested a 15% lethality rate. We might wake up a room full of corpses.`
  },
  overseer_journal: {
    id: 'overseer_journal',
    name: 'OVERSEER_PRIVATE.LOG',
    type: 'file',
    content: `They look to me for hope. I have none.\n\nThe sensors show radiation spikes. The radio picks up signals I can't decode—voices that sound human but wrong. The reactor is shaking the floorboards.\n\nMy grandfather told me the surface was a graveyard. But the sensors say it's alive. And if it's alive, it's had 200 years to get strong. We are 1,000 soft people in a metal can, guarding 120 frozen corporate suits who probably caused the end of the world.\n\nGod help us if they find the door.`
  }
};

/* --------------------------------------------------------------------------------
   COMPONENTS
   -------------------------------------------------------------------------------- */

const CRTOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    <div className="absolute inset-0 bg-white opacity-[0.02] animate-flicker"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]"></div>
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
    "> LOADING HOLOTAPES... OK",
    "> CONNECTING TO VAULT-TEC REGIONAL NET... FAILED (NO SIGNAL)",
    "> RETRYING CONNECTION... FAILED (NO SIGNAL)",
    "> RETRYING CONNECTION... FAILED (NO SIGNAL)",
    "> CONNECTING TO VAULT 254 LOCAL... ESTABLISHED",
    "> INITIALIZING GRAPHICAL INTERFACE...",
    "> LOADING 'ARC_OS'...",
    " ",
    "WELCOME, ADMINISTRATOR."
  ];

  useEffect(() => {
    let delay = 0;
    bootText.forEach((line, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        endRef.current?.scrollIntoView({ behavior: "smooth" });
        if (index === bootText.length - 1) {
          setTimeout(onComplete, 1500);
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
    <button 
      onClick={onClose} 
      className="text-green-500 hover:text-green-200 p-1 md:p-0 active:bg-green-800 rounded"
      aria-label="Close"
    >
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
      alert('ACCESS DENIED');
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
        {/* List View */}
        <div className={`w-full md:w-1/3 border-b md:border-b-0 md:border-r border-green-800 overflow-y-auto custom-scrollbar ${selected ? 'hidden md:block' : 'block'}`}>
           {EMAILS.map(email => (
             <button 
               key={email.id} 
               onClick={() => setSelected(email)}
               className={`w-full text-left p-3 md:p-4 border-b border-green-900 active:bg-green-900/30 transition-colors
                 ${selected?.id === email.id ? 'bg-green-900/50' : ''}
               `}
             >
               <div className="font-bold text-green-300 text-xs md:text-sm truncate">{email.from}</div>
               <div className="text-green-500 text-xs md:text-sm truncate">{email.subject}</div>
               <div className="text-green-700 text-[10px] mt-1 text-right">{email.date}</div>
             </button>
           ))}
        </div>
        
        {/* Reading Pane */}
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
               <div className="text-green-400 whitespace-pre-wrap font-mono leading-relaxed text-sm md:text-base">
                 {selected.body}
               </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-green-800 text-sm">
              SELECT MESSAGE
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAP APP ---
const MapRoom = ({ name, restricted, status, size = "normal" }) => (
    <div className={`
        border-2 p-2 relative group overflow-hidden transition-all min-h-[60px] flex flex-col justify-between
        ${size === 'large' ? 'col-span-2' : 'col-span-1'}
        ${restricted 
            ? 'border-red-900/50 bg-red-900/5 hover:bg-red-900/20' 
            : 'border-green-800/50 bg-green-900/5 hover:bg-green-900/20'
        }
    `}>
        <div className={`text-[10px] md:text-xs font-bold ${restricted ? 'text-red-500' : 'text-green-400'}`}>
            {name}
        </div>
        <div className="text-[8px] md:text-[10px] text-green-700 font-mono flex items-center gap-1">
             <div className={`w-1 h-1 rounded-full ${restricted ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
            {status}
        </div>
    </div>
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

const MapApp = ({ onClose }) => (
  <div className="flex flex-col h-full bg-black border-2 border-green-700 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
    <WindowHeader icon={MapIcon} title="VAULT ARCHITECT 2.1" onClose={onClose} />
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
            <MapRoom name="OVERSEER" status="OCCUPIED" restricted />
        </MapLevel>

        {/* Level 2 */}
        <MapLevel depth="L2 -100m" name="HABITATION">
            <MapRoom name="RESIDENTIAL A" status="98% CAP" size="large" />
            <MapRoom name="RESIDENTIAL B" status="100% CAP" size="large" />
            <MapRoom name="CAFETERIA" status="OPEN" />
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
            <MapRoom name="REACTOR" status="98.4%" />
            <MapRoom name="ENGINEERING" status="ACTIVE" />
            <MapRoom name="CRYO-BAY" status="STASIS LOCK" restricted size="large" />
        </MapLevel>

    </div>
    <div className="p-2 border-t border-green-800 text-[10px] text-green-600 flex justify-between px-4 shrink-0">
       <span>INTEGRITY: 100%</span>
       <span>SEALED: 198 YEARS</span>
    </div>
  </div>
);

// --- STATUS APP ---
const StatusApp = ({ onClose }) => (
  <div className="flex flex-col h-full bg-black border-2 border-green-700 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
    <WindowHeader icon={Activity} title="SYSTEM MONITOR" onClose={onClose} />
    <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-10">
       
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

       <div className="border border-red-900 p-3 md:p-4 col-span-1 md:col-span-2 bg-red-900/10">
          <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2 text-sm md:text-base"><Radio size={16}/> SURFACE SENSORS</h3>
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
  const [activeApp, setActiveApp] = useState(null); // 'terminal', 'mail', 'map', 'status'
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
        <DesktopIcon label="MAPS" icon={MapIcon} onClick={() => setActiveApp('map')} />
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
        <div className="absolute inset-0 md:inset-10 z-40 p-2 md:p-0 bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
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

      <style jsx global>{`
        /* Animations */
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        
        @keyframes flicker {
          0% { opacity: 0.02; } 5% { opacity: 0.05; } 10% { opacity: 0.02; }
          15% { opacity: 0.06; } 20% { opacity: 0.02; } 50% { opacity: 0.02; }
          55% { opacity: 0.05; } 60% { opacity: 0.02; } 100% { opacity: 0.02; }
        }
        .animate-flicker { animation: flicker 4s infinite; }

        @keyframes pulse-fast { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse-fast { animation: pulse-fast 0.1s linear infinite; animation-iteration-count: 2; }

        @keyframes fade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }

        /* Styles */
        .text-shadow-glow { text-shadow: 0 0 2px rgba(74, 222, 128, 0.4), 0 0 8px rgba(74, 222, 128, 0.2); }
        .font-handwriting { font-family: 'Courier New', Courier, monospace; letter-spacing: -0.5px; }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #001100; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #004400; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #006600; }
      `}</style>
    </div>
  );
}
