/* ============================================================
   main.js — Interactividad del sitio La Litoral
   ============================================================ */

// Quita el estado de precarga para disparar la animación del intro
window.addEventListener('load', () => {
  document.body.classList.remove('is-preload');
});

// ---------- Sidebar móvil ----------
const sidebar = document.getElementById('sidebar');
const toggle = sidebar.querySelector('.sidebar-toggle');

toggle.addEventListener('click', () => sidebar.classList.toggle('abierto'));
sidebar.querySelectorAll('nav a').forEach(a => {
  a.addEventListener('click', () => sidebar.classList.remove('abierto'));
});

// ---------- Scroll-spy: resalta el enlace de la sección visible ----------
const enlaces = Array.from(sidebar.querySelectorAll('nav a'));
const secciones = enlaces
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const spy = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      const id = entrada.target.id;
      enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

secciones.forEach(s => spy.observe(s));

// ---------- Reveals al hacer scroll ----------
const revelar = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
      revelar.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up, .spotlights > section').forEach(el => revelar.observe(el));

// ---------- Contadores animados ----------
const animarContador = (el) => {
  const meta = parseInt(el.dataset.meta, 10);
  const dur = 1400;
  const t0 = performance.now();
  const paso = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(meta * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
};
const spyCifras = new IntersectionObserver((entradas) => {
  entradas.forEach(e => { if (e.isIntersecting) { animarContador(e.target); spyCifras.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('.cifra strong').forEach(el => spyCifras.observe(el));

// ---------- Filtro de programas ----------
const filtros = document.querySelectorAll('.filtro');
const programas = document.querySelectorAll('.programa');

filtros.forEach(boton => {
  boton.addEventListener('click', () => {
    filtros.forEach(b => { b.classList.remove('activo'); b.setAttribute('aria-selected', 'false'); });
    boton.classList.add('activo');
    boton.setAttribute('aria-selected', 'true');

    const grupo = boton.dataset.filtro;
    programas.forEach(p => {
      const visible = p.dataset.grupo === grupo;
      p.classList.toggle('oculto', !visible);
    });
  });
});

// ---------- Formulario ----------
const form = document.getElementById('formContacto');
const formOk = document.getElementById('formOk');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Aquí se conecta el envío real (correo, CRM o API de WhatsApp).
  formOk.hidden = false;
  form.reset();
  setTimeout(() => { formOk.hidden = true; }, 6000);
});
