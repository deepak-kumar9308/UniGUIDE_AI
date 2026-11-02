/**
 * UniGuide AI - Main JavaScript
 * Handles dark mode, global navigation, notifications, and utility functions.
 */

const API_BASE = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initNavbar();
    initScrollAnimations();
    initAuthNav();
});

function initDarkMode() {
    const isDark = localStorage.getItem('uniguide_dark_mode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }

    const toggleBtns = document.querySelectorAll('.dark-mode-toggle');
    toggleBtns.forEach(btn => {
        btn.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
        btn.addEventListener('click', () => {
            const darkActive = document.body.classList.toggle('dark-mode');
            localStorage.setItem('uniguide_dark_mode', darkActive);
            btn.innerHTML = darkActive ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
            if (window.lucide) lucide.createIcons();
        });
    });
    if (window.lucide) lucide.createIcons();
}

function initNavbar() {
    const navbar = document.querySelector('.navbar-custom');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('shadow-sm');
        }
    });
}

function initAuthNav() {
    const token = localStorage.getItem('token');
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    const authNavContainer = document.getElementById('navAuthSection');

    if (!authNavContainer) return;

    if (token && student.id) {
        let adminTab = '';
        if (student.role === 'ROLE_ADMIN' || student.role === 'ADMIN') {
            adminTab = `<li><a class="dropdown-item" href="admin-dashboard.html"><i data-lucide="shield" class="me-2 text-danger"></i> Admin Dashboard</a></li><li><hr class="dropdown-divider"></li>`;
        }

        authNavContainer.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                    <i data-lucide="user"></i> ${escapeHtml(student.name || 'Student')}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    ${adminTab}
                    <li><a class="dropdown-item" href="dashboard.html"><i data-lucide="layout-dashboard" class="me-2"></i> My Dashboard</a></li>
                    <li><a class="dropdown-item" href="recommendations.html"><i data-lucide="sparkles" class="me-2"></i> AI Recommendations</a></li>
                    <li><a class="dropdown-item" href="prediction.html"><i data-lucide="trending-up" class="me-2"></i> Admission Prediction</a></li>
                    <li><a class="dropdown-item" href="applications.html"><i data-lucide="check-square" class="me-2"></i> Application Tracker</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger" onclick="logoutStudent()"><i data-lucide="log-out" class="me-2"></i> Logout</button></li>
                </ul>
            </div>
        `;
    } else {
        authNavContainer.innerHTML = `
            <a href="login.html" class="btn btn-outline-primary me-2">Login</a>
            <a href="register.html" class="btn btn-primary">Get Started</a>
        `;
    }
    if (window.lucide) lucide.createIcons();
}

function logoutStudent() {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    window.location.href = 'login.html';
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

function formatCurrency(amount) {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}
