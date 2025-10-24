// --- 1. MOCKUP DATA (Used to simulate Firestore/Database) ---
const MOCK_POINT_CAP = 5000; // Maximum points a student can earn before spending
const PENDING_REQUESTS_KEY = 'momentum_pending_requests'; // LocalStorage key
const DAILY_GIVE_LIMIT = 3; // Maximum behavior points a student can give per day
const DAILY_RECEIVE_LIMIT = 2; // Maximum behavior points a student can receive per day
const BEHAVIOR_POINTS_AMOUNT = 50; // Fixed amount for student behavior points
const TEACHER_BEHAVIOR_MAX = 200; // Maximum points teacher can give for behavior
const TUTORING_COST = 50; // Cost to ask a tutoring question
const TUTORING_REWARD = 100; // Points earned for answering a question
const WEEKLY_QUESTION_LIMIT = 1; // Maximum questions per week

// Default point values for different task types
const DEFAULT_POINTS = {
    homework: 25,
    classwork: 50,
    quiz: 100,
    test: 500,
    project: 500
};

// Rank system with point thresholds
const RANK_SYSTEM = {
    BRONZE: { name: 'Bronze', threshold: 0, color: 'bronze', next: 'SILVER' },
    SILVER: { name: 'Silver', threshold: 1000, color: 'silver', next: 'GOLD' },
    GOLD: { name: 'Gold', threshold: 2500, color: 'gold', next: 'DIAMOND' },
    DIAMOND: { name: 'Diamond', threshold: 4000, color: 'diamond', next: 'MASTER' },
    MASTER: { name: 'Master', threshold: 6000, color: 'master', next: 'ELITE' },
    ELITE: { name: 'Elite', threshold: 8000, color: 'elite', next: null }
};

// Daily behavior point tracking
let dailyPointsGiven = JSON.parse(localStorage.getItem('dailyPointsGiven') || '{}');
let dailyPointsReceived = JSON.parse(localStorage.getItem('dailyPointsReceived') || '{}');
let dailyGivenTo = JSON.parse(localStorage.getItem('dailyGivenTo') || '{}'); // Track who you gave to today

const MOCK_USERS = {
    'alice@school.edu': { name: 'Alice Chen', role: 'Student', points: 3250, rank: 1, class: 'Block-A' },
    'james@school.edu': { name: 'James Miller', role: 'Student', points: 3010, rank: 2, class: 'Block-A' },
    'bob@school.edu': { name: 'Bob Davis', role: 'Student', points: 2500, rank: 3, class: 'Block-A' },
    'maria@school.edu': { name: 'Maria Lopez', role: 'Student', points: 2150, rank: 4, class: 'Block-A' },
    'charlie@school.edu': { name: 'Charlie Green', role: 'Student', points: 1800, rank: 5, class: 'Block-A' },
    'david@school.edu': { name: 'David Lee', role: 'Student', points: 1500, rank: 6, class: 'Block-A' },
    'sophia@school.edu': { name: 'Sophia Kim', role: 'Student', points: 1200, rank: 7, class: 'Block-A' },
    'ms.smith@school.edu': { name: 'Ms. Smith', role: 'Teacher', class: 'Block-A' },
    'mr.jones@school.edu': { name: 'Mr. Jones', role: 'Teacher', class: 'Block-B' },
    'ms.davis@school.edu': { name: 'Ms. Davis', role: 'Teacher', class: 'Block-C' },
    'mr.wilson@school.edu': { name: 'Mr. Wilson', role: 'Teacher', class: 'Block-D' },
    'ms.brown@school.edu': { name: 'Ms. Brown', role: 'Teacher', class: 'Block-E' },
    'admin@school.edu': { name: 'Mr. Johnson', role: 'Admin' }
};

let MOCK_TASKS = [
    // Students create their own tasks for organization and planning
];

// Grade configuration
const GRADE_CONFIG = {
    totalBlocks: 8, // Default 8 blocks/classes for grade 8
    currentGrade: 8
};

// Class competition data - 8 blocks by default (placeholder names)
const CLASS_BLOCKS = {
    'Block-A': { totalPoints: 16890, rank: 1, students: 8, grade: 8, school: 'Northside Academy', blockId: 'A' },
    'Block-B': { totalPoints: 15420, rank: 2, students: 7, grade: 8, school: 'Eastwood Middle', blockId: 'B' },
    'Block-C': { totalPoints: 14230, rank: 3, students: 6, grade: 8, school: 'Riverside Prep', blockId: 'C' },
    'Block-D': { totalPoints: 13850, rank: 4, students: 9, grade: 8, school: 'Westfield Academy', blockId: 'D' },
    'Block-E': { totalPoints: 13200, rank: 5, students: 8, grade: 8, school: 'Southgate Middle', blockId: 'E' },
    'Block-F': { totalPoints: 12750, rank: 6, students: 7, grade: 8, school: 'Central Valley', blockId: 'F' },
    'Block-G': { totalPoints: 12100, rank: 7, students: 6, grade: 8, school: 'Highland Middle', blockId: 'G' },
    'Block-H': { totalPoints: 11500, rank: 8, students: 8, grade: 8, school: 'Oakwood Academy', blockId: 'H' }
};

// Grade-level competition (all 8 classes/blocks in grade 8)
const GRADE_COMPETITION = {
    8: {
        totalBlocks: GRADE_CONFIG.totalBlocks,
        totalStudents: Object.values(CLASS_BLOCKS).reduce((sum, block) => sum + block.students, 0),
        totalPoints: Object.values(CLASS_BLOCKS).reduce((sum, block) => sum + block.totalPoints, 0)
    }
};

// In-app currency for customization (Scholy Coins)
let studentCurrency = JSON.parse(localStorage.getItem('studentCurrency') || '{}');

// Student-created tasks
let studentTasks = JSON.parse(localStorage.getItem('studentTasks') || '[]');

// Shop system constants
const SCHOLY_BOX_COST = 100; // Cost in points to buy a Scholy box
const SCHOLYS_PER_BOX = 5; // Number of Scholys in each box

// Scholy collection system (like Blooket blooks)
const SCHOLY_TYPES = {
    // Common Scholys (70% chance)
    common: [
        { id: 'book', name: 'Bookworm', emoji: '📚', rarity: 'common', description: 'A studious scholar' },
        { id: 'pencil', name: 'Pencil Pal', emoji: '✏️', rarity: 'common', description: 'Always ready to write' },
        { id: 'apple', name: 'Teacher\'s Pet', emoji: '🍎', rarity: 'common', description: 'The classic student' },
        { id: 'backpack', name: 'Pack Master', emoji: '🎒', rarity: 'common', description: 'Organized and ready' },
        { id: 'calculator', name: 'Math Whiz', emoji: '🧮', rarity: 'common', description: 'Numbers are friends' }
    ],
    // Uncommon Scholys (20% chance)
    uncommon: [
        { id: 'trophy', name: 'Champion', emoji: '🏆', rarity: 'uncommon', description: 'Victory is sweet' },
        { id: 'star', name: 'Star Student', emoji: '⭐', rarity: 'uncommon', description: 'Shining bright' },
        { id: 'medal', name: 'Achiever', emoji: '🏅', rarity: 'uncommon', description: 'Excellence personified' },
        { id: 'crown', name: 'Class Royalty', emoji: '👑', rarity: 'uncommon', description: 'Ruler of academics' }
    ],
    // Rare Scholys (8% chance)
    rare: [
        { id: 'wizard', name: 'Study Wizard', emoji: '🧙‍♂️', rarity: 'rare', description: 'Master of all subjects' },
        { id: 'rocket', name: 'Sky Rocket', emoji: '🚀', rarity: 'rare', description: 'Reaching for the stars' },
        { id: 'diamond', name: 'Diamond Mind', emoji: '💎', rarity: 'rare', description: 'Brilliant and precious' }
    ],
    // Epic Scholys (2% chance)
    epic: [
        { id: 'rainbow', name: 'Rainbow Scholar', emoji: '🌈', rarity: 'epic', description: 'Colorful knowledge' },
        { id: 'unicorn', name: 'Unicorn Genius', emoji: '🦄', rarity: 'epic', description: 'Magical intelligence' }
    ]
};

// Student profiles and Scholy collections
let studentProfiles = JSON.parse(localStorage.getItem('studentProfiles') || '{}');
let studentScholys = JSON.parse(localStorage.getItem('studentScholys') || '{}');

// Block/Course management (like Schoology courses)
let schoolBlocks = JSON.parse(localStorage.getItem('schoolBlocks') || JSON.stringify({
    'Block-A': { name: 'Block A - Math & Science', students: [], teacher: null, active: true },
    'Block-B': { name: 'Block B - English & History', students: [], teacher: null, active: true },
    'Block-C': { name: 'Block C - Arts & PE', students: [], teacher: null, active: true },
    'Block-D': { name: 'Block D - Technology', students: [], teacher: null, active: true }
}));

// System settings
let systemSettings = JSON.parse(localStorage.getItem('systemSettings') || JSON.stringify({
    blocksPerDay: 4,
    schoolName: 'Schoolearn Middle School',
    gradeLevel: 8
}));

// Tutoring questions
let tutoringQuestions = JSON.parse(localStorage.getItem('tutoringQuestions') || '[]');

// Weekly question tracking
let weeklyQuestions = JSON.parse(localStorage.getItem('weeklyQuestions') || '{}');

// Current active section
let currentSection = 'dashboard';


let currentUser = null;
let MOCK_LEADERBOARD = [];

// --- 2. GLOBAL UTILITIES & MOCK DB INTERACTION ---

function updateLeaderboard() {
    // Recalculates MOCK_LEADERBOARD based on current MOCK_USERS points
    MOCK_LEADERBOARD = Object.values(MOCK_USERS)
        .filter(u => u.role === 'Student')
        .sort((a, b) => b.points - a.points);
}

function logout() {
    currentUser = null;
    document.getElementById('nav-sidebar').style.display = 'none';
    document.querySelectorAll('div[id$="-dashboard"]').forEach(el => el.classList.add('hidden'));
    document.getElementById('email').value = '';
    document.getElementById('password').value = 'pass';
    document.getElementById('login-screen').classList.remove('hidden');
    document.querySelector('.main-content').style.marginLeft = '0';
}

// Custom Toast Notification (WOW Feature)
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Show/Hide logic
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
        container.removeChild(toast);
    }, 3500);
}

// LocalStorage management for Pending Requests
function loadPendingRequests() {
    const requests = localStorage.getItem(PENDING_REQUESTS_KEY);
    return requests ? JSON.parse(requests) : [];
}

function savePendingRequests(requests) {
    localStorage.setItem(PENDING_REQUESTS_KEY, JSON.stringify(requests));
}

// Rank system functions
function getCurrentRank(points) {
    const ranks = [
        { name: 'Bronze', min: 0, max: 499, color: 'bronze' },
        { name: 'Silver', min: 500, max: 999, color: 'silver' },
        { name: 'Gold', min: 1000, max: 1999, color: 'gold' },
        { name: 'Diamond', min: 2000, max: 7999, color: 'diamond' },
        { name: 'Master', min: 8000, max: 15999, color: 'master' },
        { name: 'Grandmaster', min: 16000, max: Infinity, color: 'grandmaster' }
    ];
    
    const currentRank = ranks.find(rank => points >= rank.min && points <= rank.max);
    
    // Save points and rank to localStorage
    if (currentUser) {
        const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
        if (userEmail) {
            // Save points
            const savedPoints = JSON.parse(localStorage.getItem('userPoints') || '{}');
            savedPoints[userEmail] = points;
            localStorage.setItem('userPoints', JSON.stringify(savedPoints));
            
            // Save rank
            const savedRanks = JSON.parse(localStorage.getItem('userRanks') || '{}');
            savedRanks[userEmail] = currentRank;
            localStorage.setItem('userRanks', JSON.stringify(savedRanks));
            
            // Update MOCK_USERS with saved points
            MOCK_USERS[userEmail].points = points;
        }
    }
    
    return currentRank || ranks[0];
}

function getNextRank(currentRank) {
    return currentRank.next ? RANK_SYSTEM[currentRank.next] : null;
}

function getProgressToNextRank(points) {
    const currentRank = getCurrentRank(points);
    const nextRank = getNextRank(currentRank);

    if (!nextRank) return { progress: 100, pointsNeeded: 0 };

    const pointsInCurrentRank = points - currentRank.threshold;
    const pointsNeededForNext = nextRank.threshold - currentRank.threshold;
    const progress = (pointsInCurrentRank / pointsNeededForNext) * 100;
    const pointsNeeded = nextRank.threshold - points;

    return { progress: Math.min(100, progress), pointsNeeded: Math.max(0, pointsNeeded) };
}

function createCircularProgress(points) {
    const currentRank = getCurrentRank(points);
    const { progress, pointsNeeded } = getProgressToNextRank(points);
    const nextRank = getNextRank(currentRank);

    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return `
        <div class="circular-progress">
            <svg class="progress-ring" width="200" height="200">
                <circle class="progress-ring-circle" cx="100" cy="100" r="${radius}" 
                        stroke-dasharray="${strokeDasharray}" stroke-dashoffset="0"></circle>
                <circle class="progress-ring-progress" cx="100" cy="100" r="${radius}"
                        stroke="var(--${currentRank.color})" 
                        stroke-dasharray="${strokeDasharray}" 
                        stroke-dashoffset="${strokeDashoffset}"></circle>
            </svg>
            <div class="progress-content">
                <div class="rank-badge rank-${currentRank.color}">${currentRank.name}</div>
                <div class="points-number">${points.toLocaleString()}</div>
                <div style="font-size: 12px; color: var(--neutral-gray); margin-top: 8px;">
                    ${nextRank ? `${pointsNeeded} to ${nextRank.name}` : 'Max Rank!'}
                </div>
            </div>
        </div>
    `;
}

// Navigation function
function showSection(section) {
    currentSection = section;

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');

    // Show appropriate content based on section and user role
    if (currentUser.role === 'Student')
    {
        document.title = "Schoolearn - Student Dashboard";
        renderStudentSection(section);
    } else if (currentUser.role === 'Teacher')
    {
        document.title = "Schoolearn - Teacher Dashboard";
        renderTeacherSection(section);
    } else if (currentUser.role === 'Admin')
    {
        document.title = "Schoolearn - Admin Dashboard";
        renderAdminSection(section);
    }
}

function renderStudentSection(section) {
    const dashboard = document.getElementById('student-dashboard');

    switch (section)
    {
        case 'dashboard':
            renderStudentDashboard();
            break;
        case 'create-task':
            renderCreateTask();
            break;
        case 'tutoring':
            renderTutoring();
            break;
        case 'leaderboard':
            renderLeaderboard();
            break;
        case 'calendar':
            renderCalendar();
            break;
        case 'behavior':
            renderBehaviorPoints();
            break;
        case 'messages':
            renderMessages();
            break;
        case 'profile':
            renderProfile();
            break;
        default:
            renderStudentDashboard();
    }
}

// Daily points tracking
function getTodayKey() {
    return new Date().toDateString();
}

function canGiveBehaviorPoints() {
    const today = getTodayKey();
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const todayGiven = dailyPointsGiven[userEmail] || {};
    return (todayGiven[today] || 0) < DAILY_GIVE_LIMIT;
}

function canReceiveBehaviorPoints(recipientEmail) {
    const today = getTodayKey();
    const todayReceived = dailyPointsReceived[recipientEmail] || {};
    return (todayReceived[today] || 0) < DAILY_RECEIVE_LIMIT;
}

function alreadyGaveTo(recipientName) {
    const today = getTodayKey();
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);

    // Clean up old dates (keep only last 7 days to prevent storage bloat)
    cleanupOldDates();

    const todayGivenTo = dailyGivenTo[userEmail] || {};
    const todayList = todayGivenTo[today] || [];
    return todayList.includes(recipientName);
}

// Clean up old date entries to prevent localStorage bloat
function cleanupOldDates() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Clean dailyPointsGiven
    Object.keys(dailyPointsGiven).forEach(userEmail => {
        Object.keys(dailyPointsGiven[userEmail] || {}).forEach(date => {
            if (new Date(date) < sevenDaysAgo)
            {
                delete dailyPointsGiven[userEmail][date];
            }
        });
    });

    // Clean dailyPointsReceived
    Object.keys(dailyPointsReceived).forEach(userEmail => {
        Object.keys(dailyPointsReceived[userEmail] || {}).forEach(date => {
            if (new Date(date) < sevenDaysAgo)
            {
                delete dailyPointsReceived[userEmail][date];
            }
        });
    });

    // Clean dailyGivenTo
    Object.keys(dailyGivenTo).forEach(userEmail => {
        Object.keys(dailyGivenTo[userEmail] || {}).forEach(date => {
            if (new Date(date) < sevenDaysAgo)
            {
                delete dailyGivenTo[userEmail][date];
            }
        });
    });

    // Save cleaned data
    localStorage.setItem('dailyPointsGiven', JSON.stringify(dailyPointsGiven));
    localStorage.setItem('dailyPointsReceived', JSON.stringify(dailyPointsReceived));
    localStorage.setItem('dailyGivenTo', JSON.stringify(dailyGivenTo));
}

function getRemainingGives() {
    const today = getTodayKey();
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const todayGiven = dailyPointsGiven[userEmail] || {};
    return Math.max(0, DAILY_GIVE_LIMIT - (todayGiven[today] || 0));
}

function giveBehaviorPoints(recipientName, reason) {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const recipientEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === recipientName);

    if (!canGiveBehaviorPoints())
    {
        showToast('❌ You can only give 3 behavior points per day!', 'error');
        return;
    }

    if (alreadyGaveTo(recipientName))
    {
        showToast('❌ You already gave behavior points to this person today!', 'error');
        return;
    }

    if (!canReceiveBehaviorPoints(recipientEmail))
    {
        showToast(`❌ ${recipientName} has already received their daily limit!`, 'error');
        return;
    }

    const today = getTodayKey();

    // Update giver's daily count
    if (!dailyPointsGiven[userEmail]) dailyPointsGiven[userEmail] = {};
    dailyPointsGiven[userEmail][today] = (dailyPointsGiven[userEmail][today] || 0) + 1;
    localStorage.setItem('dailyPointsGiven', JSON.stringify(dailyPointsGiven));

    // Update receiver's daily count
    if (!dailyPointsReceived[recipientEmail]) dailyPointsReceived[recipientEmail] = {};
    dailyPointsReceived[recipientEmail][today] = (dailyPointsReceived[recipientEmail][today] || 0) + 1;
    localStorage.setItem('dailyPointsReceived', JSON.stringify(dailyPointsReceived));

    // Track who was given to
    if (!dailyGivenTo[userEmail]) dailyGivenTo[userEmail] = {};
    if (!dailyGivenTo[userEmail][today]) dailyGivenTo[userEmail][today] = [];
    dailyGivenTo[userEmail][today].push(recipientName);
    localStorage.setItem('dailyGivenTo', JSON.stringify(dailyGivenTo));

    // Award points
    if (recipientEmail && MOCK_USERS[recipientEmail].role === 'Student')
    {
        MOCK_USERS[recipientEmail].points += BEHAVIOR_POINTS_AMOUNT;

        updateLeaderboard();
        showToast(`🤝 Gave ${BEHAVIOR_POINTS_AMOUNT} behavior points to ${recipientName}!`, 'success');

        if (currentSection === 'dashboard')
        {
            renderStudentDashboard();
        } else
        {
            renderStudentSection(currentSection);
        }
    }
}

