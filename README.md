# UniGuide AI — Master AI-Powered College Admission Counselor

UniGuide AI is a full-stack, AI-powered EdTech college admission counseling platform designed for undergraduate and postgraduate (MCA/B.Tech/MBA) students.

---

## 1. System Architecture

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

---

## 2. Level-1 Data Flow Diagram (DFD)

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

---

## 3. Entity Relationship (ER) Diagram Concept

```
Student (1) ───────< (N) Favorite >──────── (1) College
   │                                           │
   ├─► (N) RecommendationHistory               ├─► (N) Course
   │                                           │
   └─► (N) Application                         └─► (N) AdmissionData

Scholarship (Independent Entity for Financial Aid Matching)
```

---

## 4. Key Implemented Features

1. **Student Authentication & Authorization**: JWT token auth, BCrypt password hashing, Role-based security (`ROLE_STUDENT` vs `ROLE_ADMIN`).
2. **Personalized Student Dashboard**: Welcome banner, dynamic profile completion percentage calculation with missing fields list and "Complete Profile" modal CTA, top 3 AI recommendations, admission chance summary, scholarship discovery, saved colleges, application tracker preview, and upcoming deadlines.
3. **Advanced 6-Factor AI Recommendation Engine**: Weighted algorithm evaluating Academic Match (30%), Course Match (25%), Budget Match (15%), Location Match (10%), Career Match (10%), and Admission Match (10%). Returns match percentage, strengths, considerations, and explanation reasons.
4. **Admission Chance Prediction**: Predicts HIGH / MEDIUM / LOW admission chance with probability percentage gauge, explanation of why, and actionable tips for improvement.
5. **Scholarship Finder & Matcher**: Multi-filter scholarship search, matching score calculation, and explicit `EXPIRED` status labels for past deadlines.
6. **Document Guidance Module**: Status tracking for 8 key admission documents (Not Added, Uploaded, Verified) + AI Document Guidance Assistant modal.
7. **24/7 AI Chatbot**: Powered by Google Gemini API with student profile context passing, prompt shortcuts, typing indicators, and safety disclaimers.
8. **Side-by-Side College Comparison**: Desktop comparison matrix and mobile stacked cards highlighting Best Fees, Best Placement, Best Match, and Lowest Cutoff.
9. **Admission Application Tracker**: Timeline view with status badges (Not Applied, Planning, Applied, Under Review, Accepted, Rejected), registration deadlines, and notes.
10. **Admin Console & ML Analytics**: Admin tallies, student search list, College CRUD, Scholarship CRUD, Chart.js distribution charts, and ML model evaluation metrics (Accuracy 92%, Precision 90%, Recall 88%, F1 89%, 3x3 confusion matrix).

---

## 5. Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom design system + Dark Mode toggle), JS ES6+, Bootstrap 5, Chart.js, Lucide Icons.
- **Backend**: Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security, JWT, BCrypt, RestTemplate.
- **AI/ML Service**: Python 3.x, FastAPI, scikit-learn, Pandas, NumPy, Joblib/Pickle, Google Gemini API.
- **Database**: MySQL 8.0 (`uniguide_db`).

---

## 6. How to Run the Complete Project

### Step 1: Database Setup
1. Open MySQL terminal or Workbench.
2. Create database:
   ```sql
   CREATE DATABASE uniguide_db;
   ```

### Step 2: Run Python AI Service
1. Open terminal in `ai-service/`:
   ```bash
   cd ai-service
   ```
2. Train model and compute evaluation metrics:
   ```bash
   python train_model.py
   ```
3. Start FastAPI server:
   ```bash
   uvicorn app:app --reload --port 8000
   ```

### Step 3: Run Spring Boot Backend
1. Open terminal in `backend/`:
   ```bash
   cd backend
   ```
2. Run Maven build & start server:
   ```bash
   mvn spring-boot:run
   ```
   (Server starts on `http://localhost:8080` and seeds default Admin and Demo Student accounts).

### Step 4: Run Frontend
1. Open `frontend/index.html` using Live Server on `http://localhost:5500` or open directly in browser.
2. Log in using default credentials:
   - **Student Login**: `demo@uniguide.com` / `Password@123`
   - **Admin Login**: `admin@uniguide.com` / `AdminPass@123`

---

## 7. Viva Questions & Answers Guide

- **Q1: Why choose Spring Boot for the backend?**  
  *Answer*: Spring Boot provides enterprise-grade security, sessionless JWT token management, automatic ORM database mapping with JPA/Hibernate, and high throughput REST API scalability.

- **Q2: How does the AI Recommendation Engine compute college compatibility?**  
  *Answer*: It computes a 100% weighted score using 6 factors: Academic Match (30%), Course Match (25%), Budget Match (15%), Location Match (10%), Career Match (10%), and Admission Match (10%).

- **Q3: What ML algorithm is used for Admission Chance Prediction?**  
  *Answer*: Classification model trained on academic score, entrance exam score, budget, and historical college cutoffs.

- **Q4: How is security handled for sensitive endpoints?**  
  *Answer*: Passwords are hashed using BCrypt. Stateless JWT tokens are validated per request via `JwtAuthenticationFilter`. Scoped authorization restricts `/api/admin/**` endpoints to `ROLE_ADMIN`.
