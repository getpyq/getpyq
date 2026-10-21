export const BRANCHES = [
  "CSE",
  "CSE (AI & ML)",
  "ECE / ETC",
  "EE",
  "EEE",
  "ME",
  "Civil",
  "IT",
  "Chemical",
  "Automobile",
  "Material & Metallurgy",
  "Biotech"
];

export const ALL_BRANCHES_LABEL = "All Branches (Common)";
export const ALL_BRANCHES_VALUE = "All Branches";

/**
 * Checks if a branch string represents a paper common to all branches.
 */
export function isCommonToAllBranches(branchStr?: string | null): boolean {
  if (!branchStr) return false;
  const b = branchStr.trim().toLowerCase();
  return (
    b === "all" ||
    b === "all branches" ||
    b === "all branches (common)" ||
    b === "common" ||
    b === "common to all" ||
    b === "common to all branches" ||
    b === "first year common" ||
    b.includes("all branch") ||
    b.includes("common to all")
  );
}

/**
 * Parses a branch string into an array of individual branch names.
 * Supports comma, semicolon, and pipe delimiters without breaking branch names containing & (e.g. AI & ML, Material & Metallurgy) or / (e.g. ECE / ETC).
 */
export function parseBranches(branchStr?: string | null): string[] {
  if (!branchStr) return [];
  if (isCommonToAllBranches(branchStr)) {
    return [...BRANCHES];
  }
  return branchStr
    .split(/[,|;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Normalizes branch name to canonical key.
 * Robustly handles compound branch names, preventing splitting into fragments:
 * - Material & Metallurgy (handles typos like "meterial & metallaogy", "metallurgy", etc.)
 * - CSE (AI & ML)
 * - ECE / ETC
 * - EEE
 */
export function normalizeBranchKey(branch: string): string {
  if (!branch) return "";
  const b = branch.trim().toLowerCase();
  if (b === "&" || b === "/" || b === "," || b === "-" || b === "") return "";

  // Material & Metallurgy variations (prevents fragmenting into "Material", "&", "Metallurgy")
  if (
    b.includes("metall") ||
    b.includes("material") ||
    b.includes("meterial") ||
    b.includes("metalla") ||
    b === "meta"
  ) {
    return "Material & Metallurgy";
  }

  // AI & ML
  if (
    b.includes("ai & ml") ||
    b.includes("ai/ml") ||
    b.includes("ai ml") ||
    b.includes("aiml") ||
    (b.includes("artificial") && b.includes("intelligence"))
  ) {
    return "CSE (AI & ML)";
  }

  // ECE / ETC
  if (
    b === "ece" ||
    b === "etc" ||
    b === "ece / etc" ||
    b === "ece/etc" ||
    b.includes("telecommunication") ||
    (b.includes("electronics") && b.includes("comm"))
  ) {
    return "ECE / ETC";
  }

  // EEE
  if (
    b === "eee" ||
    b.includes("electrical & elec") ||
    b.includes("electrical and elec")
  ) {
    return "EEE";
  }

  // Automobile
  if (b.includes("auto")) {
    return "Automobile";
  }

  // Biotech
  if (b.includes("biotech") || b.includes("bio-tech")) {
    return "Biotech";
  }

  // Civil
  if (b.includes("civil") || b === "ce") {
    return "Civil";
  }

  // Mechanical
  if (b.includes("mech") || b === "me") {
    return "ME";
  }

  // Electrical
  if ((b.includes("elect") && !b.includes("electronics")) || b === "ee") {
    return "EE";
  }

  // Chemical
  if (b.includes("chem")) {
    return "Chemical";
  }

  // IT
  if (b === "it" || b.includes("information tech")) {
    return "IT";
  }

  // General CSE
  if (b === "cse" || b === "cs" || b.includes("computer science")) {
    return "CSE";
  }

  // Check exact case-insensitive match against canonical BRANCHES
  for (const known of BRANCHES) {
    if (known.toLowerCase() === b) return known;
  }

  return branch.trim();
}

/**
 * Returns true if a paper's branch specification matches the target branch filter.
 * - If target branch is "all", matches everything.
 * - If paper is "All Branches" or common, matches ANY branch query.
 * - If paper is assigned to multiple branches (e.g., "CSE, IT, ECE / ETC"), matches if target branch is in the list.
 * - Treats ECE and ETC as completely equivalent with identical syllabus.
 */
export function isBranchMatch(paperBranch?: string | null, targetBranch?: string | null): boolean {
  if (!targetBranch || targetBranch === "all" || targetBranch === "All Branches") return true;
  if (!paperBranch) return false;

  if (isCommonToAllBranches(paperBranch)) return true;

  const target = targetBranch.toLowerCase().trim();
  const branches = parseBranches(paperBranch).map((b) => b.toLowerCase().trim());

  if (branches.includes(target)) return true;

  // ECE and ETC equivalence checks (both share identical curriculum)
  const isTargetEceOrEtc =
    target === "ece" ||
    target === "etc" ||
    target === "ece / etc" ||
    target === "ece/etc" ||
    target.includes("telecommunication") ||
    (target.includes("electronics") && target.includes("comm"));

  for (const b of branches) {
    if (b === target) return true;

    // ECE and ETC matching
    if (isTargetEceOrEtc) {
      if (
        b === "ece" ||
        b === "etc" ||
        b === "ece / etc" ||
        b === "ece/etc" ||
        b.includes("telecommunication") ||
        (b.includes("electronics") && b.includes("comm"))
      ) {
        return true;
      }
    }

    // Standard branch aliases
    if ((target === "civil" && b === "ce") || (target === "ce" && b === "civil")) return true;
    if ((target === "cse" && b === "cs") || (target === "cs" && b === "cse")) return true;
    if ((target === "me" && b.includes("mech")) || (target.includes("mech") && b === "me")) return true;
    if ((target === "ee" && b.includes("elect") && !b.includes("electronics")) || (target.includes("elect") && !target.includes("electronics") && b === "ee")) return true;
    if ((target === "eee" || target.includes("electrical & elec") || target.includes("electrical and elec")) && (b === "eee" || b.includes("electrical & elec") || b.includes("electrical and elec"))) return true;
    if ((target.includes("ai & ml") || target.includes("ai ml") || target === "aiml") && (b.includes("ai & ml") || b.includes("ai ml") || b.includes("aiml"))) return true;
    if ((target.includes("metallurgy") || target.includes("material")) && (b.includes("metallurgy") || b.includes("material"))) return true;
    if (b.includes(target) || target.includes(b)) return true;
  }

  return false;
}

/**
 * Human-friendly branch string formatter for cards, badges, and headers.
 * Unifies ECE and ETC into "ECE / ETC".
 */
export function formatBranchDisplay(branchStr?: string | null): string {
  if (!branchStr) return "Engineering";
  if (isCommonToAllBranches(branchStr)) return "All Branches (Common)";
  
  const trimmed = branchStr.trim();
  const lower = trimmed.toLowerCase();
  if (lower === "ece" || lower === "etc" || lower === "ece/etc" || lower === "ece / etc" || lower.includes("telecommunication")) {
    return "ECE / ETC";
  }

  const list = parseBranches(branchStr);
  if (list.length >= BRANCHES.length) return "All Branches (Common)";
  if (list.length > 1) {
    return list.map((b) => {
      const bl = b.trim().toLowerCase();
      if (bl === "ece" || bl === "etc" || bl === "ece/etc" || bl === "ece / etc" || bl.includes("telecommunication")) {
        return "ECE / ETC";
      }
      return b.trim();
    }).join(", ");
  }
  return branchStr;
}

export const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const YEARS = ["2025-26", "2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];

export const EXAM_TYPES = ["Regular/Back", "Back", "Supplementary"] as const;

/**
 * Standard curriculum for ECE and ETC (both branches share the exact same syllabus in BPUT & technical universities).
 */
export const ECE_ETC_SUBJECTS: Record<string, string[]> = {
  "1": ["Mathematics-I", "Engineering Physics", "Basic Electrical Engineering", "Engineering Graphics"],
  "2": ["Mathematics-II", "Engineering Chemistry", "Programming for Problem Solving", "Basic Electronics"],
  "3": ["Network Theory", "Electronic Devices & Circuits", "Digital System Design", "Signals & Systems", "Mathematics-III"],
  "4": ["Analog Circuits", "Electromagnetic Fields & Waves", "Microprocessors & Microcontrollers", "Control Systems"],
  "5": ["Digital Communication", "Antennas & Wave Propagation", "VLSI Design", "Digital Signal Processing", "Linear Integrated Circuits"],
  "6": ["Embedded Systems", "Microwave Engineering", "Wireless Communication", "Optical Communications"],
  "7": ["Computer Networks", "Radar & Navigational Aids", "Satellite Communication", "RF Microelectronics"],
  "8": ["Neural Networks", "MEMS", "Adaptive Signal Processing", "Wireless Sensor Networks"]
};

export const COMMON_PAPERS: Record<string, Record<string, string[]>> = {
  CSE: {
    "1": ["Mathematics-I", "Physics", "Basic Electrical Engineering", "Engineering Graphics", "Communication Skills"],
    "2": ["Mathematics-II", "Chemistry", "Programming for Problem Solving", "Basic Electronics", "Environmental Science"],
    "3": ["Data Structures & Algorithms", "Digital Electronics", "Discrete Mathematics", "OOP with C++", "Computer Organization"],
    "4": ["Operating Systems", "Design & Analysis of Algorithms", "Database Management Systems", "Formal Language & Automata", "Software Engineering"],
    "5": ["Computer Networks", "Compiler Design", "Microprocessors & Microcontrollers", "Web Technologies"],
    "6": ["Artificial Intelligence", "Machine Learning", "Software Testing", "Information Security", "Cloud Computing"],
    "7": ["Big Data Analytics", "Distributed Systems", "Internet of Things", "Mobile Computing", "Natural Language Processing"],
    "8": ["Deep Learning", "Blockchains", "Neural Networks", "Cyber Security & Laws", "Digital Image Processing"]
  },
  "CSE (AI & ML)": {
    "1": ["Mathematics-I", "Engineering Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    "2": ["Mathematics-II", "Engineering Chemistry", "Programming for Problem Solving (Python/C)", "Basic Electronics"],
    "3": ["Data Structures & Algorithms", "Digital Electronics", "Discrete Mathematics", "OOP with Java & Python", "Computer Organization & Architecture"],
    "4": ["Design & Analysis of Algorithms", "Database Management Systems", "Artificial Intelligence", "Formal Language & Automata Theory", "Probability & Statistics for AI"],
    "5": ["Machine Learning", "Computer Networks", "Operating Systems", "Natural Language Processing", "Soft Computing"],
    "6": ["Deep Learning", "Computer Vision", "Reinforcement Learning", "Cloud Computing & DevOps", "Big Data Analytics"],
    "7": ["Generative AI & LLMs", "AI Ethics & Governance", "Cognitive Systems", "Autonomous Systems & Robotics"],
    "8": ["Explainable AI (XAI)", "AI in Healthcare & Finance", "Neural Networks & Neuromorphic Computing", "Capstone Project"]
  },
  "ECE / ETC": ECE_ETC_SUBJECTS,
  ECE: ECE_ETC_SUBJECTS,
  ETC: ECE_ETC_SUBJECTS,
  "ECE/ETC": ECE_ETC_SUBJECTS,
  EE: {
    "1": ["Mathematics-I", "Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    "2": ["Mathematics-II", "Chemistry", "Programming for Problem Solving", "Basic Electronics"],
    "3": ["Network Analysis & Synthesis", "Analog Electronics", "Electrical Machines-I", "Electromagnetic Fields"],
    "4": ["Electrical Machines-II", "Power Electronics", "Control Systems-I", "Electrical Measurements & Instrumentation"],
    "5": ["Power Systems-I", "Signal & Systems", "Microprocessors & Microcontrollers", "Digital Electronics"],
    "6": ["Power Systems-II", "Control Systems-II", "Switchgear & Protection", "Power System Analysis"],
    "7": ["High Voltage Engineering", "Utilisation of Electrical Power", "Electric Drives", "Flexible AC Transmission (FACTS)"],
    "8": ["Smart Grid Technology", "Renewable Energy Sources", "Power Quality", "Electric & Hybrid Vehicles"]
  },
  EEE: {
    "1": ["Mathematics-I", "Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    "2": ["Mathematics-II", "Chemistry", "Programming for Problem Solving", "Basic Electronics"],
    "3": ["Network Theory", "Analog Electronics", "Electrical Machines-I", "Electromagnetic Fields", "Digital Electronics"],
    "4": ["Electrical Machines-II", "Power Electronics", "Linear Integrated Circuits", "Signals & Systems", "Control Systems-I"],
    "5": ["Microprocessors & Microcontrollers", "Power Systems-I", "Digital Signal Processing", "Electrical & Electronic Measurements", "VLSI Design"],
    "6": ["Power Systems-II", "Control Systems-II", "Power Electronic Converters & Drives", "Embedded Systems", "Communication Engineering"],
    "7": ["Switchgear & Protection", "High Voltage Engineering", "Renewable Energy Systems", "Industrial Automation & PLC"],
    "8": ["Smart Grid Technologies", "Electric & Hybrid Vehicle Engineering", "FACTS & HVDC Transmission", "Power Quality Management"]
  },
  ME: {
    "1": ["Mathematics-I", "Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    "2": ["Mathematics-II", "Chemistry", "Programming for Problem Solving", "Basic Mechanical Engineering"],
    "3": ["Thermodynamics", "Strength of Materials", "Engineering Metallurgy", "Mechanics of Solids", "Fluid Mechanics"],
    "4": ["Applied Thermodynamics", "Fluid Machinery", "Kinematics of Machinery", "Manufacturing Technology-I"],
    "5": ["Dynamics of Machinery", "Machine Design-I", "Manufacturing Technology-II", "Heat & Mass Transfer", "Industrial Engineering"],
    "6": ["Machine Design-II", "Refrigeration & Air Conditioning", "Automobile Engineering", "CAD/CAM", "Finite Element Analysis"],
    "7": ["Operations Research", "Computational Fluid Dynamics", "Power Plant Engineering", "Mechatronics"],
    "8": ["Robotics", "Additive Manufacturing", "Total Quality Management", "Non-Conventional Energy Sources"]
  },
  Civil: {
    "1": ["Mathematics-I", "Physics", "Basic Electrical Engineering", "Engineering Mechanics"],
    "2": ["Mathematics-II", "Chemistry", "Programming for Problem Solving", "Engineering Graphics"],
    "3": ["Surveying-I", "Mechanics of Solids", "Fluid Mechanics", "Building Materials & Construction", "Engineering Geology"],
    "4": ["Surveying-II", "Structural Analysis-I", "Concrete Technology", "Hydraulic Engineering", "Soil Mechanics"],
    "5": ["Structural Analysis-II", "Design of RC Structures", "Geotechnical Engineering-I", "Transportation Engineering", "Water Resources Engineering"],
    "6": ["Design of Steel Structures", "Geotechnical Engineering-II", "Environmental Engineering-I", "Foundation Engineering"],
    "7": ["Environmental Engineering-II", "Construction Planning & Management", "Prestressed Concrete", "Irrigation Engineering"],
    "8": ["Estimating & Costing", "Bridge Engineering", "Earthquake Engineering", "Urban Transportation Planning"]
  },
  IT: {
    "1": ["Mathematics-I", "Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    "2": ["Mathematics-II", "Chemistry", "Programming for Problem Solving", "Basic Electronics"],
    "3": ["Data Structures & Algorithms", "Digital Logic", "Discrete Mathematics", "OOP with Java", "Computer Organization"],
    "4": ["Operating Systems", "Design & Analysis of Algorithms", "Database Management Systems", "Software Engineering-I"],
    "5": ["Computer Networks", "Cryptography & Network Security", "Web Design & Development", "Theory of Computation"],
    "6": ["Artificial Intelligence", "Information Retrieval", "Cloud Computing", "Mobile Application Development", "Software Testing"],
    "7": ["Big Data Analytics", "Distributed Systems", "Internet of Things", "Data Mining & Warehousing"],
    "8": ["Deep Learning", "Software Project Management", "Cyber Security", "Digital Image Processing"]
  },
  Chemical: {
    "1": ["Mathematics-I", "Chemistry-I", "Basic Electrical Engineering", "Engineering Graphics"],
    "2": ["Mathematics-II", "Physics", "Programming for Problem Solving", "Basic Mechanical Engineering"],
    "3": ["Chemical Process Calculations", "Organic Chemistry", "Fluid Mechanics", "Chemical Engineering Thermodynamics-I"],
    "4": ["Chemical Engineering Thermodynamics-II", "Heat Transfer", "Mechanical Operations", "Inorganic Chemical Technology"],
    "5": ["Mass Transfer-I", "Chemical Reaction Engineering-I", "Organic Chemical Technology", "Materials Science"],
    "6": ["Mass Transfer-II", "Chemical Reaction Engineering-II", "Process Instrumentation & Control", "Plant Design & Economics"],
    "7": ["Process Equipment Design", "Transport Phenomena", "Pollution Control in Chemical Industries", "Process Modeling & Simulation"],
    "8": ["Petrochemical Technology", "Safety & Hazards in Chemical Plants", "Industrial Management", "Polymer Technology"]
  },
  Automobile: {
    "1": ["Mathematics-I", "Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    "2": ["Mathematics-II", "Chemistry", "Programming for Problem Solving", "Basic Mechanical Engineering"],
    "3": ["Thermodynamics & Thermal Engineering", "Mechanics of Solids", "Fluid Mechanics & Machinery", "Automotive Engines"],
    "4": ["Automotive Chassis", "Manufacturing Technology", "Kinematics & Dynamics of Machinery", "Engineering Metallurgy"],
    "5": ["Automotive Transmission", "Design of Machine Elements", "Heat Transfer", "Automotive Electrical & Electronics Systems"],
    "6": ["Two & Three Wheelers", "Vehicle Dynamics", "Automotive Chassis Design", "Computer Aided Design & Manufacturing"],
    "7": ["Automotive Pollution & Control", "Vehicle Body Engineering", "Hybrid & Electric Vehicles", "Operations Research"],
    "8": ["Vehicle Maintenance", "Off-Road Vehicles", "Finite Element Analysis", "Entrepreneurship Development"]
  },
  "Material & Metallurgy": {
    "1": ["Mathematics-I", "Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    "2": ["Mathematics-II", "Chemistry", "Programming for Problem Solving", "Material Science"],
    "3": ["Introduction to Metallurgy", "Thermodynamics of Materials", "Physical Metallurgy-I", "Mechanical Behaviour of Materials"],
    "4": ["Transport Phenomena in Metallurgy", "Physical Metallurgy-II", "Iron Making", "Nondestructive Testing"],
    "5": ["Steel Making", "Mechanical Metallurgy", "Phase Transformations", "Corrosion & Degradation of Materials"],
    "6": ["Extractive Metallurgy", "Material Characterization Techniques", "Heat Treatment of Metals", "Powder Metallurgy"],
    "7": ["Nanomaterials", "Ceramed & Composite Materials", "Failure Analysis", "Materials Joining"],
    "8": ["Electrometallurgy & Corrosion", "Selection of Materials", "Superalloys", "Smart Materials"]
  },
  Biotech: {
    "1": ["Mathematics-I", "Physics", "Basic Electrical Engineering", "Engineering Graphics"],
    "2": ["Mathematics-II", "Chemistry", "Cell Biology & Genetics", "Programming for Problem Solving"],
    "3": ["Biochemistry", "Microbiology", "Bioprocess Calculations", "Thermodynamics of Bioprocesses"],
    "4": ["Molecular Biology", "Heat & Mass Transfer in Bioprocesses", "Immunology", "Instrumental Methods of Analysis"],
    "5": ["Bioprocess Engineering", "Genetic Engineering", "Bioinformatics", "Environmental Biotechnology"],
    "6": ["Plant & Animal Biotechnology", "Enzyme Technology", "Bioseparation Technology", "Bioreactor Design & Control"],
    "7": ["Food Biotechnology", "Intellectual Property Rights & Biosafety", "Medical Biotechnology", "Genomics & Proteomics"],
    "8": ["Biomedical Engineering", "Stem Cell Technology", "Nano-biotechnology", "Waste Management"]
  }
};

/**
 * 1st and 2nd Semester Common Subjects for all Engineering Branches (BPUT & affiliated colleges).
 * First year curriculum is common across all branches (Group A / Group B: Physics, Chemistry, Math-I/II, Programming, etc.)
 * 
 * 👉 HOW TO EDIT MANUALLY:
 * You can add, edit, or rename subjects in the arrays below for Semester 1 and Semester 2!
 */
export const FIRST_YEAR_COMMON_SUBJECTS: Record<string, string[]> = {
  "1": [
    "Mathematics-I",
    "Engineering Physics",
    "Basic Electrical Engineering",
    "Engineering Mechanics",
    "Engineering Graphics & Design",
    "Communication Skills"
  ],
  "2": [
    "Mathematics-II",
    "Engineering Chemistry",
    "Programming for Problem Solving (C)",
    "Basic Electronics Engineering",
    "Basic Mechanical Engineering",
    "Environmental Science"
  ]
};

/**
 * Returns subjects filtered by branch and/or semester.
 * - For Semester 1 & 2: Automatically provides common 1st year subjects for all branches.
 * - For Semester 3, 4, 5, 6, 7, 8: Provides branch-wise specific subjects from COMMON_PAPERS.
 * - Supports single branch, multiple branches, or "All Branches".
 */
export function getBranchSemesterSubjects(branch?: string, semester?: string): string[] {
  // If Semester 1 or 2 is selected: return common 1st year subjects
  if (semester === "1" || semester === "2") {
    const common = FIRST_YEAR_COMMON_SUBJECTS[semester] || [];
    // If the branch specifically defines any additional subjects in COMMON_PAPERS for sem 1/2, include them as well
    const norm = branch ? normalizeBranchKey(branch) : "";
    if (norm && norm !== "all" && norm !== "All Branches" && COMMON_PAPERS[norm]?.[semester]) {
      return Array.from(new Set([...common, ...COMMON_PAPERS[norm][semester]]));
    }
    return [...common];
  }

  const isBranchAll = !branch || branch === "all" || branch === "" || isCommonToAllBranches(branch);
  const isSemAll = !semester || semester === "all" || semester === "";

  if (!isBranchAll && !isSemAll) {
    const branches = parseBranches(branch).map(normalizeBranchKey);
    if (branches.length === 1) {
      const branchData = COMMON_PAPERS[branches[0]];
      if (branchData && branchData[semester]) {
        return [...branchData[semester]];
      }
      return [];
    }

    // Multiple specific branches (e.g. CSE, IT, ECE)
    const combined = new Set<string>();
    branches.forEach((b) => {
      const bData = COMMON_PAPERS[b];
      if (bData && bData[semester]) {
        bData[semester].forEach((s) => combined.add(s));
      }
    });
    return Array.from(combined);
  }

  const subjects = new Set<string>();

  if (!isBranchAll && isSemAll) {
    const branches = parseBranches(branch);
    branches.forEach((b) => {
      const branchData = COMMON_PAPERS[b];
      if (branchData) {
        Object.values(branchData).forEach((list) => {
          list.forEach((s) => subjects.add(s));
        });
      }
    });
    return Array.from(subjects);
  }

  if (isBranchAll && !isSemAll) {
    Object.values(COMMON_PAPERS).forEach((branchData) => {
      const list = branchData[semester];
      if (list) {
        list.forEach((s) => subjects.add(s));
      }
    });
    return Array.from(subjects);
  }

  // Both are 'all' - list all unique curriculum subjects
  Object.values(COMMON_PAPERS).forEach((branchData) => {
    Object.values(branchData).forEach((list) => {
      list.forEach((s) => subjects.add(s));
    });
  });
  return Array.from(subjects);
}

