/**
 * UniGuide AI - Admission Application Tracker JS
 */

let currentApplicationsList = [];

document.addEventListener('DOMContentLoaded', () => {
    initApplicationsPage();
});

async function initApplicationsPage() {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    if (student.id) {
        await loadApplications(student.id);
    } else {
        renderMockApplications();
    }

    id('openAddAppModalBtn')?.addEventListener('click', () => {
        id('appId').value = '';
        id('appModalTitle').textContent = 'Track New Admission Application';
        id('applicationForm').reset();
        const modal = new bootstrap.Modal(id('applicationModal'));
        modal.show();
    });

    id('applicationForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveApplicationEntry();
    });
}

async function loadApplications(studentId) {
    try {
        const res = await fetch(`${API_BASE}/applications/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Applications fetch failed");
        currentApplicationsList = await res.json();
        renderApplicationsGrid(currentApplicationsList);
    } catch (err) {
        console.warn("Applications fetch fallback:", err);
        renderMockApplications();
    }
}

function renderApplicationsGrid(list) {
    const container = id('applicationsGridContainer');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state-card">
                    <h5>No Applications Tracked Yet</h5>
                    <p>Click "Add Application" above to begin tracking your target college entries.</p>
                </div>
            </div>
        `;
        return;
    }

    let html = '';
    list.forEach(app => {
        let badgeClass = 'bg-secondary';
        if (app.status === 'Applied') badgeClass = 'bg-primary';
        else if (app.status === 'Under Review') badgeClass = 'bg-warning text-dark';
        else if (app.status === 'Accepted') badgeClass = 'bg-success';
        else if (app.status === 'Rejected') badgeClass = 'bg-danger';

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card-custom p-4 h-100 d-flex flex-column justify-content-between border hover-shadow">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge ${badgeClass} fs-6">${escapeHtml(app.status)}</span>
                            <span class="badge bg-light text-dark border small">${escapeHtml(app.courseName || 'MCA')}</span>
                        </div>
                        <h5 class="fw-bold text-primary mb-2">${escapeHtml(app.collegeName)}</h5>

                        <div class="p-3 bg-light rounded-3 mb-3 small">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="text-muted">Applied Date:</span>
                                <strong>${app.applicationDate || 'Not set'}</strong>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-muted">Registration Deadline:</span>
                                <strong class="text-danger">${app.deadline || 'N/A'}</strong>
                            </div>
                        </div>

                        ${app.notes ? `<p class="small text-muted mb-3"><i data-lucide="file-text" class="me-1"></i> ${escapeHtml(app.notes)}</p>` : ''}
                    </div>

                    <div class="pt-3 border-top d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary w-100" onclick="editApplication(${app.id})">Edit Entry</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteApplicationEntry(${app.id})"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

function editApplication(appId) {
    const app = currentApplicationsList.find(a => a.id === appId);
    if (!app) return;

    id('appId').value = app.id;
    id('appModalTitle').textContent = 'Edit Application Entry';
    id('appCollegeName').value = app.collegeName || '';
    id('appCourseName').value = app.courseName || '';
    id('appStatus').value = app.status || 'Planning';
    id('appDate').value = app.applicationDate || '';
    id('appDeadline').value = app.deadline || '';
    id('appNotes').value = app.notes || '';

    const modal = new bootstrap.Modal(id('applicationModal'));
    modal.show();
}

async function saveApplicationEntry() {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    const appId = id('appId').value;
    const isEdit = !!appId;

    const payload = {
        studentId: student.id || 1,
        collegeName: id('appCollegeName').value,
        courseName: id('appCourseName').value,
        status: id('appStatus').value,
        applicationDate: id('appDate').value || null,
        deadline: id('appDeadline').value || null,
        notes: id('appNotes').value
    };

    const url = isEdit ? `${API_BASE}/applications/${appId}` : `${API_BASE}/applications`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Save application failed");
        
        const modalEl = id('applicationModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        if (student.id) await loadApplications(student.id);
        else renderMockApplications();
    } catch (err) {
        console.error("Save application error:", err);
        alert("Error saving application entry.");
    }
}

async function deleteApplicationEntry(appId) {
    if (!confirm("Are you sure you want to delete this application entry?")) return;

    try {
        await fetch(`${API_BASE}/applications/${appId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const student = JSON.parse(localStorage.getItem('student') || '{}');
        if (student.id) await loadApplications(student.id);
        else renderMockApplications();
    } catch (err) {
        console.error("Delete application error:", err);
    }
}

function renderMockApplications() {
    currentApplicationsList = [
        {
            id: 1,
            collegeName: "Chandigarh University",
            courseName: "MCA",
            status: "Applied",
            applicationDate: "2025-05-10",
            deadline: "2025-06-15",
            notes: "Submitted online registration form. Fee paid via UPI."
        },
        {
            id: 2,
            collegeName: "Delhi Technological University (DTU)",
            courseName: "MCA",
            status: "Under Review",
            applicationDate: "2025-05-02",
            deadline: "2025-06-20",
            notes: "NIMCET entrance scorecard uploaded. Awaiting document verification."
        }
    ];

    renderApplicationsGrid(currentApplicationsList);
}

function id(name) {
    return document.getElementById(name);
}
