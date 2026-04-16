import { useState, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{min-height:100%;background:#0a0a0a;font-family:'Share Tech Mono',monospace;-webkit-tap-highlight-color:transparent;}
.crt{min-height:100vh;background:#0d1a00;background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,0,0.013) 2px,rgba(0,255,0,0.013) 4px);}
.crt::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.65) 100%);pointer-events:none;z-index:100;}
.ph{color:#33ff33;text-shadow:0 0 8px #33ff33,0 0 20px #33ff3355;}
.ph-dim{color:#1a8a1a;}
.ph-bright{color:#88ff88;text-shadow:0 0 12px #88ff88,0 0 30px #33ff3388;}
.wrap{max-width:1200px;margin:0 auto;padding:16px;}
.header{text-align:center;padding:24px 0 20px;border-bottom:1px solid #1a4a1a;margin-bottom:20px;}
.title{font-family:'VT323',monospace;font-size:46px;letter-spacing:5px;line-height:1;margin-bottom:6px;}
.subtitle{font-size:11px;letter-spacing:3px;text-transform:uppercase;}
.blink{animation:blink 1.1s step-end infinite;}
@keyframes blink{50%{opacity:0;}}
.panels{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px;}
@media(max-width:680px){.panels{grid-template-columns:1fr;}.title{font-size:30px;letter-spacing:3px;}}
.panel{display:flex;flex-direction:column;border:1px solid #1a4a1a;background:#050f05;box-shadow:0 0 18px #0a2a0a,inset 0 0 28px #030803;}
.plabel{padding:9px 14px;font-size:10px;letter-spacing:4px;text-transform:uppercase;border-bottom:1px solid #1a4a1a;display:flex;align-items:center;gap:8px;flex-shrink:0;}
.dot{width:7px;height:7px;border-radius:50%;background:#33ff33;box-shadow:0 0 6px #33ff33;display:inline-block;flex-shrink:0;}
.dot-warn{background:#ffaa00!important;box-shadow:0 0 6px #ffaa00!important;}
.dot-js{background:#ffdd44!important;box-shadow:0 0 6px #ffdd44!important;}
textarea,.out{flex:1;background:transparent;border:none;outline:none;resize:none;padding:14px;font-family:'Share Tech Mono',monospace;font-size:13px;line-height:1.7;min-height:320px;color:#33ff33;text-shadow:0 0 5px #33ff3355;caret-color:#33ff33;}
@media(max-width:680px){textarea,.out{min-height:200px;font-size:12px;padding:10px;}}
textarea::placeholder{color:#1a4a1a;}
textarea::-webkit-scrollbar,.out::-webkit-scrollbar{width:5px;}
textarea::-webkit-scrollbar-track,.out::-webkit-scrollbar-track{background:#050f05;}
textarea::-webkit-scrollbar-thumb,.out::-webkit-scrollbar-thumb{background:#1a4a1a;}
.out{white-space:pre;overflow:auto;cursor:pointer;user-select:all;}
.out.err{color:#ff5555;text-shadow:0 0 8px #ff555566;}
.out.empty{color:#1a4a1a;white-space:pre-wrap;}
.out.spin{animation:pulse .7s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.controls{display:flex;gap:10px;justify-content:center;margin-bottom:14px;flex-wrap:wrap;}
.btn{font-family:'VT323',monospace;font-size:22px;letter-spacing:3px;padding:12px 28px;background:transparent;border:1px solid #33ff33;color:#33ff33;text-shadow:0 0 8px #33ff33;box-shadow:0 0 10px #33ff3320,inset 0 0 10px #33ff3310;cursor:pointer;text-transform:uppercase;transition:all .15s;min-height:48px;}
.btn:hover{background:#33ff3322;box-shadow:0 0 22px #33ff3366,inset 0 0 18px #33ff3820;text-shadow:0 0 14px #33ff33,0 0 28px #33ff33;}
.btn:active{transform:scale(.96);}
.btn-s{border-color:#1a6a1a;color:#1a8a1a;text-shadow:none;box-shadow:none;font-size:18px;}
.btn-s:hover{border-color:#33ff33;color:#33ff33;background:#33ff3311;text-shadow:0 0 8px #33ff33;}
.btn-active{border-color:#33ff33!important;color:#33ff33!important;text-shadow:0 0 8px #33ff33!important;background:#33ff3318!important;}
.btn-js{border-color:#bb9900;color:#ddbb00;text-shadow:0 0 8px #ddbb0088;box-shadow:0 0 10px #ddbb0010;}
.btn-js:hover{background:#ddbb0022;box-shadow:0 0 22px #ddbb0055;text-shadow:0 0 14px #ddbb00;}
.btn-js.btn-active{background:#ddbb0018!important;border-color:#ddbb00!important;color:#ffdd44!important;text-shadow:0 0 8px #ffdd44!important;}
.target-bar{display:flex;gap:10px;justify-content:center;margin-bottom:14px;flex-wrap:wrap;}
.target-label{font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:14px 0 0;color:#1a8a1a;width:100%;text-align:center;}
.status{border:1px solid #1a4a1a;background:#050f05;padding:9px 14px;font-size:11px;letter-spacing:2px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:14px;}
.examples{border:1px solid #1a4a1a;background:#050f05;margin-bottom:14px;}
.exlabel{padding:9px 14px;font-size:10px;letter-spacing:4px;border-bottom:1px solid #1a4a1a;}
.exlist{display:flex;flex-wrap:wrap;gap:8px;padding:10px 14px;}
.exbtn{font-family:'Share Tech Mono',monospace;font-size:12px;padding:8px 14px;background:transparent;border:1px solid #1a4a1a;color:#1a8a1a;cursor:pointer;letter-spacing:1px;transition:all .15s;min-height:40px;}
.exbtn:hover{border-color:#33ff33;color:#33ff33;box-shadow:0 0 8px #33ff3333;}
.warns{border:1px solid #664400;background:#110800;padding:10px 14px;font-size:11px;color:#ffaa44;letter-spacing:1px;line-height:1.9;margin-bottom:14px;white-space:pre-wrap;}
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#33ff33;color:#050f05;font-family:'VT323',monospace;font-size:22px;letter-spacing:3px;padding:10px 26px;pointer-events:none;animation:tIn .15s ease,tOut .3s ease 1.2s forwards;z-index:200;}
@keyframes tIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes tOut{to{opacity:0;transform:translateX(-50%) translateY(8px)}}
.preview-btn{font-family:'VT323',monospace;font-size:18px;letter-spacing:2px;padding:10px 20px;background:transparent;border:1px solid #bb9900;color:#ddbb00;cursor:pointer;transition:all .15s;min-height:40px;}
.preview-btn:hover{background:#ddbb0022;color:#ffdd44;border-color:#ffdd44;}
.stickybar{display:none;}
@media(max-width:680px){
  .stickybar{display:flex;position:sticky;bottom:0;z-index:50;padding:10px 16px;background:#0d1a00;border-top:1px solid #1a4a1a;gap:10px;}
  .stickybar .btn{flex:1;font-size:20px;padding:14px 10px;}
}
`;

/* ═══════════════════════════════════════════════════════════
   SHARED PARSING HELPERS
═══════════════════════════════════════════════════════════ */
function splitColon(s) {
  const parts = []; let cur = '', inStr = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '"') inStr = !inStr;
    if (!inStr && ch === ':') { parts.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function parseDataLine(rest) {
  const items = []; let cur = '', inStr = false;
  for (let i = 0; i < rest.length; i++) {
    const ch = rest[i];
    if (ch === '"') { inStr = !inStr; cur += ch; continue; }
    if (!inStr && ch === ',') { items.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim() !== '') items.push(cur.trim());
  return items;
}

function parseNumbered(code) {
  const numbered = [];
  for (const raw of code.trim().split(/\r?\n/)) {
    const m = raw.match(/^\s*(\d+)\s*(.*)/);
    if (m) numbered.push({ num: parseInt(m[1]), stmt: m[2].trim() });
  }
  return numbered;
}

/* ═══════════════════════════════════════════════════════════
   PYTHON CONVERTER
═══════════════════════════════════════════════════════════ */
function exprConvPy(e, fnDefs) {
  e = e.trim();
  e = e.replace(/\bINT\s*\(/gi,     'int(');
  e = e.replace(/\bABS\s*\(/gi,     'abs(');
  e = e.replace(/\bSGN\s*\(/gi,     '_sgn(');
  e = e.replace(/\bSQR\s*\(/gi,     'math.sqrt(');
  e = e.replace(/\bSIN\s*\(/gi,     'math.sin(');
  e = e.replace(/\bCOS\s*\(/gi,     'math.cos(');
  e = e.replace(/\bTAN\s*\(/gi,     'math.tan(');
  e = e.replace(/\bATN\s*\(/gi,     'math.atan(');
  e = e.replace(/\bEXP\s*\(/gi,     'math.exp(');
  e = e.replace(/\bLOG\s*\(/gi,     'math.log(');
  e = e.replace(/\bRND\s*\(\s*0\s*\)/gi, '_rnd(0)');
  e = e.replace(/\bRND\s*\(([^)]+)\)/gi, (_, a) => `_rnd(${exprConvPy(a, fnDefs)})`);
  e = e.replace(/\bLEN\s*\(/gi,     'len(');
  e = e.replace(/\bMID\$\s*\(/gi,   '_mid$(');
  e = e.replace(/\bLEFT\$\s*\(/gi,  '_left$(');
  e = e.replace(/\bRIGHT\$\s*\(/gi, '_right$(');
  e = e.replace(/\bSTR\$\s*\(/gi,   'str(');
  e = e.replace(/\bVAL\s*\(/gi,     'float(');
  e = e.replace(/\bCHR\$\s*\(/gi,   'chr(int(');
  e = e.replace(/\bASC\s*\(/gi,     'ord(');
  e = e.replace(/\bSPC\s*\(/gi,     '_spc(');
  e = e.replace(/\bTAB\s*\(/gi,     '_tab(');
  e = e.replace(/\bPEEK\s*\(/gi,    '_peek(');
  e = e.replace(/\bSCRN\s*\(/gi,    '_scrn(');
  e = e.replace(/\bPDL\s*\(/gi,     '_pdl(');
  e = e.replace(/\bFRE\s*\(/gi,     '_fre(');
  e = e.replace(/\bUSR\s*\(/gi,     '_usr(');
  e = e.replace(/\bFN\s+([A-Za-z][A-Za-z0-9]*)\s*\(([^)]*)\)/gi,
    (_, nm, arg) => `_fn_${nm.toLowerCase()}(${exprConvPy(arg, fnDefs)})`);
  e = e.replace(/([A-Za-z][A-Za-z0-9]*)\%/g, (_, v) => `_i_${v.toLowerCase()}`);
  e = e.replace(/([A-Za-z][A-Za-z0-9]*)\$/g, (_, v) => `_s_${v.toLowerCase()}`);
  e = e.replace(/<>/g, '!='); e = e.replace(/\^/g, '**');
  e = e.replace(/\bAND\b/gi, ' and '); e = e.replace(/\bOR\b/gi, ' or '); e = e.replace(/\bNOT\b/gi, ' not ');
  e = e.replace(/\b([A-Z][A-Z0-9]*)\b/g, m => m.toLowerCase());
  return e;
}

function convPrintArgsPy(args, fnDefs) {
  if (args.trim() === '') return 'print()';
  const trailSemi = /;\s*$/.test(args);
  const trailComma = /,\s*$/.test(args);
  const parts = []; let cur = '', inStr = false, depth = 0;
  for (let i = 0; i < args.length; i++) {
    const ch = args[i];
    if (ch === '"') inStr = !inStr;
    if (!inStr) { if (ch==='('||ch==='[') depth++; if (ch===')'||ch===']') depth--; }
    if (!inStr && depth === 0 && (ch === ';' || ch === ',')) {
      if (cur.trim()) parts.push({ val: cur.trim() });
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) parts.push({ val: cur.trim() });
  const pyParts = parts.map(p => {
    const v = exprConvPy(p.val, fnDefs);
    const isStr = /^"/.test(v) || /^_s_/.test(v) || v.startsWith("'");
    return isStr ? v : `str(${v})`;
  });
  const joined = pyParts.join(', ');
  if (trailSemi) return `print(${joined}, end='')`;
  if (trailComma) return `print(${joined}, end='\\t')`;
  return `print(${joined})`;
}

function convStmtPy(stmt, ind, ctx) {
  const { warnings, fnDefs } = ctx;
  stmt = stmt.trim(); if (!stmt) return [];
  const out = [];
  const E = x => exprConvPy(x, fnDefs);

  if (/^REM\b/i.test(stmt)||stmt.startsWith("'")) { out.push(`${ind}# ${stmt.replace(/^REM\s*/i,'').replace(/^'/,'')}`); return out; }
  if (/^END$/i.test(stmt)) { out.push(`${ind}_end()`); return out; }
  if (/^STOP$/i.test(stmt)) { out.push(`${ind}_stop(_line)`); return out; }
  if (/^CONT$/i.test(stmt)) { out.push(`${ind}pass  # CONT`); return out; }

  const prM = stmt.match(/^(?:PRINT|\?)\s*(.*)/is);
  if (prM) { out.push(`${ind}${convPrintArgsPy(prM[1], fnDefs)}`); return out; }

  const inM = stmt.match(/^INPUT\s+(.+)/i);
  if (inM) {
    let rest = inM[1].trim(), prompt = '"? "';
    const pm = rest.match(/^"([^"]*)"\s*[;,]\s*(.+)/);
    if (pm) { prompt = `"${pm[1]} "`; rest = pm[2]; }
    for (const v of rest.split(',')) {
      const vt=v.trim(), pv=E(vt), isStr=/\$$/.test(vt);
      out.push(isStr?`${ind}${pv} = input(${prompt})`:`${ind}${pv} = float(input(${prompt}))`);
    }
    return out;
  }

  const getM = stmt.match(/^GET\s+(.+)/i);
  if (getM) { out.push(`${ind}${E(getM[1].trim())} = _get()`); return out; }

  const readM = stmt.match(/^READ\s+(.+)/i);
  if (readM) {
    for (const v of readM[1].split(',')) {
      const vt=v.trim(), pv=E(vt), isStr=/\$$/.test(vt);
      out.push(isStr?`${ind}${pv} = str(_data[_dp]); _dp += 1`:`${ind}${pv} = float(_data[_dp]); _dp += 1`);
    }
    return out;
  }

  if (/^RESTORE$/i.test(stmt)) { out.push(`${ind}_dp = 0`); return out; }
  if (/^DATA\b/i.test(stmt)) { out.push(`${ind}# DATA ${stmt.slice(4).trim()}`); return out; }

  const defM = stmt.match(/^DEF\s+FN\s+([A-Za-z][A-Za-z0-9]*)\s*\(([^)]*)\)\s*=\s*(.+)/i);
  if (defM) {
    const nm=defM[1].toLowerCase(), param=E(defM[2].trim()), body=E(defM[3]);
    fnDefs.push(nm);
    out.push(`${ind}def _fn_${nm}(${param}): return ${body}`); return out;
  }

  const letM = stmt.match(/^(?:LET\s+)?([A-Za-z][A-Za-z0-9]*(?:[%$])?(?:\s*\([^)]+\))?)\s*=\s*(.+)/i);
  if (letM) { out.push(`${ind}${E(letM[1])} = ${E(letM[2])}`); return out; }

  const forM = stmt.match(/^FOR\s+([A-Za-z][A-Za-z0-9]*%?)\s*=\s*(.+?)\s+TO\s+(.+?)(?:\s+STEP\s+(.+))?$/i);
  if (forM) {
    const v=E(forM[1]), s=E(forM[2]), e2=E(forM[3]), st=forM[4]?E(forM[4]):'1';
    const vk=v.replace(/[^a-z0-9]/g,'_');
    out.push(`${ind}${v} = ${s}; _for_end_${vk} = ${e2}; _for_step_${vk} = ${st}`); return out;
  }
  if (/^NEXT\b/i.test(stmt)) { out.push(`${ind}pass  # NEXT`); return out; }

  const gotoM = stmt.match(/^GOTO\s+(\d+)$/i);
  if (gotoM) { out.push(`${ind}_line=${gotoM[1]};continue`); return out; }

  const onGotoM = stmt.match(/^ON\s+(.+?)\s+GOTO\s+(.+)$/i);
  if (onGotoM) {
    const tgts = onGotoM[2].split(',').map(t=>t.trim());
    out.push(`${ind}_on_idx = int(${E(onGotoM[1])}) - 1`);
    tgts.forEach((t,i)=>out.push(`${ind}${i===0?'if':'elif'} _on_idx==${i}: _line=${t};continue`));
    return out;
  }
  const onGosubM = stmt.match(/^ON\s+(.+?)\s+GOSUB\s+(.+)$/i);
  if (onGosubM) {
    const tgts = onGosubM[2].split(',').map(t=>t.trim());
    out.push(`${ind}_on_idx = int(${E(onGosubM[1])}) - 1`);
    tgts.forEach((t,i)=>out.push(`${ind}${i===0?'if':'elif'} _on_idx==${i}: _ret.append(_line);_line=${t};continue`));
    return out;
  }

  const gosubM = stmt.match(/^GOSUB\s+(\d+)$/i);
  if (gosubM) { out.push(`${ind}_ret.append(_line);_line=${gosubM[1]};continue`); return out; }
  if (/^RETURN$/i.test(stmt)) { out.push(`${ind}_line=_ret.pop();continue`); return out; }
  if (/^POP$/i.test(stmt)) { out.push(`${ind}if _ret: _ret.pop()`); return out; }

  const onerrM = stmt.match(/^ONERR\s+GOTO\s+(\d+)$/i);
  if (onerrM) { out.push(`${ind}_onerr = ${onerrM[1]}`); return out; }
  if (/^RESUME\s+NEXT$/i.test(stmt)) { out.push(`${ind}_err_flag=False;_line=_resume_next_line;continue`); return out; }
  if (/^RESUME$/i.test(stmt)) { out.push(`${ind}_err_flag=False`); return out; }

  const ifElseM = stmt.match(/^IF\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+)$/i);
  if (ifElseM) {
    out.push(`${ind}if ${E(ifElseM[1])}:`);
    out.push(...convStmtPy(ifElseM[2].trim(), ind+'    ', ctx));
    out.push(`${ind}else:`);
    out.push(...convStmtPy(ifElseM[3].trim(), ind+'    ', ctx));
    return out;
  }
  const ifM = stmt.match(/^IF\s+(.+?)\s+THEN\s+(.+)$/i);
  if (ifM) {
    const then=ifM[2].trim(), gonly=then.match(/^(?:GOTO\s+)?(\d+)$/i);
    out.push(`${ind}if ${E(ifM[1])}:`);
    if (gonly) out.push(`${ind}    _line=${gonly[1]};continue`);
    else for (const s of splitColon(then)) out.push(...convStmtPy(s, ind+'    ', ctx));
    return out;
  }
  const ifGotoM = stmt.match(/^IF\s+(.+?)\s+GOTO\s+(\d+)$/i);
  if (ifGotoM) { out.push(`${ind}if ${E(ifGotoM[1])}: _line=${ifGotoM[2]};continue`); return out; }

  const dimM = stmt.match(/^DIM\s+(.+)$/i);
  if (dimM) {
    const decls=[]; let cur='', depth=0;
    for (const ch of dimM[1]+',') {
      if (ch==='(') depth++; if (ch===')') depth--;
      if (ch===','&&depth===0){decls.push(cur.trim());cur='';}else cur+=ch;
    }
    for (const d of decls) {
      const am=d.match(/([A-Za-z][A-Za-z0-9]*[%$]?)\s*\(([^)]+)\)/i);
      if (am) {
        const nm=E(am[1]), dims=am[2].split(',').map(x=>parseInt(x.trim())+1);
        if (dims.length===1) out.push(`${ind}${nm}=[0]*${dims[0]}`);
        else if (dims.length===2) out.push(`${ind}${nm}=[[0]*${dims[1]} for _ in range(${dims[0]})]`);
        else out.push(`${ind}${nm}=[[[0]*${dims[2]} for _ in range(${dims[1]})] for _ in range(${dims[0]})]`);
      }
    }
    return out;
  }

  // Graphics
  if (/^GR$/i.test(stmt))    { out.push(`${ind}_gr_init('lo')`); return out; }
  if (/^HGR2$/i.test(stmt))  { out.push(`${ind}_gr_init('hi2')`); return out; }
  if (/^HGR$/i.test(stmt))   { out.push(`${ind}_gr_init('hi')`); return out; }
  const colorM=stmt.match(/^COLOR\s*=\s*(.+)$/i);
  if (colorM) { out.push(`${ind}_gr_color(int(${E(colorM[1])}))`); return out; }
  const hcolorM=stmt.match(/^HCOLOR\s*=\s*(.+)$/i);
  if (hcolorM) { out.push(`${ind}_gr_hcolor(int(${E(hcolorM[1])}))`); return out; }
  const scaleM=stmt.match(/^SCALE\s*=\s*(.+)$/i);
  if (scaleM) { out.push(`${ind}_gr_scale=int(${E(scaleM[1])})`); return out; }
  const rotM=stmt.match(/^ROT\s*=\s*(.+)$/i);
  if (rotM) { out.push(`${ind}_gr_rot=int(${E(rotM[1])})`); return out; }
  const plotM=stmt.match(/^PLOT\s+(.+?)\s*,\s*(.+)$/i);
  if (plotM) { out.push(`${ind}_gr_plot(int(${E(plotM[1])}),int(${E(plotM[2])}))`); return out; }
  const hplotM=stmt.match(/^HPLOT\s+(.+)$/i);
  if (hplotM) {
    const pts=hplotM[1].split(/\bTO\b/i).map(p=>p.trim());
    const [x0,y0]=pts[0].split(',').map(q=>q.trim());
    out.push(`${ind}_gr_hmove(int(${E(x0)}),int(${E(y0)}))`);
    for (let i=1;i<pts.length;i++){const[x,y]=pts[i].split(',').map(q=>q.trim());out.push(`${ind}_gr_hline_to(int(${E(x)}),int(${E(y)}))`);}
    return out;
  }
  const vlinM=stmt.match(/^VLIN\s+(.+?)\s*,\s*(.+?)\s+AT\s+(.+)$/i);
  if (vlinM) { out.push(`${ind}_gr_vlin(int(${E(vlinM[1])}),int(${E(vlinM[2])}),int(${E(vlinM[3])}))`); return out; }
  const hlinM=stmt.match(/^HLIN\s+(.+?)\s*,\s*(.+?)\s+AT\s+(.+)$/i);
  if (hlinM) { out.push(`${ind}_gr_hlin(int(${E(hlinM[1])}),int(${E(hlinM[2])}),int(${E(hlinM[3])}))`); return out; }
  const drawM=stmt.match(/^(?:X)?DRAW\s+(.+?)\s+AT\s+(.+?)\s*,\s*(.+)$/i);
  if (drawM) { warnings.push('DRAW/XDRAW shape tables approximated'); out.push(`${ind}pass  # ${stmt}`); return out; }
  if (/^TEXT$/i.test(stmt))  { out.push(`${ind}_gr_text()`); return out; }

  // Text/cursor
  if (/^HOME$/i.test(stmt))    { out.push(`${ind}print('\\033[2J\\033[H',end='')`); return out; }
  if (/^INVERSE$/i.test(stmt)) { out.push(`${ind}print('\\033[7m',end='')`); return out; }
  if (/^NORMAL$/i.test(stmt))  { out.push(`${ind}print('\\033[0m',end='')`); return out; }
  if (/^FLASH$/i.test(stmt))   { out.push(`${ind}print('\\033[5m',end='')`); return out; }
  const vtabM=stmt.match(/^VTAB\s+(.+)$/i);
  if (vtabM) { out.push(`${ind}print(f'\\033[{int(${E(vtabM[1])})};1H',end='')`); return out; }
  const htabM=stmt.match(/^HTAB\s+(.+)$/i);
  if (htabM) { out.push(`${ind}print(f'\\033[{int(${E(htabM[1])})}G',end='')`); return out; }

  // System
  const pokeM=stmt.match(/^POKE\s+(.+?)\s*,\s*(.+)$/i);
  if (pokeM) { out.push(`${ind}_poke(${E(pokeM[1])},${E(pokeM[2])})`); return out; }
  const callM=stmt.match(/^CALL\s+(.+)$/i);
  if (callM) { out.push(`${ind}_call(${E(callM[1])})`); return out; }
  if (/^HIMEM\s*:/i.test(stmt)||/^LOMEM\s*:/i.test(stmt)) { out.push(`${ind}pass  # ${stmt}`); return out; }
  const speedM=stmt.match(/^SPEED\s*=\s*(.+)$/i);
  if (speedM) { out.push(`${ind}pass  # SPEED=${speedM[1]}`); return out; }
  if (/^PR#\s*\d+$/i.test(stmt)||/^IN#\s*\d+$/i.test(stmt)) { out.push(`${ind}pass  # ${stmt}`); return out; }
  if (/^TRACE$/i.test(stmt))   { out.push(`${ind}_trace=True`); return out; }
  if (/^NOTRACE$/i.test(stmt)) { out.push(`${ind}_trace=False`); return out; }
  if (/^CLEAR$/i.test(stmt))   { out.push(`${ind}pass  # CLEAR`); return out; }
  if (/^(NEW|LIST|LOAD|SAVE|RUN)$/i.test(stmt)) { out.push(`${ind}pass  # ${stmt}`); return out; }

  warnings.push(`Unrecognised: "${stmt}"`);
  out.push(`${ind}# TODO: ${stmt}`);
  return out;
}

function convertToPython(code) {
  const warnings = [], fnDefs = [];
  const numbered = parseNumbered(code);
  if (!numbered.length) throw new Error("No valid BASIC line numbers found.");
  const lineNums = numbered.map(l=>l.num);
  const src = code.toUpperCase();
  const has = re => re.test(src);
  const needsTk=has(/\b(GR|HGR|HGR2|PLOT|HPLOT|VLIN|HLIN|DRAW|XDRAW)\b/);
  const hasMath=has(/\b(SQR|SIN|COS|TAN|ATN|LOG|EXP)\b/);
  const hasRnd=has(/\bRND\b/), hasData=has(/\bDATA\b/), hasOnerr=has(/\bONERR\b/);
  const hasGosub=has(/\bGOSUB\b/), hasTrace=has(/\bTRACE\b/), hasResNext=has(/\bRESUME\s+NEXT\b/);
  const hasGet=has(/\bGET\b/), hasScrn=has(/\bSCRN\b/), hasPdl=has(/\bPDL\b/);
  const dataValues=[];
  for (const {stmt} of numbered) if (/^DATA\b/i.test(stmt)) for (const it of parseDataLine(stmt.slice(4).trim())) dataValues.push(it);
  const ctx={warnings,fnDefs,needsTk,lineNums,numbered};
  const L=[], p=(...a)=>{ for (const x of a) L.push(x); };
  p('# ═══════════════════════════════════════════════════════');
  p('# Converted from Applesoft BASIC  →  Python 3');
  p('# Apple BASIC Converter  (Complete Edition)');
  p('# ═══════════════════════════════════════════════════════');
  p('');
  if (hasMath||needsTk) p('import math');
  if (hasRnd) p('import random');
  if (needsTk) p('import tkinter as tk');
  p('import sys');
  if (hasGet) p('import tty, termios');
  p('');
  p('def _sgn(x): return 1 if x>0 else (-1 if x<0 else 0)');
  p('_rnd_last=0.0');
  p('def _rnd(x):');
  p('    global _rnd_last');
  p('    if x>0: _rnd_last=random.random(); return _rnd_last');
  p('    if x==0: return _rnd_last');
  p('    random.seed(int(x)); _rnd_last=random.random(); return _rnd_last');
  p('def _mid$(s,st,n=None): s=str(s);i=int(st)-1; return s[i:] if n is None else s[i:i+int(n)]');
  p('def _left$(s,n): return str(s)[:int(n)]');
  p('def _right$(s,n): s=str(s); return s[-int(n):] if int(n) else ""');
  p('def _spc(n): return " "*int(n)');
  p('def _tab(n): return " "*int(n)');
  p('def _fre(x): return 35000');
  p('def _usr(x): return 0');
  if (hasGet) { p('def _get():'); p('    fd=sys.stdin.fileno(); old=termios.tcgetattr(fd)'); p('    try: import tty; tty.setraw(fd); return sys.stdin.read(1)'); p('    finally: termios.tcsetattr(fd,termios.TCSADRAIN,old)'); }
  if (hasScrn) p('def _scrn(x,y): return 0');
  if (hasPdl)  p('def _pdl(n): return 127');
  p('_mem={}; _mem[222]=0; _mem[218]=0; _mem[219]=0');
  p('def _peek(a): return _mem.get(int(a),0)');
  p('def _poke(a,v): _mem[int(a)]=int(v)&0xFF');
  p('def _call(a): pass');
  if (hasTrace) p('_trace=False');
  p('def _stop(line): print(f"\\nBREAK IN {line}"); sys.exit(0)');
  p('def _end():');
  if (needsTk) { p('    if _tk_root:'); p('        try: _tk_root.mainloop()'); p('        except: pass'); }
  p('    sys.exit(0)');
  if (needsTk) {
    p('');
    p('_tk_root=None;_tk_canvas=None;_gr_mode=None');
    p('_gr_lo_color=0;_gr_hi_color=3;_gr_cx=0;_gr_cy=0;_gr_scale=1;_gr_rot=0');
    p('_LO_PAL=["#000000","#8C2020","#442098","#CC28B8","#006840","#808080","#229CF0","#88C0FF","#885000","#F07800","#808080","#FFA898","#10F010","#F0F018","#48D8C8","#FFFFFF"]');
    p('_HI_PAL=["#000000","#00FF00","#FF00FF","#FFFFFF","#000000","#FF6600","#0066FF","#FFFFFF"]');
    p('def _gr_init(mode):');
    p('    global _tk_root,_tk_canvas,_gr_mode');
    p('    if _tk_root is None: _tk_root=tk.Tk(); _tk_root.title("Apple ][ Graphics")');
    p('    if _tk_canvas: _tk_canvas.destroy()');
    p('    _gr_mode=mode');
    p('    if mode=="lo": _tk_canvas=tk.Canvas(_tk_root,width=480,height=480,bg="#000000")');
    p('    else: _tk_canvas=tk.Canvas(_tk_root,width=560,height=384,bg="#000000")');
    p('    _tk_canvas.pack(); _tk_root.update()');
    p('def _gr_color(n): global _gr_lo_color; _gr_lo_color=int(n)%16');
    p('def _gr_hcolor(n): global _gr_hi_color; _gr_hi_color=int(n)%8');
    p('def _gr_plot(x,y):');
    p('    if _tk_canvas is None: _gr_init("lo")');
    p('    col=_LO_PAL[_gr_lo_color];px=x*12;py=y*12');
    p('    _tk_canvas.create_rectangle(px,py,px+11,py+11,fill=col,outline=""); _tk_root.update()');
    p('def _gr_vlin(y1,y2,x):');
    p('    if _tk_canvas is None: _gr_init("lo")');
    p('    col=_LO_PAL[_gr_lo_color];px=x*12');
    p('    for y in range(min(y1,y2),max(y1,y2)+1): _tk_canvas.create_rectangle(px,y*12,px+11,y*12+11,fill=col,outline="")');
    p('    _tk_root.update()');
    p('def _gr_hlin(x1,x2,y):');
    p('    if _tk_canvas is None: _gr_init("lo")');
    p('    col=_LO_PAL[_gr_lo_color];py=y*12');
    p('    for x in range(min(x1,x2),max(x1,x2)+1): _tk_canvas.create_rectangle(x*12,py,x*12+11,py+11,fill=col,outline="")');
    p('    _tk_root.update()');
    p('def _gr_hmove(x,y):');
    p('    global _gr_cx,_gr_cy');
    p('    if _tk_canvas is None: _gr_init("hi")');
    p('    col=_HI_PAL[_gr_hi_color]');
    p('    _tk_canvas.create_rectangle(x*2,y*2,x*2+1,y*2+1,fill=col,outline="")');
    p('    _gr_cx=x;_gr_cy=y;_tk_root.update()');
    p('def _gr_hline_to(x2,y2):');
    p('    global _gr_cx,_gr_cy');
    p('    if _tk_canvas is None: _gr_init("hi")');
    p('    col=_HI_PAL[_gr_hi_color]');
    p('    _tk_canvas.create_line(_gr_cx*2,_gr_cy*2,x2*2,y2*2,fill=col,width=1)');
    p('    _gr_cx=x2;_gr_cy=y2;_tk_root.update()');
    p('def _gr_text():');
    p('    global _tk_canvas');
    p('    if _tk_canvas: _tk_canvas.destroy(); _tk_canvas=None');
    p('    if _tk_root: _tk_root.update()');
  }
  if (hasData) {
    p('');
    const dl=dataValues.map(v=>{ if (/^"/.test(v)) return v; const n=parseFloat(v); return isNaN(n)?JSON.stringify(v.trim()):String(n); });
    p(`_data=[${dl.join(', ')}]`);
    p('_dp=0');
  }
  if (hasOnerr) { p(''); p('_onerr=None;_err_flag=False;_resume_next_line=0'); }
  p('');
  p(`_line=${numbered[0].num}`);
  if (hasGosub) p('_ret=[]');
  p(`_lmap={${lineNums.map((n,i)=>`${n}:${i}`).join(',')}}`);
  const nextLineOf={};
  for (let i=0;i<numbered.length-1;i++) nextLineOf[numbered[i].num]=numbered[i+1].num;
  const emitLines=(ind)=>{
    for (let i=0;i<numbered.length;i++){
      const{num,stmt}=numbered[i];
      const stmts=splitColon(stmt);
      p(`${ind}if _line==${num}:`);
      if (hasTrace) p(`${ind}    if _trace: print(f"[{num}]",end=" ")`);
      if (hasResNext) p(`${ind}    _resume_next_line=${nextLineOf[num]||num}`);
      const inner=[];
      for (const s of stmts) inner.push(...convStmtPy(s,ind+'    ',ctx));
      if (!inner.length) inner.push(`${ind}    pass`);
      for (const l of inner) p(l);
      const lastRaw=stmts[stmts.length-1].trim().toUpperCase();
      const isJump=/^(GOTO|GOSUB|ON\s|RETURN|RESUME|END|STOP)\b/.test(lastRaw)||/^IF\b/.test(lastRaw);
      if (!isJump) { if (i+1<numbered.length) p(`${ind}    _line=${numbered[i+1].num}`); else p(`${ind}    break`); }
    }
  };
  if (hasOnerr) {
    p('while True:');
    p('    try:');
    p('        while True:');
    p('            if _line not in _lmap: break');
    emitLines('            ');
    p('        break');
    p('    except SystemExit: raise');
    p('    except Exception as _e:');
    p('        if _onerr is not None: _mem[222]=255;_err_flag=True;_line=_onerr');
    p('        else: raise');
  } else {
    p('while True:');
    p('    if _line not in _lmap: break');
    emitLines('    ');
  }
  if (warnings.length) { p(''); p('# ── Conversion notes ──'); for (const w of warnings) p(`# ⚠  ${w}`); }
  return { code: L.join('\n'), warnings };
}

/* ═══════════════════════════════════════════════════════════
   HTML/JS CONVERTER
   Produces a fully self-contained, runnable HTML file with:
   - Apple II terminal emulator (green phosphor)
   - Canvas for lo-res and hi-res graphics
   - Complete Applesoft runtime in JS
   - Async INPUT using a prompt overlay
═══════════════════════════════════════════════════════════ */
function exprConvJS(e, fnDefs) {
  e = e.trim();
  // Math
  e = e.replace(/\bINT\s*\(/gi,     'Math.trunc(');
  e = e.replace(/\bABS\s*\(/gi,     'Math.abs(');
  e = e.replace(/\bSGN\s*\(/gi,     '_sgn(');
  e = e.replace(/\bSQR\s*\(/gi,     'Math.sqrt(');
  e = e.replace(/\bSIN\s*\(/gi,     'Math.sin(');
  e = e.replace(/\bCOS\s*\(/gi,     'Math.cos(');
  e = e.replace(/\bTAN\s*\(/gi,     'Math.tan(');
  e = e.replace(/\bATN\s*\(/gi,     'Math.atan(');
  e = e.replace(/\bEXP\s*\(/gi,     'Math.exp(');
  e = e.replace(/\bLOG\s*\(/gi,     'Math.log(');
  e = e.replace(/\bRND\s*\(\s*0\s*\)/gi, '_rnd(0)');
  e = e.replace(/\bRND\s*\(([^)]+)\)/gi, (_, a) => `_rnd(${exprConvJS(a, fnDefs)})`);
  // String
  e = e.replace(/\bLEN\s*\(/gi,     '_len(');
  e = e.replace(/\bMID\$\s*\(/gi,   '_midS(');
  e = e.replace(/\bLEFT\$\s*\(/gi,  '_leftS(');
  e = e.replace(/\bRIGHT\$\s*\(/gi, '_rightS(');
  e = e.replace(/\bSTR\$\s*\(/gi,   '_strS(');
  e = e.replace(/\bVAL\s*\(/gi,     'parseFloat(');
  e = e.replace(/\bCHR\$\s*\(/gi,   '_chrS(');
  e = e.replace(/\bASC\s*\(/gi,     '_asc(');
  e = e.replace(/\bSPC\s*\(/gi,     '_spc(');
  e = e.replace(/\bTAB\s*\(/gi,     '_tab(');
  // System
  e = e.replace(/\bPEEK\s*\(/gi,    '_peek(');
  e = e.replace(/\bSCRN\s*\(/gi,    '_scrn(');
  e = e.replace(/\bPDL\s*\(/gi,     '_pdl(');
  e = e.replace(/\bFRE\s*\(/gi,     '_fre(');
  e = e.replace(/\bUSR\s*\(/gi,     '_usr(');
  // FN calls
  e = e.replace(/\bFN\s+([A-Za-z][A-Za-z0-9]*)\s*\(([^)]*)\)/gi,
    (_, nm, arg) => `_fn_${nm.toLowerCase()}(${exprConvJS(arg, fnDefs)})`);
  // Variable types  (integer % → just use as number; string $ → _s_ prefix)
  e = e.replace(/([A-Za-z][A-Za-z0-9]*)\%/g, (_, v) => `_i_${v.toLowerCase()}`);
  e = e.replace(/([A-Za-z][A-Za-z0-9]*)\$/g, (_, v) => `_s_${v.toLowerCase()}`);
  // Operators
  e = e.replace(/<>/g, '!=='); e = e.replace(/\^/g, '**');
  e = e.replace(/\bAND\b/gi, '&&'); e = e.replace(/\bOR\b/gi, '||'); e = e.replace(/\bNOT\b/gi, '!');
  // Lowercase remaining identifiers
  e = e.replace(/\b([A-Z][A-Z0-9]*)\b/g, m => m.toLowerCase());
  // Fix = (assignment context handled at statement level; inside expressions it's comparison)
  // Note: in Applesoft, = is both assign and compare — JS needs === for compare
  // We'll handle this by replacing standalone = with === except in assignments
  // This is done conservatively: only inside IF conditions (handled at stmt level)
  return e;
}

// For JS, we need to distinguish comparison = from assignment =
// Inside IF conditions: replace = with ===, != stays !=
function fixJSComparisons(e) {
  // Replace = that are not part of ==, !=, <=, >= with ===
  return e.replace(/([^=!<>])=([^=])/g, '$1===$2');
}

function buildJSPrintArgs(args, fnDefs) {
  if (args.trim() === '') return ['_print("")'];
  const trailSemi = /;\s*$/.test(args);
  const trailComma = /,\s*$/.test(args);
  const parts = []; let cur = '', inStr = false, depth = 0;
  for (let i = 0; i < args.length; i++) {
    const ch = args[i];
    if (ch === '"') inStr = !inStr;
    if (!inStr) { if (ch==='('||ch==='[') depth++; if (ch===')'||ch===']') depth--; }
    if (!inStr && depth === 0 && (ch === ';' || ch === ',')) {
      if (cur.trim()) parts.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  const jsParts = parts.map(p => {
    const v = exprConvJS(p, fnDefs);
    return `String(${v})`;
  });
  const joined = jsParts.join('+');
  if (trailSemi) return [`_printNoNL(${joined||'""'})`];
  if (trailComma) return [`_printTab(${joined||'""'})`];
  return [`_print(${joined||'""'})`];
}

function convStmtJS(stmt, ind, ctx) {
  const { warnings, fnDefs } = ctx;
  stmt = stmt.trim(); if (!stmt) return [];
  const out = [];
  const E = x => exprConvJS(x, fnDefs);
  const EC = x => fixJSComparisons(E(x)); // for conditions

  if (/^REM\b/i.test(stmt)||stmt.startsWith("'")) { out.push(`${ind}// ${stmt.replace(/^REM\s*/i,'').replace(/^'/,'')}`); return out; }
  if (/^END$/i.test(stmt))  { out.push(`${ind}_end(); return;`); return out; }
  if (/^STOP$/i.test(stmt)) { out.push(`${ind}_stop(_line); return;`); return out; }
  if (/^CONT$/i.test(stmt)) { out.push(`${ind}// CONT`); return out; }

  const prM = stmt.match(/^(?:PRINT|\?)\s*(.*)/is);
  if (prM) { for (const l of buildJSPrintArgs(prM[1], fnDefs)) out.push(`${ind}${l};`); return out; }

  // INPUT — async, uses await
  const inM = stmt.match(/^INPUT\s+(.+)/i);
  if (inM) {
    let rest=inM[1].trim(), prompt='"? "';
    const pm=rest.match(/^"([^"]*)"\s*[;,]\s*(.+)/);
    if (pm) { prompt=`"${pm[1]}"+"? "`; rest=pm[2]; }
    for (const v of rest.split(',')) {
      const vt=v.trim(), pv=E(vt), isStr=/\$$/.test(vt);
      if (isStr) out.push(`${ind}${pv} = await _input(${prompt});`);
      else out.push(`${ind}${pv} = parseFloat(await _input(${prompt}));`);
    }
    return out;
  }

  const getM = stmt.match(/^GET\s+(.+)/i);
  if (getM) { out.push(`${ind}${E(getM[1].trim())} = await _get();`); return out; }

  const readM = stmt.match(/^READ\s+(.+)/i);
  if (readM) {
    for (const v of readM[1].split(',')) {
      const vt=v.trim(), pv=E(vt), isStr=/\$$/.test(vt);
      out.push(isStr ? `${ind}${pv} = String(_data[_dp++]);` : `${ind}${pv} = parseFloat(_data[_dp++]);`);
    }
    return out;
  }

  if (/^RESTORE$/i.test(stmt)) { out.push(`${ind}_dp = 0;`); return out; }
  if (/^DATA\b/i.test(stmt)) { out.push(`${ind}// DATA ${stmt.slice(4).trim()}`); return out; }

  const defM = stmt.match(/^DEF\s+FN\s+([A-Za-z][A-Za-z0-9]*)\s*\(([^)]*)\)\s*=\s*(.+)/i);
  if (defM) {
    const nm=defM[1].toLowerCase(), param=E(defM[2].trim()), body=E(defM[3]);
    fnDefs.push(nm);
    out.push(`${ind}function _fn_${nm}(${param}) { return ${body}; }`); return out;
  }

  const letM = stmt.match(/^(?:LET\s+)?([A-Za-z][A-Za-z0-9]*(?:[%$])?(?:\s*\[[^\]]+\])?(?:\s*\([^)]+\))?)\s*=\s*(.+)/i);
  if (letM) {
    // Convert array access () to []
    const lhs = E(letM[1]).replace(/\(([^)]+)\)/g, '[$1]');
    const rhs = E(letM[2]).replace(/\(([^)]+)\)/g, (m, inner) => {
      // only replace if it looks like array access (identifier before paren)
      return m; // leave function calls alone — handled by E()
    });
    out.push(`${ind}${lhs} = ${E(letM[2])};`); return out;
  }

  const forM = stmt.match(/^FOR\s+([A-Za-z][A-Za-z0-9]*%?)\s*=\s*(.+?)\s+TO\s+(.+?)(?:\s+STEP\s+(.+))?$/i);
  if (forM) {
    const v=E(forM[1]), s=E(forM[2]), e2=E(forM[3]), st=forM[4]?E(forM[4]):'1';
    const vk=v.replace(/[^a-z0-9]/g,'_');
    out.push(`${ind}${v} = ${s}; _for_end_${vk} = ${e2}; _for_step_${vk} = ${st};`); return out;
  }
  if (/^NEXT\b/i.test(stmt)) { out.push(`${ind}// NEXT`); return out; }

  const gotoM = stmt.match(/^GOTO\s+(\d+)$/i);
  if (gotoM) { out.push(`${ind}_line = ${gotoM[1]}; continue;`); return out; }

  const onGotoM = stmt.match(/^ON\s+(.+?)\s+GOTO\s+(.+)$/i);
  if (onGotoM) {
    const tgts=onGotoM[2].split(',').map(t=>t.trim());
    out.push(`${ind}{ const _oi = Math.trunc(${E(onGotoM[1])}) - 1;`);
    tgts.forEach((t,i)=>out.push(`${ind}  ${i===0?'if':'else if'} (_oi===${i}) { _line=${t}; continue; }`));
    out.push(`${ind}}`); return out;
  }
  const onGosubM = stmt.match(/^ON\s+(.+?)\s+GOSUB\s+(.+)$/i);
  if (onGosubM) {
    const tgts=onGosubM[2].split(',').map(t=>t.trim());
    out.push(`${ind}{ const _oi = Math.trunc(${E(onGosubM[1])}) - 1;`);
    tgts.forEach((t,i)=>out.push(`${ind}  ${i===0?'if':'else if'} (_oi===${i}) { _ret.push(_line); _line=${t}; continue; }`));
    out.push(`${ind}}`); return out;
  }

  const gosubM = stmt.match(/^GOSUB\s+(\d+)$/i);
  if (gosubM) { out.push(`${ind}_ret.push(_line); _line=${gosubM[1]}; continue;`); return out; }
  if (/^RETURN$/i.test(stmt)) { out.push(`${ind}_line=_ret.pop(); continue;`); return out; }
  if (/^POP$/i.test(stmt)) { out.push(`${ind}if(_ret.length) _ret.pop();`); return out; }

  const onerrM = stmt.match(/^ONERR\s+GOTO\s+(\d+)$/i);
  if (onerrM) { out.push(`${ind}_onerr = ${onerrM[1]};`); return out; }
  if (/^RESUME\s+NEXT$/i.test(stmt)) { out.push(`${ind}_line=_resumeNext; continue;`); return out; }
  if (/^RESUME$/i.test(stmt)) { out.push(`${ind}// RESUME`); return out; }

  const ifElseM = stmt.match(/^IF\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+)$/i);
  if (ifElseM) {
    out.push(`${ind}if (${EC(ifElseM[1])}) {`);
    out.push(...convStmtJS(ifElseM[2].trim(), ind+'  ', ctx));
    out.push(`${ind}} else {`);
    out.push(...convStmtJS(ifElseM[3].trim(), ind+'  ', ctx));
    out.push(`${ind}}`); return out;
  }
  const ifM = stmt.match(/^IF\s+(.+?)\s+THEN\s+(.+)$/i);
  if (ifM) {
    const then=ifM[2].trim(), gonly=then.match(/^(?:GOTO\s+)?(\d+)$/i);
    out.push(`${ind}if (${EC(ifM[1])}) {`);
    if (gonly) out.push(`${ind}  _line=${gonly[1]}; continue;`);
    else for (const s of splitColon(then)) out.push(...convStmtJS(s, ind+'  ', ctx));
    out.push(`${ind}}`); return out;
  }
  const ifGotoM = stmt.match(/^IF\s+(.+?)\s+GOTO\s+(\d+)$/i);
  if (ifGotoM) { out.push(`${ind}if (${EC(ifGotoM[1])}) { _line=${ifGotoM[2]}; continue; }`); return out; }

  const dimM = stmt.match(/^DIM\s+(.+)$/i);
  if (dimM) {
    const decls=[]; let cur='', depth=0;
    for (const ch of dimM[1]+',') {
      if (ch==='(') depth++; if (ch===')') depth--;
      if (ch===','&&depth===0){decls.push(cur.trim());cur='';}else cur+=ch;
    }
    for (const d of decls) {
      const am=d.match(/([A-Za-z][A-Za-z0-9]*[%$]?)\s*\(([^)]+)\)/i);
      if (am) {
        const nm=E(am[1]), dims=am[2].split(',').map(x=>parseInt(x.trim())+1);
        if (dims.length===1) out.push(`${ind}${nm} = new Array(${dims[0]}).fill(0);`);
        else if (dims.length===2) out.push(`${ind}${nm} = Array.from({length:${dims[0]}},()=>new Array(${dims[1]}).fill(0));`);
        else out.push(`${ind}${nm} = Array.from({length:${dims[0]}},()=>Array.from({length:${dims[1]}},()=>new Array(${dims[2]}).fill(0)));`);
      }
    }
    return out;
  }

  // Graphics
  if (/^GR$/i.test(stmt))    { out.push(`${ind}_grInit('lo');`); return out; }
  if (/^HGR2$/i.test(stmt))  { out.push(`${ind}_grInit('hi2');`); return out; }
  if (/^HGR$/i.test(stmt))   { out.push(`${ind}_grInit('hi');`); return out; }
  const colorM=stmt.match(/^COLOR\s*=\s*(.+)$/i);
  if (colorM) { out.push(`${ind}_grColor(Math.trunc(${E(colorM[1])}));`); return out; }
  const hcolorM=stmt.match(/^HCOLOR\s*=\s*(.+)$/i);
  if (hcolorM) { out.push(`${ind}_grHcolor(Math.trunc(${E(hcolorM[1])}));`); return out; }
  const scaleM=stmt.match(/^SCALE\s*=\s*(.+)$/i);
  if (scaleM) { out.push(`${ind}_grScale=Math.trunc(${E(scaleM[1])});`); return out; }
  const rotM=stmt.match(/^ROT\s*=\s*(.+)$/i);
  if (rotM) { out.push(`${ind}_grRot=Math.trunc(${E(rotM[1])});`); return out; }
  const plotM=stmt.match(/^PLOT\s+(.+?)\s*,\s*(.+)$/i);
  if (plotM) { out.push(`${ind}_grPlot(Math.trunc(${E(plotM[1])}),Math.trunc(${E(plotM[2])}));`); return out; }
  const hplotM=stmt.match(/^HPLOT\s+(.+)$/i);
  if (hplotM) {
    const pts=hplotM[1].split(/\bTO\b/i).map(p=>p.trim());
    const [x0,y0]=pts[0].split(',').map(q=>q.trim());
    out.push(`${ind}_grHmove(Math.trunc(${E(x0)}),Math.trunc(${E(y0)}));`);
    for (let i=1;i<pts.length;i++){const[x,y]=pts[i].split(',').map(q=>q.trim());out.push(`${ind}_grHlineTo(Math.trunc(${E(x)}),Math.trunc(${E(y)}));`);}
    return out;
  }
  const vlinM=stmt.match(/^VLIN\s+(.+?)\s*,\s*(.+?)\s+AT\s+(.+)$/i);
  if (vlinM) { out.push(`${ind}_grVlin(Math.trunc(${E(vlinM[1])}),Math.trunc(${E(vlinM[2])}),Math.trunc(${E(vlinM[3])}));`); return out; }
  const hlinM=stmt.match(/^HLIN\s+(.+?)\s*,\s*(.+?)\s+AT\s+(.+)$/i);
  if (hlinM) { out.push(`${ind}_grHlin(Math.trunc(${E(hlinM[1])}),Math.trunc(${E(hlinM[2])}),Math.trunc(${E(hlinM[3])}));`); return out; }
  const drawM=stmt.match(/^(?:X)?DRAW\s+(.+?)\s+AT\s+(.+?)\s*,\s*(.+)$/i);
  if (drawM) { warnings.push('DRAW/XDRAW shape tables not implemented'); out.push(`${ind}// ${stmt}`); return out; }
  if (/^TEXT$/i.test(stmt))  { out.push(`${ind}_grText();`); return out; }

  // Text/cursor
  if (/^HOME$/i.test(stmt))    { out.push(`${ind}_home();`); return out; }
  if (/^INVERSE$/i.test(stmt)) { out.push(`${ind}_inverse();`); return out; }
  if (/^NORMAL$/i.test(stmt))  { out.push(`${ind}_normal();`); return out; }
  if (/^FLASH$/i.test(stmt))   { out.push(`${ind}_flash();`); return out; }
  const vtabM=stmt.match(/^VTAB\s+(.+)$/i);
  if (vtabM) { out.push(`${ind}_vtab(Math.trunc(${E(vtabM[1])}));`); return out; }
  const htabM=stmt.match(/^HTAB\s+(.+)$/i);
  if (htabM) { out.push(`${ind}_htab(Math.trunc(${E(htabM[1])}));`); return out; }

  // System
  const pokeM=stmt.match(/^POKE\s+(.+?)\s*,\s*(.+)$/i);
  if (pokeM) { out.push(`${ind}_poke(${E(pokeM[1])},${E(pokeM[2])});`); return out; }
  const callM=stmt.match(/^CALL\s+(.+)$/i);
  if (callM) { out.push(`${ind}// CALL ${E(callM[1])} (not applicable)`); return out; }
  if (/^(HIMEM|LOMEM)\s*:/i.test(stmt)||/^SPEED\s*=/i.test(stmt)) { out.push(`${ind}// ${stmt}`); return out; }
  if (/^(PR|IN)#\s*\d+$/i.test(stmt)) { out.push(`${ind}// ${stmt}`); return out; }
  if (/^TRACE$/i.test(stmt))   { out.push(`${ind}_trace=true;`); return out; }
  if (/^NOTRACE$/i.test(stmt)) { out.push(`${ind}_trace=false;`); return out; }
  if (/^CLEAR$/i.test(stmt))   { out.push(`${ind}// CLEAR`); return out; }
  if (/^(NEW|LIST|LOAD|SAVE|RUN)$/i.test(stmt)) { out.push(`${ind}// ${stmt}`); return out; }

  warnings.push(`Unrecognised: "${stmt}"`);
  out.push(`${ind}// TODO: ${stmt}`);
  return out;
}

function convertToHTML(code) {
  const warnings = [], fnDefs = [];
  const numbered = parseNumbered(code);
  if (!numbered.length) throw new Error("No valid BASIC line numbers found.");
  const lineNums = numbered.map(l=>l.num);
  const src = code.toUpperCase();
  const has = re => re.test(src);
  const hasData=has(/\bDATA\b/), hasOnerr=has(/\bONERR\b/);
  const hasGosub=has(/\bGOSUB\b/);
  const hasResNext=has(/\bRESUME\s+NEXT\b/);
  const needsGfx=has(/\b(GR|HGR|HGR2|PLOT|HPLOT|VLIN|HLIN|DRAW|XDRAW)\b/);
  const dataValues=[];
  for (const {stmt} of numbered) if (/^DATA\b/i.test(stmt)) for (const it of parseDataLine(stmt.slice(4).trim())) dataValues.push(it);
  const ctx={warnings,fnDefs,needsGfx,lineNums,numbered};
  const nextLineOf={};
  for (let i=0;i<numbered.length-1;i++) nextLineOf[numbered[i].num]=numbered[i+1].num;

  // Build JS body
  const jsLines=[];
  const jp=(...a)=>{ for (const x of a) jsLines.push(x); };

  // Variable declarations from numbered lines
  const emitLines=(ind)=>{
    for (let i=0;i<numbered.length;i++){
      const{num,stmt}=numbered[i];
      const stmts=splitColon(stmt);
      jp(`${ind}case ${num}:`);
      if (hasResNext) jp(`${ind}  _resumeNext=${nextLineOf[num]||num};`);
      const inner=[];
      for (const s of stmts) inner.push(...convStmtJS(s,ind+'  ',ctx));
      if (!inner.length) inner.push(`${ind}  // pass`);
      for (const l of inner) jp(l);
      const lastRaw=stmts[stmts.length-1].trim().toUpperCase();
      const isJump=/^(GOTO|GOSUB|ON\s|RETURN|RESUME|END|STOP)\b/.test(lastRaw)||/^IF\b/.test(lastRaw);
      if (!isJump) {
        if (i+1<numbered.length) jp(`${ind}  _line=${numbered[i+1].num};`);
        else jp(`${ind}  _running=false;`);
      }
      jp(`${ind}  break;`);
    }
  };

  const dataLit = hasData ? dataValues.map(v=>{ if (/^"/.test(v)) return v; const n=parseFloat(v); return isNaN(n)?JSON.stringify(v.trim()):String(n); }) : [];

  // Build the full HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Apple ][ Program</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000; display: flex; flex-direction: column; align-items: center;
         justify-content: flex-start; min-height: 100vh; padding: 20px; font-family: monospace; }
  #screen {
    background: #000; border: 2px solid #1a4a1a;
    box-shadow: 0 0 30px #33ff3333, inset 0 0 60px #000;
    position: relative; overflow: hidden;
  }
  #terminal {
    width: 560px; min-height: 384px; padding: 8px;
    font-family: 'Courier New', monospace; font-size: 16px; line-height: 20px;
    color: #33ff33; text-shadow: 0 0 6px #33ff33;
    white-space: pre-wrap; word-break: break-all;
    background: transparent; position: relative; z-index: 2;
  }
  #terminal.inverse { background: #33ff33; color: #000; }
  #terminal.flash { animation: flash 0.5s step-end infinite; }
  @keyframes flash { 50% { opacity: 0.3; } }
  #gfxCanvas {
    position: absolute; top: 0; left: 0;
    display: none; z-index: 1;
    image-rendering: pixelated;
  }
  #inputOverlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.7); z-index: 100;
    align-items: center; justify-content: center;
    flex-direction: column; gap: 12px;
  }
  #inputOverlay.active { display: flex; }
  #inputPrompt { color: #33ff33; font-family: 'Courier New', monospace; font-size: 16px; }
  #inputField {
    background: #000; color: #33ff33; border: 1px solid #33ff33;
    font-family: 'Courier New', monospace; font-size: 16px;
    padding: 8px 12px; width: 300px; outline: none;
    text-shadow: 0 0 4px #33ff33;
  }
  #runBtn {
    margin-top: 16px; font-family: 'Courier New', monospace;
    font-size: 14px; padding: 10px 24px;
    background: transparent; border: 1px solid #33ff33;
    color: #33ff33; cursor: pointer; letter-spacing: 2px;
    text-shadow: 0 0 6px #33ff33;
  }
  #runBtn:hover { background: #33ff3322; }
  #statusBar { color: #1a8a1a; font-family: monospace; font-size: 12px; margin-top: 10px; letter-spacing: 2px; }
</style>
</head>
<body>
<div id="screen">
  <canvas id="gfxCanvas"></canvas>
  <div id="terminal"></div>
</div>
<button id="runBtn" onclick="startProgram()">▶ RUN PROGRAM</button>
<div id="statusBar">APPLE ][ EMULATOR  ·  READY</div>
<div id="inputOverlay">
  <div id="inputPrompt"></div>
  <input id="inputField" type="text" autocomplete="off" autocorrect="off" spellcheck="false"/>
</div>

<script>
// ── Apple ][ Runtime ─────────────────────────────────────────────────────────
const _term = document.getElementById('terminal');
const _canvas = document.getElementById('gfxCanvas');
const _ctx2d = _canvas.getContext('2d');
const _status = document.getElementById('statusBar');

// Text state
let _termText = '', _termMode = 'normal';
let _col = 0;

// Graphics state
let _grMode = null, _grLoColor = 0, _grHiColor = 3;
let _grCx = 0, _grCy = 0, _grScale = 1, _grRot = 0;
const _LO_PAL = ["#000000","#8C2020","#442098","#CC28B8","#006840","#808080","#229CF0","#88C0FF","#885000","#F07800","#808080","#FFA898","#10F010","#F0F018","#48D8C8","#FFFFFF"];
const _HI_PAL = ["#000000","#00FF00","#FF00FF","#FFFFFF","#000000","#FF6600","#0066FF","#FFFFFF"];

// Program state
let _line = ${numbered[0].num};
let _ret = [];
let _onerr = null, _resumeNext = 0;
let _trace = false, _running = false;
let _mem = {};
${hasData ? `const _data = [${dataLit.join(', ')}];\nlet _dp = 0;` : ''}

// ── Terminal output ───────────────────────────────────────────────────────────
function _renderTerm() {
  _term.textContent = _termText;
  _term.scrollTop = _term.scrollHeight;
}
function _print(s) { _termText += s + '\\n'; _renderTerm(); }
function _printNoNL(s) { _termText += s; _renderTerm(); }
function _printTab(s) { _termText += s + '\\t'; _renderTerm(); }
function _home() { _termText = ''; _renderTerm(); }
function _inverse() { _term.classList.add('inverse'); }
function _normal() { _term.classList.remove('inverse','flash'); }
function _flash() { _term.classList.add('flash'); }
function _vtab(n) { /* approximate */ _termText += '\\n'.repeat(Math.max(0,n-1)); _renderTerm(); }
function _htab(n) { _termText += ' '.repeat(Math.max(0,n-1)); _renderTerm(); }

// ── Async INPUT / GET ─────────────────────────────────────────────────────────
const _overlay = document.getElementById('inputOverlay');
const _inPrompt = document.getElementById('inputPrompt');
const _inField = document.getElementById('inputField');

function _input(prompt) {
  return new Promise(resolve => {
    _printNoNL(prompt);
    _inPrompt.textContent = prompt;
    _inField.value = '';
    _overlay.classList.add('active');
    _inField.focus();
    function done(e) {
      if (e.type === 'keydown' && e.key !== 'Enter') return;
      const val = _inField.value;
      _overlay.classList.remove('active');
      _inField.removeEventListener('keydown', done);
      _termText += val + '\\n'; _renderTerm();
      resolve(val);
    }
    _inField.addEventListener('keydown', done);
  });
}

function _get() {
  return new Promise(resolve => {
    function onKey(e) {
      document.removeEventListener('keydown', onKey);
      resolve(e.key.length === 1 ? e.key : '');
    }
    document.addEventListener('keydown', onKey);
  });
}

// ── Math / String helpers ──────────────────────────────────────────────────────
function _sgn(x) { return x > 0 ? 1 : (x < 0 ? -1 : 0); }
let _rndLast = 0;
function _rnd(x) {
  if (x > 0) { _rndLast = Math.random(); return _rndLast; }
  if (x === 0) return _rndLast;
  _rndLast = Math.random(); return _rndLast;
}
function _len(s) { return String(s).length; }
function _midS(s, st, n) { s=String(s); const i=Math.trunc(st)-1; return n===undefined?s.slice(i):s.slice(i,i+Math.trunc(n)); }
function _leftS(s, n) { return String(s).slice(0, Math.trunc(n)); }
function _rightS(s, n) { const ss=String(s); const nn=Math.trunc(n); return nn?ss.slice(-nn):''; }
function _strS(x) { return String(x); }
function _chrS(x) { return String.fromCharCode(Math.trunc(x)); }
function _asc(s) { return String(s).charCodeAt(0); }
function _spc(n) { return ' '.repeat(Math.max(0,Math.trunc(n))); }
function _tab(n) { return ' '.repeat(Math.max(0,Math.trunc(n))); }
function _fre(x) { return 35000; }
function _usr(x) { return 0; }
function _peek(a) { return _mem[Math.trunc(a)] || 0; }
function _poke(a, v) { _mem[Math.trunc(a)] = Math.trunc(v) & 0xFF; }
function _scrn(x,y) { return 0; }
function _pdl(n) { return 127; }

// ── END / STOP ────────────────────────────────────────────────────────────────
function _end() { _running = false; _status.textContent = 'PROGRAM ENDED'; }
function _stop(line) { _running = false; _print('\\nBREAK IN ' + line); _status.textContent = 'STOPPED AT LINE ' + line; }

// ── Graphics ───────────────────────────────────────────────────────────────────
function _grInit(mode) {
  _grMode = mode;
  _canvas.style.display = 'block';
  _term.style.display = 'none';
  if (mode === 'lo') { _canvas.width=480; _canvas.height=480; document.getElementById('screen').style.width='480px'; }
  else { _canvas.width=560; _canvas.height=384; document.getElementById('screen').style.width='560px'; }
  _ctx2d.fillStyle='#000'; _ctx2d.fillRect(0,0,_canvas.width,_canvas.height);
}
function _grText() {
  _canvas.style.display='none'; _term.style.display='block';
}
function _grColor(n) { _grLoColor = n % 16; }
function _grHcolor(n) { _grHiColor = n % 8; }
function _grPlot(x,y) {
  _ctx2d.fillStyle = _LO_PAL[_grLoColor];
  _ctx2d.fillRect(x*12, y*12, 12, 12);
}
function _grVlin(y1,y2,x) {
  _ctx2d.fillStyle = _LO_PAL[_grLoColor];
  for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++) _ctx2d.fillRect(x*12,y*12,12,12);
}
function _grHlin(x1,x2,y) {
  _ctx2d.fillStyle = _LO_PAL[_grLoColor];
  for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) _ctx2d.fillRect(x*12,y*12,12,12);
}
function _grHmove(x,y) {
  _ctx2d.fillStyle = _HI_PAL[_grHiColor];
  _ctx2d.fillRect(x*2,y*2,2,2);
  _grCx=x; _grCy=y;
}
function _grHlineTo(x2,y2) {
  _ctx2d.strokeStyle = _HI_PAL[_grHiColor];
  _ctx2d.lineWidth=1;
  _ctx2d.beginPath(); _ctx2d.moveTo(_grCx*2,_grCy*2); _ctx2d.lineTo(x2*2,y2*2); _ctx2d.stroke();
  _grCx=x2; _grCy=y2;
}

// ── Main program (async dispatch loop) ────────────────────────────────────────
async function _runProgram() {
  _line = ${numbered[0].num};
  _ret = []; _running = true;
  _status.textContent = 'RUNNING...';
  ${hasOnerr ? '_onerr = null;' : ''}
  ${hasData ? '_dp = 0;' : ''}

  try {
    while (_running) {
      // Yield to browser every iteration so UI stays responsive
      await new Promise(r => setTimeout(r, 0));
      if (_trace) _print('[' + _line + ']');
      switch(_line) {
${jsLines.join('\n') /* will be filled below */}
        default: _running = false; break;
      }
    }
  } catch(e) {
    ${hasOnerr ? `if (_onerr !== null) {
      _mem[222] = 255;
      _line = _onerr;
      return _runProgram();
    }` : ''}
    _print('?ERROR: ' + e.message);
    _status.textContent = 'ERROR';
  }
  if (_running === false) _status.textContent = 'READY';
}

function startProgram() {
  _home(); _grText();
  _line = ${numbered[0].num};
  _runProgram();
}
</script>
</body>
</html>`;

  // Now actually build the switch cases and insert them
  const switchLines=[];
  const sp=(...a)=>{ for (const x of a) switchLines.push(x); };
  for (let i=0;i<numbered.length;i++){
    const{num,stmt}=numbered[i];
    const stmts=splitColon(stmt);
    sp(`        case ${num}:`);
    if (hasResNext) sp(`          _resumeNext=${nextLineOf[num]||num};`);
    const inner=[];
    for (const s of stmts) inner.push(...convStmtJS(s,'          ',ctx));
    if (!inner.length) inner.push('          // pass');
    for (const l of inner) sp(l);
    const lastRaw=stmts[stmts.length-1].trim().toUpperCase();
    const isJump=/^(GOTO|GOSUB|ON\s|RETURN|RESUME|END|STOP)\b/.test(lastRaw)||/^IF\b/.test(lastRaw);
    if (!isJump) {
      if (i+1<numbered.length) sp(`          _line=${numbered[i+1].num};`);
      else sp(`          _running=false;`);
    }
    sp(`          break;`);
  }

  const finalHtml = html.replace(
    `${jsLines.join('\n') /* will be filled below */}`,
    switchLines.join('\n')
  );

  if (warnings.length) {
    return { code: finalHtml + '\n<!-- Conversion notes:\n' + warnings.map(w=>'  ⚠ '+w).join('\n') + '\n-->', warnings };
  }
  return { code: finalHtml, warnings };
}

/* ═══════════════════════════════════════════════════════════
   EXAMPLES
═══════════════════════════════════════════════════════════ */
const EXAMPLES = [
  { name:"Hello World", code:`10 PRINT "HELLO, WORLD!"
20 END` },
  { name:"FOR/NEXT", code:`10 FOR I = 10 TO 1 STEP -1
20   PRINT I; " BOTTLES"
30 NEXT I
40 PRINT "DONE"
50 END` },
  { name:"ON GOTO", code:`10 PRINT "ENTER 1, 2 OR 3:"
20 INPUT X
30 ON X GOTO 100,200,300
40 PRINT "INVALID": GOTO 10
100 PRINT "ONE": GOTO 400
200 PRINT "TWO": GOTO 400
300 PRINT "THREE"
400 END` },
  { name:"DEF FN", code:`10 DEF FN SQ(X) = X * X
20 DEF FN CUBE(X) = X * X * X
30 FOR I = 1 TO 5
40   PRINT I; " SQ="; FN SQ(I); " CUBE="; FN CUBE(I)
50 NEXT I
60 END` },
  { name:"DATA/READ", code:`10 FOR I = 1 TO 3
20   READ N$, S
30   PRINT N$; " SCORED "; S
40 NEXT I
50 RESTORE
60 READ N$, S
70 PRINT "FIRST AGAIN: "; N$
80 END
100 DATA "ALICE",95,"BOB",87,"CAROL",91` },
  { name:"String Funcs", code:`10 A$ = "HELLO WORLD"
20 PRINT LEN(A$)
30 PRINT LEFT$(A$,5)
40 PRINT RIGHT$(A$,5)
50 PRINT MID$(A$,7,5)
60 PRINT ASC("A")
70 PRINT CHR$(65)
80 END` },
  { name:"ONERR/RESUME", code:`10 ONERR GOTO 900
20 DIM A(5)
30 FOR I = 1 TO 8
40   A(I) = I * 2
50 NEXT I
60 END
900 PRINT "ERROR CAUGHT"
910 RESUME NEXT` },
  { name:"Lo-Res GFX", code:`10 GR
20 FOR C = 0 TO 15
30   COLOR = C
40   VLIN 0,39 AT C*2
50   VLIN 0,39 AT C*2+1
60 NEXT C
70 END` },
  { name:"Hi-Res GFX", code:`10 HGR
20 HCOLOR = 3
30 FOR I = 0 TO 90 STEP 3
40   HPLOT 139,95 TO INT(139+100*COS(I*.0349)),INT(95-100*SIN(I*.0349))
50 NEXT I
60 END` },
  { name:"INVERSE/FLASH", code:`10 INVERSE
20 PRINT "INVERSE TEXT"
30 NORMAL
40 PRINT "NORMAL TEXT"
50 FLASH
60 PRINT "FLASHING"
70 NORMAL
80 END` },
  { name:"Guess Number", code:`10 LET X = INT(RND(1) * 100) + 1
20 PRINT "GUESS 1-100:"
30 INPUT G
40 IF G = X THEN GOTO 80
50 IF G < X THEN PRINT "TOO LOW"
60 IF G > X THEN PRINT "TOO HIGH"
70 GOTO 30
80 PRINT "CORRECT! THE NUMBER WAS "; X
90 END` },
];

/* ═══════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [input,   setInput]   = useState('');
  const [output,  setOutput]  = useState('');
  const [warns,   setWarns]   = useState([]);
  const [isErr,   setIsErr]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied,  setCopied]  = useState(false);
  const [target,  setTarget]  = useState('python'); // 'python' | 'html'
  const outputRef = useRef(null);

  const convert = useCallback(() => {
    if (!input.trim()) return;
    setLoading(true); setIsErr(false); setWarns([]);
    setTimeout(() => {
      try {
        const result = target === 'html' ? convertToHTML(input) : convertToPython(input);
        setOutput(result.code); setWarns(result.warnings);
      } catch(e) {
        setOutput(`# Conversion error:\n# ${e.message}`); setIsErr(true);
      }
      setLoading(false);
      setTimeout(()=>outputRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),60);
    }, 30);
  }, [input, target]);

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),1600); });
  };

  // Preview HTML in new tab
  const previewHTML = () => {
    if (!output || target !== 'html') return;
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const clear = () => { setInput(''); setOutput(''); setIsErr(false); setWarns([]); };
  const loadEx = ex => { setInput(ex.code); setOutput(''); setIsErr(false); setWarns([]); window.scrollTo({top:0,behavior:'smooth'}); };

  const lineCount = output ? output.split('\n').length : 0;
  const isHTML = target === 'html';

  return (
    <>
      <style>{STYLE}</style>
      <div className="crt">
        <div className="wrap">

          <div className="header">
            <div className="title ph-bright">APPLE ][  →  CODE</div>
            <div className="subtitle ph-dim">
              COMPLETE APPLESOFT CONVERTER v4.0 &nbsp;
              <span className="blink ph">█</span>
            </div>
          </div>

          {/* Target selector */}
          <div className="target-bar">
            <div className="target-label">▸ OUTPUT TARGET</div>
            <button
              className={`btn btn-s${target==='python'?' btn-active':''}`}
              onClick={()=>{ setTarget('python'); setOutput(''); setWarns([]); }}
            >🐍 PYTHON 3</button>
            <button
              className={`btn btn-js${target==='html'?' btn-active':''}`}
              onClick={()=>{ setTarget('html'); setOutput(''); setWarns([]); }}
            >🌐 HTML / JS</button>
          </div>

          <div className="panels">
            <div className="panel">
              <div className="plabel ph-dim">
                <span className="dot"></span>APPLESOFT BASIC INPUT
              </div>
              <textarea
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder={`10 DEF FN SQ(X) = X * X\n20 FOR I = 1 TO 5\n30   PRINT FN SQ(I)\n40 NEXT I\n50 END`}
                spellCheck={false}
              />
            </div>

            <div className="panel" ref={outputRef}>
              <div className="plabel ph-dim">
                <span className={`dot${isHTML?' dot-js':''}${warns.length&&!isHTML?' dot-warn':''}`}></span>
                {isHTML ? 'HTML / JAVASCRIPT OUTPUT' : 'PYTHON 3 OUTPUT'}
                {lineCount>0 && <span style={{marginLeft:'auto',fontSize:'10px',letterSpacing:'2px'}}>{lineCount} LINES</span>}
              </div>
              <div
                className={`out${isErr?' err':''}${!output?' empty':''}${loading?' spin':''}`}
                onClick={copyOutput}
                title="Tap to copy"
              >
                {loading ? (isHTML ? '<!-- CONVERTING... -->' : '# CONVERTING...')
                  : output || (isHTML
                    ? `<!-- HTML/JS TARGET ──────────────────────────
     Produces a self-contained runnable HTML file:
     · Apple ][ green phosphor terminal
     · Canvas-based lo-res & hi-res graphics
     · Async INPUT with overlay prompt
     · GET single keypress support
     · Full Applesoft runtime in JavaScript
     · Open with any web browser
     · No server needed — fully offline
     ─────────────────────────────────────────── -->`
                    : `# PYTHON 3 TARGET ──────────────────────────
# All Applesoft statements, functions &
# graphics commands supported.
# Graphics use tkinter canvas.
# ─────────────────────────────────────────`)}
              </div>
            </div>
          </div>

          {warns.length > 0 && (
            <div className="warns">{'⚠  '+warns.join('\n⚠  ')}</div>
          )}

          <div className="controls">
            <button className="btn" onClick={convert} disabled={loading}>
              {loading ? 'CONVERTING…' : '▶ CONVERT'}
            </button>
            <button className="btn btn-s" onClick={copyOutput} disabled={!output}>COPY</button>
            {isHTML && output && (
              <button className="preview-btn" onClick={previewHTML}>▶ PREVIEW IN BROWSER</button>
            )}
            <button className="btn btn-s" onClick={clear}>CLR</button>
          </div>

          <div className="examples">
            <div className="exlabel ph-dim">▸ LOAD EXAMPLE</div>
            <div className="exlist">
              {EXAMPLES.map(ex=>(
                <button key={ex.name} className="exbtn" onClick={()=>loadEx(ex)}>{ex.name}</button>
              ))}
            </div>
          </div>

          <div className="status ph-dim">
            <span>READY · RULE-BASED ENGINE · NO AI</span>
            <span>TARGET: {isHTML ? 'HTML/JS' : 'PYTHON 3'}</span>
            <span>APPLESOFT 1977–1993</span>
          </div>

        </div>
      </div>

      <div className="stickybar">
        <button className="btn" onClick={convert} disabled={loading}>
          {loading?'CONVERTING…':'▶ CONVERT'}
        </button>
        <button className="btn btn-s" onClick={copyOutput} disabled={!output}>COPY</button>
        <button className="btn btn-s" onClick={clear}>CLR</button>
      </div>

      {copied && <div className="toast">COPIED!</div>}
    </>
  );
}
