// Mock data generation utilities for government data

// ─── Name pools ────────────────────────────────────────────────────────────────
const firstNames = [
  'James', 'Robert', 'John', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Donald',
  'Jennifer', 'Maria', 'Susan', 'Margaret', 'Dorothy', 'Lisa', 'Nancy', 'Karen',
  'Betty', 'Sandra', 'Ashley', 'Kimberly', 'Patricia', 'Barbara', 'Linda',
  'Michelle', 'Emily', 'Amanda', 'Melissa', 'Deborah', 'Sarah', 'Laura', 'Helen',
  'Marcus', 'Darnell', 'Tyrone', 'DeShawn', 'Malik', 'Aaliyah', 'Keisha', 'Latoya',
  'Nguyen', 'Yuki', 'Kenji', 'Priya', 'Raj', 'Fatima', 'Omar', 'Guadalupe',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Anderson', 'Wilson', 'Moore', 'Taylor', 'Jackson',
  'Lee', 'Harris', 'Thompson', 'Walker', 'Hall', 'Rivera', 'Young', 'Allen',
  'Robinson', 'Scott', 'King', 'Wright', 'Green', 'Baker', 'Nguyen', 'Patel',
  'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Phillips', 'Evans', 'Turner',
  'Torres', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Flores', 'Morris', 'Nguyen',
];

// ─── Location data (city / state / ZIP prefix / area code are consistent) ─────
const locationData = [
  { city: 'Los Angeles',   state: 'CA', zipPrefix: '900', areaCode: '213' },
  { city: 'San Diego',     state: 'CA', zipPrefix: '921', areaCode: '619' },
  { city: 'Sacramento',    state: 'CA', zipPrefix: '958', areaCode: '916' },
  { city: 'Fresno',        state: 'CA', zipPrefix: '937', areaCode: '559' },
  { city: 'Houston',       state: 'TX', zipPrefix: '770', areaCode: '713' },
  { city: 'San Antonio',   state: 'TX', zipPrefix: '782', areaCode: '210' },
  { city: 'Dallas',        state: 'TX', zipPrefix: '752', areaCode: '214' },
  { city: 'Austin',        state: 'TX', zipPrefix: '787', areaCode: '512' },
  { city: 'Miami',         state: 'FL', zipPrefix: '331', areaCode: '305' },
  { city: 'Orlando',       state: 'FL', zipPrefix: '328', areaCode: '407' },
  { city: 'Tampa',         state: 'FL', zipPrefix: '336', areaCode: '813' },
  { city: 'New York',      state: 'NY', zipPrefix: '100', areaCode: '212' },
  { city: 'Buffalo',       state: 'NY', zipPrefix: '142', areaCode: '716' },
  { city: 'Albany',        state: 'NY', zipPrefix: '122', areaCode: '518' },
  { city: 'Philadelphia',  state: 'PA', zipPrefix: '191', areaCode: '215' },
  { city: 'Pittsburgh',    state: 'PA', zipPrefix: '152', areaCode: '412' },
  { city: 'Chicago',       state: 'IL', zipPrefix: '606', areaCode: '312' },
  { city: 'Springfield',   state: 'IL', zipPrefix: '627', areaCode: '217' },
  { city: 'Columbus',      state: 'OH', zipPrefix: '432', areaCode: '614' },
  { city: 'Cleveland',     state: 'OH', zipPrefix: '441', areaCode: '216' },
  { city: 'Atlanta',       state: 'GA', zipPrefix: '303', areaCode: '404' },
  { city: 'Charlotte',     state: 'NC', zipPrefix: '282', areaCode: '704' },
  { city: 'Raleigh',       state: 'NC', zipPrefix: '276', areaCode: '919' },
  { city: 'Detroit',       state: 'MI', zipPrefix: '482', areaCode: '313' },
  { city: 'Grand Rapids',  state: 'MI', zipPrefix: '495', areaCode: '616' },
];

const streetNames = [
  'Oak', 'Maple', 'Cedar', 'Elm', 'Pine', 'Washington', 'Lincoln', 'Jefferson',
  'Madison', 'Jackson', 'Adams', 'Franklin', 'Sunset', 'Highland', 'Valley',
  'River', 'Lake', 'Forest', 'Church', 'Mill', 'Spring', 'Main', 'Park',
  'Willow', 'Chestnut', 'Magnolia', 'Sycamore', 'Birch', 'Walnut', 'Poplar',
];
const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Rd', 'Ln', 'Ct', 'Way', 'Pl', 'Cir'];

// ─── Government departments and positions ─────────────────────────────────────
const departments = [
  'Public Works', 'Parks & Recreation', 'Planning & Development', 'Public Safety',
  'Health Services', 'Transportation', 'Environmental Services', 'Finance',
  'Human Resources', 'Information Technology',
];

const positionsByDepartment: Record<string, Array<{ title: string; min: number; max: number }>> = {
  'Public Works': [
    { title: 'Civil Engineer I',          min: 58000,  max: 82000  },
    { title: 'Civil Engineer II',         min: 72000,  max: 98000  },
    { title: 'Public Works Director',     min: 105000, max: 145000 },
    { title: 'Road Maintenance Tech',     min: 42000,  max: 58000  },
    { title: 'Utility Inspector',         min: 52000,  max: 72000  },
    { title: 'Sanitation Supervisor',     min: 62000,  max: 85000  },
  ],
  'Parks & Recreation': [
    { title: 'Recreation Coordinator',    min: 44000,  max: 62000  },
    { title: 'Parks Superintendent',      min: 78000,  max: 108000 },
    { title: 'Groundskeeper II',          min: 38000,  max: 52000  },
    { title: 'Aquatics Manager',          min: 55000,  max: 75000  },
    { title: 'Recreation Center Director',min: 72000,  max: 98000  },
  ],
  'Planning & Development': [
    { title: 'City Planner I',            min: 62000,  max: 88000  },
    { title: 'Zoning Administrator',      min: 72000,  max: 98000  },
    { title: 'Building Inspector',        min: 55000,  max: 80000  },
    { title: 'GIS Analyst',               min: 58000,  max: 82000  },
    { title: 'Development Review Officer',min: 65000,  max: 90000  },
  ],
  'Public Safety': [
    { title: 'Police Officer',            min: 52000,  max: 82000  },
    { title: 'Police Captain',            min: 95000,  max: 130000 },
    { title: 'Fire Marshal',              min: 78000,  max: 108000 },
    { title: 'Code Enforcement Officer',  min: 48000,  max: 70000  },
    { title: 'Emergency Mgmt Coordinator',min: 62000,  max: 88000  },
  ],
  'Health Services': [
    { title: 'Public Health Director',    min: 95000,  max: 138000 },
    { title: 'Env. Health Specialist',    min: 58000,  max: 82000  },
    { title: 'Health Educator',           min: 48000,  max: 68000  },
    { title: 'Epidemiologist',            min: 72000,  max: 100000 },
    { title: 'Clinic Administrator',      min: 65000,  max: 90000  },
  ],
  'Transportation': [
    { title: 'Transit Director',          min: 98000,  max: 140000 },
    { title: 'Traffic Engineer',          min: 72000,  max: 100000 },
    { title: 'Fleet Manager',             min: 65000,  max: 90000  },
    { title: 'Transportation Planner',    min: 62000,  max: 88000  },
    { title: 'Bus Operations Supervisor', min: 52000,  max: 72000  },
  ],
  'Environmental Services': [
    { title: 'Env. Compliance Officer',   min: 58000,  max: 82000  },
    { title: 'Sustainability Coordinator',min: 55000,  max: 78000  },
    { title: 'Recycling Program Manager', min: 60000,  max: 85000  },
    { title: 'Water Quality Analyst',     min: 58000,  max: 80000  },
    { title: 'Solid Waste Manager',       min: 68000,  max: 95000  },
  ],
  'Finance': [
    { title: 'Finance Director',          min: 105000, max: 148000 },
    { title: 'Budget Analyst',            min: 62000,  max: 88000  },
    { title: 'Accounts Payable Specialist',min: 44000, max: 62000  },
    { title: 'Grant Accountant',          min: 55000,  max: 78000  },
    { title: 'Revenue Auditor',           min: 65000,  max: 92000  },
  ],
  'Human Resources': [
    { title: 'HR Director',               min: 98000,  max: 138000 },
    { title: 'Benefits Administrator',    min: 52000,  max: 74000  },
    { title: 'Recruitment Specialist',    min: 48000,  max: 68000  },
    { title: 'Labor Relations Officer',   min: 72000,  max: 100000 },
    { title: 'Training Coordinator',      min: 50000,  max: 72000  },
  ],
  'Information Technology': [
    { title: 'IT Director',               min: 108000, max: 155000 },
    { title: 'Systems Administrator',     min: 65000,  max: 92000  },
    { title: 'Cybersecurity Analyst',     min: 78000,  max: 112000 },
    { title: 'GIS Specialist',            min: 62000,  max: 88000  },
    { title: 'Database Administrator',    min: 72000,  max: 105000 },
  ],
};

