/* ============================================================
   pH Scale Explorer — interactive animations
   10th Grade Science Project
   ============================================================ */

// ---------- Color helper for the pH gradient ----------
function phColor(ph) {
  // 0..14 mapped to red → orange → yellow → green → blue → purple
  const stops = [
    {p:0,  c:[229,57,53]},
    {p:3,  c:[251,140,0]},
    {p:5,  c:[253,216,53]},
    {p:7,  c:[124,179,66]},
    {p:9,  c:[30,136,229]},
    {p:14, c:[94,53,177]},
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    if (ph <= stops[i+1].p) {
      const t = (ph - stops[i].p) / (stops[i+1].p - stops[i].p);
      const c = stops[i].c.map((v, k) => Math.round(v + t * (stops[i+1].c[k] - v)));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    }
  }
  return 'rgb(94,53,177)';
}

// ============================================================
// DIAGRAM 1: pH intro slider
// ============================================================
(function() {
  const svg = document.querySelector('.ph-intro');
  if (!svg) return;
  const ticks = svg.querySelector('#phTicks');
  for (let i = 0; i <= 14; i++) {
    const x = 40 + (i / 14) * 620;
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', x);
    t.setAttribute('y', 155);
    t.textContent = i;
    ticks.appendChild(t);
  }
  const slider = document.getElementById('phSlider');
  const readout = document.getElementById('phReadout');
  const marker = document.getElementById('phMarker');
  const markerLabel = document.getElementById('phMarkerLabel');
  function update() {
    const v = parseFloat(slider.value);
    readout.textContent = v.toFixed(1);
    const x = 40 + (v / 14) * 620;
    marker.setAttribute('transform', `translate(${x}, 80)`);
    markerLabel.textContent = `pH ${v.toFixed(1)}`;
  }
  slider.addEventListener('input', update);
  update();
})();

// ============================================================
// DIAGRAM 2: Common substances on the pH scale
// ============================================================
(function() {
  const svg = document.querySelector('.ph-scale');
  if (!svg) return;
  const ticks = svg.querySelector('#phScale2Ticks');
  for (let i = 0; i <= 14; i++) {
    const x = 40 + (i / 14) * 680;
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', x); t.setAttribute('y', 278); t.textContent = i;
    ticks.appendChild(t);
  }
  const substances = [
    { name:'Battery acid',    ph:0.5, emoji:'🔋', desc:'Sulfuric acid (H₂SO₄). Extremely corrosive.' },
    { name:'Stomach acid',    ph:1.5, emoji:'🫃', desc:'HCl. Strong enough to dissolve food.' },
    { name:'Lemon juice',     ph:2.2, emoji:'🍋', desc:'Citric acid. Why lemons pucker your face.' },
    { name:'Soda',            ph:2.5, emoji:'🥤', desc:'Phosphoric and carbonic acids. Erodes teeth!' },
    { name:'Vinegar',         ph:2.9, emoji:'🧴', desc:'Acetic acid (CH₃COOH).' },
    { name:'Tomato',          ph:4.5, emoji:'🍅', desc:'Mildly acidic — tasty in salads.' },
    { name:'Coffee',          ph:5.0, emoji:'☕', desc:'Slightly acidic.' },
    { name:'Rainwater',       ph:5.6, emoji:'🌧️', desc:'CO₂ from air dissolves into it.' },
    { name:'Milk',            ph:6.5, emoji:'🥛', desc:'Just slightly acidic.' },
    { name:'Pure water',      ph:7.0, emoji:'💧', desc:'Perfectly neutral.' },
    { name:'Blood',           ph:7.4, emoji:'🩸', desc:'Slightly basic; tightly buffered.' },
    { name:'Seawater',        ph:8.1, emoji:'🌊', desc:'Slightly basic.' },
    { name:'Baking soda',     ph:9.0, emoji:'🧁', desc:'Sodium bicarbonate.' },
    { name:'Soap',            ph:10,  emoji:'🧼', desc:'Made by reacting fat with NaOH.' },
    { name:'Ammonia',         ph:11.5,emoji:'🧽', desc:'Household cleaner.' },
    { name:'Bleach',          ph:12.5,emoji:'🧴', desc:'Strong base — never mix with acids!' },
    { name:'Drain cleaner',   ph:14,  emoji:'⚠️', desc:'NaOH. Extremely caustic.' },
  ];

  const group = svg.querySelector('#substances');
  const info  = document.getElementById('substanceInfo');
  const rowYs = [120, 90, 150, 60, 180];
  substances.forEach((s, i) => {
    const x = 40 + (s.ph / 14) * 680;
    const y = rowYs[i % rowYs.length];

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x); line.setAttribute('y1', y + 14);
    line.setAttribute('x2', x); line.setAttribute('y2', 210);
    line.setAttribute('stroke', '#aaa'); line.setAttribute('stroke-dasharray', '2,3');
    group.appendChild(line);

    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y);
    c.setAttribute('r', 13);
    c.setAttribute('fill', phColor(s.ph));
    c.setAttribute('stroke', '#222'); c.setAttribute('stroke-width', 1.5);
    c.setAttribute('class', 'subst-dot');
    c.addEventListener('click', () => {
      info.innerHTML = `<strong>${s.emoji} ${s.name}</strong> — pH ${s.ph}<br><span style="color:#555">${s.desc}</span>`;
    });
    group.appendChild(c);

    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', x); t.setAttribute('y', y + 5);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('font-size', '14');
    t.setAttribute('pointer-events', 'none');
    t.textContent = s.emoji;
    group.appendChild(t);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x); label.setAttribute('y', y - 18);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '11');
    label.setAttribute('fill', '#333');
    label.textContent = s.name;
    group.appendChild(label);
  });
})();

