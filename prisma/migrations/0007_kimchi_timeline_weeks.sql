-- Kimchi is best within 3-4 weeks: update saved timeline overrides that still use the old month-based stages
UPDATE site_content SET value = '2-3 weeks' WHERE key = 'kimchi.storage.stage.2.stage' AND value = '1-3 months';
UPDATE site_content SET value = '3-4 weeks' WHERE key = 'kimchi.storage.stage.3.stage' AND value = '3+ months';
UPDATE site_content SET value = 'Properly sour and deeply fermented. Make kimchi fried rice or kimchi pancakes. Don''t throw it out.'
  WHERE key = 'kimchi.storage.stage.3.note' AND value LIKE 'Funky and deeply fermented%';
UPDATE site_content SET value = REPLACE(value, '3 to 4 months', '3 to 4 weeks') WHERE key LIKE 'kimchi.%' AND value LIKE '%3 to 4 months%';
