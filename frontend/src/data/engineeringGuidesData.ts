export interface GuideSection {
  heading: string;
  subsections?: {
    title: string;
    body: string[];
    bulletPoints?: string[];
    proTip?: string;
  }[];
}

export interface EngineeringGuide {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  excerpt: string;
  category: 'Project Selection' | 'Full-Stack' | 'Viva & Exams' | 'Study & PYQs' | 'Deployment';
  readTime: string;
  datePublished: string;
  author: string;
  featuredBadge: string;
  tags: string[];
  ctaText: string;
  ctaLink: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
}

export const ENGINEERING_GUIDES: EngineeringGuide[] = [
  {
    slug: 'btech-final-year-project-selection-guide',
    title: 'How to Choose the Best Final Year Project for B.Tech CSE (2026 Guide)',
    seoTitle: 'How to Choose the Best Final Year Project for B.Tech CSE | CampusGet',
    metaDescription: 'A complete step-by-step guide for B.Tech CSE students on selecting high-scoring major projects, IEEE report formats, system architecture, and viva defense.',
    keywords: 'btech cse final year project ideas, computer science major project selection, ieee project report format, btech project viva preparation',
    excerpt: 'Choosing the right major project determines your final-year GPA, technical portfolio strength, and campus placement interviews. Here is how to pick a high-impact project without panic.',
    category: 'Project Selection',
    readTime: '6 min read',
    datePublished: '2026-10-26',
    author: 'CampusGet Engineering Desk',
    featuredBadge: 'Most Popular Guide',
    tags: ['B.Tech CSE', 'Project Selection', 'IEEE Format', 'Viva Voce', 'Campus Placements'],
    ctaText: 'Explore Verified Major Projects',
    ctaLink: '/projects',
    sections: [
      {
        heading: '1. What Makes an Engineering Project Stand Out?',
        subsections: [
          {
            title: 'Real-World Utility Over Abstract Theoretical Models',
            body: [
              'College evaluation committees and external examiners evaluate projects based on practical utility, technical depth, and presentation clarity rather than unnecessary complexity.',
              'A cleanly structured MERN stack or AI-driven SaaS platform that solves an actual operational workflow (such as hospital management, resume analysis, or campus asset tracking) scores significantly higher than an unfinished or bug-ridden complex model.',
            ],
            proTip: 'Examiners appreciate candidates who can defend every line of code, explain the database schema, and demonstrate error-handling during the live demo.',
          },
          {
            title: 'The Three Golden Evaluation Pillars',
            body: [
              'When choosing your topic, evaluate it against three essential benchmarks:',
            ],
            bulletPoints: [
              'Technical Depth: Demonstrates full-stack CRUD capabilities, authentication (JWT/OAuth), role-based permissions, and database indexing.',
              'Academic Deliverables: Comprehensive documentation including IEEE synopsis, SRS document, ER diagrams, data flow diagrams (DFD), and PPT slides.',
              'Viva Defensibility: Code you can explain line-by-line without relying on mysterious third-party black-box libraries.',
            ],
          },
        ],
      },
      {
        heading: '2. Top Technical Domains for 2026–2027 CSE Submissions',
        subsections: [
          {
            title: 'Full-Stack Web Architectures (React, Node.js, MongoDB)',
            body: [
              'Full-stack applications remain the gold standard for employability. Recruiters and college panels prioritize students who demonstrate full control over frontend reactivity, RESTful API design, and database relationships.',
            ],
            bulletPoints: [
              'Healthcare & Hospital Management Systems with Doctor Scheduling',
              'Multi-Vendor E-Commerce Platforms with Payment Gateway Integration',
              'Collaborative Real-Time Workspace or Ticket Management Suites',
            ],
          },
          {
            title: 'AI & Data-Driven Decision Engines',
            body: [
              'Projects combining an interactive web dashboard with machine learning models (like natural language parsing or predictive algorithms) create massive impact during placement interviews.',
            ],
            bulletPoints: [
              'AI Resume Screening & Keyword Match Scoring Engine',
              'Customer Churn Prediction & Analytics Dashboard',
              'Automated Code Evaluation & Feedback Portal',
            ],
          },
        ],
      },
      {
        heading: '3. Essential Academic Deliverables You Must Prepare',
        subsections: [
          {
            title: 'Complete IEEE Project Documentation Checklist',
            body: [
              'Never wait until the final submission week to start your project report. Ensure you have the following assets ready alongside your source code:',
            ],
            bulletPoints: [
              'Project Synopsis (1–2 Pages): Problem statement, proposed solution, technology stack, and hardware/software specifications.',
              'Software Requirement Specification (SRS): Functional and non-functional requirements aligned with IEEE 830 standards.',
              'Architectural Diagrams: High-Level System Architecture, Component Diagrams, and State Transition Diagrams.',
              'Database Design: Entity-Relationship (ER) Diagram with Cardinality and Normalized Table Schemas (3NF).',
              'Presentation Deck (.PPTX): 12–15 structured slides focusing on problem scope, architecture, key features, demo screenshots, and future scope.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I use a project template from CampusGet for my final semester submission?',
        answer: 'Yes! All CampusGet project packages provide complete production-grade source code, database scripts, SRS reports, and presentation decks. You can customize the user interface, extend features, and adapt the branding for your institutional requirements.',
      },
      {
        question: 'How do I explain my project to external examiners during viva voce?',
        answer: 'Focus on 4 key areas: 1) What real problem does it solve, 2) Why did you choose your technology stack, 3) How do database schemas and APIs interact, and 4) Walk through a live user workflow smoothly.',
      },
    ],
  },
  {
    slug: 'top-mern-stack-projects-with-source-code',
    title: 'Top MERN Stack Projects with Full Source Code, PPT & Reports for Students',
    seoTitle: 'Top MERN Stack Projects with Source Code & IEEE Reports | CampusGet',
    metaDescription: 'Explore the best MERN stack (MongoDB, Express, React, Node.js) final year projects with ready-to-run source code, database seeds, and IEEE documentation.',
    keywords: 'mern stack project source code, react nodejs final year project, btech mern project download, mern project with documentation and ppt',
    excerpt: 'Looking for a solid MERN stack project that impresses professors and placement interviewers? Here are the top architectures with clean modular code and setup guides.',
    category: 'Full-Stack',
    readTime: '5 min read',
    datePublished: '2026-10-26',
    author: 'CampusGet Engineering Desk',
    featuredBadge: 'High Career Value',
    tags: ['MERN Stack', 'React.js', 'Node.js', 'MongoDB', 'Express', 'Source Code'],
    ctaText: 'Browse MERN Stack Projects',
    ctaLink: '/projects?category=mern-stack',
    sections: [
      {
        heading: '1. Why MERN Stack Dominates Academic and Placement Evaluations',
        subsections: [
          {
            title: 'Unified JavaScript Ecosystem & Modern UI Patterns',
            body: [
              'Using a single language (JavaScript/TypeScript) across both the client-side user interface (React) and the server-side business logic (Node.js/Express) allows students to master full-stack concepts faster.',
              'MongoDB provides flexible JSON-like document storage that aligns naturally with frontend React state, eliminating complex Object-Relational Mapping (ORM) overhead.',
            ],
            proTip: 'Highlighting asynchronous middleware (async/await), JWT authentication, and Tailwind CSS styling gives your demo an immediate industry-standard appearance.',
          },
        ],
      },
      {
        heading: '2. Top 3 MERN Stack Projects Recommended for CSE Students',
        subsections: [
          {
            title: 'Project 1: Multi-Role Hospital & Clinic Management Suite',
            body: [
              'A complete hospital ERP featuring 3 distinct role-based access portals: Patients, Doctors, and System Administrators.',
            ],
            bulletPoints: [
              'Patient Portal: Appointment booking, medical history download, prescription viewer.',
              'Doctor Dashboard: Daily patient queue, digital diagnosis note authoring, schedule management.',
              'Admin Analytics: Revenue tracking, department load charts, staff audit logs.',
            ],
          },
          {
            title: 'Project 2: E-Commerce Platform with Live Razorpay Gateway & Admin CMS',
            body: [
              'A full-fledged commercial digital storefront featuring shopping cart state persistence, discount coupons, automated invoice PDF generation, and Razorpay payment verification.',
            ],
          },
          {
            title: 'Project 3: AI Resume Screener & ATS Match Analyzer',
            body: [
              'An innovative productivity tool where candidates upload PDF resumes, and the backend engine calculates keyword match scores against job descriptions using natural language tokenization.',
            ],
          },
        ],
      },
      {
        heading: '3. What Should Every Production-Ready MERN Project Include?',
        subsections: [
          {
            title: 'Key Engineering Checklist for Flawless Demonstration',
            body: [
              'To ensure your project runs smoothly on your laptop and server without crashing in front of examiners:',
            ],
            bulletPoints: [
              'Environment Configuration (.env): Strictly separate database connection strings, JWT secrets, and port numbers from your codebase.',
              'Database Seeding Script: Include an automated seed script (`npm run seed`) so dummy users, products, and categories populate in 2 seconds.',
              'Clean Component Hierarchy: Modular React folder structure separating components, pages, context, and API service hooks.',
              'Error Boundaries & Toast Alerts: Friendly user notifications instead of blank screens when network interruptions occur.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Are CampusGet MERN stack projects beginner-friendly?',
        answer: 'Yes! Every package includes a step-by-step local setup guide, pre-configured package.json dependencies, and clean code comments so you can understand and run it in minutes.',
      },
      {
        question: 'Can I add new features or modify the branding of the project?',
        answer: 'Absolutely. You receive 100% source code access with full rights to edit colors, swap logos, modify database schemas, or add new API endpoints.',
      },
    ],
  },
  {
    slug: 'how-to-crack-engineering-project-viva',
    title: 'How to Crack College Project Viva Voce & Technical Defense with 90%+ Marks',
    seoTitle: 'How to Crack College Project Viva Voce (Top Questions & Answers) | CampusGet',
    metaDescription: 'Master your final year B.Tech project viva voce with expert answers to top examiner questions, architecture explanations, database defense, and demo tips.',
    keywords: 'project viva voce questions and answers, how to crack btech viva, engineering project presentation tips, final semester viva questions cse',
    excerpt: 'Examiners don’t expect you to have built Google, but they expect you to thoroughly understand what you submitted. Master these viva voce defense strategies.',
    category: 'Viva & Exams',
    readTime: '6 min read',
    datePublished: '2026-10-26',
    author: 'CampusGet Academic Board',
    featuredBadge: 'Exam Strategy',
    tags: ['Viva Voce', 'External Examiner', 'Presentation Skills', 'B.Tech CSE', 'Defense Prep'],
    ctaText: 'View Viva Prep Material',
    ctaLink: '/placement-prep',
    sections: [
      {
        heading: '1. The Psychology of External Examiners',
        subsections: [
          {
            title: 'What Examiners Really Want to Hear',
            body: [
              'External examiners review dozens of projects in a single day. They quickly identify students who wrote or understood their code versus those who simply copied a random archive without testing.',
              'They test your understanding across three core boundaries: Architectural choice rationale, database relationships, and edge-case handling.',
            ],
            proTip: 'Never guess an answer blindly. If you do not know a specific obscure library parameter, explain the underlying computer science principle and offer to demonstrate the behavior in code.',
          },
        ],
      },
      {
        heading: '2. Top 5 Viva Voce Questions & How to Answer Them',
        subsections: [
          {
            title: 'Q1: "Why did you choose MongoDB over MySQL (or vice versa)?"',
            body: [
              'Model Answer: "We selected MongoDB because our application data structure consists of dynamic attributes (e.g. variable product specifications or flexible user profiles) where JSON-like documents fit naturally without requiring expensive ALTER TABLE migrations. Additionally, its native horizontal scalability and easy integration with Node.js optimized our development workflow."',
            ],
          },
          {
            title: 'Q2: "How does your user authentication work? Is it secure?"',
            body: [
              'Model Answer: "We implemented token-based authentication using JSON Web Tokens (JWT). Passwords are never stored as plaintext; they are salted and hashed using bcrypt with 10 salt rounds. Protected routes use an authorization middleware that verifies token signatures on the server before granting access."',
            ],
          },
          {
            title: 'Q3: "What were the major technical challenges you faced during development?"',
            body: [
              'Examiners love this question because it proves you actually touched the code. Mention a realistic challenge such as handling asynchronous state management, optimizing database queries with proper indexing, or integrating third-party webhook verification.',
            ],
          },
        ],
      },
      {
        heading: '3. Live Demonstration Best Practices',
        subsections: [
          {
            title: 'Avoiding the Dreaded "Demo Failure"',
            body: [
              'Follow these defensive preparation steps on the morning of your viva:',
            ],
            bulletPoints: [
              'Run on Localhost First: Do not depend solely on college Wi-Fi. Ensure the project runs smoothly locally with MongoDB running as a local service or cached database.',
              'Pre-Populate Clean Test Data: Never show an empty table. Pre-seed users, orders, or records so charts and lists look vibrant.',
              'Keep Code Opened in VS Code: Have the main controller, routes, and model files open in tabs so you can jump to them in 2 seconds when requested.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Do CampusGet project packages include viva voce questions?',
        answer: 'Yes! Every project package includes dedicated viva voce preparation documents covering architecture explanations, database schemas, and typical examiner questions.',
      },
    ],
  },
  {
    slug: 'aktu-vtu-engineering-exam-notes-pyq-strategy',
    title: 'AKTU & University Exam Preparation: Effective Notes & PYQs Strategy',
    seoTitle: 'AKTU & University Exam Preparation: Free PYQs & Notes Strategy | CampusGet',
    metaDescription: 'Proven preparation roadmap to score 8.5+ CGPA in AKTU, VTU, and university engineering semester exams using previous year questions (PYQs) and unit notes.',
    keywords: 'aktu previous year question papers, aktu pyqs free download, aktu cse handwritten notes, vtu exam preparation strategy, engineering semester study roadmap',
    excerpt: '70% of university exam questions repeat core concepts from the last 5 years. Here is the exact strategy toppers use to score high marks with minimal cramming.',
    category: 'Study & PYQs',
    readTime: '5 min read',
    datePublished: '2026-10-26',
    author: 'CampusGet Academic Board',
    featuredBadge: 'High CGPA Guide',
    tags: ['AKTU', 'VTU', 'PYQs', 'Engineering Notes', 'Semester Exams', 'B.Tech'],
    ctaText: 'Download Free Notes & PYQs',
    ctaLink: '/study-materials',
    sections: [
      {
        heading: '1. The 80/20 Rule of University Semester Exams',
        subsections: [
          {
            title: 'Why Studying Everything Equally is Inefficient',
            body: [
              'University engineering syllabi (AKTU, VTU, RGPV, MAKAUT) are vast. However, examination blueprints consistently reward deep mastery of high-frequency units and recurring previous year questions.',
              'By analyzing question papers from the past 3 to 5 years, you can identify the exact 20% of topics that generate 80% of total exam marks.',
            ],
            proTip: 'Always start with Unit 1 and Unit 2 for fundamental definitions, then prioritize the specific high-mark numericals or algorithms that recur in Section C.',
          },
        ],
      },
      {
        heading: '2. The 3-Step Exam Preparation Blueprint',
        subsections: [
          {
            title: 'Step 1: Download Verified Unit-Wise PDF Notes',
            body: [
              'Avoid unstructured, messy photocopies. Use clean, chapter-wise verified lecture notes that highlight key definitions, mathematical derivations, and schematic diagrams clearly.',
            ],
          },
          {
            title: 'Step 2: Solve Recurring Previous Year Questions (PYQs)',
            body: [
              'Practice writing answers in the exact format required by university checkers: Structured headings, neat pencil diagrams, bullet points, and boxed final answers.',
            ],
          },
          {
            title: 'Step 3: Create One-Page Formula & Diagram Cheatsheets',
            body: [
              'For subjects like Data Structures, DBMS, Operating Systems, or Computer Networks, condense the key algorithm steps (like Dijkstra, Round Robin, or QuickSort) into single-page quick revision notes.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Are study materials and PYQs on CampusGet really 100% free?',
        answer: 'Yes! All university lecture notes, semester previous year question papers (PYQs), lab manuals, and syllabus copies are freely downloadable with direct 1-click access without any registration or hidden fees.',
      },
    ],
  },
  {
    slug: 'full-stack-project-local-setup-deployment-guide',
    title: 'How to Run, Debug & Deploy Full-Stack Projects Locally: Complete Setup Guide',
    seoTitle: 'How to Run & Deploy Full-Stack Projects Locally (Node, React, MongoDB) | CampusGet',
    metaDescription: 'Step-by-step developer tutorial on running, debugging, and deploying full-stack MERN projects locally on Windows/Mac and deploying to Vercel and Render.',
    keywords: 'how to run mern project locally, mongodb atlas connection tutorial, nodejs react project setup guide, deploy mern app to render and vercel',
    excerpt: 'Facing "npm install" errors, MongoDB connection timeouts, or CORS issues? Here is the definitive guide to running and deploying modern full-stack projects smoothly.',
    category: 'Deployment',
    readTime: '7 min read',
    datePublished: '2026-10-26',
    author: 'CampusGet Engineering Desk',
    featuredBadge: 'Developer Tutorial',
    tags: ['Local Setup', 'Deployment', 'MongoDB Atlas', 'Vercel', 'Render', 'Node.js'],
    ctaText: 'Get Production Ready Code',
    ctaLink: '/projects',
    sections: [
      {
        heading: '1. Prerequisites & Clean Development Environment',
        subsections: [
          {
            title: 'Required Software Checklist',
            body: [
              'Before unzipping or cloning your project repository, ensure your development machine has the following modern tools installed:',
            ],
            bulletPoints: [
              'Node.js (LTS version 18.x or 20.x): Includes npm package manager.',
              'Git: For version tracking and code management.',
              'Visual Studio Code: Recommended code editor with ESLint and Prettier extensions.',
              'MongoDB Compass: Desktop GUI tool to visually inspect your database collections.',
            ],
          },
        ],
      },
      {
        heading: '2. Step-by-Step Local Execution Workflow',
        subsections: [
          {
            title: 'Step 1: Unzip & Open in VS Code',
            body: [
              'Extract the project ZIP file to a clean folder path (e.g. `C:\\projects\\my-app` on Windows or `~/projects/my-app` on Mac/Linux). Open the root folder in VS Code.',
            ],
          },
          {
            title: 'Step 2: Backend Dependencies & Environment Setup',
            body: [
              'Open a terminal, navigate into the backend folder, and install all dependencies:',
              '`cd backend && npm install`',
              'Next, create a `.env` file from `.env.example` and set your MongoDB URI and port number.',
            ],
            proTip: 'For free cloud database hosting, create a free MongoDB Atlas cluster and whitelist IP 0.0.0.0/0 to allow connections from your machine.',
          },
          {
            title: 'Step 3: Frontend Dependencies & Launch',
            body: [
              'Open a second terminal window, navigate into the frontend folder, and run:',
              '`cd frontend && npm install && npm run dev`',
              'Your frontend will launch automatically on `http://localhost:5173` or `http://localhost:3000`.',
            ],
          },
        ],
      },
      {
        heading: '3. Deploying for Free to the Cloud (Vercel & Render)',
        subsections: [
          {
            title: 'Frontend on Vercel',
            body: [
              'Push your frontend code to GitHub, connect your repository to Vercel, and set the build command to `npm run build` and output directory to `dist`. Your site goes live on a fast global CDN in 60 seconds.',
            ],
          },
          {
            title: 'Backend on Render',
            body: [
              'Create a Web Service on Render, connect your backend repository, add your environment variables (`MONGO_URI`, `JWT_SECRET`), and set start command to `node dist/index.js` or `npm start`.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What if I face an error while setting up a CampusGet project package?',
        answer: 'Every project includes a comprehensive Setup Guide with exact commands. Additionally, our developer support team is available on WhatsApp to assist you in resolving environment or configuration errors.',
      },
    ],
  },
];
