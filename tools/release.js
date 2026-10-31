#!/usr/bin/env node
/**
 * Wydanie pakietu flowblocks na npmjs jedną komendą (RELEASE-PROCEDURE §5) – ten sam plik w flowblocks-ui-toolbar,
 * flowblocks i flowblocks-designer. Kolejność pakietów: flowblocks-ui-toolbar → flowblocks → flowblocks-designer.
 *
 *   npm run release                    wersja: bieżąca z package.json, gdy jeszcze nieopublikowana, inaczej +patch
 *   npm run release -- minor           +minor (albo: patch | major | 2.4.0)
 *   npm run release -- --dry-run       wszystko do testów włącznie, bez commitu, tagu, publikacji i push
 *   npm run release -- --no-browser    bez testów w przeglądarce (test:browser) – tylko gdy Chromium niedostępny
 *   npm run release -- --otp 123456    kod 2FA npm (bez opcji npm zapyta sam)
 *   npm run release -- --yes           bez pytań (zmiany w plikach śledzonych wchodzą do commitu wydania)
 *
 * Kroki:
 *  1. git: repozytorium, gałąź, brak tagu v<wersja>; zmiany w plikach śledzonych – lista i potwierdzenie (wchodzą do commitu);
 *  2. zależności z rodziny flowblocks (dependencies `flowblocks-ui-toolbar`, `flowblocks`; devDependencies – aliasy
 *     `npm:flowblocks@…` / `npm:flowblocks-ui-toolbar@…` do testów smoke): zakres / wersja podbijane do najnowszej
 *     opublikowanej (to, czego wymaga release-train – dolna granica zakresu = wydana wersja zależności);
 *  3. wersja w package.json – PRZED budową (dist zawiera wersję; dawny `remote-publish-*` budował przed `npm version`);
 *  4. npm install → packem (dist) → npm test → test:browser;
 *  5. commit „<wersja>” (package.json, dist, zmienione pliki śledzone; bez .DS_Store), tag v<wersja>;
 *  6. npm pack → npm publish tej paczki (dokładnie przetestowane pliki) → git push gałęzi i tagu → npm view.
 * Przerwanie po commicie, a przed publikacją: commit i tag zostają lokalnie – komunikat mówi, jak dokończyć.
 */
'use strict';
const {execFileSync, spawnSync} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const PKG_FILE = path.join(ROOT, 'package.json');
const FAMILY = ['flowblocks-ui-toolbar', 'flowblocks'];
const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const opt = (f) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : undefined);
const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1] === '--otp'));
const DRY = flag('--dry-run'), YES = flag('--yes'), NO_BROWSER = flag('--no-browser'), OTP = opt('--otp');

const c = {b: (s) => `\x1b[1m${s}\x1b[0m`, g: (s) => `\x1b[32m${s}\x1b[0m`, y: (s) => `\x1b[33m${s}\x1b[0m`, r: (s) => `\x1b[31m${s}\x1b[0m`};
const log = (s) => console.log(s);
const die = (s, code = 1) => { console.error(c.r(`✖ ${s}`)); process.exit(code); };

