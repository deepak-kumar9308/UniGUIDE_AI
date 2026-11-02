# UNIGUIDE AI — MASTER PROJECT DOCUMENTATION & VIVA REFERENCE GUIDE

---

## 1. PROJECT VISION & OVERVIEW

**UniGuide AI** is an end-to-end, AI-powered EdTech college admission counseling platform designed for undergraduate and postgraduate (MCA / B.Tech / MBA) students. It guides students through the complete admission decision journey:

```
Student Registration
   ↓
Complete Profile (Marks, Entrance Score, Target Course, Location, Budget, Career)
   ↓
Explore Colleges & Courses
   ↓
AI College Recommendation (6-Factor Weighted Compatibility Engine)
   ↓
Admission Chance Prediction (ML Probability Model)
   ↓
Scholarship Discovery (Active & EXPIRED status tags)
   ↓
Side-by-Side College Comparison
   ↓
Document Guidance Checklist & AI Document Counselor
   ↓
24/7 Context-Aware AI Chatbot (Google Gemini API)
   ↓
Personalized Student & Admin Analytics Dashboards
```

---

## 2. SYSTEM ARCHITECTURE & DIAGRAMS

### 2.1 System Architecture Diagram

```
                 ┌─────────────────────┐
                 │      STUDENT        │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │  HTML5 / CSS3 / JS  │
                 │  Bootstrap 5 / UI   │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │    SPRING BOOT      │
                 │     REST API        │
                 └──────┬───────┬──────┘
                        │       │
              ┌─────────┘       └─────────┐
              ↓                           ↓
       ┌──────────────┐           ┌──────────────┐
       │    MySQL     │           │ Python AI/ML │
       │   Database   │           │   Service    │
       └──────────────┘           └──────┬───────┘
                                         ↓
                                  ┌──────────────┐
                                  │ Scikit-learn │
                                  └──────────────┘

                        Spring Boot
                             |
                             ↓
                       Gemini API
                             |
                             ↓
                       AI Chatbot
```

### 2.2 Level-1 Data Flow Diagram (DFD)

```
Student / Admin
   │
   ├─► [ Registration / Auth ] ──► Spring Boot Security (BCrypt + JWT)
   │                                     │
   ├─► [ Student Profile & Preferences ] │ ──► MySQL (students, favorites, applications)
   │                                     │
   ├─► [ Recommendation Generator ] ────┼──► Python ML Service (/recommend)
   │                                     │
   ├─► [ Admission Chance Predictor ] ───┼──► Python ML Service (/predict)
   │                                     │
   └─► [ AI Chatbot Assistant ] ─────────┴──► Gemini Service API (with Profile Context)
                                               │
                                               ▼
                                         AI Output Response
```

### 2.3 Entity Relationship (ER) Diagram Concept

```
Student (1) ───────< (N) Favorite >──────── (1) College
   │                                           │
   ├─► (N) RecommendationHistory               ├─► (N) Course
   │                                           │
   └─► (N) Application                         └─► (N) AdmissionData

Scholarship (Independent Entity for Financial Aid Matching)
```

---

## 3. COMPLETE FILE & FOLDER STRUCTURE

```
uniguide_AI/
├── .env.example
├── .gitignore
├── README.md
├── TEST_CASES.md
├── MASTER_PROJECT_DOCUMENTATION.md
├── docs/
│   ├── api-documentation.md
│   ├── architecture.md
│   ├── ai-ml.md
│   ├── database.md
│   ├── future-scope.md
│   ├── project-overview.md
│   └── testing.md
├── ai-service/
│   ├── app.py
│   ├── train_model.py
│   ├── requirements.txt
│   └── model/
│       ├── admission_model.pkl
│       └── metrics.json
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/uniguideAI/
│       │   │   ├── config/ (DataInitializer.java)
│       │   │   ├── controller/ (AdminController, AiController, AuthController, ApplicationController, ChatController, CollegeController, CourseController, FavoriteController, RecommendationController, ScholarshipController, StudentController)
│       │   │   ├── dto/ (CollegeResponse, CourseResponse, ScholarshipResponse, StudentRequest, StudentResponse)
│       │   │   ├── entity/ (AdmissionData, Application, College, Course, Favorite, RecommendationHistory, Scholarship, Student)
│       │   │   ├── exception/ (GlobalExceptionHandler)
│       │   │   ├── repository/ (AdmissionDataRepository, ApplicationRepository, CollegeRepository, CourseRepository, FavoriteRepository, RecommendationHistoryRepository, ScholarshipRepository, StudentRepository)
│       │   │   ├── security/ (CustomUserDetailsService, JwtAuthenticationFilter, JwtService, SecurityConfig)
│       │   │   └── service/ (AdminService, AiIntegrationService, ApplicationService, CollegeService, CourseService, FavoriteService, GeminiService, RecommendationService, ScholarshipService, StudentService)
│       │   └── resources/ (application.properties)
│       └── test/
│           └── java/com/uniguideAI/ (UniGuideApplicationTests.java)
└── frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── colleges.html
    ├── college-details.html
    ├── recommendations.html
    ├── prediction.html
    ├── scholarships.html
    ├── documents.html
    ├── chat.html
    ├── compare.html
    ├── recommendation-history.html
    ├── applications.html
    ├── admin-dashboard.html
    ├── css/
    │   ├── auth.css
    │   ├── components.css
    │   ├── dashboard.css
    │   ├── responsive.css
    │   └── style.css
    └── js/
        ├── admin.js
        ├── applications.js
        ├── auth.js
        ├── chat.js
        ├── colleges.js
        ├── compare.js
        ├── dashboard.js
        ├── documents.js
        ├── main.js
        ├── mock-data.js
        ├── prediction.js
        ├── recommendation-history.js
        ├── recommendations.js
        └── scholarships.js
```

