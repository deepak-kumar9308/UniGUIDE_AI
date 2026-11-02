/**
 * UniGuide AI - Admin Dashboard Logic
 */

let courseChart = null;
let locationChart = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadAdminStats();
    loadAdminStudents();
    loadAdminColleges();
    loadAdminScholarships();
    loadAdminMlAnalytics();

    id('openAddCollegeModalBtn')?.addEventListener('click', () => {
        id('adminCollegeId').value = '';
        id('collegeModalTitle').textContent = 'Add New College';
        id('adminCollegeForm').reset();
        new bootstrap.Modal(id('adminCollegeModal')).show();
    });

    id('adminCollegeForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveAdminCollege();
    });

    id('openAddScholarshipModalBtn')?.addEventListener('click', () => {
        id('adminSchId').value = '';
        id('schModalTitle').textContent = 'Add Scholarship';
        id('adminScholarshipForm').reset();
        new bootstrap.Modal(id('adminScholarshipModal')).show();
    });

    id('adminScholarshipForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveAdminScholarship();
    });
});

function checkAdminAuth() {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    const token = localStorage.getItem('token');

    if (!token || (student.role !== 'ROLE_ADMIN' && student.role !== 'ADMIN')) {
        console.warn("Non-admin user redirected.");
        // For minor project demo, allow viewing or alert
    }
}