// ─── Services & contracts ──────────────────────────────────────────────────────
const serviceTypes = [
  'Permits & Licensing', 'Public Transportation', 'Waste Management', 'Water & Utilities',
  'Emergency Services', 'Social Services', 'Public Health', 'Parks Maintenance',
  'Road Maintenance', 'Public Housing',
];

const contractTypes = [
  'Construction', 'IT Services', 'Consulting', 'Equipment Purchase', 'Maintenance',
  'Professional Services', 'Security Services', 'Utilities', 'Transportation',
  'Cleaning Services',
];

const vendors = [
  'Apex Construction Group LLC', 'Meridian Infrastructure Partners', 'CivTech Solutions Inc.',
  'BlueSky Government Services', 'Cornerstone Consulting LLC', 'Allied Municipal Supply Co.',
  'Vanguard Facility Services', 'Patriot Security Solutions Inc.', 'Ironbridge Engineering',
  'Summit IT Systems Inc.', 'Greenfield Environmental Services', 'Liberty Utilities Corp.',
  'Crestview Maintenance Services', 'Capital Fleet Management Inc.', 'Horizon Health Systems',
];

// ─── Assets ────────────────────────────────────────────────────────────────────
const assetsByType: Record<string, string[]> = {
  'Building': [
    'City Hall Main Building', 'Public Works Yard Office', 'Community Center - North',
    'Municipal Library - Main Branch', 'Fire Station Headquarters', 'Police Admin Building',
    'Senior Activity Center', 'Parks Maintenance Facility', 'Utilities Operations Center',
  ],
  'Vehicle': [
    'Ford F-350 Pickup Truck', 'Chevrolet Tahoe - Police Package', 'GMC Sierra 2500HD',
    'Ford Explorer - Unmarked Unit', 'International 4300 Dump Truck', 'Ford Transit Van',
    'Chevrolet Silverado 1500', 'Ford F-550 Flatbed', 'Freightliner 114SD Refuse Truck',
  ],
  'Equipment': [
    'Industrial Mower 72"', 'Backhoe Loader CAT 416', 'Air Compressor 60gal',
    'Pressure Washer 3500 PSI', 'Generator 20kW Standby', 'Portable Arc Welder',
    'Walk-Behind Concrete Saw', 'Commercial Leaf Blower Backpack',
  ],
  'Infrastructure': [
    'Stormwater Culvert - Oak Ave', 'Water Main Section - 3rd St',
    'Sanitary Sewer Line - Block 12', 'Traffic Signal Controller - Main & Oak',
    'Street Light Pole Array - Park Blvd', 'Bridge Deck - River Rd',
    'Retaining Wall - Park Ave Section', 'Storm Drain Network - Section 4',
  ],
  'Technology': [
    'Dell PowerEdge R750 Server', 'Cisco Catalyst 9300 Switch Stack',
    'IP Camera Security System', 'CAD Dispatch Console System',
    'ArcGIS Enterprise Workstation', 'Document Imaging System', 'Fire Alarm Control Panel',
    'SCADA Water Control System',
  ],
  'Land': [
    'Riverside Park Property', 'Industrial Redevelopment Parcel', 'Cemetery Grounds',
    'Municipal Utility Easement', 'Greenway Trail Corridor', 'Park & Ride Lot',
    'Public Works Storage Yard', 'Floodplain Preservation Area',
  ],
  'Facility': [
    'Athletic Field Complex', 'Splash Pad Installation', 'Boat Launch Facility',
    'Picnic Pavilion - Riverside', 'Tennis Court Complex', 'Dog Park Facility',
    'Skate Park', 'Outdoor Amphitheater',
  ],
  'Machinery': [
    'Vector 2100 Sewer Cleaner', 'Elgin Pelican Street Sweeper', 'Kubota L3902 Tractor',
    'Leaf Vacuum Truck', 'Line Striping Machine', 'Asphalt Roller Compactor',
    'Motor Grader 120M', 'Plow Truck w/ Salt Spreader',
  ],
};
const assetTypes = Object.keys(assetsByType);

// ─── Permits ───────────────────────────────────────────────────────────────────
const permitTypes = [
  'Building Permit', 'Zoning Permit', 'Demolition Permit', 'Electrical Permit',
  'Plumbing Permit', 'HVAC Permit', 'Sign Permit', 'Excavation Permit',
  'Tree Removal Permit', 'Special Event Permit',
];

const permitFeeRanges: Record<string, { min: number; max: number }> = {
  'Building Permit':    { min: 500,   max: 25000 },
  'Zoning Permit':      { min: 200,   max: 3000  },
  'Demolition Permit':  { min: 300,   max: 5000  },
  'Electrical Permit':  { min: 75,    max: 1500  },
  'Plumbing Permit':    { min: 75,    max: 1200  },
  'HVAC Permit':        { min: 100,   max: 1500  },
  'Sign Permit':        { min: 50,    max: 500   },
  'Excavation Permit':  { min: 150,   max: 2000  },
  'Tree Removal Permit':{ min: 50,    max: 300   },
  'Special Event Permit':{ min: 100,  max: 2000  },
};

