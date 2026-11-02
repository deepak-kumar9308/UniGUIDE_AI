/**
 * UniGuide AI - Recommendation History JS
 */

document.addEventListener('DOMContentLoaded', () => {
    initHistoryPage();
});

async function initHistoryPage() {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    if (student.id) {
        await loadHistory(student.id);
    } else {
        renderMockHistory();
    }
}

async function loadHistory(studentId) {
    const body = id('recHistoryTableBody');
    if (!body) return;

    try {
        const res = await fetch(`${API_BASE}/recommendations/student/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("History fetch failed");
        const list = await res.json();
        renderHistoryTable(list);
    } catch (err) {
        console.warn("History fetch fallback:", err);
        renderMockHistory();
    }
}

function renderHistoryTable(list) {
    const body = id('recHistoryTableBody');
    if (!body) return;

    if (list.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    No recommendation history logged yet. <a href="recommendations.html">Generate Recommendations</a>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    list.forEach(item => {
        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : 'Recent';
        const matchPct = item.matchPercentage || 85;
        const badgeClass = matchPct >= 85 ? 'badge-match-high' : 'badge-match-medium';

        html += `
            <tr>
                <td class="small text-muted">${escapeHtml(dateStr)}</td>
                <td class="fw-bold text-primary">${escapeHtml(item.recommendedCollege)}</td>
                <td><span class="badge bg-light text-dark border">${escapeHtml(item.recommendedCourse || 'MCA')}</span></td>
                <td><span class="badge ${badgeClass}">${matchPct}%</span></td>
                <td class="small text-muted">${escapeHtml(item.reason || 'Compatibility match based on student preferences.')}</td>
            </tr>
        `;
    });

    body.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

function renderMockHistory() {
    renderHistoryTable([
        {
            createdAt: new Date().toISOString(),
            recommendedCollege: "Delhi Technological University (DTU)",
            recommendedCourse: "MCA",
            matchPercentage: 91,
            reason: "Academic marks exceed cutoff; annual fees within budget limits."
        },
        {
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            recommendedCollege: "Chandigarh University",
            recommendedCourse: "MCA",
            matchPercentage: 88,
            reason: "Preferred location match in Punjab with high placement track record."
        },
        {
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            recommendedCollege: "Panjab University",
            recommendedCourse: "MCA",
            matchPercentage: 82,
            reason: "Affordable fee structure with central university recognition."
        }
    ]);
}

function id(name) {
    return document.getElementById(name);
}
