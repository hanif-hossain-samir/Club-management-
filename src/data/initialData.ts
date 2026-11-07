import type { 
  Club, 
  ClubEvent, 
  Announcement, 
  GalleryItem, 
  ControllerApplication, 
  MemberRequest,
  User 
} from '../types.ts';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Prof. Dr. A. K. M. Rahman',
    email: 'admin@cityuniversity.edu',
    role: 'administrator',
    studentId: 'FAC-1002',
    department: 'Directorate of Student Welfare (DSW)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2021-01-10',
    phone: '+880 1711-234567'
  },
  {
    id: 'usr-ctrl-1',
    name: 'Tanvir Ahmed',
    email: 'controller.tech@cityuniversity.edu',
    role: 'controller',
    studentId: 'CU-21-CSE-045',
    department: 'Computer Science & Engineering',
    semester: '7th Semester',
    clubAffiliation: 'computer_club',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2022-03-15',
    phone: '+880 1822-456789'
  },
  {
    id: 'usr-ctrl-2',
    name: 'Samira Khanam',
    email: 'controller.events@cityuniversity.edu',
    role: 'controller',
    studentId: 'CU-21-BBA-112',
    department: 'Business Administration',
    semester: '6th Semester',
    clubAffiliation: 'events_and_clubs',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2022-06-20',
    phone: '+880 1933-789012'
  },
  {
    id: 'usr-student-1',
    name: 'Nafis Fuad',
    email: 'student@cityuniversity.edu',
    role: 'user',
    studentId: 'CU-23-CSE-188',
    department: 'Computer Science & Engineering',
    semester: '4th Semester',
    clubAffiliation: 'computer_club',
    assignedWing: 'programming',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2023-09-01',
    phone: '+880 1644-123456'
  },
  {
    id: 'usr-student-2',
    name: 'Sadia Islam',
    email: 'sadia.islam@cityuniversity.edu',
    role: 'user',
    studentId: 'CU-23-CSE-042',
    department: 'Computer Science & Engineering',
    semester: '4th Semester',
    clubAffiliation: 'computer_club',
    assignedWing: 'cyber_security',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2023-10-10',
    phone: '+880 1755-987654'
  },
  {
    id: 'usr-student-3',
    name: 'Rakibul Hassan',
    email: 'rakib.hassan@cityuniversity.edu',
    role: 'user',
    studentId: 'CU-22-CSE-115',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    clubAffiliation: 'computer_club',
    assignedWing: 'research',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2023-04-12',
    phone: '+880 1811-345678'
  },
  {
    id: 'usr-student-4',
    name: 'Mahmudul Hasan',
    email: 'mahmud.sports@cityuniversity.edu',
    role: 'user',
    studentId: 'CU-21-EEE-012',
    department: 'Electrical & Electronic Engineering',
    semester: '7th Semester',
    clubAffiliation: 'events_and_clubs',
    assignedWing: 'sports',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2022-11-05',
    phone: '+880 1922-876543'
  },
  {
    id: 'usr-student-5',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@cityuniversity.edu',
    role: 'user',
    studentId: 'CU-24-CSE-301',
    department: 'Computer Science & Engineering',
    semester: '2nd Semester',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2024-02-01',
    phone: '+880 1533-456789'
  }
];

