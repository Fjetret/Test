document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuButton.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenuButton && !mobileMenuButton.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Takk for din melding! Vi vil kontakte deg så snart som mulig.');
            
            // Reset form
            contactForm.reset();
        });
    }

    const sections = document.querySelectorAll('section');
    let currentSection = 0;
    let isScrolling = false;

    // Set initial active section
    sections[0].classList.add('active');

    function updateSections(direction) {
        if (isScrolling) return;
        isScrolling = true;

        const nextSection = direction === 'down' 
            ? Math.min(currentSection + 1, sections.length - 1)
            : Math.max(currentSection - 1, 0);

        if (nextSection === currentSection) {
            isScrolling = false;
            return;
        }

        // Remove any existing classes
        sections.forEach(section => {
            section.classList.remove('active', 'prev', 'next');
        });

        if (direction === 'down') {
            // When scrolling down:
            // Next section slides up from bottom
            sections[nextSection].classList.add('active');
        } else {
            // When scrolling up:
            // Current section moves down, previous section becomes active
            sections[currentSection].classList.add('next');
            sections[nextSection].classList.add('active');
        }

        // After transition completes
        setTimeout(() => {
            currentSection = nextSection;
            isScrolling = false;
        }, 800);
    }

    // Handle mouse wheel events
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 'down' : 'up';
        updateSections(direction);
    }, { passive: false });

    // Handle touch events
    let touchStartY = 0;
    
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const direction = touchStartY > touchEndY ? 'down' : 'up';
        
        if (Math.abs(touchStartY - touchEndY) > 50) {
            updateSections(direction);
        }
    }, { passive: true });

    // Handle keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            updateSections('down');
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            updateSections('up');
        }
    });

    // Handle navigation links
    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetIndex = Array.from(sections).findIndex(
                section => section.classList.contains(targetId)
            );
            
            if (targetIndex !== -1) {
                const direction = targetIndex > currentSection ? 'down' : 'up';
                updateSections(direction);
            }
        });
    });

    // Modal handling
    const modals = {
        login: document.getElementById('loginModal'),
        register: document.getElementById('registerModal'),
        booking: document.getElementById('bookingModal')
    };

    const modalTriggers = {
        login: document.getElementById('loginButton'),
        register: document.getElementById('registerButton'),
        booking: document.getElementById('bookingButton')
    };

    // Add click event listeners to all modal triggers
    Object.keys(modalTriggers).forEach(key => {
        if (modalTriggers[key]) {
            modalTriggers[key].addEventListener('click', () => openModal(key));
        }
    });

    // Add click event listeners to all close buttons
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        Object.values(modals).forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    function openModal(modalType) {
        const modal = modals[modalType];
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Handle form submissions
    document.querySelectorAll('.modal-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically handle the form data
            // For now, we'll just close the modal
            const modal = form.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
});
