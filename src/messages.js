/**
 * FB-18: texts of block validation for the user - what to do, with the names the user sees (field label, port label,
 * type name), one sentence ending with a dot. Error codes (code, cId) are unchanged - applications recognize errors by
 * code; only `msg` (and the block tooltip) are texts from here.
 *
 * Defaults are English; an application overrides any of them with setMessages({KEY: string | function(ctx)}) (e.g. a
 * translation). An override that is missing, throws or returns an empty value falls back to the default text.
 *
 * Context (ctx) of templates: {field, port, portIndex, type, allowed, allowedText, min, max, count}.
 */
'use strict';

const output = (c) => (c.port ? `output "${c.port}"` : 'the output');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const DEFAULTS = {
    FIELD_REQUIRED: (c) => `${c.field} is required.`,
    FIELD_PATTERN: (c) => `${c.field}: invalid format.`,
    PORT_OUTPUT: (c) => `Connect ${output(c)} to the next step.`,
    PORT_INPUT: (c) => (c.port ? `Connect a step to input "${c.port}".` : c.portIndex ? `Connect a step to input ${c.portIndex}.` : 'Connect a step to the input.'),
    SUCCESSOR_MIN: (c) => `Connect at least ${c.min} steps to ${output(c)}.`,
    SUCCESSOR_MAX: (c) => (Number(c.max) === 1 ? `${cap(output(c))} can lead to one step only – remove the extra connection.`
        : `${cap(output(c))} can lead to at most ${c.max} steps – remove the extra connections.`),
    SUCCESSOR_TYPE: (c) => `"${c.type}" cannot follow this step. Connect ${output(c)} to: ${c.allowedText}.`,
    AND_MORE: (c) => `and ${c.count} more`,
    OR: 'or',
    STATUS_OK: 'Ready.',
    STATUS_PROBLEMS: (c) => `${c.count} problem${c.count === 1 ? '' : 's'}:`,
    PANEL_TITLE: 'To finish this step'
};

let overrides = {};

/** Overrides of texts (application); undefined / null – defaults only. Unknown keys are kept (other components). */
function setMessages(messages) {
    overrides = messages && typeof messages === 'object' ? Object.assign({}, messages) : {};
}

/**
 * Text of a key: override (string or function), otherwise `defaults` of the caller (other components – designer),
 * otherwise the defaults above. Never throws.
 */
function text(key, ctx, defaults) {
    const c = ctx || {};
    const apply = (t) => {
        if (typeof t === 'function') { try { const v = t(c); return v === undefined || v === null || v === '' ? undefined : String(v); } catch (e) { return undefined; } }
        return typeof t === 'string' && t ? t : undefined;
    };
    return apply(overrides[key]) || apply((defaults || {})[key]) || apply(DEFAULTS[key]) || key;
}

/** Names of the allowed steps: up to 4 – "A, B, C or D"; more – "A, B, C, D and N more". */
function allowedText(names) {
    const n = (names || []).filter(Boolean).map(String);
    if (n.length <= 1) return n.join('');
    if (n.length <= 4) return `${n.slice(0, -1).join(', ')} ${text('OR')} ${n[n.length - 1]}`;
    return `${n.slice(0, 4).join(', ')} ${text('AND_MORE', {count: n.length - 4})}`;
}

/** Tooltip / status text of a block: "Ready." or "2 problems:\n• …\n• …". */
function statusText(errors) {
    const list = (errors || []).filter(e => e && e.msg);
    if (!list.length) return text('STATUS_OK');
    return [text('STATUS_PROBLEMS', {count: list.length})].concat(list.map(e => `• ${e.msg}`)).join('\n');
}

module.exports = {DEFAULTS, setMessages, text, allowedText, statusText};
