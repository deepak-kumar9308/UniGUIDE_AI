/**
 * UniGuide AI - AI Chatbot Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initChatPage();
});

function initChatPage() {
    const form = id('chatForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            sendChatMessage();
        });
    }

    id('newChatBtn')?.addEventListener('click', () => {
        const area = id('chatMessagesArea');
        if (area) {
            area.innerHTML = `
                <div class="d-flex align-items-start gap-2 max-w-700">
                    <div class="card-icon bg-primary text-white p-2 rounded-circle" style="min-width: 36px; width: 36px; height: 36px;"><i data-lucide="bot" style="width: 18px; height: 18px;"></i></div>
                    <div class="chat-bubble-ai p-3 shadow-sm">
                        Hello! I am your UniGuide AI Admission Assistant 👋. Ask me questions about target colleges, required documents, cutoffs, or career paths!
                    </div>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
        }
    });
}

function useSuggestedPrompt(text) {
    const input = id('chatInput');
    if (input) {
        input.value = text;
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = id('chatInput');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    input.value = '';

    appendUserMessage(message);
    showTypingIndicator(true);

    const student = JSON.parse(localStorage.getItem('student') || '{}');

    try {
        const res = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                message: message,
                studentId: student.id || null
            })
        });

        if (!res.ok) throw new Error("Chat request failed");
        const data = await res.json();
        appendAiMessage(data.reply || "I am glad to help. Please let me know if you need college recommendations or document checklists!");
    } catch (err) {
        console.warn("Chat API fallback:", err);
        appendAiMessage(getMockChatResponse(message));
    } finally {
        showTypingIndicator(false);
    }
}

function appendUserMessage(msg) {
    const area = id('chatMessagesArea');
    if (!area) return;

    const div = document.createElement('div');
    div.className = 'd-flex justify-content-end mb-2';
    div.innerHTML = `
        <div class="chat-bubble-user p-3 shadow-sm max-w-700">
            ${escapeHtml(msg)}
        </div>
    `;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
}

function appendAiMessage(msg) {
    const area = id('chatMessagesArea');
    if (!area) return;

    const div = document.createElement('div');
    div.className = 'd-flex align-items-start gap-2 mb-2 max-w-700';
    div.innerHTML = `
        <div class="card-icon bg-primary text-white p-2 rounded-circle" style="min-width: 36px; width: 36px; height: 36px;"><i data-lucide="bot" style="width: 18px; height: 18px;"></i></div>
        <div class="chat-bubble-ai p-3 shadow-sm">
            ${escapeHtml(msg)}
        </div>
    `;
    area.appendChild(div);
    area.scrollTop = area.scrollHeight;
    if (window.lucide) lucide.createIcons();
}

function showTypingIndicator(show) {
    const indicator = id('typingIndicator');
    if (indicator) {
        if (show) indicator.classList.remove('d-none');
        else indicator.classList.add('d-none');
    }
}

function getMockChatResponse(msg) {
    const lower = msg.toLowerCase();
    if (lower.contains("match") || lower.contains("profile") || lower.contains("college")) {
        return "Based on your academic profile, recommended colleges include Delhi Technological University, Chandigarh University, and Panjab University. Check out our AI Recommendations page for full weighted compatibility breakdowns!";
    } else if (lower.contains("document") || lower.contains("require")) {
        return "Standard documents for MCA admission usually include: 1. Marksheets (10th, 12th & Graduation), 2. Entrance Scorecard (NIMCET/State CET), 3. Govt Photo ID, 4. Migration & Transfer Certificate. Always verify specific document lists on the official college website.";
    } else if (lower.contains("scholarship")) {
        return "You can apply for the Central Sector Scheme of Scholarships (up to ₹20,000) or PM Higher Education Fellowships. Check our Scholarship Finder tool for full eligibility rules.";
    } else {
        return "Master of Computer Applications (MCA) provides advanced training in software engineering, database management, and cloud architecture. Make sure to track your application deadlines in the Application Tracker module.";
    }
}

function id(name) {
    return document.getElementById(name);
}