// Tutoring system functions
function getStudentPerformance(points) {
    if (points < 1500) return 'struggling';
    if (points > 3000) return 'excelling';
    return 'average';
}

function getTutoringOpportunities() {
    const currentUserEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const currentUserPerformance = getStudentPerformance(currentUser.points);

    if (currentUserPerformance === 'excelling')
    {
        // Show struggling students they can tutor
        return Object.values(MOCK_USERS)
            .filter(u => u.role === 'Student' && u.class === currentUser.class && u.name !== currentUser.name)
            .filter(u => getStudentPerformance(u.points) === 'struggling')
            .map(u => ({ name: u.name, points: u.points, type: 'tutor' }));
    } else if (currentUserPerformance === 'struggling')
    {
        // Show excelling students who can tutor them
        return Object.values(MOCK_USERS)
            .filter(u => u.role === 'Student' && u.class === currentUser.class && u.name !== currentUser.name)
            .filter(u => getStudentPerformance(u.points) === 'excelling')
            .map(u => ({ name: u.name, points: u.points, type: 'get_tutored' }));
    }
    return [];
}

function requestTutoring(tutorName) {
    showToast(`📚 Tutoring request sent to ${tutorName}!`, 'success');
    // In a real app, this would create a tutoring session request
}

function offerTutoring(studentName) {
    // Award points for offering to tutor
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    MOCK_USERS[userEmail].points += 50;
    currentUser.points += 50;

    // Award currency
    if (!studentCurrency[userEmail]) studentCurrency[userEmail] = 0;
    studentCurrency[userEmail] += 10;
    localStorage.setItem('studentCurrency', JSON.stringify(studentCurrency));

    updateLeaderboard();
    showToast(`🎓 Offered tutoring to ${studentName}! +50 points & +10 coins!`, 'success');
    renderStudentSection(currentSection);
}

// Task creation functions
function createStudentTask(taskName, taskType, description, blockId, dueDate) {
    const block = schoolBlocks[blockId];
    const newTask = {
        id: Date.now(),
        name: taskName,
        type: taskType,
        description: description,
        blockId: blockId,
        blockName: block ? block.name : 'Unknown Block',
        dueDate: dueDate,
        studentName: currentUser.name,
        studentEmail: Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name),
        suggestedPoints: DEFAULT_POINTS[taskType] || 50,
        status: 'created', // Changed from 'pending_approval' to 'created'
        dateCreated: new Date().toISOString(),
        approvedPoints: null,
        teacher: block ? block.teacher : null
    };

    studentTasks.push(newTask);
    localStorage.setItem('studentTasks', JSON.stringify(studentTasks));

    showToast(`📝 Task "${taskName}" submitted for teacher approval!`, 'success');
    // Stay on the create task page after submission
}

// Tutoring question functions
function getWeekKey() {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return startOfWeek.toDateString();
}

function canAskQuestion() {
    const week = getWeekKey();
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const weeklyCount = weeklyQuestions[userEmail] || {};
    return (weeklyCount[week] || 0) < WEEKLY_QUESTION_LIMIT;
}

function askTutoringQuestion(question, subject) {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);

    // Check if user can ask question
    if (!canAskQuestion())
    {
        showToast('❌ You can only ask 1 question per week!', 'error');
        return;
    }

    // Check if user has enough points
    if (currentUser.points < TUTORING_COST)
    {
        showToast(`❌ You need ${TUTORING_COST} points to ask a question!`, 'error');
        return;
    }

    // Deduct points
    MOCK_USERS[userEmail].points -= TUTORING_COST;
    currentUser.points -= TUTORING_COST;

    // Track weekly question
    const week = getWeekKey();
    if (!weeklyQuestions[userEmail]) weeklyQuestions[userEmail] = {};
    weeklyQuestions[userEmail][week] = (weeklyQuestions[userEmail][week] || 0) + 1;
    localStorage.setItem('weeklyQuestions', JSON.stringify(weeklyQuestions));

    // Create question
    const newQuestion = {
        id: Date.now(),
        question: question,
        subject: subject,
        askerName: currentUser.name,
        askerEmail: userEmail,
        dateAsked: new Date().toISOString(),
        status: 'open',
        answers: [],
        solvedBy: null
    };

    tutoringQuestions.push(newQuestion);
    localStorage.setItem('tutoringQuestions', JSON.stringify(tutoringQuestions));

    updateLeaderboard();
    showToast(`❓ Question posted! ${TUTORING_COST} points deducted.`, 'success');
    renderStudentSection(currentSection);
}

function answerTutoringQuestion(questionId, answer) {
    const questionIndex = tutoringQuestions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;

    const question = tutoringQuestions[questionIndex];
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);

    // Check if user has already answered this question
    const hasAlreadyAnswered = question.answers.some(ans => ans.answererEmail === userEmail);
    if (hasAlreadyAnswered)
    {
        showToast('❌ You can only submit one answer per question!', 'error');
        return;
    }

    // Add answer
    question.answers.push({
        answer: answer,
        answererName: currentUser.name,
        answererEmail: userEmail,
        dateAnswered: new Date().toISOString()
    });

    localStorage.setItem('tutoringQuestions', JSON.stringify(tutoringQuestions));
    showToast('📚 Answer submitted!', 'success');
    renderStudentSection(currentSection);
}

function markQuestionSolved(questionId, answererEmail) {
    const questionIndex = tutoringQuestions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;

    const question = tutoringQuestions[questionIndex];
    question.status = 'solved';
    question.solvedBy = answererEmail;

    // Award points to the person who answered
    if (MOCK_USERS[answererEmail])
    {
        MOCK_USERS[answererEmail].points += TUTORING_REWARD;

        // Award currency
        if (!studentCurrency[answererEmail]) studentCurrency[answererEmail] = 0;
        studentCurrency[answererEmail] += 15;
        localStorage.setItem('studentCurrency', JSON.stringify(studentCurrency));
    }

    localStorage.setItem('tutoringQuestions', JSON.stringify(tutoringQuestions));
    updateLeaderboard();

    const answererName = MOCK_USERS[answererEmail].name;
    showToast(`✅ Question marked as solved! ${answererName} earned ${TUTORING_REWARD} points!`, 'success');
    renderStudentSection(currentSection);
}

function createHeader(userName, role) {
    if (role === 'Teacher' || role === 'Admin') {
        // Schoology-inspired header for teachers and admin (no navigation)
        return `
            <div class="bg-white border-b border-gray-200 p-4 mb-6">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background: var(--primary-green);">
                            ${role === 'Teacher' ? '👩‍🏫' : '👨‍💼'}
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold" style="color: var(--dark-gray);">${userName}</h1>
                            <p class="text-sm" style="color: var(--neutral-gray);">${role} Portal</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <p class="text-sm font-medium" style="color: var(--dark-gray);">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p class="text-xs" style="color: var(--neutral-gray);">Academic Year 2024-25</p>
                        </div>
                        <button onclick="logout()" class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Original header for students (with navigation)
        return `
            <div class="card p-6 mb-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-3xl font-extrabold" style="color: var(--primary-green);">
                        🎯 ${role} Dashboard
                    </h2>
                    <div class="text-right">
                        <p class="font-bold text-lg" style="color: var(--dark-gray);">${userName}</p>
                        <div class="text-sm" style="color: var(--neutral-gray);">
                            ${new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}


// --- 3. LOGIN & ROUTING ---
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');

    if (password !== 'pass')
    {
        messageDiv.textContent = 'Invalid password.';
        messageDiv.classList.remove('hidden');
        return;
    }

    const userData = MOCK_USERS[email];
    if (!userData)
    {
        messageDiv.textContent = 'User not found.';
        messageDiv.classList.remove('hidden');
        return;
    }

    currentUser = userData;
    messageDiv.classList.add('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    // Only show navigation for students
    if (userData.role === 'Student') {
        document.getElementById('nav-sidebar').style.display = 'flex';
        document.querySelector('.main-content').style.marginLeft = '80px';
    } else {
        document.getElementById('nav-sidebar').style.display = 'none';
        document.querySelector('.main-content').style.marginLeft = '0';
    }
    updateLeaderboard(); // Ensure leaderboard is fresh on login
    renderDashboard(userData.role);
}

function renderDashboard(role) {
    document.getElementById('student-dashboard').classList.add('hidden');
    document.getElementById('teacher-dashboard').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');

    switch (role)
    {
        case 'Student':
            renderStudentDashboard();
            document.getElementById('student-dashboard').classList.remove('hidden');
            break;
        case 'Teacher':
            renderTeacherDashboard();
            document.getElementById('teacher-dashboard').classList.remove('hidden');
            break;
        case 'Admin':
            renderAdminDashboard();
            document.getElementById('admin-dashboard').classList.remove('hidden');
            break;
    }
}

// --- 4. STUDENT LOGIC & RENDER ---
function requestTaskCompletion(taskId, points, taskName, teacher) {
    const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);

    if (taskIndex !== -1 && !MOCK_TASKS[taskIndex].completed && !MOCK_TASKS[taskIndex].pending)
    {

        // Mark task as pending
        MOCK_TASKS[taskIndex].pending = true;

        // Create a request object
        const requests = loadPendingRequests();
        const newRequestId = Date.now();

        requests.push({
            id: newRequestId,
            type: 'Task Completion',
            studentName: currentUser.name,
            points: points,
            reason: taskName,
            teacher: teacher,
            status: 'Pending',
            taskId: taskId
        });

        savePendingRequests(requests);
        showToast(`Task "${taskName}" submitted for approval!`, 'warning');

        // Refresh current section or dashboard
        if (currentSection === 'dashboard')
        {
            renderStudentDashboard();
        } else
        {
            renderStudentSection(currentSection);
        }
    } else if (MOCK_TASKS[taskIndex].pending)
    {
        showToast(`Request for "${taskName}" is already awaiting approval.`, 'warning');
    } else if (MOCK_TASKS[taskIndex].completed)
    {
        showToast(`Task "${taskName}" is already completed.`, 'error');
    }
}

// Currency system for customization (future feature)
function earnCurrency(amount, reason) {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    if (!studentCurrency[userEmail]) studentCurrency[userEmail] = 0;
    studentCurrency[userEmail] += amount;
    localStorage.setItem('studentCurrency', JSON.stringify(studentCurrency));
    showToast(`💰 +${amount} coins earned for ${reason}!`, 'success');
}

function renderStudentDashboard() {
    const dashboard = document.getElementById('student-dashboard');
    const user = currentUser;

    const myTasksToDo = MOCK_TASKS.filter(t => !t.completed && !t.pending);
    const myTasksPending = MOCK_TASKS.filter(t => !t.completed && t.pending);
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === user.name);
    const myCreatedTasks = studentTasks.filter(task => task.studentEmail === userEmail && task.status !== 'rejected');

    const currentRank = getCurrentRank(user.points);
    const remainingGives = getRemainingGives();

    // Get user's grade from class name (e.g., 'Block-A' -> grade 8)
    const userGrade = GRADE_CONFIG.currentGrade;
    const gradeData = GRADE_COMPETITION[userGrade];

    // Grade-wide leaderboard (all students in grade 8 across all 8 blocks)
    const gradeStudents = MOCK_LEADERBOARD.filter(u => {
        const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name)];
        return userData.class.startsWith('Block-'); // All blocks are grade 8
    });

    // Global rank is now the grade rank (8th grade rank across all 8 blocks)
    const globalRank = gradeStudents.findIndex(u => u.name === user.name) + 1;

    // Grade 8 blocks (all 8 classes/blocks)
    const classBlocksHTML = Object.entries(CLASS_BLOCKS)
        .map(([className, data]) => {
            const isMyClass = className === user.class;
            const rankColor = data.rank === 1 ? 'gold' : data.rank === 2 ? 'silver' : data.rank === 3 ? 'bronze' : 'gray';
            return `
                <div class="card p-4 ${isMyClass ? 'ring-2 ring-primary-green' : ''}" style="background: ${isMyClass ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' : 'var(--white)'};">
                    <div class="flex justify-between items-center">
                        <div>
                            <h4 class="font-bold text-lg" style="color: var(--dark-gray);">
                                ${className} ${isMyClass ? '(Your Class)' : ''}
                            </h4>
                            <p class="text-sm" style="color: var(--neutral-gray);">${data.school}</p>
                            <p class="text-xs" style="color: var(--neutral-gray);">${data.students} students</p>
                        </div>
                        <div class="text-right">
                            <div class="rank-badge rank-${rankColor} text-xs mb-1">Rank #${data.rank}</div>
                            <div class="font-bold" style="color: var(--primary-green);">${data.totalPoints.toLocaleString()}</div>
                            <div class="text-xs" style="color: var(--neutral-gray);">points</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    // All tasks (regular + created) HTML
    const allTasksHTML = [...myTasksToDo.map(task => `
        <div class="task-card">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-bold text-lg" style="color: var(--dark-gray);">${task.name}</h4>
                    <p class="text-sm" style="color: var(--neutral-gray);">${task.subject} • ${task.points} Points</p>
                </div>
                <button class="btn-primary" onclick="requestTaskCompletion(${task.id}, ${task.points}, '${task.name}', '${task.teacher}')">
                    Submit
                </button>
            </div>
        </div>
    `), ...myCreatedTasks.filter(task => task.status === 'approved').map(task => `
        <div class="task-card">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-bold text-lg" style="color: var(--dark-gray);">${task.name}</h4>
                    <p class="text-sm" style="color: var(--neutral-gray);">${task.type} • ${task.approvedPoints} Points • Created by you</p>
                </div>
                <button class="btn-primary" onclick="completeCreatedTask(${task.id})">
                    Complete
                </button>
            </div>
        </div>
    `)].join('');

    const pendingHTML = [...myTasksPending.map(task => `
        <div class="task-card task-pending">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-bold text-lg" style="color: var(--dark-gray);">${task.name}</h4>
                    <p class="text-sm" style="color: var(--accent-orange);">⏳ Awaiting approval • ${task.points} Points</p>
                </div>
                <div class="px-3 py-1 rounded-full text-xs font-bold" style="background: var(--accent-orange); color: white;">
                    PENDING
                </div>
            </div>
        </div>
    `), ...myCreatedTasks.filter(task => task.status === 'pending_approval').map(task => `
        <div class="task-card task-pending">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-bold text-lg" style="color: var(--dark-gray);">${task.name}</h4>
                    <p class="text-sm" style="color: var(--accent-orange);">⏳ Awaiting teacher approval • ${task.suggestedPoints} Points suggested</p>
                </div>
                <div class="px-3 py-1 rounded-full text-xs font-bold" style="background: var(--accent-orange); color: white;">
                    PENDING
                </div>
            </div>
        </div>
    `)].join('');

    // Grade leaderboard HTML
    const gradeLeaderboardHTML = gradeStudents.slice(0, 5).map((u, index) => {
        const isCurrentUser = u.name === user.name;
        const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name)];
        const userRank = getCurrentRank(userData.points);
        return `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                <div class="flex items-center gap-4">
                    <div class="leaderboard-rank">${index + 1}</div>
                    <div>
                        <div class="font-bold" style="color: var(--dark-gray);">
                            ${u.name} ${isCurrentUser ? '(YOU)' : ''} - ${userData.class}
                        </div>
                        <div class="rank-badge rank-${userRank.color} text-xs">${userRank.name}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg" style="color: var(--primary-green);">
                        ${userData.points.toLocaleString()}
                    </div>
                    <div class="text-xs" style="color: var(--neutral-gray);">points</div>
                </div>
            </div>
        `;
    }).join('');

    // Peer points section
    const classmates = Object.values(MOCK_USERS)
        .filter(u => u.role === 'Student' && u.name !== user.name && u.class === user.class)
        .map(u => `<option value="${u.name}">${u.name}</option>`).join('');

    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <!-- Glowing Rank Highlight -->
        <div class="rank-highlight-container mb-6">
            <div class="rank-highlight-card rank-${currentRank.color}">
                <div class="rank-glow-effect"></div>
                <div class="rank-content">
                    <div class="rank-badge-large">
                        <span class="rank-number">#${globalRank}</span>
                        <div class="rank-title">${currentRank.name}</div>
                        <div class="rank-progress">
                            ${getPointsToNextRank(user.points)}
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="stat-item">
                            <span class="stat-value">${user.points.toLocaleString()}</span>
                            <span class="stat-label">Points</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- My Submitted Tasks -->
        <div class="card p-6">
            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--dark-gray);">
                📋 My Submitted Tasks
            </h3>
            <div class="space-y-3">
                ${renderMySubmittedTasks()}
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            <!-- Mini Leaderboard -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--dark-gray);">
                    🏆 Top Students
                </h3>
                <div class="space-y-3">
                    ${gradeLeaderboardHTML}
                </div>
            </div>
        </div>
    `;
    
    // Initialize Apple TV effects for new content
    refreshAppleTVEffects();
}

// Calculate points needed for next rank
function getPointsToNextRank(currentPoints) {
    const ranks = [
        { name: 'Bronze', min: 0, max: 499 },
        { name: 'Silver', min: 500, max: 999 },
        { name: 'Gold', min: 1000, max: 1999 },
        { name: 'Platinum', min: 2000, max: 3999 },
        { name: 'Diamond', min: 4000, max: 7999 },
        { name: 'Master', min: 8000, max: 15999 },
        { name: 'Grandmaster', min: 16000, max: Infinity }
    ];
    
    const currentRank = ranks.find(rank => currentPoints >= rank.min && currentPoints <= rank.max);
    const nextRank = ranks[ranks.indexOf(currentRank) + 1];
    
    if (!nextRank) {
        return '<span class="text-xs opacity-90">Max Rank Achieved!</span>';
    }
    
    const pointsNeeded = nextRank.min - currentPoints;
    return `<span class="text-sm font-medium opacity-95">${pointsNeeded.toLocaleString()} pts to ${nextRank.name}</span>`;
}

// Competition content generator
function getCompetitionContent(type, user, globalRank, gradeLeaderboardHTML) {
    switch(type) {
        case 'overall':
            return `
                <div class="space-y-2">
                    <div class="text-sm text-gray-600 mb-3">Your position in Grade ${user.class.charAt(0)} overall</div>
                    ${gradeLeaderboardHTML}
                </div>
            `;
        case 'block':
            const blockStudents = MOCK_LEADERBOARD.filter(student => {
                const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === student.name)];
                return userData && userData.class === user.class;
            });
            const blockHTML = blockStudents.slice(0, 5).map((student, index) => {
                const isCurrentUser = student.name === user.name;
                const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === student.name)];
                const userRank = getCurrentRank(userData.points);
                return `
                    <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                        <div class="flex items-center gap-4">
                            <div class="leaderboard-rank">${index + 1}</div>
                            <div>
                                <div class="font-bold" style="color: var(--dark-gray);">
                                    ${student.name} ${isCurrentUser ? '(YOU)' : ''}
                                </div>
                                <div class="rank-badge rank-${userRank.color} text-xs">${userRank.name}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-lg" style="color: var(--primary-green);">
                                ${userData.points.toLocaleString()}
                            </div>
                            <div class="text-xs" style="color: var(--neutral-gray);">points</div>
                        </div>
                    </div>
                `;
            }).join('');
            return `
                <div class="space-y-2">
                    <div class="text-sm text-gray-600 mb-3">Your position in ${user.class}</div>
                    ${blockHTML}
                </div>
            `;
        case 'teacher':
            return `
                <div class="space-y-2">
                    <div class="text-sm text-gray-600 mb-3">Teacher competition rankings</div>
                    <div class="text-center py-8 text-gray-500">
                        Teacher competition view - Coming soon!
                    </div>
                </div>
            `;
        default:
            return '';
    }
}