export const INITIAL_CLUBS: Club[] = [
  {
    id: 'computer_club',
    name: 'City University Computer Club',
    shortCode: 'CUCC',
    categoryName: 'Technology & Innovation',
    motto: 'Code. Secure. Discover. Leading the Digital Frontier.',
    establishedYear: 2014,
    totalMembers: 840,
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    email: 'computer.club@cityuniversity.edu',
    hotline: '+880 2-9876543 ext. 201',
    presidentName: 'Zubayer Hossain (CSE 8th Sem)',
    advisorName: 'Engr. Masudur Rahman',
    advisorDesignation: 'Associate Professor & Head of CSE',
    wings: [
      {
        id: 'wing-prog',
        clubId: 'computer_club',
        slug: 'programming',
        name: 'Programming Club',
        kicker: 'CODE & CREATE',
        badge: 'Competitive & Software Engineering',
        iconName: 'Code2',
        shortDesc: 'Build real projects, practice problem-solving, and learn alongside curious developers.',
        fullDesc: 'The Programming Club is the premier hub for competitive programmers and software builders at City University. We host weekly coding contests, algorithm masterclasses, ICPC training camps, and hackathons where students turn ideas into deployable software solutions.',
        bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        vision: 'To nurture world-class competitive problem solvers and full-stack software engineers who represent City University on global platforms.',
        weeklySchedule: 'Every Tuesday & Thursday at 4:30 PM',
        roomLocation: 'Software Lab 402, Academic Building 2',
        conveners: [
          {
            id: 'conv-prog-1',
            name: 'Tanvir Ahmed',
            designation: 'Student Lead & ICPC Coach',
            department: 'CSE',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            email: 'tanvir.prog@cityuniversity.edu'
          },
          {
            id: 'conv-prog-2',
            name: 'Mehnaz Chowdhury',
            designation: 'Competitive Programming Lead',
            department: 'CSE',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            email: 'mehnaz.prog@cityuniversity.edu'
          }
        ],
        keyActivities: [
          'Weekly Codeforces / VJudge virtual contests with problem debriefs',
          'Intra-University Programming Contest (IUPC) series',
          'Full-Stack Web & Mobile App Bootcamps with modern tech stacks',
          'Open-source hackathons and software showcase expos'
        ],
        pastAchievements: [
          { year: '2024', title: 'Top 15 at National Collegiate Programming Contest (NCPC)', description: 'CUCC Team "NullPointer" placed 14th among 180 university teams nationwide.' },
          { year: '2023', title: 'Champions at City Tech Hackathon', description: 'Developed an automated campus green-energy monitoring IoT suite.' },
          { year: '2022', title: 'National ICT Fellowship Awardees', description: 'Three club members won the government ICT innovation grant.' }
        ],
        membershipPerks: [
          'Access to Lab 402 dedicated high-performance dev machines',
          'Free mentoring for Codeforces / LeetCode ratings progression',
          'Exclusive entry to ICPC preliminary selection rounds'
        ]
      },
      {
        id: 'wing-cyber',
        clubId: 'computer_club',
        slug: 'cyber_security',
        name: 'Cyber Security Club',
        kicker: 'SECURE THE FUTURE',
        badge: 'Offensive & Defensive Security',
        iconName: 'ShieldAlert',
        shortDesc: 'Explore ethical hacking, digital safety, and security challenges in a responsible community.',
        fullDesc: 'Dedicated to cultivating ethical security professionals, the Cyber Security Club teaches red-team offensive penetration testing, blue-team defensive analysis, vulnerability assessments, and cloud infrastructure security in fully isolated virtual sandbox labs.',
        bannerUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        vision: 'To build a formidable university cybersecurity battalion capable of safeguarding digital infrastructure and competing internationally in CTFs.',
        weeklySchedule: 'Every Monday & Wednesday at 5:00 PM',
        roomLocation: 'Cyber Range Lab 405, Academic Building 2',
        conveners: [
          {
            id: 'conv-sec-1',
            name: 'Shafayet Ullah',
            designation: 'Offensive Security Lead & Bug Hunter',
            department: 'CSE',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
            email: 'shafayet.sec@cityuniversity.edu'
          }
        ],
        keyActivities: [
          'Hands-on Capture The Flag (CTF) drill sessions on Web, Crypto & Forensics',
          'Vulnerability disclosure and responsible ethical hacking workshops',
          'Hardware security, Wi-Fi auditing, and IoT firmware analysis',
          'Host of the annual City University Inter-University Cyber Shield CTF'
        ],
        pastAchievements: [
          { year: '2024', title: 'Runners-up at National Cyber Drill 2024', description: 'Recognized by BGD e-GOV CIRT for exceptional threat triage.' },
          { year: '2023', title: 'CVE Hall of Fame Mentions', description: 'Club members identified security flaws in 4 global SaaS vendors.' }
        ],
        membershipPerks: [
          'Access to dedicated VPN sandbox and private CTF practice servers',
          'Guidance towards CEH, OSCP, and CompTIA Security+ certifications',
          'Priority registration for City Cyber Shield conference'
        ]
      },
      {
        id: 'wing-research',
        clubId: 'computer_club',
        slug: 'research',
        name: 'Research Club',
        kicker: 'ASK BIG QUESTIONS',
        badge: 'AI, ML & Academic Publishing',
        iconName: 'Microscope',
        shortDesc: 'Turn questions into discoveries through research sessions, peer feedback, and collaboration.',
        fullDesc: 'The Research Club bridges undergraduate coursework with high-impact scientific inquiry. Under faculty mentorship, student researchers conduct empirical experiments, author peer-reviewed manuscripts, and present their findings at prestigious international conferences.',
        bannerUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
        vision: 'To foster an enduring culture of peer-reviewed scientific discovery and high-impact computing research among undergraduate scholars.',
        weeklySchedule: 'Every Saturday at 11:00 AM',
        roomLocation: 'Research Seminar Room 301, Central Library Building',
        conveners: [
          {
            id: 'conv-res-1',
            name: 'Dr. Nadia Parveen',
            designation: 'Faculty Research Advisor',
            department: 'CSE & AI Lab',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
            email: 'nadia.research@cityuniversity.edu'
          },
          {
            id: 'conv-res-2',
            name: 'Faisal Karim',
            designation: 'Senior Student Researcher',
            department: 'CSE',
            avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
            email: 'faisal.res@cityuniversity.edu'
          }
        ],
        keyActivities: [
          'Bi-weekly paper reading and critique roundtables',
          'LaTeX manuscript writing & IEEE/Springer submission bootcamps',
          'Deep Learning research lab experiments on GPU compute clusters',
          'Annual City University Undergraduate Research Symposium'
        ],
        pastAchievements: [
          { year: '2024', title: '5 IEEE Conference Papers Published', description: 'Student papers accepted at IEEE TENSYMP and ICCIT conferences.' },
          { year: '2023', title: 'Best Paper Award in Health Informatics', description: 'Presented deep learning classification of lung CT scans.' }
        ],
        membershipPerks: [
          'Dedicated GPU compute cluster quota for model training',
          'Faculty co-authorship pipelines on funded research grants',
          'Subsidized conference travel registration grants'
        ]
      }
    ]
  },
  {
    id: 'events_and_clubs',
    name: 'City University Events & Clubs',
    shortCode: 'CUEC-Central',
    categoryName: 'Student Life, Athletics & Culture',
    motto: 'Passion. Harmony. Discovery. The Vibrant Heart of Campus.',
    establishedYear: 2012,
    totalMembers: 1420,
    logoUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    email: 'events.club@cityuniversity.edu',
    hotline: '+880 2-9876543 ext. 305',
    presidentName: 'Rifat Al-Mamun (BBA 7th Sem)',
    advisorName: 'Dr. Shahinur Alam',
    advisorDesignation: 'Director, Physical Education & Cultural Affairs',
    wings: [
      {
        id: 'wing-sports',
        clubId: 'events_and_clubs',
        slug: 'sports',
        name: 'Sports Club',
        kicker: 'PLAY AS A TEAM',
        badge: 'Athletics & Competitive Sports',
        iconName: 'Trophy',
        shortDesc: 'Stay active, meet teammates, and represent campus in friendly or seasonal competition.',
        fullDesc: 'The Sports Club promotes fitness, camaraderie, and spirited competition across the university. Organizing intra-university tournaments, league matches, and representing City University in national inter-university athletic meets.',
        bannerUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
        vision: 'To build healthy bodies, disciplined minds, and victorious athletic champions who hoist City University colors high.',
        weeklySchedule: 'Daily practice sessions 4:00 PM – 6:30 PM',
        roomLocation: 'University Gymnasium & Central Sports Ground',
        conveners: [
          {
            id: 'conv-spo-1',
            name: 'Kazi Imtiaz',
            designation: 'General Secretary - Sports Wing',
            department: 'BBA',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
            email: 'imtiaz.sports@cityuniversity.edu'
          }
        ],
        keyActivities: [
          'City Premier Cricket League (CPCL) with 16 departmental teams',
          'Inter-Department Football Championship on university stadium grounds',
          'Winter Indoor Badminton, Table Tennis & Chess Grand Prix',
          'Annual University Sports & Athletic Meet with 25 track events'
        ],
        pastAchievements: [
          { year: '2024', title: 'Inter-University Cricket Tournament Champions', description: 'Defeated 12 universities to lift the Dhaka Divisional Trophy.' },
          { year: '2023', title: 'Runners-up at National Badminton Cup', description: 'Men\'s Doubles team clinched silver medal.' }
        ],
        membershipPerks: [
          'Priority booking for university gymnasium, badminton courts & pitch',
          'Official tournament jerseys and high-grade sports gear kit',
          'Eligibility for City University Athletic Excellence Scholarships'
        ]
      },
      {
        id: 'wing-cultural',
        clubId: 'events_and_clubs',
        slug: 'cultural',
        name: 'Cultural Club',
        kicker: 'EXPRESS YOURSELF',
        badge: 'Music, Drama, Dance & Art',
        iconName: 'Sparkles',
        shortDesc: 'Celebrate creativity through music, performance, art, and cultural events.',
        fullDesc: 'The Cultural Club is the artistic heartbeat of City University. From grand Pohela Boishakh celebrations and Basanta Utsav to the flagship "Rhythm of City" music and theatrical festivals, we provide students the grand stage to shine.',
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        vision: 'To nurture artistic creativity, celebrate rich cultural heritage, and cultivate theatrical and musical excellence across campus.',
        weeklySchedule: 'Every Wednesday & Friday at 4:00 PM',
        roomLocation: 'Central Auditorium & Cultural Rehearsal Studio',
        conveners: [
          {
            id: 'conv-cul-1',
            name: 'Samira Khanam',
            designation: 'Cultural Director & Head Performer',
            department: 'English Literature',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
            email: 'samira.cultural@cityuniversity.edu'
          }
        ],
        keyActivities: [
          'Flagship "Rhythm of City" annual mega cultural festival',
          'Pohela Boishakh Mangal Shobhajatra and traditional fairs',
          'Original stage drama and street theatre productions',
          'Acoustic unplugged jam sessions & university music band tours'
        ],
        pastAchievements: [
          { year: '2024', title: 'Best University Cultural Troupe', description: 'Awarded 1st place in Inter-University Cultural Fest by National Shilpakala.' },
          { year: '2023', title: 'Premiered Original Stage Drama "Oporajeyo"', description: 'Staged 4 sold-out performances in Central Auditorium.' }
        ],
        membershipPerks: [
          'Sound studio access and musical instruments rehearsal slots',
          'Professional workshops with renowned vocalists and dramatists',
          'Direct casting auditions for university stage productions'
        ]
      },
      {
        id: 'wing-tour',
        clubId: 'events_and_clubs',
        slug: 'tour',
        name: 'Tour & Adventure Club',
        kicker: 'GO BEYOND CAMPUS',
        badge: 'Travel, Expeditions & Eco-tourism',
        iconName: 'Compass',
        shortDesc: 'Discover new places, share experiences, and build friendships outside the classroom.',
        fullDesc: 'For wanderers, photographers, and nature enthusiasts, the Tour & Adventure Club conducts well-organized, safe, and breathtaking excursions across Bangladesh and beyond. We combine student rejuvenation with environmental awareness and cultural immersion.',
        bannerUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
        vision: 'To foster adventurous spirit, environmental stewardship, and lifelong friendships through responsible group travel.',
        weeklySchedule: 'Bi-weekly briefing on Thursdays at 4:30 PM',
        roomLocation: 'Student Activity Lounge, Campus Cafeteria Complex',
        conveners: [
          {
            id: 'conv-tour-1',
            name: 'Arif Billah',
            designation: 'Expedition Commander',
            department: 'Civil Engineering',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            email: 'arif.tour@cityuniversity.edu'
          }
        ],
        keyActivities: [
          'Annual Grand Winter Tour (Sajek Valley, Keokradong, or Cox’s Bazar)',
          'Monsoon Eco-Retreat to Sreemangal and Lawachara rainforests',
          'Historical heritage excursions to Mahasthangarh, Paharpur & Panam Nagar',
          'Leave-No-Trace environmental cleanup drives during every expedition'
        ],
        pastAchievements: [
          { year: '2024', title: 'Successfully Completed Keokradong Summit Trek', description: '42 students successfully summited and conducted an eco-cleanup.' },
          { year: '2023', title: 'Zero Incident Safety Record over 12 expeditions', description: 'Commended by University Safety Council for flawless logistics.' }
        ],
        membershipPerks: [
          'Heavy discounts on all official university tour packages',
          'Free tenting and trekking gear rental from club inventory',
          'Early bird reservation for limited-seat expedition buses'
        ]
      }
    ]
  }
];

