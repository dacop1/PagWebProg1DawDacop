/**
 * script.js - Funcionalidades interactivas para el portfolio
 * 
 * Incluye:
 * - Efecto de scroll en el header
 * - Menú hamburguesa para móviles
 * - Scroll suave para enlaces internos (funciona incluso desde otras páginas)
 * - Botón "volver arriba"
 * - Cierre automático del menú al hacer clic en un enlace
 */

'use strict';

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // ===== ELEMENTOS DEL DOM =====
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = 80; // Misma altura definida en CSS (var(--header-height))

    // ===== FUNCIÓN PARA AJUSTAR EL SCROLL SUAVE CUANDO SE LLEGA CON ANCLA =====
    // Si la URL contiene un hash (ej. index.html#portfolio), hacemos scroll suave
    if (window.location.hash) {
        // Quitamos el # del hash
        const hash = window.location.hash.substring(1); // "portfolio", "sobre-mi", etc.
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            // Pequeño retraso para asegurar que el DOM esté listo
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // ===== EFECTO DE SCROLL EN EL HEADER =====
    window.addEventListener('scroll', function() {
        // Si el scroll es mayor de 50px, añadimos clase 'scrolled' al header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Mostrar/ocultar botón "volver arriba"
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // ===== MENÚ HAMBURGUESA =====
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // ===== CERRAR MENÚ AL HACER CLIC EN UN ENLACE =====
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== SCROLL SUAVE PARA ENLACES INTERNOS (incluso desde otras páginas) =====
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            // Prevenimos el comportamiento por defecto solo si el enlace es interno (con #)
            const href = this.getAttribute('href');
            
            // Si el enlace contiene un hash (ej. index.html#inicio) y estamos en la misma página
            // O si es solo #inicio (caso de estar en index)
            if (href.includes('#')) {
                event.preventDefault();

                // Separamos la parte del archivo y el hash
                const [file, hash] = href.split('#');
                
                // Si el archivo es "index.html" o está vacío (enlace relativo), consideramos la página actual
                if (file === 'index.html' || file === '' || file === window.location.pathname.split('/').pop()) {
                    // Si el hash existe, hacemos scroll suave
                    if (hash) {
                        const targetSection = document.getElementById(hash);
                        if (targetSection) {
                            window.scrollTo({
                                top: targetSection.offsetTop - headerHeight,
                                behavior: 'smooth'
                            });
                            // Actualizamos la URL sin recargar (opcional)
                            history.pushState(null, null, `#${hash}`);
                        }
                    }
                } else {
                    // Si el archivo es diferente (ej. otra página), redirigimos con el hash
                    window.location.href = href;
                }
            }
            // Si el enlace no tiene #, se comporta normalmente (ej. mi_contacto.html)
        });
    });

    // ===== BOTÓN VOLVER ARRIBA =====
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== CERRAR MENÚ AL HACER CLIC FUERA DE ÉL (opcional, mejora UX) =====
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});