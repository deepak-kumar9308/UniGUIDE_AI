/**
 * UniGuide AI - Document Guidance Module JS
 */

const defaultDocuments = [
    {
        id: 1,
        name: "Academic Marksheets (10th, 12th & Graduation)",
        required: "Required",
        description: "Original and attested copies of 10th standard, 12th Board, and Bachelor's degree (BCA/B.Sc) semester marksheets.",
        status: "Verified"
    },
    {
        id: 2,
        name: "Entrance Exam Scorecard",
        required: "Required",
        description: "Official scorecard for NIMCET, State CET, or university-specific entrance examination.",
        status: "Uploaded"
    },
    {
        id: 3,
        name: "Government Identity Proof",
        required: "Required",
        description: "Aadhaar Card, Passport, Voter ID, or Driving License for identity verification.",
        status: "Verified"
    },
    {
        id: 4,
        name: "Passport Size Photographs",
        required: "Required",
        description: "6 Recent passport-size photographs matching application form upload.",
        status: "Uploaded"
    },
    {
        id: 5,
        name: "Transfer Certificate (TC)",
        required: "Required",
        description: "TC issued by last attended college/institution.",
        status: "Not Added"
    },
    {
        id: 6,
        name: "Migration Certificate",
        required: "Required (If changing board/university)",
        description: "Issued by previous university for inter-university registration.",
        status: "Not Added"
    },
    {
        id: 7,
        name: "Category Certificate (OBC / SC / ST / EWS)",
        required: "Optional (For quota reservation)",
        description: "Valid competent authority caste/category certificate in central/state prescribed format.",
        status: "Not Added"
    },
    {
        id: 8,
        name: "Income Certificate",
        required: "Optional (For Fee concessions & Scholarships)",
        description: "Recent annual family income proof issued by Tehsildar/Revenue officer.",
        status: "Uploaded"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initDocumentsPage();
});

function initDocumentsPage() {
    renderDocumentsList();

    const openBtn = id('openDocAiBtn');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const modalEl = id('docAiModal');
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        });
    }

    const askBtn = id('askDocAiBtn');
    if (askBtn) {
        askBtn.addEventListener('click', handleDocAiQuestion);
    }
}

function renderDocumentsList() {
    const container = id('documentsListGrid');
    if (!container) return;

    let html = '';
    defaultDocuments.forEach(doc => {
        let statusBadge = '';
        if (doc.status === 'Verified') {
            statusBadge = '<span class="badge bg-success-subtle text-success px-3 py-1 fs-6"><i data-lucide="check-circle" class="me-1"></i> Verified</span>';
        } else if (doc.status === 'Uploaded') {
            statusBadge = '<span class="badge bg-primary-subtle text-primary px-3 py-1 fs-6"><i data-lucide="upload" class="me-1"></i> Uploaded</span>';
        } else {
            statusBadge = '<span class="badge bg-secondary-subtle text-secondary px-3 py-1 fs-6"><i data-lucide="clock" class="me-1"></i> Not Added</span>';
        }

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card-custom p-4 h-100 d-flex flex-column justify-content-between border hover-shadow">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            ${statusBadge}
                            <span class="badge bg-light text-dark border small">${escapeHtml(doc.required)}</span>
                        </div>
                        <h5 class="fw-bold text-primary mb-2">${escapeHtml(doc.name)}</h5>
                        <p class="small text-muted mb-3">${escapeHtml(doc.description)}</p>
                    </div>

                    <div class="pt-3 border-top d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary w-100" onclick="toggleDocStatus(${doc.id})">
                            <i data-lucide="refresh-cw" class="me-1"></i> Toggle Status
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

function toggleDocStatus(docId) {
    const doc = defaultDocuments.find(d => d.id === docId);
    if (doc) {
        if (doc.status === 'Not Added') doc.status = 'Uploaded';
        else if (doc.status === 'Uploaded') doc.status = 'Verified';
        else doc.status = 'Not Added';
        renderDocumentsList();
    }
}

async function handleDocAiQuestion() {
    const customQ = id('customDocQuestion')?.value.trim();
    const selectQ = id('docQuestionSelect')?.value;
    const question = customQ || selectQ || "Which documents are usually required for MCA admission?";

    const answerBox = id('docAiAnswerBox');
    const askBtn = id('askDocAiBtn');

    if (askBtn) askBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Asking AI...';
    if (window.lucide) lucide.createIcons();

    const student = JSON.parse(localStorage.getItem('student') || '{}');

    try {
        const res = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                message: question,
                studentId: student.id || null
            })
        });

        if (!res.ok) throw new Error("AI Chat request failed");
        const data = await res.json();

        if (answerBox) {
            answerBox.innerHTML = `
                <div class="small mb-2"><strong>Q: ${escapeHtml(question)}</strong></div>
                <div class="small text-dark p-2 bg-white rounded border">${escapeHtml(data.reply || 'Standard documents include marksheets, entrance scorecard, ID proof, and photo.')}</div>
                <small class="text-muted style-italic mt-2 d-block">* Document requirements vary by institution. Please verify requirements on the official college website.</small>
            `;
        }
    } catch (err) {
        console.warn("Doc AI fallback:", err);
        if (answerBox) {
            answerBox.innerHTML = `
                <div class="small mb-2"><strong>Q: ${escapeHtml(question)}</strong></div>
                <div class="small text-dark p-2 bg-white rounded border">
                    Standard documents for MCA admission usually include: 1. Bachelor marksheets (BCA/B.Sc), 2. NIMCET/CET Scorecard, 3. Government Photo ID, 4. Passport photographs, 5. Transfer Certificate, and 6. Migration Certificate.
                </div>
                <small class="text-muted style-italic mt-2 d-block">* Document requirements vary by institution. Please verify requirements on the official college website.</small>
            `;
        }
    } finally {
        if (askBtn) askBtn.innerHTML = 'Get AI Guidance';
        if (window.lucide) lucide.createIcons();
    }
}

function id(name) {
    return document.getElementById(name);
}
