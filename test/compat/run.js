#!/usr/bin/env node
/**
 * Zgodność diagramów między wersjami flowblocks – proces potomny z JEDNĄ wersją biblioteki.
 *
 * Dwie wersje nie mogą działać w jednym procesie: obie rejestrują te same kształty JointJS (joint.shapes.flowblocks.*),
 * więc import korzystałby z klas wersji załadowanej jako ostatnia. Test (test/compat.test.js) uruchamia ten skrypt
 * osobno dla wersji bazowej (opublikowana, devDependency `flowblocks-baseline`) i bieżącej (../../).
 *
 *   node test/compat/run.js <katalog-modułu> <tryb> <plik-wejściowy> <plik-wyjściowy>
 *
 * Tryby (wejście: tablica obiektów; `typesFrom` – diagram, z którego wyprowadzić typy w trybie adi):
 *   author     – diagramy tworzone API biblioteki (createBlock + połączenia jak w edytorze) → [{name, spec}]
 *                (wejście ignorowane); tak powstaje korpus „zapisany przez wersję bazową”
 *   roundtrip  – wejście [{name, spec, mode}] → [{name, out}], out = export() po import(spec);
 *                mode 'types' – import ze specyfikacją typów (jak plik z menu designera),
 *                mode 'adi'   – typy rejestrowane przed importem, import bez typów (jak adi-gui, diagram-view.js)
 *
 * Wynik jest znormalizowany: bez znacznika czasu `exported` (export() ustawia Date.now()).
 */
const fs = require('fs');
const path = require('path');

const [moduleDir, mode, inFile, outFile] = process.argv.slice(2);
if (!moduleDir || !mode || !outFile) {
    console.error('usage: run.js <module-dir> author|roundtrip <in.json> <out.json>');
    process.exit(2);
}

// jsdom i globalny JointJS – ten sam helper co testy jednostkowe
require(path.join(__dirname, '..', 'helpers', 'dom.js'));
const flowblocks = require(path.resolve(moduleDir));

let paperSeq = 0;
function fresh() {
    const div = document.createElement('div');
    div.id = `compat-paper-${++paperSeq}`;
    document.body.appendChild(div);
    const fb = flowblocks.create();
    fb.createFlow(div.id, 'Compat', 'COMPAT');
    return {fb, div};
}

/** Typy wyprowadzone z komórek diagramu (adi-gui rejestruje typy z katalogu klocków przed importem bez typów). */
function typesFromCells(spec) {
    const types = {};
    for (const c of spec.cells || []) {
        if (c.type !== 'flowblocks.Block' || !c._type || types[c._type]) continue;
        types[c._type] = {
            name: c._type, template: c._template || 'PassThrough', icon: c.icon || 'agave', style: c._defaultStyle || 'cream',
            category: 'compat', configurables: c._configurablesDefinitions || []
        };
    }
    return Object.values(types);
}

function normalize(json) {
    const out = JSON.parse(JSON.stringify(json));
    delete out.exported;
    return out;
}

// ---------------------------------------------------------------------------------------------------- author
const CONFIGURABLES = [
    {id: 'text', label: 'Text', placeholder: 'x', type: 'TEXT', required: true},
    {id: 'code', label: 'Code', type: 'CODE', required: false},
    {id: 'list', label: 'List', type: 'LIST', required: false, enum: ['A', 'B', 'C']},
    {id: 'flag', label: 'Flag', type: 'BOOLEAN', required: false},
    {id: 'num', label: 'Number', type: 'NUMBER', required: false}
];
const TEMPLATES = ['Start', 'PassThrough', 'Split', 'Split3', 'Split4', 'Split5', 'Join', 'Mixer', 'End'];
const OUT_PORTS = {Start: 1, PassThrough: 1, Split: 2, Split3: 3, Split4: 4, Split5: 5, Join: 1, Mixer: 1, End: 0};
const IN_PORTS = {Start: 0, PassThrough: 1, Split: 1, Split3: 1, Split4: 1, Split5: 1, Join: 2, Mixer: 2, End: 1};

function connect(fb, source, sourcePort, target, targetPort) {
    const link = new joint.dia.Link({source: {id: source.id, port: sourcePort}, target: {id: target.id, port: targetPort}});
    fb.flow.graph.addCell(link);
    const linkView = link.findView(fb.flow.paper);
    const targetView = target.findView(fb.flow.paper);
    const magnet = targetView.el.querySelector(`[port="${targetPort}"]`);
    fb.flow.paper.trigger('link:connect', linkView, {}, targetView, magnet, 'target');
    return link;
}

function registerAll(fb) {
    fb.registerTypes(TEMPLATES.map((t, i) => ({
        name: `T${t}`, template: t, icon: i % 2 ? 'agave' : '/assets/icons/custom.svg', style: i % 3 ? 'cream' : 'americana',
        category: i < 4 ? 'core' : 'extra', configurables: t === 'Start' || t === 'End' ? [] : CONFIGURABLES
    })));
}

