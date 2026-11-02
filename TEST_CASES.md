# UniGuide AI — Complete Test Cases Matrix

| Test ID | Feature / Module | Test Input / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-001** | Student Registration | Register with valid name, email, password, course & location. | Account created, JWT token issued, redirected to `dashboard.html`. | Account created, JWT stored, redirected. | PASS |
| **TC-002** | Student Registration | Register with invalid email format (missing `@`). | Validation error message displayed, registration blocked. | Error message displayed, submit prevented. | PASS |
| **TC-003** | Student Authentication | Login with valid credentials (`demo@uniguide.com` / `Password@123`). | JWT token returned, user details stored in `localStorage`. | JWT token returned, user logged in. | PASS |
| **TC-004** | Profile Completion | Compute completion percentage with 4/6 profile fields filled. | Completion percentage = ~67%, missing fields list returned. | Percentage = 67%, missing fields highlighted. | PASS |
| **TC-005** | College Explorer | Search by keyword `"MCA"`. | List of colleges offering MCA returned. | Colleges matching MCA displayed. | PASS |
| **TC-006** | College Filters | Filter by type `"Public"` and location `"Delhi"`. | Only public colleges in Delhi rendered. | DTU returned in result list. | PASS |
| **TC-007** | AI Recommendation Engine | Execute recommendation algorithm for student (Marks: 82%, Budget: 200k). | Top weighted colleges returned (30% Acad, 25% Course, 15% Budget, 10% Loc, 10% Career, 10% Adm). | Colleges sorted by match % returned. | PASS |
| **TC-008** | Recommendation Explanation | Generate recommendation breakdown for DTU. | Explanation reasons, strengths, considerations returned. | Detailed breakdown items displayed. | PASS |
| **TC-009** | Recommendation History | Query `/api/recommendations/student/{id}` after generation. | Saved recommendation records returned from MySQL. | Historical records retrieved from MySQL. | PASS |
| **TC-010** | Admission Chance Prediction | Input Marks=85, Entrance=80, Cutoff=80. | Probability gauge = HIGH (87%), breakdown reason & disclaimer shown. | HIGH (87%) returned with disclaimer. | PASS |
| **TC-011** | ML Model Analytics | Fetch `/api/admin/ml-analytics`. | Real test dataset metrics returned (Accuracy=92%, Precision=90%, Recall=88%, F1=89%, 3x3 confusion matrix). | Metrics & 3x3 confusion matrix loaded. | PASS |
| **TC-012** | Scholarship Discovery | Search scholarship by keyword `"Merit"`. | Matching scholarships returned with match percentage. | Merit scholarships returned. | PASS |
| **TC-013** | Expired Scholarship Handling | Query scholarship list containing past deadline (`2024-08-31`). | Scholarship marked `EXPIRED`, apply button disabled. | Labeled EXPIRED, apply disabled. | PASS |
| **TC-014** | Document Guidance | View document checklist and click "Toggle Status". | Document status cycles through Not Added -> Uploaded -> Verified. | Status badge updated interactively. | PASS |
| **TC-015** | AI Chatbot Context | Send prompt: "What colleges match my profile?" with logged-in student context. | Chatbot utilizes student's course (MCA) and marks (82%) in response. | Contextual college advice returned. | PASS |
| **TC-016** | Saved Colleges | Click bookmark button on college card. | Entry saved to `favorites` table in MySQL. | Saved to database and shown in dashboard. | PASS |
| **TC-017** | Application Tracker | Add new application ("Chandigarh University", status "Applied"). | Saved to `applications` table, timeline updated. | Application saved and displayed. | PASS |
| **TC-018** | Side-by-Side Comparison | Select 2 colleges in `compare.html`. | Matrix rendered highlighting Best Fees, Lowest Cutoff, and Top Rated. | Side-by-side table rendered with badges. | PASS |
| **TC-019** | Admin Access Control | Access `/api/admin/stats` as student user. | Access denied with HTTP 403 Forbidden. | 403 Forbidden enforced by Spring Security. | PASS |
| **TC-020** | Admin Management | Log in as admin (`admin@uniguide.com`), add new college. | New college saved to MySQL and visible in explorer. | College created and displayed in list. | PASS |
