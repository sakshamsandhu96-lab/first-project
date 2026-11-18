/* =========================================================
   INTERVIEW AI - JAVASCRIPT
   Frontend-only project
========================================================= */


/* ================= USER AUTHENTICATION ================= */

function showSignup() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("signupForm").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("signupForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
}


/* Signup */

document.getElementById("signup").addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    const user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("interviewAIUser", JSON.stringify(user));

    alert("Account created successfully! Please login.");

    document.getElementById("signup").reset();

    showLogin();
});


/* Login */

document.getElementById("login").addEventListener("submit", function(e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const savedUser = localStorage.getItem("interviewAIUser");

    if (!savedUser) {
        alert("No account found. Please create an account first.");
        return;
    }

    const user = JSON.parse(savedUser);

    if (email === user.email && password === user.password) {

        localStorage.setItem("interviewAILoggedIn", "true");

        loadUser();
        showApplication();

    } else {

        alert("Incorrect email or password.");

    }

});


/* Logout */

function logout() {

    localStorage.removeItem("interviewAILoggedIn");

    document.getElementById("mainApp").classList.add("hidden");
    document.getElementById("authScreen").classList.remove("hidden");

    showLogin();
}


/* Show application */

function showApplication() {

    document.getElementById("authScreen").classList.add("hidden");
    document.getElementById("mainApp").classList.remove("hidden");

    loadUser();
    updateStatistics();
}


/* Load user */

function loadUser() {

    const savedUser = localStorage.getItem("interviewAIUser");

    if (!savedUser) return;

    const user = JSON.parse(savedUser);

    const name = user.name || "Candidate";

    const initials = name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

    document.getElementById("welcomeName").textContent = name;
    document.getElementById("sidebarName").textContent = name;

    document.getElementById("sidebarAvatar").textContent = initials;
    document.getElementById("profileAvatar").textContent = initials;
}


/* ================= PAGE NAVIGATION ================= */

function showPage(pageId, clickedButton) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active-page");
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    if (pageId === "questions") {
        renderQuestions();
    }

    if (pageId === "progress") {
        updateProgressPage();
    }
}


/* ================= INTERVIEW DATA ================= */

const questionDatabase = [

    {
        question: "What is object-oriented programming?",
        category: "Technical",
        difficulty: "Easy"
    },

    {
        question: "Explain the difference between let, const and var in JavaScript.",
        category: "Technical",
        difficulty: "Medium"
    },

    {
        question: "What is a database?",
        category: "Technical",
        difficulty: "Easy"
    },

    {
        question: "What is the difference between SQL and NoSQL databases?",
        category: "Technical",
        difficulty: "Medium"
    },

    {
        question: "Explain REST API and how it works.",
        category: "Technical",
        difficulty: "Medium"
    },

    {
        question: "What is normalization in a database?",
        category: "Technical",
        difficulty: "Hard"
    },

    {
        question: "What are your strengths?",
        category: "HR",
        difficulty: "Easy"
    },

    {
        question: "What are your weaknesses?",
        category: "HR",
        difficulty: "Easy"
    },

    {
        question: "Why should we hire you?",
        category: "HR",
        difficulty: "Medium"
    },

    {
        question: "Where do you see yourself in five years?",
        category: "HR",
        difficulty: "Medium"
    },

    {
        question: "Tell me about yourself.",
        category: "Behavioral",
        difficulty: "Easy"
    },

    {
        question: "Describe a difficult problem you solved.",
        category: "Behavioral",
        difficulty: "Medium"
    },

    {
        question: "Tell me about a time you worked in a team.",
        category: "Behavioral",
        difficulty: "Medium"
    },

    {
        question: "Describe a situation where you handled failure.",
        category: "Behavioral",
        difficulty: "Hard"
    },

    {
        question: "Explain how you would optimize a slow web application.",
        category: "Technical",
        difficulty: "Hard"
    },

    {
        question: "What is asynchronous programming?",
        category: "Technical",
        difficulty: "Hard"
    },

    {
        question: "How do you handle conflict with a teammate?",
        category: "Behavioral",
        difficulty: "Medium"
    },

    {
        question: "Why do you want to work for our company?",
        category: "HR",
        difficulty: "Medium"
    }

];


let interviewQuestions = [];
let currentQuestionIndex = 0;
let selectedDifficulty = "Easy";
let timerInterval;
let timeRemaining = 120;


/* ================= DIFFICULTY ================= */

document.querySelectorAll(".difficulty").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".difficulty").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        selectedDifficulty = this.dataset.level;

    });

});


/* ================= START INTERVIEW ================= */

function startPractice() {

    const practiceButton = document.querySelector(
        '.nav-item[onclick*="practice"]'
    );

    showPage("practice", practiceButton);
}


