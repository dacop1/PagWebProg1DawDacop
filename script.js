/**
 * script.js — Portfolio Daniel Copete
 */
'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var header       = document.getElementById('header');
    var hamburger    = document.getElementById('hamburger');
    var navMenu      = document.getElementById('nav-menu');
    var scrollTopBtn = document.getElementById('scrollToTop');
    var navLinks     = document.querySelectorAll('.nav-link');
    var HEADER_H     = 70;

    /* ── UTILIDADES ── */
    function closeMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu)   navMenu.classList.remove('active');
    }

    function setActiveLink(matchHref) {
        navLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === matchHref);
        });
    }

    /* ── SCROLL: header + botón arriba ── */
    window.addEventListener('scroll', function () {
        if (header)       header.classList.toggle('scrolled', window.scrollY > 40);
        if (scrollTopBtn) scrollTopBtn.classList.toggle('show',  window.scrollY > 280);
    }, { passive: true });

    /* ── BOTÓN VOLVER ARRIBA ── */
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── HAMBURGUESA ── */
    if (hamburger) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = navMenu && navMenu.classList.contains('active');
            if (open) {
                closeMenu();
            } else {
                hamburger.classList.add('active');
                if (navMenu) navMenu.classList.add('active');
            }
        });
        hamburger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hamburger.click(); }
        });
    }

    /* Cerrar menú al hacer clic fuera */
    document.addEventListener('click', function (e) {
        if (!navMenu || !hamburger) return;
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });

    /* Cerrar con Escape */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    /* ── NAV LINKS ── */
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            closeMenu();

            var href    = this.getAttribute('href') || '';
            var hashIdx = href.indexOf('#');

            /* Sin hash → navegación normal (ej. mi_contacto.html) */
            if (hashIdx === -1) return;

            var file     = href.substring(0, hashIdx);
            var hash     = href.substring(hashIdx + 1);
            var currFile = window.location.pathname.split('/').pop() || 'index.html';
            var sameFile = (file === '' || file === currFile);

            if (sameFile && hash) {
                /* Misma página: scroll suave */
                e.preventDefault();
                var target = document.getElementById(hash);
                if (target) {
                    var top = target.getBoundingClientRect().top + window.scrollY - HEADER_H;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                    history.pushState(null, null, '#' + hash);
                }
            }
            /*
             * Si file !== currFile (ej. clic en "Inicio" desde teoria_ud1.html):
             * se deja navegar al navegador normalmente → carga index.html#inicio
             */
        });
    });

    /* ── SCROLL A HASH AL CARGAR (ej. index.html#portfolio) ── */
    if (window.location.hash) {
        var initHash   = window.location.hash.substring(1);
        var initTarget = document.getElementById(initHash);
        if (initTarget) {
            /* Esperamos a que el layout esté listo */
            setTimeout(function () {
                var top = initTarget.getBoundingClientRect().top + window.scrollY - HEADER_H;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }, 250);
        }
    }

    /* ── ACTIVE LINK INTELIGENTE ── */
    var currFile = window.location.pathname.split('/').pop() || 'index.html';

    if (currFile === 'mi_contacto.html') {
        setActiveLink('mi_contacto.html');

    } else if (currFile.startsWith('teoria_')) {
        /* En teoría: marcar Portfolio como activo */
        setActiveLink('index.html#portfolio');

    } else {
        /*
         * En index.html: scroll-spy con IntersectionObserver.
         * Detecta qué sección está en pantalla y marca el link correcto.
         * Así nunca se marcan todos a la vez.
         */
        var sections = document.querySelectorAll('main section[id]');
        if ('IntersectionObserver' in window && sections.length) {
            var spy = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var id = entry.target.getAttribute('id');
                    navLinks.forEach(function (l) {
                        var lhref = l.getAttribute('href') || '';
                        var lhash = lhref.split('#')[1] || '';
                        l.classList.toggle('active', lhash === id);
                    });
                });
            }, { rootMargin: '-35% 0px -60% 0px' });

            sections.forEach(function (s) { spy.observe(s); });
        }
    }

    /* ── ANIMACIÓN DE CARDS ── */
    var cards = document.querySelectorAll('.portfolio-card');
    if ('IntersectionObserver' in window && cards.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, idx) {
                if (!entry.isIntersecting) return;
                setTimeout(function () { entry.target.classList.add('visible'); }, idx * 70);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.1 });
        cards.forEach(function (c) { io.observe(c); });
    } else {
        cards.forEach(function (c) { c.classList.add('visible'); });
    }

});