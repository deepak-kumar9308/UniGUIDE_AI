/**
 * UniGuide AI - College Comparison JS
 */

let availableCollegesList = [];

document.addEventListener('DOMContentLoaded', () => {
    initComparePage();
});

async function initComparePage() {
    await fetchColleges();
    populateSelectBoxes();

    id('compareCollege1')?.addEventListener('change', renderComparison);
    id('compareCollege2')?.addEventListener('change', renderComparison);
    id('compareCollege3')?.addEventListener('change', renderComparison);

    renderComparison();
}

async function fetchColleges() {
    try {
        const res = await fetch(`${API_BASE}/colleges`);
        if (!res.ok) throw new Error("Failed to fetch colleges");
        availableCollegesList = await res.json();
    } catch (err) {
        console.warn("Colleges fetch fallback:", err);
        availableCollegesList = typeof mockColleges !== 'undefined' ? mockColleges : [];
    }
}

function populateSelectBoxes() {
    const sel1 = id('compareCollege1');
    const sel2 = id('compareCollege2');
    const sel3 = id('compareCollege3');

    if (!sel1 || !sel2 || !sel3) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paramId1 = parseInt(urlParams.get('id1')) || (availableCollegesList[0]?.id || 1);
    const paramId2 = parseInt(urlParams.get('id2')) || (availableCollegesList.find(c => c.id !== paramId1)?.id || 2);
    const paramId3 = parseInt(urlParams.get('id3')) || null;

    let options1 = '';
    let options2 = '';
    let options3 = '<option value="">-- None --</option>';

    availableCollegesList.forEach((c) => {
        options1 += `<option value="${c.id}" ${c.id === paramId1 ? 'selected' : ''}>${escapeHtml(c.name)}</option>`;
        options2 += `<option value="${c.id}" ${c.id === paramId2 ? 'selected' : ''}>${escapeHtml(c.name)}</option>`;
        options3 += `<option value="${c.id}" ${c.id === paramId3 ? 'selected' : ''}>${escapeHtml(c.name)}</option>`;
    });

    sel1.innerHTML = options1;
    sel2.innerHTML = options2;
    sel3.innerHTML = options3;
}

function renderComparison() {
    const id1 = parseInt(id('compareCollege1')?.value);
    const id2 = parseInt(id('compareCollege2')?.value);
    const id3 = parseInt(id('compareCollege3')?.value);

    const selected = [];
    if (id1) { const c1 = availableCollegesList.find(c => c.id === id1); if (c1) selected.push(c1); }
    if (id2) { const c2 = availableCollegesList.find(c => c.id === id2); if (c2) selected.push(c2); }
    if (id3) { const c3 = availableCollegesList.find(c => c.id === id3); if (c3) selected.push(c3); }

    if (selected.length < 2) return;

    // Highlights detection
    let minFees = Math.min(...selected.map(c => c.fees || 999999));
    let minCutoff = Math.min(...selected.map(c => c.cutoff || 100));
    let maxRating = Math.max(...selected.map(c => c.rating || 0));

    // Render Table
    const header = id('compareTableHeader');
    const body = id('compareTableBody');
    const mobileContainer = id('mobileCompareContainer');

    if (header) {
        header.innerHTML = `
            <th style="width: 20%;">Metric / Feature</th>
            ${selected.map(c => `<th class="text-center" style="width: ${80 / selected.length}%;">${escapeHtml(c.name)}</th>`).join('')}
        `;
    }

    const metrics = [
        { label: "Location", key: 'location' },
        { label: "Type", key: 'collegeType' },
        {
            label: "Annual Fees",
            render: c => {
                const isBest = c.fees === minFees;
                return `<strong>${formatCurrency(c.fees)}</strong> ${isBest ? '<span class="badge bg-success ms-1">Best Fees</span>' : ''}`;
            }
        },
        {
            label: "Cutoff Threshold",
            render: c => {
                const isLowest = c.cutoff === minCutoff;
                return `<strong>${c.cutoff}%</strong> ${isLowest ? '<span class="badge bg-info ms-1">Lowest Cutoff</span>' : ''}`;
            }
        },
        { label: "Placement Record", key: 'placement' },
        {
            label: "Rating",
            render: c => {
                const isTop = c.rating === maxRating;
                return `<strong>⭐ ${c.rating || 4.5} / 5.0</strong> ${isTop ? '<span class="badge bg-warning text-dark ms-1">Top Rated</span>' : ''}`;
            }
        },
        { label: "Eligibility", key: 'eligibility' }
    ];

    if (body) {
        body.innerHTML = metrics.map(m => `
            <tr>
                <td class="fw-bold bg-light">${m.label}</td>
                ${selected.map(c => `
                    <td class="text-center">${m.render ? m.render(c) : escapeHtml(c[m.key] || 'N/A')}</td>
                `).join('')}
            </tr>
        `).join('');
    }

    // Render Mobile Cards
    if (mobileContainer) {
        let mobileHtml = '';
        selected.forEach(c => {
            mobileHtml += `
                <div class="card-custom p-4 border">
                    <h5 class="fw-bold text-primary mb-2">${escapeHtml(c.name)}</h5>
                    <p class="small text-muted mb-3"><i data-lucide="map-pin" class="me-1"></i> ${escapeHtml(c.location)} • ${escapeHtml(c.collegeType)}</p>
                    <ul class="list-group list-group-flush mb-3 small">
                        <li class="list-group-item d-flex justify-content-between px-0">
                            <span class="text-muted">Annual Fees:</span>
                            <strong>${formatCurrency(c.fees)} ${c.fees === minFees ? '🏆 Best' : ''}</strong>
                        </li>
                        <li class="list-group-item d-flex justify-content-between px-0">
                            <span class="text-muted">Cutoff:</span>
                            <strong>${c.cutoff}% ${c.cutoff === minCutoff ? '🎯 Accessible' : ''}</strong>
                        </li>
                        <li class="list-group-item d-flex justify-content-between px-0">
                            <span class="text-muted">Placement:</span>
                            <strong>${escapeHtml(c.placement)}</strong>
                        </li>
                        <li class="list-group-item d-flex justify-content-between px-0">
                            <span class="text-muted">Rating:</span>
                            <strong>⭐ ${c.rating} / 5.0</strong>
                        </li>
                    </ul>
                    <a href="college-details.html?id=${c.id}" class="btn btn-outline-primary btn-sm w-100">View Full Details</a>
                </div>
            `;
        });
        mobileContainer.innerHTML = mobileHtml;
    }

    if (window.lucide) lucide.createIcons();
}

function id(name) {
    return document.getElementById(name);
}