// ─── Licenses ──────────────────────────────────────────────────────────────────
const licenseTypes = [
  'Business License', 'Liquor License', 'Food Service License', 'Taxi License',
  'Street Vendor License', 'Contractor License', 'Professional License',
  'Pet License', 'Marriage License', 'Hunting License',
];

const licenseFeeRanges: Record<string, { min: number; max: number }> = {
  'Business License':      { min: 150,  max: 500   },
  'Liquor License':        { min: 1000, max: 8000  },
  'Food Service License':  { min: 200,  max: 1500  },
  'Taxi License':          { min: 300,  max: 1000  },
  'Street Vendor License': { min: 100,  max: 400   },
  'Contractor License':    { min: 200,  max: 1000  },
  'Professional License':  { min: 150,  max: 500   },
  'Pet License':           { min: 20,   max: 75    },
  'Marriage License':      { min: 50,   max: 100   },
  'Hunting License':       { min: 25,   max: 50    },
};

const businessNamesByLicenseType: Record<string, string[]> = {
  'Business License':      ['Sunrise Consulting Group', 'Metro Retail Ventures', 'Main Street Properties LLC', 'City Center Management Co.', 'Lakeside Business Services'],
  'Liquor License':        ["Murphy's Pub & Grill", 'The Silver Fox Bar', 'Highland Spirits & Lounge', 'Corner Tap Room', "O'Brien's Irish Pub", 'The Rusty Anchor Bar'],
  'Food Service License':  ['Golden Dragon Restaurant', 'Casa Familia Mexican Kitchen', "Rosie's Hometown Diner", 'Harbor View Café', 'The Rustic Spoon Bistro', 'Sunrise Bagel Co.'],
  'Taxi License':          ['Metro Cab Company', 'City Ride Services LLC', 'Quickway Transport', 'Central Taxi & Livery'],
  'Street Vendor License': ['Fresh Eats Cart', 'Sunrise Tamale Kitchen', 'The Pretzel Cart', 'Smoothie Station', 'Downtown Hot Dog Stand'],
  'Contractor License':    ['Reliable Builders Inc.', 'PrecisionCraft Contracting', 'All-Star Plumbing & Drain', 'Dependable Electric Co.', 'Tri-State Roofing LLC'],
  'Professional License':  ['Cornerstone CPA Firm', 'Lawson & Associates Law', 'Medical Arts Practice', 'Wellness Partners Therapy', 'Advanced Engineering Solutions'],
  'Pet License':           ['(Personal Pet Registration)', '(Animal Owner Registration)'],
  'Marriage License':      ['(Personal Application)', '(Civil Ceremony)'],
  'Hunting License':       ['(Personal License)', '(Non-Resident License)'],
};

