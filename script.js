/* =============================================
   MBINYA BNB - Interactive JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavbar();
    initMobileMenu();
    initVideoPlayers();
    initGallery();
    initScrollAnimations();
    initBookingForm();
    initSmoothScroll();
});

/* =============================================
   PRELOADER
   ============================================= */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('loaded');
            // Enable scroll after preloader
            document.body.style.overflow = 'auto';
        }, 1000);
    });
    
    // Fallback - hide preloader after 3 seconds max
    setTimeout(function() {
        preloader.classList.add('loaded');
        document.body.style.overflow = 'auto';
    }, 3000);
}

/* =============================================
   NAVBAR
   ============================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close menu when clicking a link
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

/* =============================================
   VIDEO PLAYERS
   ============================================= */
function initVideoPlayers() {
    // Set high quality for all videos
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(function(video) {
        // Prefer high quality playback
        if (video.getVideoPlaybackQuality) {
            video.getVideoPlaybackQuality();
        }
        // Set playback rate to normal for quality
        video.playbackRate = 1.0;
        // Ensure best quality rendering
        video.style.imageRendering = 'crisp-edges';
    });

    // Property card videos - play on hover
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(function(card) {
        const video = card.querySelector('.property-video');
        const playBtn = card.querySelector('.play-btn');
        
        if (video) {
            // Preload video data for smooth playback
            video.load();
            
            // Play video on hover
            card.addEventListener('mouseenter', function() {
                video.play().catch(function(e) {
                    console.log('Video autoplay prevented:', e);
                });
            });
            
            // Pause video when not hovering
            card.addEventListener('mouseleave', function() {
                video.pause();
                video.currentTime = 0;
            });
            
            // Play button click - open in fullscreen for best quality
            if (playBtn) {
                playBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Try fullscreen for best quality viewing
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                        video.play();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                        video.play();
                    } else if (video.paused) {
                        video.play();
                        playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
                    } else {
                        video.pause();
                        playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
                    }
                });
            }
        }
    });
    
    // Gallery videos
    const galleryVideos = document.querySelectorAll('.gallery-item.video-item');
    
    galleryVideos.forEach(function(item) {
        const video = item.querySelector('video');
        const playBtn = item.querySelector('.gallery-play');
        
        if (video && playBtn) {
            item.addEventListener('mouseenter', function() {
                video.play().catch(function(e) {
                    console.log('Video autoplay prevented:', e);
                });
            });
            
            item.addEventListener('mouseleave', function() {
                video.pause();
            });
            
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                }
                video.play();
            });
        }
    });
}

/* =============================================
   GALLERY
   ============================================= */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item:not(.video-item)');
    
    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Create lightbox
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <button class="lightbox-close">&times;</button>
                        <img src="${img.src}" alt="${img.alt}">
                    </div>
                `;
                document.body.appendChild(lightbox);
                
                // Animate in
                requestAnimationFrame(function() {
                    lightbox.classList.add('active');
                });
                
                // Close on click
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                        lightbox.classList.remove('active');
                        setTimeout(function() {
                            lightbox.remove();
                        }, 300);
                    }
                });
                
                // Close on escape
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        lightbox.classList.remove('active');
                        setTimeout(function() {
                            lightbox.remove();
                        }, 300);
                    }
                });
            }
        });
    });
    
    // Add lightbox styles dynamically
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
        .lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 2rem;
        }
        .lightbox.active {
            opacity: 1;
        }
        .lightbox-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
        }
        .lightbox-content img {
            max-width: 100%;
            max-height: 85vh;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2.5rem;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .lightbox-close:hover {
            transform: scale(1.2);
        }
    `;
    document.head.appendChild(lightboxStyles);
}

