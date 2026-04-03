/* ═══════════════════════════════════════════════
   AFES Wiki — script.js
   ═══════════════════════════════════════════════ */
'use strict';

/* ── ACCORDION ── */
function toggleAccordion(btn) {
  const body   = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
  btn.closest('.accordion')?.classList.toggle('is-open', !isOpen);
}

function openAccordion(btn) {
  const body = btn.nextElementSibling;
  btn.classList.add('open');
  body.classList.add('open');
  btn.closest('.accordion')?.classList.add('is-open');
}

/* ── SMOOTH SCROLL ── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── SIDEBAR / HAMBURGER ── */
const sidebar     = document.getElementById('sidebar');
const hamburger   = document.getElementById('hamburger');
const mainContent = document.getElementById('mainContent');

hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
mainContent.addEventListener('click', () => {
  if (window.innerWidth <= 960 && sidebar.classList.contains('open'))
    sidebar.classList.remove('open');
});

/* ── ACTIVE NAV LINK + BREADCRUMB ── */
const navLinks   = document.querySelectorAll('.nav-link, .nav-sub a');
const breadcrumb = document.getElementById('breadcrumb');

const bcMap = {
  intro:  'AFES / Home',
  parte1: 'AFES / Parte I — Riferimento Operativo',
  parte2: 'AFES / Parte II — Microcase Formativi',
  parte3: 'AFES / Parte III — Raccomandazioni Tecniche',
};

function updateActiveLink() {
  const scrollY = window.scrollY + 90;
  let currentId = 'intro';

  document.querySelectorAll('[id]').forEach(el => {
    if (el.offsetTop <= scrollY) currentId = el.id;
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === '#' + currentId);
  });

  const bcKey =
    currentId === 'intro'  ? 'intro'  :
    currentId === 'parte1' || currentId.startsWith('p1-') ? 'parte1' :
    currentId === 'parte2' || /^s0\d/.test(currentId)     ? 'parte2' :
    currentId === 'parte3' || /^r\d/.test(currentId)      ? 'parte3' : 'intro';

  if (breadcrumb) breadcrumb.textContent = bcMap[bcKey] || 'AFES / Home';
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ── SEARCH ── */
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  clearHighlights();
  if (q.length < 2) return;

  highlightText(mainContent, q);

  const first = document.querySelector('mark.highlight');
  if (first) {
    first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const body = first.closest('.accordion-body');
    if (body && !body.classList.contains('open')) {
      const btn = body.previousElementSibling;
      if (btn) openAccordion(btn);
    }
  }
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchInput.value = ''; clearHighlights(); }
});

function highlightText(node, q) {
  if (!node) return;
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    const idx  = text.toLowerCase().indexOf(q);
    if (idx === -1) return;
    const mark = document.createElement('mark');
    mark.className = 'highlight';
    mark.textContent = text.slice(idx, idx + q.length);
    const frag = document.createDocumentFragment();
    frag.append(
      document.createTextNode(text.slice(0, idx)),
      mark,
      document.createTextNode(text.slice(idx + q.length))
    );
    node.parentNode.replaceChild(frag, node);
    return;
  }
  const skip = ['SCRIPT','STYLE','INPUT','TEXTAREA','MARK'];
  if (skip.includes(node.nodeName)) return;
  Array.from(node.childNodes).forEach(c => highlightText(c, q));
}

function clearHighlights() {
  document.querySelectorAll('mark.highlight').forEach(m =>
    m.replaceWith(document.createTextNode(m.textContent))
  );
  mainContent.normalize();
}

/* ── KEYBOARD SHORTCUTS ── */
document.addEventListener('keydown', e => {
  if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

/* ── SMOOTH NAV SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.innerWidth <= 960) sidebar.classList.remove('open');
  });
});

/* ── BACK TO TOP ── */
const btt = document.createElement('button');
btt.title = 'Torna in cima';
btt.innerHTML = '↑';
Object.assign(btt.style, {
  position: 'fixed', bottom: '28px', right: '28px',
  width: '38px', height: '38px', borderRadius: '50%',
  background: '#0F172A',
  color: '#94A3B8', border: '1px solid rgba(255,255,255,.12)', fontSize: '16px',
  cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,.3)',
  opacity: '0', transform: 'translateY(10px)',
  transition: 'opacity .25s ease, transform .25s ease',
  zIndex: '998', fontFamily: 'system-ui, sans-serif',
});
document.body.appendChild(btt);
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => {
  const show = window.scrollY > 400;
  btt.style.opacity   = show ? '1' : '0';
  btt.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
}, { passive: true });

/* ── AUTO-OPEN FIRST ACCORDION PER SECTION ── */
/* Script is at bottom of body, DOM is already ready */
(function () {
  // Open first accordion in Parte I
  const p1 = document.getElementById('parte1');
  if (p1) {
    const first = p1.querySelector('.accordion-btn');
    if (first) openAccordion(first);
  }

  // Open first accordion in Parte III
  const p3 = document.getElementById('parte3');
  if (p3) {
    const first = p3.querySelector('.accordion-btn');
    if (first) openAccordion(first);
  }

  // Open first scenario in Parte II
  const p2 = document.getElementById('parte2');
  if (p2) {
    const first = p2.querySelector('.scenario-acc-btn');
    if (first) openAccordion(first);
  }
}());