// ─── Inventory ─────────────────────────────────────────────────────────────────
const inventoryItemsByCategory: Record<string, Array<{ name: string; unitPrice: [number, number] }>> = {
  'Office Supplies': [
    { name: 'Printer Paper, Letter 8.5×11 (Case/10 Reams)', unitPrice: [35, 55] },
    { name: 'Ballpoint Pens, Black Medium (Box/12)',          unitPrice: [6, 12] },
    { name: 'Stapler, Full-Strip Desktop',                    unitPrice: [12, 25] },
    { name: 'Manila File Folders, Letter (Box/100)',          unitPrice: [14, 22] },
    { name: 'Legal Pads, Yellow Ruled (Pack/12)',             unitPrice: [18, 30] },
    { name: 'Toner Cartridge, Black HP LaserJet',            unitPrice: [55, 120] },
    { name: 'Binder Clips, Assorted (Box/40)',               unitPrice: [5, 10] },
    { name: 'Sticky Notes 3×3 (Pack/12)',                    unitPrice: [12, 20] },
    { name: 'Hanging File Folders (Box/25)',                  unitPrice: [18, 32] },
    { name: 'Tape, Clear 3/4" (Pack/6)',                     unitPrice: [8, 15] },
  ],
  'Maintenance Equipment': [
    { name: 'Extension Cord, 12/3 AWG 50ft',                 unitPrice: [28, 55] },
    { name: 'Power Drill, Dewalt 20V Cordless Kit',           unitPrice: [120, 220] },
    { name: 'Circular Saw, 7-1/4" 15A',                      unitPrice: [75, 140] },
    { name: 'Shop Vacuum, 16gal Wet/Dry',                    unitPrice: [65, 120] },
    { name: 'Pressure Washer, 3000 PSI Electric',            unitPrice: [180, 350] },
    { name: 'Step Ladder, Fiberglass 8ft',                   unitPrice: [85, 165] },
    { name: 'Extension Ladder, Aluminum 24ft',               unitPrice: [145, 280] },
    { name: 'Cable Ties, 11" UV-Resistant (Pack/100)',        unitPrice: [10, 18] },
    { name: 'Work Gloves, Leather Palm (Pair)',               unitPrice: [12, 22] },
    { name: 'Safety Glasses, Anti-Fog (Box/12)',              unitPrice: [25, 45] },
  ],
  'IT Hardware': [
    { name: 'Laptop, Dell Latitude 5540 15"',                unitPrice: [850, 1400] },
    { name: 'Monitor, 24" LED 1080p',                        unitPrice: [160, 320] },
    { name: 'Wireless Keyboard & Mouse Combo',               unitPrice: [35, 75] },
    { name: 'Network Switch, 24-Port Managed PoE',           unitPrice: [280, 650] },
    { name: 'UPS Battery Backup 1500VA',                     unitPrice: [110, 220] },
    { name: 'USB-C Docking Station, Dual Monitor',           unitPrice: [95, 185] },
    { name: 'External SSD 2TB USB-C',                        unitPrice: [85, 160] },
    { name: 'Webcam, 1080p Logitech C920',                   unitPrice: [55, 90] },
    { name: 'Ethernet Cable Cat6, 1000ft Spool',             unitPrice: [120, 200] },
    { name: 'Surge Protector 8-Outlet 6ft',                  unitPrice: [18, 35] },
  ],
  'Vehicle Parts': [
    { name: 'Engine Oil Filter, AC Delco',                   unitPrice: [8, 18] },
    { name: 'Air Filter, Engine Panel',                      unitPrice: [15, 35] },
    { name: 'Brake Pad Set, Front OEM',                      unitPrice: [35, 80] },
    { name: 'Wiper Blade Set, 18"/22"',                      unitPrice: [20, 40] },
    { name: 'Battery, 12V 750 CCA Group 65',                 unitPrice: [85, 160] },
    { name: 'ATF Transmission Fluid, 1 Quart',               unitPrice: [10, 20] },
    { name: 'Coolant/Antifreeze, Premixed 1 Gallon',         unitPrice: [12, 22] },
    { name: 'Spark Plug Set, Iridium (Set/8)',               unitPrice: [45, 90] },
    { name: 'Tire Pressure Gauge, Digital',                  unitPrice: [12, 25] },
    { name: 'Jumper Cables, 20ft 4-Gauge',                   unitPrice: [22, 45] },
  ],
  'Safety Equipment': [
    { name: 'Hard Hat, ANSI Type I White',                   unitPrice: [18, 38] },
    { name: 'High-Visibility Vest, Class 3 (ANSI)',          unitPrice: [22, 45] },
    { name: 'Traffic Cone, 28" Orange (Each)',               unitPrice: [14, 28] },
    { name: 'First Aid Kit, ANSI Class B 50-Person',         unitPrice: [55, 110] },
    { name: 'Fire Extinguisher, ABC 5lb',                    unitPrice: [35, 70] },
    { name: 'Fall Protection Harness, Full-Body',            unitPrice: [65, 130] },
    { name: 'Steel-Toe Work Boots (Pair)',                   unitPrice: [75, 160] },
    { name: 'Earmuffs, 25 NRR',                              unitPrice: [22, 45] },
    { name: 'N95 Respirators (Box/20)',                      unitPrice: [18, 38] },
    { name: 'Eye Wash Station, Portable',                    unitPrice: [45, 90] },
  ],
  'Tools': [
    { name: 'Torque Wrench, 1/2" Drive 10-150 ft-lb',        unitPrice: [55, 120] },
    { name: 'Socket Set, Metric 3/8" Drive (40 pc)',          unitPrice: [45, 95] },
    { name: 'Screwdriver Set, Insulated (8 pc)',              unitPrice: [25, 55] },
    { name: 'Adjustable Wrench, 12"',                        unitPrice: [18, 38] },
    { name: 'Pipe Wrench, 18"',                              unitPrice: [28, 58] },
    { name: 'Tape Measure, 25ft Magnetic',                   unitPrice: [15, 30] },
    { name: 'Level, 48" Aluminum I-Beam',                    unitPrice: [22, 48] },
    { name: 'Hacksaw, 12" Adjustable Frame',                 unitPrice: [18, 35] },
    { name: 'Bolt Cutter, 18"',                              unitPrice: [30, 65] },
    { name: 'Pry Bar Set (3 pc)',                            unitPrice: [22, 45] },
  ],
  'Cleaning Supplies': [
    { name: 'Multi-Surface Cleaner, 1 Gallon Concentrate',   unitPrice: [12, 25] },
    { name: 'Disinfectant Spray, Lysol (Case/12 cans)',       unitPrice: [38, 65] },
    { name: 'Loop Mop Heads, 24oz Cotton (Each)',             unitPrice: [8, 16] },
    { name: 'Trash Bags, 33gal Low-Density (Box/100)',        unitPrice: [22, 42] },
    { name: 'Paper Towels, 2-Ply Jumbo Roll (Case/6)',        unitPrice: [45, 80] },
    { name: 'Liquid Hand Soap, Antibacterial 1 Gallon',       unitPrice: [12, 22] },
    { name: 'Floor Finish Wax, High Gloss 5 Gallon',         unitPrice: [55, 95] },
    { name: 'Glass Cleaner Spray (Case/12)',                  unitPrice: [28, 52] },
    { name: 'Heavy Duty Scrubbing Pads (Case/30)',            unitPrice: [18, 35] },
    { name: 'Nitrile Rubber Gloves, Med (Box/50)',            unitPrice: [18, 35] },
  ],
  'Medical Supplies': [
    { name: 'Nitrile Exam Gloves, M (Box/100)',               unitPrice: [12, 22] },
    { name: 'Adhesive Bandages, Assorted (Box/100)',          unitPrice: [8, 18] },
    { name: 'Antiseptic Wipes, Individual (Box/100)',         unitPrice: [12, 22] },
    { name: 'Aneroid Blood Pressure Cuff w/ Stethoscope',     unitPrice: [28, 65] },
    { name: 'Digital Thermometer, Forehead (Each)',           unitPrice: [18, 45] },
    { name: 'CPR Face Shield & Glove Set (Pack/10)',          unitPrice: [22, 42] },
    { name: 'Sterile Gauze Pads, 4×4 (Box/100)',             unitPrice: [10, 20] },
    { name: 'Medical Tape, 1" Paper (Roll)',                  unitPrice: [3, 8] },
    { name: 'Saline Solution, 0.9% 500ml (Case/12)',          unitPrice: [38, 70] },
    { name: 'Instant Cold Pack (Case/24)',                    unitPrice: [28, 55] },
  ],
};
const inventoryCategories = Object.keys(inventoryItemsByCategory);

const inventorySuppliers = [
  'Staples Advantage', 'W.W. Grainger Inc.', 'CDW Government LLC', 'NAPA Auto Parts',
  'McKesson Medical Supply', 'Fisher Scientific', 'Wesco International',
  'Office Depot Business Solutions', 'AutoZone Commercial', 'Zoro Tools Inc.',
];

// ─── Work orders ───────────────────────────────────────────────────────────────
const workOrderTypes = ['Maintenance', 'Repair', 'Installation', 'Inspection', 'Cleaning', 'Upgrade', 'Emergency', 'Preventive'];

const workOrderDescriptionsByType: Record<string, string[]> = {
  'Maintenance': [
    'HVAC filter replacement and system inspection', 'Roof drain cleaning and debris removal',
    'Parking lot light bulb and fixture replacement', 'Elevator preventive maintenance service',
    'Generator monthly maintenance and load test', 'Boiler tune-up and flue cleaning',
  ],
  'Repair': [
    'Broken exterior window repair - lobby entrance', 'Restroom plumbing leak - 2nd floor men\'s room',
    'Pothole repair - main entrance approach lane', 'Interior door handle and lock replacement',
    'Leaking flat roof section - east wing patch', 'Damaged floor tile replacement - hallway B',
  ],
  'Installation': [
    'New security camera installation - east parking lot', 'ADA compliant ramp installation at rear entry',
    'Bike rack installation at main entrance', 'EV charging station install - spots 12-14',
    'Exterior digital signage installation', 'LED exit sign replacement - all stairwells',
  ],
  'Inspection': [
    'Annual fire suppression system inspection', 'Pre-occupancy building safety inspection',
    'Elevator annual inspection and certification', 'Boiler inspection and pressure certification',
    'Electrical panel safety inspection', 'Backflow preventer annual test',
  ],
  'Cleaning': [
    'Pressure wash exterior entry walkways', 'Deep clean restroom facilities - full building',
    'Carpet shampooing - conference rooms 1-4', 'Graffiti removal - west exterior wall',
    'Post-event cleanup - community center', 'HVAC duct cleaning and sanitizing',
  ],
  'Upgrade': [
    'LED lighting retrofit - parking garage levels 1-3', 'Building access card reader system upgrade',
    'HVAC building automation controls upgrade', 'Restroom fixture modernization - 1st floor',
    'Fire alarm panel upgrade to addressable system', 'Intercom system replacement - all floors',
  ],
  'Emergency': [
    'Burst water supply line - basement mechanical room', 'Storm damage roof repair - emergency tarping',
    'Electrical short circuit repair - panel B', 'Sewage backup emergency cleanup - basement restroom',
    'Heating system failure during cold weather event', 'Broken water main - exterior service line',
  ],
  'Preventive': [
    'Annual roof inspection and sealant application', 'Quarterly pest control treatment',
    'Semi-annual emergency electrical testing', 'Monthly emergency lighting & exit sign test',
    'Water heater flush and pressure relief inspection', 'Quarterly fire extinguisher inspection',
  ],
};

