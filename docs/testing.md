# Testing Strategy — UniGuide AI

## Backend Automated Testing
- JUnit 5 & Spring Boot Test Framework.
- Transactional test isolation (`@Transactional`).
- **Tested Services**: Student creation, student retrieval, profile completion percentage calculation, college search, scholarship matching algorithm.

## Manual Verification
- Verified authentication, JWT token storage, role-based protection (`ROLE_STUDENT` vs `ROLE_ADMIN`).
- Tested college explorer, multi-filter, search, and side-by-side comparison matrix.
- Tested AI recommendation generation and MySQL recommendation history persistence.
- Tested admission chance prediction probability gauge and disclaimer rendering.
- Tested scholarship discovery, category filtering, matching score, and EXPIRED tag logic.
- Tested document checklist status toggle and AI document assistant modal.
- Tested Admin console: Tallies, student list search, College CRUD, Scholarship CRUD, Chart.js analytics, and ML model confusion matrix metrics.