function quickRole(role) {

    document.getElementById("jobRole").value = role;

    startPractice();
}


function generateInterview() {

    const role = document.getElementById("jobRole").value;
    const type = document.getElementById("interviewType").value;
    const count = Number(document.getElementById("questionCount").value);

    let filtered = questionDatabase.filter(question => {

        const difficultyMatch =
            question.difficulty === selectedDifficulty;

        let typeMatch = true;

        if (type === "Technical") {
            typeMatch = question.category === "Technical";
        }

        if (type === "HR") {
            typeMatch =
                question.category === "HR" ||
                question.category === "Behavioral";
        }

        if (type === "Mixed") {
            typeMatch = true;
        }

        return difficultyMatch && typeMatch;

    });


    /* If not enough questions, use all matching category questions */

    if (filtered.length < count) {

        filtered = questionDatabase.filter(question => {

            if (type === "Technical") {
                return question.category === "Technical";
            }

            if (type === "HR") {
                return (
                    question.category === "HR" ||
                    question.category === "Behavioral"
                );
            }

            return true;

        });

    }


    /* Shuffle */

    filtered.sort(() => Math.random() - 0.5);

    interviewQuestions = filtered.slice(0, count);

    currentQuestionIndex = 0;

    localStorage.setItem(
        "lastInterviewRole",
        role
    );

    document.getElementById("practiceSetup").classList.add("hidden");
    document.getElementById("resultArea").classList.add("hidden");
    document.getElementById("interviewArea").classList.remove("hidden");

    showCurrentQuestion();

}


/* ================= QUESTION DISPLAY ================= */

function showCurrentQuestion() {

    if (currentQuestionIndex >= interviewQuestions.length) {

        finishInterview();
        return;

    }

    const currentQuestion =
        interviewQuestions[currentQuestionIndex];

    document.getElementById("questionNumber").textContent =
        `Question ${currentQuestionIndex + 1} of ${interviewQuestions.length}`;

    document.getElementById("questionText").textContent =
        currentQuestion.question;

    document.getElementById("answerInput").value = "";

    const progress =
        (currentQuestionIndex / interviewQuestions.length) * 100;

    document.getElementById("interviewProgress").style.width =
        progress + "%";

    startTimer();

}


/* ================= TIMER ================= */

function startTimer() {

    clearInterval(timerInterval);

    timeRemaining = 120;

    updateTimer();

    timerInterval = setInterval(() => {

        timeRemaining--;

        updateTimer();

        if (timeRemaining <= 0) {

            clearInterval(timerInterval);

            submitAnswer();

        }

    }, 1000);

}