// ============================================================
// DIAGRAM 3: H+ and OH- ion box
// ============================================================
(function() {
  const svg = document.querySelector('.ion-box');
  if (!svg) return;
  const ionsG = svg.querySelector('#ions');
  let hCount = 10, ohCount = 10;
  const hCountEl  = document.getElementById('hCount');
  const ohCountEl = document.getElementById('ohCount');
  const phEl      = document.getElementById('ionPh');

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function render() {
    while (ionsG.firstChild) ionsG.removeChild(ionsG.firstChild);
    const placeIons = (count, color, stroke, label, sym) => {
      for (let i = 0; i < count; i++) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const x = rand(40, 660), y = rand(40, 240);
        g.setAttribute('transform', `translate(${x},${y})`);
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('r', 14); c.setAttribute('fill', color);
        c.setAttribute('stroke', stroke); c.setAttribute('stroke-width', 1.5);
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('text-anchor', 'middle'); t.setAttribute('dy', 4);
        t.setAttribute('font-size', '11'); t.setAttribute('font-weight', '700');
        t.setAttribute('fill', '#fff');
        t.textContent = sym;
        g.appendChild(c); g.appendChild(t);
        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
        anim.setAttribute('attributeName', 'transform');
        anim.setAttribute('type', 'translate');
        const x2 = x + rand(-30, 30), y2 = y + rand(-20, 20);
        anim.setAttribute('values', `${x},${y};${x2},${y2};${x},${y}`);
        anim.setAttribute('dur', `${rand(3, 6).toFixed(2)}s`);
        anim.setAttribute('repeatCount', 'indefinite');
        g.appendChild(anim);
        ionsG.appendChild(g);
      }
    };
    placeIons(hCount,  '#e53935', '#b71c1c', 'H', 'H⁺');
    placeIons(ohCount, '#5e35b1', '#311b92', 'OH', 'OH⁻');

    hCountEl.textContent  = hCount;
    ohCountEl.textContent = ohCount;
    const ratio = hCount / Math.max(1, ohCount);
    const ph = 7 - Math.log10(ratio);
    phEl.textContent = ph.toFixed(1);
  }

  document.querySelectorAll('.ion-controls .btn').forEach(b => {
    b.addEventListener('click', () => {
      const a = b.dataset.action;
      if (a === 'addH')  hCount  = Math.min(80, hCount + 10);
      if (a === 'addOH') ohCount = Math.min(80, ohCount + 10);
      if (a === 'reset') { hCount = 10; ohCount = 10; }
      render();
    });
  });
  render();
})();

// ============================================================
// DIAGRAM 4: Acid + Zinc bubbles
// ============================================================
(function() {
  const svg = document.querySelector('.acid-metal');
  if (!svg) return;
  const bubbles = svg.querySelector('#bubbles');

  function spawn() {
    const x = 140 + Math.random() * 40;
    const y = 200;
    const r = 3 + Math.random() * 5;
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y);
    c.setAttribute('r', r); c.setAttribute('fill', '#fff8e1');
    c.setAttribute('stroke', '#fbc02d'); c.setAttribute('stroke-width', 1);
    c.setAttribute('opacity', '0.85');
    bubbles.appendChild(c);

    const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    anim.setAttribute('attributeName', 'cy');
    anim.setAttribute('from', y); anim.setAttribute('to', 80);
    anim.setAttribute('dur', `${1.5 + Math.random()}s`); anim.setAttribute('fill', 'freeze');
    c.appendChild(anim);

    const fade = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    fade.setAttribute('attributeName', 'opacity');
    fade.setAttribute('from', '0.85'); fade.setAttribute('to', '0');
    fade.setAttribute('dur', '2s'); fade.setAttribute('fill', 'freeze');
    c.appendChild(fade);

    anim.beginElement(); fade.beginElement();
    setTimeout(() => { if (c.parentNode) bubbles.removeChild(c); }, 2200);
  }
  setInterval(spawn, 350);
})();

