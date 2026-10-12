-- Add a 1kg (£10) size alongside the 2kg (£15) kimchi
UPDATE products
SET weights = '[{"amount":"1","unit":"kg","price":"10","discount":{"type":"amount","value":"0"}},{"amount":"2","unit":"kg","price":"15","discount":{"type":"amount","value":"0"}}]'
WHERE page_url = '/kimchi' AND (weights IS NULL OR weights NOT LIKE '%"amount":"1","unit":"kg"%');

UPDATE site_content SET value = 'From £10' WHERE key = 'kimchi.hero.price' AND value = '£15';
UPDATE site_content SET value = '1kg or 2kg · glass jar · no microplastics' WHERE key = 'kimchi.hero.price_sub' AND value = 'for 2kg · glass jar · no microplastics';