// Render Leaderboard page
function renderLeaderboard() {
    const dashboard = document.getElementById('student-dashboard');
    const user = currentUser;
    
    // Get user's blocks from schoolBlocks where they are enrolled
    const userBlocks = Object.entries(schoolBlocks).filter(([blockId, block]) => 
        block.students && block.students.includes(Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === user.name))
    );
    
    const blockOptions = userBlocks.map(([blockId, block]) => 
        `<option value="${blockId}">${block.icon || '📚'} ${block.name}</option>`
    ).join('');
    
    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold mb-2" style="color: var(--dark-gray);">🏆 Block Leaderboard</h1>
                    <p class="text-gray-600">Select a block to view rankings</p>
                </div>
                ${userBlocks.length > 0 ? `
                    <select id="block-selector" onchange="switchBlockLeaderboard()" class="p-3 border rounded-lg bg-white">
                        <option value="">Choose a block...</option>
                        ${blockOptions}
                    </select>
                ` : ''}
            </div>
        </div>
        
        <div id="leaderboard-content">
            ${userBlocks.length > 0 ? `
                <div class="bg-white rounded-lg p-8 border text-center">
                    <div class="text-6xl mb-4">🏆</div>
                    <h3 class="text-xl font-bold mb-2">Select a Block</h3>
                    <p class="text-gray-600">Choose a block from the dropdown to view rankings</p>
                </div>
            ` : `
                <div class="bg-white rounded-lg p-8 border text-center">
                    <div class="text-6xl mb-4">📚</div>
                    <h3 class="text-xl font-bold mb-2">No Blocks Yet</h3>
                    <p class="text-gray-600">You haven't been added to any blocks by teachers yet.</p>
                    <p class="text-sm text-gray-500 mt-2">Teachers will add you to their blocks to see competition rankings.</p>
                </div>
            `}
        </div>
    `;
    
    refreshAppleTVEffects();
}

// Switch block leaderboard
function switchBlockLeaderboard() {
    const selector = document.getElementById('block-selector');
    const content = document.getElementById('leaderboard-content');
    const blockId = selector.value;
    
    if (!blockId) {
        content.innerHTML = `
            <div class="bg-white rounded-lg p-8 border text-center">
                <div class="text-6xl mb-4">🏆</div>
                <h3 class="text-xl font-bold mb-2">Select a Block</h3>
                <p class="text-gray-600">Choose a block from the dropdown to view rankings</p>
            </div>
        `;
        return;
    }
    
    const block = schoolBlocks[blockId];
    if (!block) return;
    
    // Get students in this block
    const blockStudents = block.students.map(studentEmail => {
        const student = MOCK_USERS[studentEmail];
        return student ? { name: student.name, points: student.points, email: studentEmail } : null;
    }).filter(s => s !== null).sort((a, b) => b.points - a.points);
    
    const userPosition = blockStudents.findIndex(s => s.name === currentUser.name) + 1;
    
    const leaderboardHTML = blockStudents.map((student, index) => {
        const isCurrentUser = student.name === currentUser.name;
        const userRank = getCurrentRank(student.points);
        return `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}" onclick="viewProfile('${student.name}')">
                <div class="flex items-center gap-4">
                    <div class="leaderboard-rank">${index + 1}</div>
                    <div class="flex-1">
                        <div class="font-bold" style="color: var(--dark-gray);">
                            ${student.name} ${isCurrentUser ? '(YOU)' : ''}
                        </div>
                        <div class="rank-badge rank-${userRank.color} text-xs">${userRank.name}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg" style="color: var(--primary-green);">
                        ${student.points.toLocaleString()}
                    </div>
                    <div class="text-xs" style="color: var(--neutral-gray);">points</div>
                </div>
            </div>
        `;
    }).join('');
    
    content.innerHTML = `
        <div class="bg-white rounded-lg p-6 border">
            <div class="flex items-center gap-3 mb-6">
                <span class="text-3xl">${block.icon || '📚'}</span>
                <div>
                    <h3 class="text-2xl font-bold">${block.name}</h3>
                    <p class="text-gray-600">Your rank: #${userPosition} of ${blockStudents.length} students</p>
                </div>
            </div>
            <div class="space-y-2 max-h-96 overflow-y-auto">
                ${leaderboardHTML}
            </div>
        </div>
    `;
}

// Render Calendar page with actual calendar view
function renderCalendar() {
    const dashboard = document.getElementById('student-dashboard');
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const myTasks = studentTasks.filter(task => task.studentEmail === userEmail && task.dueDate);
    
    // Generate calendar
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendarDays = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayTasks = myTasks.filter(task => task.dueDate === dateStr);
        const isCurrentMonth = currentDate.getMonth() === currentMonth;
        const isToday = dateStr === today.toISOString().split('T')[0];
        
        calendarDays.push({
            date: new Date(currentDate),
            dateStr: dateStr,
            day: currentDate.getDate(),
            isCurrentMonth: isCurrentMonth,
            isToday: isToday,
            tasks: dayTasks
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const calendarHTML = `
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                <h2 class="text-xl font-bold">${monthNames[currentMonth]} ${currentYear}</h2>
            </div>
            
            <div class="grid grid-cols-7 gap-0 border-b border-gray-200">
                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
                    `<div class="p-3 text-center font-semibold text-gray-600 bg-gray-50 border-r border-gray-200 last:border-r-0">${day}</div>`
                ).join('')}
            </div>
            
            <div class="grid grid-cols-7 gap-0">
                ${calendarDays.map(dayInfo => `
                    <div class="min-h-24 p-2 border-r border-b border-gray-200 last:border-r-0 ${dayInfo.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${dayInfo.isToday ? 'bg-blue-50' : ''}">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-sm font-medium ${dayInfo.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${dayInfo.isToday ? 'text-blue-600 font-bold' : ''}">${dayInfo.day}</span>
                            ${dayInfo.tasks.length > 0 ? `<span class="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">${dayInfo.tasks.length}</span>` : ''}
                        </div>
                        ${dayInfo.tasks.slice(0, 2).map(task => `
                            <div class="text-xs p-1 mb-1 rounded ${task.status === 'created' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}" title="${task.name}">
                                ${task.name.length > 12 ? task.name.substring(0, 12) + '...' : task.name}
                            </div>
                        `).join('')}
                        ${dayInfo.tasks.length > 2 ? `<div class="text-xs text-gray-500">+${dayInfo.tasks.length - 2} more</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="mb-6">
            <h1 class="text-3xl font-bold mb-2" style="color: var(--dark-gray);">📅 My Calendar</h1>
            <p class="text-gray-600">View your assignments in calendar format</p>
        </div>
        
        ${calendarHTML}
        
        <!-- Upcoming Tasks -->
        <div class="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h3 class="text-lg font-semibold">📋 Upcoming Tasks</h3>
            </div>
            <div class="p-4">
                ${myTasks.filter(task => new Date(task.dueDate) >= today).slice(0, 5).map(task => {
                    const dueDate = new Date(task.dueDate);
                    const diffTime = dueDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return `
                        <div class="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                            <div>
                                <h4 class="font-medium">${task.name}</h4>
                                <p class="text-sm text-gray-600">${task.blockName} • ${task.type}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-medium ${diffDays <= 1 ? 'text-red-600' : diffDays <= 3 ? 'text-orange-600' : 'text-gray-600'}">
                                    ${diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `${diffDays} days`}
                                </p>
                                ${task.status === 'created' ? 
                                    `<button onclick="completeTask(${task.id})" class="btn-primary text-xs mt-1">Complete</button>` :
                                    `<span class="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">Pending</span>`
                                }
                            </div>
                        </div>
                    `;
                }).join('') || '<div class="text-center py-8 text-gray-500">No upcoming tasks</div>'}
            </div>
        </div>
    `;
    
    refreshAppleTVEffects();
}

// Render Messages page for students
function renderMessages() {
    const dashboard = document.getElementById('student-dashboard');
    
    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="mb-6">
            <h1 class="text-3xl font-bold mb-2" style="color: var(--dark-gray);">💬 Messages</h1>
            <p class="text-gray-600">Send messages to teachers or report issues anonymously</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Send Message -->
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold">📝 Send Message</h2>
                </div>
                <div class="p-4">
                    <form onsubmit="sendMessage(event)" class="space-y-4">
                        <div>
                            <label class="block font-bold mb-2" style="color: var(--dark-gray);">To:</label>
                            <select id="message-recipient" class="w-full p-2 border rounded" required>
                                <option value="">Select teacher...</option>
                                ${Object.entries(MOCK_USERS)
                                    .filter(([email, user]) => user.role === 'Teacher')
                                    .map(([email, user]) => `<option value="${email}">${user.name}</option>`)
                                    .join('')}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block font-bold mb-2" style="color: var(--dark-gray);">Subject:</label>
                            <input type="text" id="message-subject" class="w-full p-2 border rounded" placeholder="Message subject..." required>
                        </div>
                        
                        <div>
                            <label class="block font-bold mb-2" style="color: var(--dark-gray);">Message:</label>
                            <textarea id="message-content" class="w-full p-2 border rounded" rows="4" placeholder="Your message..." required></textarea>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="message-anonymous" class="rounded">
                            <label for="message-anonymous" class="text-sm">Send anonymously</label>
                        </div>
                        
                        <button type="submit" class="btn-primary w-full">Send Message</button>
                    </form>
                </div>
            </div>
            
            <!-- Report Issue -->
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold">⚠️ Report Issue</h2>
                </div>
                <div class="p-4">
                    <form onsubmit="reportIssue(event)" class="space-y-4">
                        <div>
                            <label class="block font-bold mb-2" style="color: var(--dark-gray);">Issue Type:</label>
                            <select id="issue-type" class="w-full p-2 border rounded" required>
                                <option value="">Select type...</option>
                                <option value="bullying">Bullying/Harassment</option>
                                <option value="academic">Academic Issue</option>
                                <option value="technical">Technical Problem</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block font-bold mb-2" style="color: var(--dark-gray);">Description:</label>
                            <textarea id="issue-description" class="w-full p-2 border rounded" rows="4" placeholder="Describe the issue..." required></textarea>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="issue-anonymous" class="rounded" checked>
                            <label for="issue-anonymous" class="text-sm">Report anonymously (recommended)</label>
                        </div>
                        
                        <button type="submit" class="btn-warning w-full">Report Issue</button>
                    </form>
                </div>
            </div>
        </div>
        
        <!-- My Messages -->
        <div class="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="p-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold">📬 My Messages</h2>
            </div>
            <div class="p-4">
                <div class="text-center py-8 text-gray-500">
                    <div class="text-4xl mb-4">📬</div>
                    <p>No messages yet</p>
                </div>
            </div>
        </div>
    `;
    
    refreshAppleTVEffects();
}

// Render functions for student dashboard
function renderMyTasks() {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const myTasks = studentTasks.filter(task => task.studentEmail === userEmail && (task.status === 'created' || task.status === 'pending_approval'));
    
    if (myTasks.length === 0) {
        return '<div class="text-center py-4" style="color: var(--neutral-gray);">No tasks yet</div>';
    }
    
    return myTasks.slice(0, 5).map(task => `
        <div class="task-card ${task.status === 'pending_approval' ? 'task-pending' : ''}">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-bold text-lg" style="color: var(--dark-gray);">${task.name || 'Untitled Task'}</h4>
                    <p class="text-sm" style="color: var(--neutral-gray);">
                        ${task.type || 'Unknown'} • ${task.suggestedPoints || 0} pts
                        ${task.dueDate ? ` • Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                    </p>
                    ${task.description ? `<p class="text-xs mt-1" style="color: var(--neutral-gray);">${task.description}</p>` : ''}
                </div>
                <div>
                    ${task.status === 'created' ? 
                        `<button onclick="completeTask(${task.id})" class="btn-primary text-sm">Complete</button>` :
                        `<span class="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">Pending Review</span>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

function renderMiniCalendar() {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const myTasks = studentTasks.filter(task => task.studentEmail === userEmail && task.dueDate);
    
    // Get next 5 upcoming tasks
    const upcomingTasks = myTasks
        .filter(task => new Date(task.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
    
    if (upcomingTasks.length === 0) {
        return '<div class="text-center py-4" style="color: var(--neutral-gray);">No upcoming deadlines</div>';
    }
    
    return upcomingTasks.map(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let dueDateText = '';
        if (diffDays === 0) dueDateText = 'Today';
        else if (diffDays === 1) dueDateText = 'Tomorrow';
        else if (diffDays < 7) dueDateText = `${diffDays} days`;
        else dueDateText = dueDate.toLocaleDateString();
        
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                    <h4 class="font-medium text-sm">${task.name || 'Untitled Task'}</h4>
                    <p class="text-xs text-gray-600">${task.blockName || 'Unknown Block'}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-medium ${diffDays <= 1 ? 'text-red-600' : diffDays <= 3 ? 'text-orange-600' : 'text-gray-600'}">${dueDateText}</p>
                </div>
            </div>
        `;
    }).join('');
}

function completeTask(taskId) {
    const taskIndex = studentTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    // Change status to pending approval
    studentTasks[taskIndex].status = 'pending_approval';
    localStorage.setItem('studentTasks', JSON.stringify(studentTasks));
    
    showToast('✅ Task marked as complete! Awaiting teacher approval.', 'success');
    renderStudentDashboard();
}

// Function to complete created tasks
function completeCreatedTask(taskId) {
    const taskIndex = studentTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1)
    {
        const task = studentTasks[taskIndex];
        const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);

        // Award points
        MOCK_USERS[userEmail].points += task.approvedPoints;
        currentUser.points += task.approvedPoints;

        // Mark task as completed
        task.status = 'completed';
        localStorage.setItem('studentTasks', JSON.stringify(studentTasks));

        updateLeaderboard();
        showToast(`✅ Task completed! +${task.approvedPoints} points earned!`, 'success');
        renderStudentDashboard();
    }
}

// Get blocks that the student is enrolled in
function getStudentBlocks() {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const userBlocks = Object.entries(schoolBlocks).filter(([blockId, block]) => 
        block.students && block.students.includes(userEmail)
    );
    
    return userBlocks.map(([blockId, block]) => 
        `<option value="${blockId}">${block.icon || '📚'} ${block.name}</option>`
    ).join('');
}

