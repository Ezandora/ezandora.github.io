
var __skill_ids_to_names = {23001:"Dilatable Capillaries", 23002:"Upper Hypothalamus", 23003:"Thick Dermis", 23004:"High Water Content", 23005:"Sweat Glands", 23006:"Constrictable Capillaries", 23007:"Lower Hypothalamus", 23008:"Shiver Reflex", 23009:"Chatterable Teeth", 23010:"Subcutaneous Fat", 23011:"Nose Hair", 23012:"Pinchable Nose", 23013:"Nasal Lamina Propria", 23014:"Nasal Septum", 23015:"Olfactory Cortex", 23016:"Left Eyelid", 23017:"Right Eyelid", 23018:"Hyperactive Amygdala", 23019:"Adrenal Gland", 23020:"Bravery Gland", 23021:"Sense of Decorum", 23022:"Blush Reflex", 23023:"Sense of Propriety", 23024:"Politeness", 23025:"Profound Shame", 23026:"Rigid Armbones", 23027:"Rigid Legbones", 23028:"Rigid Pelvis", 23029:"Rigid Headbone", 23030:"Rigid Rib Cage", 23031:"Calluses", 23032:"Cartilage", 23033:"Spinal Discs", 23034:"Shock-Absorbing Joints", 23035:"Overalls", 23036:"Hamstrings", 23037:"Ankle Joints", 23038:"Kneecaps", 23039:"Achilles Tendons", 23040:"Anterior Cruciate Ligaments", 23041:"Work Ethic", 23042:"Basic Self-Worth", 23043:"Sense of Purpose", 23044:"Sense of Pride", 23045:"Arrogance", 23046:"Central Hypothalamus", 23047:"Rudimentary Alimentary Canal", 23048:"Stomach-Like Thing", 23049:"Small Intestine", 23050:"Large Intestine", 23051:"Lysosomes", 23052:"Mitochondria", 23053:"Ribosomes", 23054:"Vacuoles", 23055:"Golgi Apparatus", 23056:"Veins", 23057:"Arteries", 23058:"Small Left Kidney", 23059:"Oversized Right Kidney", 23060:"Beating Human Heart", 23061:"Left Brain Hemisphere", 23062:"Right Brain Hemisphere", 23063:"Parasympathetic Nervous System", 23064:"Sympathetic Nervous System", 23065:"Spinal Cord", 23066:"Left Eyeball", 23067:"Right Eyeball", 23068:"Optic Nerves", 23069:"Saccade Reflex", 23070:"Visual Cortex", 23071:"Pinky Fingers", 23072:"Ring Fingers", 23073:"Middle Fingers", 23074:"Index Fingers", 23075:"Thumbs", 23076:"The Concept of Property", 23077:"Financial Ambition", 23078:"Business Acumen", 23079:"Sense of Entitlement", 23080:"Pathological Greed", 23081:"Triceps", 23082:"Biceps", 23083:"Abdominal Muscles", 23084:"Pectoral Muscles", 23085:"Gluteus Maximus", 23086:"Object Permanence", 23087:"Abstract Reasoning", 23088:"Deductive Reasoning", 23089:"Introspection", 23090:"Algebra", 23091:"Sense of Style", 23092:"Vestibular System", 23093:"Sense of Humor", 23094:"Sense of Sarcasm", 23095:"Sunglasses", 23096:"Fingernails", 23097:"Palms", 23098:"Elbows", 23099:"Knees", 23100:"Knuckles", 23101:"Warm Smile", 23102:"Warm Heart", 23103:"Warm Blood", 23104:"Choleric Humours", 23105:"Hot Headedness", 23106:"Cool Head", 23107:"Cool Heels", 23108:"Cold Feet", 23109:"Cold Heart", 23110:"Ice Water In Your Veins", 23111:"Bad Breath", 23112:"Armpit Sweat Glands", 23113:"Armpit Hair", 23114:"Weak Esophageal Sphincter", 23115:"Thriving Gut Flora", 23116:"Sunken Cheeks", 23117:"Pallid Skin", 23118:"Dark Circles Under Your Eyes", 23119:"Vacant Stare", 23120:"Visible Skull", 23121:"Sweaty Palms", 23122:"Waxy Ears", 23123:"Oily Scalp", 23124:"Flop Sweat", 23125:"Thrustable Pelvis", 23301:"Bendable Knees", 23302:"Retractable Toes", 23303:"Ink Gland", 23304:"Frown Muscles", 23305:"Anger Glands", 23306:"Powerful Vocal Chords"};

