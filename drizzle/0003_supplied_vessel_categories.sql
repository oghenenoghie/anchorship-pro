-- The nine vessel categories supplied by the business (src/lib/vessel-categories.ts). Reference data the public
-- category pages depend on, so it ships as a migration rather than seed data. Existing categories, including the
-- earlier placeholder categories and any vessels assigned to them, are left untouched.
INSERT INTO "vessel_categories" ("name", "slug", "description") VALUES
  ('FPSO, FDPSO and FSO', 'fpso-fdpso-fso', 'Floating production, storage and offloading units (FPSO), their drilling-capable counterparts (FDPSO) and floating storage and offloading units (FSO) for field development, extended well tests and offshore storage.'),
  ('Pipe and Cable Laying Vessels', 'pipe-and-cable-laying-vessels', 'Pipe-lay and cable-lay vessels equipped with reels, carousels, tensioners or lay towers for installing subsea pipelines, flexibles, umbilicals and power or communication cables.'),
  ('Tanker Vessels', 'tanker-vessels', 'Tanker vessels for the carriage and floating storage of liquid cargoes, including crude oil, refined products, chemicals and liquefied gas.'),
  ('Tugboats and Towage', 'tugboats-and-towage', 'Harbour, coastal and ocean-going tugs for towage, ship assistance, and the towing, positioning and mooring of barges, rigs and offshore units.'),
  ('Workboats', 'workboats', 'Multipurpose workboats and utility vessels with open working decks for marine construction support, deck cargo, survey, buoy handling and general nearshore works.'),
  ('Well Intervention', 'well-intervention', 'Well intervention vessels with intervention towers, moonpools and well-control equipment for maintaining, logging and stimulating subsea wells without a drilling rig.'),
  ('Jack-up Rigs and Barges', 'jack-up-rigs-and-barges', 'Jack-up rigs and self-elevating barges that stand on the seabed for drilling, accommodation, maintenance and construction work, together with barges for marine transport and works.'),
  ('Pontoons', 'pontoons', 'Flat-deck and modular pontoons for transporting heavy loads and providing stable working platforms in ports, rivers and sheltered coastal waters.'),
  ('Dredgers', 'dredgers', 'Cutter suction, trailing suction hopper, backhoe and other dredgers for capital and maintenance dredging, land reclamation and seabed preparation.')
ON CONFLICT DO NOTHING;