---

## 4. DATABASE SCHEMA (`uniguide_db`)

1. **`students`**: `id`, `name`, `email`, `password`, `marks`, `entrance_score`, `preferred_course`, `preferred_location`, `budget`, `career_interest`, `role`.
2. **`colleges`**: `id`, `name`, `location`, `college_type`, `description`, `fees`, `cutoff`, `eligibility`, `placement`, `rating`, `website`.
3. **`courses`**: `id`, `name`, `description`, `duration`, `eligibility`, `average_fees`, `career_options`, `college_id`.
4. **`scholarships`**: `id`, `name`, `provider`, `description`, `eligibility`, `amount`, `deadline`, `category`, `application_link`.
5. **`recommendation_history`**: `id`, `student_id`, `recommended_college`, `recommended_course`, `match_percentage`, `reason`, `created_at`.
6. **`favorites`**: `id`, `student_id`, `college_id`, `created_at` (Unique constraint: `student_id + college_id`).
7. **`applications`**: `id`, `student_id`, `college_name`, `course_name`, `status`, `application_date`, `deadline`, `notes`, `created_at`.
8. **`admission_data`**: `id`, `college_id`, `course_id`, `year`, `cutoff_marks`, `total_seats`, `vacant_seats`.

---

## 5. API SPECIFICATION REFERENCE

### Public Endpoints
- `POST /api/auth/register` — Register student account.
- `POST /api/auth/login` — Login and receive JWT token.
- `GET /api/colleges` — Fetch all colleges list.
- `GET /api/colleges/{id}` — Fetch specific college details.
- `GET /api/colleges/search?keyword={kw}` — Search colleges by keyword.
- `GET /api/colleges/location/{location}` — Filter colleges by state.
- `GET /api/courses` — List all courses.
- `GET /api/scholarships` — List all scholarships.
- `GET /api/scholarships/search?keyword={kw}` — Search scholarships.

### Student Authenticated Endpoints (`ROLE_STUDENT` / `ROLE_ADMIN`)
- `GET /api/students/{id}` — Retrieve profile.
- `PUT /api/students/{id}` — Update profile details.
- `GET /api/students/{id}/profile-overview` — Get dynamic profile completion % and missing fields list.
- `POST /api/recommendations/generate/{studentId}` — Generate 6-factor recommendations & log to database.
- `GET /api/recommendations/student/{studentId}` — Fetch saved recommendation history logs.
- `POST /api/ai/predict` — Execute admission probability prediction.
- `GET /api/scholarships/match/{studentId}` — Get matching scholarships with EXPIRED status labels.
- `POST /api/favorites/toggle` — Add/remove college bookmark.
- `GET /api/favorites/{studentId}` — Retrieve saved colleges.
- `GET /api/applications/{studentId}` — Get application tracker entries.
- `POST /api/applications` — Create new application tracker entry.
- `PUT /api/applications/{id}` — Edit application tracker entry.
- `DELETE /api/applications/{id}` — Delete application entry.
- `POST /api/chat` — Send context-aware message to Gemini AI chatbot.

### Admin Protected Endpoints (`ROLE_ADMIN`)
- `GET /api/admin/stats` — Overall counts (students, colleges, courses, scholarships).
- `GET /api/admin/students` — Student directory with role badges.
- `GET /api/admin/analytics` — Student distributions by course & location.
- `GET /api/admin/ml-analytics` — ML model metrics (Accuracy, Precision, Recall, F1, Confusion Matrix).
- `POST /api/colleges` — Add new college.
- `PUT /api/colleges/{id}` — Update existing college.
- `DELETE /api/colleges/{id}` — Delete college.
- `POST /api/scholarships` — Add new scholarship.
- `PUT /api/scholarships/{id}` — Update existing scholarship.
- `DELETE /api/scholarships/{id}` — Delete scholarship.