export const INITIAL_EVENTS: ClubEvent[] = [
  {
    id: 'evt-101',
    title: 'Build Your First Web App',
    kicker: 'WORKSHOP · PROGRAMMING CLUB',
    clubId: 'computer_club',
    wingSlug: 'programming',
    category: 'Workshop',
    description: 'A hands-on introduction to planning and building a simple web experience. · 10:00 AM · Computer Lab',
    fullDetails: 'Join us for a hands-on introduction to planning and building a modern web application with HTML, CSS, JavaScript, and React. Mentors from the Programming Club will guide you step by step through UI components, state management, and deploying live on the web. Free food, stickers, and completion certificates provided.',
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-08',
    time: '10:00 AM - 01:00 PM',
    venue: 'Software Lab 402, Academic Building 2',
    registrationDeadline: '2026-11-06',
    capacity: 150,
    registeredCount: 98,
    chiefGuests: ['Engr. Masudur Rahman (Associate Professor & Head of CSE)'],
    tags: ['Workshop', 'WebDev', 'Programming', 'Frontend'],
    isFeatured: true,
    status: 'upcoming',
    registrations: [
      {
        id: 'reg-01',
        userId: 'usr-student-1',
        userName: 'Nafis Fuad',
        studentId: 'CU-23-CSE-188',
        email: 'student@cityuniversity.edu',
        department: 'CSE',
        registeredAt: '2026-10-18T10:30:00Z',
        ticketCode: 'CUEC-WEB-8812'
      }
    ]
  },
  {
    id: 'evt-102',
    title: 'Campus Cultural Evening',
    kicker: 'COMMUNITY · CULTURAL CLUB',
    clubId: 'events_and_clubs',
    wingSlug: 'cultural',
    category: 'Community',
    description: 'An evening of performances, creative showcases, and student talent. · 4:00 PM · University Auditorium',
    fullDetails: 'An enchanting evening of acoustic sets, classical fusion, theatrical drama, folk dances, and headline performances. Celebrating the rich cultural heritage and student talent of City University under the open amphitheater skies.',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-14',
    time: '04:00 PM - 08:30 PM',
    venue: 'Main University Auditorium',
    registrationDeadline: '2026-11-12',
    capacity: 400,
    registeredCount: 260,
    chiefGuests: ['Dr. Shahinur Alam (Director, Cultural Affairs)'],
    tags: ['Cultural', 'Music', 'Concert', 'Drama'],
    isFeatured: true,
    status: 'upcoming',
    registrations: []
  },
  {
    id: 'evt-103',
    title: 'Cyber Safety Challenge',
    kicker: 'COMPETITION · CYBER SECURITY',
    clubId: 'computer_club',
    wingSlug: 'cyber_security',
    category: 'Competition',
    description: 'Work in teams to solve beginner-friendly security puzzles and learn by doing. · 11:00 AM · Seminar Room',
    fullDetails: 'Hands-on offensive penetration testing and real-time defensive blue teaming in an isolated cyber sandbox arena. Teams will tackle jeopardy-style challenges spanning Web Exploitation, Reverse Engineering, Cryptography, and OSINT.',
    bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-20',
    time: '11:00 AM - 04:00 PM',
    venue: 'Seminar Room, Academic Building 2',
    registrationDeadline: '2026-11-18',
    capacity: 100,
    registeredCount: 72,
    chiefGuests: ['Brigadier Gen. (Retd.) Tariqul Islam'],
    tags: ['CyberSecurity', 'CTF', 'Challenge', 'Infosec'],
    isFeatured: true,
    status: 'upcoming',
    registrations: []
  },
  {
    id: 'evt-104',
    title: 'Symposium on Large Language Models & AI in Healthcare',
    kicker: 'RESEARCH · RESEARCH CLUB',
    clubId: 'computer_club',
    wingSlug: 'research',
    category: 'Research Conference',
    description: 'Leading researchers present breakthroughs in LLMs, biomedical imaging, and Bangla natural language processing.',
    fullDetails: 'Keynote speeches by visiting researchers from national and international universities. Poster presentations by City University research scholars and networking coffee session with academic mentors.',
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-28',
    time: '10:00 AM - 03:30 PM',
    venue: 'Seminar Hall A, Central Library Building',
    registrationDeadline: '2026-11-25',
    capacity: 150,
    registeredCount: 110,
    chiefGuests: ['Prof. Dr. Shamsul Huda (Dean of Engineering)', 'Dr. Anisur Rahman (Senior AI Scientist)'],
    tags: ['AI', 'Research', 'MachineLearning', 'HealthTech'],
    isFeatured: false,
    status: 'upcoming',
    registrations: []
  },
  {
    id: 'evt-105',
    title: 'City Premier Cricket League (CPCL) Grand Finale',
    kicker: 'ATHLETICS · SPORTS CLUB',
    clubId: 'events_and_clubs',
    wingSlug: 'sports',
    category: 'Tournament',
    description: 'The ultimate showdown between CSE Titans and BBA Royals for the coveted university championship trophy.',
    fullDetails: 'Cheer on your departmental teams under the floodlights! Featuring live commentary, DJ music during boundaries, cheer squads, and post-match trophy presentation by the honorable Vice-Chancellor.',
    bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    date: '2026-12-05',
    time: '03:00 PM - 08:30 PM',
    venue: 'University Central Cricket Ground',
    registrationDeadline: '2026-12-03',
    capacity: 1500,
    registeredCount: 920,
    chiefGuests: ['Honorable Vice-Chancellor, City University', 'Habibul Bashar (Former National Cricket Captain)'],
    tags: ['Cricket', 'Sports', 'CPCL', 'Championship'],
    isFeatured: true,
    status: 'upcoming',
    registrations: []
  },
  {
    id: 'evt-106',
    title: 'Sajek Valley Winter Expedition: Above the Clouds',
    kicker: 'EXPEDITION · TOUR CLUB',
    clubId: 'events_and_clubs',
    wingSlug: 'tour',
    category: 'Tour & Adventure',
    description: '3 Days, 2 Nights adventure across the picturesque green hills, cloud kingdoms, and indigenous villages of Sajek.',
    fullDetails: 'Package covers luxury AC coach transport from campus, resort accommodations, all meals (including traditional bamboo chicken dinner), Chander Gari safaris to Konglak Para, campfire music night, and emergency medical kits.',
    bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    date: '2026-12-18',
    time: 'Departure: 09:00 PM (Camp Gate 1)',
    venue: 'Sajek Valley, Rangamati & Khagrachhari',
    registrationDeadline: '2026-12-01',
    capacity: 90,
    registeredCount: 82,
    chiefGuests: ['Campus Student Welfare Travel Directorate'],
    tags: ['Tour', 'Sajek', 'Adventure', 'Nature'],
    isFeatured: true,
    status: 'upcoming',
    registrations: []
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-201',
    title: 'Urgent: Controller Membership Applications Open for Spring 2026 Trimester',
    content: 'The City University Events & Club (CUEC) Central Executive Board invites energetic student leaders to apply for Club Controller positions across Computer Club (Programming, Cyber, Research) and Events & Clubs (Sports, Cultural, Tour). Successful applicants will receive administrative privileges and official university leadership transcripts.',
    clubId: 'all',
    wingSlug: 'all',
    priority: 'urgent',
    publishedAt: '2026-10-18T08:00:00Z',
    authorName: 'Prof. Dr. A. K. M. Rahman',
    authorRole: 'Director of Student Welfare',
    attachmentName: 'CUEC_Controller_Charter_2026.pdf',
    category: 'Recruitment',
    pinned: true
  },
  {
    id: 'ann-202',
    title: 'Selection Roster for Intra-University Programming Contest (IUPC) Announced',
    content: 'Following the preliminary online round on VJudge, the top 45 teams have been shortlisted for the onsite finals at Lab 402. All shortlisted teams are requested to collect their badge passes from the Computer Club office before Thursday 5:00 PM.',
    clubId: 'computer_club',
    wingSlug: 'programming',
    priority: 'competition',
    publishedAt: '2026-10-17T14:30:00Z',
    authorName: 'Tanvir Ahmed',
    authorRole: 'Club Controller (Programming)',
    attachmentName: 'IUPC_Final_Shortlist_2026.xlsx',
    category: 'Contest',
    pinned: true
  },
  {
    id: 'ann-203',
    title: 'Final Auditions for "Rhythm of City 2026" Stage Performers & Musicians',
    content: 'Auditions for vocalists, instrumentalists, classical dancers, and theater actors will be held this Friday and Saturday in the Central Auditorium Rehearsal Studio. Bring your student ID and prepared musical track or monologue.',
    clubId: 'events_and_clubs',
    wingSlug: 'cultural',
    priority: 'important',
    publishedAt: '2026-10-16T11:15:00Z',
    authorName: 'Samira Khanam',
    authorRole: 'Club Controller (Cultural)',
    attachmentName: 'Audition_Guidelines_Schedule.pdf',
    category: 'Audition',
    pinned: false
  },
  {
    id: 'ann-204',
    title: 'Security Alert: Cyber Security Wing Sandbox Maintenance this Weekend',
    content: 'The isolated virtual cyber range on server cluster Alpha will undergo routine kernel updates and flag verification for the upcoming CTF from Friday 11:00 PM to Saturday 06:00 AM.',
    clubId: 'computer_club',
    wingSlug: 'cyber_security',
    priority: 'general',
    publishedAt: '2026-10-15T09:40:00Z',
    authorName: 'Shafayet Ullah',
    authorRole: 'Security Lead',
    category: 'Maintenance',
    pinned: false
  },
  {
    id: 'ann-205',
    title: 'Notice regarding CPCL Cricket Match Rescheduling Due to Ground Maintenance',
    content: 'Match 14 between EEE Thunderbolts and Civil Strikers has been rescheduled to next Monday 3:30 PM due to seasonal outfield aerification by the sports groundskeeping staff.',
    clubId: 'events_and_clubs',
    wingSlug: 'sports',
    priority: 'general',
    publishedAt: '2026-10-14T16:00:00Z',
    authorName: 'Kazi Imtiaz',
    authorRole: 'Sports General Secretary',
    category: 'Sports Schedule',
    pinned: false
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-301',
    title: 'Intra-University Hackathon 24-Hour Final Sprint',
    caption: 'Student coders collaborating late at night inside Software Lab 402 during the final hours of algorithm testing.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    clubId: 'computer_club',
    wingSlug: 'programming',
    eventName: 'City Hackathon 2025',
    date: '2025-11-20',
    photogName: 'CU Media Wing',
    likes: 124
  },
  {
    id: 'gal-302',
    title: 'National Cyber Drill Champions Trophy Presentation',
    caption: 'City Cyber Security team proudly raising the 1st Runner-up shield at BGD e-GOV CIRT headquarters.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    clubId: 'computer_club',
    wingSlug: 'cyber_security',
    eventName: 'National Cyber Drill',
    date: '2025-10-12',
    photogName: 'Faisal Kabir',
    likes: 210
  },
  {
    id: 'gal-303',
    title: 'Rhythm of City Cultural Night Grand Finale',
    caption: 'Over 2,000 students illuminating the open-air amphitheater with phone lights during the musical band performance.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    clubId: 'events_and_clubs',
    wingSlug: 'cultural',
    eventName: 'Rhythm of City Fest',
    date: '2025-12-15',
    photogName: 'Samira Khanam',
    likes: 345
  },
  {
    id: 'gal-304',
    title: 'City Premier Cricket League Victory Lap',
    caption: 'CSE Titans celebrating their heart-stopping last-over victory in the championship final against BBA Royals.',
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=1000&q=80',
    clubId: 'events_and_clubs',
    wingSlug: 'sports',
    eventName: 'CPCL Season 8 Final',
    date: '2025-11-28',
    photogName: 'Tanvir Ahmed',
    likes: 188
  },
  {
    id: 'gal-305',
    title: 'Sunrise above the Clouds at Konglak Para, Sajek',
    caption: 'Tour & Adventure Club members witnessing the magical dawn breaking over the misty mountain valleys.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    clubId: 'events_and_clubs',
    wingSlug: 'tour',
    eventName: 'Sajek Tour 2025',
    date: '2025-12-22',
    photogName: 'Arif Billah',
    likes: 289
  },
  {
    id: 'gal-306',
    title: 'IEEE Research Colloquium Poster Session',
    caption: 'Undergraduate researchers presenting their deep learning Bangla NLP research papers to external faculty evaluators.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    clubId: 'computer_club',
    wingSlug: 'research',
    eventName: 'Undergrad Research Expo',
    date: '2025-09-30',
    photogName: 'CUCC Research Wing',
    likes: 142
  }
];

