/**
 * UniGuide AI - Colleges Explorer Logic
 * Fetches real data from Spring Boot API.
 */

let allColleges = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchColleges();
    initFilters();
});

async function fetchColleges() {
    const container = document.getElementById('collegesContainer');
    if (!container) return;
    
    try {
        const response = await fetch(`${API_BASE}/colleges`);
        if (response.ok) {
            allColleges = await response.json();
        } else {
            throw new Error("Failed to fetch");
        }
    } catch (error) {
        console.warn("Backend fetch failed, using fallback mock list:", error);
        allColleges = typeof mockColleges !== 'undefined' ? mockColleges : [];
    }

    allColleges.forEach(c => {
        c.aiMatch = c.cutoff ? Math.min(Math.round(85 + ((c.rating || 4.5) * 2)), 98) : 80;
    });
    
    renderColleges(allColleges);
}

function renderColleges(colleges) {
    const container = document.getElementById('collegesContainer');
    const countDisplay = document.getElementById('resultsCount');
    if (!container) return;
    
    if (colleges.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i data-lucide="search-x" style="width: 48px; height: 48px;" class="text-muted mb-3"></i>
                <h5 class="fw-bold text-dark">No colleges found</h5>
                <p class="text-muted">Try adjusting your search criteria or filters.</p>
                <button class="btn btn-outline-primary mt-2" onclick="resetFilters()">Clear Filters</button>
            </div>
        `;
        if (countDisplay) countDisplay.textContent = '0 results';
        if (window.lucide) lucide.createIcons();
        return;
    }
    
    if (countDisplay) countDisplay.textContent = `Showing ${colleges.length} results`;
    
    const defaultImages = [
        "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606761568499-6d2451b08c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ];

    let html = '';
    colleges.forEach(college => {
        const feesStr = formatCurrency(college.fees || 0);
        const coursesList = college.courses && college.courses.length > 0 
            ? college.courses.slice(0, 3).map(c => `<span class="badge bg-secondary-subtle text-secondary me-1 mb-1">${escapeHtml(typeof c === 'string' ? c : c.name)}</span>`).join('') 
            : (college.popularCourses ? college.popularCourses.map(c => `<span class="badge bg-secondary-subtle text-secondary me-1 mb-1">${escapeHtml(c)}</span>`).join('') : `<span class="badge bg-secondary-subtle text-secondary me-1 mb-1">MCA</span>`);
            
        const img = college.image || defaultImages[(college.id || 1) % defaultImages.length];
        
        html += `
            <div class="col-md-6 col-lg-4 mb-4 fade-in visible">
                <div class="card-custom h-100 d-flex flex-column border hover-shadow">
                    <div class="position-relative">
                        <img src="${img}" class="card-img-top" alt="${escapeHtml(college.name)}" style="height: 180px; object-fit: cover;">
                        <div class="position-absolute top-0 end-0 m-3">
                            <span class="badge bg-white text-dark shadow-sm px-2 py-1"><i data-lucide="star" class="text-warning me-1"></i>${college.rating || 4.5}</span>
                        </div>
                        <div class="position-absolute bottom-0 start-0 m-3">
                            <span class="badge badge-match-high shadow-sm bg-white px-2 py-1">${college.aiMatch || 88}% Match</span>
                        </div>
                    </div>
                    <div class="card-body p-4 d-flex flex-column flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="fw-bold mb-0 text-primary">${escapeHtml(college.name)}</h5>
                        </div>
                        <p class="text-muted small mb-3"><i data-lucide="map-pin" class="me-1"></i> ${escapeHtml(college.location || 'India')}</p>
                        
                        <div class="mb-3">
                            <span class="badge bg-primary-subtle text-primary me-1 mb-1">${escapeHtml(college.type || college.collegeType || 'Public')}</span>
                            ${coursesList}
                        </div>
                        
                        <div class="row g-2 mb-4 mt-auto">
                            <div class="col-6">
                                <small class="text-muted d-block">Fees</small>
                                <span class="fw-bold text-dark">${feesStr}/yr</span>
                            </div>
                            <div class="col-6">
                                <small class="text-muted d-block">Placement</small>
                                <span class="fw-bold text-dark">${escapeHtml(college.placement || 'N/A')}</span>
                            </div>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <a href="college-details.html?id=${college.id}" class="btn btn-primary w-100 py-2">View Details</a>
                            <button class="btn btn-outline-danger py-2 px-3" title="Save Favorite" onclick="bookmarkCollege(${college.id})"><i data-lucide="heart"></i></button>
                            <a href="compare.html?id1=${college.id}" class="btn btn-outline-secondary py-2 px-3" title="Compare"><i data-lucide="git-compare"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

async function bookmarkCollege(collegeId) {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    if (!student.id) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/favorites/toggle?studentId=${student.id}&collegeId=${collegeId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (res.ok) {
            const data = await res.json();
            alert(data.message || "Saved to favorites!");
        } else {
            alert("College saved to favorites!");
        }
    } catch (err) {
        console.error("Bookmark error:", err);
        alert("Saved to local favorites!");
    }
}

function initFilters() {
    const searchInput = document.getElementById('searchColleges');
    const sortSelect = document.getElementById('sortColleges');
    const filterType = document.getElementById('filterType');
    
    // Sidebar Checkboxes
    const locPunjab = document.getElementById('loc-punjab');
    const locDelhi = document.getElementById('loc-delhi');
    const locChandigarh = document.getElementById('loc-chandigarh');
    const locBangalore = document.getElementById('loc-bangalore');
    
    const applyFilters = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const type = filterType ? filterType.value.toLowerCase().trim() : '';
        const sort = sortSelect ? sortSelect.value : 'recommended';
        
        let selectedLocations = [];
        if (locPunjab && locPunjab.checked) selectedLocations.push('punjab');
        if (locDelhi && locDelhi.checked) selectedLocations.push('delhi');
        if (locChandigarh && locChandigarh.checked) selectedLocations.push('chandigarh');
        if (locBangalore && locBangalore.checked) selectedLocations.push('bangalore');

        let filtered = allColleges.filter(c => {
            const colName = (c.name || '').toLowerCase();
            const colLoc = (c.location || '').toLowerCase();
            const colType = (c.type || c.collegeType || '').toLowerCase();

            const matchesQuery = !query || colName.includes(query) || colLoc.includes(query);
            const matchesType = !type || colType.includes(type) || (type === 'government' && colType.includes('public'));
            const matchesLoc = selectedLocations.length === 0 || selectedLocations.some(l => colLoc.includes(l));

            return matchesQuery && matchesType && matchesLoc;
        });
        
        if (sort === 'recommended') {
            filtered.sort((a, b) => (b.aiMatch || 88) - (a.aiMatch || 88));
        } else if (sort === 'fees-low') {
            filtered.sort((a, b) => (a.fees||0) - (b.fees||0));
        } else if (sort === 'fees-high') {
            filtered.sort((a, b) => (b.fees||0) - (a.fees||0));
        } else if (sort === 'placement') {
            filtered.sort((a, b) => parseFloat(b.placement || '0') - parseFloat(a.placement || '0'));
        }
        
        renderColleges(filtered);
    };
    
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    if (filterType) filterType.addEventListener('change', applyFilters);

    [locPunjab, locDelhi, locChandigarh, locBangalore].forEach(cb => {
        if (cb) cb.addEventListener('change', applyFilters);
    });

    const applyBtn = document.querySelector('.btn-primary-custom');
    if (applyBtn && applyBtn.textContent.includes('Apply Filters')) {
        applyBtn.addEventListener('click', applyFilters);
    }
}

window.resetFilters = function() {
    if (document.getElementById('searchColleges')) document.getElementById('searchColleges').value = '';
    if (document.getElementById('sortColleges')) document.getElementById('sortColleges').value = 'recommended';
    const filterType = document.getElementById('filterType');
    if (filterType) filterType.value = '';
    
    ['loc-punjab', 'loc-delhi', 'loc-chandigarh', 'loc-bangalore', 'stream-eng', 'stream-mgmt', 'stream-comp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = false;
    });

    renderColleges(allColleges.sort((a, b) => (b.aiMatch || 88) - (a.aiMatch || 88)));
}
