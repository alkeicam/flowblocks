/**
 * FB-SMOKE-CORE – flowblocks (dist) w Chromium na prawdziwej geometrii SVG (jsdom w testach jednostkowych jej nie ma):
 * renderowanie, przeciąganie bloku, łączenie portów myszą, tryb tylko do odczytu, znaczniki, podświetlenia, nakładka
 * diff oraz diagramy ADI (import → render → export bez zmian). Uruchomienie: npm run test:browser.
 */
const fs = require('fs');
const path = require('path');
const {expect} = require('chai');
const {start, center, drag} = require('./support');

const ROOT = path.join(__dirname, '..', '..');
const ICONS = 'https://cdn.jsdelivr.net/npm/flowblocks-icons@1.0.8/i/';
const TYPES = [
    {name: 'Start', template: 'Start', icon: '/test/browser/icon.svg', style: 'cream', category: 'core', configurables: []},
    {name: 'Step', template: 'PassThrough', icon: '/test/browser/icon.svg', style: 'cream', category: 'core', configurables: [{id: 'code', label: 'Code', type: 'TEXT', required: false}]},
    {name: 'Decision', template: 'Split', icon: '/test/browser/icon.svg', style: 'americana', category: 'core', configurables: []},
    {name: 'End', template: 'End', icon: '/test/browser/icon.svg', style: 'cream', category: 'core', configurables: []}
];