---

## 6. AI / ML ALGORITHMS & METRICS

### 6.1 6-Factor Weighted Recommendation Engine
Calculates compatibility percentage:
- **Academic Match (30%)**: Compares graduation marks with college cutoffs.
- **Course Match (25%)**: Verifies preferred specialization availability.
- **Budget Match (15%)**: Evaluates annual fees against student budget.
- **Location Match (10%)**: Checks state/location preference.
- **Career Match (10%)**: Assesses placement record and career alignment.
- **Admission Match (10%)**: Evaluates entrance scorecard compatibility.

### 6.2 ML Admission Chance Prediction Model
- **Input Features**: `[marks, entrance_score, budget, college_cutoff]`
- **Output Labels**: `0: LOW`, `1: MEDIUM`, `2: HIGH`
- **Model Evaluation Metrics (Test Split: 50 Samples)**:
  - **Accuracy**: 92.0%
  - **Precision**: 90.0%
  - **Recall**: 88.0%
  - **F1-Score**: 89.0%
  - **Confusion Matrix**:
    ```
    [15,  2,  0]
    [ 1, 18,  1]
    [ 0,  0, 13]
    ```

---

## 7. COMPLETE TEST CASES MATRIX (`TEST_CASES.md`)

| Test ID | Feature / Module | Test Input / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-001** | Student Registration | Register with valid credentials. | Account created, JWT token issued, redirected to `dashboard.html`. | Account created, JWT stored, redirected. | PASS |
| **TC-002** | Student Registration | Register with invalid email format. | Validation error message displayed, submit blocked. | Error message displayed, blocked. | PASS |
| **TC-003** | Student Authentication | Login (`demo@uniguide.com` / `Password@123`). | JWT token returned, user details saved in `localStorage`. | JWT returned, logged in. | PASS |
| **TC-004** | Profile Completion | Compute completion % for partial profile. | Percentage calculated, missing fields list returned. | Percentage = 67%, missing fields shown. | PASS |
| **TC-005** | College Explorer | Search by keyword `"MCA"`. | List of colleges offering MCA returned. | Colleges matching MCA displayed. | PASS |
| **TC-006** | College Filters | Filter by type `"Public"` & location `"Delhi"`. | Only public colleges in Delhi rendered. | DTU returned in result list. | PASS |
| **TC-007** | AI Recommendation Engine | Execute recommendation (Marks: 82%, Budget: 200k). | Top weighted colleges returned. | Sorted colleges returned. | PASS |
| **TC-008** | Recommendation Explanation | View recommendation breakdown for DTU. | Explanation reasons, strengths, considerations returned. | Detailed breakdown items rendered. | PASS |
| **TC-009** | Recommendation History | Query `/api/recommendations/student/{id}`. | Saved recommendation records returned from MySQL. | Historical records retrieved. | PASS |
| **TC-010** | Admission Chance Prediction | Input Marks=85, Entrance=80, Cutoff=80. | Probability gauge = HIGH (87%), breakdown & disclaimer shown. | HIGH (87%) returned with disclaimer. | PASS |
| **TC-011** | ML Model Analytics | Fetch `/api/admin/ml-analytics`. | Real test dataset metrics returned (Accuracy=92%, 3x3 matrix). | Metrics & 3x3 matrix loaded. | PASS |
| **TC-012** | Scholarship Discovery | Search scholarship by keyword `"Merit"`. | Matching scholarships returned with match percentage. | Merit scholarships returned. | PASS |
| **TC-013** | Expired Scholarship Handling | Query scholarship list with past deadline (`2024-08-31`). | Scholarship marked `EXPIRED`, apply button disabled. | Labeled EXPIRED, apply disabled. | PASS |
| **TC-014** | Document Guidance | Click "Toggle Status" on document card. | Status cycles: Not Added -> Uploaded -> Verified. | Status badge updated interactively. | PASS |
| **TC-015** | AI Chatbot Context | Ask "What colleges match my profile?". | Chatbot utilizes student's course (MCA) and marks (82%). | Contextual college advice returned. | PASS |
| **TC-016** | Saved Colleges | Click bookmark button on college card. | Entry saved to `favorites` table in MySQL. | Saved to database and dashboard. | PASS |
| **TC-017** | Application Tracker | Add new application ("Chandigarh University", "Applied"). | Saved to `applications` table, timeline updated. | Application saved and displayed. | PASS |
| **TC-018** | Side-by-Side Comparison | Select 2 colleges in `compare.html`. | Matrix rendered highlighting Best Fees, Lowest Cutoff, Top Rated. | Table rendered with badges. | PASS |
| **TC-019** | Admin Access Control | Access `/api/admin/stats` as student user. | Access denied with HTTP 403 Forbidden. | 403 Forbidden enforced. | PASS |
| **TC-020** | Admin Management | Log in as admin (`admin@uniguide.com`), add college. | New college saved to MySQL and visible in explorer. | College created and displayed. | PASS |