function updateTimer() {

    const minutes =
        Math.floor(timeRemaining / 60);

    const seconds =
        timeRemaining % 60;

    document.getElementById("timer").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* ================= ANSWER ================= */

function submitAnswer() {

    clearInterval(timerInterval);

    const answer =
        document.getElementById("answerInput").value.trim();

    let score = 0;

    if (answer.length === 0) {
        score = 20;
    }

    else if (answer.length < 40) {
        score = 55;
    }

    else if (answer.length < 100) {
        score = 75;
    }

    else {
        score = 90;
    }


    const previousScore =
        Number(localStorage.getItem("interviewTotalScore") || 0);

    const previousAnswers =
        Number(localStorage.getItem("questionsAnswered") || 0);

    localStorage.setItem(
        "interviewTotalScore",
        previousScore + score
    );

    localStorage.setItem(
        "questionsAnswered",
        previousAnswers + 1
    );


    currentQuestionIndex++;

    showCurrentQuestion();

}


/* ================= SKIP ================= */

function skipQuestion() {

    clearInterval(timerInterval);

    currentQuestionIndex++;

    showCurrentQuestion();

}


/* ================= FINISH ================= */

function finishInterview() {

    clearInterval(timerInterval);

    const interviews =
        Number(localStorage.getItem("totalInterviews") || 0) + 1;

    localStorage.setItem(
        "totalInterviews",
        interviews
    );


    const totalScore =
        Number(localStorage.getItem("interviewTotalScore") || 0);

    const totalQuestions =
        Number(localStorage.getItem("questionsAnswered") || 0);

    let average = 0;

    if (totalQuestions > 0) {
        average = Math.round(totalScore / totalQuestions);
    }

    document.getElementById("interviewArea").classList.add("hidden");
    document.getElementById("resultArea").classList.remove("hidden");

    document.getElementById("finalScore").textContent =
        average + "%";

    if (average >= 80) {
        document.getElementById("resultMessage").textContent =
            "Great preparation! Keep practicing to maintain your performance.";
    }

    else if (average >= 60) {
        document.getElementById("resultMessage").textContent =
            "Good progress! Practice more questions and improve answer detail.";
    }

    else {
        document.getElementById("resultMessage").textContent =
            "Keep practicing. Focus on clear, structured and detailed answers.";
    }

    updateStatistics();

}


/* ================= RESET INTERVIEW ================= */

function resetInterview() {

    document.getElementById("resultArea").classList.add("hidden");
    document.getElementById("practiceSetup").classList.remove("hidden");

    document.getElementById("interviewProgress").style.width = "0%";

}


/* ================= QUESTION BANK ================= */

function renderQuestions() {

    const list =
        document.getElementById("questionList");

    list.innerHTML = "";

    questionDatabase.forEach((item, index) => {

        const question = document.createElement("div");

        question.className = "question-item";

        question.innerHTML = `

            <div class="question-meta">
                <span class="badge">${item.category}</span>
                <span class="badge">${item.difficulty}</span>
            </div>

            <h3>${item.question}</h3>

            <button
                class="secondary-btn"
                onclick="practiceQuestion(${index})"
            >
                Practice This Question
            </button>
        `;

        list.appendChild(question);

    });

}


function filterQuestions() {

    const category =
        document.getElementById("categoryFilter").value;

    const difficulty =
        document.getElementById("difficultyFilter").value;

    const list =
        document.getElementById("questionList");

    list.innerHTML = "";

    const filtered =
        questionDatabase.filter(item => {

            const categoryMatch =
                category === "All" ||
                item.category === category;

            const difficultyMatch =
                difficulty === "All" ||
                item.difficulty === difficulty;

            return categoryMatch && difficultyMatch;

        });


    filtered.forEach((item) => {

        const question =
            document.createElement("div");

        question.className = "question-item";

        question.innerHTML = `

            <div class="question-meta">
                <span class="badge">${item.category}</span>
                <span class="badge">${item.difficulty}</span>
            </div>

            <h3>${item.question}</h3>

            <button class="secondary-btn">
                Practice This Question
            </button>
        `;

        list.appendChild(question);

    });

}


function practiceQuestion(index) {

    interviewQuestions = [questionDatabase[index]];

    currentQuestionIndex = 0;

    startPractice();

    document.getElementById("practiceSetup").classList.add("hidden");
    document.getElementById("resultArea").classList.add("hidden");
    document.getElementById("interviewArea").classList.remove("hidden");

    showCurrentQuestion();

}


/* ================= RESUME ================= */

document.getElementById("resumeFile").addEventListener(
    "change",
    function() {

        if (this.files.length > 0) {

            document.getElementById("fileName").textContent =
                "Selected: " + this.files[0].name;

        }

    }
);


function analyzeResume() {

    const file =
        document.getElementById("resumeFile").files[0];

    if (!file) {

        alert("Please choose your resume first.");

        return;

    }

    document.getElementById("resumeResult")
        .classList.remove("hidden");

}


/* ================= STATISTICS ================= */

function updateStatistics() {

    const interviews =
        Number(localStorage.getItem("totalInterviews") || 0);

    const answered =
        Number(localStorage.getItem("questionsAnswered") || 0);

    const totalScore =
        Number(localStorage.getItem("interviewTotalScore") || 0);

    let average = 0;

    if (answered > 0) {
        average = Math.round(totalScore / answered);
    }


    document.getElementById("totalInterviews").textContent =
        interviews;

    document.getElementById("questionsAnswered").textContent =
        answered;

    document.getElementById("averageScore").textContent =
        average + "%";


    document.getElementById("progressInterviews").textContent =
        interviews;

    document.getElementById("progressQuestions").textContent =
        answered;

    document.getElementById("progressScore").textContent =
        average + "%";

}


/* ================= PROGRESS ================= */

function updateProgressPage() {

    updateStatistics();

    const interviews =
        Number(localStorage.getItem("totalInterviews") || 0);

    let progress = Math.min(interviews * 10, 100);

    document.getElementById("overallProgress")
        .style.width = progress + "%";


    if (interviews === 0) {

        document.getElementById("progressText").textContent =
            "Complete your first interview to start tracking your preparation.";

    }

    else {

        document.getElementById("progressText").textContent =
            `You have completed ${interviews} interview${interviews > 1 ? "s" : ""}. Keep practicing regularly.`;

    }

}


/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", function() {

    const loggedIn =
        localStorage.getItem("interviewAILoggedIn");

    if (loggedIn === "true") {

        showApplication();

    } else {

        document.getElementById("authScreen")
            .classList.remove("hidden");

        document.getElementById("mainApp")
            .classList.add("hidden");

    }

    renderQuestions();

    updateStatistics();

});