// Individual section render functions
function renderCreateTask() {
    const dashboard = document.getElementById('student-dashboard');

    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Create New Task -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--dark-gray);">
                    ➕ Create New Task
                </h3>
                <p class="text-sm mb-6" style="color: var(--neutral-gray);">
                    Submit tasks for teacher approval. Teachers will assign final point values.
                </p>
                
                <form onsubmit="handleCreateTask(event)" class="space-y-4">
                    <div>
                        <label class="block font-bold mb-2" style="color: var(--dark-gray);">Task Name:</label>
                        <input type="text" id="task-name" class="w-full" placeholder="e.g., Math Chapter 5 Homework" required>
                    </div>
                    
                    <div>
                        <label class="block font-bold mb-2" style="color: var(--dark-gray);">Block:</label>
                        <select id="task-block" class="w-full" required>
                            <option value="">Select block...</option>
                            ${getStudentBlocks()}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block font-bold mb-2" style="color: var(--dark-gray);">Task Type:</label>
                        <select id="task-type" class="w-full" required>
                            <option value="">Select task type...</option>
                            <option value="homework">Homework (${DEFAULT_POINTS.homework} pts suggested)</option>
                            <option value="classwork">Classwork (${DEFAULT_POINTS.classwork} pts suggested)</option>
                            <option value="quiz">Quiz (${DEFAULT_POINTS.quiz} pts suggested)</option>
                            <option value="test">Test (${DEFAULT_POINTS.test} pts suggested)</option>
                            <option value="project">Project (${DEFAULT_POINTS.project} pts suggested)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block font-bold mb-2" style="color: var(--dark-gray);">Due Date:</label>
                        <input type="date" id="task-due-date" class="w-full" required>
                    </div>
                    
                    <div>
                        <label class="block font-bold mb-2" style="color: var(--dark-gray);">Description (Optional):</label>
                        <textarea id="task-description" class="w-full" rows="3" placeholder="Additional details about the task..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn-primary w-full">
                        📝 Submit Task for Approval
                    </button>
                </form>
            </div>
            
            <!-- My Submitted Tasks -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">My Submitted Tasks</h3>
                <div class="space-y-3">
                    ${renderMySubmittedTasks()}
                </div>
            </div>
        </div>
    `;
}

function renderMySubmittedTasks() {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const myTasks = studentTasks.filter(task => task.studentEmail === userEmail && (task.status === 'created' || task.status === 'pending_approval'));

    if (myTasks.length === 0) {
        return '<div class="text-center py-4" style="color: var(--neutral-gray);">No tasks yet</div>';
    }

    return myTasks.map(task => `
        <div class="task-card ${task.status === 'pending_approval' ? 'task-pending' : ''}">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-bold text-lg" style="color: var(--dark-gray);">${task.name || 'Untitled Task'}</h4>
                    <p class="text-sm" style="color: var(--neutral-gray);">
                        ${task.type || 'Unknown'} • ${task.suggestedPoints || 0} pts
                        ${task.dueDate ? ` • Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                    </p>
                    ${task.description ? `<p class="text-xs mt-1" style="color: var(--neutral-gray);">${task.description}</p>` : ''}
                </div>
                <div>
                    ${task.status === 'created' ? 
                        `<button onclick="completeTask(${task.id})" class="btn-primary text-sm">Complete</button>` :
                        `<span class="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">Pending Review</span>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

function renderTutoring() {
    const dashboard = document.getElementById('student-dashboard');
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    const canAsk = canAskQuestion();
    const openQuestions = tutoringQuestions.filter(q => q.status === 'open' && q.askerEmail !== userEmail);
    const myQuestions = tutoringQuestions.filter(q => q.askerEmail === userEmail);

    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <!-- Ask Question Section -->
        <div class="card p-6 mb-6">
            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--dark-gray);">
                ❓ Ask for Help
            </h3>
            <p class="text-sm mb-4" style="color: var(--neutral-gray);">
                Cost: ${TUTORING_COST} points • Limit: 1 question per week
            </p>
            
            ${canAsk && currentUser.points >= TUTORING_COST ? `
                <form onsubmit="handleTutoringQuestion(event)" class="space-y-4">
                    <div>
                        <label class="block font-bold mb-2" style="color: var(--dark-gray);">Subject:</label>
                        <input type="text" id="tutoring-subject" class="w-full" placeholder="e.g., Math, Science, English..." required>
                    </div>
                    
                    <div>
                        <label class="block font-bold mb-2" style="color: var(--dark-gray);">Your Question:</label>
                        <textarea id="tutoring-question" class="w-full" rows="4" placeholder="Describe your problem in detail..." required></textarea>
                    </div>
                    
                    <button type="submit" class="btn-primary w-full">
                        ❓ Ask Question (${TUTORING_COST} points)
                    </button>
                </form>
            ` : `
                <div class="text-center py-8" style="color: var(--neutral-gray);">
                    ${!canAsk ? '⏰ You can only ask 1 question per week' :
            currentUser.points < TUTORING_COST ? `💰 You need ${TUTORING_COST} points to ask a question` :
                'Unable to ask question'}
                </div>
            `}
        </div>
        
        <!-- Help Others Section -->
        <div class="card p-6 mb-6">
            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--dark-gray);">
                🎓 Help Others (Earn ${TUTORING_REWARD} points)
            </h3>
            <div class="space-y-4">
                ${openQuestions.length > 0 ? openQuestions.map(question => `
                    <div class="task-card">
                        <div>
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold" style="color: var(--dark-gray);">${question.subject}</h4>
                                <span class="text-xs px-2 py-1 rounded" style="background: var(--primary-green); color: white;">
                                    ${TUTORING_REWARD} pts reward
                                </span>
                            </div>
                            <p class="text-sm mb-3" style="color: var(--neutral-gray);">
                                Asked by ${question.askerName} • ${new Date(question.dateAsked).toLocaleDateString()}
                            </p>
                            <p class="mb-4" style="color: var(--dark-gray);">${question.question}</p>
                            
                            ${question.answers.length > 0 ? `
                                <div class="mb-4">
                                    <h5 class="font-bold mb-2" style="color: var(--dark-gray);">Answers:</h5>
                                    ${question.answers.map(ans => `
                                        <div class="bg-gray-50 p-3 rounded mb-2">
                                            <p class="text-sm mb-1">${ans.answer}</p>
                                            <p class="text-xs" style="color: var(--neutral-gray);">
                                                by ${ans.answererName} • ${new Date(ans.dateAnswered).toLocaleDateString()}
                                            </p>
                                            ${question.askerEmail === userEmail ? `
                                                <button onclick="markQuestionSolved(${question.id}, '${ans.answererEmail}')" 
                                                        class="btn-primary text-xs mt-2">
                                                    ✅ Mark as Solved
                                                </button>
                                            ` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            ${question.answers.some(ans => ans.answererEmail === userEmail) ? `
                                <div class="text-center py-3" style="color: var(--neutral-gray); background: var(--light-gray); border-radius: 8px;">
                                    ✅ You have already answered this question
                                </div>
                            ` : `
                                <form onsubmit="handleAnswerQuestion(event, ${question.id})" class="mt-4">
                                    <textarea id="answer-${question.id}" class="w-full mb-2" rows="3" placeholder="Your answer..." required style="resize: vertical; min-height: 80px; pointer-events: auto; cursor: text;"></textarea>
                                    <button type="submit" class="btn-secondary text-sm">📚 Submit Answer</button>
                                </form>
                            `}
                        </div>
                    </div>
                `).join('') : '<div class="text-center py-8" style="color: var(--neutral-gray);">No questions need help right now</div>'}
            </div>
        </div>
        
        <!-- My Questions -->
        ${myQuestions.length > 0 ? `
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">My Questions</h3>
                <div class="space-y-3">
                    ${myQuestions.map(question => `
                        <div class="task-card ${question.status === 'solved' ? 'task-completed' : ''}">
                            <div>
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-bold" style="color: var(--dark-gray);">${question.subject}</h4>
                                    <span class="text-xs px-2 py-1 rounded" style="
                                        background: ${question.status === 'solved' ? 'var(--primary-green)' : 'var(--accent-orange)'};
                                        color: white;">
                                        ${question.status === 'solved' ? 'SOLVED' : 'OPEN'}
                                    </span>
                                </div>
                                <p class="mb-2" style="color: var(--dark-gray);">${question.question}</p>
                                <p class="text-xs mb-3" style="color: var(--neutral-gray);">
                                    Asked ${new Date(question.dateAsked).toLocaleDateString()}
                                </p>
                                
                                ${question.answers.length > 0 ? `
                                    <div>
                                        <h5 class="font-bold mb-2" style="color: var(--dark-gray);">Answers (${question.answers.length}):</h5>
                                        ${question.answers.map(ans => `
                                            <div class="bg-gray-50 p-3 rounded mb-2">
                                                <p class="text-sm mb-1">${ans.answer}</p>
                                                <div class="flex justify-between items-center">
                                                    <p class="text-xs" style="color: var(--neutral-gray);">
                                                        by ${ans.answererName}
                                                    </p>
                                                    ${question.status === 'open' ? `
                                                        <button onclick="markQuestionSolved(${question.id}, '${ans.answererEmail}')" 
                                                                class="btn-primary text-xs">
                                                            ✅ Mark as Solved
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : '<p class="text-sm" style="color: var(--neutral-gray);">No answers yet</p>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
}

function renderMyTasks() {
    const dashboard = document.getElementById('student-dashboard');
    const myTasksToDo = MOCK_TASKS.filter(t => !t.completed && !t.pending);
    const myTasksPending = MOCK_TASKS.filter(t => !t.completed && t.pending);
    const myTasksCompleted = MOCK_TASKS.filter(t => t.completed);

    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Pending Tasks -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">⏳ Pending Approval</h3>
                <div class="space-y-3">
                    ${myTasksPending.length > 0 ? myTasksPending.map(task => `
                        <div class="task-card task-pending">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h4 class="font-bold text-lg" style="color: var(--dark-gray);">${task.name}</h4>
                                    <p class="text-sm" style="color: var(--accent-orange);">⏳ Awaiting approval • ${task.points} Points</p>
                                </div>
                                <div class="px-3 py-1 rounded-full text-xs font-bold" style="background: var(--accent-orange); color: white;">
                                    PENDING
                                </div>
                            </div>
                        </div>
                    `).join('') : '<div class="text-center py-8" style="color: var(--neutral-gray);">No pending tasks</div>'}
                </div>
            </div>
            
            <!-- Available Tasks -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">📋 Ready to Submit</h3>
                <div class="space-y-3">
                    ${myTasksToDo.length > 0 ? myTasksToDo.map(task => `
                        <div class="task-card">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h4 class="font-bold text-lg" style="color: var(--dark-gray);">${task.name}</h4>
                                    <p class="text-sm" style="color: var(--neutral-gray);">${task.subject} • ${task.points} Points</p>
                                </div>
                                <button class="btn-primary" onclick="requestTaskCompletion(${task.id}, ${task.points}, '${task.name}', '${task.teacher}')">
                                    Submit
                                </button>
                            </div>
                        </div>
                    `).join('') : '<div class="text-center py-8" style="color: var(--neutral-gray);">No tasks available</div>'}
                </div>
            </div>
        </div>
        
        <!-- Completed Tasks -->
        <div class="card p-6 mt-6">
            <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">✅ Completed Tasks</h3>
            <div class="space-y-3">
                ${myTasksCompleted.length > 0 ? myTasksCompleted.map(task => `
                    <div class="task-card task-completed">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="font-bold text-lg" style="color: var(--dark-gray);">${task.name}</h4>
                                <p class="text-sm" style="color: var(--primary-green);">✅ Completed • ${task.points} Points earned</p>
                            </div>
                            <div class="px-3 py-1 rounded-full text-xs font-bold" style="background: var(--primary-green); color: white;">
                                COMPLETED
                            </div>
                        </div>
                    </div>
                `).join('') : '<div class="text-center py-8" style="color: var(--neutral-gray);">No completed tasks yet</div>'}
            </div>
        </div>
    `;
}

function renderLeaderboard() {
    const dashboard = document.getElementById('student-dashboard');
    const myRank = MOCK_LEADERBOARD.findIndex(u => u.name === currentUser.name) + 1;

    const leaderboardHTML = MOCK_LEADERBOARD.map((u, index) => {
        const isCurrentUser = u.name === currentUser.name;
        const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name)];
        const userRank = getCurrentRank(userData.points);
        return `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                <div class="flex items-center gap-4">
                    <div class="leaderboard-rank">${index + 1}</div>
                    <div>
                        <div class="font-bold" style="color: var(--dark-gray);">
                            ${u.name} ${isCurrentUser ? '(YOU)' : ''}
                        </div>
                        <div class="rank-badge rank-${userRank.color} text-xs">${userRank.name}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg" style="color: var(--primary-green);">
                        ${userData.points.toLocaleString()}
                    </div>
                    <div class="text-xs" style="color: var(--neutral-gray);">points</div>
                </div>
            </div>
        `;
    }).join('');

    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- My Rank Card -->
            <div class="card p-6 text-center">
                <h3 class="text-xl font-bold mb-4" style="color: var(--dark-gray);">Your Rank</h3>
                <div class="text-6xl font-bold mb-2" style="color: var(--primary-green);">#${myRank}</div>
                <div class="rank-badge rank-${getCurrentRank(currentUser.points).color}">${getCurrentRank(currentUser.points).name}</div>
                <div class="mt-4 text-lg font-bold" style="color: var(--dark-gray);">${currentUser.points.toLocaleString()} Points</div>
            </div>
            
            <!-- Full Leaderboard -->
            <div class="card p-6 col-span-2">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">🏆 Global Leaderboard</h3>
                <div class="space-y-3 max-h-96 overflow-y-auto">
                    ${leaderboardHTML}
                </div>
            </div>
        </div>
    `;
}

function renderClassBlocks() {
    const dashboard = document.getElementById('student-dashboard');
    const myClass = currentUser.class;
    const myClassData = CLASS_BLOCKS[myClass];

    const classBlocksHTML = Object.entries(CLASS_BLOCKS).map(([className, data]) => {
        const isMyClass = className === myClass;
        const rankColor = data.rank === 1 ? 'gold' : data.rank === 2 ? 'silver' : data.rank === 3 ? 'bronze' : 'gray';
        return `
            <div class="card p-6 ${isMyClass ? 'ring-2 ring-primary-green' : ''}" style="background: ${isMyClass ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' : 'var(--white)'};">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h4 class="font-bold text-xl" style="color: var(--dark-gray);">
                            ${className} ${isMyClass ? '(Your Class)' : ''}
                        </h4>
                        <p class="text-sm" style="color: var(--neutral-gray);">${data.students} students</p>
                    </div>
                    <div class="text-right">
                        <div class="rank-badge rank-${rankColor} mb-2">Rank #${data.rank}</div>
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold mb-2" style="color: var(--primary-green);">${data.totalPoints.toLocaleString()}</div>
                    <div class="text-sm" style="color: var(--neutral-gray);">total points</div>
                </div>
                ${isMyClass ? `
                    <div class="mt-4 p-3 rounded-lg" style="background: var(--accent-yellow); color: var(--dark-gray);">
                        <p class="text-sm font-bold text-center">🎯 Your contribution helps your class rank!</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="card p-6 mb-6" style="background: linear-gradient(135deg, var(--secondary-blue), var(--primary-green));">
            <div class="text-center text-white">
                <h2 class="text-3xl font-bold mb-2">🏫 Class Competition</h2>
                <p class="text-lg">Your class ${myClass} is ranked #${myClassData.rank} with ${myClassData.totalPoints.toLocaleString()} points!</p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${classBlocksHTML}
        </div>
        
        <div class="card p-6 mt-6">
            <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">📊 How Class Points Work</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center p-4 rounded-lg" style="background: var(--light-gray);">
                    <div class="text-2xl mb-2">📝</div>
                    <h4 class="font-bold mb-2" style="color: var(--dark-gray);">Complete Tasks</h4>
                    <p class="text-sm" style="color: var(--neutral-gray);">Every task you complete adds points to your class total</p>
                </div>
                <div class="text-center p-4 rounded-lg" style="background: var(--light-gray);">
                    <div class="text-2xl mb-2">🤝</div>
                    <h4 class="font-bold mb-2" style="color: var(--dark-gray);">Peer Points</h4>
                    <p class="text-sm" style="color: var(--neutral-gray);">Points you give and receive count toward class ranking</p>
                </div>
                <div class="text-center p-4 rounded-lg" style="background: var(--light-gray);">
                    <div class="text-2xl mb-2">🎓</div>
                    <h4 class="font-bold mb-2" style="color: var(--dark-gray);">Tutoring</h4>
                    <p class="text-sm" style="color: var(--neutral-gray);">Help classmates and earn bonus points for your class</p>
                </div>
            </div>
        </div>
    `;
}

function renderPeerPoints() {
    const dashboard = document.getElementById('student-dashboard');
    const remainingDailyPoints = getRemainingDailyPoints();
    const classmates = Object.values(MOCK_USERS)
        .filter(u => u.role === 'Student' && u.name !== currentUser.name && u.class === currentUser.class)
        .map(u => `<option value="${u.name}">${u.name}</option>`).join('');

    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Give Points -->
            <div class="peer-points-card">
                <h3>Give Peer Points</h3>
                <p class="text-sm mb-4 opacity-90">Recognize your classmates' good behavior!</p>
                <p class="text-sm mb-4 opacity-90">Fixed amount: ${PEER_POINTS_AMOUNT} points • Limit: ${DAILY_POINT_LIMIT} per day</p>
                
                ${remainingDailyPoints > 0 ? `
                    <form onsubmit="handlePeerPoints(event)" class="space-y-3">
                        <select id="peer-recipient" class="w-full" required>
                            <option value="">Select a classmate...</option>
                            ${classmates}
                        </select>
                        <div class="p-3 rounded-lg" style="background: var(--light-gray);">
                            <p class="font-bold text-center" style="color: var(--primary-green);">Fixed: ${PEER_POINTS_AMOUNT} Points</p>
                        </div>
                        <input type="text" id="peer-reason" class="w-full" placeholder="Reason (optional)" maxlength="100">
                        <button type="submit" class="btn-primary w-full">
                            🤝 Give ${PEER_POINTS_AMOUNT} Points (${remainingDailyPoints} left today)
                        </button>
                    </form>
                ` : `
                    <div class="daily-limit">
                        Daily limit reached! Try again tomorrow.
                    </div>
                `}
            </div>
            
            <!-- Recent Activity -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">📈 Point Activity</h3>
                <div class="space-y-3">
                    <div class="p-3 rounded-lg" style="background: var(--light-gray);">
                        <p class="font-bold" style="color: var(--dark-gray);">Today's Summary</p>
                        <p class="text-sm" style="color: var(--neutral-gray);">Points given: ${DAILY_POINT_LIMIT - remainingDailyPoints} / ${DAILY_POINT_LIMIT}</p>
                        <p class="text-sm" style="color: var(--neutral-gray);">Points per gift: ${PEER_POINTS_AMOUNT}</p>
                    </div>
                    
                    <div class="p-3 rounded-lg" style="background: linear-gradient(135deg, var(--accent-yellow), #ffb700);">
                        <p class="font-bold" style="color: var(--dark-gray);">💡 Pro Tip</p>
                        <p class="text-sm" style="color: var(--dark-gray);">Recognize good behavior to build a positive classroom culture!</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Class Leaderboard -->
        <div class="card p-6 mt-6">
            <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">🏆 ${currentUser.class} Class Ranking</h3>
            <div class="space-y-3">
                ${MOCK_LEADERBOARD.filter(u => MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name)].class === currentUser.class).map((u, index) => {
        const isCurrentUser = u.name === currentUser.name;
        const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name)];
        const userRank = getCurrentRank(userData.points);
        return `
                        <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                            <div class="flex items-center gap-4">
                                <div class="leaderboard-rank">${index + 1}</div>
                                <div>
                                    <div class="font-bold" style="color: var(--dark-gray);">
                                        ${u.name} ${isCurrentUser ? '(YOU)' : ''}
                                    </div>
                                    <div class="rank-badge rank-${userRank.color} text-xs">${userRank.name}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-lg" style="color: var(--primary-green);">
                                    ${userData.points.toLocaleString()}
                                </div>
                                <div class="text-xs" style="color: var(--neutral-gray);">points</div>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
}

// Behavior points handler
function handleBehaviorPoints(event) {
    event.preventDefault();
    const recipient = document.getElementById('behavior-recipient').value;
    const reason = document.getElementById('behavior-reason').value || 'Good behavior';

    if (!recipient)
    {
        showToast('Please select a recipient', 'error');
        return;
    }

    giveBehaviorPoints(recipient, reason);
    event.target.reset();
}

// Task creation handler
function handleCreateTask(event) {
    event.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskBlock = document.getElementById('task-block').value;
    const taskType = document.getElementById('task-type').value;
    const dueDate = document.getElementById('task-due-date').value;
    const description = document.getElementById('task-description').value;

    if (!taskName || !taskBlock || !taskType || !dueDate)
    {
        showToast('Please fill in task name, block, type, and due date', 'error');
        return;
    }

    createStudentTask(taskName, taskType, description, taskBlock, dueDate);
    event.target.reset();
}

// Tutoring question handler
function handleTutoringQuestion(event) {
    event.preventDefault();
    const question = document.getElementById('tutoring-question').value;
    const subject = document.getElementById('tutoring-subject').value;

    if (!question || !subject)
    {
        showToast('Please fill in question and subject', 'error');
        return;
    }

    askTutoringQuestion(question, subject);
    event.target.reset();
}

// Answer tutoring question handler
function handleAnswerQuestion(event, questionId) {
    event.preventDefault();
    const answer = document.getElementById(`answer-${questionId}`).value;

    if (!answer)
    {
        showToast('Please provide an answer', 'error');
        return;
    }

    answerTutoringQuestion(questionId, answer);
    event.target.reset();
}

// Combined Competition section (Leaderboard + Class Blocks)
function renderCompetition() {
    const dashboard = document.getElementById('student-dashboard');
    const user = currentUser;
    const userGrade = parseInt(user.class.charAt(0));
    const myClass = user.class;
    const myClassData = CLASS_BLOCKS[myClass];
    const myRank = MOCK_LEADERBOARD.findIndex(u => u.name === user.name) + 1;

    // Grade-level leaderboard
    const gradeStudents = MOCK_LEADERBOARD.filter(u => {
        const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name)];
        return parseInt(userData.class.charAt(0)) === userGrade;
    });

    const gradeLeaderboardHTML = gradeStudents.map((u, index) => {
        const isCurrentUser = u.name === user.name;
        const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name)];
        const userRank = getCurrentRank(userData.points);
        return `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                <div class="flex items-center gap-4">
                    <div class="leaderboard-rank">${index + 1}</div>
                    <div>
                        <div class="font-bold" style="color: var(--dark-gray);">
                            ${u.name} ${isCurrentUser ? '(YOU)' : ''} - ${userData.class}
                        </div>
                        <div class="rank-badge rank-${userRank.color} text-xs">${userRank.name}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg" style="color: var(--primary-green);">
                        ${userData.points.toLocaleString()}
                    </div>
                    <div class="text-xs" style="color: var(--neutral-gray);">points</div>
                </div>
            </div>
        `;
    }).join('');

    // Class competition blocks
    const classBlocksHTML = Object.entries(CLASS_BLOCKS)
        .filter(([className, data]) => data.grade === userGrade)
        .map(([className, data]) => {
            const isMyClass = className === myClass;
            const rankColor = data.rank === 1 ? 'gold' : data.rank === 2 ? 'silver' : data.rank === 3 ? 'bronze' : 'gray';
            return `
                <div class="card p-4 ${isMyClass ? 'ring-2 ring-primary-green' : ''}" style="background: ${isMyClass ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' : 'var(--white)'};">
                    <div class="flex justify-between items-center">
                        <div>
                            <h4 class="font-bold text-lg" style="color: var(--dark-gray);">
                                ${className} ${isMyClass ? '(Your Class)' : ''}
                            </h4>
                            <p class="text-sm" style="color: var(--neutral-gray);">${data.students} students</p>
                        </div>
                        <div class="text-right">
                            <div class="rank-badge rank-${rankColor} text-xs mb-1">Rank #${data.rank}</div>
                            <div class="font-bold" style="color: var(--primary-green);">${data.totalPoints.toLocaleString()}</div>
                            <div class="text-xs" style="color: var(--neutral-gray);">points</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <!-- My Rank Overview -->
        <div class="card p-6 mb-6 text-center">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h3 class="font-bold mb-2" style="color: var(--dark-gray);">Global Rank</h3>
                    <div class="text-4xl font-bold" style="color: var(--primary-green);">#${myRank}</div>
                </div>
                <div>
                    <h3 class="font-bold mb-2" style="color: var(--dark-gray);">Grade ${userGrade} Rank</h3>
                    <div class="text-4xl font-bold" style="color: var(--secondary-blue);">#${gradeStudents.findIndex(u => u.name === user.name) + 1}</div>
                </div>
                <div>
                    <h3 class="font-bold mb-2" style="color: var(--dark-gray);">Class Rank</h3>
                    <div class="text-4xl font-bold" style="color: var(--accent-yellow);">#${myClassData.rank}</div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Grade Student Competition -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">🏆 Grade ${userGrade} Students</h3>
                <div class="space-y-3 max-h-96 overflow-y-auto">
                    ${gradeLeaderboardHTML}
                </div>
            </div>

            <!-- Class Competition -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">🏫 Grade ${userGrade} Classes</h3>
                <div class="space-y-4">
                    ${classBlocksHTML}
                </div>
            </div>
        </div>
    `;
}

// Dedicated Behavior Points section
function renderBehaviorPoints() {
    const dashboard = document.getElementById('student-dashboard');
    const user = currentUser;
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === user.name);
    const remainingGives = getRemainingGives();

    // Get classmates excluding those already given to today
    const today = getTodayKey();
    const todayGivenTo = dailyGivenTo[userEmail] ? (dailyGivenTo[userEmail][today] || []) : [];

    const availableClassmates = Object.values(MOCK_USERS)
        .filter(u => u.role === 'Student' && u.name !== user.name && u.class === user.class)
        .filter(u => !todayGivenTo.includes(u.name))
        .filter(u => {
            const recipientEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name);
            return canReceiveBehaviorPoints(recipientEmail);
        });

    const classmateOptions = availableClassmates.map(u => `<option value="${u.name}">${u.name}</option>`).join('');

    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Give Behavior Points -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">❤️ Give Behavior Points</h3>
                <p class="text-sm mb-4" style="color: var(--neutral-gray);">
                    Recognize good behavior in your classmates! You can give ${DAILY_GIVE_LIMIT} per day, and each person can receive ${DAILY_RECEIVE_LIMIT} per day.
                </p>
                
                ${remainingGives > 0 && availableClassmates.length > 0 ? `
                    <form onsubmit="handleBehaviorPoints(event)" class="space-y-4">
                        <div>
                            <label class="block font-bold mb-2" style="color: var(--dark-gray);">Select Classmate:</label>
                            <select id="behavior-recipient" class="w-full" required>
                                <option value="">Choose someone...</option>
                                ${classmateOptions}
                            </select>
                        </div>
                        
                        <div class="p-4 rounded-lg text-center" style="background: var(--light-gray);">
                            <p class="font-bold text-lg" style="color: var(--primary-green);">Fixed: ${BEHAVIOR_POINTS_AMOUNT} Points</p>
                            <p class="text-sm" style="color: var(--neutral-gray);">Every behavior point is worth the same</p>
                        </div>
                        
                        <div>
                            <label class="block font-bold mb-2" style="color: var(--dark-gray);">Reason (Optional):</label>
                            <input type="text" id="behavior-reason" class="w-full" placeholder="What good behavior did they show?" maxlength="100">
                        </div>
                        
                        <button type="submit" class="btn-primary w-full">
                            ❤️ Give ${BEHAVIOR_POINTS_AMOUNT} Points (${remainingGives} left today)
                        </button>
                    </form>
                ` : `
                    <div class="text-center py-8" style="color: var(--neutral-gray);">
                        ${remainingGives === 0 ? '✅ You\'ve given all your behavior points for today!' :
            availableClassmates.length === 0 ? '📝 All available classmates have received their daily limit!' :
                'No one available to give points to right now.'}
                    </div>
                `}
            </div>
            
            <!-- Today's Activity -->
            <div class="card p-6">
                <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">📊 Today's Activity</h3>
                <div class="space-y-4">
                    <div class="p-4 rounded-lg" style="background: var(--light-gray);">
                        <h4 class="font-bold mb-2" style="color: var(--dark-gray);">Your Giving</h4>
                        <p class="text-sm" style="color: var(--neutral-gray);">Given today: ${DAILY_GIVE_LIMIT - remainingGives} / ${DAILY_GIVE_LIMIT}</p>
                        <p class="text-sm" style="color: var(--neutral-gray);">Remaining: ${remainingGives}</p>
                    </div>
                    
                    ${todayGivenTo.length > 0 ? `
                        <div class="p-4 rounded-lg" style="background: linear-gradient(135deg, #e8f5e8, #f0fff0);">
                            <h4 class="font-bold mb-2" style="color: var(--dark-gray);">Given To Today:</h4>
                            <ul class="text-sm space-y-1">
                                ${todayGivenTo.map(name => `<li>• ${name}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="p-4 rounded-lg" style="background: linear-gradient(135deg, var(--accent-yellow), #ffb700);">
                        <h4 class="font-bold mb-2" style="color: var(--dark-gray);">💡 Remember</h4>
                        <p class="text-sm" style="color: var(--dark-gray);">You can only give to each person once per day!</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Class Overview -->
        <div class="card p-6 mt-6">
            <h3 class="text-2xl font-bold mb-4" style="color: var(--dark-gray);">👥 ${user.class} Class Overview</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${Object.values(MOCK_USERS)
            .filter(u => u.role === 'Student' && u.class === user.class)
            .map(u => {
                const isCurrentUser = u.name === user.name;
                const userRank = getCurrentRank(u.points);
                const canGiveTo = !todayGivenTo.includes(u.name) && !isCurrentUser;
                const recipientEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name);
                const canReceive = canReceiveBehaviorPoints(recipientEmail);

                return `
                            <div class="p-4 rounded-lg ${isCurrentUser ? 'ring-2 ring-primary-green' : ''}" style="background: ${isCurrentUser ? 'linear-gradient(135deg, #e8f5e8, #f0fff0)' : 'var(--light-gray)'};">
                                <h4 class="font-bold" style="color: var(--dark-gray);">
                                    ${u.name} ${isCurrentUser ? '(You)' : ''}
                                </h4>
                                <div class="rank-badge rank-${userRank.color} text-xs mb-2">${userRank.name}</div>
                                <p class="text-sm" style="color: var(--neutral-gray);">${u.points.toLocaleString()} points</p>
                                ${!isCurrentUser ? `
                                    <p class="text-xs mt-1" style="color: ${canGiveTo && canReceive ? 'var(--primary-green)' : 'var(--accent-red)'};">
                                        ${canGiveTo && canReceive ? '✅ Available' :
                            !canGiveTo ? '🚫 Already given to' :
                                '📝 Daily limit reached'}
                                    </p>
                                ` : ''}
                            </div>
                        `;
            }).join('')}
            </div>
        </div>
    `;
}

// --- 5. TEACHER LOGIC & RENDER ---
function submitBonusRequest(event) {
    event.preventDefault();
    const studentName = document.getElementById('bonus-student').value;
    const points = parseInt(document.getElementById('bonus-points').value);
    const reason = document.getElementById('bonus-reason').value;

    if (isNaN(points) || points <= 0 || points > TEACHER_BEHAVIOR_MAX || !reason)
    {
        showToast(`Please enter a valid point value (1-${TEACHER_BEHAVIOR_MAX}) and reason.`, 'error');
        return;
    }

    // Find student and award points directly (no admin approval needed)
    const studentEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === studentName);
    if (studentEmail && MOCK_USERS[studentEmail].role === 'Student')
    {
        MOCK_USERS[studentEmail].points += points;

        updateLeaderboard();
        showToast(`✅ Awarded ${points} behavior points to ${studentName}!`, 'success');
        document.getElementById('bonus-form').reset();
        renderTeacherDashboard();
    } else
    {
        showToast('Student not found!', 'error');
    }
}

// Teacher functions for Task Completion Approval
window.teacherApproveTask = (requestId, taskId, studentName, points) => {
    const requests = loadPendingRequests();
    const index = requests.findIndex(r => r.id === requestId);

    if (index !== -1)
    {
        const request = requests[index];

        // 1. Find the student and update points (with cap check)
        const studentEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === studentName);
        const userObj = MOCK_USERS[studentEmail];

        if (userObj.points >= MOCK_POINT_CAP)
        {
            showToast(`Cannot approve: ${studentName} has reached the cap!`, 'error');
        } else
        {
            let pointsToAward = points;
            if (userObj.points + points > MOCK_POINT_CAP)
            {
                pointsToAward = MOCK_POINT_CAP - userObj.points;
            }
            userObj.points += pointsToAward;

            // 2. Find the task and mark as COMPLETE (and not pending)
            const taskToComplete = MOCK_TASKS.find(t => t.id === taskId);
            if (taskToComplete)
            {
                taskToComplete.completed = true;
                taskToComplete.pending = false;
            }

            // 3. Update Leaderboard
            updateLeaderboard();

            showToast(`✅ TASK APPROVED! ${studentName} received ${pointsToAward} points.`, 'success');
        }

        // 4. Remove request
        requests.splice(index, 1);
        savePendingRequests(requests);
        renderTeacherDashboard();
    }
};

window.teacherRejectTask = (requestId, taskId, studentName) => {
    const requests = loadPendingRequests();
    const index = requests.findIndex(r => r.id === requestId);

    if (index !== -1)
    {
        // 1. Find the task and remove pending status, allowing resubmission
        const taskToReject = MOCK_TASKS.find(t => t.id === taskId);
        if (taskToReject)
        {
            taskToReject.pending = false;
        }

        // 2. Remove request
        requests.splice(index, 1);
        savePendingRequests(requests);
        showToast(`❌ TASK REJECTED: ${studentName}'s completion request was removed.`, 'warning');
        renderTeacherDashboard();
    }
};

// Functions to handle student-created tasks
function approveStudentTask(taskId) {
    const taskIndex = studentTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = studentTasks[taskIndex];
    const approvedPoints = parseInt(document.getElementById(`points-${taskId}`).value) || task.suggestedPoints;

    // Award points to student
    const studentEmail = task.studentEmail;
    if (MOCK_USERS[studentEmail]) {
        MOCK_USERS[studentEmail].points += approvedPoints;
        updateLeaderboard();
    }

    // Remove task from studentTasks array (task is completed)
    studentTasks.splice(taskIndex, 1);

    showToast(`✅ Task "${task.name}" approved for ${approvedPoints} points!`, 'success');
    renderTeacherDashboard();
}

function rejectStudentTask(taskId) {
    const taskIndex = studentTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = studentTasks[taskIndex];
    
    // Remove task from studentTasks array (task is rejected and removed)
    studentTasks.splice(taskIndex, 1);

    localStorage.setItem('studentTasks', JSON.stringify(studentTasks));
    showToast(`❌ Task "${task.name}" rejected and removed`, 'error');
    renderTeacherDashboard();
}

function renderTeacherDashboard() {
    const dashboard = document.getElementById('teacher-dashboard');
    const user = currentUser;
    const classStudents = MOCK_LEADERBOARD.filter(u => MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === u.name)].class === user.class);
    const studentOptions = classStudents.map(student => 
        `<option value="${student.name}">${student.name}</option>`
    ).join('');
    
    // Calculate stats
    const totalStudents = classStudents.length;
    const totalPendingTasks = studentTasks.filter(task => task.status === 'pending_approval').length;
    const avgPoints = Math.round(classStudents.reduce((sum, student) => {
        const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === student.name)];
        return sum + userData.points;
    }, 0) / totalStudents) || 0;

    dashboard.innerHTML = `
        <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div class="max-w-7xl mx-auto px-4">
                <nav class="flex space-x-0">
                    <button onclick="showTeacherSection('home')" class="teacher-nav-item ${currentTeacherSection === 'home' ? 'active' : ''}" data-section="home">
                        🏠 Home
                    </button>
                    <button onclick="showTeacherSection('complaints')" class="teacher-nav-item ${currentTeacherSection === 'complaints' ? 'active' : ''}" data-section="complaints">
                        ⚠️ Complaints
                    </button>
                    <button onclick="showTeacherSection('positive')" class="teacher-nav-item ${currentTeacherSection === 'positive' ? 'active' : ''}" data-section="positive">
                        ❤️ Positive Behavior
                    </button>
                    <button onclick="showTeacherSection('blocks')" class="teacher-nav-item ${currentTeacherSection === 'blocks' ? 'active' : ''}" data-section="blocks">
                        🏫 Block Manage
                    </button>
                    <button onclick="showTeacherSection('calendar')" class="teacher-nav-item ${currentTeacherSection === 'calendar' ? 'active' : ''}" data-section="calendar">
                        📅 Calendar
                    </button>
                    <button onclick="showTeacherSection('messages')" class="teacher-nav-item ${currentTeacherSection === 'messages' ? 'active' : ''}" data-section="messages">
                        💬 Messages
                    </button>
                    <button onclick="showTeacherSection('leaderboard')" class="teacher-nav-item ${currentTeacherSection === 'leaderboard' ? 'active' : ''}" data-section="leaderboard">
                        🏆 Leaderboard
                    </button>
                </nav>
            </div>
        </div>
        
        <div class="max-w-7xl mx-auto px-4">
            <div id="teacher-content">
                ${getTeacherSectionContent(currentTeacherSection || 'home', user, classStudents, studentOptions, totalPendingTasks, totalStudents, avgPoints)}
            </div>
        </div>
    `;
    
    refreshAppleTVEffects();
}