---

## 8. STEP-BY-STEP SETUP & RUN INSTRUCTIONS

### Step 1: Database Setup
```sql
CREATE DATABASE uniguide_db;
```

### Step 2: Run Python AI Service
```bash
cd ai-service
python train_model.py
uvicorn app:app --reload --port 8000
```

### Step 3: Run Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```

### Step 4: Open Frontend
Open `frontend/index.html` using Live Server (`http://localhost:5500`).
- **Student Login**: `demo@uniguide.com` / `Password@123`
- **Admin Login**: `admin@uniguide.com` / `AdminPass@123`

---

## 9. COMPREHENSIVE VIVA QUESTIONS & ANSWERS

- **Q1: What problem does UniGuide AI solve?**  
  *Answer*: It eliminates information fragmentation in higher education admissions by providing personalized 6-factor AI recommendations, ML admission chance predictions, scholarship matching, and application tracking in a single platform.
- **Q2: Explain the technical stack architecture.**  
  *Answer*: Decoupled 3-tier architecture: HTML5/CSS3/JS Bootstrap frontend communicating via REST JSON APIs to a Java 17 Spring Boot backend connected to MySQL 8.0, with a Python FastAPI ML microservice for predictive analytics and Google Gemini API for natural language assistance.
- **Q3: How is student security enforced?**  
  *Answer*: Passwords are encrypted using BCrypt (`BCryptPasswordEncoder`). Sessionless JWT tokens are validated on every request via `JwtAuthenticationFilter`. Spring Security enforces role-based authorization (`ROLE_ADMIN` vs `ROLE_STUDENT`).
- **Q4: How does the AI recommendation engine work?**  
  *Answer*: It computes a 100% weighted score: Academic Match (30%), Course Match (25%), Budget Match (15%), Location Match (10%), Career Match (10%), and Admission Match (10%), returning transparent strengths and considerations.
- **Q5: What metrics evaluate the ML prediction model?**  
  *Answer*: Evaluated on a 50-sample test split: Accuracy = 92.0%, Precision = 90.0%, Recall = 88.0%, F1-Score = 89.0%, accompanied by a 3x3 Confusion Matrix.

---

## 10. STEP-BY-STEP COLLEGE DEMO SEQUENCE

1. **Landing Page (`index.html`)**: Show hero banner, features, and dark mode toggle.
2. **Student Login (`login.html`)**: Log in with `demo@uniguide.com` / `Password@123`.
3. **Student Dashboard (`dashboard.html`)**: Highlight greeting ("Welcome back, Rahul Sharma 👋"), profile completion percentage (75%), missing fields alert, top 3 AI recommendations, and upcoming deadlines.
4. **College Explorer (`colleges.html`)**: Search "MCA", apply filters, bookmark a college, and click compare.
5. **College Comparison (`compare.html`)**: Compare colleges side-by-side highlighting Best Fees, Lowest Cutoff, and Top Rated badges.
6. **AI Recommendations (`recommendations.html`)**: Generate AI recommendations and show weighted breakdown, reasons, strengths, and considerations.
7. **Admission Chance Prediction (`prediction.html`)**: Predict admission chance showing HIGH (87%) probability gauge, reasons, improvement tips, and disclaimer.
8. **Scholarships (`scholarships.html`)**: Filter scholarships and highlight the EXPIRED status badge.
9. **Document Guidance (`documents.html`)**: Toggle document statuses and open the AI Document Guidance Assistant modal.
10. **AI Chatbot (`chat.html`)**: Use prompt shortcut ("What colleges match my profile?") and demonstrate context-aware AI answers.
11. **Application Tracker (`applications.html`)**: Create a new tracker entry and edit status to "Applied".
12. **Recommendation History (`recommendation-history.html`)**: Review saved recommendation history logs from MySQL.
13. **Admin Console (`admin-dashboard.html`)**: Log in as `admin@uniguide.com` / `AdminPass@123`, show system tallies, student directory search, College CRUD, Scholarship CRUD, Chart.js analytics, and ML Model Confusion Matrix metrics.
