/**
 * FB-COMPAT – zgodność zapisanych diagramów z poprzednią opublikowaną wersją (regresja formatu).
 *
 * Wersja bazowa: devDependency `flowblocks-baseline` (alias npm:flowblocks@<poprzednia wersja>, przypięta DOKŁADNIE –
 * przy wydaniu kolejnej wersji podbić na właśnie opublikowaną). Każda wersja działa w osobnym procesie
 * (test/compat/run.js – kształty JointJS rejestrowane globalnie).
 *
 * Korpus:
 *  - diagramy utworzone API wersji bazowej (createBlock + połączenia jak w edytorze): wszystkie szablony bloków,
 *    wszystkie typy pól, połączenia z każdego portu, duży diagram (150 bloków), diagram pusty, blok bez połączeń,
 *  - test/compat/corpus/adi.json – diagramy ADI (seed demo, szablony modeli Management; odświeżanie:
 *    test/compat/tools/sync-adi-corpus.js).
 */
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const os = require('os');
const path = require('path');
const {spawnSync} = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASELINE_DIR = path.join(ROOT, 'node_modules', 'flowblocks-baseline');
const RUN = path.join(__dirname, 'compat', 'run.js');
const CORPUS = path.join(__dirname, 'compat', 'corpus', 'adi.json');
/** Diagramy z funkcji wprowadzonych w bieżącej wersji – nie istnieją w zapisach wersji bazowej (tylko stabilność). */
const NEW_IN_CURRENT = /^adi diagram template /;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fb-compat-'));
let seq = 0;

const cache = new Map();
/** Wynik dla (wersja, tryb, wejście) – zapamiętany (te same przebiegi w kilku testach). */
function run(moduleDir, mode, items) {
    const key = `${moduleDir}|${mode}|${JSON.stringify(items || [])}`;
    if (!cache.has(key)) cache.set(key, runOnce(moduleDir, mode, items));
    return JSON.parse(JSON.stringify(cache.get(key)));
}

