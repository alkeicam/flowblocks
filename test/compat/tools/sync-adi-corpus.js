#!/usr/bin/env node
/**
 * Odświeża korpus diagramów ADI (test/compat/corpus/adi.json) dla testu zgodności wersji (test/compat.test.js).
 *
 *   node test/compat/tools/sync-adi-corpus.js <katalog adi-microservices>
 *
 * Źródła (wszystko, co ADI zapisuje i otwiera w edytorze reguł / widoku diagramu):
 *  - deploy/local/demo/seed/fixtures/models.json – diagramy modeli demo (każdy wariant) i szablonów seeda,
 *  - management/diagram-templates/*.json – szablony modeli (KYB, KYC, screening, scoring) rozwinięte tak jak robi to
 *    Management (expandTemplate) z pełnym katalogiem klocków (kompilator + konektory + szablony AI).
 * Wymaga zainstalowanych zależności adi-microservices (e2e: npm run setup). Korpus jest commitowany – test nie zależy
 * od repozytorium ADI. Kolejne źródła (np. eksporty z produkcji po anonimizacji) – dopisać do OUT jako {name, source, spec}.
 */
const fs = require('fs');
const path = require('path');

const adi = process.argv[2] && path.resolve(process.argv[2]);
if (!adi || !fs.existsSync(path.join(adi, 'management', 'diagram-templates.js'))) {
    console.error('usage: sync-adi-corpus.js <adi-microservices dir>');
    process.exit(2);
}
const OUT = path.join(__dirname, '..', 'corpus', 'adi.json');
const items = [];

// 1. seed demo
const fx = JSON.parse(fs.readFileSync(path.join(adi, 'deploy', 'local', 'demo', 'seed', 'fixtures', 'models.json'), 'utf8'));
for (const m of fx.models || []) {
    for (const v of m.variants || []) {
        if (v.visuals) items.push({name: `adi seed model ${m.key} v${v.variant}`, source: 'deploy/local/demo/seed/fixtures/models.json', spec: v.visuals});
    }
}
for (const [k, t] of Object.entries(fx.templates || {})) {
    if (t.visuals) items.push({name: `adi seed template ${k}`, source: 'deploy/local/demo/seed/fixtures/models.json', spec: t.visuals});
}

// 2. szablony diagramów Management (jak POST …/models/from-template)
const req = (p) => require(path.join(adi, p));
const compiler = req('compiler');
const {loadCatalog} = req(path.join('connectors', 'lib', 'catalog.js'));
const {loadAiTemplates} = req(path.join('management', 'aimodels'));
const {loadDiagramTemplates, expandTemplate, templateParams} = req(path.join('management', 'diagram-templates'));
const CONN = path.join(adi, 'connectors');
const {defs} = loadCatalog(CONN, {env: '', includePreview: true});
const catalog = compiler.buildCatalog({connectors: defs, includePreview: true, aiTemplates: loadAiTemplates(CONN).templates});
for (const t of loadDiagramTemplates(undefined, {fresh: true})) {
    const spec = expandTemplate(t, catalog, templateParams(t));
    items.push({name: `adi diagram template ${t.id}`, source: `management/diagram-templates/${t.id}.json`,
        spec: {name: t.title || t.id, id: t.id, version: 1, created: 1790000000000, ...spec}});
}

fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, JSON.stringify(items, null, 1) + '\n');
console.log(`${OUT}: ${items.length} diagramów (${items.reduce((n, i) => n + (i.spec.cells || []).length, 0)} komórek)`);