// ============================================================
// DIAGRAM 5: Soap bubbles
// ============================================================
(function() {
  const svg = document.querySelector('.base-soap');
  if (!svg) return;
  const g = svg.querySelector('#soapBubbles');

  function spawn() {
    const x = 60 + Math.random() * 200;
    const y = 200;
    const r = 6 + Math.random() * 10;
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y);
    c.setAttribute('r', r); c.setAttribute('fill', 'rgba(179,157,219,0.5)');
    c.setAttribute('stroke', '#7e57c2'); c.setAttribute('stroke-width', 1);
    g.appendChild(c);

    const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    anim.setAttribute('attributeName', 'cy');
    anim.setAttribute('from', y); anim.setAttribute('to', 50);
    anim.setAttribute('dur', `${2.5 + Math.random()}s`); anim.setAttribute('fill', 'freeze');
    c.appendChild(anim);

    const fade = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    fade.setAttribute('attributeName', 'opacity');
    fade.setAttribute('from', '1'); fade.setAttribute('to', '0');
    fade.setAttribute('dur', '3.2s'); fade.setAttribute('fill', 'freeze');
    c.appendChild(fade);

    anim.beginElement(); fade.beginElement();
    setTimeout(() => { if (c.parentNode) g.removeChild(c); }, 3400);
  }
  setInterval(spawn, 600);
})();

// ============================================================
// DIAGRAM 6: Water balance — gentle wobble
// ============================================================
(function() {
  const beam = document.getElementById('beam');
  if (!beam) return;
  let t = 0;
  setInterval(() => {
    t += 0.05;
    const angle = Math.sin(t) * 1.5;
    beam.setAttribute('transform', `rotate(${angle} 350 100)`);
  }, 50);
})();

// ============================================================
// DIAGRAM 7: pH Indicator color demo
// ============================================================
(function() {
  const slider = document.getElementById('indicatorSlider');
  if (!slider) return;
  const select = document.getElementById('indicatorSelect');
  const flask  = document.getElementById('indicatorFlask');
  const label  = document.getElementById('indicatorLabel');
  const phRead = document.getElementById('indicatorPh');
  const phReadout = document.getElementById('indicatorPhReadout');

  const indicators = {
    litmus: ph => {
      if (ph < 4.5) return { color: '#e53935', name: 'red (acidic)' };
      if (ph > 8.3) return { color: '#1e88e5', name: 'blue (basic)' };
      return { color: '#9575cd', name: 'purple (transition)' };
    },
    universal: ph => ({ color: phColor(ph), name: `pH ≈ ${ph}` }),
    phenolphthalein: ph => {
      if (ph < 8.2) return { color: '#f5f5f5', name: 'colorless' };
      if (ph > 10)  return { color: '#ec407a', name: 'bright pink' };
      return { color: '#f8bbd0', name: 'light pink' };
    },
    methyl_orange: ph => {
      if (ph < 3.1) return { color: '#e53935', name: 'red' };
      if (ph > 4.4) return { color: '#fdd835', name: 'yellow' };
      return { color: '#fb8c00', name: 'orange (transition)' };
    },
  };

  function update() {
    const ph = parseFloat(slider.value);
    const ind = select.value;
    const r = indicators[ind](ph);
    flask.setAttribute('fill', r.color);
    label.textContent = r.name;
    phRead.textContent = `pH ${ph.toFixed(1)}`;
    phReadout.textContent = ph.toFixed(1);
  }
  slider.addEventListener('input', update);
  select.addEventListener('change', update);
  update();
})();

// ============================================================
// DIAGRAM 8: Neutralization animation
// ============================================================
(function() {
  const btn = document.getElementById('runNeutralize');
  if (!btn) return;
  const acid = document.getElementById('acidBeaker');
  const base = document.getElementById('baseBeaker');
  const product = document.getElementById('productBeaker');

  btn.addEventListener('click', () => {
    acid.style.transition  = 'transform 0.6s';
    base.style.transition  = 'transform 0.6s';
    acid.style.transform   = 'translate(180px, 0)';
    base.style.transform   = 'translate(140px, 0)';
    product.style.transition = 'transform 0.6s 0.6s';
    product.style.transform  = 'scale(1.1)';
    setTimeout(() => {
      acid.style.transform = '';
      base.style.transform = '';
      product.style.transform = '';
    }, 1800);
  });
})();