/** Polecenie z wyjściem na konsolę; błąd = koniec wydania. */
function run(cmd, args, {allowFail = false} = {}) {
    log(c.b(`$ ${cmd} ${args.join(' ')}`));
    const r = spawnSync(cmd, args, {cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32'});
    if (r.status !== 0 && !allowFail) die(`${cmd} ${args.join(' ')} – kod ${r.status}`);
    return r.status === 0;
}
/** Polecenie bez wyjścia na konsolę → stdout (trim) albo null przy błędzie. */
function out(cmd, args) {
    try { return execFileSync(cmd, args, {cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}).trim(); } catch (e) { return null; }
}
const ask = (q) => new Promise((res) => { const rl = readline.createInterface({input: process.stdin, output: process.stdout}); rl.question(q, (a) => { rl.close(); res(a); }); });
const confirm = async (q) => YES || /^(t|tak|y|yes)$/i.test((await ask(`${q} [t/N] `)).trim());

// ------------------------------------------------------------------ semver (podzbiór)
const parseV = (v) => { const m = String(v).match(/^(\d+)\.(\d+)\.(\d+)$/); return m ? m.slice(1).map(Number) : null; };
const cmpV = (a, b) => { const x = parseV(a), y = parseV(b); return (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2]); };
const bump = (v, kind) => { const [a, b, d] = parseV(v); return kind === 'major' ? `${a + 1}.0.0` : kind === 'minor' ? `${a}.${b + 1}.0` : `${a}.${b}.${d + 1}`; };

/** package.json z zachowaniem wcięć i końcowej nowej linii. */
function editPkg(mutate) {
    const txt = fs.readFileSync(PKG_FILE, 'utf8');
    const indent = (txt.match(/^[ \t]+(?=")/m) || ['  '])[0];
    const obj = JSON.parse(txt);
    mutate(obj);
    fs.writeFileSync(PKG_FILE, JSON.stringify(obj, null, indent) + (txt.endsWith('\n') ? '\n' : ''));
    return obj;
}

/** Wersje opublikowane pakietu (npm view) – [] gdy pakietu nie ma. */
function published(name) {
    const v = out('npm', ['view', name, 'versions', '--json']);
    if (v === null) return [];
    try { const a = JSON.parse(v); return Array.isArray(a) ? a : [a]; } catch (e) { return []; }
}
const latestOf = (name) => published(name).filter(parseV).sort(cmpV).pop();

(async () => {
    const pkg = JSON.parse(fs.readFileSync(PKG_FILE, 'utf8'));
    log(c.b(`\nWydanie ${pkg.name} (bieżąca wersja ${pkg.version})${DRY ? c.y(' – próba (--dry-run)') : ''}\n`));

    // 1. git
    if (out('git', ['rev-parse', '--is-inside-work-tree']) !== 'true') die('to nie jest repozytorium git');
    const branch = out('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    if (!branch || branch === 'HEAD') die('odłączony HEAD – przełącz się na gałąź');
    const tracked = (out('git', ['status', '--porcelain', '--untracked-files=no']) || '').split('\n').filter(Boolean);
    if (tracked.length) {
        log(c.y('Zmiany w plikach śledzonych – wejdą do commitu wydania:'));
        tracked.forEach(l => log(`   ${l}`));
        if (!DRY && !(await confirm('Kontynuować?'))) die('przerwane – najpierw zacommituj albo cofnij zmiany', 1);
    }

    // 2. zależności z rodziny flowblocks
    const edits = [];
    for (const sect of ['dependencies', 'devDependencies']) {
        for (const [dep, range] of Object.entries(pkg[sect] || {})) {
            const alias = String(range).match(/^npm:([^@]+)@(\d+\.\d+\.\d+)$/);
            const target = alias ? alias[1] : dep;
            if (!FAMILY.includes(target) || target === pkg.name) continue;
            const latest = latestOf(target);
            if (!latest) { log(c.y(`   ${dep}: nie znaleziono ${target} w npm – bez zmian`)); continue; }
            const m = alias ? null : String(range).match(/^([\^~]?)(\d+\.\d+\.\d+)$/);
            if (alias && cmpV(alias[2], latest) < 0) edits.push({sect, dep, from: range, to: `npm:${target}@${latest}`});
            else if (m && cmpV(m[2], latest) < 0) edits.push({sect, dep, from: range, to: `${m[1] || '^'}${latest}`});
        }
    }
    if (edits.length) {
        log(c.b('Zależności z rodziny flowblocks → najnowsze opublikowane:'));
        edits.forEach(e => log(`   ${e.sect} ${e.dep}: ${e.from} → ${c.g(e.to)}`));
    } else log('Zależności z rodziny flowblocks – aktualne.');

    // 3. wersja docelowa
    const pub = published(pkg.name);
    const req = positional[0];
    let version;
    if (req && parseV(req)) version = req;
    else if (req && ['patch', 'minor', 'major'].includes(req)) version = bump(pkg.version, req);
    else if (req) die(`nieznany argument „${req}” – patch | minor | major | x.y.z`);
    else version = pub.includes(pkg.version) ? bump(pkg.version, 'patch') : pkg.version;
    if (pub.includes(version)) die(`${pkg.name}@${version} jest już w npm – podaj wyższą wersję`);
    const latestSelf = pub.filter(parseV).sort(cmpV).pop();
    if (latestSelf && cmpV(version, latestSelf) <= 0) die(`${version} ≤ najnowszej opublikowanej ${latestSelf}`);
    if (out('git', ['rev-parse', '-q', '--verify', `refs/tags/v${version}`])) die(`tag v${version} już istnieje – usuń go albo podaj inną wersję`);
    log(c.b(`Wersja: ${pkg.version} → ${c.g(version)}`));

    editPkg((o) => {
        o.version = version;
        for (const e of edits) o[e.sect][e.dep] = e.to;
    });

    // 4. budowa i testy (dist z nową wersją)
    run('npm', ['install']);
    run('npm', ['run', 'packem']);
    run('npm', ['test']);
    if (NO_BROWSER) log(c.y('test:browser pominięty (--no-browser)'));
    else run('npm', ['run', 'test:browser']);

    // 5. commit i tag
    const changed = (out('git', ['status', '--porcelain', '--untracked-files=all']) || '').split('\n').filter(Boolean)
        .map(l => l.slice(3).replace(/^"|"$/g, ''))
        .filter(f => !/(^|\/)\.DS_Store$/.test(f) && !/^(node_modules|coverage|\.nyc_output)\//.test(f) && f !== 'package-lock.json'
            && (/^(dist|src|test|tools)\//.test(f) || f === 'package.json' || tracked.some(t => t.slice(3) === f)));
    log(c.b('\nDo commitu wydania:'));
    changed.forEach(f => log(`   ${f}`));
    if (DRY) {
        log(c.y(`\nPróba zakończona: testy zielone. Bez commitu i publikacji – package.json i dist zostały zmienione lokalnie (wersja ${version}).`));
        return;
    }
    if (!(await confirm(`\nCommit „${version}”, tag v${version}, npm publish i push?`))) die('przerwane przed commitem – package.json i dist zmienione lokalnie');
    run('git', ['add', '--', ...changed]);
    const msg = `${version}${edits.length ? `: ${edits.map(e => `${e.dep} ${e.to}`).join(', ')}` : ''}`;
    run('git', ['commit', '-q', '-m', msg]);
    run('git', ['tag', '-a', `v${version}`, '-m', version]);

    // 6. paczka → publikacja → push
    const dest = fs.mkdtempSync(path.join(os.tmpdir(), `${pkg.name}-`));
    run('npm', ['pack', '--pack-destination', dest]);
    const tgz = fs.readdirSync(dest).find(f => f.endsWith('.tgz'));
    if (!tgz) die(`brak paczki w ${dest}`);
    const ok = run('npm', ['publish', path.join(dest, tgz), ...(OTP ? ['--otp', OTP] : [])], {allowFail: true});
    if (!ok) {
        die(`npm publish nie powiódł się. Commit i tag v${version} są lokalnie (bez push). Dokończ:\n`
            + `   npm publish ${path.join(dest, tgz)} [--otp <kod>]\n   git push origin ${branch} && git push origin v${version}\n`
            + `albo cofnij: git tag -d v${version} && git reset --hard HEAD~1`);
    }
    run('git', ['push', 'origin', branch]);
    run('git', ['push', 'origin', `v${version}`]);
    const seen = out('npm', ['view', `${pkg.name}@${version}`, 'version']);
    log(seen === version ? c.g(`\n✔ ${pkg.name}@${version} opublikowany`) : c.y(`\n${pkg.name}@${version} wysłany – npm view jeszcze go nie pokazuje (propagacja rejestru)`));
    const next = {'flowblocks-ui-toolbar': 'flowblocks, potem flowblocks-designer', flowblocks: 'flowblocks-designer'}[pkg.name];
    if (next) log(`Dalej: npm run release w ${next} (podbije zależność do ${version}).`);
    else log('Dalej: deploy/releases/release-train.js apply (podbije adi-gui/vendor).');
})().catch((e) => die(e.stack || e.message));
