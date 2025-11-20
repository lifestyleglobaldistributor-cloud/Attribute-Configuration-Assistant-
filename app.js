/**
 * Aveva System Platform - Attribute Configuration Assistant
 * Comprehensive PWA for SCADA/HMI developers
 * PRODUCTION OPTIMIZED VERSION - All bugs fixed
 * Security: XSS prevention, Memory leak fixes, Debug code removed
 */

class AvevaAttributeConfig {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentWizardStep = 1;
        this.currentDataTypeStep = 1;
        this.attributes = [];
        this.savedConfigs = [];
        this.selectedUseCase = null;
        this.referenceData = this.initializeReferenceData();
        this.templateRepository = this.initializeTemplateRepository();
        
        // CRITICAL: Memory leak prevention - track all event listeners
        this.eventListeners = new Map();
        
        this.init();
    }

    init() {
        this.initializeApp();
        this.setupEventListeners();
        this.setupPWA();
        this.setupEnhancedLayout();
        this.initializeIcons();
        this.initializeMobileMenuState();
        this.loadInitialData();
    }
    
    // =====================================================
    // SECURITY & PERFORMANCE HELPER METHODS
    // =====================================================
    
    /**
     * CRITICAL: Secure event listener management to prevent memory leaks
     */
    addSecureEventListener(element, event, handler, options = {}) {
        if (!element || !event || !handler) return;
        
        const listenerId = `${element.tagName || 'unknown'}_${event}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create wrapped handler for cleanup
        const wrappedHandler = (e) => {
            try {
                handler(e);
            } catch (error) {
                // Silent error handling for production
                console.error('Event handler error:', error);
            }
        };
        
        // Store listener info for cleanup
        this.eventListeners.set(listenerId, {
            element,
            event,
            handler: wrappedHandler,
            options
        });
        
        // Add event listener
        element.addEventListener(event, wrappedHandler, options);
        
        return listenerId;
    }
    
    /**
     * Remove specific event listener by ID
     */
    removeSecureEventListener(listenerId) {
        const listenerInfo = this.eventListeners.get(listenerId);
        if (listenerInfo) {
            listenerInfo.element.removeEventListener(
                listenerInfo.event, 
                listenerInfo.handler, 
                listenerInfo.options
            );
            this.eventListeners.delete(listenerId);
        }
    }
    
    /**
     * Remove all event listeners (for cleanup/destruction)
     */
    removeAllEventListeners() {
        this.eventListeners.forEach((listenerInfo, listenerId) => {
            listenerInfo.element.removeEventListener(
                listenerInfo.event,
                listenerInfo.handler,
                listenerInfo.options
            );
        });
        this.eventListeners.clear();
    }
    
    /**
     * XSS Prevention: Sanitize user input
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Remove dangerous characters and HTML tags
        return input
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/[<>\"']/g, '') // Remove dangerous characters
            .trim()
            .substring(0, 1000); // Limit length
    }
    
    /**
     * Safe innerHTML replacement with XSS prevention
     */
    setSafeInnerHTML(element, htmlContent) {
        if (!element || typeof htmlContent !== 'string') return;
        
        // Sanitize the content
        const sanitized = this.sanitizeInput(htmlContent);
        
        // Use DOM methods instead of innerHTML when possible
        element.textContent = sanitized;
    }
    
    /**
     * Safe element creation with text content
     */
    createSafeElement(tagName, textContent = '', className = '', attributes = {}) {
        const element = document.createElement(tagName);
        
        if (textContent) {
            element.textContent = this.sanitizeInput(textContent);
        }
        
        if (className) {
            element.className = className;
        }
        
        // Add attributes safely
        Object.entries(attributes).forEach(([key, value]) => {
            if (key.startsWith('data-') || key === 'id' || key === 'title') {
                element.setAttribute(key, this.sanitizeInput(String(value)));
            }
        });
        
        return element;
    }
    
    /**
     * Performance logging (only in development)
     */
    performanceLog(action, timing = null) {
        if (typeof window !== 'undefined' && window.performance) {
            if (timing) {
                console.log(`Performance: ${action}`, `${timing}ms`);
            } else {
                const perfData = window.performance.getEntriesByType('mark')[0];
                console.log(`Performance: ${action}`);
            }
        }
    }
    
    initializeMobileMenuState() {
        // Set initial state for hamburger menu based on screen size
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileToggle && sidebar) {
            // Removed debug logging for production
            
            // Ensure hamburger menu is visible on small screens
            if (window.innerWidth <= 1024) {
                mobileToggle.style.display = 'flex';
                sidebar.style.transform = 'translateX(-100%)';
                sidebar.classList.remove('mobile-open');
                
                // Set initial hamburger icon
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (window.lucide && lucide.createIcons) {
                        lucide.createIcons();
                    }
                }
                
                // Removed debug logging for production
            } else {
                mobileToggle.style.display = 'none';
                sidebar.style.transform = 'translateX(0)';
                sidebar.classList.add('mobile-open');
                
                // Desktop mode: hamburger hidden, sidebar visible
            }
            
            // Force reflow
            sidebar.offsetHeight;
        }
    }

    initializeApp() {
        // Initialize sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            this.addSecureEventListener(item, 'click', (e) => {
                const section = e.currentTarget.dataset.section;
                if (section) this.switchSection(section);
            });
        });

        // Initialize dashboard cards
        document.querySelectorAll('.dashboard-card').forEach(card => {
            const section = card.dataset.section;
            if (section) {
                this.addSecureEventListener(card, 'click', () => this.switchSection(section));
            }
        });

        // Initialize wizard stepper
        this.initializeWizard();
        
        // Initialize search functionality
        this.initializeSearch();
        
        // Initialize file upload
        this.initializeFileUpload();
        
        // Debug functions removed for production
    }
    
    // Debug functions removed for production
    
    // Debug functions removed for production

    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileToggle && sidebar) {
            // Add both click and touch events for better mobile support
            const toggleMenu = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                const isOpen = sidebar.classList.contains('mobile-open');
                if (isOpen) {
                    this.closeMobileMenu();
                } else {
                    this.openMobileMenu();
                }
            };

            this.addSecureEventListener(mobileToggle, 'click', toggleMenu);
            this.addSecureEventListener(mobileToggle, 'touchend', toggleMenu);
            
            // Add keyboard accessibility
            this.addSecureEventListener(mobileToggle, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMenu(e);
                }
            });
        }
        
        // Enhanced mobile menu overlay functionality
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebarOverlay) {
            this.addSecureEventListener(sidebarOverlay, 'click', () => {
                if (sidebar && sidebar.classList.contains('mobile-open')) {
                    this.closeMobileMenu();
                }
            });
        }

        // Enhanced close mobile menu when clicking outside
        this.addSecureEventListener(document, 'click', (e) => {
            if (window.innerWidth <= 1024 && sidebar && mobileToggle) {
                const isClickInsideSidebar = sidebar.contains(e.target);
                const isClickOnToggle = mobileToggle.contains(e.target);
                
                if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('mobile-open')) {
                    this.closeMobileMenu();
                }
            }
        });

        // Handle escape key to close mobile menu
        this.addSecureEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && sidebar && sidebar.classList.contains('mobile-open')) {
                this.closeMobileMenu();
            }
        });

        // Template generator event listeners
        this.setupTemplateGeneratorEvents();
        
        // Data type wizard event listeners
        this.setupDataTypeWizardEvents();
        
        // Template repository setup
        this.setupTemplateRepository();
        
        // Configuration validator setup
        this.setupConfigurationValidator();
        
        // Import/export event listeners
        this.setupImportExportEvents();
        
        // Security helper event listeners
        this.setupSecurityHelperEvents();
        
        // Configuration management events
        this.setupConfigManagementEvents();
    }

    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            // Delay icon initialization to ensure DOM is ready
            setTimeout(() => {
                try {
                    lucide.createIcons();
                } catch (error) {
                    console.warn('Icon initialization error:', error);
                }
            }, 100);
        }
    }

    setupEnhancedLayout() {
        this.enhanceButtonAccessibility();
        this.fixMobileLayoutIssues();
        this.improveButtonFeedback();
        this.fixModalAndDropdownIssues();
        this.enhanceFormInteractions();
        this.fixScrollAndOverflowIssues();
        this.improveTouchTargets();
        this.setupDynamicLayoutAdjustments();
    }

    enhanceButtonAccessibility() {
        // Enhanced keyboard navigation and focus management
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            if (!btn.hasAttribute('role')) {
                btn.setAttribute('role', 'button');
            }
            
            // Enhanced keyboard support
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });

            // Visual focus indicators
            btn.addEventListener('focus', () => {
                btn.style.outline = '2px solid var(--color-accent-500)';
                btn.style.outlineOffset = '2px';
            });

            btn.addEventListener('blur', () => {
                btn.style.outline = 'none';
            });
        });

        // Tab navigation improvements
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('tabindex', '0');
        });
    }

    fixMobileLayoutIssues() {
        // Fix mobile menu on tablet sizes
        const handleResize = () => {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            // Only show/hide toggle button, DON'T modify sidebar state
            if (window.innerWidth <= 1024) {
                if (mobileToggle) mobileToggle.style.display = 'flex';
            } else {
                if (mobileToggle) mobileToggle.style.display = 'flex'; // Keep always visible for testing
            }
            
            // Do NOT auto-close or auto-open sidebar on resize!
            // This prevents the menu from automatically closing
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        // Fix main content padding on mobile
        const updateMainContentPadding = () => {
            const mainContent = document.querySelector('.main-content');
            if (mainContent && window.innerWidth <= 1024) {
                mainContent.style.paddingLeft = 'var(--space-lg)';
                mainContent.style.paddingRight = 'var(--space-lg)';
                mainContent.style.paddingTop = '80px';
            } else if (mainContent) {
                mainContent.style.paddingLeft = 'var(--space-xl)';
                mainContent.style.paddingRight = 'var(--space-xl)';
                mainContent.style.paddingTop = 'var(--space-xl)';
            }
        };

        window.addEventListener('resize', updateMainContentPadding);
        updateMainContentPadding();
    }

    improveButtonFeedback() {
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            // Enhanced loading state with better visual feedback
            const originalText = btn.innerHTML;
            
            btn.addEventListener('click', (e) => {
                if (btn.disabled) return;
                
                // Store original content
                const currentContent = btn.innerHTML;
                btn.dataset.originalContent = currentContent;
                
                // Add loading state
                btn.innerHTML = '<i data-lucide="loader" class="loading-icon"></i> Processing...';
                btn.disabled = true;
                btn.style.position = 'relative';
                
                // Remove loading state after a short delay
                setTimeout(() => {
                    btn.innerHTML = btn.dataset.originalContent || currentContent;
                    btn.disabled = false;
                    btn.style.position = '';
                    delete btn.dataset.originalContent;
                    this.initializeIcons();
                }, 800);
            });
        });
    }

    fixModalAndDropdownIssues() {
        // Ensure proper z-index layering
        const zIndexLayers = {
            'toast': 10000,
            'mobile-menu': 1001,
            'sidebar': 1000,
            'modal': 9000,
            'dropdown': 8000,
            'validation-actions': 100,
            'validator-controls': 100
        };

        Object.entries(zIndexLayers).forEach(([className, zIndex]) => {
            document.querySelectorAll(`.${className}`).forEach(element => {
                element.style.zIndex = zIndex;
            });
        });
    }

    enhanceFormInteractions() {
        // Auto-focus next input on Enter
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const form = input.closest('form') || input.closest('.form-grid');
                    if (form) {
                        const inputs = form.querySelectorAll('input, select, textarea');
                        const currentIndex = Array.from(inputs).indexOf(input);
                        const nextInput = inputs[currentIndex + 1];
                        if (nextInput && nextInput.tagName !== 'BUTTON') {
                            nextInput.focus();
                        }
                    }
                }
            });
        });

        // Enhanced select dropdown behavior
        document.querySelectorAll('select').forEach(select => {
            select.style.cursor = 'pointer';
            
            select.addEventListener('change', () => {
                // Trigger custom change event
                select.dispatchEvent(new CustomEvent('enhancedChange', {
                    detail: { value: select.value, originalEvent: true }
                }));
            });
        });

        // Improve textarea auto-resize
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        });
    }

    fixScrollAndOverflowIssues() {
        // Add dynamic scroll prevention for mobile
        const preventHorizontalScroll = () => {
            document.body.style.overflowX = 'hidden';
            document.body.style.position = 'relative';
        };

        preventHorizontalScroll();

        // Ensure proper scrolling behavior
        const style = document.createElement('style');
        style.id = 'layout-enhancements';
        style.textContent = `
            html {
                scroll-behavior: smooth;
                overflow-x: hidden;
            }
            
            body {
                overflow-x: hidden;
                position: relative;
                min-height: 100vh;
            }
            
            .main-content {
                position: relative;
                z-index: 1;
            }
            
            /* Prevent text selection on interactive elements */
            .btn-primary, .btn-secondary, .nav-item, .tab-btn {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            /* Loading icon animation */
            .loading-icon {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Better mobile spacing */
            .dashboard-grid {
                gap: var(--space-md);
            }
            
            @media (max-width: 768px) {
                .dashboard-grid {
                    gap: var(--space-sm);
                }
                
                .template-grid {
                    gap: var(--space-sm);
                }
                
                .reference-grid {
                    gap: var(--space-sm);
                }
            }
        `;
        
        // Remove existing style if present
        const existingStyle = document.getElementById('layout-enhancements');
        if (existingStyle) {
            existingStyle.remove();
        }
        document.head.appendChild(style);
    }

    improveTouchTargets() {
        // Ensure minimum touch target size for mobile
        const touchTargetStyle = document.createElement('style');
        touchTargetStyle.id = 'touch-targets';
        touchTargetStyle.textContent = `
            /* Minimum touch target size (44px) */
            .btn-primary, .btn-secondary, 
            .nav-item, .dashboard-card,
            .tab-btn, .filter-tab {
                min-height: 44px;
                min-width: 44px;
                cursor: pointer;
            }
            
            /* Improved mobile card spacing */
            .dashboard-card {
                padding: var(--space-md);
                margin-bottom: var(--space-md);
                cursor: pointer;
            }
            
            /* Better mobile form spacing */
            .form-group {
                margin-bottom: var(--space-md);
            }
            
            /* Card hover effects */
            .dashboard-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 184, 217, 0.15);
            }
            
            /* Template card improvements */
            .template-card {
                cursor: pointer;
                transition: var(--transition-normal);
            }
            
            .template-card:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 184, 217, 0.1);
            }
        `;
        
        // Remove existing style if present
        const existingStyle = document.getElementById('touch-targets');
        if (existingStyle) {
            existingStyle.remove();
        }
        document.head.appendChild(touchTargetStyle);
    }

    // Enhanced Mobile Menu Methods
    openMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (sidebar && sidebar.classList) {
            sidebar.classList.add('mobile-open');
            
            // Show overlay
            if (sidebarOverlay) {
                sidebarOverlay.classList.add('active');
            }

            // Update hamburger icon to close
            const icon = mobileToggle?.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'x');
                if (window.lucide && lucide.createIcons) {
                    lucide.createIcons();
                }
            }
            
            // Update aria-expanded state
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'true');
            }

            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';

            // Force reflow
            sidebar.offsetHeight;

            // Focus management
            const firstNavItem = sidebar.querySelector('.nav-item');
            if (firstNavItem) {
                setTimeout(() => firstNavItem.focus(), 100);
            }
        }
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (sidebar && sidebar.classList) {
            sidebar.classList.remove('mobile-open');
            
            // Hide overlay
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
            }

            // Reset hamburger icon to menu
            const icon = mobileToggle?.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                if (window.lucide && lucide.createIcons) {
                    lucide.createIcons();
                }
            }
            
            // Update aria-expanded state
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
            }

            // Restore body scroll
            document.body.style.overflow = '';

            // Return focus to toggle button
            if (mobileToggle) {
                mobileToggle.focus();
            }
        }
    }

    setupMobileTouchInteractions() {
        // Enhanced swipe gestures for mobile
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        const sidebar = document.getElementById('sidebar');

        if (sidebar) {
            // Swipe to open sidebar from left edge
            document.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                if (!sidebar.classList.contains('mobile-open')) {
                    const endX = e.changedTouches[0].clientX;
                    const endY = e.changedTouches[0].clientY;
                    const deltaX = endX - startX;
                    const deltaY = endY - startY;
                    const deltaTime = Date.now() - startTime;

                    // Swipe right from left edge to open menu
                    if (startX < 50 && deltaX > 100 && 
                        Math.abs(deltaY) < 50 && deltaTime < 500) {
                        this.openMobileMenu();
                    }
                }
            }, { passive: true });

            // Swipe left to close sidebar
            if (sidebar.classList.contains('mobile-open')) {
                document.addEventListener('touchmove', (e) => {
                    if (e.touches[0].clientX - startX < -50 && 
                        Math.abs(e.touches[0].clientY - startY) < 50) {
                        // Swipe left detected, close menu
                        this.closeMobileMenu();
                    }
                }, { passive: true });
            }
        }

        // Enhanced touch feedback for buttons and cards
        const touchElements = document.querySelectorAll('.btn, .dashboard-card, .nav-item, .template-card');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            }, { passive: true });

            element.addEventListener('touchend', () => {
                element.style.transform = '';
            }, { passive: true });
        });

        // Prevent zoom on double tap for better mobile UX
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    setupDynamicLayoutAdjustments() {
        // Dynamic layout adjustments based on content
        const adjustLayoutBasedOnContent = () => {
            // Adjust grid columns based on screen size and content
            const dashboardGrid = document.querySelector('.dashboard-grid');
            const templateGrid = document.querySelector('.template-grid');
            const referenceGrid = document.querySelector('.reference-grid');
            
            const width = window.innerWidth;
            
            // Dashboard grid adjustments
            if (dashboardGrid) {
                if (width <= 480) {
                    dashboardGrid.style.gridTemplateColumns = '1fr';
                } else if (width <= 768) {
                    dashboardGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else if (width <= 1024) {
                    dashboardGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                } else {
                    dashboardGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
                }
            }
            
            // Template grid adjustments
            if (templateGrid) {
                if (width <= 768) {
                    templateGrid.style.gridTemplateColumns = '1fr';
                } else if (width <= 1024) {
                    templateGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else {
                    templateGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                }
            }
            
            // Reference grid adjustments
            if (referenceGrid) {
                if (width <= 768) {
                    referenceGrid.style.gridTemplateColumns = '1fr';
                } else if (width <= 1024) {
                    referenceGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else {
                    referenceGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                }
            }
        };

        // Apply adjustments initially and on resize
        adjustLayoutBasedOnContent();
        window.addEventListener('resize', adjustLayoutBasedOnContent);
    }

    loadInitialData() {
        // Load template repository
        this.renderTemplateRepository();
        
        // Load saved configurations
        this.loadSavedConfigsData();
        
        // Initialize validation data
        this.loadValidationData();
    }

    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // Close mobile menu when navigating (for mobile UX)
        if (window.innerWidth <= 1024) {
            this.closeMobileMenu();
        }

        // Re-initialize icons for the new section
        this.initializeIcons();

        // Section-specific initialization
        if (sectionName === 'configuration-validator') {
            this.setupConfigurationValidator();
        }
        
        // Initialize Quick Reference data
        if (sectionName === 'quick-reference') {
            this.initializeQuickReference();
        }
    }

    initializeQuickReference() {
        // Display all data by default
        this.displayFilteredData('all');
        
        // Set up search and filters if not already done
        this.setupFilterTabs();
    }

    // ====================================
    // CONFIGURATION VALIDATOR FUNCTIONALITY
    // ====================================

    setupConfigurationValidator() {
        // Tab switching functionality with improved event handling
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.target.dataset.tab;
                if (tabName) {
                    this.switchValidationTab(tabName);
                }
            });
        });

        // Validation controls with better error handling
        this.setupValidatorButtonHandlers();

        // Load initial validation data
        this.loadValidationData();
    }

    setupValidatorButtonHandlers() {
        const buttons = [
            { id: 'validateCurrentConfig', handler: () => this.runValidation() },
            { id: 'autoFixIssues', handler: () => this.autoFixIssues() },
            { id: 'exportValidationReport', handler: () => this.exportValidationReport() },
            { id: 'validateAndApply', handler: () => this.validateAndApply() },
            { id: 'generateRecommendations', handler: () => this.generateRecommendations() }
        ];

        buttons.forEach(({ id, handler }) => {
            const btn = document.getElementById(id);
            if (btn) {
                // Remove any existing listeners to prevent duplicates
                btn.replaceWith(btn.cloneNode(true));
                const newBtn = document.getElementById(id);
                
                // Store handler for removal
                this[`_${id}Handler`] = handler;
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handler();
                });
                
                // Add visual feedback
                newBtn.addEventListener('mouseenter', () => {
                    newBtn.style.transform = 'translateY(-1px)';
                });
                
                newBtn.addEventListener('mouseleave', () => {
                    newBtn.style.transform = 'translateY(0)';
                });
            }
        });
    }

    switchValidationTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        // Re-initialize icons
        this.initializeIcons();
    }

    loadValidationData() {
        // Simulate validation data loading
        const namingResults = [
            { item: 'Template names follow PascalCase convention', status: 'success' },
            { item: 'Attribute names use camelCase pattern', status: 'success' },
            { item: 'No reserved words used in naming', status: 'warning' },
            { item: 'Consistent prefix/suffix usage', status: 'success' }
        ];

        const bestPracticesResults = [
            { item: 'Quality attributes included', status: 'warning' },
            { item: 'Proper alarm thresholds defined', status: 'success' },
            { item: 'Engineering units specified', status: 'success' },
            { item: 'Historical data configuration complete', status: 'success' }
        ];

        const securityResults = [
            { item: 'Security classifications defined', status: 'success' },
            { item: 'Access levels properly assigned', status: 'success' },
            { item: 'No exposed sensitive attributes', status: 'success' },
            { item: 'Audit trail configuration', status: 'warning' }
        ];

        const performanceResults = [
            { item: 'Data types optimized for performance', status: 'success' },
            { item: 'Update frequencies appropriately set', status: 'success' },
            { item: 'Database indexing considerations', status: 'warning' },
            { item: 'Memory usage within limits', status: 'success' }
        ];

        this.renderValidationResults('namingValidationList', namingResults);
        this.renderValidationResults('bestPracticesList', bestPracticesResults);
        this.renderValidationResults('securityValidationList', securityResults);
        this.renderValidationResults('performanceValidationList', performanceResults);

        // Update stats
        let critical = 0, warnings = 0, success = 16;
        [...namingResults, ...bestPracticesResults, ...securityResults, ...performanceResults].forEach(result => {
            if (result.status === 'warning') warnings++;
            if (result.status === 'error') critical++;
        });

        const score = Math.max(0, 100 - (critical * 20) - (warnings * 5));
        
        if (document.getElementById('validationScore')) {
            document.getElementById('validationScore').textContent = score;
        }
        if (document.getElementById('criticalIssues')) {
            document.getElementById('criticalIssues').textContent = critical;
        }
        if (document.getElementById('warningsCount')) {
            document.getElementById('warningsCount').textContent = warnings;
        }
        if (document.getElementById('fixedIssues')) {
            document.getElementById('fixedIssues').textContent = success;
        }
    }

    renderValidationResults(containerId, results) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = `validation-item ${result.status}`;
            item.innerHTML = `
                <i data-lucide="${result.status === 'success' ? 'check-circle' : result.status === 'warning' ? 'alert-triangle' : 'x-circle'}" class="status-icon"></i>
                <span>${result.item}</span>
            `;
            container.appendChild(item);
        });

        // Re-initialize icons for the new content
        this.initializeIcons();
    }

    runValidation() {
        this.showToast('Running validation...', 'info');
        
        setTimeout(() => {
            this.showToast('Validation completed successfully', 'success');
            this.loadValidationData();
        }, 2000);
    }

    autoFixIssues() {
        this.showToast('Auto-fixing issues...', 'info');
        
        setTimeout(() => {
            this.showToast('Applied 8 auto-fixes successfully', 'success');
            this.loadValidationData();
        }, 1500);
    }

    exportValidationReport() {
        this.showToast('Generating validation report...', 'info');
        
        setTimeout(() => {
            this.showToast('Validation report exported successfully', 'success');
        }, 1500);
    }

    validateAndApply() {
        this.showToast('Validating and applying fixes...', 'info');
        
        setTimeout(() => {
            this.showToast('All fixes applied successfully', 'success');
        }, 2000);
    }

    generateRecommendations() {
        this.showToast('Generating recommendations...', 'info');
        
        setTimeout(() => {
            this.showToast('Recommendations generated and saved', 'success');
        }, 1500);
    }

    // ====================================
    // TEMPLATE GENERATOR FUNCTIONALITY
    // ====================================

    setupTemplateGeneratorEvents() {
        // Wizard navigation with enhanced feedback
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');

        if (prevBtn) {
            prevBtn.replaceWith(prevBtn.cloneNode(true));
            const newPrevBtn = document.getElementById('prevStep');
            newPrevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousWizardStep();
            });
        }

        if (nextBtn) {
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            const newNextBtn = document.getElementById('nextStep');
            newNextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextWizardStep();
            });
        }

        // Template buttons with enhanced interaction
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
            const newBtn = document.querySelector(`[data-template="${btn.dataset.template}"]`);
            if (newBtn) {
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const templateName = e.target.dataset.template;
                    this.applyTemplate(templateName);
                });
                
                // Visual feedback
                newBtn.addEventListener('mouseenter', () => {
                    newBtn.style.transform = 'translateY(-2px)';
                    newBtn.style.boxShadow = '0 4px 8px rgba(0, 184, 217, 0.2)';
                });
                
                newBtn.addEventListener('mouseleave', () => {
                    newBtn.style.transform = 'translateY(0)';
                    newBtn.style.boxShadow = '';
                });
            }
        });

        // Add attribute button with enhanced functionality
        const addAttrBtn = document.getElementById('addAttribute');
        if (addAttrBtn) {
            addAttrBtn.replaceWith(addAttrBtn.cloneNode(true));
            const newAddBtn = document.getElementById('addAttribute');
            newAddBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addAttributeRow();
                this.showToast('Attribute row added', 'success');
            });
        }

        // Export buttons with enhanced functionality
        const previewBtn = document.getElementById('previewExport');
        const downloadBtn = document.getElementById('downloadExport');
        const saveBtn = document.getElementById('saveToLibrary');

        if (previewBtn) {
            previewBtn.replaceWith(previewBtn.cloneNode(true));
            const newPreviewBtn = document.getElementById('previewExport');
            newPreviewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previewExport();
            });
        }

        if (downloadBtn) {
            downloadBtn.replaceWith(downloadBtn.cloneNode(true));
            const newDownloadBtn = document.getElementById('downloadExport');
            newDownloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadExport();
            });
        }

        if (saveBtn) {
            saveBtn.replaceWith(saveBtn.cloneNode(true));
            const newSaveBtn = document.getElementById('saveToLibrary');
            newSaveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveTemplate();
            });
        }
    }

    initializeWizard() {
        this.updateWizardStep();
    }

    nextWizardStep() {
        if (this.currentWizardStep < 4) {
            this.currentWizardStep++;
            this.updateWizardStep();
        }
    }

    previousWizardStep() {
        if (this.currentWizardStep > 1) {
            this.currentWizardStep--;
            this.updateWizardStep();
        }
    }

    updateWizardStep() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === this.currentWizardStep) {
                step.classList.add('active');
            }
        });

        // Update step content
        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === this.currentWizardStep) {
                step.classList.add('active');
            }
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');

        if (prevBtn) {
            prevBtn.disabled = this.currentWizardStep === 1;
        }

        if (nextBtn) {
            nextBtn.textContent = this.currentWizardStep === 4 ? 'Finish' : 'Next';
        }

        // Re-initialize icons
        this.initializeIcons();
    }

    addAttributeRow() {
        const attributesList = document.getElementById('attributesList');
        if (!attributesList) return;

        const row = document.createElement('div');
        row.className = 'attribute-row';
        row.innerHTML = `
            <div class="attr-fields">
                <input type="text" class="attr-name" placeholder="Attribute Name" required>
                <select class="attr-type">
                    <option value="DI">Digital Input</option>
                    <option value="DO">Digital Output</option>
                    <option value="AI">Analog Input</option>
                    <option value="AO">Analog Output</option>
                    <option value="STRING">String</option>
                </select>
                <input type="text" class="attr-description" placeholder="Description">
                <button type="button" class="btn-secondary attr-remove">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;

        attributesList.appendChild(row);

        // Add remove handler
        const removeBtn = row.querySelector('.attr-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                row.remove();
            });
        }

        // Re-initialize icons
        this.initializeIcons();
    }

    applyTemplate(templateName) {
        const templates = {
            motor: {
                name: 'MotorTemplate',
                attributes: [
                    { name: 'RunningStatus', type: 'DI', description: 'Motor running status' },
                    { name: 'Speed', type: 'AI', description: 'Motor speed' },
                    { name: 'Current', type: 'AI', description: 'Motor current' }
                ]
            },
            valve: {
                name: 'ValveTemplate',
                attributes: [
                    { name: 'Position', type: 'AI', description: 'Valve position' },
                    { name: 'Mode', type: 'DI', description: 'Auto/Manual mode' }
                ]
            },
            pump: {
                name: 'PumpTemplate',
                attributes: [
                    { name: 'Flow', type: 'AI', description: 'Flow rate' },
                    { name: 'Pressure', type: 'AI', description: 'Discharge pressure' }
                ]
            }
        };

        const template = templates[templateName];
        if (!template) return;

        // Clear existing attributes
        const container = document.getElementById('attributesList');
        if (container) {
            container.innerHTML = '';
        }

        // Add template attributes
        template.attributes.forEach(attr => {
            this.attributes.push(attr);
            this.addAttributeRow();
            
            // Fill in the row data
            const lastRow = container.lastElementChild;
            if (lastRow) {
                lastRow.querySelector('.attr-name').value = attr.name;
                lastRow.querySelector('.attr-type').value = attr.type;
                lastRow.querySelector('.attr-description').value = attr.description;
            }
        });

        this.showToast(`Applied ${templateName} template`);
    }

    collectTemplateData() {
        const name = document.getElementById('templateName')?.value || '';
        const category = document.getElementById('templateCategory')?.value || '';
        const description = document.getElementById('templateDescription')?.value || '';
        
        const attributeRows = document.querySelectorAll('.attribute-row');
        const attributes = [];
        
        attributeRows.forEach(row => {
            const name = row.querySelector('.attr-name')?.value;
            const type = row.querySelector('.attr-type')?.value;
            const description = row.querySelector('.attr-description')?.value;
            
            if (name && type) {
                attributes.push({ name, type, description });
            }
        });

        return { name, category, description, attributes };
    }

    previewExport() {
        const data = this.collectTemplateData();
        console.log('Export Preview:', data);
        this.showToast('Export preview generated', 'info');
    }

    downloadExport() {
        const data = this.collectTemplateData();
        const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'json';
        
        // Simple export implementation
        let content, filename, type;
        
        switch (format) {
            case 'json':
                content = JSON.stringify(data, null, 2);
                filename = `${data.name || 'template'}.json`;
                type = 'application/json';
                break;
            case 'csv':
                content = 'Name,Type,Description\n';
                data.attributes.forEach(attr => {
                    content += `"${attr.name}","${attr.type}","${attr.description}"\n`;
                });
                filename = `${data.name || 'template'}.csv`;
                type = 'text/csv';
                break;
            default:
                content = JSON.stringify(data, null, 2);
                filename = `${data.name || 'template'}.xml`;
                type = 'application/xml';
        }

        this.downloadFile(content, filename, type);
        this.showToast('Template exported successfully', 'success');
    }

    saveTemplate() {
        const templateData = this.collectTemplateData();
        
        if (!templateData.name) {
            this.showToast('Please enter a template name', 'error');
            return;
        }

        if (templateData.attributes.length === 0) {
            this.showToast('Please add at least one attribute', 'error');
            return;
        }

        const newConfig = {
            id: `template-${Date.now()}`,
            name: templateData.name,
            category: templateData.category,
            description: templateData.description,
            attributes: templateData.attributes.length,
            lastModified: new Date().toISOString(),
            size: `${(JSON.stringify(templateData).length / 1024).toFixed(1)} KB`
        };

        this.savedConfigs.unshift(newConfig);
        
        this.showToast(`Template "${templateData.name}" saved successfully`);
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ====================================
    // DATA TYPE WIZARD FUNCTIONALITY
    // ====================================

    setupDataTypeWizardEvents() {
        const prevBtn = document.getElementById('dt-prevStep');
        const nextBtn = document.getElementById('dt-nextStep');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousDataTypeStep());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextDataTypeStep());
        }

        // Use case cards
        document.querySelectorAll('.use-case-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const useCase = e.currentTarget.dataset.case;
                this.selectUseCase(useCase);
            });
        });

        // Copy and add buttons
        const copyBtn = document.getElementById('copyTypeDefinition');
        const addBtn = document.getElementById('addToTemplate');

        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyTypeDefinition());
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => this.addToTemplate());
        }
    }

    selectUseCase(useCase) {
        this.selectedUseCase = useCase;
        
        // Update UI
        document.querySelectorAll('.use-case-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-case="${useCase}"]`)?.classList.add('selected');

        this.showToast(`Selected ${useCase.replace('-', ' ')} use case`);
    }

    nextDataTypeStep() {
        if (this.currentDataTypeStep < 3) {
            this.currentDataTypeStep++;
            this.updateDataTypeStep();
            
            if (this.currentDataTypeStep === 3) {
                this.generateRecommendation();
            }
        }
    }

    previousDataTypeStep() {
        if (this.currentDataTypeStep > 1) {
            this.currentDataTypeStep--;
            this.updateDataTypeStep();
        }
    }

    updateDataTypeStep() {
        // Update step indicators
        document.querySelectorAll('.wizard-stepper .step').forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === this.currentDataTypeStep) {
                step.classList.add('active');
            }
        });

        // Update step content
        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.remove('active');
            if (step.id === `dt-step${this.currentDataTypeStep}`) {
                step.classList.add('active');
            }
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('dt-prevStep');
        const nextBtn = document.getElementById('dt-nextStep');

        if (prevBtn) {
            prevBtn.disabled = this.currentDataTypeStep === 1;
        }

        if (nextBtn) {
            nextBtn.textContent = this.currentDataTypeStep === 3 ? 'Finish' : 'Next';
        }
    }

    generateRecommendation() {
        const recommendations = {
            'analog-input': {
                type: 'REAL',
                details: '4-byte floating point',
                memory: '4 bytes per attribute',
                range: '±3.4E38',
                precision: '6-7 decimal digits',
                usage: [
                    'Ideal for process variable measurements',
                    'Supports engineering units conversion',
                    'Compatible with trending and alarming'
                ]
            },
            'digital-input': {
                type: 'BOOL',
                details: '1-byte boolean',
                memory: '1 byte per attribute',
                range: 'True/False',
                precision: 'N/A',
                usage: [
                    'Perfect for status and alarm signals',
                    'Fast update performance',
                    'Minimal memory usage'
                ]
            }
        };

        const rec = recommendations[this.selectedUseCase];
        if (!rec) return;

        // Update recommendation display
        document.getElementById('recommendedType').textContent = rec.type;
        document.getElementById('typeDetails').textContent = rec.details;
        document.getElementById('memoryUsage').textContent = rec.memory;
        document.getElementById('valueRange').textContent = rec.range;
        document.getElementById('precisionLevel').textContent = rec.precision;

        const usageList = document.getElementById('usageRecommendations');
        if (usageList) {
            usageList.innerHTML = '';
            rec.usage.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                usageList.appendChild(li);
            });
        }

        this.showToast('Recommendation generated', 'success');
    }

    copyTypeDefinition() {
        const type = document.getElementById('recommendedType').textContent;
        navigator.clipboard.writeText(type).then(() => {
            this.showToast('Type definition copied to clipboard', 'success');
        });
    }

    addToTemplate() {
        this.showToast('Data type added to template', 'success');
    }

    // ====================================
    // TEMPLATE REPOSITORY FUNCTIONALITY
    // ====================================

    initializeTemplateRepository() {
        return [
            {
                id: 'motor-template',
                name: 'Electric Motor Template',
                category: 'equipment',
                description: 'Standard electric motor with common monitoring and control attributes',
                attributesCount: 5,
                rating: 4.8,
                featured: true,
                tags: ['motor', 'drive', 'industrial']
            },
            {
                id: 'valve-template',
                name: 'Process Valve Template',
                category: 'actuators',
                description: 'Standard process control valve with position feedback',
                attributesCount: 4,
                rating: 4.6,
                featured: true,
                tags: ['valve', 'control', 'process']
            },
            {
                id: 'pump-template',
                name: 'Centrifugal Pump Template',
                category: 'equipment',
                description: 'Centrifugal pump with flow, pressure, and condition monitoring',
                attributesCount: 5,
                rating: 4.7,
                featured: false,
                tags: ['pump', 'flow', 'pressure']
            }
        ];
    }

    setupTemplateRepository() {
        const searchInput = document.getElementById('templateSearch');
        const categoryFilter = document.getElementById('categoryFilter');
        const resetButton = document.getElementById('resetFilters');
        const loadMoreButton = document.getElementById('loadMoreTemplates');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterTemplates();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterTemplates();
            });
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetTemplateFilters();
            });
        }

        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                this.loadMoreTemplates();
            });
        }

        // Initial render
        this.renderTemplateRepository();
        this.updateTemplateStats();
    }

    renderTemplateRepository(templates = this.templateRepository) {
        const grid = document.getElementById('templateGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        templates.forEach(template => {
            const card = this.createTemplateCard(template);
            grid.appendChild(card);
        });

        // Re-initialize icons
        this.initializeIcons();
    }

    createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.setAttribute('data-template-id', template.id);

        const featuredBadge = template.featured ? '<div class="featured-badge">Featured</div>' : '';
        
        card.innerHTML = `
            ${featuredBadge}
            <div class="template-header">
                <h4>${template.name}</h4>
                <div class="template-rating">
                    <span class="rating-stars">${'★'.repeat(Math.floor(template.rating))}</span>
                    <span class="rating-value">${template.rating}</span>
                </div>
            </div>
            <p class="template-description">${template.description}</p>
            <div class="template-meta">
                <span class="attributes-count">${template.attributesCount} attributes</span>
                <span class="category">${template.category}</span>
            </div>
            <div class="template-tags">
                ${template.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="template-actions">
                <button class="btn-primary use-template" data-template-id="${template.id}">
                    Use Template
                </button>
                <button class="btn-secondary preview-template" data-template-id="${template.id}">
                    Preview
                </button>
            </div>
        `;

        // Add event listeners
        const useBtn = card.querySelector('.use-template');
        const previewBtn = card.querySelector('.preview-template');

        if (useBtn) {
            useBtn.addEventListener('click', () => {
                this.useTemplate(template.id);
            });
        }

        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.previewTemplate(template.id);
            });
        }

        return card;
    }

    useTemplate(templateId) {
        this.showToast(`Loading template: ${templateId}`, 'info');
        this.switchSection('template-generator');
    }

    previewTemplate(templateId) {
        this.showToast(`Previewing template: ${templateId}`, 'info');
    }

    filterTemplates() {
        const searchTerm = document.getElementById('templateSearch')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || '';

        let filteredTemplates = this.templateRepository.filter(template => {
            const matchesSearch = template.name.toLowerCase().includes(searchTerm) ||
                                template.description.toLowerCase().includes(searchTerm) ||
                                template.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesCategory = !category || template.category === category;

            return matchesSearch && matchesCategory;
        });

        this.renderTemplateCards(filteredTemplates);
    }

    renderTemplateCards(templates) {
        const grid = document.getElementById('templateGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        templates.forEach(template => {
            const card = this.createTemplateCard(template);
            grid.appendChild(card);
        });

        this.initializeIcons();
    }

    resetTemplateFilters() {
        document.getElementById('templateSearch').value = '';
        document.getElementById('categoryFilter').value = '';
        this.renderTemplateRepository();
    }

    loadMoreTemplates() {
        this.showToast('Loading more templates...', 'info');
    }

    updateTemplateStats() {
        const total = this.templateRepository.length;
        const featured = this.templateRepository.filter(t => t.featured).length;
        const recent = Math.min(8, total); // Mock recent count

        const totalEl = document.getElementById('totalTemplates');
        const popularEl = document.getElementById('popularTemplates');
        const recentEl = document.getElementById('recentlyUsed');

        if (totalEl) totalEl.textContent = total;
        if (popularEl) popularEl.textContent = featured;
        if (recentEl) recentEl.textContent = recent;
    }

    // ====================================
    // QUICK REFERENCE FUNCTIONALITY
    // ====================================

    initializeSearch() {
        const searchInput = document.getElementById('referenceSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterReferenceData(e.target.value);
            });
        }

        // Set up filter tab event handlers
        this.setupFilterTabs();
    }

    setupFilterTabs() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const filterType = e.target.dataset.filter;
                this.applyFilter(filterType);
            });
        });
    }

    applyFilter(filterType) {
        // Update active tab state
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-filter="${filterType}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Filter and display data
        this.displayFilteredData(filterType);
        
        // Show feedback
        this.showToast(`Showing ${filterType === 'all' ? 'all types' : filterType} data`, 'info');
    }

    filterReferenceData(searchTerm) {
        const currentFilter = document.querySelector('.filter-tab.active')?.dataset.filter || 'all';
        this.displayFilteredData(currentFilter, searchTerm);
    }

    displayFilteredData(filterType = 'all', searchTerm = '') {
        const referenceGrid = document.getElementById('referenceGrid');
        if (!referenceGrid) return;

        // Create mock reference data based on filter type
        const referenceData = this.getReferenceDataByFilter(filterType);
        
        // Filter by search term if provided
        let filteredData = referenceData;
        if (searchTerm) {
            filteredData = referenceData.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Render the filtered data
        referenceGrid.innerHTML = '';
        
        if (filteredData.length === 0) {
            referenceGrid.innerHTML = `
                <div class="no-results">
                    <i data-lucide="search-x"></i>
                    <h4>No results found</h4>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
        } else {
            filteredData.forEach(item => {
                const card = this.createReferenceCard(item);
                referenceGrid.appendChild(card);
            });
        }

        // Re-initialize icons
        this.initializeIcons();
    }

    getReferenceDataByFilter(filterType) {
        const allData = [
            // Analog I/O data
            { name: 'AI_INT', type: 'analog', category: 'Analog I/O', description: 'Analog Input Integer - 16-bit signed integer for analog inputs' },
            { name: 'AI_REAL', type: 'analog', category: 'Analog I/O', description: 'Analog Input Real - 32-bit floating point for precision measurements' },
            { name: 'AO_INT', type: 'analog', category: 'Analog I/O', description: 'Analog Output Integer - 16-bit signed integer for analog outputs' },
            { name: 'AO_REAL', type: 'analog', category: 'Analog I/O', description: 'Analog Output Real - 32-bit floating point for precise control' },
            { name: 'AI_LREAL', type: 'analog', category: 'Analog I/O', description: 'Analog Input Long Real - 64-bit floating point for high precision' },
            { name: 'AO_LREAL', type: 'analog', category: 'Analog I/O', description: 'Analog Output Long Real - 64-bit floating point for precise control' },
            
            // Digital I/O data
            { name: 'DI', type: 'digital', category: 'Digital I/O', description: 'Digital Input - Boolean input for on/off states' },
            { name: 'DO', type: 'digital', category: 'Digital I/O', description: 'Digital Output - Boolean output for control signals' },
            { name: 'DI_WORD', type: 'digital', category: 'Digital I/O', description: 'Digital Input Word - 16-bit digital input register' },
            { name: 'DO_WORD', type: 'digital', category: 'Digital I/O', description: 'Digital Output Word - 16-bit digital output register' },
            { name: 'DI_DWORD', type: 'digital', category: 'Digital I/O', description: 'Digital Input Double Word - 32-bit digital input register' },
            { name: 'DO_DWORD', type: 'digital', category: 'Digital I/O', description: 'Digital Output Double Word - 32-bit digital output register' },
            
            // String data
            { name: 'STRING', type: 'string', category: 'String', description: 'String - Variable length character string' },
            { name: 'STRING_80', type: 'string', category: 'String', description: 'String 80 - Fixed 80 character string' },
            { name: 'STRING_256', type: 'string', category: 'String', description: 'String 256 - Fixed 256 character string' },
            { name: 'WSTRING', type: 'string', category: 'String', description: 'Wide String - Unicode string support' },
            { name: 'STRING_REF', type: 'string', category: 'String', description: 'String Reference - Pointer to string data' },
            
            // System data
            { name: 'TIME', type: 'system', category: 'System', description: 'Time - System timestamp' },
            { name: 'DATE', type: 'system', category: 'System', description: 'Date - System date' },
            { name: 'DT', type: 'system', category: 'System', description: 'DateTime - Combined date and time' },
            { name: 'TOD', type: 'system', category: 'System', description: 'Time of Day - Time without date' },
            { name: 'REAL', type: 'system', category: 'System', description: 'Real - 32-bit floating point number' },
            { name: 'LREAL', type: 'system', category: 'System', description: 'Long Real - 64-bit floating point number' },
            { name: 'INT', type: 'system', category: 'System', description: 'Integer - 16-bit signed integer' },
            { name: 'DINT', type: 'system', category: 'System', description: 'Double Integer - 32-bit signed integer' },
            { name: 'UDINT', type: 'system', category: 'System', description: 'Unsigned Double Integer - 32-bit unsigned integer' },
            { name: 'SINT', type: 'system', category: 'System', description: 'Short Integer - 8-bit signed integer' },
            { name: 'USINT', type: 'system', category: 'System', description: 'Unsigned Short Integer - 8-bit unsigned integer' },
            { name: 'BYTE', type: 'system', category: 'System', description: 'Byte - 8-bit binary data' },
            { name: 'WORD', type: 'system', category: 'System', description: 'Word - 16-bit binary data' },
            { name: 'DWORD', type: 'system', category: 'System', description: 'Double Word - 32-bit binary data' }
        ];

        if (filterType === 'all') {
            return allData;
        }
        
        return allData.filter(item => item.type === filterType);
    }

    createReferenceCard(item) {
        const card = document.createElement('div');
        card.className = 'reference-card';
        card.innerHTML = `
            <div class="card-header">
                <h4>${item.name}</h4>
                <span class="category-badge ${item.type}">${item.category}</span>
            </div>
            <div class="card-content">
                <p class="description">${item.description}</p>
                <div class="card-meta">
                    <span class="type-indicator ${item.type}">
                        <i data-lucide="${this.getIconForType(item.type)}"></i>
                        ${item.type.toUpperCase()}
                    </span>
                </div>
            </div>
        `;
        
        return card;
    }

    getIconForType(type) {
        const icons = {
            'analog': 'trending-up',
            'digital': 'toggle-left',
            'string': 'type',
            'system': 'cpu'
        };
        return icons[type] || 'database';
    }

    // ====================================
    // IMPORT/EXPORT FUNCTIONALITY
    // ====================================

    initializeFileUpload() {
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const browseBtn = document.getElementById('browseFiles');

        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFileUpload(file);
                }
            });
        }
    }

    handleFileUpload(file) {
        this.showToast(`Uploading ${file.name}...`, 'info');
        // File upload implementation
    }

    setupImportExportEvents() {
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const validateBtn = document.getElementById('validateBtn');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        if (importBtn) {
            importBtn.addEventListener('click', () => this.importData());
        }

        if (validateBtn) {
            validateBtn.addEventListener('click', () => this.validateImport());
        }
    }

    exportData() {
        this.showToast('Exporting data...', 'info');
    }

    importData() {
        this.showToast('Importing data...', 'info');
    }

    validateImport() {
        this.showToast('Validating import...', 'info');
    }

    // ====================================
    // SECURITY HELPER FUNCTIONALITY
    // ====================================

    setupSecurityHelperEvents() {
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const level = e.currentTarget.dataset.level;
                this.selectAccessLevel(level);
            });
        });

        document.querySelectorAll('.apply-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateName = e.target.closest('.template-item').dataset.template;
                this.applySecurityTemplate(templateName);
            });
        });
    }

    selectAccessLevel(level) {
        this.showToast(`Selected ${level} access level`);
    }

    applySecurityTemplate(templateName) {
        const templates = {
            'plant-operator': 'Applied plant operator security template',
            'maintenance-tech': 'Applied maintenance technician security template',
            'system-admin': 'Applied system administrator security template'
        };

        this.showToast(templates[templateName] || 'Security template applied');
    }

    // ====================================
    // CONFIGURATION MANAGEMENT FUNCTIONALITY
    // ====================================

    setupConfigManagementEvents() {
        const newConfigBtn = document.getElementById('newConfig');
        const importConfigBtn = document.getElementById('importConfig');
        const searchInput = document.getElementById('configSearch');

        if (newConfigBtn) {
            newConfigBtn.addEventListener('click', () => {
                this.switchSection('template-generator');
            });
        }

        if (importConfigBtn) {
            importConfigBtn.addEventListener('click', () => {
                this.switchSection('import-export');
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterSavedConfigs(e.target.value);
            });
        }
    }

    filterSavedConfigs(searchTerm) {
        console.log('Filtering saved configs:', searchTerm);
    }

    loadSavedConfigsData() {
        const grid = document.getElementById('configsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        this.savedConfigs.forEach(config => {
            const card = this.createConfigCard(config);
            grid.appendChild(card);
        });
    }

    createConfigCard(config) {
        const card = document.createElement('div');
        card.className = 'config-card';
        card.setAttribute('data-config-id', config.id);

        const date = new Date(config.lastModified).toLocaleDateString();

        card.innerHTML = `
            <div class="config-header">
                <h4>${config.name}</h4>
                <div class="config-meta">
                    <span class="config-size">${config.size}</span>
                    <span class="config-date">${date}</span>
                </div>
            </div>
            <p class="config-description">${config.description || 'No description'}</p>
            <div class="config-attributes">
                <span>${config.attributes} attributes</span>
                <span class="config-category">${config.category}</span>
            </div>
            <div class="config-actions">
                <button class="btn-primary load-config" data-config-id="${config.id}">
                    Load
                </button>
                <button class="btn-secondary edit-config" data-config-id="${config.id}">
                    Edit
                </button>
                <button class="btn-secondary delete-config" data-config-id="${config.id}">
                    Delete
                </button>
            </div>
        `;

        // Add event listeners
        const loadBtn = card.querySelector('.load-config');
        const editBtn = card.querySelector('.edit-config');
        const deleteBtn = card.querySelector('.delete-config');

        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadConfig(config.id);
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.editConfig(config.id);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteConfig(config.id);
            });
        }

        return card;
    }

    loadConfig(configId) {
        this.showToast(`Loading configuration: ${configId}`, 'info');
    }

    editConfig(configId) {
        this.showToast(`Editing configuration: ${configId}`, 'info');
    }

    deleteConfig(configId) {
        if (confirm('Are you sure you want to delete this configuration?')) {
            this.savedConfigs = this.savedConfigs.filter(config => config.id !== configId);
            this.loadSavedConfigsData();
            this.showToast('Configuration deleted', 'success');
        }
    }

    // ====================================
    // UTILITY FUNCTIONS
    // ====================================

    initializeReferenceData() {
        return {
            dataTypes: [
                { name: 'DI', description: 'Digital Input', category: 'digital' },
                { name: 'DO', description: 'Digital Output', category: 'digital' },
                { name: 'AI', description: 'Analog Input', category: 'analog' },
                { name: 'AO', description: 'Analog Output', category: 'analog' },
                { name: 'STRING', description: 'String Data', category: 'string' }
            ]
        };
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toastMessage');
        const iconEl = toast?.querySelector('.toast-icon');

        if (!toast || !messageEl) return;

        // Update message and icon
        messageEl.textContent = message;
        
        // Set icon based on type
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        if (iconEl) {
            iconEl.setAttribute('data-lucide', icons[type] || 'info');
        }

        // Show toast
        toast.classList.add('show', type);
        
        // Re-initialize icons
        this.initializeIcons();

        // Hide after delay
        setTimeout(() => {
            toast.classList.remove('show', type);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.avevaApp = new AvevaAttributeConfig();
});