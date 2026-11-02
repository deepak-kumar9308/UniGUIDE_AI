# System Architecture — UniGuide AI

## Architecture Overview

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

## Level-1 Data Flow Diagram (DFD)

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

## Technology Stack Breakdown
- **Frontend**: HTML5, Vanilla CSS3 (Custom CSS tokens + Dark Mode), JavaScript (ES6+), Bootstrap 5, Chart.js, Lucide Icons.
- **Backend**: Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security, JWT (JSON Web Tokens), BCrypt Password Encoder, RestTemplate.
- **AI/ML Service**: Python 3.x, FastAPI, scikit-learn, Pandas, NumPy, Joblib/Pickle, Google Gemini API integration.
- **Database**: MySQL 8.0 (`uniguide_db`).
