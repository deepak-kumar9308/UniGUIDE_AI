/**
 * UniGuide AI - Scholarships Logic
 */

let allScholarshipItems = [];

document.addEventListener('DOMContentLoaded', () => {
    initScholarshipsPage();
});

async function initScholarshipsPage() {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    if (student.id) {
        await loadScholarships(student.id);
    } else {
        renderMockScholarships();
    }

    id('scholarshipSearchInput')?.addEventListener('input', applyScholarshipFilters);
    id('scholarshipCategoryFilter')?.addEventListener('change', applyScholarshipFilters);
    id('scholarshipStatusFilter')?.addEventListener('change', applyScholarshipFilters);
    id('clearScholarshipFiltersBtn')?.addEventListener('click', () => {
        if (id('scholarshipSearchInput')) id('scholarshipSearchInput').value = '';
        if (id('scholarshipCategoryFilter')) id('scholarshipCategoryFilter').value = '';
        if (id('scholarshipStatusFilter')) id('scholarshipStatusFilter').value = 'ACTIVE';
        applyScholarshipFilters();
    });
}

async function loadScholarships(studentId) {
    try {
        const res = await fetch(`${API_BASE}/scholarships/match/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Failed to fetch scholarships");
        allScholarshipItems = await res.json();
        applyScholarshipFilters();
    } catch (err) {
        console.warn("Scholarships API fallback:", err);
        renderMockScholarships();
    }
}

function applyScholarshipFilters() {
    const search = (id('scholarshipSearchInput')?.value || '').toLowerCase();
    const category = id('scholarshipCategoryFilter')?.value || '';
    const status = id('scholarshipStatusFilter')?.value || 'ACTIVE';

    const filtered = allScholarshipItems.filter(item => {
        const sch = item.scholarship;
        const matchesSearch = !search || sch.name.toLowerCase().includes(search) || (sch.provider && sch.provider.toLowerCase().includes(search));
        const matchesCategory = !category || sch.category === category;
        const matchesStatus = status === 'ALL' ? true : !item.isExpired;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    renderScholarshipGrid(filtered);
}

function renderScholarshipGrid(items) {
    const container = id('scholarshipGridContainer');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state-card">
                    <h5>No Scholarships Found</h5>
                    <p>Try clearing filters or checking back later for upcoming cycles.</p>
                </div>
            </div>
        `;
        return;
    }

    let html = '';
    items.forEach(item => {
        const sch = item.scholarship;
        const isExp = item.isExpired;
        const matchPct = item.matchPercentage || 85;

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card-custom p-4 h-100 d-flex flex-column justify-content-between border hover-shadow ${isExp ? 'opacity-75 bg-light' : ''}">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            ${isExp ? '<span class="badge badge-expired">EXPIRED</span>' : `<span class="badge bg-success-subtle text-success fw-bold">${matchPct}% Profile Match</span>`}
                            <span class="badge bg-light text-dark border small">${escapeHtml(sch.category || 'General')}</span>
                        </div>
                        <h5 class="fw-bold text-primary mb-1">${escapeHtml(sch.name)}</h5>
                        <p class="small text-muted mb-2"><i data-lucide="building" class="me-1"></i> ${escapeHtml(sch.provider)}</p>

                        <div class="p-3 bg-light rounded-3 mb-3">
                            <small class="d-block text-muted mb-1">Grant Value:</small>
                            <span class="display-6 fw-extrabold text-success fs-4">${formatCurrency(sch.amount)}</span>
                        </div>

                        <p class="small text-muted mb-3">${escapeHtml(sch.description || 'Financial assistance for university degree students.')}</p>

                        <div class="small mb-3">
                            <strong class="d-block text-dark mb-1">Eligibility:</strong>
                            <span class="text-muted">${escapeHtml(sch.eligibility || 'Refer to portal details.')}</span>
                        </div>
                    </div>

                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-3 small">
                            <span class="text-muted">Deadline:</span>
                            <strong class="${isExp ? 'text-danger' : 'text-dark'}">${sch.deadline || 'N/A'}</strong>
                        </div>
                        ${isExp ? `
                            <button class="btn btn-secondary w-100 btn-sm" disabled>Opportunity Expired</button>
                        ` : `
                            <a href="${sch.applicationLink || 'https://scholarships.gov.in/'}" target="_blank" class="btn btn-primary w-100 btn-sm">
                                Apply Now <i data-lucide="external-link" class="ms-1"></i>
                            </a>
                        `}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

function renderMockScholarships() {
    allScholarshipItems = [
        {
            scholarship: {
                id: 1,
                name: "Central Sector Scheme of Scholarships",
                provider: "Ministry of Education",
                description: "Financial assistance for meritorious university students from low-income families.",
                eligibility: "80th percentile in Graduation, Family income < 4.5 LPA",
                amount: 20000,
                deadline: "2025-11-30",
                category: "Merit-cum-Means",
                applicationLink: "https://scholarships.gov.in/"
            },
            matchPercentage: 92,
            isExpired: false
        },
        {
            scholarship: {
                id: 2,
                name: "PM Higher Education Fellowship",
                provider: "Kendriya Sainik Board",
                description: "Higher technical and professional degree support for meritorious candidates.",
                eligibility: "Min 60% in Graduation for technical MCA/B.Tech courses",
                amount: 36000,
                deadline: "2025-10-15",
                category: "Technical",
                applicationLink: "https://ksb.gov.in/"
            },
            matchPercentage: 88,
            isExpired: false
        },
        {
            scholarship: {
                id: 3,
                name: "State Higher Education Grant 2024",
                provider: "State Education Board",
                description: "Expired grant program from previous academic session.",
                eligibility: "Minimum 70% in Graduation",
                amount: 15000,
                deadline: "2024-08-31",
                category: "State Grant",
                applicationLink: "https://education.gov.in/"
            },
            matchPercentage: 75,
            isExpired: true
        }
    ];

    applyScholarshipFilters();
}

function id(name) {
    return document.getElementById(name);
}
