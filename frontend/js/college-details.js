/**
 * UniGuide AI - Dynamic College Details Logic
 * Dynamically loads and renders specific college information by ID.
 */

document.addEventListener('DOMContentLoaded', () => {
    initCollegeDetails();
});

async function initCollegeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const collegeId = parseInt(urlParams.get('id')) || 1;

    try {
        const response = await fetch(`${API_BASE}/colleges/${collegeId}`);
        if (response.ok) {
            const college = await response.json();
            renderCollegeDetails(college);
        } else {
            throw new Error("API call failed");
        }
    } catch (err) {
        console.warn("College details backend fetch failed, using localized dataset:", err);
        const fallback = getFallbackCollege(collegeId);
        renderCollegeDetails(fallback);
    }
}

function renderCollegeDetails(college) {
    if (!college) return;

    // Document Title
    document.title = `${college.name || 'College Details'} - UniGuide AI`;

    // Elements
    const heroImg = document.getElementById('heroCollegeImg');
    const typeBadge = document.getElementById('collegeTypeBadge');
    const ratingBadge = document.getElementById('collegeRatingBadge');
    const nameEl = document.getElementById('collegeName');
    const locationEl = document.getElementById('collegeLocation');
    const scoreEl = document.getElementById('collegeMatchScore');
    const aboutEl = document.getElementById('collegeAboutText');
    const naacEl = document.getElementById('collegeNaacGrade');
    const highestPkgEl = document.getElementById('collegeHighestPackage');
    const facilitiesEl = document.getElementById('collegeCampusFacilities');
    const coursesContainer = document.getElementById('coursesListContainer');
    const placementRateEl = document.getElementById('collegePlacementRate');
    const placementRecruitersEl = document.getElementById('collegePlacementRecruiters');
    const placementAvgEl = document.getElementById('collegePlacementAvg');
    const topRecruitersEl = document.getElementById('collegeTopRecruiters');
    const addressEl = document.getElementById('collegeAddress');
    const phoneEl = document.getElementById('collegePhone');
    const websiteEl = document.getElementById('collegeWebsite');

    const checkChanceBtn = document.getElementById('actionCheckChance');
    const compareBtn = document.getElementById('actionCompare');

    // Default Images per College ID
    const images = [
        "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1606761568499-6d2451b08c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    ];
    const collegeImgUrl = college.image || images[(college.id || 1) % images.length];

    if (heroImg) heroImg.src = collegeImgUrl;
    if (typeBadge) typeBadge.textContent = `${college.collegeType || 'University'}`;
    if (ratingBadge) ratingBadge.innerHTML = `<i data-lucide="star" class="d-inline me-1" style="width:12px;height:12px;fill:#000;"></i> ${college.rating || 4.5} Rating`;
    if (nameEl) nameEl.textContent = college.name;
    if (locationEl) locationEl.innerHTML = `<i data-lucide="map-pin" class="d-inline me-1"></i> ${college.location || 'India'}`;
    
    // AI Match Calculation based on cutoff or rating
    const aiMatchPct = college.cutoff ? Math.min(Math.round(85 + (college.rating || 4.5) * 2), 98) : 88;
    if (scoreEl) scoreEl.textContent = `${aiMatchPct}%`;

    if (aboutEl) aboutEl.textContent = college.description || `${college.name} is a premier educational institution offering cutting-edge academic programs, high placement success rates, and modern campus infrastructure.`;
    if (naacEl) naacEl.textContent = college.naacGrade || (college.rating >= 4.7 ? "A++" : "A+");
    if (highestPkgEl) highestPkgEl.textContent = college.highestPackage || `₹${Math.round((college.rating || 4.5) * 8.5)} LPA`;

    if (facilitiesEl) {
        facilitiesEl.innerHTML = `
            <span class="badge border text-muted px-3 py-2"><i data-lucide="wifi" class="me-1" style="width:14px;"></i> Wi-Fi Campus</span>
            <span class="badge border text-muted px-3 py-2"><i data-lucide="book-open" class="me-1" style="width:14px;"></i> Central Library</span>
            <span class="badge border text-muted px-3 py-2"><i data-lucide="home" class="me-1" style="width:14px;"></i> Hostels</span>
            <span class="badge border text-muted px-3 py-2"><i data-lucide="monitor" class="me-1" style="width:14px;"></i> Advanced Labs</span>
            <span class="badge border text-muted px-3 py-2"><i data-lucide="activity" class="me-1" style="width:14px;"></i> Sports Complex</span>
        `;
    }

    // Courses List
    if (coursesContainer) {
        const courses = college.courses && college.courses.length > 0 ? college.courses : [
            { name: "B.Tech Computer Science Engineering", duration: "4 Years", eligibility: college.eligibility || "10+2 PCM 60%", averageFees: college.fees || 150000 },
            { name: "Master of Computer Applications (MCA)", duration: "2 Years", eligibility: "Graduation (55%) with Math", averageFees: (college.fees ? college.fees * 0.9 : 120000) }
        ];

        let coursesHtml = '<h5 class="fw-bold mb-4">Popular Courses</h5>';
        courses.forEach((c, idx) => {
            const feesFormatted = formatCurrency(c.averageFees || college.fees || 150000);
            coursesHtml += `
                <div class="border rounded-3 p-3 ${idx < courses.length - 1 ? 'mb-3' : ''} hover-shadow transition-fast">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="fw-bold text-primary mb-0">${escapeHtml(c.name)}</h6>
                        ${idx === 0 ? '<span class="badge bg-success-subtle text-success">Most Popular</span>' : ''}
                    </div>
                    <p class="text-muted small mb-3">Duration: ${escapeHtml(c.duration || 'Full Time')} | Cutoff: <strong>${college.cutoff || 75}%</strong></p>
                    <div class="row g-2 align-items-center">
                        <div class="col-sm-4">
                            <small class="text-muted d-block">Annual Fees</small>
                            <span class="fw-bold text-dark">${feesFormatted}</span>
                        </div>
                        <div class="col-sm-5">
                            <small class="text-muted d-block">Eligibility</small>
                            <span class="fw-bold text-dark small">${escapeHtml(c.eligibility || college.eligibility || 'Graduation with 50%')}</span>
                        </div>
                        <div class="col-sm-3 text-sm-end">
                            <a href="prediction.html?collegeId=${college.id}" class="btn btn-sm btn-outline-custom">Check Chance</a>
                        </div>
                    </div>
                </div>
            `;
        });
        coursesContainer.innerHTML = coursesHtml;
    }

    // Placement Stats
    if (placementRateEl) placementRateEl.textContent = college.placementRate || "95%";
    if (placementRecruitersEl) placementRecruitersEl.textContent = college.recruiters || "500+";
    if (placementAvgEl) placementAvgEl.textContent = college.placementAvg || `₹${Math.round((college.fees || 150000) / 15000)}L`;

    if (topRecruitersEl) {
        topRecruitersEl.innerHTML = `
            <span class="badge border bg-white text-dark px-3 py-2 fw-medium">Microsoft</span>
            <span class="badge border bg-white text-dark px-3 py-2 fw-medium">Google</span>
            <span class="badge border bg-white text-dark px-3 py-2 fw-medium">Amazon</span>
            <span class="badge border bg-white text-dark px-3 py-2 fw-medium">TCS</span>
            <span class="badge border bg-white text-dark px-3 py-2 fw-medium">Infosys</span>
            <span class="badge border bg-white text-dark px-3 py-2 fw-medium">Wipro</span>
        `;
    }

    // Contact Details & Links
    if (addressEl) addressEl.textContent = `${college.name}, ${college.location || 'India'}`;
    if (phoneEl) phoneEl.textContent = college.phone || "+91 1800 120 4000";
    if (websiteEl) {
        const url = college.website || `https://${college.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu.in`;
        websiteEl.href = url;
        websiteEl.textContent = url.replace(/^https?:\/\//, '');
    }

    // Actions
    if (checkChanceBtn) {
        checkChanceBtn.onclick = () => {
            window.location.href = `prediction.html?collegeId=${college.id}`;
        };
    }

    if (compareBtn) {
        compareBtn.onclick = () => {
            window.location.href = `compare.html?id1=${college.id}`;
        };
    }

    if (window.lucide) lucide.createIcons();
}

function getFallbackCollege(id) {
    if (typeof mockColleges !== 'undefined' && mockColleges.length > 0) {
        const found = mockColleges.find(c => c.id === id);
        if (found) return found;
    }
    return {
        id: id,
        name: "Premier Technical Institute",
        location: "India",
        type: "Public",
        collegeType: "Public",
        rating: 4.6,
        fees: 150000,
        cutoff: 75.0,
        eligibility: "Graduation with 50% marks",
        placement: "95% Placement Rate",
        website: "https://uniguide.edu.in",
        description: "Leading educational institution with top NIRF rankings and outstanding placement opportunities."
    };
}
