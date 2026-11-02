/**
 * UniGuide AI - Admission Chance Prediction JS
 */

document.addEventListener('DOMContentLoaded', () => {
    initPredictionPage();
});

function initPredictionPage() {
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    if (student.marks) id('predMarks').value = student.marks;
    if (student.entranceScore) id('predEntrance').value = student.entranceScore;
    if (student.preferredCourse) id('predCourse').value = student.preferredCourse;
    if (student.budget) id('predBudget').value = student.budget;

    // URL Query params handling
    const urlParams = new URLSearchParams(window.location.search);
    const collegeId = parseInt(urlParams.get('collegeId'));
    if (collegeId && typeof mockColleges !== 'undefined') {
        const col = mockColleges.find(c => c.id === collegeId);
        if (col) {
            if (id('predCollege')) id('predCollege').value = col.name;
            if (id('predCutoff')) id('predCutoff').value = parseFloat(col.cutoff) || 80.0;
        }
    }

    const form = id('predictionForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await runAdmissionPrediction();
        });
    }
}

async function runAdmissionPrediction() {
    const marks = parseFloat(id('predMarks').value) || 75.0;
    const entrance = parseFloat(id('predEntrance').value) || 70.0;
    const budget = parseFloat(id('predBudget').value) || 200000.0;
    const cutoff = parseFloat(id('predCutoff').value) || 80.0;

    const btn = id('predictBtn');
    if (btn) btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Predicting...';
    if (window.lucide) lucide.createIcons();

    try {
        const res = await fetch(`${API_BASE}/ai/predict?marks=${marks}&entranceScore=${entrance}&budget=${budget}&cutoff=${cutoff}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Prediction API failed");
        const data = await res.json();
        renderPredictionResult(data);
    } catch (err) {
        console.warn("Prediction API fallback:", err);
        // Fallback calculations
        const score = (marks * 0.4) + (entrance * 0.4);
        const diff = score - (cutoff * 0.8);

        let chance = 'MEDIUM';
        let prob = 65.0;
        if (diff >= 10) { chance = 'HIGH'; prob = 87.0; }
        else if (diff < -5) { chance = 'LOW'; prob = 34.0; }

        renderPredictionResult({
            chance: chance,
            probability: prob,
            reason: marks >= cutoff ? "Your academic marks exceed historical cutoff range." : "Marks are close to cutoff range. Strong entrance scorecard increases chances.",
            improvements: [
                "Apply before the early bird deadline.",
                "Verify required document transcripts.",
                "Consider alternative courses or back-up institutes."
            ]
        });
    } finally {
        if (btn) btn.innerHTML = '<i data-lucide="trending-up" class="me-1"></i> Predict My Admission Chance';
        if (window.lucide) lucide.createIcons();
    }
}

function renderPredictionResult(data) {
    const probEl = id('resultProbability');
    const badgeEl = id('resultChanceBadge');
    const reasonEl = id('resultReason');
    const improveEl = id('resultImprovements');

    if (probEl) probEl.textContent = `${data.probability || 87}%`;
    
    if (badgeEl) {
        const chance = data.chance || 'HIGH';
        badgeEl.textContent = chance;
        if (chance === 'HIGH') badgeEl.className = 'badge badge-match-high px-3 py-1 fs-6';
        else if (chance === 'MEDIUM') badgeEl.className = 'badge badge-match-medium px-3 py-1 fs-6';
        else badgeEl.className = 'badge badge-match-low px-3 py-1 fs-6';
    }

    if (reasonEl) reasonEl.textContent = data.reason || 'Your profile aligns well with institution entrance standards.';

    if (improveEl) {
        const items = data.improvements || ["Apply before deadline", "Check document requirements"];
        improveEl.innerHTML = items.map(item => `<li class="text-muted"><i data-lucide="check" class="me-1 text-success"></i> ${escapeHtml(item)}</li>`).join('');
    }

    if (window.lucide) lucide.createIcons();
}

function id(name) {
    return document.getElementById(name);
}