describe('FB-SMOKE-CORE flowblocks w przeglądarce (dist)', function () {
    this.timeout(120000);
    let env, page;

    before(async () => {
        // diagramy ADI odwołują się do ikon flowblocks-icons z vendor adi-gui (/assets/vendor/flowblocks-icons@1.0.8/i/…)
        const cdn = {};
        for (const f of fs.readdirSync(path.join(ROOT, 'node_modules', 'smoke-flowblocks-icons', 'i'))) {
            cdn[`${ICONS}${f}`] = `node_modules/smoke-flowblocks-icons/i/${f}`;
        }
        env = await start(ROOT, {cdn});
    });
    after(async () => { if (env) await env.close(); });
    beforeEach(async () => {
        page = await env.newPage();
        // ikony: ścieżka vendor GUI w diagramach ADI (/assets/vendor/flowblocks-icons@1.0.8/i/…) oraz domyślna ikona
        // bloku bez ikony (./resources/img/svg/agave.svg, //resources/…) – w ADI podmieniane przez adi-gui
        // tools/build-assets.js na flowblocks-icons; tutaj to samo mapowanie (brak pliku = 404 = błąd testu)
        const icon = (route) => {
            const f = path.join(ROOT, 'node_modules', 'smoke-flowblocks-icons', 'i', path.basename(new URL(route.request().url()).pathname));
            return fs.existsSync(f) ? route.fulfill({path: f}) : route.fulfill({status: 404, body: ''});
        };
        await page.route('**/assets/vendor/flowblocks-icons@1.0.8/i/*', icon);
        await page.route(/\/resources\/img\/svg\/[^/]+\.svg$/, icon);
        await page.goto(`${env.url}/test/browser/flowblocks.html`);
        await page.waitForFunction(() => window.smokeReady === true);
        await page.evaluate((t) => window.setup(t), TYPES);
    });
    afterEach(async () => {
        await page.context().close();
        expect(env.takeProblems(), 'błędy strony / żądań').deep.eq([]);
    });

    const block = (id) => page.locator(`[data-testid="smoke.block"][data-block-id="${id}"]`);
    const port = (id, p) => page.locator(`[data-block-id="${id}"] [port="${p}"]`);
    const events = (name) => page.evaluate((n) => window.events.filter(e => e.name === n), name);

    async function threeBlocks() {
        await page.evaluate(() => {
            window.fb.createBlock('Start', 'start', 'S1', {x: 40, y: 60});
            window.fb.createBlock('Step', 'step', 'A1', {x: 320, y: 60});
            window.fb.createBlock('End', 'end', 'E1', {x: 640, y: 60});
            window.fb.markClean();
            window.events.length = 0;
        });
    }

    it('FB-SMOKE-CORE1 bloki renderują się z test id, nazwą, ikoną i rzeczywistymi wymiarami', async () => {
        await threeBlocks();
        for (const id of ['S1', 'A1', 'E1']) {
            const b = await block(id).boundingBox();
            expect(b, id).not.null;
            expect(b.width).gt(40);
            expect(b.height).gt(40);
        }
        expect(await block('A1').getAttribute('data-block-type')).eq('Step');
        expect(await block('A1').getAttribute('data-name')).eq('step');
        expect(await page.locator('[data-block-id="A1"] .fb-label-text').textContent()).contain('step');
    });

    it('FB-SMOKE-CORE2 przeciągnięcie bloku myszą: nowa pozycja, diagram zmieniony (jedno zdarzenie po debounce)', async () => {
        await threeBlocks();
        const from = await center(page.locator('[data-block-id="A1"] .fb-icon-rect'));
        await drag(page, from, {x: from.x + 120, y: from.y + 200});
        const pos = await page.evaluate(() => window.fb.getBlock('A1').get('position'));
        expect(pos.x).gt(400);
        expect(pos.y).gt(200);
        await page.waitForTimeout(400);
        expect(await page.evaluate(() => window.fb.isDirty())).true;
        expect((await events('flowblocks:diagram-changed')).length).eq(1);
    });

    it('FB-SMOKE-CORE3 połączenie portów myszą: link w grafie, _portConnections po obu stronach, connection-added', async () => {
        await threeBlocks();
        await drag(page, await center(port('S1', 'out1')), await center(port('A1', 'in1')));
        await drag(page, await center(port('A1', 'out1')), await center(port('E1', 'in1')));
        const r = await page.evaluate(() => {
            const d = window.fb.getDiagram();
            const links = d.cells.filter(c => c.type === 'link');
            const a1 = d.cells.find(c => c.blockId === 'A1');
            return {links: links.length, a1: a1._portConnections.map(p => `${p.port}->${p.bId}`).sort()};
        });
        expect(r.links).eq(2);
        expect(r.a1).deep.eq(['in1->S1', 'out1->E1']);
        expect((await events('flowblocks:connection-added')).length).eq(2);
        // wynik walidacji połączeń: komplet – blok A1 bez błędów
        expect(await page.evaluate(() => window.fb.getBlock('A1').get('errors').length)).eq(0);
    });

    it('FB-SMOKE-CORE4 tylko do odczytu: brak przesuwania, brak nowych połączeń, brak narzędzia Remove; powrót – działa', async () => {
        await threeBlocks();
        await page.evaluate(() => window.fb.setReadOnly(true));
        const before = await page.evaluate(() => window.fb.getBlock('A1').get('position'));
        const from = await center(page.locator('[data-block-id="A1"] .fb-icon-rect'));
        await drag(page, from, {x: from.x + 150, y: from.y + 150});
        expect(await page.evaluate(() => window.fb.getBlock('A1').get('position'))).deep.eq(before);
        await drag(page, await center(port('S1', 'out1')), await center(port('A1', 'in1')));
        expect(await page.evaluate(() => window.fb.getDiagram().cells.filter(c => c.type === 'link').length)).eq(0);
        await page.mouse.move(from.x, from.y);
        expect(await page.locator('.joint-tools .remove, .joint-tool.remove, [data-tool-name="remove"]').count()).eq(0);
        expect(await page.evaluate(() => window.fb.isDirty())).false;

        await page.evaluate(() => window.fb.setReadOnly(false));
        await drag(page, from, {x: from.x + 150, y: from.y + 150});
        expect((await page.evaluate(() => window.fb.getBlock('A1').get('position'))).x).gt(before.x);
        expect((await events('flowblocks:readonly-changed')).map(e => e.args[0])).deep.eq([true, false]);
    });

    it('FB-SMOKE-CORE5 znacznik (breakpoint) na lewym marginesie bloku, klik → block-marker-click; nie trafia do eksportu', async () => {
        await threeBlocks();
        await page.evaluate(() => window.fb.setMarker('A1', 'breakpoint-cond', 'amount > 100'));
        const m = page.locator('[data-block-id="A1"] .fb-marker');
        expect(await m.getAttribute('class')).contain('fb-marker-breakpoint-cond');
        const mb = await m.boundingBox();
        const bb = await page.locator('[data-block-id="A1"] .fb-icon-rect').boundingBox();
        expect(mb.x + mb.width).lte(bb.x + 1);
        expect(mb.width).gt(4);
        await page.mouse.click(mb.x + mb.width / 2, mb.y + mb.height / 2);
        expect((await events('flowblocks:block-marker-click')).map(e => e.args[0])).deep.eq(['A1']);
        expect(JSON.stringify(await page.evaluate(() => window.fb.export()))).not.contain('fb-marker');
        expect(await page.evaluate(() => window.fb.isDirty())).false;
    });

    it('FB-SMOKE-CORE6 podświetlenia ścieżki i nakładka diff: klasy w DOM, duch usuniętego bloku poza eksportem', async () => {
        await threeBlocks();
        await page.evaluate(() => window.fb.highlight({blocks: [{id: 'S1', state: 'visited'}, {id: 'A1', state: 'current'}]}));
        expect(await block('A1').getAttribute('class')).contain('fb-hl-current');
        expect(await block('S1').getAttribute('class')).contain('fb-hl-visited');
        const removed = await page.evaluate(() => {
            const d = window.fb.getDiagram();
            const c = JSON.parse(JSON.stringify(d.cells.find(x => x.blockId === 'E1')));
            c.id = 'removed-1'; c.blockId = 'R1'; c.position = {x: 640, y: 400};
            window.fb.showDiff({added: ['A1'], removed: [c]});
            return c;
        });
        expect(await page.locator('[data-block-id="R1"]').count()).eq(1);
        expect(await page.locator('[data-block-id="R1"]').getAttribute('class')).contain('fb-hl-removed');
        const exported = await page.evaluate(() => window.fb.export());
        expect(exported.cells.some(c => c.blockId === 'R1' || c.ghost)).false;
        await page.evaluate(() => window.fb.clearDiff());
        expect(await page.locator('[data-block-id="R1"]').count()).eq(0);
        expect(removed.blockId).eq('R1');
    });

    it('FB-SMOKE-CORE7 diagramy ADI (korpus zgodności): import bez typów → wszystkie bloki widoczne → eksport bez zmian', async () => {
        const corpus = JSON.parse(fs.readFileSync(path.join(ROOT, 'test', 'compat', 'corpus', 'adi.json'), 'utf8'));
        expect(corpus.length).gt(0);
        for (const item of corpus) {
            const r = await page.evaluate((spec) => {
                // świeży papier dla każdego diagramu
                const old = document.getElementById('paper');
                old.replaceWith(old.cloneNode(false));
                const types = {};
                spec.cells.filter(c => c.type === 'flowblocks.Block').forEach(c => {
                    types[c._type] = types[c._type] || {name: c._type, template: c._template || 'PassThrough', icon: c.icon || '/test/browser/icon.svg',
                        style: c._defaultStyle || 'cream', category: 'adi', configurables: c._configurablesDefinitions || []};
                });
                window.setup(Object.values(types));
                const d = JSON.parse(JSON.stringify(spec));
                delete d.types;
                window.fb.import(JSON.stringify(d), false);
                const rendered = document.querySelectorAll('#paper [data-testid="smoke.block"]').length;
                // FB-13: wejścia połączone linkami są połączone także w szablonach zapisanych tylko po stronie źródła
                const inPortErrors = window.fb.revalidate().errorBlocks.reduce((n, x) => n + x.errors.filter(e => e.code === 'PORT_NOT_CONNECTED' && /^in/.test(e.cId)).length, 0);
                const once = window.fb.getDiagram();
                window.fb.import(JSON.stringify(once), false);
                const twice = window.fb.getDiagram();
                return {rendered, blocks: spec.cells.filter(c => c.type === 'flowblocks.Block').length,
                    links: spec.cells.filter(c => c.type === 'link').length, outLinks: twice.cells.filter(c => c.type === 'link').length,
                    stable: JSON.stringify(once) === JSON.stringify(twice), inPortErrors};
            }, item.spec);
            expect(r.rendered, item.name).eq(r.blocks);
            expect(r.inPortErrors, item.name).eq(0);
            expect(r.outLinks, item.name).eq(r.links);
            expect(r.stable, `${item.name}: export(import(export)) stabilny`).true;
        }
    });

    // FB-15: dopasowanie widoku na prawdziwej geometrii SVG i svg-pan-zoom (ta sama wersja co w flowblocks-designer);
    // bez pliku biblioteki (repozytorium designera obok) – pominięcie
    const SPZ = path.join(ROOT, '..', 'flowblocks-designer', 'dist', 'resources', 'js', 'svg-pan-zoom.min.js');
    async function panZoom() {
        await page.addScriptTag({path: SPZ});
        await page.evaluate(() => window.fb.enablePanAndZoom(window.svgPanZoom));
    }
    // svg-pan-zoom zmienia transformację w requestAnimationFrame – odczyt po dwóch klatkach
    const geometry = () => page.evaluate(async () => {
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        const svg = document.querySelector('#paper svg').getBoundingClientRect();
        const rects = [...document.querySelectorAll('#paper [data-testid="smoke.block"]')].map(e => e.getBoundingClientRect());
        const box = {left: Math.min(...rects.map(r => r.left)), top: Math.min(...rects.map(r => r.top)),
            right: Math.max(...rects.map(r => r.right)), bottom: Math.max(...rects.map(r => r.bottom))};
        return {svg: {left: svg.left, top: svg.top, right: svg.right, bottom: svg.bottom, width: svg.width, height: svg.height}, box, blockWidth: rects[0].width};
    });
    const inside = (g) => g.box.left >= g.svg.left - 1 && g.box.top >= g.svg.top - 1 && g.box.right <= g.svg.right + 1 && g.box.bottom <= g.svg.bottom + 1;

    it('FB-SMOKE-CORE-FIT1 duży diagram poza widokiem – fitToView: cały w obszarze, wyśrodkowany, wypełnia go', async function () {
        if (!fs.existsSync(SPZ)) this.skip();
        await page.evaluate(() => {
            window.fb.createBlock('Start', 'start', 'S1', {x: 2600, y: 1800});
            window.fb.createBlock('Step', 'step', 'A1', {x: 4200, y: 1800});
            window.fb.createBlock('End', 'end', 'E1', {x: 5800, y: 2400});
        });
        await panZoom();
        expect(inside(await geometry()), 'przed dopasowaniem diagram poza obszarem').false;
        expect(await page.evaluate(() => window.fb.fitToView())).true;
        const g = await geometry();
        expect(inside(g), JSON.stringify(g)).true;
        const fill = Math.max((g.box.right - g.box.left) / g.svg.width, (g.box.bottom - g.box.top) / g.svg.height);
        expect(fill).gt(0.8);
        const cx = (g.box.left + g.box.right) / 2 - (g.svg.left + g.svg.right) / 2, cy = (g.box.top + g.box.bottom) / 2 - (g.svg.top + g.svg.bottom) / 2;
        expect(Math.abs(cx)).lt(g.svg.width * 0.05);
        expect(Math.abs(cy)).lt(g.svg.height * 0.05);
    });

    it('FB-SMOKE-CORE-FIT2 mały diagram nie jest powiększany (maxZoom 1), RESET po przesunięciu przywraca dopasowany widok', async function () {
        if (!fs.existsSync(SPZ)) this.skip();
        await threeBlocks();
        await panZoom();
        const natural = (await geometry()).blockWidth;
        expect(await page.evaluate(() => window.fb.fitToView())).true;
        const g = await geometry();
        expect(inside(g)).true;
        expect(g.blockWidth).closeTo(natural, 1);
        await page.evaluate(() => window.svgPanZoom(document.querySelector('[joint-selector=svg]')).pan({x: -5000, y: -5000}));
        expect(inside(await geometry())).false;
        await page.locator('#svg-pan-zoom-reset-pan-zoom').click();
        expect(inside(await geometry())).true;
    });

    it('FB-SMOKE-CORE-PORTS1 (FB-16) klocek z 5 wyjściami: etykiety z typu, porty bez nakładania; długi tytuł skrócony do paska, pełny w <title>', async () => {
        const r = await page.evaluate(() => {
            window.fb.registerTypes([{name: 'Five', template: 'Split5', icon: '/test/browser/icon.svg', style: 'cream', category: 'core', configurables: [],
                portLabels: {out1: 'OK', out2: 'Not found', out3: 'Timeout', out4: 'Error', out5: 'Unavailable'}, displayLabel: 'Registry: Very long operation name of the connector'}]);
            const b = window.fb.createBlock('Five', 'KRS – odpis aktualny z bardzo długim tytułem klocka', 'F1', {x: 200, y: 100});
            const el = b.findView(window.fb.flow.paper).el;
            const outs = [...el.querySelectorAll('.joint-port .port-body')].map(c => c.getBoundingClientRect()).filter((x, i, a) => true);
            const bodies = [...el.querySelectorAll('.joint-port')].map(p => ({id: p.querySelector('.port-body').getAttribute('port'), box: p.querySelector('.port-body').getBoundingClientRect(),
                label: p.querySelector('.port-label').textContent}));
            const out = bodies.filter(x => /^out/.test(x.id)).sort((a, b) => a.box.top - b.box.top);
            let overlap = false;
            for (let i = 1; i < out.length; i++) if (out[i].box.top < out[i - 1].box.bottom + 2) overlap = true;
            const title = el.querySelector('.fb-label-text');
            const bar = el.querySelector('.fb-label-rect').getBoundingClientRect();
            return {labels: out.map(x => x.label), overlap, titleText: title.textContent, titleFull: title.querySelector('title').textContent,
                titleW: title.getBoundingClientRect().width, barW: bar.width, under: el.querySelector('.fb-type-label-text').textContent};
        });
        expect(r.labels).deep.eq(['OK', 'Not found', 'Timeout', 'Error', 'Unavailable']);
        expect(r.overlap, 'porty wyjść nie nachodzą na siebie').false;
        expect(r.titleText.endsWith('…') || r.titleText.includes('…'), r.titleText).true;
        expect(r.titleW).lte(r.barW + 1);
        expect(r.titleFull).eq('KRS – odpis aktualny z bardzo długim tytułem klocka');
        expect(r.under.startsWith('Registry:')).true;
    });
});