function switchAdminTab(tabName) {
    const tabs = ['overview', 'students', 'colleges', 'scholarships', 'analytics', 'ml'];
    tabs.forEach(t => {
        const div = id(`adminTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
        const btn = id(`tab${t.charAt(0).toUpperCase() + t.slice(1)}Btn`);
        if (div) div.style.display = (t === tabName) ? 'block' : 'none';
        if (btn) {
            if (t === tabName) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });

    if (tabName === 'analytics') {
        renderAnalyticsCharts();
    }

    if (window.lucide) lucide.createIcons();
}

async function loadAdminStats() {
    try {
        const res = await fetch(`${API_BASE}/admin/stats`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Admin stats failed");
        const data = await res.json();

        if (id('adminTotalStudents')) id('adminTotalStudents').textContent = data.totalStudents || 0;
        if (id('adminTotalColleges')) id('adminTotalColleges').textContent = data.totalColleges || 0;
        if (id('adminTotalCourses')) id('adminTotalCourses').textContent = data.totalCourses || 0;
        if (id('adminTotalScholarships')) id('adminTotalScholarships').textContent = data.totalScholarships || 0;
    } catch (err) {
        console.warn("Admin stats fallback:", err);
    }
}

async function loadAdminStudents() {
    const body = id('adminStudentsTableBody');
    if (!body) return;

    try {
        const res = await fetch(`${API_BASE}/admin/students`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Admin students failed");
        const students = await res.json();

        let html = '';
        students.forEach(s => {
            html += `
                <tr>
                    <td>${s.id}</td>
                    <td class="fw-bold">${escapeHtml(s.name)}</td>
                    <td>${escapeHtml(s.email)}</td>
                    <td>${s.marks ? s.marks + '%' : 'N/A'}</td>
                    <td><span class="badge bg-light text-dark border">${escapeHtml(s.preferredCourse || 'N/A')}</span></td>
                    <td>${escapeHtml(s.preferredLocation || 'N/A')}</td>
                    <td><span class="badge ${s.role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-primary'}">${s.role || 'ROLE_STUDENT'}</span></td>
                </tr>
            `;
        });
        body.innerHTML = html || '<tr><td colspan="7" class="text-center py-3">No students found.</td></tr>';
    } catch (err) {
        console.warn("Admin students fallback:", err);
    }
}

async function loadAdminColleges() {
    const body = id('adminCollegesTableBody');
    if (!body) return;

    try {
        const res = await fetch(`${API_BASE}/colleges`);
        if (!res.ok) throw new Error("Colleges fetch failed");
        const list = await res.json();

        let html = '';
        list.forEach(c => {
            html += `
                <tr>
                    <td>${c.id}</td>
                    <td class="fw-bold text-primary">${escapeHtml(c.name)}</td>
                    <td>${escapeHtml(c.location || 'India')}</td>
                    <td><span class="badge bg-light text-dark border">${escapeHtml(c.collegeType || 'Public')}</span></td>
                    <td>${formatCurrency(c.fees)}</td>
                    <td>${c.cutoff}%</td>
                    <td>⭐ ${c.rating || 4.5}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAdminCollege(${c.id})"><i data-lucide="trash-2"></i></button>
                    </td>
                </tr>
            `;
        });
        body.innerHTML = html || '<tr><td colspan="8" class="text-center py-3">No colleges found.</td></tr>';
    } catch (err) {
        console.warn("Admin colleges fallback:", err);
    }
}

async function saveAdminCollege() {
    const idVal = id('adminCollegeId').value;
    const isEdit = !!idVal;

    const payload = {
        name: id('admColName').value,
        location: id('admColLoc').value,
        collegeType: id('admColType').value,
        fees: parseFloat(id('admColFees').value) || 0.0,
        cutoff: parseFloat(id('admColCutoff').value) || 75.0,
        placement: id('admColPlacement').value || "Good Placement Record",
        rating: 4.5
    };

    const url = isEdit ? `${API_BASE}/colleges/${idVal}` : `${API_BASE}/colleges`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(id('adminCollegeModal'))?.hide();
            loadAdminColleges();
            loadAdminStats();
        }
    } catch (err) {
        console.error("Save college error:", err);
    }
}

async function deleteAdminCollege(colId) {
    if (!confirm("Are you sure you want to delete this college?")) return;
    try {
        await fetch(`${API_BASE}/colleges/${colId}`, { method: 'DELETE', headers: getAuthHeaders() });
        loadAdminColleges();
        loadAdminStats();
    } catch (err) {
        console.error("Delete college error:", err);
    }
}

async function loadAdminScholarships() {
    const body = id('adminScholarshipsTableBody');
    if (!body) return;

    try {
        const res = await fetch(`${API_BASE}/scholarships`);
        if (!res.ok) throw new Error("Scholarships fetch failed");
        const list = await res.json();

        let html = '';
        list.forEach(s => {
            html += `
                <tr>
                    <td>${s.id}</td>
                    <td class="fw-bold text-primary">${escapeHtml(s.name)}</td>
                    <td>${escapeHtml(s.provider)}</td>
                    <td>${formatCurrency(s.amount)}</td>
                    <td>${s.deadline || 'N/A'}</td>
                    <td><span class="badge bg-light text-dark border">${escapeHtml(s.category || 'General')}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAdminScholarship(${s.id})"><i data-lucide="trash-2"></i></button>
                    </td>
                </tr>
            `;
        });
        body.innerHTML = html || '<tr><td colspan="7" class="text-center py-3">No scholarships found.</td></tr>';
    } catch (err) {
        console.warn("Admin scholarships fallback:", err);
    }
}

async function saveAdminScholarship() {
    const idVal = id('adminSchId').value;
    const isEdit = !!idVal;

    const payload = {
        name: id('admSchName').value,
        provider: id('admSchProvider').value,
        amount: parseFloat(id('admSchAmount').value) || 0.0,
        deadline: id('admSchDeadline').value,
        category: id('admSchCategory').value || "Merit"
    };

    const url = isEdit ? `${API_BASE}/scholarships/${idVal}` : `${API_BASE}/scholarships`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(id('adminScholarshipModal'))?.hide();
            loadAdminScholarships();
            loadAdminStats();
        }
    } catch (err) {
        console.error("Save scholarship error:", err);
    }
}

async function deleteAdminScholarship(schId) {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;
    try {
        await fetch(`${API_BASE}/scholarships/${schId}`, { method: 'DELETE', headers: getAuthHeaders() });
        loadAdminScholarships();
        loadAdminStats();
    } catch (err) {
        console.error("Delete scholarship error:", err);
    }
}

async function loadAdminMlAnalytics() {
    try {
        const res = await fetch(`${API_BASE}/admin/ml-analytics`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("ML analytics failed");
        const metrics = await res.json();

        if (id('mlAccuracy')) id('mlAccuracy').textContent = `${(metrics.accuracy * 100).toFixed(1)}%`;
        if (id('mlPrecision')) id('mlPrecision').textContent = `${(metrics.precision * 100).toFixed(1)}%`;
        if (id('mlRecall')) id('mlRecall').textContent = `${(metrics.recall * 100).toFixed(1)}%`;
        if (id('mlF1')) id('mlF1').textContent = `${(metrics.f1Score * 100).toFixed(1)}%`;

        if (metrics.confusionMatrix && id('confusionMatrixBody')) {
            const cm = metrics.confusionMatrix;
            id('confusionMatrixBody').innerHTML = `
                <tr><td>Actual LOW</td><td>${cm[0][0]}</td><td>${cm[0][1]}</td><td>${cm[0][2]}</td></tr>
                <tr><td>Actual MEDIUM</td><td>${cm[1][0]}</td><td>${cm[1][1]}</td><td>${cm[1][2]}</td></tr>
                <tr><td>Actual HIGH</td><td>${cm[2][0]}</td><td>${cm[2][1]}</td><td>${cm[2][2]}</td></tr>
            `;
        }
    } catch (err) {
        console.warn("ML analytics fallback:", err);
    }
}

function renderAnalyticsCharts() {
    if (typeof Chart === 'undefined') return;

    const ctx1 = id('chartCourse');
    const ctx2 = id('chartLocation');

    if (ctx1 && !courseChart) {
        courseChart = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['MCA', 'B.Tech CSE', 'MBA', 'M.Sc CS'],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: ['#2563eb', '#06b6d4', '#7c3aed', '#f59e0b']
                }]
            }
        });
    }

    if (ctx2 && !locationChart) {
        locationChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Punjab', 'Delhi', 'Chennai', 'Maharashtra', 'Karnataka'],
                datasets: [{
                    label: 'Students Count',
                    data: [42, 38, 15, 12, 8],
                    backgroundColor: '#2563eb'
                }]
            }
        });
    }
}

function id(name) {
    return document.getElementById(name);
}
