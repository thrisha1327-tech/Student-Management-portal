// Very early Authentication check to strictly gate dashboard
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Logic
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const dashboardWrapper = document.querySelector('.dashboard-wrapper');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all tabs
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked tab
            const tabName = item.getAttribute('data-tab');
            document.querySelectorAll(`.nav-item[data-tab="${tabName}"]`).forEach(nav => nav.classList.add('active'));

            // Update wrapper class
            dashboardWrapper.className = `dashboard-wrapper show-tab-${tabName}`;
            
            // Update page title
            if (pageTitle) {
                pageTitle.textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);
            }
        });
    });

    // 2. Circular Progress Initialization
    const progressCircles = document.querySelectorAll('.circular-progress');
    progressCircles.forEach(circle => {
        const progress = circle.getAttribute('data-progress');
        if (progress) {
            circle.style.setProperty('--progress', progress);
        }
    });

    // 3. Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('ph-moon');
            themeIcon.classList.add('ph-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
                themeIcon.classList.remove('ph-moon');
                themeIcon.classList.add('ph-sun');
            } else {
                themeIcon.classList.remove('ph-sun');
                themeIcon.classList.add('ph-moon');
            }
            localStorage.setItem('theme', theme);
        });
    }

    // 4. View All Courses Toggle
    const viewAllCoursesBtn = document.getElementById('view-all-courses');
    const courseList = document.querySelector('.course-list');
    if (viewAllCoursesBtn && courseList) {
        viewAllCoursesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            courseList.classList.toggle('expanded');
            if (courseList.classList.contains('expanded')) {
                viewAllCoursesBtn.textContent = 'View Less';
            } else {
                viewAllCoursesBtn.textContent = 'View All';
            }
        });
    }

    // 5. Add Dynamic Task
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.querySelector('.task-list');

    // Delegate delete events
    if (taskList) {
        taskList.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-task-btn');
            if (deleteBtn) {
                const taskItem = deleteBtn.closest('.task-item');
                if (taskItem) {
                    taskItem.remove();
                }
            }
        });
    }

    if (addTaskBtn && taskList) {
        addTaskBtn.addEventListener('click', () => {
            const taskName = prompt("Enter new assignment or task title:");
            if (taskName && taskName.trim()) {
                const statusNum = prompt("Enter status:\\n1 for Completed\\n2 for In Progress\\n3 for Pending", "3");
                let status = "Pending", badgeClass = "badge-danger", completedClass = "";
                if (statusNum === "1") { status = "Completed"; badgeClass = "badge-success"; completedClass = "completed"; }
                else if (statusNum === "2") { status = "In Progress"; badgeClass = "badge-warning"; }

                const li = document.createElement('li');
                li.className = `task-item ${completedClass}`;
                li.innerHTML = `
                    <label class="custom-checkbox">
                        <input type="checkbox" ${statusNum === "1" ? "checked" : ""}>
                        <span class="checkmark"></span>
                    </label>
                    <div class="task-info">
                        <p class="task-title">${taskName}</p>
                    </div>
                    <span class="badge ${badgeClass}">${status}</span>
                    <button class="icon-btn-sm text-danger delete-task-btn" style="margin-left: 12px;"><i class="ph ph-trash"></i></button>
                `;
                taskList.appendChild(li);
            }
        });
    }

    // 6. Notice Tabs Logic
    const noticeTabs = document.querySelectorAll('.notice-tab');
    if (noticeTabs.length > 0) {
        noticeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                noticeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Hide all containers safely based on data-target attribute
                const targets = Array.from(noticeTabs).map(t => t.getAttribute('data-target'));
                targets.forEach(targetId => {
                    const el = document.getElementById(targetId);
                    if (el) el.style.display = 'none';
                });
                
                // Show the clicked target container
                const activeTargetId = tab.getAttribute('data-target');
                const activeEl = document.getElementById(activeTargetId);
                if (activeEl) {
                    activeEl.style.display = 'block';
                }
            });
        });
    }

    // 7. Exam Performance Chart
    const ctx = document.getElementById('performanceChart');
    if (ctx) {
        const semesterData = {
            '1': [85, 82, 84],
            '2': [88, 85, 87],
            '3': [86, 89, 88]
        };
        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mid 1', 'Mid 2', 'Semester Exam'],
                datasets: [{
                    label: 'Score',
                    data: semesterData['3'],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#4f46e5',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: false, min: 60, max: 100 }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        const semesterSelect = document.getElementById('performance-semester-select');
        if (semesterSelect) {
            semesterSelect.addEventListener('change', (e) => {
                chart.data.datasets[0].data = semesterData[e.target.value] || [0,0,0];
                chart.update();
            });
        }
    }

    // 8. View More Results Toggle
    const detailedResultsList = document.getElementById('detailed-results-list');
    const viewMoreResultsBtn = document.getElementById('view-more-results');
    if (detailedResultsList && viewMoreResultsBtn) {
        viewMoreResultsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            detailedResultsList.classList.toggle('expanded');
            if (detailedResultsList.classList.contains('expanded')) {
                viewMoreResultsBtn.textContent = 'View Less';
            } else {
                viewMoreResultsBtn.textContent = 'View More';
            }
        });
    }

    // 9. Countdown Timer System
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-mins');
    const secsEl = document.getElementById('timer-secs');
    
    if (daysEl && hoursEl && minsEl && secsEl) {
        // Init exactly 12 days, 4 hours, 50 mins from current time
        let totalSeconds = (12 * 86400) + (4 * 3600) + (50 * 60);
        
        setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                const d = Math.floor(totalSeconds / 86400);
                const h = Math.floor((totalSeconds % 86400) / 3600);
                const m = Math.floor((totalSeconds % 3600) / 60);
                const s = totalSeconds % 60;
                
                daysEl.textContent = d.toString().padStart(2, '0');
                hoursEl.textContent = h.toString().padStart(2, '0');
                minsEl.textContent = m.toString().padStart(2, '0');
                secsEl.textContent = s.toString().padStart(2, '0');
            }
        }, 1000);
    }

    // 10. Logout Logic
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to securely logout?")) {
                localStorage.removeItem('isLoggedIn');
                window.location.href = 'login.html';
            }
        });
    }
});