const workOrderLocations = [
  'City Hall - Main Lobby', 'City Hall - Basement Mechanical', 'City Hall - Rm 201',
  'Main Library - 1st Floor', 'Main Library - Community Room',
  'Police Department - Lobby', 'Police Department - Holding Area',
  'Fire Station #1', 'Fire Station #3', 'Public Works Maintenance Yard',
  'Municipal Pool - Natatorium', 'Senior Center - Main Hall',
  'Community Center - Gym', 'Water Treatment Plant - Pump Room',
  'Transit Bus Terminal', 'Animal Services Shelter',
  'Municipal Court - Courtroom A', 'Health Clinic - Main St',
  'Recreation Center - Weight Room', 'Cemetery Administration Office',
];

// ─── Financial ─────────────────────────────────────────────────────────────────
const assetCategories = ['Current Assets', 'Fixed Assets', 'Intangible Assets', 'Investments'];
const revenueCategories = ['Tax Revenue', 'Service Charges', 'Fines & Penalties', 'Intergovernmental', 'Investment Income', 'Other Revenue'];

const accountNames = {
  assets: ['Cash & Cash Equivalents', 'Accounts Receivable', 'Inventory', 'Prepaid Expenses', 'Investments', 'Property, Plant & Equipment', 'Accumulated Depreciation', 'Intangible Assets', 'Other Assets'],
  liabilities: ['Accounts Payable', 'Accrued Liabilities', 'Deferred Revenue', 'Bonds Payable', 'Notes Payable', 'Pension Liabilities', 'Other Long-term Liabilities'],
  equity: ['Fund Balance', 'Reserved Fund Balance', 'Unreserved Fund Balance', 'Designated Fund Balance'],
  revenue: ['Property Taxes', 'Sales Taxes', 'Income Taxes', 'Utility Charges', 'Permit Fees', 'License Fees', 'Fines & Penalties', 'Investment Income'],
  expenses: ['Salaries & Wages', 'Employee Benefits', 'Contract Services', 'Supplies', 'Utilities', 'Insurance', 'Depreciation', 'Interest Expense'],
};

// ─── Core helpers ──────────────────────────────────────────────────────────────
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateSSN = () => {
  // Avoid SSA-invalid area numbers: 000, 666, 900-999
  let area: number;
  do { area = generateRandomNumber(1, 899); } while (area === 666);
  return `${area.toString().padStart(3, '0')}-${generateRandomNumber(10, 99)}-${generateRandomNumber(1000, 9999)}`;
};

const generateEmployeeId = () => `EMP-${generateRandomNumber(10000, 99999)}`;
const generateContractNumber = () => `CT-${new Date().getFullYear()}-${generateRandomNumber(10000, 99999)}`;
const generatePermitNumber = () => `${new Date().getFullYear()}-BP-${generateRandomNumber(10000, 99999)}`;
const generateLicenseNumber = () => `BL-${new Date().getFullYear().toString().slice(2)}-${generateRandomNumber(100000, 999999)}`;
const generatePONumber = () => `PO-${new Date().getFullYear()}-${generateRandomNumber(10000, 99999)}`;
const generateInvoiceNumber = () => `INV-${new Date().getFullYear()}-${generateRandomNumber(10000, 99999)}`;
const generateWorkOrderNumber = () => `WO-${new Date().getFullYear()}-${generateRandomNumber(10000, 99999)}`;
const generateFiscalYear = (offset = 0) => {
  const y = new Date().getFullYear() - generateRandomNumber(0, 3) + offset;
  return `FY${y}-${(y + 1).toString().slice(2)}`;
};

const generateAssetTag = (assetType: string) => {
  const prefixMap: Record<string, string> = {
    'Vehicle': 'VEH', 'Building': 'BLD', 'Technology': 'TEC',
    'Equipment': 'EQP', 'Machinery': 'MCH', 'Infrastructure': 'INF',
    'Land': 'LND', 'Facility': 'FAC',
  };
  const prefix = prefixMap[assetType] || 'AST';
  return `${prefix}-${generateRandomNumber(10000, 99999)}`;
};

