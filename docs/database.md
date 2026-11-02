# Database Schema & ER Diagram — UniGuide AI

## Entity Relationship Diagram (Concept)

```
Student (1) ───────< (N) Favorite >──────── (1) College
   │                                           │
   ├─► (N) RecommendationHistory               ├─► (N) Course
   │                                           │
   └─► (N) Application                         └─► (N) AdmissionData

Scholarship (Independent Entity for Financial Aid Matching)
```

## Database Tables (`uniguide_db`)
1. **`students`**: `id`, `name`, `email`, `password`, `marks`, `entrance_score`, `preferred_course`, `preferred_location`, `budget`, `career_interest`, `role`.
2. **`colleges`**: `id`, `name`, `location`, `college_type`, `description`, `fees`, `cutoff`, `eligibility`, `placement`, `rating`, `website`.
3. **`courses`**: `id`, `name`, `description`, `duration`, `eligibility`, `average_fees`, `career_options`, `college_id`.
4. **`scholarships`**: `id`, `name`, `provider`, `description`, `eligibility`, `amount`, `deadline`, `category`, `application_link`.
5. **`recommendation_history`**: `id`, `student_id`, `recommended_college`, `recommended_course`, `match_percentage`, `reason`, `created_at`.
6. **`favorites`**: `id`, `student_id`, `college_id`, `created_at` (Unique: `student_id + college_id`).
7. **`applications`**: `id`, `student_id`, `college_name`, `course_name`, `status`, `application_date`, `deadline`, `notes`, `created_at`.
8. **`admission_data`**: `id`, `college_id`, `course_id`, `year`, `cutoff_marks`, `total_seats`, `vacant_seats`.