/** Diagram z każdym szablonem, wszystkimi typami pól i połączeniem z każdego portu wyjściowego. */
function authorAllTemplates() {
    const {fb} = fresh();
    registerAll(fb);
    const blocks = TEMPLATES.map((t, i) => fb.createBlock(`T${t}`, `block ${t}`, `B${i}`, {x: 40 + i * 160, y: 40 + (i % 3) * 120}, i === 4 ? {width: 140, height: 110} : undefined));
    blocks.forEach((b, i) => {
        if (TEMPLATES[i] === 'Start' || TEMPLATES[i] === 'End') return;
        b.setConfigurable('text', `value ${i} – zażółć "cytat" \\n`);
        b.setConfigurable('code', `return input.amount > ${i * 100};`);
        b.setConfigurable('list', ['A', 'B', 'C'][i % 3]);
        b.setConfigurable('flag', i % 2 === 0);
        b.setConfigurable('num', i * 1.5);
    });
    // każde wyjście do następnego bloku z wolnym wejściem
    const end = blocks[blocks.length - 1];
    blocks.forEach((b, i) => {
        const t = TEMPLATES[i];
        for (let p = 1; p <= OUT_PORTS[t]; p++) {
            const target = i + p < blocks.length ? blocks[i + p] : end;
            const tt = TEMPLATES[blocks.indexOf(target)];
            connect(fb, b, `out${p}`, target, IN_PORTS[tt] > 1 ? `in${((p - 1) % IN_PORTS[tt]) + 1}` : 'in1');
        }
    });
    // zmiana nazwy po utworzeniu (pole name)
    blocks[1].setConfigurable('name', 'renamed block');
    return normalize(fb.export());
}

/** Duży diagram (łańcuch 150 bloków z rozgałęzieniami) – zgodność także dla modeli produkcyjnych o dużym rozmiarze. */
function authorLarge() {
    const {fb} = fresh();
    registerAll(fb);
    const start = fb.createBlock('TStart', 'start', 'S', {x: 0, y: 0});
    let prev = start, prevPort = 'out1';
    for (let i = 0; i < 150; i++) {
        const isSplit = i % 10 === 5;
        const b = fb.createBlock(isSplit ? 'TSplit' : 'TPassThrough', `step ${i}`, `P${i}`, {x: (i % 15) * 120, y: Math.floor(i / 15) * 140});
        b.setConfigurable('text', `v${i}`);
        connect(fb, prev, prevPort, b, 'in1');
        if (isSplit) {
            const leaf = fb.createBlock('TEnd', `leaf ${i}`, `L${i}`, {x: (i % 15) * 120 + 60, y: Math.floor(i / 15) * 140 + 70});
            connect(fb, b, 'out2', leaf, 'in1');
        }
        prev = b; prevPort = 'out1';
    }
    connect(fb, prev, prevPort, fb.createBlock('TEnd', 'end', 'E', {x: 0, y: 1400}), 'in1');
    return normalize(fb.export());
}

/** Diagram pusty i z blokiem bez połączeń. */
function authorEdge() {
    const a = fresh(); registerAll(a.fb);
    const empty = normalize(a.fb.export());
    const b = fresh(); registerAll(b.fb);
    b.fb.createBlock('TPassThrough', 'orphan', 'O1', {x: 10, y: 10});
    return [empty, normalize(b.fb.export())];
}

// ---------------------------------------------------------------------------------------------------- main
let result;
if (mode === 'author') {
    const [empty, orphan] = authorEdge();
    result = [
        {name: 'authored: all templates, field types, ports', spec: authorAllTemplates()},
        {name: 'authored: large (150 blocks)', spec: authorLarge()},
        {name: 'authored: empty diagram', spec: empty},
        {name: 'authored: orphan block', spec: orphan}
    ];
} else if (mode === 'roundtrip') {
    const items = JSON.parse(fs.readFileSync(inFile, 'utf8'));
    result = items.map(({name, spec, mode: m, typesFrom}) => {
        const {fb} = fresh();
        if (m === 'adi') {
            // ADI: typy z katalogu klocków (tu: wyprowadzone z komórek diagramu źródłowego – `typesFrom` przy kolejnym
            // przebiegu), import bez typów; ADI nie przechowuje `types` w diagramie – wynik bez nich
            fb.registerTypes(typesFromCells(typesFrom || spec));
            const d = JSON.parse(JSON.stringify(spec));
            delete d.types;
            fb.import(JSON.stringify(d), false);
            const out = normalize(fb.export());
            delete out.types;
            return {name, out};
        }
        fb.import(JSON.stringify(spec), true);
        return {name, out: normalize(fb.export())};
    });
} else {
    console.error(`unknown mode ${mode}`);
    process.exit(2);
}
fs.writeFileSync(outFile, JSON.stringify(result));
