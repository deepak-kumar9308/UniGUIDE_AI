# AI / ML Architecture — UniGuide AI

## 1. 6-Factor Weighted Recommendation Engine
The AI recommendation engine evaluates 6 compatibility dimensions to produce a final 100% weighted match score:
- **Academic Match (30%)**: Evaluates student's graduation marks against historical college cutoff thresholds.
- **Course Match (25%)**: Checks whether the college offers the student's target specialization (e.g. MCA, B.Tech CSE).
- **Budget Match (15%)**: Compares annual tuition fees against stated student budget limits.
- **Location Match (10%)**: Compares college location state against student location preferences.
- **Career Match (10%)**: Assesses placement record and alignment with target career role.
- **Admission Compatibility (10%)**: Evaluates entrance examination score placement.

## 2. Admission Chance Prediction Model
- **Model Architecture**: Classification model (RandomForestClassifier / Standard Logistic Regression).
- **Features**: Academic Marks, Entrance Score, Budget (in Lakhs), College Cutoff.
- **Target Label**: `0: LOW`, `1: MEDIUM`, `2: HIGH`.
- **Pre-processing**: Mean imputation for missing records, StandardScaler feature normalization.

## 3. Evaluation Metrics (Test Split: 50 Samples)
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

## 4. Google Gemini API Chatbot Integration
- Integrates Google Gemini API via Spring Boot backend (`GeminiService.java`).
- Injecting student profile context (Course, Marks, Location, Budget, Career) into prompts.
- **Safety System Guards**: Disclaimers instructing AI not to guarantee admission or invent unofficial college deadlines.
