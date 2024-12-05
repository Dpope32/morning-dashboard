class RightSidebar {
    constructor() {
        this.sidebar = document.getElementById('rightSidebar');
        this.isOpen = true;
        this.setupCloseButton();
        this.setupToggleButton();
        this.setupEventListeners();
        this.removeHeader();
    }

    removeHeader() {
        const header = this.sidebar.querySelector('h3');
        if (header) {
            header.remove();
        }
    }

    setupCloseButton() {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '☰';
        closeBtn.className = 'right-sidebar-close';
        this.sidebar.insertBefore(closeBtn, this.sidebar.firstChild);
        
        closeBtn.addEventListener('click', () => {
            this.closeSidebar();
        });
    }

    setupToggleButton() {
        const existingToggle = document.querySelector('.right-sidebar-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '☰';
        toggleBtn.className = 'right-sidebar-toggle';
        document.body.appendChild(toggleBtn);
        
        toggleBtn.style.display = 'none';
        
        toggleBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });

        this.toggleBtn = toggleBtn;
    }

    closeSidebar() {
        this.sidebar.style.transform = 'translateX(100%)';
        this.toggleBtn.style.display = 'flex';
        this.isOpen = false;
    }

    openSidebar() {
        this.sidebar.style.transform = 'translateX(0)';
        this.toggleBtn.style.display = 'none';
        this.isOpen = true;
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    setupEventListeners() {
        const mediaQuery = window.matchMedia('(max-width: 1200px)');
        const handleMediaChange = (e) => {
            if (e.matches) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        };
        mediaQuery.addListener(handleMediaChange);
        handleMediaChange(mediaQuery);
    }
}

// Initialize right sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RightSidebar();
});