const generateSerialNumber = (assetType: string) => {
  const prefixMap: Record<string, string> = {
    'Vehicle': 'VIN', 'Technology': 'SN', 'Equipment': 'EQ',
    'Machinery': 'MFG', 'Facility': 'FA', 'Building': 'BLD',
    'Infrastructure': 'INF', 'Land': 'APN',
  };
  const prefix = prefixMap[assetType] || 'SN';
  return `${prefix}-${generateRandomNumber(10000, 99999)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

const generatePhone = (areaCode: string) =>
  `(${areaCode}) ${generateRandomNumber(200, 999)}-${generateRandomNumber(1000, 9999)}`;

const generateAddress = () =>
  `${generateRandomNumber(100, 9999)} ${pick(streetNames)} ${pick(streetTypes)}`;

const generateFinancialAmount = (min: number, max: number) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));

const generateAccountNumber = (category: string) => {
  const prefixes: Record<string, string> = {
    assets: '1', liabilities: '2', equity: '3', revenue: '4', expenses: '5',
  };
  const p = prefixes[category] || '0';
  return `${p}${generateRandomNumber(1000, 4999).toString().padStart(4, '0')}`;
};

// ─── Main export ───────────────────────────────────────────────────────────────
export const generateMockData = (type: string, count: number, fields: string[]) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    let record: Record<string, unknown> = {};
    const loc = pick(locationData);

    switch (type) {
      case 'citizens': {
        const firstName = pick(firstNames);
        const lastName  = pick(lastNames);
        if (fields.includes('id'))              record.id              = i + 1;
        if (fields.includes('firstName'))       record.firstName       = firstName;
        if (fields.includes('lastName'))        record.lastName        = lastName;
        if (fields.includes('ssn'))             record.ssn             = generateSSN();
        if (fields.includes('dateOfBirth'))     record.dateOfBirth     = generateRandomDate(new Date(1945, 0, 1), new Date(2005, 11, 31)).toISOString().split('T')[0];
        if (fields.includes('address'))         record.address         = generateAddress();
        if (fields.includes('city'))            record.city            = loc.city;
        if (fields.includes('state'))           record.state           = loc.state;
        if (fields.includes('zipCode'))         record.zipCode         = `${loc.zipPrefix}${generateRandomNumber(10, 99)}`;
        if (fields.includes('phone'))           record.phone           = generatePhone(loc.areaCode);
        if (fields.includes('voterRegistered')) record.voterRegistered = Math.random() > 0.28;
        break;
      }

      case 'employees': {
        const firstName  = pick(firstNames);
        const lastName   = pick(lastNames);
        const dept       = pick(departments);
        const positions  = positionsByDepartment[dept] ?? positionsByDepartment['Finance'];
        const position   = pick(positions);
        if (fields.includes('id'))             record.id             = i + 1;
        if (fields.includes('employeeId'))     record.employeeId     = generateEmployeeId();
        if (fields.includes('firstName'))      record.firstName      = firstName;
        if (fields.includes('lastName'))       record.lastName       = lastName;
        if (fields.includes('department'))     record.department     = dept;
        if (fields.includes('position'))       record.position       = position.title;
        if (fields.includes('hireDate'))       record.hireDate       = generateRandomDate(new Date(2005, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('salary'))         record.salary         = generateRandomNumber(position.min, position.max);
        if (fields.includes('email'))          record.email          = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${loc.city.toLowerCase().replace(/\s/g, '')}.gov`;
        if (fields.includes('phone'))          record.phone          = generatePhone(loc.areaCode);
        if (fields.includes('clearanceLevel')) record.clearanceLevel = pick(['Public', 'Confidential', 'Secret', 'Top Secret']);
        break;
      }

      case 'services': {
        const serviceName = pick(serviceTypes);
        const dept        = pick(departments);
        if (fields.includes('id'))               record.id               = i + 1;
        if (fields.includes('serviceName'))      record.serviceName      = serviceName;
        if (fields.includes('department'))       record.department       = dept;
        if (fields.includes('description'))      record.description      = `${serviceName} services administered by the ${dept} department`;
        if (fields.includes('isActive'))         record.isActive         = Math.random() > 0.08;
        if (fields.includes('budget'))           record.budget           = generateFinancialAmount(50000, 4500000);
        if (fields.includes('contactPhone'))     record.contactPhone     = generatePhone(loc.areaCode);
        if (fields.includes('website'))          record.website          = `https://${loc.city.toLowerCase().replace(/\s/g, '')}.gov/${serviceName.toLowerCase().replace(/[\s&]+/g, '-')}`;
        if (fields.includes('hoursOfOperation')) record.hoursOfOperation = pick(['Mon-Fri 8:00 AM – 5:00 PM', 'Mon-Fri 7:30 AM – 4:30 PM', '24 / 7 Emergency Line', 'Mon-Fri 9:00 AM – 3:00 PM', 'Mon-Sat 7:00 AM – 6:00 PM']);
        break;
      }

      case 'contracts': {
        const vendor       = pick(vendors);
        const contractType = pick(contractTypes);
        const dept         = pick(departments);
        const startDate    = generateRandomDate(new Date(2022, 0, 1), new Date());
        const endDate      = generateRandomDate(startDate, new Date(startDate.getTime() + 730 * 24 * 60 * 60 * 1000));
        if (fields.includes('id'))             record.id             = i + 1;
        if (fields.includes('contractNumber')) record.contractNumber = generateContractNumber();
        if (fields.includes('vendor'))         record.vendor         = vendor;
        if (fields.includes('contractType'))   record.contractType   = contractType;
        if (fields.includes('value'))          record.value          = generateFinancialAmount(15000, 4500000);
        if (fields.includes('startDate'))      record.startDate      = startDate.toISOString().split('T')[0];
        if (fields.includes('endDate'))        record.endDate        = endDate.toISOString().split('T')[0];
        if (fields.includes('status'))         record.status         = pick(['Active', 'Pending Award', 'Completed', 'Cancelled', 'Under Review', 'Renewal Pending']);
        if (fields.includes('department'))     record.department     = dept;
        if (fields.includes('description'))    record.description    = `${contractType} services contract – ${dept}`;
        break;
      }

      case 'municipalAssets': {
        const assetType = pick(assetTypes);
        const descriptions = assetsByType[assetType];
        const description  = pick(descriptions);
        const dept         = pick(departments);
        const purchaseDate = generateRandomDate(new Date(2010, 0, 1), new Date());
        const purchaseValue = generateFinancialAmount(5000, 850000);
        const yearsOld = (Date.now() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        const depRate  = assetType === 'Land' ? 1.0 : Math.max(0.15, 1 - yearsOld * 0.07);
        if (fields.includes('id'))            record.id            = i + 1;
        if (fields.includes('assetTag'))      record.assetTag      = generateAssetTag(assetType);
        if (fields.includes('assetType'))     record.assetType     = assetType;
        if (fields.includes('description'))   record.description   = description;
        if (fields.includes('department'))    record.department    = dept;
        if (fields.includes('purchaseDate'))  record.purchaseDate  = purchaseDate.toISOString().split('T')[0];
        if (fields.includes('purchaseValue')) record.purchaseValue = parseFloat(purchaseValue.toFixed(2));
        if (fields.includes('currentValue'))  record.currentValue  = parseFloat((purchaseValue * depRate).toFixed(2));
        if (fields.includes('condition'))     record.condition     = pick(['Excellent', 'Good', 'Fair', 'Poor', 'Needs Replacement']);
        if (fields.includes('location'))      record.location      = `${loc.city} – ${dept}`;
        if (fields.includes('serialNumber'))  record.serialNumber  = generateSerialNumber(assetType);
        break;
      }

      case 'budget': {
        const dept = pick(departments);
        const fy   = new Date().getFullYear() - generateRandomNumber(0, 3);
        const fyLabel = `FY${fy}-${(fy + 1).toString().slice(2)}`;
        const budgeted = generateFinancialAmount(80000, 4500000);
        const spentPct = 0.2 + Math.random() * 0.75;
        const spent    = parseFloat((budgeted * spentPct).toFixed(2));
        if (fields.includes('id'))             record.id             = i + 1;
        if (fields.includes('fiscalYear'))     record.fiscalYear     = fyLabel;
        if (fields.includes('department'))     record.department     = dept;
        if (fields.includes('category'))       record.category       = pick(['Personnel', 'Operations', 'Capital Projects', 'Utilities', 'Supplies & Materials', 'Contract Services', 'Equipment', 'Maintenance & Repair']);
        if (fields.includes('budgetedAmount')) record.budgetedAmount = parseFloat(budgeted.toFixed(2));
        if (fields.includes('spentAmount'))    record.spentAmount    = spent;
        if (fields.includes('remainingAmount'))record.remainingAmount= parseFloat((budgeted - spent).toFixed(2));
        if (fields.includes('percentSpent'))   record.percentSpent   = parseFloat((spentPct * 100).toFixed(1));
        if (fields.includes('lastUpdated'))    record.lastUpdated    = generateRandomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('status'))         record.status         = spentPct > 0.95 ? 'Over Budget' : spentPct > 0.80 ? 'Near Limit' : 'On Track';
        break;
      }

      case 'permits': {
        const permitType = pick(permitTypes);
        const feeRange   = permitFeeRanges[permitType] ?? { min: 100, max: 2000 };
        const appDate    = generateRandomDate(new Date(2022, 0, 1), new Date());
        const issued     = Math.random() > 0.25;
        const issueDate  = issued ? generateRandomDate(appDate, new Date(appDate.getTime() + 45 * 24 * 60 * 60 * 1000)) : null;
        if (fields.includes('id'))              record.id              = i + 1;
        if (fields.includes('permitNumber'))    record.permitNumber    = generatePermitNumber();
        if (fields.includes('permitType'))      record.permitType      = permitType;
        if (fields.includes('applicantName'))   record.applicantName   = `${pick(firstNames)} ${pick(lastNames)}`;
        if (fields.includes('propertyAddress')) record.propertyAddress = `${generateAddress()}, ${loc.city}, ${loc.state}`;
        if (fields.includes('applicationDate')) record.applicationDate = appDate.toISOString().split('T')[0];
        if (fields.includes('issueDate'))       record.issueDate       = issueDate ? issueDate.toISOString().split('T')[0] : null;
        if (fields.includes('expirationDate'))  record.expirationDate  = issueDate
          ? new Date(issueDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : null;
        if (fields.includes('status'))          record.status          = pick(['Pending Review', 'Under Review', 'Approved', 'Issued', 'Denied', 'Expired', 'On Hold']);
        if (fields.includes('feeAmount'))       record.feeAmount       = generateFinancialAmount(feeRange.min, feeRange.max);
        if (fields.includes('inspector'))       record.inspector       = `${pick(firstNames)} ${pick(lastNames)}`;
        if (fields.includes('description'))     record.description     = `${permitType} – ${generateAddress()}`;
        break;
      }

      case 'licenses': {
        const licenseType  = pick(licenseTypes);
        const feeRange     = licenseFeeRanges[licenseType] ?? { min: 100, max: 500 };
        const bizNames     = businessNamesByLicenseType[licenseType] ?? ['(Personal License)'];
        const appDate      = generateRandomDate(new Date(2021, 0, 1), new Date());
        const issued       = Math.random() > 0.15;
        const issueDate    = issued ? generateRandomDate(appDate, new Date(appDate.getTime() + 60 * 24 * 60 * 60 * 1000)) : null;
        if (fields.includes('id'))              record.id              = i + 1;
        if (fields.includes('licenseNumber'))   record.licenseNumber   = generateLicenseNumber();
        if (fields.includes('licenseType'))     record.licenseType     = licenseType;
        if (fields.includes('businessName'))    record.businessName    = pick(bizNames);
        if (fields.includes('ownerName'))       record.ownerName       = `${pick(firstNames)} ${pick(lastNames)}`;
        if (fields.includes('businessAddress')) record.businessAddress = `${generateAddress()}, ${loc.city}, ${loc.state}`;
        if (fields.includes('applicationDate')) record.applicationDate = appDate.toISOString().split('T')[0];
        if (fields.includes('issueDate'))       record.issueDate       = issueDate ? issueDate.toISOString().split('T')[0] : null;
        if (fields.includes('renewalDate'))     record.renewalDate     = issueDate
          ? new Date(issueDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : null;
        if (fields.includes('status'))          record.status          = pick(['Active', 'Expired', 'Suspended', 'Pending Renewal', 'Under Review', 'Revoked']);
        if (fields.includes('annualFee'))       record.annualFee       = generateFinancialAmount(feeRange.min, feeRange.max);
        if (fields.includes('phone'))           record.phone           = generatePhone(loc.areaCode);
        break;
      }

      case 'purchaseOrders': {
        const vendor  = pick(vendors);
        const dept    = pick(departments);
        const status  = pick(['Draft', 'Submitted', 'Approved', 'Ordered', 'Received', 'Cancelled']);
        const orderDate = generateRandomDate(new Date(2023, 0, 1), new Date());
        if (fields.includes('id'))           record.id           = i + 1;
        if (fields.includes('poNumber'))     record.poNumber     = generatePONumber();
        if (fields.includes('vendor'))       record.vendor       = vendor;
        if (fields.includes('department'))   record.department   = dept;
        if (fields.includes('description'))  record.description  = `${pick(contractTypes)} – ${dept}`;
        if (fields.includes('orderDate'))    record.orderDate    = orderDate.toISOString().split('T')[0];
        if (fields.includes('requestedBy'))  record.requestedBy  = `${pick(firstNames)} ${pick(lastNames)}`;
        if (fields.includes('totalAmount'))  record.totalAmount  = generateFinancialAmount(500, 250000);
        if (fields.includes('status'))       record.status       = status;
        if (fields.includes('deliveryDate')) record.deliveryDate = generateRandomDate(orderDate, new Date(orderDate.getTime() + 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        if (fields.includes('approvedBy'))   record.approvedBy   = status === 'Draft' ? null : `${pick(firstNames)} ${pick(lastNames)}`;
        break;
      }

      case 'invoices': {
        const vendor      = pick(vendors);
        const status      = pick(['Pending', 'Approved', 'Paid', 'Overdue', 'Disputed']);
        const invoiceDate = generateRandomDate(new Date(2023, 0, 1), new Date());
        const dueDate     = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        if (fields.includes('id'))            record.id            = i + 1;
        if (fields.includes('invoiceNumber')) record.invoiceNumber = generateInvoiceNumber();
        if (fields.includes('vendor'))        record.vendor        = vendor;
        if (fields.includes('poNumber'))      record.poNumber      = generatePONumber();
        if (fields.includes('invoiceDate'))   record.invoiceDate   = invoiceDate.toISOString().split('T')[0];
        if (fields.includes('dueDate'))       record.dueDate       = dueDate.toISOString().split('T')[0];
        if (fields.includes('amount'))        record.amount        = generateFinancialAmount(250, 85000);
        if (fields.includes('status'))        record.status        = status;
        if (fields.includes('department'))    record.department    = pick(departments);
        if (fields.includes('description'))   record.description   = `Invoice for ${pick(contractTypes).toLowerCase()} services`;
        if (fields.includes('paymentDate'))   record.paymentDate   = status === 'Paid'
          ? generateRandomDate(invoiceDate, new Date()).toISOString().split('T')[0]
          : null;
        break;
      }

      case 'inventory': {
        const category = pick(inventoryCategories);
        const items    = inventoryItemsByCategory[category];
        const item     = pick(items);
        const qty      = generateRandomNumber(0, 250);
        const unitPrice = generateFinancialAmount(item.unitPrice[0], item.unitPrice[1]);
        const itemCode  = `${category.substring(0, 3).toUpperCase().replace(/\s/g,'')}-${generateRandomNumber(10000, 99999)}`;
        if (fields.includes('id'))           record.id           = i + 1;
        if (fields.includes('itemCode'))     record.itemCode     = itemCode;
        if (fields.includes('itemName'))     record.itemName     = item.name;
        if (fields.includes('category'))     record.category     = category;
        if (fields.includes('description'))  record.description  = item.name;
        if (fields.includes('quantity'))     record.quantity     = qty;
        if (fields.includes('unitPrice'))    record.unitPrice    = parseFloat(unitPrice.toFixed(2));
        if (fields.includes('totalValue'))   record.totalValue   = parseFloat((qty * unitPrice).toFixed(2));
        if (fields.includes('location'))     record.location     = `Warehouse ${pick(['A', 'B', 'C', 'D'])}-${generateRandomNumber(1, 30).toString().padStart(2, '0')}`;
        if (fields.includes('reorderLevel')) record.reorderLevel = generateRandomNumber(5, 50);
        if (fields.includes('supplier'))     record.supplier     = pick(inventorySuppliers);
        if (fields.includes('lastUpdated'))  record.lastUpdated  = generateRandomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
        break;
      }

      case 'workOrders': {
        const woType    = pick(workOrderTypes);
        const descs     = workOrderDescriptionsByType[woType];
        const status    = pick(['Open', 'In Progress', 'Completed', 'On Hold', 'Cancelled']);
        const reqDate   = generateRandomDate(new Date(2023, 0, 1), new Date());
        const schedDate = generateRandomDate(reqDate, new Date(reqDate.getTime() + 21 * 24 * 60 * 60 * 1000));
        if (fields.includes('id'))              record.id              = i + 1;
        if (fields.includes('workOrderNumber')) record.workOrderNumber = generateWorkOrderNumber();
        if (fields.includes('workOrderType'))   record.workOrderType   = woType;
        if (fields.includes('description'))     record.description     = pick(descs);
        if (fields.includes('location'))        record.location        = pick(workOrderLocations);
        if (fields.includes('requestDate'))     record.requestDate     = reqDate.toISOString().split('T')[0];
        if (fields.includes('scheduledDate'))   record.scheduledDate   = schedDate.toISOString().split('T')[0];
        if (fields.includes('assignedTo'))      record.assignedTo      = `${pick(firstNames)} ${pick(lastNames)}`;
        if (fields.includes('priority'))        record.priority        = pick(['Low', 'Medium', 'High', 'Emergency']);
        if (fields.includes('status'))          record.status          = status;
        if (fields.includes('estimatedCost'))   record.estimatedCost   = generateFinancialAmount(150, 45000);
        if (fields.includes('completionDate'))  record.completionDate  = status === 'Completed'
          ? generateRandomDate(schedDate, new Date()).toISOString().split('T')[0]
          : null;
        break;
      }

      case 'balanceSheet': {
        const sectionMap: Array<'assets' | 'liabilities' | 'equity'> = ['assets', 'liabilities', 'equity'];
        const section = sectionMap[i < Math.floor(count / 3) ? 0 : i < Math.floor((count * 2) / 3) ? 1 : 2];
        // Prior and current period are correlated (±12% year-over-year change)
        const current  = generateFinancialAmount(50000, 8000000);
        const changeMultiplier = 0.88 + Math.random() * 0.24; // 0.88–1.12
        const prior    = parseFloat((current * changeMultiplier).toFixed(2));
        const change   = parseFloat((current - prior).toFixed(2));
        if (fields.includes('id'))            record.id            = i + 1;
        if (fields.includes('accountNumber')) record.accountNumber = generateAccountNumber(section);
        if (fields.includes('accountName'))   record.accountName   = pick(accountNames[section]);
        if (fields.includes('category')) {
          const catMap = {
            assets: assetCategories,
            liabilities: ['Current Liabilities', 'Long-term Liabilities', 'Contingent Liabilities'],
            equity: ['Contributed Capital', 'Retained Earnings', 'Accumulated Other Comprehensive Income'],
          };
          record.category = pick(catMap[section]);
        }
        if (fields.includes('currentPeriod')) record.currentPeriod = current;
        if (fields.includes('priorPeriod'))   record.priorPeriod   = prior;
        if (fields.includes('change'))        record.change        = change;
        if (fields.includes('changePercent')) record.changePercent = parseFloat(((change / prior) * 100).toFixed(2));
        if (fields.includes('fiscalYear'))    record.fiscalYear    = generateFiscalYear();
        if (fields.includes('fund'))          record.fund          = pick(['General Fund', 'Special Revenue Fund', 'Capital Projects Fund', 'Debt Service Fund', 'Enterprise Fund']);
        if (fields.includes('department'))    record.department    = pick(departments);
        if (fields.includes('notes'))         record.notes         = `Balance as of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        break;
      }

      case 'incomeStatement': {
        const isRevenue = Math.random() > 0.45;
        const category  = isRevenue ? pick(revenueCategories) : pick(['Personnel Costs', 'Contractual Services', 'Supplies & Materials', 'Utilities', 'Capital Outlay', 'Debt Service']);
        const acctName  = isRevenue ? pick(accountNames.revenue) : pick(accountNames.expenses);
        // Actual amount is within ±18% of budget (realistic variance)
        const budgeted  = generateFinancialAmount(80000, 3500000);
        const variancePct = (Math.random() * 0.36) - 0.18; // ±18%
        const actual    = parseFloat((budgeted * (1 + variancePct)).toFixed(2));
        const variance  = parseFloat((actual - budgeted).toFixed(2));
        if (fields.includes('id'))              record.id              = i + 1;
        if (fields.includes('accountNumber'))   record.accountNumber   = generateAccountNumber(isRevenue ? 'revenue' : 'expenses');
        if (fields.includes('accountName'))     record.accountName     = acctName;
        if (fields.includes('category'))        record.category        = category;
        if (fields.includes('budgetedAmount'))  record.budgetedAmount  = parseFloat(budgeted.toFixed(2));
        if (fields.includes('actualAmount'))    record.actualAmount    = actual;
        if (fields.includes('variance'))        record.variance        = variance;
        if (fields.includes('variancePercent')) record.variancePercent = parseFloat((variancePct * 100).toFixed(2));
        if (fields.includes('fiscalYear'))      record.fiscalYear      = generateFiscalYear();
        if (fields.includes('period'))          record.period          = pick(['Q1', 'Q2', 'Q3', 'Q4', 'Annual']);
        if (fields.includes('fund'))            record.fund            = pick(['General Fund', 'Special Revenue Fund', 'Capital Projects Fund', 'Debt Service Fund', 'Enterprise Fund']);
        if (fields.includes('department'))      record.department      = pick(departments);
        if (fields.includes('notes'))           record.notes           = `${isRevenue ? 'Revenue' : 'Expenditure'} – ${record.period} ${record.fiscalYear}`;
        break;
      }

      default:
        record = { id: i + 1, name: `Item ${i + 1}` };
    }

    data.push(record);
  }

  return data;
};

export const convertToCSV = (data: Record<string, unknown>[]) => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  return csvContent;
};
