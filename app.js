/**
 * app.js - Smart Student App Enterprise AI Attendance
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    let currentTheme = localStorage.getItem('theme') || 'light';
    
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
        }
    }
    applyTheme(currentTheme);
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        });
    }

    // --- Auth Screen Logic ---
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.style.color = 'var(--text-muted)';
                b.style.borderBottomColor = 'transparent';
            });
            e.target.classList.add('active');
            e.target.style.color = 'var(--primary)';
            e.target.style.borderBottomColor = 'var(--primary)';
            
            const targetId = e.target.getAttribute('data-tab');
            if(targetId === 'loginForm') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });

    // Login Flow
    const loginStep1 = document.getElementById('loginStep1');
    const loginStep2 = document.getElementById('loginStep2');
    const loginRole = document.getElementById('loginRole');
    
    document.getElementById('btnSendOtp').addEventListener('click', () => {
        const id = document.getElementById('loginId').value;
        if(!id) return alert('Enter University ID or Email');
        loginStep1.classList.add('hidden');
        loginStep2.classList.remove('hidden');
    });

    document.getElementById('btnBackToLogin').addEventListener('click', () => {
        loginStep2.classList.add('hidden');
        loginStep1.classList.remove('hidden');
    });

    document.getElementById('btnVerifyOtp').addEventListener('click', () => {
        const role = loginRole.value;
        loginUser(role);
    });

    // --- Main App Logic ---
    const views = {
        student: document.getElementById('studentView'),
        parent: document.getElementById('parentView'),
        staff: document.getElementById('staffView'),
        admin: document.getElementById('adminView')
    };

    const roleConfigs = {
        student: { name: 'Alex Johnson', label: 'B.Tech CS (Year 3)', icon: 'fa-user-graduate', color: '4f46e5' },
        parent: { name: 'Michael Johnson', label: 'Guardian Account', icon: 'fa-user-group', color: '10b981' },
        staff: { name: 'Dr. Sarah Smith', label: 'Faculty - CS Dept', icon: 'fa-chalkboard-user', color: '8b5cf6' },
        admin: { name: 'System Admin', label: 'IT Infrastructure', icon: 'fa-user-shield', color: '0ea5e9' }
    };

    function loginUser(role) {
        authScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
        
        const config = roleConfigs[role];
        
        // Setup Header
        document.getElementById('currentUserName').textContent = config.name;
        document.getElementById('currentUserRoleText').textContent = config.label;
        document.getElementById('currentUserAvatar').src = `https://ui-avatars.com/api/?name=${config.name.replace(' ','+')}&background=${config.color}&color=fff&rounded=true&bold=true`;

        // Setup Sidebar Menu
        const sidebarMenu = document.getElementById('sidebarMenu');
        sidebarMenu.innerHTML = `
            <div class="menu-label">Main Menu</div>
            <div class="menu-item active">
                <i class="fa-solid fa-layer-group" style="width: 20px;"></i> <span>Overview</span>
            </div>
            <div class="menu-item" onclick="alert('Accessing Analytics Engine...')">
                <i class="fa-solid fa-chart-pie" style="width: 20px;"></i> <span>Analytics</span>
            </div>
            <div class="menu-label mt-24">System</div>
            <div class="menu-item" onclick="document.getElementById('settingsModal') ? document.getElementById('settingsModal').classList.remove('hidden') : null">
                <i class="fa-solid fa-sliders" style="width: 20px;"></i> <span>Preferences</span>
            </div>
        `;

        document.getElementById('pageTitle').textContent = `Workspace / ${role.charAt(0).toUpperCase() + role.slice(1)}`;

        // Show View
        Object.values(views).forEach(v => { if(v) v.classList.add('hidden'); });
        if(views[role]) views[role].classList.remove('hidden');

        // Initializations
        if(role === 'staff') populateStaffTable();
        if(role === 'admin') initAdminChart();
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        appContainer.classList.add('hidden');
        authScreen.classList.remove('hidden');
        loginStep2.classList.add('hidden');
        loginStep1.classList.remove('hidden');
        document.getElementById('loginId').value = '';
        document.querySelectorAll('.otp-digit').forEach(i => i.value = '');
    });

    // --- Notifications ---
    const bellBtn = document.getElementById('bellBtn');
    const notifPanel = document.getElementById('notificationPanel');
    
    bellBtn.addEventListener('click', () => {
        notifPanel.classList.toggle('hidden');
    });
    document.getElementById('closeNotifBtn').addEventListener('click', () => {
        notifPanel.classList.add('hidden');
    });

    // --- Student Features ---
    const markAttendanceBtn = document.getElementById('markStudentAttendanceBtn');
    const aiModal = document.getElementById('aiScanningModal');
    
    if (markAttendanceBtn && aiModal) {
        markAttendanceBtn.addEventListener('click', () => {
            aiModal.classList.remove('hidden');
            const scanText = document.getElementById('scanText');
            scanText.textContent = "Acquiring GPS Coordinates...";
            
            setTimeout(() => { scanText.textContent = "Processing 3D Facial Depth Map..."; }, 1000);
            
            setTimeout(() => {
                aiModal.classList.add('hidden');
                markAttendanceBtn.classList.remove('btn-primary');
                markAttendanceBtn.classList.add('btn-outline');
                markAttendanceBtn.innerHTML = '<i class="fa-solid fa-check-double text-success"></i> <span class="text-success font-bold">Identity Verified</span>';
                markAttendanceBtn.disabled = true;
            }, 2500);
        });
    }

    // --- Staff Features ---
    function populateStaffTable() {
        const tbody = document.getElementById('staffStudentList');
        if(!tbody) return;
        const students = [
            { name: 'Alex Johnson', method: 'Biometric + GPS', status: 'Present' },
            { name: 'Emma Wilson', method: 'Biometric Only', status: 'Present' },
            { name: 'Liam Brown', method: '--', status: 'Absent' },
            { name: 'Noah Miller', method: '--', status: 'Absent' }
        ];

        tbody.innerHTML = '';
        students.forEach(std => {
            let statusTag = std.status === 'Present' ? '<span class="tag tag-success">Present</span>' : '<span class="tag tag-danger">Absent</span>';
            tbody.innerHTML += `
                <tr>
                    <td><strong>${std.name}</strong></td>
                    <td class="text-muted text-xs">${std.method}</td>
                    <td class="status-cell">${statusTag}</td>
                    <td><button class="btn btn-outline btn-sm override-btn">Override</button></td>
                </tr>
            `;
        });

        document.querySelectorAll('.override-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tr = e.target.closest('tr');
                const cell = tr.querySelector('.status-cell');
                if(cell.innerHTML.includes('Present')) {
                    cell.innerHTML = '<span class="tag tag-danger">Absent (Manual)</span>';
                } else {
                    cell.innerHTML = '<span class="tag tag-success">Present (Manual)</span>';
                }
            });
        });
    }

    // --- Admin Features ---
    let chartInstance = null;
    function initAdminChart() {
        const ctx = document.getElementById('attendanceChart');
        if (!ctx) return;
        if (chartInstance) chartInstance.destroy();

        // Add gradient to chart
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.2)');

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'Campus Attendance %',
                    data: [85, 92, 88, 95, 80],
                    backgroundColor: gradient,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 13, family: 'Plus Jakarta Sans' },
                        bodyFont: { size: 14, weight: 'bold', family: 'Plus Jakarta Sans' },
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(15, 23, 42, 0.05)' },
                        ticks: { font: { family: 'Plus Jakarta Sans' } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Plus Jakarta Sans', weight: 'bold' } }
                    }
                }
            }
        });
    }

    // Simulate OTP inputs auto-advance
    document.querySelectorAll('.otp-digit').forEach((input, index, inputs) => {
        input.addEventListener('input', () => {
            if (input.value && index < inputs.length - 1) inputs[index + 1].focus();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) inputs[index - 1].focus();
        });
    });

    // Offline mode mock check
    window.addEventListener('offline', () => document.getElementById('offlineIndicator').classList.remove('hidden'));
    window.addEventListener('online', () => document.getElementById('offlineIndicator').classList.add('hidden'));
});