/* =============================================
   SCROLL ANIMATIONS (AOS-like)
   ============================================= */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', throttle(checkScroll, 100));
    
    function checkScroll() {
        animatedElements.forEach(function(element) {
            if (isInViewport(element)) {
                const delay = element.getAttribute('data-aos-delay') || 0;
                setTimeout(function() {
                    element.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // Trigger when element is 20% into viewport
        return rect.top <= windowHeight * 0.85;
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }
}

/* =============================================
   BOOKING FORM
   ============================================= */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    
    if (form) {
        // Set minimum date for check-in (today)
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput) {
            checkinInput.setAttribute('min', today);
            
            // Update checkout min date when checkin changes
            checkinInput.addEventListener('change', function() {
                const checkinDate = new Date(this.value);
                checkinDate.setDate(checkinDate.getDate() + 1);
                const minCheckout = checkinDate.toISOString().split('T')[0];
                checkoutInput.setAttribute('min', minCheckout);
                
                // Clear checkout if it's before checkin
                if (checkoutInput.value && checkoutInput.value <= this.value) {
                    checkoutInput.value = '';
                }
            });
        }
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            
            // Create WhatsApp message
            const message = createWhatsAppMessage(data);
            
            // Show success notification
            showNotification('Thank you! Redirecting to WhatsApp...', 'success');
            
            // Redirect to WhatsApp after a short delay (Mercy's number: 0704220188)
            setTimeout(function() {
                window.open(`https://wa.me/254704220188?text=${encodeURIComponent(message)}`, '_blank');
            }, 1500);
            
            // Reset form
            form.reset();
        });
    }
}

function createWhatsAppMessage(data) {
    return `Hi Mercy! 🏠 Mbinya BnB Booking Request

I'd like to make a booking:

📌 *Name:* ${data.name}
📧 *Email:* ${data.email}
📱 *Phone:* ${data.phone}
👥 *Guests:* ${data.guests}
📅 *Check-in:* ${data.checkin}
📅 *Check-out:* ${data.checkout}
🏡 *Property:* ${data.property}
📍 *Area:* Thika Rd (Kamakis/Kimbo/Membley)
${data.message ? `💬 *Message:* ${data.message}` : ''}

Looking forward to your response!`;
}

function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '!'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(function() {
        notification.classList.add('show');
    });
    
    // Remove after 4 seconds
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    }
    .notification.show {
        transform: translateX(0);
    }
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }
    .notification-success .notification-content {
        border-left: 4px solid #4caf50;
    }
    .notification-error .notification-content {
        border-left: 4px solid #e74c3c;
    }
    .notification-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: bold;
    }
    .notification-success .notification-icon {
        background: #4caf50;
        color: white;
    }
    .notification-error .notification-icon {
        background: #e74c3c;
        color: white;
    }
    .notification-message {
        font-weight: 500;
        color: #2d2d3a;
    }
`;
document.head.appendChild(notificationStyles);

/* =============================================
   SMOOTH SCROLL
   ============================================= */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =============================================
   PARALLAX EFFECTS (Optional Enhancement)
   ============================================= */
function initParallax() {
    const hero = document.querySelector('.hero-video');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
}

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

// Animate stats when they come into view
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function checkStats() {
        if (animated) return;
        
        const firstStat = stats[0];
        if (firstStat) {
            const rect = firstStat.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                animated = true;
                stats.forEach(function(stat) {
                    const text = stat.textContent;
                    const number = parseInt(text);
                    if (!isNaN(number)) {
                        const suffix = text.replace(number, '');
                        animateCounter(stat, number, 2000);
                        setTimeout(function() {
                            stat.textContent = number + suffix;
                        }, 2100);
                    }
                });
            }
        }
    }
    
    window.addEventListener('scroll', checkStats);
    checkStats();
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', initCounterAnimation);

/* =============================================
   TYPING EFFECT FOR HERO (Optional)
   ============================================= */
function typeWriter(element, text, speed) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* =============================================
   INTERSECTION OBSERVER FOR LAZY LOADING
   ============================================= */
function initLazyLoading() {
    const videos = document.querySelectorAll('video[data-src]');
    
    const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source');
                if (source && source.dataset.src) {
                    source.src = source.dataset.src;
                    video.load();
                }
                observer.unobserve(video);
            }
        });
    }, options);
    
    videos.forEach(function(video) {
        observer.observe(video);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

