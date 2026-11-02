package com.uniguideAI.config;

import com.uniguideAI.entity.*;
import com.uniguideAI.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CollegeRepository collegeRepository;
    private final CourseRepository courseRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin User
        if (!studentRepository.existsByEmail("admin@uniguide.com")) {
            Student admin = Student.builder()
                    .name("UniGuide Admin")
                    .email("admin@uniguide.com")
                    .password(passwordEncoder.encode("AdminPass@123"))
                    .role("ROLE_ADMIN")
                    .careerInterest("Administration")
                    .preferredCourse("MCA")
                    .preferredLocation("Delhi")
                    .marks(95.0)
                    .entranceScore(92.0)
                    .budget(500000.0)
                    .build();
            studentRepository.save(admin);
            System.out.println("Admin User Seeded: admin@uniguide.com / AdminPass@123");
        }

        // Seed Demo Student User
        if (!studentRepository.existsByEmail("demo@uniguide.com")) {
            Student student = Student.builder()
                    .name("Rahul Sharma")
                    .email("demo@uniguide.com")
                    .password(passwordEncoder.encode("Password@123"))
                    .role("ROLE_STUDENT")
                    .careerInterest("Software Engineering")
                    .preferredCourse("MCA")
                    .preferredLocation("Punjab")
                    .marks(82.5)
                    .entranceScore(78.0)
                    .budget(200000.0)
                    .build();
            Student savedDemo = studentRepository.save(student);
            System.out.println("Demo Student Seeded: demo@uniguide.com / Password@123");

            // Seed Sample Application Tracker entries
            if (applicationRepository.count() == 0) {
                applicationRepository.save(Application.builder()
                        .studentId(savedDemo.getId())
                        .collegeName("Chandigarh University")
                        .courseName("MCA")
                        .status("Applied")
                        .applicationDate(LocalDate.now().minusDays(5))
                        .deadline(LocalDate.now().plusDays(25))
                        .notes("Submitted online application form. Awaiting document verification.")
                        .build());

                applicationRepository.save(Application.builder()
                        .studentId(savedDemo.getId())
                        .collegeName("Delhi Technological University")
                        .courseName("MCA")
                        .status("Under Review")
                        .applicationDate(LocalDate.now().minusDays(12))
                        .deadline(LocalDate.now().plusDays(10))
                        .notes("Entrance scorecard uploaded.")
                        .build());
            }
        }

        if (collegeRepository.count() == 0) {
            // 1. Initialize Colleges
            College c1 = College.builder()
                    .name("Chandigarh University")
                    .location("Punjab")
                    .collegeType("Private")
                    .description("Top-ranked NAAC A+ private university renowned for computing and technology programs.")
                    .fees(150000.0)
                    .cutoff(75.0)
                    .eligibility("Graduation with 50% + Math in 10+2")
                    .placement("95% Placement Rate (Avg 7.5 LPA)")
                    .rating(4.6)
                    .website("https://cuchd.in")
                    .courses(new ArrayList<>())
                    .build();

            College c2 = College.builder()
                    .name("Delhi Technological University")
                    .location("Delhi")
                    .collegeType("Public")
                    .description("Premier public technological university with prestigious computing faculty and NIRF top ranking.")
                    .fees(85000.0)
                    .cutoff(88.0)
                    .eligibility("Graduation with 60% + NIMCET / CET Score")
                    .placement("98% Placement Rate (Avg 12.8 LPA)")
                    .rating(4.9)
                    .website("https://dtu.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c3 = College.builder()
                    .name("Panjab University")
                    .location("Punjab")
                    .collegeType("Public")
                    .description("Historic public central university offering MCA and IT post-graduate degrees with affordable fees.")
                    .fees(45000.0)
                    .cutoff(82.0)
                    .eligibility("BCA/B.Sc CS with 55% marks")
                    .placement("88% Placement Rate (Avg 6.2 LPA)")
                    .rating(4.5)
                    .website("https://puchd.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c4 = College.builder()
                    .name("SRM Institute of Science and Technology")
                    .location("Chennai")
                    .collegeType("Private")
                    .description("Premier private university featuring advanced AI research labs and global placement partnerships.")
                    .fees(250000.0)
                    .cutoff(70.0)
                    .eligibility("Graduation with 55% + SRMJEEE/Entrance")
                    .placement("92% Placement Rate (Avg 8.0 LPA)")
                    .rating(4.4)
                    .website("https://srmist.edu.in")
                    .courses(new ArrayList<>())
                    .build();

            College c5 = College.builder()
                    .name("Indian Institute of Technology Delhi")
                    .location("Delhi")
                    .collegeType("Public")
                    .description("India's premier institute for technological research, computing innovation, and world-class engineering education.")
                    .fees(220000.0)
                    .cutoff(96.0)
                    .eligibility("JEE Advanced / GATE / M.Sc Entrance top rankers")
                    .placement("99% Placement Rate (Avg 25.4 LPA)")
                    .rating(4.9)
                    .website("https://iitd.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c6 = College.builder()
                    .name("Indian Institute of Technology Bombay")
                    .location("Mumbai")
                    .collegeType("Public")
                    .description("Top NIRF ranked institute globally recognized for cutting-edge computer science and AI research.")
                    .fees(230000.0)
                    .cutoff(97.0)
                    .eligibility("JEE Advanced AIR top 100 / GATE top ranks")
                    .placement("100% Placement Rate (Avg 28.5 LPA)")
                    .rating(5.0)
                    .website("https://iitb.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c7 = College.builder()
                    .name("BITS Pilani")
                    .location("Rajasthan")
                    .collegeType("Private")
                    .description("Deemed university with zero-attendance policy, top merit culture, and stellar software industry alumni.")
                    .fees(450000.0)
                    .cutoff(92.0)
                    .eligibility("BITSAT score > 300 / 10+2 75% aggregate")
                    .placement("97% Placement Rate (Avg 18.2 LPA)")
                    .rating(4.8)
                    .website("https://bits-pilani.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c8 = College.builder()
                    .name("VIT University")
                    .location("Vellore")
                    .collegeType("Private")
                    .description("Leading private university in South India with extensive international tie-ups and high placement records.")
                    .fees(198000.0)
                    .cutoff(78.0)
                    .eligibility("VITEEE rank / 10+2 60% in PCM")
                    .placement("94% Placement Rate (Avg 9.2 LPA)")
                    .rating(4.5)
                    .website("https://vit.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c9 = College.builder()
                    .name("Lovely Professional University")
                    .location("Punjab")
                    .collegeType("Private")
                    .description("Vibrant sprawling university campus offering industry-integrated computer science programs and scholarships.")
                    .fees(120000.0)
                    .cutoff(65.0)
                    .eligibility("LPUNEST / 10+2 50% aggregate")
                    .placement("90% Placement Rate (Avg 6.8 LPA)")
                    .rating(4.3)
                    .website("https://lpu.in")
                    .courses(new ArrayList<>())
                    .build();

            College c10 = College.builder()
                    .name("Amity University")
                    .location("Noida")
                    .collegeType("Private")
                    .description("Modern private university offering global exposure, incubation centers, and diverse STEM courses.")
                    .fees(180000.0)
                    .cutoff(68.0)
                    .eligibility("10+2 with 55% + Amity Entrance Test")
                    .placement("88% Placement Rate (Avg 6.5 LPA)")
                    .rating(4.2)
                    .website("https://amity.edu")
                    .courses(new ArrayList<>())
                    .build();

            College c11 = College.builder()
                    .name("International Institute of Information Technology")
                    .location("Hyderabad")
                    .collegeType("Public")
                    .description("India's premier autonomous computing research institute renowned for AI, Coding, and Software Systems.")
                    .fees(330000.0)
                    .cutoff(94.0)
                    .eligibility("UGEE / JEE Main top percentile")
                    .placement("100% Placement Rate (Avg 31.0 LPA)")
                    .rating(4.9)
                    .website("https://iiit.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c12 = College.builder()
                    .name("Thapar Institute of Engineering and Technology")
                    .location("Punjab")
                    .collegeType("Private")
                    .description("Preeminent engineering institution in North India known for rigorous academic standards and industry reputation.")
                    .fees(290000.0)
                    .cutoff(85.0)
                    .eligibility("JEE Main rank / 10+2 70% in PCM")
                    .placement("96% Placement Rate (Avg 11.5 LPA)")
                    .rating(4.6)
                    .website("https://thapar.edu")
                    .courses(new ArrayList<>())
                    .build();

            College c13 = College.builder()
                    .name("Indian Institute of Science")
                    .location("Bangalore")
                    .collegeType("Public")
                    .description("India's premier flagship research university leading world rankings in science, computing, and advanced engineering.")
                    .fees(42000.0)
                    .cutoff(98.5)
                    .eligibility("GATE / JEE Advanced Top Ranks / KVPY")
                    .placement("100% Placement Rate (Avg 30.0 LPA)")
                    .rating(5.0)
                    .website("https://iisc.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c14 = College.builder()
                    .name("National Institute of Technology Tiruchirappalli")
                    .location("Tamil Nadu")
                    .collegeType("Public")
                    .description("Top-ranked NIT in India renowned for academic excellence, state-of-the-art innovation labs, and elite placements.")
                    .fees(145000.0)
                    .cutoff(91.0)
                    .eligibility("JEE Main Top 5000 AIR / NIMCET")
                    .placement("97% Placement Rate (Avg 15.5 LPA)")
                    .rating(4.8)
                    .website("https://nitt.edu")
                    .courses(new ArrayList<>())
                    .build();

            College c15 = College.builder()
                    .name("National Institute of Technology Surathkal")
                    .location("Karnataka")
                    .collegeType("Public")
                    .description("Coastal premier institute with strong technological research focus and outstanding global alumni presence.")
                    .fees(150000.0)
                    .cutoff(89.5)
                    .eligibility("JEE Main Rank / NIMCET Score")
                    .placement("96% Placement Rate (Avg 14.2 LPA)")
                    .rating(4.7)
                    .website("https://nitk.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c16 = College.builder()
                    .name("Manipal Institute of Technology")
                    .location("Karnataka")
                    .collegeType("Private")
                    .description("Esteemed private institute offering modern technical education, world-class campus facilities, and global industry ties.")
                    .fees(335000.0)
                    .cutoff(76.0)
                    .eligibility("MET (Manipal Entrance Test) / 10+2 60% PCM")
                    .placement("93% Placement Rate (Avg 10.5 LPA)")
                    .rating(4.5)
                    .website("https://manipal.edu")
                    .courses(new ArrayList<>())
                    .build();

            College c17 = College.builder()
                    .name("Jadavpur University")
                    .location("Kolkata")
                    .collegeType("Public")
                    .description("Highly acclaimed public state university in Eastern India known for top engineering research at minimal tuition fees.")
                    .fees(10000.0)
                    .cutoff(93.0)
                    .eligibility("WBJEE Top Ranks / Merit Score")
                    .placement("95% Placement Rate (Avg 16.8 LPA)")
                    .rating(4.8)
                    .website("https://jadavpuruniversity.in")
                    .courses(new ArrayList<>())
                    .build();

            College c18 = College.builder()
                    .name("Netaji Subhas University of Technology")
                    .location("Delhi")
                    .collegeType("Public")
                    .description("Premier state university in Delhi known for high-tier technical programs, software incubators, and corporate exposure.")
                    .fees(195000.0)
                    .cutoff(87.0)
                    .eligibility("JEE Main Rank / JAC Delhi Counseling")
                    .placement("96% Placement Rate (Avg 14.0 LPA)")
                    .rating(4.7)
                    .website("https://nsut.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c19 = College.builder()
                    .name("RV College of Engineering")
                    .location("Bangalore")
                    .collegeType("Private")
                    .description("Top private autonomous engineering institution in Silicon Valley of India with deep tech industry integration.")
                    .fees(275000.0)
                    .cutoff(84.0)
                    .eligibility("KCET / COMEDK Top Ranks")
                    .placement("95% Placement Rate (Avg 12.0 LPA)")
                    .rating(4.6)
                    .website("https://rvce.edu.in")
                    .courses(new ArrayList<>())
                    .build();

            College c20 = College.builder()
                    .name("Christ University")
                    .location("Bangalore")
                    .collegeType("Private")
                    .description("Renowned deemed university known for holistic education, top management, MCA, and computer application streams.")
                    .fees(190000.0)
                    .cutoff(72.0)
                    .eligibility("Christ University Entrance Test + Micro Presentation")
                    .placement("89% Placement Rate (Avg 7.2 LPA)")
                    .rating(4.4)
                    .website("https://christuniversity.in")
                    .courses(new ArrayList<>())
                    .build();

            College c21 = College.builder()
                    .name("Jamia Millia Islamia")
                    .location("Delhi")
                    .collegeType("Public")
                    .description("NAAC A++ accredited central university in New Delhi offering excellent computer science and professional degree programs.")
                    .fees(35000.0)
                    .cutoff(83.0)
                    .eligibility("JMI Entrance Test / JEE Main Rank")
                    .placement("91% Placement Rate (Avg 9.0 LPA)")
                    .rating(4.6)
                    .website("https://jmi.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            College c22 = College.builder()
                    .name("St. Xavier's College")
                    .location("Kolkata")
                    .collegeType("Public")
                    .description("Autonomous premier college in Eastern India offering high-standard undergraduate and postgraduate computer science programs.")
                    .fees(65000.0)
                    .cutoff(86.0)
                    .eligibility("10+2 with 60% + Math Entrance")
                    .placement("87% Placement Rate (Avg 6.8 LPA)")
                    .rating(4.5)
                    .website("https://sxccal.edu")
                    .courses(new ArrayList<>())
                    .build();

            College c23 = College.builder()
                    .name("Anna University (CEG Guindy)")
                    .location("Chennai")
                    .collegeType("Public")
                    .description("One of the oldest technical institutions in Asia with legendary legacy in engineering and software innovation.")
                    .fees(50000.0)
                    .cutoff(90.0)
                    .eligibility("TNEA Counseling / TANCET Score")
                    .placement("94% Placement Rate (Avg 11.2 LPA)")
                    .rating(4.7)
                    .website("https://annauniv.edu")
                    .courses(new ArrayList<>())
                    .build();

            College c24 = College.builder()
                    .name("Kalinga Institute of Industrial Technology")
                    .location("Odisha")
                    .collegeType("Private")
                    .description("Premier private university with world-class smart campus infrastructure, high research output, and mass placements.")
                    .fees(185000.0)
                    .cutoff(71.0)
                    .eligibility("KIITEE Entrance Exam Score")
                    .placement("92% Placement Rate (Avg 7.8 LPA)")
                    .rating(4.4)
                    .website("https://kiit.ac.in")
                    .courses(new ArrayList<>())
                    .build();

            collegeRepository.save(c1);
            collegeRepository.save(c2);
            collegeRepository.save(c3);
            collegeRepository.save(c4);
            collegeRepository.save(c5);
            collegeRepository.save(c6);
            collegeRepository.save(c7);
            collegeRepository.save(c8);
            collegeRepository.save(c9);
            collegeRepository.save(c10);
            collegeRepository.save(c11);
            collegeRepository.save(c12);
            collegeRepository.save(c13);
            collegeRepository.save(c14);
            collegeRepository.save(c15);
            collegeRepository.save(c16);
            collegeRepository.save(c17);
            collegeRepository.save(c18);
            collegeRepository.save(c19);
            collegeRepository.save(c20);
            collegeRepository.save(c21);
            collegeRepository.save(c22);
            collegeRepository.save(c23);
            collegeRepository.save(c24);

            // 2. Initialize Courses
            Course mca1 = Course.builder().name("MCA").description("Master of Computer Applications").duration("2 Years").eligibility("BCA/B.Sc CS with Math").averageFees(150000.0).careerOptions("Software Developer, AI Engineer").college(c1).build();
            Course mca2 = Course.builder().name("MCA").description("Master of Computer Applications").duration("2 Years").eligibility("Bachelor degree with Math").averageFees(85000.0).careerOptions("Systems Architect, Software Engineer").college(c2).build();
            Course mca3 = Course.builder().name("MCA").description("Master of Computer Applications").duration("2 Years").eligibility("BCA/B.Sc with 55%").averageFees(45000.0).careerOptions("Database Admin, Web Developer").college(c3).build();
            Course btech4 = Course.builder().name("B.Tech CSE").description("B.Tech in Computer Science").duration("4 Years").eligibility("10+2 PCM with 60%").averageFees(250000.0).careerOptions("Software Engineer, Data Scientist").college(c4).build();
            Course btech5 = Course.builder().name("B.Tech CSE").description("B.Tech Computer Science & Engineering").duration("4 Years").eligibility("JEE Advanced Rank").averageFees(220000.0).careerOptions("AI Researcher, Systems Engineer").college(c5).build();
            Course btech6 = Course.builder().name("B.Tech CSE").description("B.Tech Computer Science").duration("4 Years").eligibility("JEE Advanced AIR Top 100").averageFees(230000.0).careerOptions("Quantitative Developer, Founder").college(c6).build();
            Course btech7 = Course.builder().name("B.Tech CSE").description("B.E. Computer Science").duration("4 Years").eligibility("BITSAT Score 320+").averageFees(450000.0).careerOptions("Product Engineer, Tech Lead").college(c7).build();
            Course btech8 = Course.builder().name("B.Tech CSE").description("B.Tech CSE (AI & ML)").duration("4 Years").eligibility("VITEEE Category 1-3").averageFees(198000.0).careerOptions("ML Engineer, Cloud Specialist").college(c8).build();
            Course mca9 = Course.builder().name("MCA").description("Master of Computer Applications").duration("2 Years").eligibility("Graduation with 50%").averageFees(120000.0).careerOptions("Full Stack Developer, QA Lead").college(c9).build();
            Course bba10 = Course.builder().name("BBA").description("Bachelor of Business Administration").duration("3 Years").eligibility("10+2 55% aggregate").averageFees(180000.0).careerOptions("Business Analyst, Product Specialist").college(c10).build();
            Course btech11 = Course.builder().name("B.Tech CSE").description("B.Tech Computer Science & Research").duration("4 Years").eligibility("UGEE / JEE Main Top 0.5%").averageFees(330000.0).careerOptions("Algorithm Specialist, ML Scientist").college(c11).build();
            Course btech12 = Course.builder().name("B.Tech CSE").description("B.E. Computer Engineering").duration("4 Years").eligibility("JEE Main Rank < 25000").averageFees(290000.0).careerOptions("DevOps Engineer, Software Architect").college(c12).build();
            Course btech13 = Course.builder().name("B.Tech M&C").description("B.Tech Mathematics & Computing").duration("4 Years").eligibility("GATE / JEE Top Percentile").averageFees(42000.0).careerOptions("Research Scientist, Algorithmic Trader").college(c13).build();
            Course mca14 = Course.builder().name("MCA").description("Master of Computer Applications").duration("2 Years").eligibility("BCA/B.Sc CS NIMCET Rank").averageFees(145000.0).careerOptions("Senior Software Engineer, System Architect").college(c14).build();
            Course btech15 = Course.builder().name("B.Tech CSE").description("B.Tech Computer Science").duration("4 Years").eligibility("JEE Main Top 1%").averageFees(150000.0).careerOptions("Cloud Architect, Systems Engineer").college(c15).build();
            Course btech16 = Course.builder().name("B.Tech CSE").description("B.Tech CSE (AI & Data Science)").duration("4 Years").eligibility("MET Rank < 3000").averageFees(335000.0).careerOptions("Data Engineer, ML Practitioner").college(c16).build();
            Course mca17 = Course.builder().name("MCA").description("Master of Computer Applications").duration("2 Years").eligibility("Graduation with Math & WBJEE").averageFees(10000.0).careerOptions("Software Developer, Database Lead").college(c17).build();
            Course btech18 = Course.builder().name("B.Tech CSE").description("B.Tech Computer Science & AI").duration("4 Years").eligibility("JEE Main Delhi Rank").averageFees(195000.0).careerOptions("Backend Engineer, AI Specialist").college(c18).build();
            Course btech19 = Course.builder().name("B.Tech CSE").description("B.E. Computer Science").duration("4 Years").eligibility("COMEDK Top 1000 Rank").averageFees(275000.0).careerOptions("Product Developer, Mobile Architect").college(c19).build();
            Course mca20 = Course.builder().name("MCA").description("Master of Computer Applications").duration("2 Years").eligibility("Graduate with 50% + Entrance").averageFees(190000.0).careerOptions("Full Stack Engineer, IT Consultant").college(c20).build();
            Course btech21 = Course.builder().name("B.Tech CSE").description("B.Tech Computer Engineering").duration("4 Years").eligibility("JMI Entrance / JEE Main").averageFees(35000.0).careerOptions("Software Engineer, Security Analyst").college(c21).build();
            Course msc22 = Course.builder().name("M.Sc CS").description("M.Sc in Computer Science").duration("2 Years").eligibility("B.Sc CS / BCA with 60%").averageFees(65000.0).careerOptions("Data Analyst, Web Developer").college(c22).build();
            Course btech23 = Course.builder().name("B.Tech CSE").description("B.E. Computer Science & Engg").duration("4 Years").eligibility("TNEA Rank < 2000").averageFees(50000.0).careerOptions("Systems Developer, Network Engineer").college(c23).build();
            Course btech24 = Course.builder().name("B.Tech CSE").description("B.Tech Computer Science").duration("4 Years").eligibility("KIITEE Score").averageFees(185000.0).careerOptions("Software Engineer, Cloud Developer").college(c24).build();

            courseRepository.save(mca1);
            courseRepository.save(mca2);
            courseRepository.save(mca3);
            courseRepository.save(btech4);
            courseRepository.save(btech5);
            courseRepository.save(btech6);
            courseRepository.save(btech7);
            courseRepository.save(btech8);
            courseRepository.save(mca9);
            courseRepository.save(bba10);
            courseRepository.save(btech11);
            courseRepository.save(btech12);
            courseRepository.save(btech13);
            courseRepository.save(mca14);
            courseRepository.save(btech15);
            courseRepository.save(btech16);
            courseRepository.save(mca17);
            courseRepository.save(btech18);
            courseRepository.save(btech19);
            courseRepository.save(mca20);
            courseRepository.save(btech21);
            courseRepository.save(msc22);
            courseRepository.save(btech23);
            courseRepository.save(btech24);

            // 3. Initialize Scholarships
            Scholarship s1 = Scholarship.builder()
                    .name("Central Sector Scheme of Scholarships")
                    .provider("Ministry of Education")
                    .description("Financial assistance for meritorious university students from low-income families.")
                    .eligibility("80th percentile in 10+2 / Graduation, Family income < 4.5 LPA")
                    .amount(20000.0)
                    .deadline(LocalDate.now().plusMonths(3))
                    .category("Merit-cum-Means")
                    .applicationLink("https://scholarships.gov.in/")
                    .build();

            Scholarship s2 = Scholarship.builder()
                    .name("PM Higher Education Fellowship")
                    .provider("Kendriya Sainik Board")
                    .description("Higher technical and professional degree support for meritorious candidates.")
                    .eligibility("Min 60% in Graduation for technical courses")
                    .amount(36000.0)
                    .deadline(LocalDate.now().plusMonths(1))
                    .category("Technical")
                    .applicationLink("https://ksb.gov.in/")
                    .build();

            Scholarship s3 = Scholarship.builder()
                    .name("State Higher Education Scholarship 2025")
                    .provider("State Education Board")
                    .description("Expired grant program for previous academic cycle.")
                    .eligibility("Minimum 70% in Graduation")
                    .amount(15000.0)
                    .deadline(LocalDate.now().minusDays(15)) // Expired
                    .category("State Grant")
                    .applicationLink("https://education.gov.in/")
                    .build();

            scholarshipRepository.save(s1);
            scholarshipRepository.save(s2);
            scholarshipRepository.save(s3);
            
            System.out.println("Comprehensive UniGuide 12+ Sample Colleges Data Initialized Successfully.");
        }
    }
}
