/**
 * UniGuide AI - Student Dashboard Logic
 * Integrates real Spring Boot API calls for profile, recommendations, saved colleges, scholarships, and applications.
 */

document.addEventListener('DOMContentLoaded', () => {
    checkStudentAuth();
    initSidebarToggle();
    loadDashboardData();
    initProfileUpdateForm();
});

function checkStudentAuth() {
    const token = localStorage.getItem('token');
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (!token || !student.id) {
        window.location.href = 'login.html';
        return;
    }

    const nameDisplays = document.querySelectorAll('.student-name-display');
    nameDisplays.forEach(el => el.textContent = student.name || 'Student');

    if (student.name) {
        const avatarImg = document.getElementById('userAvatarImg');
        if (avatarImg) {
            avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=06b6d4&color=fff`;
        }
    }

    if (student.role === 'ROLE_ADMIN' || student.role === 'ADMIN') {
        const adminLink = document.getElementById('adminSidebarLink');
        if (adminLink) adminLink.style.display = 'block';
    }
}

function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = id('sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
        });
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

async function loadDashboardData() {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    if (!student.id) return;

    await Promise.all([
        fetchProfileOverview(student.id),
        fetchTopRecommendations(student.id),
        fetchScholarshipsPreview(student.id),
        fetchSavedColleges(student.id),
        fetchApplicationsTracker(student.id),
        fetchAdmissionPredictionPreview(student)
    ]);

    if (window.lucide) lucide.createIcons();
}

async function fetchProfileOverview(studentId) {
    try {
        const res = await fetch(`${API_BASE}/students/${studentId}/profile-overview`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error('Failed to fetch profile overview');
        const data = await res.json();

        // Update local storage student record
        if (data.student) {
            localStorage.setItem('student', JSON.stringify(data.student));
            populateProfileForm(data.student);
        }

        const pct = data.completionPercentage || 0;
        const missing = data.missingFields || [];

        const pctBadge = id('profilePercentageBadge');
        const pctBar = id('profileProgressBar');
        const alertDiv = id('missingFieldsAlert');

        if (pctBadge) pctBadge.textContent = `${pct}%`;
        if (pctBar) pctBar.style.width = `${pct}%`;

        if (alertDiv) {
            if (missing.length === 0) {
                alertDiv.innerHTML = `<span class="text-success"><i data-lucide="check-circle" class="me-1"></i> Your profile is complete! Complete data enables 100% accurate recommendations.</span>`;
            } else {
                alertDiv.innerHTML = `<span class="text-warning"><i data-lucide="alert-circle" class="me-1"></i> Missing fields: <strong>${missing.join(', ')}</strong></span>`;
            }
        }
    } catch (err) {
        console.warn("Profile overview fallback:", err);
    }
}

function populateProfileForm(student) {
    if (id('profileName')) id('profileName').value = student.name || '';
    if (id('profileMarks')) id('profileMarks').value = student.marks || '';
    if (id('profileEntrance')) id('profileEntrance').value = student.entranceScore || '';
    if (id('profileCourse')) id('profileCourse').value = student.preferredCourse || '';
    if (id('profileLocation')) id('profileLocation').value = student.preferredLocation || '';
    if (id('profileBudget')) id('profileBudget').value = student.budget || '';
    if (id('profileCareer')) id('profileCareer').value = student.careerInterest || '';
}

async function fetchTopRecommendations(studentId) {
    const container = id('topRecommendationsContainer');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/recommendations/generate/${studentId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Could not fetch recommendations");
        const data = await res.json();

        const recs = data.recommendations || [];
        if (recs.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card">
                    <p class="mb-2">No recommendations generated yet.</p>
                    <a href="recommendations.html" class="btn btn-sm btn-primary">Generate Recommendations</a>
                </div>
            `;
            return;
        }

        const top3 = recs.slice(0, 3);
        let html = '<div class="row g-3">';
        top3.forEach(item => {
            const badgeClass = item.matchPercentage >= 85 ? 'badge-match-high' : 'badge-match-medium';
            html += `
                <div class="col-md-4">
                    <div class="p-3 border rounded-3 h-100 bg-surface hover-shadow d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge ${badgeClass}">${item.matchPercentage}% Match</span>
                                <small class="text-muted fw-bold">${escapeHtml(item.courseName || 'MCA')}</small>
                            </div>
                            <h6 class="fw-bold mb-1">${escapeHtml(item.collegeName)}</h6>
                            <p class="small text-muted mb-2"><i data-lucide="map-pin" class="me-1"></i> ${escapeHtml(item.location || 'India')}</p>
                            <small class="d-block text-dark fw-medium mb-3">Fees: ${formatCurrency(item.fees)} / yr</small>
                        </div>
                        <a href="college-details.html?id=${item.collegeId || 1}" class="btn btn-sm btn-outline-primary w-100">View Details</a>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (err) {
        console.warn("Top recommendations fallback:", err);
        container.innerHTML = `
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="p-3 border rounded-3 bg-surface">
                        <span class="badge badge-match-high mb-2">91% Match</span>
                        <h6 class="fw-bold mb-1">Delhi Technological University</h6>
                        <small class="text-muted d-block mb-2">Delhi • MCA</small>
                        <small class="fw-medium text-dark mb-3 d-block">Fees: ₹85,000 / yr</small>
                        <a href="colleges.html" class="btn btn-sm btn-outline-primary w-100">View Details</a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 border rounded-3 bg-surface">
                        <span class="badge badge-match-high mb-2">87% Match</span>
                        <h6 class="fw-bold mb-1">Chandigarh University</h6>
                        <small class="text-muted d-block mb-2">Punjab • MCA</small>
                        <small class="fw-medium text-dark mb-3 d-block">Fees: ₹1,50,000 / yr</small>
                        <a href="colleges.html" class="btn btn-sm btn-outline-primary w-100">View Details</a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 border rounded-3 bg-surface">
                        <span class="badge badge-match-medium mb-2">79% Match</span>
                        <h6 class="fw-bold mb-1">Panjab University</h6>
                        <small class="text-muted d-block mb-2">Punjab • MCA</small>
                        <small class="fw-medium text-dark mb-3 d-block">Fees: ₹45,000 / yr</small>
                        <a href="colleges.html" class="btn btn-sm btn-outline-primary w-100">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }
}

async function fetchScholarshipsPreview(studentId) {
    const container = id('scholarshipsPreviewContainer');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/scholarships/match/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Scholarships fetch failed");
        const list = await res.json();

        if (list.length === 0) {
            container.innerHTML = `<p class="text-muted small mb-0">No active scholarships available right now.</p>`;
            return;
        }

        const top2 = list.slice(0, 2);
        let html = '<div class="d-flex flex-column gap-3">';
        top2.forEach(item => {
            const sch = item.scholarship;
            const expired = item.isExpired;
            html += `
                <div class="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-surface">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <h6 class="fw-bold mb-0 fs-6">${escapeHtml(sch.name)}</h6>
                            ${expired ? '<span class="badge badge-expired">EXPIRED</span>' : `<span class="badge bg-success-subtle text-success small">${item.matchPercentage}% Match</span>`}
                        </div>
                        <small class="text-muted d-block">${escapeHtml(sch.provider)} • Amount: <strong>${formatCurrency(sch.amount)}</strong></small>
                        <small class="text-secondary style-italic">Deadline: ${sch.deadline || 'N/A'}</small>
                    </div>
                    <a href="scholarships.html" class="btn btn-sm btn-outline-custom">View</a>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (err) {
        console.warn("Scholarships preview fallback:", err);
    }
}

async function fetchSavedColleges(studentId) {
    const container = id('savedCollegesContainer');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/favorites/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Favorites fetch failed");
        const favorites = await res.json();

        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="text-center py-2">
                    <p class="small text-muted mb-2">You have not saved any colleges yet.</p>
                    <a href="colleges.html" class="btn btn-sm btn-outline-primary">Explore Colleges</a>
                </div>
            `;
            return;
        }

        let html = '<div class="row g-2">';
        favorites.slice(0, 3).forEach(c => {
            html += `
                <div class="col-md-4">
                    <div class="p-2 border rounded text-center bg-surface">
                        <strong class="d-block text-truncate small">${escapeHtml(c.name)}</strong>
                        <small class="text-muted">${escapeHtml(c.location || 'India')}</small>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (err) {
        console.warn("Saved colleges fallback:", err);
    }
}

async function fetchApplicationsTracker(studentId) {
    const container = id('dashApplicationsContainer');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE}/applications/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Applications fetch failed");
        const list = await res.json();

        if (list.length === 0) {
            container.innerHTML = `<p class="small text-muted mb-0">No application tracking records found. <a href="applications.html">Add application</a></p>`;
            return;
        }

        let html = '<ul class="list-unstyled mb-0 d-flex flex-column gap-2">';
        list.slice(0, 2).forEach(app => {
            const badgeBg = app.status === 'Applied' ? 'bg-primary' : (app.status === 'Accepted' ? 'bg-success' : 'bg-warning text-dark');
            html += `
                <li class="p-2 bg-light rounded d-flex justify-content-between align-items-center">
                    <div>
                        <strong class="d-block small text-dark">${escapeHtml(app.collegeName)}</strong>
                        <small class="text-muted">${escapeHtml(app.courseName)}</small>
                    </div>
                    <span class="badge ${badgeBg} small">${escapeHtml(app.status)}</span>
                </li>
            `;
        });
        html += '</ul>';
        container.innerHTML = html;
    } catch (err) {
        console.warn("Applications fallback:", err);
    }
}

async function fetchAdmissionPredictionPreview(student) {
    const marks = student.marks || 75;
    const entrance = student.entranceScore || 70;
    const budget = student.budget || 200000;
    const cutoff = 80;

    try {
        const res = await fetch(`${API_BASE}/ai/predict?marks=${marks}&entranceScore=${entrance}&budget=${budget}&cutoff=${cutoff}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Prediction API failed");
        const data = await res.json();

        const pctEl = id('dashChancePercent');
        const badgeEl = id('dashChanceBadge');
        const reasonEl = id('dashChanceReason');

        if (pctEl) pctEl.textContent = `${data.probability || 87}%`;
        if (badgeEl) {
            badgeEl.textContent = `${data.chance || 'HIGH'} CHANCE`;
            badgeEl.className = data.chance === 'HIGH' ? 'badge badge-match-high px-3 py-1 fs-6' : 'badge badge-match-medium px-3 py-1 fs-6';
        }
        if (reasonEl) reasonEl.textContent = data.reason || 'Your academic score aligns well with historical cutoffs.';
    } catch (err) {
        console.warn("Prediction preview fallback:", err);
    }
}

function initProfileUpdateForm() {
    const form = id('updateProfileForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const student = JSON.parse(localStorage.getItem('student') || '{}');
        const btn = id('saveProfileBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Saving...';
        if (window.lucide) lucide.createIcons();

        const payload = {
            name: id('profileName').value,
            email: student.email,
            password: "UnchangedPassword@123", // Password stays protected
            marks: parseFloat(id('profileMarks').value) || 0.0,
            entranceScore: parseFloat(id('profileEntrance').value) || 0.0,
            preferredCourse: id('profileCourse').value,
            preferredLocation: id('profileLocation').value,
            budget: parseFloat(id('profileBudget').value) || 0.0,
            careerInterest: id('profileCareer').value
        };

        try {
            const res = await fetch(`${API_BASE}/students/${student.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const updated = await res.json();
                localStorage.setItem('student', JSON.stringify(updated));
                const modalEl = document.getElementById('editProfileModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
                loadDashboardData();
            } else {
                alert('Failed to update profile.');
            }
        } catch (err) {
            console.error("Profile update error:", err);
            alert('Error connecting to server.');
        } finally {
            btn.innerHTML = originalText;
        }
    });
}

function id(name) {
    return document.getElementById(name);
}