// Teacher point management functions
function removeStudentPoints(event) {
    event.preventDefault();
    
    const studentName = document.getElementById('remove-student').value;
    const pointsToRemove = parseInt(document.getElementById('remove-points').value);
    const reason = document.getElementById('remove-reason').value;
    
    if (!studentName || !pointsToRemove || !reason) {
        showToast('❌ Please fill in all fields', 'error');
        return;
    }
    
    // Find student
    const studentEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === studentName);
    if (!studentEmail) {
        showToast('❌ Student not found', 'error');
        return;
    }
    
    // Remove points
    MOCK_USERS[studentEmail].points = Math.max(0, MOCK_USERS[studentEmail].points - pointsToRemove);
    
    // Log the action
    const complaints = JSON.parse(localStorage.getItem('studentComplaints') || '[]');
    complaints.push({
        id: Date.now(),
        studentName,
        studentEmail,
        teacher: currentUser.name,
        type: 'Point Removal',
        pointsRemoved: pointsToRemove,
        reason,
        date: new Date().toISOString()
    });
    localStorage.setItem('studentComplaints', JSON.stringify(complaints));
    
    updateLeaderboard();
    showToast(`✅ Removed ${pointsToRemove} points from ${studentName}`, 'success');
    
    // Reset form
    document.getElementById('remove-student').value = '';
    document.getElementById('remove-points').value = '';
    document.getElementById('remove-reason').value = '';
    
    renderTeacherDashboard();
}

function addStudentComplaint(event) {
    event.preventDefault();
    
    const studentName = document.getElementById('complaint-student').value;
    const severity = document.getElementById('complaint-severity').value;
    const description = document.getElementById('complaint-description').value;
    
    if (!studentName || !severity || !description) {
        showToast('❌ Please fill in all fields', 'error');
        return;
    }
    
    // Find student
    const studentEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === studentName);
    if (!studentEmail) {
        showToast('❌ Student not found', 'error');
        return;
    }
    
    // Determine point penalty
    const penalties = {
        minor: 10,
        moderate: 25,
        major: 50
    };
    const pointPenalty = penalties[severity];
    
    // Remove points
    MOCK_USERS[studentEmail].points = Math.max(0, MOCK_USERS[studentEmail].points - pointPenalty);
    
    // Log the complaint
    const complaints = JSON.parse(localStorage.getItem('studentComplaints') || '[]');
    complaints.push({
        id: Date.now(),
        studentName,
        studentEmail,
        teacher: currentUser.name,
        type: 'Complaint',
        severity,
        pointsRemoved: pointPenalty,
        description,
        date: new Date().toISOString()
    });
    localStorage.setItem('studentComplaints', JSON.stringify(complaints));
    
    updateLeaderboard();
    showToast(`⚠️ Added ${severity} complaint for ${studentName} (-${pointPenalty} points)`, 'warning');
    
    // Reset form
    document.getElementById('complaint-student').value = '';
    document.getElementById('complaint-severity').value = '';
    document.getElementById('complaint-description').value = '';
    
    renderTeacherDashboard();
}

// --- 6. ADMIN LOGIC & RENDER ---
window.approveRequest = (requestId) => {
    const requests = loadPendingRequests();
    const index = requests.findIndex(r => r.id === requestId);

    if (index !== -1) {
        const request = requests[index];

        // Only Admin approves Bonus Points
        if (request.type !== 'Bonus Point') {
            showToast('Error: Admin only handles Bonus Points in this demo.', 'error');
            return;
        }

        // Find student in mock data and award points
        const studentEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === request.studentName);
        if (studentEmail) {
            const currentTotal = MOCK_USERS[studentEmail].points;
            let pointsToAward = request.points;

            // Check against point cap
            if (currentTotal >= MOCK_POINT_CAP) {
                showToast(`Cannot approve: ${request.studentName} has reached the point cap! Request rejected.`, 'error');
                requests.splice(index, 1);
                savePendingRequests(requests);
                renderAdminDashboard();
                return;
            }

            if (currentTotal + request.points > MOCK_POINT_CAP) {
                pointsToAward = MOCK_POINT_CAP - currentTotal;
            }

            MOCK_USERS[studentEmail].points += pointsToAward;
            updateLeaderboard();
            showToast(`✅ APPROVED! ${request.studentName} received ${pointsToAward} points.`, 'success');
        } else {
            showToast(`Student ${request.studentName} not found.`, 'error');
        }

        requests.splice(index, 1);
        savePendingRequests(requests);
        renderAdminDashboard();
    }
};

window.rejectRequest = (requestId) => {
    const requests = loadPendingRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1)
    {
        const studentName = requests[index].studentName;
        requests.splice(index, 1); // Remove request
        savePendingRequests(requests);
        showToast(`❌ REJECTED: Bonus request for ${studentName} was removed.`, 'warning');
        renderAdminDashboard();
    }
};

