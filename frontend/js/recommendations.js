/**
 * UniGuide AI - Recommendations Logic
 * Interacts with /api/recommendations/generate/{studentId} and renders AI explanations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initRecommendationsPage();
});

async function initRecommendationsPage() {
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (student.marks) id('recMarks').value = student.marks;
    if (student.preferredCourse) id('recCourse').value = student.preferredCourse;
    if (student.preferredLocation) id('recLocation').value = student.preferredLocation;
    if (student.budget) id('recBudget').value = student.budget;

    if (student.id) {
        await loadRecommendations(student.id);
    } else {
        renderMockRecommendations();
    }

    const form = id('recommendationFilterForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (student.id) {
                await loadRecommendations(student.id);
            }
        });
    }
}

async function loadRecommendations(studentId) {
    const container = id('recommendationsListContainer');
    const btn = id('generateRecBtn');

    if (btn) btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Generating...';
    if (window.lucide) lucide.createIcons();

    try {
        const res = await fetch(`${API_BASE}/recommendations/generate/${studentId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Recommendation generation failed");
        const data = await res.json();
        renderRecommendations(data.recommendations || []);
    } catch (err) {
        console.warn("Recommendation API fallback:", err);
        renderMockRecommendations();
    } finally {
        if (btn) btn.innerHTML = '<i data-lucide="sparkles" class="me-1"></i> Generate AI Recommendations';
        if (window.lucide) lucide.createIcons();
    }
}

function renderRecommendations(list) {
    const container = id('recommendationsListContainer');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="empty-state-card">
                <h5>No Colleges Matched</h5>
                <p>Try broadening your location or budget preferences to discover more institutions.</p>
            </div>
        `;
        return;
    }

    let html = '<div class="d-flex flex-column gap-4">';
    list.forEach(item => {
        const matchPct = item.matchPercentage || 85;
        const badgeClass = matchPct >= 85 ? 'badge-match-high' : (matchPct >= 70 ? 'badge-match-medium' : 'badge-match-low');
        const category = item.category || (matchPct >= 85 ? 'Excellent Match' : 'Good Match');

        const strengthsHtml = (item.strengths || []).map(s => `<li class="text-success small mb-1"><i data-lucide="check-circle-2" class="me-1"></i> ${escapeHtml(s)}</li>`).join('');
        const considerationsHtml = (item.considerations || []).map(c => `<li class="text-warning small mb-1"><i data-lucide="alert-triangle" class="me-1"></i> ${escapeHtml(c)}</li>`).join('');

        html += `
            <div class="card-custom p-4 hover-shadow border">
                <div class="row g-4 align-items-center">
                    <div class="col-lg-8">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge ${badgeClass} fs-6">${matchPct}% Match</span>
                            <span class="badge bg-primary-subtle text-primary fw-bold">${escapeHtml(category)}</span>
                            <span class="badge bg-light text-dark border">${escapeHtml(item.courseName || 'MCA')}</span>
                        </div>
                        <h4 class="fw-bold text-primary mb-1">${escapeHtml(item.collegeName)}</h4>
                        <p class="text-muted small mb-3"><i data-lucide="map-pin" class="me-1"></i> ${escapeHtml(item.location || 'India')} • Fees: <strong>${formatCurrency(item.fees)}</strong> / yr</p>
                        
                        <div class="p-3 bg-light rounded-3 mb-3">
                            <strong class="d-block text-dark small mb-1">Why this college?</strong>
                            <p class="small text-muted mb-0">${escapeHtml(item.reason || 'Strong academic and fee structure alignment with your targets.')}</p>
                        </div>

                        <div class="row g-2">
                            <div class="col-md-6">
                                <strong class="d-block small fw-bold text-success mb-1">Strengths:</strong>
                                <ul class="list-unstyled mb-0">${strengthsHtml || '<li class="small text-muted">Course and budget match</li>'}</ul>
                            </div>
                            <div class="col-md-6">
                                <strong class="d-block small fw-bold text-warning mb-1">Considerations:</strong>
                                <ul class="list-unstyled mb-0">${considerationsHtml || '<li class="small text-muted">Verify latest registration deadline</li>'}</ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 text-lg-end border-start-lg pt-3 pt-lg-0">
                        <div class="d-flex flex-column gap-2 justify-content-center h-100">
                            <a href="college-details.html?id=${item.collegeId || 1}" class="btn btn-primary">
                                View College Details
                            </a>
                            <a href="compare.html?id1=${item.collegeId || 1}" class="btn btn-outline-secondary">
                                Compare College
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

function renderMockRecommendations() {
    renderRecommendations([
        {
            collegeId: 1,
            collegeName: "Delhi Technological University (DTU)",
            courseName: "MCA",
            matchPercentage: 91,
            category: "Excellent Match",
            reason: "Your academic score (82.5%) exceeds the historical cutoff and fees (₹85,000) perfectly fit your budget.",
            fees: 85000,
            location: "Delhi",
            strengths: ["Academic marks above cutoff threshold", "Annual fees within budget", "Top NIRF Computing Ranking"],
            considerations: ["High entrance scorecard requirement", "Competitive admission seat quota"]
        },
        {
            collegeId: 2,
            collegeName: "Chandigarh University",
            courseName: "MCA",
            matchPercentage: 88,
            category: "Excellent Match",
            reason: "Matches your preferred location (Punjab) and offers dedicated MCA specialization in AI/ML.",
            fees: 150000,
            location: "Punjab",
            strengths: ["Direct preferred location match", "95% placement rate record", "State-of-the-art software lab"],
            considerations: ["Check early registration scholarship deadlines"]
        },
        {
            collegeId: 3,
            collegeName: "Panjab University",
            courseName: "MCA",
            matchPercentage: 82,
            category: "Good Match",
            reason: "Highly affordable fee structure (₹45,000/yr) with historic academic reputation.",
            fees: 45000,
            location: "Punjab",
            strengths: ["Extremely budget-friendly", "Central university accreditation", "Location match"],
            considerations: ["Entrance CET exam required"]
        }
    ]);
}

function id(name) {
    return document.getElementById(name);
}