function runOnce(moduleDir, mode, items) {
    const inFile = path.join(tmp, `in-${++seq}.json`);
    const outFile = path.join(tmp, `out-${seq}.json`);
    fs.writeFileSync(inFile, JSON.stringify(items || []));
    const r = spawnSync(process.execPath, [RUN, moduleDir, mode, inFile, outFile], {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
    if (r.status !== 0) throw new Error(`compat run (${path.basename(moduleDir)}, ${mode}) failed:\n${r.stderr || r.stdout}`);
    return JSON.parse(fs.readFileSync(outFile, 'utf8'));
}

/** Różnice (ścieżki) między dwoma wynikami – do czytelnego komunikatu błędu. */
function differences(a, b, p = '', out = []) {
    if (out.length >= 20 || JSON.stringify(a) === JSON.stringify(b)) return out;
    if (a && b && typeof a === 'object' && typeof b === 'object') {
        for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) differences(a[k], b[k], `${p}.${k}`, out);
    } else {
        out.push(`${p}: ${String(JSON.stringify(a)).slice(0, 120)} -> ${String(JSON.stringify(b)).slice(0, 120)}`);
    }
    return out;
}

/**
 * FB-18: wynik walidacji zapisany w diagramie jest pochodny (liczony od nowa przy imporcie) – teksty błędów (`errors[].msg`,
 * nowe pola `label` / `allowed`) i podpowiedź paska walidacji (`attrs['.fb-validation-rect'].title`) porównywane bez tekstu;
 * kody błędów (`code`, `cId`) – bez zmian.
 */
function normalize(out) {
    const o = JSON.parse(JSON.stringify(out === undefined ? null : out));
    const cells = o && Array.isArray(o.cells) ? o.cells : (o && o.flow && Array.isArray(o.flow.cells) ? o.flow.cells : []);
    const walk = (x) => {
        if (!x || typeof x !== 'object') return;
        if (Array.isArray(x)) { x.forEach(walk); return; }
        if (Array.isArray(x.errors)) x.errors = x.errors.map(e => (e && typeof e === 'object' ? {code: e.code, cId: e.cId} : e));
        if (x.attrs && x.attrs['.fb-validation-rect']) delete x.attrs['.fb-validation-rect'].title;
        Object.keys(x).forEach(k => walk(x[k]));
    };
    walk(cells.length ? cells : o);
    return o;
}

function expectSame(base, head, what) {
    expect(head.length, `${what}: liczba diagramów`).eq(base.length);
    base.forEach((b, i) => {
        const d = differences(normalize(b.out), normalize(head[i].out));
        expect(d, `${what} – ${b.name}:\n  ${d.join('\n  ')}`).deep.eq([]);
    });
}

describe('FB-COMPAT zgodność diagramów z poprzednią wersją (flowblocks-baseline)', function () {
    this.timeout(180000);
    let baseline;
    let authoredByBaseline;
    let authoredByCurrent;
    let adi;

    before(() => {
        // brak wersji bazowej = błąd (nie pomijamy testu regresji)
        expect(fs.existsSync(path.join(BASELINE_DIR, 'package.json')), 'flowblocks-baseline nie jest zainstalowany (npm install)').true;
        baseline = JSON.parse(fs.readFileSync(path.join(BASELINE_DIR, 'package.json'), 'utf8')).version;
        const current = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
        expect(baseline, 'wersja bazowa musi być starsza od bieżącej').not.eq(current);
        authoredByBaseline = run(BASELINE_DIR, 'author');
        authoredByCurrent = run(ROOT, 'author');
        adi = JSON.parse(fs.readFileSync(CORPUS, 'utf8'));
    });
    after(() => fs.rmSync(tmp, {recursive: true, force: true}));

    it('FB-COMPAT1 diagramy zapisane przez wersję bazową: import → export identyczny jak w wersji bazowej', () => {
        const items = authoredByBaseline.map(a => ({name: a.name, spec: a.spec, mode: 'types'}));
        expect(items.length).gte(4);
        expectSame(run(BASELINE_DIR, 'roundtrip', items), run(ROOT, 'roundtrip', items), `baseline ${baseline}`);
    });

    it('FB-COMPAT2 diagramy ADI (seed demo): import bez typów jak w adi-gui – identyczny wynik', () => {
        const items = adi.filter(a => !NEW_IN_CURRENT.test(a.name)).map(a => ({name: a.name, spec: a.spec, mode: 'adi'}));
        expect(items.length, 'korpus ADI pusty – test/compat/tools/sync-adi-corpus.js').gte(1);
        expectSame(run(BASELINE_DIR, 'roundtrip', items), run(ROOT, 'roundtrip', items), 'ADI');
    });

    it('FB-COMPAT3 zapis bieżącej wersji otwiera wersja bazowa (powrót do poprzedniego GUI) bez zmian', () => {
        const items = authoredByBaseline.map(a => ({name: a.name, spec: a.spec, mode: 'types'}));
        const viaCurrent = run(ROOT, 'roundtrip', items).map(r => ({name: r.name, spec: r.out, mode: 'types'}));
        expectSame(run(BASELINE_DIR, 'roundtrip', items), run(BASELINE_DIR, 'roundtrip', viaCurrent), 'downgrade');
    });

    it('FB-COMPAT4 diagramy tworzone API bieżącej wersji: wersja bazowa odczytuje je identycznie', () => {
        const items = authoredByCurrent.map(a => ({name: a.name, spec: a.spec, mode: 'types'}));
        expectSame(run(BASELINE_DIR, 'roundtrip', items), run(ROOT, 'roundtrip', items), 'current → baseline');
    });

    it('FB-COMPAT5 stabilność: export(import(export(x))) = export(import(x)) dla całego korpusu (także szablonów ADI)', () => {
        const items = [
            ...authoredByBaseline.map(a => ({name: a.name, spec: a.spec, mode: 'types'})),
            ...adi.map(a => ({name: a.name, spec: a.spec, mode: 'adi'}))
        ];
        const once = run(ROOT, 'roundtrip', items);
        const twice = run(ROOT, 'roundtrip', once.map((r, i) => ({name: r.name, spec: r.out, mode: items[i].mode, typesFrom: items[i].mode === 'adi' ? items[i].spec : undefined})));
        expectSame(once, twice, 'idempotencja');
        // szablony ADI: wszystkie bloki i połączenia zachowane
        adi.filter(a => NEW_IN_CURRENT.test(a.name)).forEach(a => {
            const r = once.find(o => o.name === a.name);
            expect(r.out.cells.length, a.name).eq(a.spec.cells.length);
        });
    });
});