function renderAdminDashboard() {
    const dashboard = document.getElementById('admin-dashboard');
    const user = currentUser;
    const totalStudents = Object.values(MOCK_USERS).filter(u => u.role === 'Student').length;

    dashboard.innerHTML = `
        ${createHeader(user.name, user.role)}
        
        <div class="max-w-7xl mx-auto px-4">
            <!-- Admin Controls -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold mb-2" style="color: var(--dark-gray);">Admin Dashboard</h1>
                <p class="text-gray-600">Manage students, schools, and leaderboard</p>
            </div>

            <!-- Management Actions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4">🏫 School Settings</h3>
                    <div class="space-y-3">
                        <label class="block text-sm font-medium">Blocks per Day</label>
                        <input type="number" id="blocks-per-day" value="${systemSettings.blocksPerDay}" min="1" max="8" class="w-full p-2 border rounded">
                        <button onclick="updateSystemSettings()" class="btn-primary w-full text-sm">
                            Update Settings
                        </button>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4">📚 View All Blocks</h3>
                    <div class="space-y-3">
                        <p class="text-sm text-gray-600">View blocks created by teachers</p>
                        <button onclick="showAllBlocksAdmin()" class="btn-secondary w-full text-sm">
                            View All Blocks
                        </button>
                        <div class="text-center text-sm text-gray-500">
                            ${Object.keys(schoolBlocks).length} blocks created
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4">👥 Add Student</h3>
                    <div class="space-y-3">
                        <input type="text" id="student-name" placeholder="Student Name" class="w-full p-2 border rounded">
                        <input type="email" id="student-email" placeholder="student@school.edu" class="w-full p-2 border rounded">
                        <select id="student-block" class="w-full p-2 border rounded">
                            <option value="">Select Block</option>
                            ${Object.keys(CLASS_BLOCKS).map(block => `<option value="${block}">${block}</option>`).join('')}
                        </select>
                        <button onclick="addStudent()" class="btn-primary w-full text-sm">
                            Add Student
                        </button>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4">🚫 Student Actions</h3>
                    <div class="space-y-3">
                        <select id="manage-student" class="w-full p-2 border rounded">
                            <option value="">Select Student</option>
                            ${Object.entries(MOCK_USERS).filter(([email, user]) => user.role === 'Student').map(([email, user]) => 
                                `<option value="${email}">${user.name} (${user.class})</option>`
                            ).join('')}
                        </select>
                        <button onclick="blockStudent()" class="btn-danger w-full text-sm">
                            Block Student
                        </button>
                        <button onclick="resetStudentPoints()" class="btn-secondary w-full text-sm">
                            Reset Points
                        </button>
                    </div>
                </div>
            </div>

            <!-- Full Leaderboard -->
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-semibold">🏆 Complete Leaderboard</h2>
                        <div class="flex gap-2">
                            <button onclick="exportLeaderboard()" class="btn-secondary text-sm">
                                📊 Export Data
                            </button>
                            <button onclick="refreshLeaderboard()" class="btn-primary text-sm">
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="space-y-2">
                        ${MOCK_LEADERBOARD.map((student, index) => {
                            const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === student.name)];
                            const rank = getCurrentRank(student.points);
                            const isBlocked = userData.blocked || false;
                            return `
                                <div class="flex items-center justify-between p-4 rounded-lg ${
                                    isBlocked ? 'bg-red-50 border border-red-200' :
                                    index < 3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                                } hover:shadow-md transition-all cursor-pointer" onclick="viewProfile('${student.name}')">
                                    <div class="flex items-center gap-4">
                                        <span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                            isBlocked ? 'bg-red-500 text-white' :
                                            index === 0 ? 'bg-yellow-500 text-white' :
                                            index === 1 ? 'bg-gray-400 text-white' :
                                            index === 2 ? 'bg-orange-600 text-white' :
                                            'bg-gray-200 text-gray-600'
                                        }">
                                            ${isBlocked ? '🚫' : index + 1}
                                        </span>
                                        <div>
                                            <p class="font-medium ${isBlocked ? 'text-red-600' : ''}">${student.name} ${isBlocked ? '(BLOCKED)' : ''}</p>
                                            <p class="text-sm text-gray-500">${userData.class} • ${rank.name}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-semibold text-green-600">${student.points.toLocaleString()}</p>
                                        <p class="text-xs text-gray-500">points</p>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize Apple TV effects for new content
    refreshAppleTVEffects();
}

// --- ADMIN MANAGEMENT FUNCTIONS ---
function changeSchool() {
    const schoolSelect = document.getElementById('school-select');
    const selectedSchool = schoolSelect.value;
    
    if (selectedSchool === 'current') {
        showToast('Already viewing current school', 'info');
        return;
    }
    
    showToast(`🏫 Switched to ${schoolSelect.options[schoolSelect.selectedIndex].text}`, 'success');
    // In a real app, this would load different school data
}

function addStudent() {
    const name = document.getElementById('student-name').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const block = document.getElementById('student-block').value;
    
    if (!name || !email || !block) {
        showToast('❌ Please fill in all fields', 'error');
        return;
    }
    
    if (MOCK_USERS[email]) {
        showToast('❌ Student with this email already exists', 'error');
        return;
    }
    
    // Add new student
    MOCK_USERS[email] = {
        name: name,
        role: 'Student',
        class: block,
        points: 0,
        blocked: false
    };
    
    // Add to leaderboard
    MOCK_LEADERBOARD.push({ name: name, points: 0 });
    updateLeaderboard();
    
    // Clear form
    document.getElementById('student-name').value = '';
    document.getElementById('student-email').value = '';
    document.getElementById('student-block').value = '';
    
    showToast(`✅ Added ${name} to ${block}`, 'success');
    renderAdminDashboard();
}

function blockStudent() {
    const studentEmail = document.getElementById('manage-student').value;
    
    if (!studentEmail) {
        showToast('❌ Please select a student', 'error');
        return;
    }
    
    const student = MOCK_USERS[studentEmail];
    if (!student) {
        showToast('❌ Student not found', 'error');
        return;
    }
    
    student.blocked = !student.blocked;
    const action = student.blocked ? 'blocked' : 'unblocked';
    
    showToast(`${student.blocked ? '🚫' : '✅'} ${student.name} has been ${action}`, 'success');
    renderAdminDashboard();
}

function resetStudentPoints() {
    const studentEmail = document.getElementById('manage-student').value;
    
    if (!studentEmail) {
        showToast('❌ Please select a student', 'error');
        return;
    }
    
    const student = MOCK_USERS[studentEmail];
    if (!student) {
        showToast('❌ Student not found', 'error');
        return;
    }
    
    student.points = 0;
    updateLeaderboard();
    
    showToast(`🔄 Reset ${student.name}'s points to 0`, 'success');
    renderAdminDashboard();
}