var __skill_ids_to_descriptions = {23001:"Slight Hot Resistance (+1)", 23002:"Slight Hot Resistance (+1)", 23003:"So-So Hot Resistance (+2)", 23004:"So-So Hot Resistance (+2)", 23005:"Serious Hot Resistance (+3)", 23006:"Slight Cold Resistance (+1)", 23007:"Slight Cold Resistance (+1)", 23008:"So-So Cold Resistance (+2)", 23009:"So-So Cold Resistance (+2)", 23010:"Serious Cold Resistance (+3)", 23011:"Slight Stench  Resistance (+1)", 23012:"Slight Stench  Resistance (+1)", 23013:"So-So Stench  Resistance (+2)", 23014:"So-So Stench  Resistance (+2)", 23015:"Serious Stench  Resistance (+3)", 23016:"Slight Spooky Resistance (+1)", 23017:"Slight Spooky Resistance (+1)", 23018:"So-So Spooky Resistance (+2)", 23019:"So-So Spooky Resistance (+2)", 23020:"Serious Spooky Resistance (+3)", 23021:"Slight Sleaze Resistance (+1)", 23022:"Slight Sleaze Resistance (+1)", 23023:"So-So Sleaze Resistance (+2)", 23024:"So-So Sleaze Resistance (+2)", 23025:"Serious Sleaze Resistance (+3)", 23026:"Damage Absorption +30", 23027:"Damage Absorption +40", 23028:"Damage Absorption +50", 23029:"Damage Absorption +60", 23030:"Damage Absorption +70", 23031:"Damage Reduction: 5", 23032:"Damage Reduction: 5", 23033:"Damage Reduction: 10", 23034:"Damage Reduction: 10", 23035:"Damage Reduction: 20", 23036:"+10% Combat Initiative", 23037:"+20% Combat Initiative", 23038:"+30% Combat Initiative", 23039:"+40% Combat Initiative", 23040:"+50% Combat Initiative", 23041:"+3 Stats Per Fight", 23042:"+3 Stats Per Fight", 23043:"+5 Stats Per Fight", 23044:"+5 Stats Per Fight", 23045:"+7 Stats Per Fight", 23046:"+1 Adventures from absorbing items", 23047:"+1 Adventures from absorbing items", 23048:"+2 Adventures from absorbing items", 23049:"+2 Adventures from absorbing items", 23050:"+3 Adventures from absorbing items", 23051:"+5 Stats from absorbing items", 23052:"+10 Stats from absorbing items", 23053:"+15 Stats from absorbing items", 23054:"+20 Stats from absorbing items", 23055:"+25 Stats from absorbing items", 23056:"Maximum HP +20%", 23057:"Maximum HP +30%", 23058:"Maximum HP +40%", 23059:"Maximum HP +50%", 23060:"Maximum HP +100%", 23061:"Maximum MP +20%", 23062:"Maximum MP +30%", 23063:"Maximum MP +40%", 23064:"Maximum MP +50%", 23065:"Maximum MP +100%", 23066:"+20% Item Drops", 23067:"+20% Item Drops", 23068:"+30% Item Drops", 23069:"+40% Item Drops", 23070:"+50% Item Drops", 23071:"+10% Pickpocket Chance", 23072:"+20% Pickpocket Chance", 23073:"+30% Pickpocket Chance", 23074:"+40% Pickpocket Chance", 23075:"+50% Pickpocket Chance", 23076:"+30% Meat", 23077:"+40% Meat", 23078:"+50% Meat", 23079:"+60% Meat", 23080:"+70% Meat", 23081:"Muscle +5", 23082:"Muscle +10", 23083:"Muscle +15", 23084:"Muscle +20", 23085:"Muscle +25", 23086:"Mysticality +5", 23087:"Mysticality +10", 23088:"Mysticality +15", 23089:"Mysticality +20", 23090:"Mysticality +25", 23091:"Moxie +5", 23092:"Moxie +10", 23093:"Moxie +15", 23094:"Moxie +20", 23095:"Moxie +25", 23096:"Weapon Damage +7", 23097:"Weapon Damage +9", 23098:"Weapon Damage +11", 23099:"Weapon Damage +13", 23100:"Weapon Damage +15", 23101:"+3 Hot Damage", 23102:"+5 Hot Damage", 23103:"+7 Hot Damage", 23104:"+9 Hot Damage", 23105:"+11 Hot Damage", 23106:"+3 Cold Damage", 23107:"+5 Cold Damage", 23108:"+7 Cold Damage", 23109:"+9 Cold Damage", 23110:"+11 Cold Damage", 23111:"+3 Stench Damage", 23112:"+5 Stench Damage", 23113:"+7 Stench Damage", 23114:"+9 Stench Damage", 23115:"+11 Stench Damage", 23116:"+3 Spooky Damage", 23117:"+5 Spooky Damage", 23118:"+7 Spooky Damage", 23119:"+9 Spooky Damage", 23120:"+11 Spooky Damage", 23121:"+3 Sleaze Damage", 23122:"+5 Sleaze Damage", 23123:"+7 Sleaze Damage", 23124:"+9 Sleaze Damage", 23125:"+11 Sleaze Damage", 23301:"-combat buff", 23302:"-combat buff", 23303:"-combat buff", 23304:"+combat buff", 23305:"+combat buff", 23306:"+combat buff"};



