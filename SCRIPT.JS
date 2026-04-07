/**
 * Disaster Response Optimization System (D.R.O.S.)
 * Frontend Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // DOM ELEMENTS
    // ==========================================

    // Login & Layout
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const operatorIdInput = document.getElementById('operatorId');
    const passwordInput = document.getElementById('password');

    // Navigation & Header
    const navButtons = document.querySelectorAll('.nav-btn');
    const appSections = document.querySelectorAll('.app-section');
    const currentPageTitle = document.getElementById('currentPageTitle');
    const currentDateTime = document.getElementById('currentDateTime');
    const themeToggle = document.getElementById('themeToggle');

    // Dashboard KPIs
    const kpiCounters = {
        activeIncidentsCount: { el: document.getElementById('activeIncidentsCount'), target: 24 },
        teamsDeployedCount: { el: document.getElementById('teamsDeployedCount'), target: 18 },
        resourcesAvailableCount: { el: document.getElementById('resourcesAvailableCount'), target: 1402 },
        criticalZonesCount: { el: document.getElementById('criticalZonesCount'), target: 3 }
    };

    // Modals & Panels
    const dispatchBtn = document.getElementById('dispatchBtn');
    const dispatchModal = document.getElementById('dispatchModal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const cancelModalBtn = document.querySelector('.cancel-btn');
    const confirmModalBtn = document.querySelector('.confirm-btn');

    // Map & Details
    const zoneCards = document.querySelectorAll('.zone-card');
    const zoneDetailPanel = document.getElementById('zoneDetailPanel');

    // Tables & Actions
    const assignButtons = document.querySelectorAll('.assign-btn');
    const statusToggleBtns = document.querySelectorAll('.status-toggle-btn');

    // Alerts
    const filterBtns = document.querySelectorAll('.filter-btn');
    const alertList = document.getElementById('alertList');

    // Form
    const resourceRequestForm = document.getElementById('resourceRequestForm');
    const formResponse = document.getElementById('formResponse');

    // State Variables
    let clockInterval;
    let alertGeneratorInterval;


    // ==========================================
    // 1 & 2. AUTHENTICATION (SIMULATED)
    // ==========================================

    loginBtn.addEventListener('click', handleLogin);
    
    // Allow Enter key to submit login
    loginForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    function handleLogin() {
        const id = operatorIdInput.value.trim();
        const pwd = passwordInput.value.trim();

        if (!id || !pwd) {
            showToast('Please enter both Operator ID and Password.', 'error');
            return;
        }

        // Simulate Authentication Success
        loginScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
        
        // Initialize App Systems
        startClock();
        animateKPIs();
        startAlertGenerator();
        showToast('Login successful. Session initialized.', 'success');
    }

    logoutBtn.addEventListener('click', () => {
        // Reset to Login
        appContainer.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        
        // Reset App State
        operatorIdInput.value = '';
        passwordInput.value = '';
        stopClock();
        stopAlertGenerator();
        resetNavigation();
        showToast('Session ended securely.', 'info');
    });


    // ==========================================
    // 3. NAVIGATION SYSTEM
    // ==========================================

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSectionId = btn.getAttribute('data-section');
            const targetTitle = btn.textContent.trim();

            // Update Active Navigation State
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Hide All Sections, Show Target
            appSections.forEach(section => {
                section.classList.remove('active-section');
            });
            document.getElementById(targetSectionId).classList.add('active-section');

            // Update Header Title
            currentPageTitle.textContent = targetTitle;
        });
    });

    function resetNavigation() {
        // Default to Dashboard on logout/login
        navButtons.forEach(b => b.classList.remove('active'));
        appSections.forEach(s => s.classList.remove('active-section'));
        
        const dashboardBtn = document.querySelector('[data-section="dashboardSection"]');
        dashboardBtn.classList.add('active');
        document.getElementById('dashboardSection').classList.add('active-section');
        currentPageTitle.textContent = 'Dashboard';
    }


    // ==========================================
    // 4. LIVE DATE/TIME & 13. THEME TOGGLE
    // ==========================================

    function startClock() {
        updateTime();
        clockInterval = setInterval(updateTime, 1000);
    }

    function stopClock() {
        clearInterval(clockInterval);
    }

    function updateTime() {
        const now = new Date();
        const options = { 
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        };
        currentDateTime.textContent = now.toLocaleDateString('en-US', options).replace(',', '');
    }

    // Theme Toggle Logic
    let isDarkMode = true; // Default
    themeToggle.addEventListener('click', () => {
        const icon = themeToggle.querySelector('i');
        
        if (isDarkMode) {
            document.body.classList.add('light-theme');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('light-theme');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        
        isDarkMode = !isDarkMode;
    });


    // ==========================================
    // 5. ANIMATED KPI COUNTERS
    // ==========================================

    function animateKPIs() {
        const duration = 1500; // ms
        const frameRate = 30;
        const totalFrames = Math.round((duration / 1000) * frameRate);

        Object.values(kpiCounters).forEach(counter => {
            let currentFrame = 0;
            const target = counter.target;
            const element = counter.el;
            
            const counterInterval = setInterval(() => {
                currentFrame++;
                const progress = currentFrame / totalFrames;
                // Ease out quad
                const currentVal = Math.round(target * (1 - (1 - progress) * (1 - progress)));
                
                element.textContent = currentVal.toLocaleString();
                
                if (currentFrame === totalFrames) {
                    clearInterval(counterInterval);
                    element.textContent = target.toLocaleString();
                }
            }, 1000 / frameRate);
        });
    }


    // ==========================================
    // 6. DISPATCH MODAL
    // ==========================================

    dispatchBtn.addEventListener('click', () => {
        dispatchModal.classList.remove('hidden');
    });

    const closeModal = () => dispatchModal.classList.add('hidden');

    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    // Close on overlay click
    dispatchModal.addEventListener('click', (e) => {
        if (e.target === dispatchModal) closeModal();
    });

    confirmModalBtn.addEventListener('click', () => {
        showToast('Emergency Dispatch Initiated. Units en route.', 'warning');
        closeModal();
    });


    // ==========================================
    // 7. INCIDENT MAP INTERACTION
    // ==========================================

    // Fake zone data
    const zoneData = {
        "Downtown Core": {
            type: "Structural Collapse",
            assigned: "Alpha Squad, Heavy Lifter 01",
            recommendation: "Deploy additional medical personnel immediately.",
            eta: "04 mins"
        },
        "Westside Residential": {
            type: "Severe Flooding",
            assigned: "None (Requested)",
            recommendation: "Requires water rescue units and evacuation boats.",
            eta: "N/A"
        },
        "Industrial Park": {
            type: "Chemical Fire",
            assigned: "Hazmat Team Delta",
            recommendation: "Maintain 1km perimeter. Evacuate surrounding grid.",
            eta: "On Scene"
        },
        "North Suburbs": {
            type: "Power Outage",
            assigned: "Engineering Unit 3",
            recommendation: "Monitor situation. Low risk.",
            eta: "12 mins"
        },
        "East River": {
            type: "Levee Breach Warning",
            assigned: "Foxtrot Water Rescue",
            recommendation: "Standby for potential rapid extraction.",
            eta: "Staging"
        },
        "General Hospital": {
            type: "Backup Generator Failure",
            assigned: "Bravo Medics",
            recommendation: "Critical: Priority routing for portable power units.",
            eta: "02 mins"
        }
    };

    zoneCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all
            zoneCards.forEach(c => c.style.transform = 'scale(1)');
            card.style.transform = 'scale(1.05)';

            const zoneName = card.getAttribute('data-zone');
            const severity = card.getAttribute('data-severity');
            const details = zoneData[zoneName];

            // Build HTML for detail panel
            let severityClass = severity.toLowerCase();
            if(severityClass === 'critical') severityClass = 'var(--status-critical)';
            else if(severityClass === 'high') severityClass = 'var(--status-high)';
            else if(severityClass === 'medium') severityClass = 'var(--status-medium)';
            else severityClass = 'var(--status-low)';

            const detailHTML = `
                <div style="margin-bottom: 1rem;">
                    <h4 style="font-size: 1.2rem; color: var(--text-primary);">${zoneName}</h4>
                    <span style="display:inline-block; margin-top:0.5rem; padding:0.25rem 0.5rem; border-radius:4px; font-size:0.8rem; font-weight:bold; background-color: ${severityClass}; color:#fff;">
                        ${severity} Priority
                    </span>
                </div>
                <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                    <p><strong style="color:var(--text-primary)">Incident:</strong> ${details.type}</p>
                    <p><strong style="color:var(--text-primary)">Assigned Units:</strong> ${details.assigned}</p>
                    <p><strong style="color:var(--text-primary)">Unit ETA:</strong> ${details.eta}</p>
                    <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 4px;">
                        <strong style="color:var(--text-primary)">AI Recommendation:</strong><br>
                        ${details.recommendation}
                    </div>
                </div>
                <button class="primary-btn" style="margin-top: 1rem; padding: 0.5rem; font-size:0.9rem;" onclick="document.getElementById('dispatchModal').classList.remove('hidden')">
                    Dispatch Units Here
                </button>
            `;

            zoneDetailPanel.innerHTML = `<h3>Zone Intel</h3><div class="intel-content">${detailHTML}</div>`;
        });
    });


    // ==========================================
    // 8. RESOURCE ALLOCATION
    // ==========================================

    assignButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const resourceName = row.querySelector('td:first-child').textContent;
            const select = row.querySelector('.zone-select');
            
            if (select.value === 'none') {
                showToast(`Please select a zone to assign ${resourceName}.`, 'error');
                return;
            }

            const targetZone = select.options[select.selectedIndex].text;
            
            // Simulate assignment UI change
            const badge = row.querySelector('.badge');
            badge.textContent = 'Deployed';
            badge.className = 'badge deployed';
            
            showToast(`${resourceName} successfully assigned to ${targetZone}.`, 'success');
        });
    });


    // ==========================================
    // 9. RESCUE TEAM STATUS TOGGLE
    // ==========================================

    const statuses = [
        { text: 'Active', class: 'deployed' },
        { text: 'Standby', class: 'available' },
        { text: 'Resting', class: 'maintenance' }
    ];

    statusToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.team-card');
            const badge = card.querySelector('.badge');
            const teamName = card.querySelector('h3').textContent;
            
            // Find current status index
            let currentIndex = statuses.findIndex(s => s.text === badge.textContent);
            let nextIndex = (currentIndex + 1) % statuses.length;
            
            // Apply new status
            badge.textContent = statuses[nextIndex].text;
            badge.className = `badge ${statuses[nextIndex].class}`;
            
            showToast(`${teamName} status updated to ${statuses[nextIndex].text}.`, 'info');
        });
    });


    // ==========================================
    // 10. ALERT FILTERING
    // ==========================================

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            const alerts = alertList.querySelectorAll('.alert-card');

            alerts.forEach(alert => {
                if (filterValue === 'all') {
                    alert.style.display = 'flex';
                } else {
                    if (alert.classList.contains(`severity-${filterValue}`)) {
                        alert.style.display = 'flex';
                    } else {
                        alert.style.display = 'none';
                    }
                }
            });
        });
    });


    // ==========================================
    // 11. FAKE LIVE ALERTS GENERATOR
    // ==========================================

    const sampleAlerts = [
        { type: 'critical', title: 'Building Collapse', msg: 'Secondary collapse detected in Sector 7.', icon: 'fa-building-circle-exclamation' },
        { type: 'high', title: 'Traffic Gridlock', msg: 'Evacuation route B blocked by debris.', icon: 'fa-car-burst' },
        { type: 'medium', title: 'Supply Shortage', msg: 'Medical camp 2 requesting additional bandages.', icon: 'fa-box-open' },
        { type: 'low', title: 'Unit Arrived', msg: 'Alpha Squad has reached the staging area.', icon: 'fa-location-dot' }
    ];

    function startAlertGenerator() {
        alertGeneratorInterval = setInterval(() => {
            // Randomly pick an alert
            const randAlert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
            
            // Get current time
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            // Create HTML element
            const alertHTML = `
                <div class="alert-card severity-${randAlert.type}" style="animation: fadeIn 0.5s ease-out;">
                    <div class="alert-icon"><i class="fa-solid ${randAlert.icon}"></i></div>
                    <div class="alert-content">
                        <h4>${randAlert.title}</h4>
                        <p>${randAlert.msg}</p>
                        <span class="alert-time">${timeStr}</span>
                    </div>
                </div>
            `;

            // Insert at top
            alertList.insertAdjacentHTML('afterbegin', alertHTML);

            // Keep list manageable (max 10)
            if (alertList.children.length > 10) {
                alertList.removeChild(alertList.lastChild);
            }

            // Also update the active incidents counter slightly
            kpiCounters.activeIncidentsCount.target += 1;
            kpiCounters.activeIncidentsCount.el.textContent = kpiCounters.activeIncidentsCount.target;

        }, 15000); // Generate new alert every 15 seconds
    }

    function stopAlertGenerator() {
        clearInterval(alertGeneratorInterval);
    }


    // ==========================================
    // 12. RESOURCE REQUEST FORM
    // ==========================================

    resourceRequestForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload

        // Basic validation check (though 'required' attribute handles most)
        const zone = document.getElementById('reqZoneName').value;
        const type = document.getElementById('reqType').value;
        
        if(!zone || !type) return;

        // Simulate network request
        const submitBtn = resourceRequestForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Reset form
            resourceRequestForm.reset();
            
            // Show Success Message
            formResponse.textContent = `Request logged successfully. ID: REQ-${Math.floor(Math.random()*10000)}`;
            formResponse.className = 'response-message success';
            formResponse.classList.remove('hidden');

            // Reset Button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Hide response after a few seconds
            setTimeout(() => {
                formResponse.classList.add('hidden');
            }, 5000);

            showToast('New resource request submitted to dispatch queue.', 'success');
        }, 1500);
    });


    // ==========================================
    // 15. TOAST NOTIFICATION SYSTEM (Bonus Enhancement)
    // ==========================================

    // Create a container for toasts if it doesn't exist
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 9999;
    `;
    document.body.appendChild(toastContainer);

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        
        // Define colors based on type
        let bgColor, icon;
        switch(type) {
            case 'success': bgColor = 'var(--status-low)'; icon = 'fa-circle-check'; break;
            case 'error': bgColor = 'var(--status-critical)'; icon = 'fa-circle-xmark'; break;
            case 'warning': bgColor = 'var(--status-high)'; icon = 'fa-triangle-exclamation'; break;
            default: bgColor = 'var(--accent-primary)'; icon = 'fa-circle-info';
        }

        toast.style.cssText = `
            background-color: ${bgColor};
            color: #fff;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        
        toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => { toast.style.transform = 'translateX(0)'; }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => { toast.remove(); }, 300);
        }, 3000);
    }

});