function exportLeaderboard() {
    const data = MOCK_LEADERBOARD.map((student, index) => {
        const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === student.name)];
        return {
            rank: index + 1,
            name: student.name,
            class: userData.class,
            points: student.points,
            status: userData.blocked ? 'BLOCKED' : 'ACTIVE'
        };
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Rank,Name,Class,Points,Status\n"
        + data.map(row => `${row.rank},${row.name},${row.class},${row.points},${row.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leaderboard_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('📊 Leaderboard exported successfully', 'success');
}

function refreshLeaderboard() {
    updateLeaderboard();
    renderAdminDashboard();
    showToast('🔄 Leaderboard refreshed', 'success');
}

// --- BLOCK MANAGEMENT FUNCTIONS ---
function updateSystemSettings() {
    const blocksPerDay = parseInt(document.getElementById('blocks-per-day').value);
    
    if (blocksPerDay < 1 || blocksPerDay > 8) {
        showToast('❌ Blocks per day must be between 1 and 8', 'error');
        return;
    }
    
    systemSettings.blocksPerDay = blocksPerDay;
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    
    showToast(`✅ Updated to ${blocksPerDay} blocks per day`, 'success');
    renderAdminDashboard();
}

function addBlock() {
    const blockName = document.getElementById('new-block-name').value.trim();
    
    if (!blockName) {
        showToast('❌ Please enter a block name', 'error');
        return;
    }
    
    const blockId = `Block-${Object.keys(schoolBlocks).length + 1}`;
    
    if (Object.values(schoolBlocks).some(block => block.name === blockName)) {
        showToast('❌ Block with this name already exists', 'error');
        return;
    }
    
    schoolBlocks[blockId] = {
        name: blockName,
        students: [],
        teacher: null,
        active: true
    };
    
    localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
    document.getElementById('new-block-name').value = '';
    
    showToast(`✅ Added block: ${blockName}`, 'success');
    renderAdminDashboard();
}

function showBlockManager() {
    // Create modal for block management
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    const blocksHTML = Object.entries(schoolBlocks).map(([blockId, block]) => `
        <div class="flex items-center justify-between p-3 border rounded-lg ${block.active ? 'bg-green-50' : 'bg-red-50'}">
            <div>
                <p class="font-medium">${block.name}</p>
                <p class="text-sm text-gray-600">${block.students.length} students • ${block.teacher || 'No teacher assigned'}</p>
            </div>
            <div class="flex gap-2">
                <button onclick="toggleBlock('${blockId}')" class="px-3 py-1 text-sm rounded ${block.active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}">
                    ${block.active ? 'Deactivate' : 'Activate'}
                </button>
                <button onclick="deleteBlock('${blockId}')" class="px-3 py-1 text-sm bg-red-500 text-white rounded">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h2 class="text-xl font-bold mb-4">📚 Block Manager</h2>
            <div class="space-y-3">
                ${blocksHTML}
            </div>
            <button onclick="document.body.removeChild(this.closest('.fixed'))" 
                    class="w-full mt-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function toggleBlock(blockId) {
    if (schoolBlocks[blockId]) {
        schoolBlocks[blockId].active = !schoolBlocks[blockId].active;
        localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
        showToast(`${schoolBlocks[blockId].active ? '✅ Activated' : '❌ Deactivated'} ${schoolBlocks[blockId].name}`, 'success');
        showBlockManager(); // Refresh modal
    }
}

function deleteBlock(blockId) {
    if (schoolBlocks[blockId]) {
        const blockName = schoolBlocks[blockId].name;
        delete schoolBlocks[blockId];
        localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
        showToast(`🗑️ Deleted block: ${blockName}`, 'success');
        showBlockManager(); // Refresh modal
    }
}

function showAllBlocksAdmin() {
    // Create modal to view all teacher-created blocks
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    const blocksHTML = Object.entries(schoolBlocks).map(([blockId, block]) => `
        <div class="border rounded-lg p-4 bg-white">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${block.icon || '📚'}</span>
                    <div>
                        <h4 class="font-medium">${block.name}</h4>
                        <p class="text-sm text-gray-600">
                            Teacher: ${block.teacher || 'Unassigned'} • 
                            Block ${block.blockNumber || 'Unassigned'} • 
                            ${block.students.length} students
                        </p>
                        <p class="text-xs text-gray-500">Total Points: ${block.totalPoints || 0}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="px-2 py-1 text-xs rounded ${block.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${block.active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 class="text-xl font-bold mb-4">📚 All School Blocks</h2>
            <p class="text-gray-600 mb-4">View all blocks created by teachers</p>
            
            <div class="space-y-3">
                ${Object.keys(schoolBlocks).length > 0 ? blocksHTML : '<p class="text-gray-500 text-center py-8">No blocks created yet</p>'}
            </div>
            
            <button onclick="document.body.removeChild(this.closest('.fixed'))" 
                    class="w-full mt-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// --- TEACHER BLOCK MANAGEMENT ---
function switchTeacherBlock() {
    const selectedBlock = document.getElementById('teacher-block-select').value;
    
    if (selectedBlock) {
        // Update teacher's current block
        const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
        MOCK_USERS[userEmail].class = selectedBlock;
        
        // Assign teacher to block
        if (schoolBlocks[selectedBlock]) {
            schoolBlocks[selectedBlock].teacher = currentUser.name;
            localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
        }
        
        showToast(`📚 Switched to ${schoolBlocks[selectedBlock].name}`, 'success');
    } else {
        showToast('📚 Viewing all blocks', 'success');
    }
    
    renderTeacherDashboard();
}

function showTeacherBlockManager() {
    // Create modal for comprehensive block management
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    const teacherBlocks = Object.entries(schoolBlocks).filter(([id, block]) => block.teacher === currentUser.name);
    const availableStudents = Object.entries(MOCK_USERS).filter(([email, user]) => user.role === 'Student');
    
    const blocksHTML = teacherBlocks.map(([blockId, block]) => `
        <div class="border rounded-lg p-4 bg-white">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${block.icon || '📚'}</span>
                    <div>
                        <h4 class="font-medium">${block.name}</h4>
                        <p class="text-sm text-gray-600">${block.students.length} students • Block ${block.blockNumber || 'Unassigned'}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="customizeBlock('${blockId}')" class="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                        Customize
                    </button>
                    <button onclick="deleteTeacherBlock('${blockId}')" class="px-3 py-1 text-sm bg-red-500 text-white rounded">
                        Delete
                    </button>
                </div>
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Add Students:</label>
                <div class="flex gap-2">
                    <select id="student-select-${blockId}" class="flex-1 p-2 border rounded text-sm">
                        <option value="">Select Student</option>
                        ${availableStudents.map(([email, user]) => 
                            `<option value="${email}">${user.name} (${user.class})</option>`
                        ).join('')}
                    </select>
                    <button onclick="addStudentToTeacherBlock('${blockId}')" class="px-3 py-1 text-sm bg-green-500 text-white rounded">
                        Add
                    </button>
                </div>
            </div>
            <div class="text-sm">
                <strong>Students:</strong> ${block.students.map(email => {
                    const student = MOCK_USERS[email];
                    return student ? student.name : 'Unknown';
                }).join(', ') || 'No students'}
            </div>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 class="text-xl font-bold mb-4">📚 Block Management</h2>
            
            <!-- Create New Block -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 class="font-medium mb-3">Create New Block</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input type="text" id="new-block-name" placeholder="Block name" class="p-2 border rounded">
                    <select id="new-block-icon" class="p-2 border rounded">
                        <option value="📚">📚 Books</option>
                        <option value="🔬">🔬 Science</option>
                        <option value="📐">📐 Math</option>
                        <option value="✍️">✍️ English</option>
                        <option value="🌍">🌍 History</option>
                        <option value="🎨">🎨 Arts</option>
                        <option value="⚽">⚽ PE</option>
                        <option value="💻">💻 Technology</option>
                    </select>
                    <select id="new-block-number" class="p-2 border rounded">
                        <option value="">Choose Block Time</option>
                        ${Array.from({length: systemSettings.blocksPerDay}, (_, i) => 
                            `<option value="${i + 1}">Block ${i + 1}</option>`
                        ).join('')}
                    </select>
                    <button onclick="createNewBlock()" class="px-4 py-2 bg-green-500 text-white rounded">
                        Create
                    </button>
                </div>
            </div>
            
            <!-- Existing Blocks -->
            <div class="space-y-4">
                <h3 class="font-medium">Your Blocks:</h3>
                ${teacherBlocks.length > 0 ? blocksHTML : '<p class="text-gray-500 text-center py-4">No blocks created yet</p>'}
            </div>
            
            <button onclick="document.body.removeChild(this.closest('.fixed'))" 
                    class="w-full mt-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function assignToBlock(blockId) {
    if (schoolBlocks[blockId]) {
        schoolBlocks[blockId].teacher = currentUser.name;
        localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
        
        // Update teacher's class
        const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
        MOCK_USERS[userEmail].class = blockId;
        
        showToast(`✅ Assigned to ${schoolBlocks[blockId].name}`, 'success');
        showTeacherBlockManager(); // Refresh modal
    }
}

function createNewBlock() {
    const blockName = document.getElementById('new-block-name').value.trim();
    const blockIcon = document.getElementById('new-block-icon').value;
    const blockNumber = document.getElementById('new-block-number').value;
    
    if (!blockName) {
        showToast('❌ Please enter a block name', 'error');
        return;
    }
    
    if (!blockNumber) {
        showToast('❌ Please select a block time', 'error');
        return;
    }
    
    // Check if block number is already taken by this teacher
    const existingBlock = Object.values(schoolBlocks).find(block => 
        block.teacher === currentUser.name && block.blockNumber === parseInt(blockNumber)
    );
    
    if (existingBlock) {
        showToast(`❌ You already have a block at time ${blockNumber}`, 'error');
        return;
    }
    
    const blockId = `Block-${Date.now()}`;
    
    schoolBlocks[blockId] = {
        name: blockName,
        icon: blockIcon,
        blockNumber: parseInt(blockNumber),
        students: [],
        teacher: currentUser.name,
        active: true,
        totalPoints: 0
    };
    
    localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
    
    showToast(`✅ Created ${blockName} for Block ${blockNumber}`, 'success');
    showTeacherBlockManager(); // Refresh modal
}

function addStudentToTeacherBlock(blockId) {
    const studentEmail = document.getElementById(`student-select-${blockId}`).value;
    
    if (!studentEmail) {
        showToast('❌ Please select a student', 'error');
        return;
    }
    
    if (!schoolBlocks[blockId]) {
        showToast('❌ Block not found', 'error');
        return;
    }
    
    if (schoolBlocks[blockId].students.includes(studentEmail)) {
        showToast('❌ Student already in this block', 'error');
        return;
    }
    
    schoolBlocks[blockId].students.push(studentEmail);
    localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
    
    const studentName = MOCK_USERS[studentEmail].name;
    showToast(`✅ Added ${studentName} to ${schoolBlocks[blockId].name}`, 'success');
    showTeacherBlockManager(); // Refresh modal
}

function customizeBlock(blockId) {
    const block = schoolBlocks[blockId];
    if (!block) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-bold mb-4">Customize Block</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Block Name</label>
                    <input type="text" id="edit-block-name" value="${block.name}" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Icon</label>
                    <select id="edit-block-icon" class="w-full p-2 border rounded">
                        <option value="📚" ${block.icon === '📚' ? 'selected' : ''}>📚 Books</option>
                        <option value="🔬" ${block.icon === '🔬' ? 'selected' : ''}>🔬 Science</option>
                        <option value="📐" ${block.icon === '📐' ? 'selected' : ''}>📐 Math</option>
                        <option value="✍️" ${block.icon === '✍️' ? 'selected' : ''}>✍️ English</option>
                        <option value="🌍" ${block.icon === '🌍' ? 'selected' : ''}>🌍 History</option>
                        <option value="🎨" ${block.icon === '🎨' ? 'selected' : ''}>🎨 Arts</option>
                        <option value="⚽" ${block.icon === '⚽' ? 'selected' : ''}>⚽ PE</option>
                        <option value="💻" ${block.icon === '💻' ? 'selected' : ''}>💻 Technology</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Block Time</label>
                    <select id="edit-block-number" class="w-full p-2 border rounded">
                        ${Array.from({length: systemSettings.blocksPerDay}, (_, i) => 
                            `<option value="${i + 1}" ${block.blockNumber === (i + 1) ? 'selected' : ''}>Block ${i + 1}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="flex gap-2 mt-6">
                <button onclick="saveBlockCustomization('${blockId}')" class="flex-1 py-2 bg-blue-500 text-white rounded">
                    Save Changes
                </button>
                <button onclick="document.body.removeChild(this.closest('.fixed'))" class="flex-1 py-2 bg-gray-200 rounded">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function saveBlockCustomization(blockId) {
    const newName = document.getElementById('edit-block-name').value.trim();
    const newIcon = document.getElementById('edit-block-icon').value;
    const newBlockNumber = parseInt(document.getElementById('edit-block-number').value);
    
    if (!newName) {
        showToast('❌ Please enter a block name', 'error');
        return;
    }
    
    // Check if new block number conflicts with existing blocks
    const existingBlock = Object.entries(schoolBlocks).find(([id, block]) => 
        id !== blockId && block.teacher === currentUser.name && block.blockNumber === newBlockNumber
    );
    
    if (existingBlock) {
        showToast(`❌ You already have a block at time ${newBlockNumber}`, 'error');
        return;
    }
    
    schoolBlocks[blockId].name = newName;
    schoolBlocks[blockId].icon = newIcon;
    schoolBlocks[blockId].blockNumber = newBlockNumber;
    
    localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
    
    showToast('✅ Block updated successfully', 'success');
    
    // Close customization modal
    document.querySelector('.fixed').remove();
    
    // Refresh block manager
    showTeacherBlockManager();
}

function deleteTeacherBlock(blockId) {
    if (!schoolBlocks[blockId]) return;
    
    const blockName = schoolBlocks[blockId].name;
    delete schoolBlocks[blockId];
    localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
    
    showToast(`🗑️ Deleted ${blockName}`, 'success');
    showTeacherBlockManager(); // Refresh modal
}

function getTeacherCompetitionStats() {
    // Calculate total points for each teacher
    const teacherStats = {};
    
    // Initialize teacher stats
    Object.values(MOCK_USERS).filter(user => user.role === 'Teacher').forEach(teacher => {
        teacherStats[teacher.name] = {
            totalPoints: 0,
            blocks: 0,
            students: 0
        };
    });
    
    // Calculate points from blocks
    Object.values(schoolBlocks).forEach(block => {
        if (block.teacher && teacherStats[block.teacher]) {
            // Calculate total points from students in this block
            const blockPoints = block.students.reduce((sum, studentEmail) => {
                const student = MOCK_USERS[studentEmail];
                return sum + (student ? student.points : 0);
            }, 0);
            
            teacherStats[block.teacher].totalPoints += blockPoints;
            teacherStats[block.teacher].blocks++;
            teacherStats[block.teacher].students += block.students.length;
        }
    });
    
    // Sort teachers by total points
    const sortedTeachers = Object.entries(teacherStats)
        .sort(([,a], [,b]) => b.totalPoints - a.totalPoints)
        .slice(0, 3);
    
    const currentTeacherStats = teacherStats[currentUser.name] || { totalPoints: 0, blocks: 0, students: 0 };
    const currentTeacherRank = Object.entries(teacherStats)
        .sort(([,a], [,b]) => b.totalPoints - a.totalPoints)
        .findIndex(([name]) => name === currentUser.name) + 1;
    
    return `
        <div class="text-center p-3 bg-blue-50 rounded-lg">
            <p class="text-lg font-bold text-blue-600">${currentTeacherStats.totalPoints.toLocaleString()}</p>
            <p class="text-sm text-gray-600">Your Total Points</p>
            <p class="text-xs text-gray-500">Rank #${currentTeacherRank}</p>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg">
            <p class="text-lg font-bold text-green-600">${currentTeacherStats.blocks}</p>
            <p class="text-sm text-gray-600">Your Blocks</p>
            <p class="text-xs text-gray-500">${currentTeacherStats.students} students</p>
        </div>
        <div class="text-center p-3 bg-yellow-50 rounded-lg">
            <p class="text-lg font-bold text-yellow-600">${sortedTeachers[0] ? sortedTeachers[0][1].totalPoints.toLocaleString() : 0}</p>
            <p class="text-sm text-gray-600">Top Teacher</p>
            <p class="text-xs text-gray-500">${sortedTeachers[0] ? sortedTeachers[0][0] : 'None'}</p>
        </div>
    `;
}

// --- 7. REMOVED TILT EFFECTS ---
function initAppleTVEffects() {
    // Tilt effects removed per user request
    // This function is kept for compatibility but does nothing
}

// Initialize Apple TV effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initAppleTVEffects();
    }, 100);
});

// Re-initialize effects when switching sections or updating content
function refreshAppleTVEffects() {
    setTimeout(() => {
        initAppleTVEffects();
    }, 100);
}

// --- 8. SHOP & SCHOLY SYSTEM ---
function getRandomScholy() {
    const rand = Math.random();
    let rarity, scholyArray;
    
    if (rand < 0.70) {
        rarity = 'common';
        scholyArray = SCHOLY_TYPES.common;
    } else if (rand < 0.90) {
        rarity = 'uncommon';
        scholyArray = SCHOLY_TYPES.uncommon;
    } else if (rand < 0.98) {
        rarity = 'rare';
        scholyArray = SCHOLY_TYPES.rare;
    } else {
        rarity = 'epic';
        scholyArray = SCHOLY_TYPES.epic;
    }
    
    return scholyArray[Math.floor(Math.random() * scholyArray.length)];
}

function openScholyBox() {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    
    if (currentUser.points < SCHOLY_BOX_COST) {
        showToast(`❌ You need ${SCHOLY_BOX_COST} points to buy a Scholy Box!`, 'error');
        return;
    }
    
    // Deduct points
    MOCK_USERS[userEmail].points -= SCHOLY_BOX_COST;
    updateLeaderboard();
    
    // Generate 5 random Scholys
    const newScholys = [];
    for (let i = 0; i < SCHOLYS_PER_BOX; i++) {
        newScholys.push(getRandomScholy());
    }
    
    // Add to collection
    if (!studentScholys[userEmail]) {
        studentScholys[userEmail] = {};
    }
    
    newScholys.forEach(scholy => {
        if (!studentScholys[userEmail][scholy.id]) {
            studentScholys[userEmail][scholy.id] = 0;
        }
        studentScholys[userEmail][scholy.id]++;
    });
    
    localStorage.setItem('studentScholys', JSON.stringify(studentScholys));
    
    // Show box opening animation
    showScholyBoxResults(newScholys);
    renderShop();
}

function showScholyBoxResults(scholys) {
    const rarityColors = {
        common: '#9ca3af',
        uncommon: '#10b981',
        rare: '#3b82f6',
        epic: '#8b5cf6'
    };
    
    const resultsHTML = scholys.map(scholy => `
        <div class="scholy-result p-4 rounded-lg border-2" style="border-color: ${rarityColors[scholy.rarity]}; background: ${rarityColors[scholy.rarity]}20;">
            <div class="text-4xl mb-2">${scholy.emoji}</div>
            <div class="font-bold">${scholy.name}</div>
            <div class="text-sm capitalize" style="color: ${rarityColors[scholy.rarity]};">${scholy.rarity}</div>
        </div>
    `).join('');
    
    showToast(`🎉 Box opened! You got ${scholys.length} new Scholys!`, 'success');
}

function renderShop() {
    const dashboard = document.getElementById('student-dashboard');
    const user = currentUser;
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === user.name);
    const userScholys = studentScholys[userEmail] || {};
    const totalScholys = Object.values(userScholys).reduce((sum, count) => sum + count, 0);
    const uniqueScholys = Object.keys(userScholys).length;
    
    // Get all possible Scholys for collection display
    const allScholys = [...SCHOLY_TYPES.common, ...SCHOLY_TYPES.uncommon, ...SCHOLY_TYPES.rare, ...SCHOLY_TYPES.epic];
    const totalPossible = allScholys.length;
    
    const rarityColors = {
        common: '#9ca3af',
        uncommon: '#10b981',
        rare: '#3b82f6',
        epic: '#8b5cf6'
    };
    
    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Shop Section -->
            <div class="lg:col-span-2">
                <div class="card p-6 mb-6">
                    <h3 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--dark-gray);">
                        🛍️ Scholy Shop
                    </h3>
                    <p class="text-sm mb-4" style="color: var(--neutral-gray);">
                        Purchase Scholy Boxes to collect unique characters! Each box contains ${SCHOLYS_PER_BOX} random Scholys.
                    </p>
                    
                    <div class="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-xl font-bold mb-2">🎁 Scholy Box</h4>
                                <p class="text-sm text-gray-600 mb-2">Contains ${SCHOLYS_PER_BOX} random Scholys</p>
                                <div class="flex items-center gap-4">
                                    <span class="text-lg font-bold" style="color: var(--primary-green);">${SCHOLY_BOX_COST} Points</span>
                                    <span class="text-sm text-gray-500">Your Points: ${user.points.toLocaleString()}</span>
                                </div>
                            </div>
                            <button onclick="openScholyBox()" 
                                    class="btn-primary ${user.points < SCHOLY_BOX_COST ? 'opacity-50 cursor-not-allowed' : ''}"
                                    ${user.points < SCHOLY_BOX_COST ? 'disabled' : ''}>
                                🛒 Buy Box
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Collection Display -->
                <div class="card p-6">
                    <h3 class="text-xl font-bold mb-4">📚 Your Scholy Collection</h3>
                    <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
                        ${allScholys.map(scholy => {
                            const owned = userScholys[scholy.id] || 0;
                            const isOwned = owned > 0;
                            return `
                                <div class="scholy-card p-3 rounded-lg border-2 text-center ${isOwned ? '' : 'opacity-30'}" 
                                     style="border-color: ${rarityColors[scholy.rarity]}; background: ${rarityColors[scholy.rarity]}20;">
                                    <div class="text-2xl mb-1">${isOwned ? scholy.emoji : '❓'}</div>
                                    <div class="text-xs font-bold">${isOwned ? scholy.name : '???'}</div>
                                    <div class="text-xs capitalize" style="color: ${rarityColors[scholy.rarity]};">${isOwned ? scholy.rarity : '???'}</div>
                                    ${owned > 1 ? `<div class="text-xs font-bold mt-1">x${owned}</div>` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Stats Sidebar -->
            <div class="space-y-6">
                <div class="card p-6">
                    <h3 class="text-xl font-bold mb-4">📊 Collection Stats</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span>Total Scholys:</span>
                            <span class="font-bold">${totalScholys}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Unique Scholys:</span>
                            <span class="font-bold">${uniqueScholys}/${totalPossible}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Collection:</span>
                            <span class="font-bold">${Math.round((uniqueScholys/totalPossible)*100)}%</span>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                                 style="width: ${(uniqueScholys/totalPossible)*100}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="card p-6">
                    <h3 class="text-xl font-bold mb-4">🎯 Rarity Guide</h3>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded" style="background: ${rarityColors.common};"></div>
                            <span class="text-sm">Common (70%)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded" style="background: ${rarityColors.uncommon};"></div>
                            <span class="text-sm">Uncommon (20%)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded" style="background: ${rarityColors.rare};"></div>
                            <span class="text-sm">Rare (8%)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded" style="background: ${rarityColors.epic};"></div>
                            <span class="text-sm">Epic (2%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    refreshAppleTVEffects();
}

// --- 9. PROFILE SYSTEM ---
function initializeProfile(userEmail) {
    if (!studentProfiles[userEmail]) {
        const user = MOCK_USERS[userEmail];
        studentProfiles[userEmail] = {
            bio: "Hello! I'm a student at Schoolearn.",
            description: "I love learning and achieving my goals!",
            joinDate: new Date().toISOString()
        };
        localStorage.setItem('studentProfiles', JSON.stringify(studentProfiles));
    }
}

function updateProfile(bio, description) {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name);
    initializeProfile(userEmail);
    
    studentProfiles[userEmail].bio = bio;
    studentProfiles[userEmail].description = description;
    
    localStorage.setItem('studentProfiles', JSON.stringify(studentProfiles));
    showToast('✅ Profile updated successfully!', 'success');
    renderProfile();
}

function viewProfile(studentName) {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === studentName);
    if (!userEmail) return;
    
    const user = MOCK_USERS[userEmail];
    const profile = studentProfiles[userEmail] || {};
    const rank = getCurrentRank(user.points);
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div class="text-center mb-4">
                <div class="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl bg-green-500 text-white">
                    👤
                </div>
                <h2 class="text-2xl font-bold">${studentName}</h2>
                <p class="text-sm text-gray-600">${user.class} • ${rank.name}</p>
                <p class="text-lg font-semibold text-green-600">${user.points.toLocaleString()} Points</p>
            </div>
            
            <div class="space-y-4">
                <div>
                    <h3 class="font-bold mb-2">📝 Bio</h3>
                    <p class="text-sm text-gray-700">${profile.bio || 'No bio available.'}</p>
                </div>
                
                <div>
                    <h3 class="font-bold mb-2">📄 Description</h3>
                    <p class="text-sm text-gray-700">${profile.description || 'No description available.'}</p>
                </div>
                
                <div>
                    <h3 class="font-bold mb-2">📊 Stats</h3>
                    <div class="grid grid-cols-2 gap-4 text-center">
                        <div class="p-3 bg-blue-50 rounded-lg">
                            <p class="text-lg font-bold">${user.points.toLocaleString()}</p>
                            <p class="text-xs text-gray-600">Total Points</p>
                        </div>
                        <div class="p-3 bg-green-50 rounded-lg">
                            <p class="text-lg font-bold">${rank.name}</p>
                            <p class="text-xs text-gray-600">Current Rank</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <button onclick="document.body.removeChild(this.closest('.fixed'))" 
                    class="w-full mt-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function renderProfile() {
    const dashboard = document.getElementById('student-dashboard');
    const user = currentUser;
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === user.name);
    
    initializeProfile(userEmail);
    const profile = studentProfiles[userEmail];
    const rank = getCurrentRank(user.points);
    
    dashboard.innerHTML = `
        ${createHeader(currentUser.name, currentUser.role)}
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Profile Customization -->
            <div>
                <div class="card p-6">
                    <h3 class="text-2xl font-bold mb-4">👤 Edit Profile</h3>
                    
                    <form onsubmit="handleProfileUpdate(event)" class="space-y-4">
                        <div>
                            <label class="block font-bold mb-2">📝 Bio</label>
                            <textarea id="profile-bio" class="w-full p-3 border rounded-lg" rows="3" 
                                      placeholder="Tell others about yourself..." maxlength="200">${profile.bio}</textarea>
                            <p class="text-xs text-gray-500 mt-1">Max 200 characters</p>
                        </div>
                        
                        <div>
                            <label class="block font-bold mb-2">📄 Description</label>
                            <textarea id="profile-description" class="w-full p-3 border rounded-lg" rows="4" 
                                      placeholder="Describe your goals and interests..." maxlength="300">${profile.description}</textarea>
                            <p class="text-xs text-gray-500 mt-1">Max 300 characters</p>
                        </div>
                        
                        <button type="submit" class="btn-primary w-full">💾 Save Profile</button>
                    </form>
                </div>
            </div>
            
            <!-- Profile Preview -->
            <div>
                <div class="card p-6">
                    <h3 class="text-xl font-bold mb-4">👁️ Profile Preview</h3>
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl bg-green-500 text-white">
                            👤
                        </div>
                        <h4 class="text-xl font-bold">${user.name}</h4>
                        <p class="text-sm text-gray-600">${user.class} • ${rank.name}</p>
                        <p class="text-lg font-semibold text-green-600">${user.points.toLocaleString()} Points</p>
                    </div>
                    
                    <div class="space-y-4 text-left">
                        <div>
                            <h4 class="font-bold mb-2">📝 Bio</h4>
                            <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">${profile.bio}</p>
                        </div>
                        
                        <div>
                            <h4 class="font-bold mb-2">📄 Description</h4>
                            <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">${profile.description}</p>
                        </div>
                        
                        <div>
                            <h4 class="font-bold mb-2">📊 Stats</h4>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="p-3 bg-blue-50 rounded-lg text-center">
                                    <p class="text-lg font-bold">${user.points.toLocaleString()}</p>
                                    <p class="text-xs text-gray-600">Points</p>
                                </div>
                                <div class="p-3 bg-green-50 rounded-lg text-center">
                                    <p class="text-lg font-bold">${rank.name}</p>
                                    <p class="text-xs text-gray-600">Rank</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    refreshAppleTVEffects();
}

function handleProfileUpdate(event) {
    event.preventDefault();
    const bio = document.getElementById('profile-bio').value;
    const description = document.getElementById('profile-description').value;
    
    updateProfile(bio, description);
}

// Teacher section navigation
let currentTeacherSection = 'home';

function showTeacherSection(section) {
    currentTeacherSection = section;
    renderTeacherDashboard();
}

function getTeacherSectionContent(section, user, classStudents, studentOptions, totalPendingTasks, totalStudents, avgPoints) {
    switch(section) {
        case 'home':
            return getTeacherHomeContent(user, classStudents, studentOptions, totalPendingTasks, totalStudents, avgPoints);
        case 'complaints':
            return getTeacherComplaintsContent(user, classStudents);
        case 'positive':
            return getTeacherPositiveContent(user, classStudents);
        case 'blocks':
            return getTeacherBlocksContent(user);
        case 'calendar':
            return getTeacherCalendarContent(user, classStudents);
        case 'messages':
            return getTeacherMessagesContent(user);
        case 'leaderboard':
            return getTeacherLeaderboardContent(user, classStudents);
        default:
            return getTeacherHomeContent(user, classStudents, studentOptions, totalPendingTasks, totalStudents, avgPoints);
    }
}

function getTeacherHomeContent(user, classStudents, studentOptions, totalPendingTasks, totalStudents, avgPoints) {
    // Get pending assignments by block
    const pendingTasks = studentTasks.filter(task => task.status === 'pending_approval');
    const tasksByBlock = {};
    pendingTasks.forEach(task => {
        if (!tasksByBlock[task.blockId]) {
            tasksByBlock[task.blockId] = [];
        }
        tasksByBlock[task.blockId].push(task);
    });

    const completedTasks = studentTasks.filter(task => task.status === 'approved').length;
    const rejectedTasks = studentTasks.filter(task => task.status === 'rejected').length;
    const totalMessages = JSON.parse(localStorage.getItem('studentMessages') || '[]').length;

    return `
        <!-- Statistics Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center">
                    <div class="p-2 rounded-lg bg-blue-500">
                        <span class="text-white text-sm">👥</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-gray-500">Students</p>
                        <p class="text-lg font-semibold">${totalStudents}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center">
                    <div class="p-2 rounded-lg bg-orange-500">
                        <span class="text-white text-sm">📋</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-gray-500">Pending</p>
                        <p class="text-lg font-semibold">${totalPendingTasks}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center">
                    <div class="p-2 rounded-lg bg-green-500">
                        <span class="text-white text-sm">✅</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-gray-500">Completed</p>
                        <p class="text-lg font-semibold">${completedTasks}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center">
                    <div class="p-2 rounded-lg bg-red-500">
                        <span class="text-white text-sm">❌</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-gray-500">Rejected</p>
                        <p class="text-lg font-semibold">${rejectedTasks}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center">
                    <div class="p-2 rounded-lg bg-purple-500">
                        <span class="text-white text-sm">📊</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-gray-500">Avg Points</p>
                        <p class="text-lg font-semibold">${avgPoints}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center">
                    <div class="p-2 rounded-lg bg-indigo-500">
                        <span class="text-white text-sm">💬</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-gray-500">Messages</p>
                        <p class="text-lg font-semibold">${totalMessages}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center">
                    <div class="p-2 rounded-lg bg-yellow-500">
                        <span class="text-white text-sm">🏆</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-gray-500">Class Rank</p>
                        <p class="text-lg font-semibold">#${Math.floor(Math.random() * 5) + 1}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center">
                    <div class="p-2 rounded-lg bg-teal-500">
                        <span class="text-white text-sm">📚</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-gray-500">Blocks</p>
                        <p class="text-lg font-semibold">${Object.keys(schoolBlocks).length}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pending Assignments by Block -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold">📋 Pending Assignments</h2>
                <p class="text-gray-600 mt-1">Review and approve student submissions</p>
            </div>
            <div class="p-6">
                ${Object.keys(tasksByBlock).length > 0 ? Object.entries(tasksByBlock).map(([blockId, tasks]) => {
                    const block = schoolBlocks[blockId] || { name: 'Unknown Block', icon: '📚' };
                    return `
                        <div class="mb-6 last:mb-0">
                            <div class="flex items-center gap-2 mb-3">
                                <span class="text-xl">${block.icon}</span>
                                <h3 class="text-lg font-semibold">${block.name}</h3>
                                <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">${tasks.length} pending</span>
                            </div>
                            <div class="space-y-2">
                                ${tasks.slice(0, 5).map(task => `
                                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 class="font-medium">${task.name}</h4>
                                            <p class="text-sm text-gray-600">${task.studentName} • ${task.type} • ${task.suggestedPoints} pts</p>
                                            ${task.dueDate ? `<p class="text-xs text-gray-500">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
                                        </div>
                                        <div class="flex gap-2">
                                            <input type="number" id="points-${task.id}" value="${task.suggestedPoints}" 
                                                   min="1" max="5000" class="w-20 px-2 py-1 text-sm border rounded">
                                            <button onclick="approveStudentTask(${task.id})" 
                                                    class="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                                                ✓ Approve
                                            </button>
                                            <button onclick="rejectStudentTask(${task.id})" 
                                                    class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                                                ✗ Reject
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                                ${tasks.length > 5 ? `<p class="text-sm text-gray-500 text-center">... and ${tasks.length - 5} more</p>` : ''}
                            </div>
                        </div>
                    `;
                }).join('') : `
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-4xl mb-4">📋</div>
                        <p>No pending assignments to review</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

function getTeacherComplaintsContent(user, classStudents) {
    const studentOptions = classStudents.map(student => 
        `<option value="${student.name}">${student.name}</option>`
    ).join('');

    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Remove Points -->
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold">⚖️ Remove Points</h2>
                </div>
                <div class="p-4">
                    <form onsubmit="removeStudentPoints(event)" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Select Student</label>
                            <select id="remove-student" class="w-full p-3 border border-gray-300 rounded-lg" required>
                                <option value="">Choose a student...</option>
                                ${studentOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Points to Remove</label>
                            <input type="number" id="remove-points" min="1" class="w-full p-3 border border-gray-300 rounded-lg" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Reason</label>
                            <input type="text" id="remove-reason" placeholder="e.g., Disruptive behavior" class="w-full p-3 border border-gray-300 rounded-lg" required>
                        </div>
                        <button type="submit" class="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                            Remove Points
                        </button>
                    </form>
                </div>
            </div>
            
            <!-- Add Complaint -->
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold">⚠️ Add Complaint</h2>
                </div>
                <div class="p-4">
                    <form onsubmit="addStudentComplaint(event)" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Select Student</label>
                            <select id="complaint-student" class="w-full p-3 border border-gray-300 rounded-lg" required>
                                <option value="">Choose a student...</option>
                                ${studentOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Severity</label>
                            <select id="complaint-severity" class="w-full p-3 border border-gray-300 rounded-lg" required>
                                <option value="">Select severity...</option>
                                <option value="minor">Minor (-10 points)</option>
                                <option value="moderate">Moderate (-25 points)</option>
                                <option value="major">Major (-50 points)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Description</label>
                            <textarea id="complaint-description" placeholder="Describe the issue..." class="w-full p-3 border border-gray-300 rounded-lg" rows="3" required></textarea>
                        </div>
                        <button type="submit" class="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
                            Add Complaint
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        <!-- Complaint History -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold">📋 Complaint History</h2>
                <p class="text-gray-600 mt-1">Recent behavior issues and actions taken</p>
            </div>
            <div class="p-6">
                <div class="text-center py-8 text-gray-500">
                    <div class="text-4xl mb-4">📋</div>
                    <p>No complaints recorded yet</p>
                </div>
            </div>
        </div>
    `;
}

function getTeacherPositiveContent(user, classStudents) {
    const studentOptions = classStudents.map(student => 
        `<option value="${student.name}">${student.name}</option>`
    ).join('');
    
    return `
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold">❤️ Positive Behavior Recognition</h2>
                <p class="text-gray-600 mt-1">Award points for good behavior and achievements</p>
            </div>
            <div class="p-6">
                <form id="positive-form" onsubmit="awardBehaviorPoints(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Select Student</label>
                        <select id="bonus-student" class="w-full p-3 border border-gray-300 rounded-lg" required>
                            <option value="">Choose a student...</option>
                            ${studentOptions}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Points (1-${TEACHER_BEHAVIOR_MAX})</label>
                        <input type="number" id="bonus-points" value="50" min="1" max="${TEACHER_BEHAVIOR_MAX}" 
                               class="w-full p-3 border border-gray-300 rounded-lg" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Reason</label>
                        <input type="text" id="bonus-reason" placeholder="e.g., Excellent participation" 
                               class="w-full p-3 border border-gray-300 rounded-lg" required>
                    </div>
                    <button type="submit" class="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
                        Award Points
                    </button>
                </form>
            </div>
        </div>
    `;
}

function getTeacherBlocksContent(user) {
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === user.name);
    const teacherBlocks = Object.entries(schoolBlocks).filter(([blockId, block]) => 
        block.teacher === user.name || block.teacher === userEmail
    );

    const blocksHTML = teacherBlocks.length > 0 ? teacherBlocks.map(([blockId, block]) => `
        <div class="block-card bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <!-- Cover Image -->
            <div class="h-32 bg-gradient-to-r ${getBlockGradient(blockId)} relative">
                <div class="absolute inset-0 bg-black bg-opacity-20"></div>
                <div class="absolute top-4 right-4">
                    <button onclick="editBlock('${blockId}')" class="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                        <i class="fas fa-edit text-white text-sm"></i>
                    </button>
                </div>
                <div class="absolute bottom-4 left-4">
                    <span class="text-4xl">${block.icon || '📚'}</span>
                </div>
            </div>
            
            <!-- Block Info -->
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${block.name}</h3>
                <p class="text-sm text-gray-600 mb-3">${block.description || 'No description available'}</p>
                
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>${block.students ? block.students.length : 0} students</span>
                    <span>${studentTasks.filter(task => task.blockId === blockId).length} assignments</span>
                </div>
                
                <div class="mt-3 pt-3 border-t border-gray-200">
                    <div class="flex gap-2">
                        <button onclick="manageBlockStudents('${blockId}')" class="w-full px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                            Manage Students
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('') : `
        <div class="col-span-full bg-white rounded-lg p-8 border text-center">
            <div class="text-6xl mb-4">🏫</div>
            <h3 class="text-xl font-bold mb-2">No Blocks Assigned</h3>
            <p class="text-gray-600">You don't have any blocks assigned to you yet.</p>
        </div>
    `;

    return `
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold mb-2">🏫 Block Management</h1>
                <p class="text-gray-600">Manage your assigned blocks and courses</p>
            </div>
            <button onclick="createNewBlock()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <i class="fas fa-plus mr-2"></i>Create Block
            </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${blocksHTML}
        </div>
        
        <!-- Block Edit Modal (hidden by default) -->
        <div id="block-edit-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg p-6 w-full max-w-md">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">Edit Block</h3>
                        <button onclick="closeBlockModal()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="block-edit-form" onsubmit="saveBlockChanges(event)" class="space-y-4">
                        <input type="hidden" id="edit-block-id">
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Block Name</label>
                            <input type="text" id="edit-block-name" class="w-full p-3 border border-gray-300 rounded-lg" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Description</label>
                            <textarea id="edit-block-description" class="w-full p-3 border border-gray-300 rounded-lg" rows="3"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Icon (Emoji)</label>
                            <input type="text" id="edit-block-icon" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="📚">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Cover Color</label>
                            <select id="edit-block-color" class="w-full p-3 border border-gray-300 rounded-lg">
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="purple">Purple</option>
                                <option value="red">Red</option>
                                <option value="yellow">Yellow</option>
                                <option value="indigo">Indigo</option>
                                <option value="pink">Pink</option>
                                <option value="teal">Teal</option>
                            </select>
                        </div>
                        
                        <div class="flex gap-3 pt-4">
                            <button type="button" onclick="closeBlockModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function getTeacherCalendarContent(user, classStudents) {
    // Get all tasks with due dates
    const tasksWithDates = studentTasks.filter(task => task.dueDate);
    
    // Group tasks by date
    const tasksByDate = {};
    tasksWithDates.forEach(task => {
        const date = task.dueDate;
        if (!tasksByDate[date]) {
            tasksByDate[date] = [];
        }
        tasksByDate[date].push(task);
    });
    
    // Sort dates
    const sortedDates = Object.keys(tasksByDate).sort();
    const today = new Date().toISOString().split('T')[0];
    
    const calendarHTML = sortedDates.length > 0 ? sortedDates.map(date => {
        const tasks = tasksByDate[date];
        const isToday = date === today;
        const isPast = date < today;
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="bg-white rounded-lg p-4 border ${isToday ? 'border-blue-500 bg-blue-50' : isPast ? 'border-red-300 bg-red-50' : 'border-gray-200'} mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-bold ${isToday ? 'text-blue-700' : isPast ? 'text-red-700' : 'text-gray-700'}">
                        ${formattedDate}
                        ${isToday ? ' (Today)' : isPast ? ' (Past Due)' : ''}
                    </h3>
                    <span class="text-sm px-2 py-1 rounded ${isToday ? 'bg-blue-200 text-blue-800' : isPast ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'}">
                        ${tasks.length} assignment${tasks.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <div class="space-y-2">
                    ${tasks.map(task => {
                        const block = schoolBlocks[task.blockId] || { name: 'Unknown Block', icon: '📚' };
                        const statusColor = task.status === 'approved' ? 'text-green-600' : 
                                          task.status === 'rejected' ? 'text-red-600' : 'text-orange-600';
                        const statusText = task.status === 'pending_approval' ? 'Pending Review' : 
                                         task.status === 'approved' ? 'Approved' : 'Rejected';
                        
                        return `
                            <div class="flex items-center justify-between p-3 bg-white rounded border">
                                <div class="flex items-center gap-3">
                                    <span class="text-lg">${block.icon}</span>
                                    <div>
                                        <h4 class="font-medium">${task.name}</h4>
                                        <p class="text-sm text-gray-600">${task.studentName} • ${block.name} • ${task.type}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-medium ${statusColor}">${statusText}</div>
                                    <div class="text-xs text-gray-500">${task.suggestedPoints} pts</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('') : `
        <div class="bg-white rounded-lg p-8 border text-center">
            <div class="text-6xl mb-4">📅</div>
            <h3 class="text-xl font-bold mb-2">No Assignments Yet</h3>
            <p class="text-gray-600">Create tasks with due dates to see them in your calendar.</p>
        </div>
    `;
    
    return `
        <div class="mb-6">
            <h1 class="text-2xl font-bold mb-2">📅 Class Calendar</h1>
            <p class="text-gray-600">View all student assignments organized by due date</p>
        </div>
        
        <div class="space-y-4">
            ${calendarHTML}
        </div>
    `;
}

function getTeacherMessagesContent(user) {
    const messages = JSON.parse(localStorage.getItem('studentMessages') || '[]');
    const userEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === user.name);
    const userMessages = messages.filter(msg => msg.to === userEmail || msg.to === 'admin@school.edu');
    
    const messageHTML = userMessages.length > 0 ? userMessages.map(msg => `
        <div class="border rounded-lg p-4 mb-4 ${msg.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h4 class="font-semibold">${msg.subject}</h4>
                    <p class="text-sm text-gray-600">From: ${msg.from}</p>
                </div>
                <div class="text-xs text-gray-500">
                    ${new Date(msg.timestamp).toLocaleDateString()}
                </div>
            </div>
            <p class="text-gray-700">${msg.content}</p>
            ${msg.type === 'issue' ? `<span class="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">${msg.issueType}</span>` : ''}
        </div>
    `).join('') : `
        <div class="text-center py-8 text-gray-500">
            <div class="text-4xl mb-4">💬</div>
            <p>No messages at this time</p>
        </div>
    `;
    
    return `
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold">💬 Messages</h2>
                <p class="text-gray-600 mt-1">Student messages and anonymous complaints</p>
            </div>
            <div class="p-6">
                ${messageHTML}
            </div>
        </div>
    `;
}

function getTeacherLeaderboardContent(user, classStudents) {
    return `
        <div class="mb-6">
            <h1 class="text-2xl font-bold mb-2">🏆 Class Leaderboard</h1>
            <p class="text-gray-600">View your students' rankings and progress</p>
        </div>
        
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h2 class="text-xl font-semibold">📊 Student Rankings</h2>
            </div>
            <div class="p-6">
                <div class="space-y-3">
                    ${classStudents.map((student, index) => {
                        const userData = MOCK_USERS[Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === student.name)];
                        const rank = getCurrentRank(userData.points);
                        return `
                            <div class="flex items-center justify-between p-4 rounded-lg ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200' : 'bg-gray-50'} hover:shadow-md transition-shadow">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                        index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                        index === 2 ? 'bg-orange-600' :
                                        'bg-blue-500'
                                    }">
                                        ${index + 1}
                                    </div>
                                    <div>
                                        <p class="font-semibold text-lg">${student.name}</p>
                                        <p class="text-sm text-gray-600">${rank.name} Rank</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-xl text-green-600">${userData.points.toLocaleString()}</p>
                                    <p class="text-xs text-gray-500">points</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// Message handling functions
function sendMessage(event) {
    event.preventDefault();
    
    const recipient = document.getElementById('message-recipient').value;
    const subject = document.getElementById('message-subject').value;
    const content = document.getElementById('message-content').value;
    const anonymous = document.getElementById('message-anonymous').checked;
    
    if (!recipient || !subject || !content) {
        showToast('❌ Please fill in all fields', 'error');
        return;
    }
    
    // Store message (in real app, this would go to a database)
    const messages = JSON.parse(localStorage.getItem('studentMessages') || '[]');
    const newMessage = {
        id: Date.now(),
        from: anonymous ? 'Anonymous Student' : currentUser.name,
        fromEmail: anonymous ? 'anonymous' : Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name),
        to: recipient,
        subject: subject,
        content: content,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'message'
    };
    
    messages.push(newMessage);
    localStorage.setItem('studentMessages', JSON.stringify(messages));
    
    showToast('✅ Message sent successfully!', 'success');
    event.target.reset();
}

function reportIssue(event) {
    event.preventDefault();
    
    const issueType = document.getElementById('issue-type').value;
    const description = document.getElementById('issue-description').value;
    const anonymous = document.getElementById('issue-anonymous').checked;
    
    if (!issueType || !description) {
        showToast('❌ Please fill in all fields', 'error');
        return;
    }
    
    // Store issue report (in real app, this would go to admin)
    const messages = JSON.parse(localStorage.getItem('studentMessages') || '[]');
    const newIssue = {
        id: Date.now(),
        from: anonymous ? 'Anonymous Student' : currentUser.name,
        fromEmail: anonymous ? 'anonymous' : Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].name === currentUser.name),
        to: 'admin@school.edu', // Send to admin
        subject: `Issue Report: ${issueType}`,
        content: description,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'issue',
        issueType: issueType
    };
    
    messages.push(newIssue);
    localStorage.setItem('studentMessages', JSON.stringify(messages));
    
    showToast('✅ Issue reported successfully!', 'success');
    event.target.reset();
}

// Block management functions
function getBlockGradient(blockId) {
    const gradients = {
        'block-a': 'from-blue-500 to-blue-600',
        'block-b': 'from-green-500 to-green-600',
        'block-c': 'from-purple-500 to-purple-600',
        'block-d': 'from-red-500 to-red-600',
        'block-e': 'from-yellow-500 to-yellow-600',
        'block-f': 'from-indigo-500 to-indigo-600',
        'block-g': 'from-pink-500 to-pink-600',
        'block-h': 'from-teal-500 to-teal-600'
    };
    return gradients[blockId] || 'from-gray-500 to-gray-600';
}

function editBlock(blockId) {
    const block = schoolBlocks[blockId];
    if (!block) return;
    
    document.getElementById('edit-block-id').value = blockId;
    document.getElementById('edit-block-name').value = block.name;
    document.getElementById('edit-block-description').value = block.description || '';
    document.getElementById('edit-block-icon').value = block.icon || '📚';
    document.getElementById('edit-block-color').value = block.color || 'blue';
    
    document.getElementById('block-edit-modal').classList.remove('hidden');
}

function closeBlockModal() {
    document.getElementById('block-edit-modal').classList.add('hidden');
}

function saveBlockChanges(event) {
    event.preventDefault();
    
    const blockId = document.getElementById('edit-block-id').value;
    const name = document.getElementById('edit-block-name').value;
    const description = document.getElementById('edit-block-description').value;
    const icon = document.getElementById('edit-block-icon').value;
    const color = document.getElementById('edit-block-color').value;
    
    if (!schoolBlocks[blockId]) return;
    
    // Update block
    schoolBlocks[blockId].name = name;
    schoolBlocks[blockId].description = description;
    schoolBlocks[blockId].icon = icon;
    schoolBlocks[blockId].color = color;
    
    // Save to localStorage
    localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
    
    showToast('✅ Block updated successfully!', 'success');
    closeBlockModal();
    renderTeacherDashboard();
}

function createNewBlock() {
    // Generate new block ID
    const existingBlocks = Object.keys(schoolBlocks);
    const blockNumber = existingBlocks.length + 1;
    const newBlockId = `block-${String.fromCharCode(96 + blockNumber)}`;
    
    // Create new block
    schoolBlocks[newBlockId] = {
        name: `New Block ${blockNumber}`,
        description: 'A new course block',
        icon: '📚',
        color: 'blue',
        teacher: currentUser.name,
        students: []
    };
    
    // Save to localStorage
    localStorage.setItem('schoolBlocks', JSON.stringify(schoolBlocks));
    
    showToast('✅ New block created!', 'success');
    renderTeacherDashboard();
}

function manageBlockStudents(blockId) {
    showToast('📚 Student management coming soon!', 'info');
}

function viewBlockAssignments(blockId) {
    showToast('📋 Assignment view coming soon!', 'info');
}