var __evaluation_order = [
23301, 23302, 23303, 23304, 23305, 23306, 
//adventures
23046, 23047, 23048, 23049, 23050,
//stats/fight
23041, 23042, 23043, 23044, 23045,
//stats/absorb
23051, 23052, 23053, 23054, 23055,
//+item%
23066, 23067, 23068, 23069, 23070,
//+meat%
23076, 23077, 23078, 23079, 23080,
//init
23036, 23037, 23038, 23039, 23040,
//HP%
23056, 23057, 23058, 23059, 23060,
//DA
23026, 23027, 23028, 23029, 23030,
//DR
23031, 23032, 23033, 23034, 23035,
//MP%
23061, 23062, 23063, 23064, 23065,
//+pickpocket%
23071, 23072, 23073, 23074, 23075,
//hot res
23001, 23002, 23003, 23004, 23005, 
//cold res
23006, 23007, 23008, 23009, 23010, 
//stench res
23011, 23012, 23013, 23014, 23015, 
//spooky res
23016, 23017, 23018, 23019, 23020, 
//sleaze res
23021, 23022, 23023, 23024, 23025,
//+muscle
23081, 23082, 23083, 23084, 23085,
//+mysticality
23086, 23087, 23088, 23089, 23090,
//+moxie
23091, 23092, 23093, 23094, 23095,
//+weapon damage
23096, 23097, 23098, 23099, 23100,
//+hot damage
23101, 23102, 23103, 23104, 23105,
//+cold damage
23106, 23107, 23108, 23109, 23110,
//+stench damage
23111, 23112, 23113, 23114, 23115,
//+spooky damage
23116, 23117, 23118, 23119, 23120,
//+sleaze damage
23121, 23122, 23123, 23124, 23125,
];

var __item_ids_to_custom_description = {9349:"robortender against demons", 9353:"robortender against goblins", 9354:"robortender against hippies", 9357:"robortender against humanoids", 9359:"robortender against orcs", 9361:"robortender against pirates"};