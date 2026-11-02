# API Documentation — UniGuide AI

## Public Endpoints
- `POST /api/auth/register` — Student Registration.
- `POST /api/auth/login` — Student Login & JWT generation.
- `GET /api/colleges` — List all colleges.
- `GET /api/colleges/{id}` — Get college details by ID.
- `GET /api/colleges/search?keyword={kw}` — Search colleges.
- `GET /api/colleges/location/{location}` — Filter colleges by location.
- `GET /api/courses` — List courses.
- `GET /api/scholarships` — List all scholarships.
- `GET /api/scholarships/search?keyword={kw}` — Search scholarships.

## Student Authenticated Endpoints
- `GET /api/students/{id}` — Get student profile.
- `PUT /api/students/{id}` — Update student profile.
- `GET /api/students/{id}/profile-overview` — Get profile completion % and missing fields list.
- `POST /api/recommendations/generate/{studentId}` — Generate 6-factor weighted AI recommendations & log history.
- `GET /api/recommendations/student/{studentId}` — Retrieve historical recommendation logs.
- `POST /api/ai/predict` — Get ML admission probability prediction (HIGH / MEDIUM / LOW, %).
- `GET /api/scholarships/match/{studentId}` — Get matching scholarships with EXPIRED status tags.
- `POST /api/favorites/toggle` — Add/remove college from saved favorites.
- `GET /api/favorites/{studentId}` — Get saved favorite colleges.
- `GET /api/applications/{studentId}` — Get admission tracker entries.
- `POST /api/applications` — Create new application tracker entry.
- `PUT /api/applications/{id}` — Update application entry.
- `DELETE /api/applications/{id}` — Delete application entry.
- `POST /api/chat` — Gemini context-aware AI chatbot assistant response.

## Admin Protected Endpoints (`ROLE_ADMIN`)
- `GET /api/admin/stats` — Total counts for students, colleges, courses, scholarships.
- `GET /api/admin/students` — List all students with roles and details.
- `GET /api/admin/analytics` — Grouped distributions by course and location.
- `GET /api/admin/ml-analytics` — ML model evaluation metrics (Accuracy, Precision, Recall, F1, Confusion Matrix).
- `POST /api/colleges` — Admin create college.
- `PUT /api/colleges/{id}` — Admin update college.
- `DELETE /api/colleges/{id}` — Admin delete college.
- `POST /api/scholarships` — Admin create scholarship.
- `PUT /api/scholarships/{id}` — Admin update scholarship.
- `DELETE /api/scholarships/{id}` — Admin delete scholarship.