export const INITIAL_APPLICATIONS: ControllerApplication[] = [
  {
    id: 'app-501',
    applicantName: 'Ahsan Habib',
    applicantEmail: 'ahsan.habib@cityuniversity.edu',
    studentId: 'CU-22-CSE-091',
    department: 'Computer Science & Engineering',
    currentSemester: '6th Semester',
    cgpa: '3.82',
    targetClub: 'computer_club',
    targetWing: 'cyber_security',
    statementOfIntent: 'I have participated in 6 national CTFs and secured a global top 500 ranking on TryHackMe. I want to build a hands-on active cyber defense lab for junior university students and organize the 2026 Inter-University Cyber Shield.',
    experience: 'Former campus lead for Google Developer Student Clubs (GDSC) Cybersecurity track; published a vulnerability writeup on HackTheBox with 4,000+ views.',
    portfolioLink: 'https://github.com/ahsan-cyber',
    status: 'pending',
    submittedAt: '2026-10-18T11:20:00Z'
  },
  {
    id: 'app-502',
    applicantName: 'Sadia Jahan',
    applicantEmail: 'sadia.jahan@cityuniversity.edu',
    studentId: 'CU-22-ENG-034',
    department: 'English & Humanities',
    currentSemester: '5th Semester',
    cgpa: '3.75',
    targetClub: 'events_and_clubs',
    targetWing: 'cultural',
    statementOfIntent: 'Passionate about theater, poetry recitals, and music. I wish to coordinate our drama troupe productions and arrange open-mic acoustic events to enrich student emotional wellbeing.',
    experience: 'Director of the freshmen orientation play 2024; classically trained vocalist for 8 years.',
    portfolioLink: 'https://instagram.com/sadia_theatre',
    status: 'pending',
    submittedAt: '2026-10-17T16:45:00Z'
  },
  {
    id: 'app-503',
    applicantName: 'Mahmudul Hasan',
    applicantEmail: 'mahmud.sports@cityuniversity.edu',
    studentId: 'CU-21-EEE-012',
    department: 'Electrical & Electronic Engineering',
    currentSemester: '7th Semester',
    cgpa: '3.60',
    targetClub: 'events_and_clubs',
    targetWing: 'sports',
    statementOfIntent: 'Served as vice-captain of the university cricket team. I aim to formalize the intra-departmental tournament fixtures with digital score tracking and medical safety standards.',
    experience: 'Organized CPCL Season 8 with 16 teams; represented City University in National University Cricket championship.',
    status: 'approved',
    submittedAt: '2026-10-10T09:00:00Z',
    reviewedAt: '2026-10-12T14:00:00Z',
    reviewedBy: 'Prof. Dr. A. K. M. Rahman',
    adminNotes: 'Candidate has proven leadership record and stellar sportsmanship. Approved as Assistant Controller for Sports.'
  },
  {
    id: 'app-504',
    applicantName: 'Imran Tariq',
    applicantEmail: 'imran.tariq@cityuniversity.edu',
    studentId: 'CU-24-CSE-210',
    department: 'Computer Science & Engineering',
    currentSemester: '2nd Semester',
    cgpa: '2.95',
    targetClub: 'computer_club',
    targetWing: 'programming',
    statementOfIntent: 'I want to be club controller to learn competitive programming.',
    experience: 'Just started learning C++ in trimester 1.',
    status: 'rejected',
    submittedAt: '2026-10-08T10:15:00Z',
    reviewedAt: '2026-10-09T11:00:00Z',
    reviewedBy: 'Prof. Dr. A. K. M. Rahman',
    adminNotes: 'Applicant is in 2nd semester; prerequisite minimum 4th semester and CGPA 3.20 required for executive controller position. Encouraged to join as regular student member first.'
  }
];

