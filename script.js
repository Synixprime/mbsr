// ===== NAVIGATION SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ANIMATIONS AU SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observer tous les éléments avec la classe fade-in
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ===== EFFET NAVBAR AU SCROLL =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});

// ===== GESTION FORMULAIRE DE CONTACT (EMAILJS) =====
document.querySelector('.contact-form form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = new FormData(this);
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        phone: formData.get('phone') || 'Non renseigné',
        message: formData.get('message')
    };
    
    // Validation simple
    if (!templateParams.from_name || !templateParams.from_email || !templateParams.message) {
        showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(templateParams.from_email)) {
        showNotification('Veuillez saisir une adresse email valide.', 'error');
        return;
    }
    
    // Désactiver le bouton pendant l'envoi
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    // Envoyer l'email via EmailJS
    emailjs.send('service_90nq8cj', 'template_sveu9o7', templateParams, '9QExCaGSrHj7QEbMW')
        .then(function(response) {
            showNotification('Merci pour votre message ! Dorothée vous contactera dans les plus brefs délais.', 'success');
            document.querySelector('.contact-form form').reset();
        })
        .catch(function(error) {
            showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            console.error('EmailJS Error:', error);
        })
        .finally(function() {
            // Réactiver le bouton
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
});

// ===== SYSTÈME DE NOTIFICATIONS =====
function showNotification(message, type) {
    // Créer l'élément notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Styles de base pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Gérer la fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
    `;
    
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (document.body.contains(notification)) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 300);
}

// ===== EFFETS INTERACTIFS SUR LES CARTES =====
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===== MENU MOBILE =====
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        const navContainer = document.querySelector('.nav-container');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!document.querySelector('.burger')) {
            const burger = document.createElement('div');
            burger.className = 'burger';
            burger.innerHTML = '☰';
            navContainer.appendChild(burger);
            
            burger.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
            });
            
            // Fermer le menu quand on clique sur un lien
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    burger.innerHTML = '☰';
                });
            });
        }
    } else {
        const burger = document.querySelector('.burger');
        if (burger) {
            burger.remove();
        }
        document.querySelector('.nav-menu').classList.remove('active');
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// ===== ANIMATION CERCLE DE MÉDITATION =====
const meditationCircle = document.querySelector('.meditation-circle');
if (meditationCircle) {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCircle() {
        const rect = meditationCircle.getBoundingClientRect();
        const circleX = rect.left + rect.width / 2;
        const circleY = rect.top + rect.height / 2;
        
        const deltaX = (mouseX - circleX) * 0.01;
        const deltaY = (mouseY - circleY) * 0.01;
        
        meditationCircle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        requestAnimationFrame(animateCircle);
    }
    
    animateCircle();
}

// ===== COMPTEUR ANIMÉ (pour les statistiques) =====
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===== GESTION DES COOKIES (basique) =====
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// ===== PERFORMANCE ET OPTIMISATION =====
// Lazy loading pour les images (si ajoutées plus tard)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== ACCESSIBILITÉ =====
// Focus management pour les utilisateurs au clavier
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// ===== ÉVÉNEMENTS PERSONNALISÉS =====
// Événement personnalisé pour le changement de section
function triggerSectionChange(sectionName) {
    const event = new CustomEvent('sectionChange', {
        detail: { section: sectionName }
    });
    document.dispatchEvent(event);
}

// Écouter les changements de section
document.addEventListener('sectionChange', function(e) {
    console.log(`Section active: ${e.detail.section}`);
});

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site MBSR Béziers initialisé');
    
    // Vérifier si c'est la première visite
    if (!getCookie('visited')) {
        setCookie('visited', 'true', 30);
        // Optionnel: afficher un message de bienvenue
    }
    
    // Animer les éléments déjà visibles
    document.querySelectorAll('.fade-in').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
});