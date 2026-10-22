export const BRANCHES = [
  "CSE",
  "CSE (AI & ML)",
  "ECE / ETC",
  "EE",
  "EEE",
  "ME",
  "Civil",
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
 * Robustly handles compound branch names, and maps IT directly to CSE as they share the identical syllabus.
 */
export function normalizeBranchKey(branch: string): string {
  if (!branch) return "";
  const b = branch.trim().toLowerCase();
  if (b === "&" || b === "/" || b === "," || b === "-" || b === "") return "";

  // Material & Metallurgy
  if (
    b.includes("metall") ||
    b.includes("material") ||
    b.includes("meterial") ||
    b.includes("mme") ||
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

  // IT has identical syllabus to CSE per curriculum standards, completely merged into CSE
  if (b === "it" || b.includes("information tech")) {
    return "CSE";
  }

  // General CSE
  if (b === "cse" || b === "cs" || b.includes("computer science") || b.includes("computer")) {
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
 */
export function isBranchMatch(paperBranch?: string | null, targetBranch?: string | null): boolean {
  if (!targetBranch || targetBranch === "all" || targetBranch === "All Branches") return true;
  if (!paperBranch) return false;

  if (isCommonToAllBranches(paperBranch)) return true;

  const target = targetBranch.toLowerCase().trim();
  const branches = parseBranches(paperBranch).map((b) => b.toLowerCase().trim());

  if (branches.includes(target)) return true;

  // ECE and ETC equivalence checks
  const isTargetEceOrEtc =
    target === "ece" ||
    target === "etc" ||
    target === "ece / etc" ||
    target === "ece/etc" ||
    target.includes("telecommunication");

  if (isTargetEceOrEtc) {
    for (const b of branches) {
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
  }

  // IT merged with CSE
  if (target === "cse" || target.includes("computer")) {
    for (const b of branches) {
      if (b === "cse" || b === "cs" || b === "it" || b.includes("information tech")) return true;
    }
  }

  // Fuzzy matching against parsed branch names
  for (const b of branches) {
    if (b === target) return true;
    if (normalizeBranchKey(b) === normalizeBranchKey(targetBranch)) return true;
    if ((target === "civil" && b === "ce") || (target === "ce" && b === "civil")) return true;
    if ((target === "cse" && b === "cs") || (target === "cs" && b === "cse")) return true;
    if ((target === "me" && b.includes("mech")) || (target.includes("mech") && b === "me")) return true;
    if ((target === "ee" && b.includes("elect") && !b.includes("electronics")) || (target.includes("elect") && !target.includes("electronics") && b === "ee")) return true;
    if ((target === "eee" || target.includes("electrical & elec")) && (b === "eee" || b.includes("electrical & elec"))) return true;
    if ((target.includes("ai & ml") || target.includes("ai ml") || target === "aiml") && (b.includes("ai & ml") || b.includes("ai ml") || b.includes("aiml"))) return true;
    if ((target.includes("metallurgy") || target.includes("material")) && (b.includes("metallurgy") || b.includes("material"))) return true;
    if (b.includes(target) || target.includes(b)) return true;
  }

  return false;
}

/**
 * Human-friendly branch string formatter for cards, badges, and headers.
 */
export function formatBranchDisplay(branchStr?: string | null): string {
  if (!branchStr) return "Engineering";
  if (isCommonToAllBranches(branchStr)) return "All Branches (Common)";
  
  const trimmed = branchStr.trim();
  const lower = trimmed.toLowerCase();
  if (lower === "ece" || lower === "etc" || lower === "ece/etc" || lower === "ece / etc" || lower.includes("telecommunication")) {
    return "ECE / ETC";
  }
  if (lower === "it" || lower.includes("information tech")) {
    return "CSE";
  }

  const list = parseBranches(branchStr);
  if (list.length >= BRANCHES.length) return "All Branches (Common)";
  if (list.length > 1) {
    return list.map((b) => {
      const bl = b.trim().toLowerCase();
      if (bl === "ece" || bl === "etc" || bl === "ece/etc" || bl === "ece / etc" || bl.includes("telecommunication")) {
        return "ECE / ETC";
      }
      if (bl === "it" || bl.includes("information tech")) {
        return "CSE";
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
 * 1st and 2nd Semester Common Subjects for all Engineering Branches (BPUT & affiliated colleges).
 */
export const FIRST_YEAR_COMMON_SUBJECTS: Record<string, string[]> = {
  "1": [
    "Mathematics-I",
    "Physics",
    "Chemistry",
    "Basic Electrical Engineering",
    "Basic Electronics",
    "Programming in C and Data Structure",
    "Engineering Mechanics",
    "Basic Civil Engineering",
    "Basic Mechanical Engineering",
    "Universal Human Values",
    "English for Technical Writing"
  ],
  "2": [
    "Mathematics-II",
    "Physics",
    "Chemistry",
    "Basic Electrical Engineering",
    "Basic Electronics",
    "Programming in C and Data Structure",
    "Engineering Mechanics",
    "Basic Civil Engineering",
    "Basic Mechanical Engineering",
    "Universal Human Values",
    "English for Technical Writing"
  ]
};

/**
 * ECE and ETC share identical curriculum.
 */
export const ECE_ETC_SUBJECTS: Record<string, string[]> = {
  "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
  "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
  "3": [
    "Mathematics - III",
    "Analog Electronic Circuits",
    "Electrical Circuit Analysis",
    "Signals and Systems",
    "Python Programming",
    "Data Science Foundations",
    "Web and Application Development",
    "Cloud Computing Foundation",
    "Programming Internet of Things",
    "Robotics : Motion Planning",
    "IT Fundamentals for Cybersecurity - I",
    "Engineering Economics",
    "Organizational Behaviour"
  ],
  "4": [
    "Electromagnetic Theory",
    "Digital Systems Design",
    "Control System",
    "Principles of Communication Systems",
    "Machine Learning Techniques and Applications",
    "Big Data Integration and Management",
    "Application Development - Tools & Technologies",
    "Cloud Infrastructure & Applications",
    "Internet of Things and Cloud",
    "Robotics : Mobility & Design",
    "IT Fundamentals for Cybersecurity - II",
    "Organizational Behaviour",
    "Engineering Economics"
  ],
  "5": [
    "Microprocessor & Microcontroller",
    "Digital Signal Processing",
    "Electronics Measurement & Instrumentation",
    "Wireless Communication",
    "Semiconductor Devices",
    "Digital Image Processing",
    "Microwave Engineering",
    "Entrepreneurship Development",
    "Professional Ethics",
    "Environmental Engineering",
    "Industrial Safety Engineering"
  ],
  "6": [
    "Digital Communication Techniques",
    "VLSI Design",
    "Optical and Satellite Communication",
    "Embedded Systems",
    "Advanced Signal Processing",
    "Antenna Analysis and Synthesis",
    "Data Communication and Network",
    "Analog and Mixed Signal Circuit",
    "Sensor Signal Processing",
    "RADAR Engineering",
    "Professional Ethics",
    "Entrepreneurship Development",
    "Industrial Safety Engineering",
    "Environmental Engineering"
  ],
  "7": [
    "Telecommunication and Switching Networks",
    "VLSI Fabrication Technology",
    "Biomedical Signal Processing",
    "Adaptive and Smart Antennas",
    "Renewable Energy Sources",
    "Remote Sensing and GIS",
    "Fundamental Communication System",
    "Introduction to Robotics",
    "Object Oriented Programming",
    "Optimization Engineering",
    "Project Management",
    "Computer Aided Design and Manufacturing (CAD / CAM)",
    "Evolutionary Computing",
    "Bio Imaging",
    "Energy Conservation and Auditing",
    "Waste Management",
    "Introduction to Wireless Communication",
    "Introduction to Aerodynamics",
    "Design and Analysis of Algorithms",
    "Design Thinking",
    "Environmental Policy and Legislation",
    "Principles and Applications of Nano Technology",
    "Marketing Management",
    "Data Science and Analytics",
    "Applied Data Science",
    "Cloud and Application Development",
    "Cloud Networking",
    "IoT Technologies and Applications",
    "Robotics : Applications",
    "Cybersecurity Applications",
    "Applied Deep Learning"
  ],
  "8": [
    "Neural Networks",
    "MEMS",
    "Adaptive Signal Processing",
    "Wireless Sensor Networks",
    "Project Work & Seminar"
  ]
};

/**
 * Official BPUT Engineering Curriculum mapping branch-wise and semester-wise.
 */
export const COMMON_PAPERS: Record<string, Record<string, string[]>> = {
  CSE: {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Discrete Mathematics",
      "Digital Electronics",
      "Data Structures",
      "Object Oriented Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Database Engineering",
      "Computer Organization and Architecture",
      "Design and Analysis of Algorithms",
      "Computer Networks",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Theory of Computation",
      "Operating Systems",
      "Artificial Intelligence and Machine Learning",
      "Computational Intelligence",
      "Pattern Recognition",
      "Microprocessor & Microcontroller",
      "Distributed Systems",
      "Cryptography and Network Security",
      "Object Oriented Analysis and Design",
      "Web Technology",
      "Entrepreneurship Development",
      "Professional Ethics",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "Compiler Design",
      "Software Engineering",
      "Evolutionary Computing",
      "Data Mining and Data Warehousing",
      "Embedded Systems",
      "Cloud and Edge Computing",
      "Information Security and Management",
      "Software Testing and Quality Assurance",
      "Computer Graphics and Animation",
      "Deep Learning",
      "Big Data Analytics",
      "Advanced Computer Architecture",
      "Internet of Things",
      "Digital Forensics",
      "E-Commerce and ERP",
      "Simulation and Modeling",
      "Professional Ethics",
      "Entrepreneurship Development",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "Robotics and Computer Vision",
      "Image Processing",
      "VLSI",
      "Mobile Computing",
      "Cyber Security and Cyber Laws",
      "Software Project Management",
      "Multimedia Technology",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications",
      "Applied Deep Learning"
    ],
    "8": [
      "Deep Learning",
      "Blockchains",
      "Neural Networks",
      "Cyber Security & Laws",
      "Digital Image Processing",
      "Project Work & Seminar"
    ]
  },
  "CSE (AI & ML)": {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Discrete Mathematics",
      "Digital Electronics",
      "Data Structures and Algorithms for AI",
      "Object Oriented Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Database Engineering",
      "Computer Organization and Architecture",
      "Design and Analysis of Algorithms",
      "Artificial Intelligence",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Theory of Computation",
      "Operating Systems",
      "Machine Learning",
      "Computer Vision and Image Processing",
      "Robotics and Autonomous Systems",
      "Big Data Analytics",
      "Time Series Analysis and Forecasting",
      "Entrepreneurship Development",
      "Professional Ethics",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "Computer Networks",
      "Deep Learning",
      "Compiler Design",
      "Predictive Analysis and Statistical Modeling",
      "Neural Network Optimization",
      "AI in Cyber Security and Fraud Detection",
      "Natural Language Processing",
      "Machine Learning with Unstructured Data",
      "Recommender Systems",
      "Bayesian Learning and Probabilistic Graphical Modeling",
      "Professional Ethics",
      "Entrepreneurship Development",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "AI in Robotics",
      "AI in Healthcare applications",
      "Reinforcement Learning",
      "AI for IOT applications",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications"
    ],
    "8": [
      "Explainable AI (XAI)",
      "AI in Healthcare & Finance",
      "Neural Networks & Neuromorphic Computing",
      "Capstone Project"
    ]
  },
  "ECE / ETC": ECE_ETC_SUBJECTS,
  ECE: ECE_ETC_SUBJECTS,
  ETC: ECE_ETC_SUBJECTS,
  "ECE/ETC": ECE_ETC_SUBJECTS,
  EE: {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Mathematics - III",
      "Electrical Circuit Analysis",
      "Electrical Machines - I",
      "Analog and Digital Electronic Circuits",
      "Python Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Electrical Machines - II",
      "Electrical Measurement & Instrumentation",
      "Power Electronics",
      "Signals & Systems",
      "Machine Learning Techniques and Applications",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Control System",
      "Power System - I",
      "Microprocessor & Microcontroller",
      "Electromagnetic Field Theory",
      "CAD of Electrical Machines",
      "Energy Conservation & Auditing",
      "Special Electrical Machines",
      "Entrepreneurship Development",
      "Professional Ethics",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "Power System - II",
      "Digital Signal Processing",
      "Renewable Energy Sources",
      "Power Station Engineering",
      "Electric Vehicle",
      "Industrial Power Electronics",
      "Power System Protection",
      "High Voltage Engineering",
      "Electrical Power Quality",
      "Storage Technology",
      "Professional Ethics",
      "Entrepreneurship Development",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "Electric Drives and Control",
      "Smart Grid Technology",
      "FACTS and HVDC",
      "Advanced Control Systems",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications",
      "Applied Deep Learning"
    ],
    "8": [
      "Smart Grid Technology",
      "Renewable Energy Sources",
      "Power Quality",
      "Electric & Hybrid Vehicles",
      "Project Work & Seminar"
    ]
  },
  EEE: {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Mathematics - III",
      "Electrical Circuit Analysis",
      "Electrical Machines - I",
      "Analog and Digital Electronic Circuits",
      "Python Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Electrical Machines - II",
      "Electrical Measurement & Instrumentation",
      "Power Electronics",
      "Signals & Systems",
      "Machine Learning Techniques and Applications",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Control System",
      "Power System - I",
      "Microprocessor & Microcontroller",
      "Electromagnetic Field Theory",
      "Sensors and Transducers",
      "Analog Communication Techniques",
      "Opto Electronics Devices & Instrumentation",
      "Entrepreneurship Development",
      "Professional Ethics",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "Power System - II",
      "Digital Signal Processing",
      "Renewable Energy Sources",
      "Digital Communication Techniques",
      "Electric Vehicle",
      "Industrial Power Electronics",
      "Digital Image Processing",
      "Embedded Systems",
      "Electrical Power Quality",
      "Storage Technology",
      "Professional Ethics",
      "Entrepreneurship Development",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "Electric Drives and Control",
      "Smart Grid Technology",
      "Advanced Control Systems",
      "Wireless Communication",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications",
      "Applied Deep Learning"
    ],
    "8": [
      "Smart Grid Technologies",
      "Electric & Hybrid Vehicle Engineering",
      "FACTS & HVDC Transmission",
      "Power Quality Management",
      "Project Work & Seminar"
    ]
  },
  ME: {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Mathematics - III",
      "Mechanics of Solids",
      "Engineering Thermodynamics",
      "Introduction to Physical Metallurgy and Engineering Materials",
      "Python Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Basic Manufacturing Processes",
      "Fluid Mechanics and Hydraulic Machines",
      "Kinematics and Dynamics of Machines",
      "Design of Machine Elements-I",
      "Machine Learning Techniques and Applications",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Design of Machine Elements - II",
      "Heat Transfer",
      "Metal Cutting & Machining",
      "Optimization Method In Engineering Design",
      "Metrology, Quality Control and Reliability",
      "Production and Operation Management",
      "Refrigeration & Air Conditioning",
      "Advanced Mechanics of Solids",
      "Business Management",
      "Entrepreneurship Development",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "IC Engines & Gas Turbines",
      "Mechanical Vibration",
      "Power Plant Engineering",
      "Mechatronics",
      "Robotics",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Product Design & Production Tooling",
      "Additive Manufacturing",
      "Finite Element Analysis",
      "Non-Conventional Energy Systems",
      "Automobile Engineering",
      "Design Concepts In Engineering",
      "Entrepreneurship Development",
      "Business Management",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "Computational Techniques in Mechanical Engineering",
      "Product Realization: Design and Manufacturing",
      "Introduction to Composite Materials",
      "Computational Fluid Dynamics",
      "Tribology",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications",
      "Applied Deep Learning"
    ],
    "8": [
      "Robotics",
      "Additive Manufacturing",
      "Total Quality Management",
      "Non-Conventional Energy Sources",
      "Project Work & Seminar"
    ]
  },
  Civil: {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Mathematics - III",
      "Mechanics of Solids",
      "Engineering Survey",
      "Fluid Mechanics",
      "Python Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Structural Analysis",
      "Fluid Dynamics",
      "Geotechnical Engineering",
      "Water Supply & Sanitary Engineering",
      "Machine Learning Techniques and Applications",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Design of RCC Structures",
      "Transportation Engineering",
      "Advanced Structural Analysis",
      "Advanced Geotechnical Engineering",
      "Ground Improvement",
      "Environmental Geotechnical Engineering",
      "Business Management",
      "Entrepreneurship Development",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "Design of Steel Structure",
      "Water Resources Engineering",
      "Advanced Transportation Engineering",
      "Pavement Material",
      "Traffic Engineering",
      "Construction Management and Professional Practice",
      "Remote Sensing & GIS",
      "Disaster Management",
      "Entrepreneurship Development",
      "Business Management",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "Civil Engineering Materials and Construction",
      "Earthquake Resistant Design",
      "Prestressed Concrete",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications",
      "Applied Deep Learning"
    ],
    "8": [
      "Estimating & Costing",
      "Bridge Engineering",
      "Earthquake Engineering",
      "Urban Transportation Planning",
      "Project Work & Seminar"
    ]
  },
  Chemical: {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Mathematics - III",
      "Fuel and Energy Technology",
      "Chemical Process Calculation",
      "Mechanical Operation",
      "Python Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Mass Transfer - I",
      "Heat Transfer",
      "Fluid Flow and Flow Measurement",
      "Chemical Engineering Thermodynamics",
      "Machine Learning Techniques and Applications",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Chemical Reaction Engineering",
      "Chemical Process Technology",
      "Mass Transfer - II",
      "Process Simulation and Modelling",
      "Computational Fluid Dynamics",
      "Advanced Mathematical Techniques In Chemical Engineering",
      "Numerical Methods In Chemical Engineering",
      "Business Management",
      "Entrepreneurship Development",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "Process Dynamics and Control",
      "Continuum Transport Phenomena",
      "Petroleum Refinery Engineering",
      "Pulp and Paper Technology",
      "Colloid and Interfacial Engineering",
      "Process Monitoring and Fault Detection",
      "Polymer Technology",
      "Process Instrumentation",
      "Pinch Technology",
      "Advanced Separation Technology",
      "Entrepreneurship Development",
      "Business Management",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "Fluidization engineering",
      "Clean technology in process Industries",
      "Fundamentals of Biochemical Engineering",
      "Catalysis and Material Properties",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications",
      "Applied Deep Learning"
    ],
    "8": [
      "Petrochemical Technology",
      "Safety & Hazards in Chemical Plants",
      "Industrial Management",
      "Polymer Technology",
      "Project Work & Seminar"
    ]
  },
  Automobile: {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Mathematics - III",
      "Manufacturing Technology-I",
      "Introduction to Physical Metallurgy and Engineering Materials",
      "Mechanics of Solids",
      "Python Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Fundamentals of Automative Design",
      "Automative Engine",
      "Kinematics and Dynamics of Machines",
      "Automative Transmission System",
      "Machine Learning Techniques and Applications",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Automotive Chassis",
      "Automotive Electrical and Electronics",
      "Vehicle Body Engineering",
      "Automotive Fuels and Lubricants",
      "Production and Operation Management",
      "Computational Theory on Solid Mechanics",
      "Business Management",
      "Entrepreneurship Development",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "Vehicle Dynamics",
      "Hybrid Electric Vehicles and Renewable Energy",
      "Design of Vehicle Components",
      "Finite Element Analysis",
      "Computer Aided Design and Graphics",
      "Testing and Measurement Systems",
      "Automotive Emissions & Control",
      "Automotive Safety",
      "Automobile Trouble Shooting, Servicing and Maintenance",
      "Road Vehicle Aerodynamics",
      "Entrepreneurship Development",
      "Business Management",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "Noise, Vibration and Harshness",
      "Total Quality Management",
      "Vehicle Transportation Management",
      "Special Purpose Vehicles",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications",
      "Applied Deep Learning"
    ],
    "8": [
      "Vehicle Maintenance",
      "Off-Road Vehicles",
      "Finite Element Analysis",
      "Entrepreneurship Development",
      "Project Work & Seminar"
    ]
  },
  "Material & Metallurgy": {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Mathematics - III",
      "Metallurgical Thermodynamics and Kinetics",
      "Science & Engineering of Materials",
      "Elements of Process Metallurgy",
      "Python Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Transport Phenomena",
      "Phase Transformation & Heat Treatment of Metals",
      "Deformation Behavior of Materials",
      "Iron Making and Steel Making",
      "Machine Learning Techniques and Applications",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Solidification & Casting of Metals and Alloys",
      "Mechanical Behavior of Materials",
      "Non-Ferrous Extraction of Metals",
      "Alternative Routes of Iron Making",
      "Fuels & Refractories",
      "Secondary Steel Making",
      "Business Management",
      "Entrepreneurship Development",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "Joining of Metals",
      "Characterization of Materials",
      "Corrosion and Environmental Degradation of Materials",
      "High Temperature Materials",
      "Mechanical Working of Materials",
      "Metallurgical Failure : Detection and Analysis",
      "Composite Materials",
      "Nano-Structured Materials",
      "Entrepreneurship Development",
      "Business Management",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "Selection of Engineering Materials",
      "Advanced Engineering Materials and Processing",
      "Powder Metallurgy and Processing",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications",
      "Applied Deep Learning"
    ],
    "8": [
      "Selection of Engineering Materials",
      "Superalloys",
      "Smart Materials",
      "Corrosion Engineering",
      "Project Work & Seminar"
    ]
  },
  Biotech: {
    "1": FIRST_YEAR_COMMON_SUBJECTS["1"],
    "2": FIRST_YEAR_COMMON_SUBJECTS["2"],
    "3": [
      "Mathematics - III",
      "Biomolecules and Biochemistry",
      "Microbiology",
      "Cell Biology and Genetics",
      "Python Programming",
      "Data Science Foundations",
      "Web and Application Development",
      "Cloud Computing Foundation",
      "Programming Internet of Things",
      "Robotics : Motion Planning",
      "IT Fundamentals for Cybersecurity - I",
      "Engineering Economics",
      "Organizational Behaviour"
    ],
    "4": [
      "Molecular Biology",
      "Bio Analytical Tools and Techniques",
      "Bioinformatics and Biostatistics",
      "Developmental Biology",
      "Machine Learning Techniques and Applications",
      "Big Data Integration and Management",
      "Application Development - Tools & Technologies",
      "Cloud Infrastructure & Applications",
      "Internet of Things and Cloud",
      "Robotics : Mobility & Design",
      "IT Fundamentals for Cybersecurity - II",
      "Organizational Behaviour",
      "Engineering Economics"
    ],
    "5": [
      "Bio Process Engineering - I (Upstream Processing)",
      "Genetic Engineering",
      "Immuno-Biology and Immunotechnology",
      "Functional Genomics",
      "Nano Biotechnology",
      "Food Process Engineering",
      "Green Technology",
      "Business Management",
      "Entrepreneurship Development",
      "Environmental Engineering",
      "Industrial Safety Engineering"
    ],
    "6": [
      "Bio Process Engineering - II (Downstream Processing)",
      "Omics Tools and Techniques",
      "Plant Biotechnology",
      "Animal Biotechnology",
      "Environmental Biotechnology",
      "Marine Biotechnology",
      "Bioreactor Design and Analysis",
      "Tissue Engineering",
      "Molecular Modelling and Drug Designing",
      "Protein Engineering",
      "Entrepreneurship Development",
      "Business Management",
      "Industrial Safety Engineering",
      "Environmental Engineering"
    ],
    "7": [
      "Metabolite Engineering",
      "Molecular Diagnostics and Bioimaging",
      "Bioresource Technology",
      "Biomaterials and Biomanufacturing",
      "Renewable Energy Sources",
      "Remote Sensing and GIS",
      "Fundamental Communication System",
      "Introduction to Robotics",
      "Object Oriented Programming",
      "Optimization Engineering",
      "Project Management",
      "Computer Aided Design and Manufacturing (CAD / CAM)",
      "Evolutionary Computing",
      "Bio Imaging",
      "Energy Conservation and Auditing",
      "Waste Management",
      "Introduction to Wireless Communication",
      "Introduction to Aerodynamics",
      "Design and Analysis of Algorithms",
      "Design Thinking",
      "Environmental Policy and Legislation",
      "Principles and Applications of Nano Technology",
      "Marketing Management",
      "Data Science and Analytics",
      "Applied Data Science",
      "Cloud and Application Development",
      "Cloud Networking",
      "IoT Technologies and Applications",
      "Robotics : Applications",
      "Cybersecurity Applications",
      "Applied Deep Learning"
    ],
    "8": [
      "Biomedical Engineering",
      "Stem Cell Technology",
      "Nano-biotechnology",
      "Waste Management",
      "Project Work & Seminar"
    ]
  }
};

/**
 * Returns subjects filtered by branch and/or semester.
 */
export function getBranchSemesterSubjects(branch?: string, semester?: string): string[] {
  // Semester 1 & 2: common across all engineering branches
  if (semester === "1" || semester === "2") {
    const common = FIRST_YEAR_COMMON_SUBJECTS[semester] || [];
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

    // Multiple specific branches
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
    const branches = parseBranches(branch).map(normalizeBranchKey);
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

  // All branches & all semesters
  Object.values(COMMON_PAPERS).forEach((branchData) => {
    Object.values(branchData).forEach((list) => {
      list.forEach((s) => subjects.add(s));
    });
  });
  return Array.from(subjects);
}