export const INITIAL_MEMBER_REQUESTS: MemberRequest[] = [
  {
    id: 'mreq-1',
    userId: 'usr-student-5',
    name: 'Nusrat Jahan',
    studentId: 'CU-24-CSE-301',
    email: 'nusrat.jahan@cityuniversity.edu',
    department: 'Computer Science & Engineering',
    clubId: 'computer_club',
    wingSlug: 'cyber_security',
    reason: 'I am passionate about ethical hacking, digital forensics, and CTF challenges. I want to actively participate in the weekly cyber range drills.',
    status: 'pending',
    submittedAt: '2026-10-25T10:30:00Z'
  },
  {
    id: 'mreq-2',
    userId: 'usr-student-new',
    name: 'Tanzid Hasan',
    studentId: 'CU-24-BBA-055',
    email: 'tanzid.hasan@cityuniversity.edu',
    department: 'Business Administration (BBA)',
    clubId: 'events_and_clubs',
    wingSlug: 'sports',
    reason: 'Active football and cricket player. Looking forward to representing our varsity in inter-university athletic meets.',
    status: 'pending',
    submittedAt: '2026-10-26T14:15:00Z'
  },
  {
    id: 'mreq-3',
    userId: 'usr-student-1',
    name: 'Nafis Fuad',
    studentId: 'CU-23-CSE-188',
    email: 'student@cityuniversity.edu',
    department: 'Computer Science & Engineering',
    clubId: 'computer_club',
    wingSlug: 'programming',
    reason: 'Dedicated competitive programmer aiming to represent City University at ICPC regional preliminaries.',
    status: 'approved',
    submittedAt: '2026-10-15T09:00:00Z',
    reviewedAt: '2026-10-16T11:00:00Z',
    reviewedBy: 'Tanvir Ahmed (Controller)'
  },
  {
    id: 'mreq-4',
    userId: 'usr-student-rejected',
    name: 'Kamrul Ahsan',
    studentId: 'CU-24-ENG-089',
    email: 'kamrul.ahsan@cityuniversity.edu',
    department: 'English & Humanities',
    clubId: 'computer_club',
    wingSlug: 'research',
    reason: 'Interested in tech research.',
    status: 'rejected',
    submittedAt: '2026-10-12T16:00:00Z',
    reviewedAt: '2026-10-13T10:00:00Z',
    reviewedBy: 'Tanvir Ahmed (Controller)'
  }
];

