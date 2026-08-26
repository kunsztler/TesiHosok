/* ==========================================
   Tesi Hősök
   app.js – v0.1
========================================== */

// ------------------------------
// Adatok
// ------------------------------

const STORAGE_KEY = "tesiHosokData";

let students = [];

let selectedStudent = null;
let selectedClass = "";


// ------------------------------
// HTML elemek
// ------------------------------

const studentList = document.getElementById("studentList");
const classSelect = document.getElementById("classSelect");
const addClassModal =
    document.getElementById("addClassModal");

const newClassName =
    document.getElementById("newClassName");

const saveAddClassButton =
    document.getElementById("saveAddClassButton");

const cancelAddClassButton =
    document.getElementById("cancelAddClassButton");
const addStudentButton = document.getElementById("addStudentButton");
const studentModal =
    document.getElementById("studentModal");

const studentNames =
    document.getElementById("studentNames");

const cancelStudentButton =
    document.getElementById("cancelStudentButton");

const saveStudentsButton =
    document.getElementById("saveStudentsButton");
const editStudentButton =
    document.getElementById("editStudentButton");

const deleteStudentButton =
    document.getElementById("deleteStudentButton");
const heroName = document.getElementById("heroName");
const badges = document.getElementById("badges");
const eventButtons =
    document.querySelectorAll("#eventButtons button");

const events =
    document.getElementById("events");
const editStudentModal =
    document.getElementById("editStudentModal");

const editStudentName =
    document.getElementById("editStudentName");

const cancelEditStudentButton =
    document.getElementById("cancelEditStudentButton");

const saveEditStudentButton =
    document.getElementById("saveEditStudentButton");
    const deleteStudentModal =
    document.getElementById("deleteStudentModal");

const deleteStudentMessage =
    document.getElementById("deleteStudentMessage");

const cancelDeleteStudentButton =
    document.getElementById("cancelDeleteStudentButton");

const confirmDeleteStudentButton =
    document.getElementById("confirmDeleteStudentButton");
    const deleteBadgeModal =
    document.getElementById("deleteBadgeModal");

const deleteBadgeMessage =
    document.getElementById("deleteBadgeMessage");

const cancelDeleteBadgeButton =
    document.getElementById("cancelDeleteBadgeButton");

const confirmDeleteBadgeButton =
    document.getElementById("confirmDeleteBadgeButton");
    const deleteEventModal =
    document.getElementById("deleteEventModal");

const deleteEventMessage =
    document.getElementById("deleteEventMessage");

const cancelDeleteEventButton =
    document.getElementById("cancelDeleteEventButton");

const confirmDeleteEventButton =
    document.getElementById("confirmDeleteEventButton");

    const deleteSelfEvaluationModal =
    document.getElementById("deleteSelfEvaluationModal");

const deleteSelfEvaluationMessage =
    document.getElementById("deleteSelfEvaluationMessage");

const cancelDeleteSelfEvaluationButton =
    document.getElementById("cancelDeleteSelfEvaluationButton");

const confirmDeleteSelfEvaluationButton =
    document.getElementById("confirmDeleteSelfEvaluationButton");

    const badgePanelToggle =
    document.getElementById("badgePanelToggle");

const badgePanelContent =
    document.getElementById("badgePanelContent");

const eventPanelToggle =
    document.getElementById("eventPanelToggle");
    
const selectStudentModal =
    document.getElementById("selectStudentModal");

const closeSelectStudentButton =
    document.getElementById("closeSelectStudentButton");

    closeSelectStudentButton.addEventListener("click", () => {

    selectStudentModal.style.display = "none";

});

const eventPanelContent =
    document.getElementById("eventPanelContent");
    const CLASSES_STORAGE_KEY = "tesiHosok_classes";

    const exportButton =
    document.getElementById("exportButton");

const importButton =
    document.getElementById("importButton");
    // ------------------------------
// Adatok exportálása fájlba
// ------------------------------

exportButton.addEventListener("click", () => {

    const data = {
        students: students,
        classes: classes
    };

    const json =
        JSON.stringify(data, null, 2);

    const blob =
        new Blob(
            [json],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = "tesi-hosok-mentes.json";

    link.click();

    URL.revokeObjectURL(url);

});
// ------------------------------
// Adatok betöltése fájlból
// ------------------------------

importButton.addEventListener("click", () => {

    const input =
        document.createElement("input");

    input.type = "file";
    input.accept = ".json";

    input.addEventListener("change", event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload = event => {

            try {

                const data =
                    JSON.parse(event.target.result);

                if (Array.isArray(data)) {

                    students = data;

                } else {

                    students =
                        data.students || [];

                    classes =
                        data.classes || [];

                }

                students.forEach(student => {

                    if (!student.className) {
                        student.className = "6.B";
                    }

                    if (!student.selfEvaluationCounts) {

                        student.selfEvaluationCounts = {
                            hero: 0,
                            good: 0,
                            developing: 0
                        };

                    }

                });

                saveData();

                renderStudents();

                alert("Az adatok sikeresen betöltve!");

            } catch (error) {

                console.error(error);

                alert(
                    "A fájl betöltése sikertelen!"
                );

            }

        };

        reader.readAsText(file);

    });

    input.click();

});

let classes = [];

    // ------------------------------
// Jelvény adása panel
// ------------------------------

badgePanelToggle.addEventListener("click", () => {

    badgePanelContent.classList.toggle("collapsed");

    badgePanelToggle.classList.toggle("collapsed");

});


// ------------------------------
// Esemény rögzítése panel
// ------------------------------

eventPanelToggle.addEventListener("click", () => {

    eventPanelContent.classList.toggle("collapsed");

    eventPanelToggle.classList.toggle("collapsed");

});

// ------------------------------
// Tanulók hozzáadása
// ------------------------------

addStudentButton.addEventListener("click", () => {

    studentModal.style.display = "flex";

    studentNames.value = "";

    studentNames.focus();

});


// ------------------------------
// Tanulók mentése
// ------------------------------

saveStudentsButton.addEventListener("click", () => {

    const names = studentNames.value
        .split("\n")
        .map(name => name.trim())
        .filter(name => name !== "");

    if (names.length === 0) {
        return;
    }

    names.forEach(name => {

 students.push({
    name: name,
    className: classSelect.value,
    badges: [],
    events: [],
    selfEvaluation: "developing",
    selfEvaluationCounts: {
        hero: 0,
        good: 0,
        developing: 0
    }
});

    });

    saveData();

    renderStudents();

    closeStudentModal();

});


// ------------------------------
// Mégse
// ------------------------------

cancelStudentButton.addEventListener("click", () => {

    closeStudentModal();

});


// ------------------------------
// Ablak bezárása
// ------------------------------

function closeStudentModal() {

    studentModal.style.display = "none";

}


// ------------------------------
// Tanulók megjelenítése
// ------------------------------

function renderStudents() {

    studentList.innerHTML = "";

    students
    .filter(student => student.className === selectedClass)
    .forEach((student) => {

        const studentElement = document.createElement("div");

        studentElement.className = "student";

        studentElement.textContent = student.name;

        studentElement.addEventListener("click", () => {

            selectStudent(students.indexOf(student));

        });

        studentList.appendChild(studentElement);

    });

}


// ------------------------------
// Tanuló kiválasztása
// ------------------------------

function selectStudent(index) {

    selectedStudent = students[index];

    heroName.textContent = selectedStudent.name;

    renderBadges();
    renderMovementGoal();
renderFairPlayGoal();
renderTeamGoal();
renderPersistenceGoal();
renderChallengeGoal();
renderSportKnowledgeGoal();
    renderEarnedLevels();
    renderEvents();

    // Önértékelési jelvény betöltése
    const badgeMap = {

        hero: "🏆",
        good: "💪",
        developing: "🌱"

    };

    heroSelfEvaluationBadge.textContent =
        badgeMap[selectedStudent.selfEvaluation] || "🌱";

        renderSelfEvaluationCounts();


    // A megfelelő jobb oldali gomb kijelölése
    selfEvaluationOptions.forEach(option => {

        option.classList.toggle(
            "selected",
            option.dataset.value ===
            selectedStudent.selfEvaluation
        );

    });

}


// ------------------------------
// Jelvények megjelenítése
// ------------------------------

function renderBadges() {

    badges.innerHTML = "";

    if (!selectedStudent) {
        return;
    }

    // Jelvények összesítése
    const badgeCounts = {};

    selectedStudent.badges.forEach(badge => {

        if (!badgeCounts[badge]) {
            badgeCounts[badge] = 0;
        }

        badgeCounts[badge]++;

    });

    // Jelvények megjelenítése
    Object.entries(badgeCounts).forEach(([badge, count]) => {

        const badgeElement = document.createElement("div");

        badgeElement.className = "heroBadge";

        badgeElement.innerHTML = `
            <span class="badgeIcon">${badge}</span>
            <span class="badgeCount">${count}</span>
        `;

        badgeElement.title =
            `${badge} – ${count} db\nKattints a visszavonáshoz`;

        badgeElement.addEventListener("click", () => {

            deleteBadgeMessage.textContent =
                `Egy ${badge} jelvényt szeretnél visszavonni?`;

            deleteBadgeModal.style.display = "flex";

            // Most nem egy konkrét indexet tárolunk,
            // hanem magát a jelvény típusát.
            deleteBadgeModal.dataset.badgeType = badge;

        });

        badges.appendChild(badgeElement);

    });

}
// ------------------------------
// Jelvények számának lekérése
// ------------------------------

function getBadgeCount(badge) {

    if (!selectedStudent) {
        return 0;
    }

    return selectedStudent.badges.filter(
        item => item === badge
    ).length;

}
// ------------------------------
// Mozgáshős követelmények frissítése
// ------------------------------

function renderMovementGoal() {

    const performanceCount =
        getBadgeCount("🏃");

    const classworkCount =
        getBadgeCount("🤸");


    const performanceElement =
        document.getElementById(
            "movementPerformanceCount"
        );

    const classworkElement =
        document.getElementById(
            "movementClassworkCount"
        );


    const performanceTargetElement =
        document.getElementById(
            "movementPerformanceTarget"
        );

    const classworkTargetElement =
        document.getElementById(
            "movementClassworkTarget"
        );


    const levelElement =
        document.getElementById(
            "movementLevel"
        );

    const messageElement =
        document.getElementById(
            "movementLevelMessage"
        );


    // ------------------------------
    // Aktuális jelvényszámok
    // ------------------------------

    if (performanceElement) {

        performanceElement.textContent =
            performanceCount;

    }

    if (classworkElement) {

        classworkElement.textContent =
            classworkCount;

    }


    if (!levelElement) {
        return;
    }


    // ------------------------------
    // I. SZINT
    // ------------------------------

    const levelOneComplete =
        performanceCount >= 5 &&
        classworkCount >= 3;


    // ------------------------------
    // II. SZINT
    // ------------------------------

    const levelTwoComplete =
        performanceCount >= 10 &&
        classworkCount >= 6;


    // ------------------------------
    // II. SZINT teljesítve
    // ------------------------------

    if (levelTwoComplete) {

        levelElement.textContent =
            "II. SZINT – TELJESÍTVE! 🏆";

        if (performanceTargetElement) {

            performanceTargetElement.textContent =
                "10";

        }

        if (classworkTargetElement) {

            classworkTargetElement.textContent =
                "6";

        }

        if (messageElement) {

            messageElement.textContent =
                "";

        }

        return;
    }


    // ------------------------------
    // I. SZINT teljesítve
    // → II. SZINT követelményei
    // ------------------------------

    if (levelOneComplete) {

        levelElement.textContent =
            "II. SZINT";

        if (performanceTargetElement) {

            performanceTargetElement.textContent =
                "10";

        }

        if (classworkTargetElement) {

            classworkTargetElement.textContent =
                "6";

        }

        if (messageElement) {

            messageElement.textContent =
                "";

        }

        return;
    }


    // ------------------------------
    // I. SZINT még nincs teljesítve
    // ------------------------------

    levelElement.textContent =
        "I. SZINT";


    if (performanceTargetElement) {

        performanceTargetElement.textContent =
            "5";

    }

    if (classworkTargetElement) {

        classworkTargetElement.textContent =
            "3";

    }

    if (messageElement) {

        messageElement.textContent =
            "";

    }

}
// ------------------------------
// Fair Play Hős követelmények frissítése
// ------------------------------

function renderFairPlayGoal() {

    const sportsmanshipCount =
        getBadgeCount("❤️");

    const starCount =
        getBadgeCount("⭐");

    const sportsmanshipElement =
        document.getElementById(
            "fairPlaySportsmanshipCount"
        );

    const starElement =
        document.getElementById(
            "fairPlayStarCount"
        );

    const levelElement =
        document.getElementById(
            "fairPlayLevel"
        );

    const messageElement =
        document.getElementById(
            "fairPlayLevelMessage"
        );

    if (sportsmanshipElement) {
        sportsmanshipElement.textContent =
            sportsmanshipCount;
    }

    if (starElement) {
        starElement.textContent =
            starCount;
    }

    if (!levelElement || !messageElement) {
        return;
    }


    // ------------------------------
    // FAIR PLAY HŐS – II. SZINT
    // ------------------------------

    const levelTwoComplete =
        sportsmanshipCount >= 10 &&
        starCount >= 6;


    // ------------------------------
    // FAIR PLAY HŐS – I. SZINT
    // ------------------------------

    const levelOneComplete =
        sportsmanshipCount >= 5 &&
        starCount >= 3;


    // ------------------------------
    // II. SZINT teljesítve
    // ------------------------------

    if (levelTwoComplete) {

        levelElement.textContent =
            "II. SZINT – TELJESÍTVE! 🏆";

        messageElement.textContent =
            "";

        return;
    }


    // ------------------------------
    // I. SZINT teljesítve
    // → következő cél: II. SZINT
    // ------------------------------

    if (levelOneComplete) {

        levelElement.textContent =
            "II. SZINT";

        messageElement.textContent =
            "";

        if (sportsmanshipElement) {
            sportsmanshipElement.textContent =
                sportsmanshipCount + " / 10";
        }

        if (starElement) {
            starElement.textContent =
                starCount + " / 6";
        }

        return;
    }


    // ------------------------------
    // I. SZINT még nincs teljesítve
    // ------------------------------

   levelElement.textContent =
    "I. SZINT";

messageElement.textContent =
    "";

if (sportsmanshipElement) {
    sportsmanshipElement.textContent =
        sportsmanshipCount + " / 5";
}

if (starElement) {
    starElement.textContent =
        starCount + " / 3";
}

}

// ------------------------------
// Csapathős követelmények frissítése
// ------------------------------

function renderTeamGoal() {

    const helpCount =
        getBadgeCount("🤝");

    const starCount =
        getBadgeCount("⭐");

    const helpElement =
        document.getElementById(
            "teamHelpCount"
        );

    const starElement =
        document.getElementById(
            "teamStarCount"
        );

    const helpTargetElement =
        document.getElementById(
            "teamHelpTarget"
        );

    const starTargetElement =
        document.getElementById(
            "teamStarTarget"
        );

    const levelElement =
        document.getElementById(
            "teamLevel"
        );

    if (helpElement) {
        helpElement.textContent =
            helpCount;
    }

    if (starElement) {
        starElement.textContent =
            starCount;
    }

    if (!levelElement) {
        return;
    }


    // ------------------------------
    // I. SZINT teljesítve?
    // ------------------------------

    const levelOneComplete =
        helpCount >= 5 &&
        starCount >= 3;


    // ------------------------------
    // II. SZINT teljesítve?
    // ------------------------------

    const levelTwoComplete =
        helpCount >= 10 &&
        starCount >= 6;


    // ------------------------------
    // II. SZINT teljesítve
    // ------------------------------

    if (levelTwoComplete) {

        levelElement.textContent =
            "II. SZINT – TELJESÍTVE! 🏆";

        if (helpTargetElement) {
            helpTargetElement.textContent =
                "10";
        }

        if (starTargetElement) {
            starTargetElement.textContent =
                "6";
        }

        return;
    }


    // ------------------------------
    // I. SZINT teljesítve
    // → következő cél a II. SZINT
    // ------------------------------

    if (levelOneComplete) {

        levelElement.textContent =
            "II. SZINT";

        if (helpTargetElement) {
            helpTargetElement.textContent =
                "10";
        }

        if (starTargetElement) {
            starTargetElement.textContent =
                "6";
        }

        return;
    }


    // ------------------------------
    // I. SZINT
    // ------------------------------

    levelElement.textContent =
        "I. SZINT";

    if (helpTargetElement) {
        helpTargetElement.textContent =
            "5";
    }

    if (starTargetElement) {
        starTargetElement.textContent =
            "3";
    }

}
// ------------------------------
// Kitartáshős követelmények frissítése
// ------------------------------

function renderPersistenceGoal() {

    const persistenceCount =
        getBadgeCount("🔥");

    const classworkCount =
        getBadgeCount("🤸");


    const persistenceElement =
        document.getElementById(
            "persistenceCount"
        );

    const classworkElement =
        document.getElementById(
            "persistenceClassworkCount"
        );


    const persistenceTargetElement =
        document.getElementById(
            "persistenceTarget"
        );

    const classworkTargetElement =
        document.getElementById(
            "persistenceClassworkTarget"
        );


    const levelElement =
        document.getElementById(
            "persistenceLevel"
        );


    if (persistenceElement) {

        persistenceElement.textContent =
            persistenceCount;

    }

    if (classworkElement) {

        classworkElement.textContent =
            classworkCount;

    }


    if (!levelElement) {
        return;
    }


    // ------------------------------
    // I. SZINT teljesítve?
    // ------------------------------

    const levelOneComplete =
        persistenceCount >= 5 &&
        classworkCount >= 3;


    // ------------------------------
    // II. SZINT teljesítve?
    // ------------------------------

    const levelTwoComplete =
        persistenceCount >= 10 &&
        classworkCount >= 6;


    // ------------------------------
    // II. SZINT teljesítve
    // ------------------------------

    if (levelTwoComplete) {

        levelElement.textContent =
            "II. SZINT – TELJESÍTVE! 🏆";

        if (persistenceTargetElement) {

            persistenceTargetElement.textContent =
                "10";

        }

        if (classworkTargetElement) {

            classworkTargetElement.textContent =
                "6";

        }

        return;
    }


    // ------------------------------
    // I. SZINT teljesítve
    // → következő cél a II. SZINT
    // ------------------------------

    if (levelOneComplete) {

        levelElement.textContent =
            "II. SZINT";

        if (persistenceTargetElement) {

            persistenceTargetElement.textContent =
                "10";

        }

        if (classworkTargetElement) {

            classworkTargetElement.textContent =
                "6";

        }

        return;
    }


    // ------------------------------
    // I. SZINT
    // ------------------------------

    levelElement.textContent =
        "I. SZINT";


    if (persistenceTargetElement) {

        persistenceTargetElement.textContent =
            "5";

    }

    if (classworkTargetElement) {

        classworkTargetElement.textContent =
            "3";

    }

}
// ------------------------------
// Kihíváshős követelmények frissítése
// ------------------------------

function renderChallengeGoal() {

    const challengeCount =
        getBadgeCount("🎯");

    const starCount =
        getBadgeCount("⭐");

    const challengeElement =
        document.getElementById(
            "challengeCount"
        );

    const starElement =
        document.getElementById(
            "challengeStarCount"
        );

    const challengeTargetElement =
        document.getElementById(
            "challengeTarget"
        );

    const starTargetElement =
        document.getElementById(
            "challengeStarTarget"
        );

    const levelElement =
        document.getElementById(
            "challengeLevel"
        );

    const messageElement =
        document.getElementById(
            "challengeLevelMessage"
        );

    if (challengeElement) {
        challengeElement.textContent =
            challengeCount;
    }

    if (starElement) {
        starElement.textContent =
            starCount;
    }

    if (!levelElement) {
        return;
    }


    // ------------------------------
    // I. SZINT teljesítve?
    // ------------------------------

   const levelTwoComplete =
    challengeCount >= 10 &&
    starCount >= 6;

const levelOneComplete =
    challengeCount >= 5 &&
    starCount >= 3;

    // ------------------------------
    // II. SZINT
    // ------------------------------

    if (levelTwoComplete) {

    levelElement.textContent =
        "II. SZINT – TELJESÍTVE! 🏆";

    challengeTargetElement.textContent = "10";
    starTargetElement.textContent = "6";

    return;

}

if (levelOneComplete) {

    levelElement.textContent =
        "II. SZINT";

    challengeTargetElement.textContent = "10";
    starTargetElement.textContent = "6";

    return;

}

levelElement.textContent =
    "I. SZINT";

challengeTargetElement.textContent = "5";
starTargetElement.textContent = "3";

    // ------------------------------
    // I. SZINT
    // ------------------------------

    levelElement.textContent =
        "I. SZINT";

    if (challengeTargetElement) {
        challengeTargetElement.textContent =
            "5";
    }

    if (starTargetElement) {
        starTargetElement.textContent =
            "3";
    }

    if (messageElement) {
        messageElement.textContent =
            "";
    }

}
// ------------------------------
// Sporttudós követelmények frissítése
// ------------------------------

function renderSportKnowledgeGoal() {

    const knowledgeCount =
        getBadgeCount("🧠");

    const starCount =
        getBadgeCount("⭐");

    const knowledgeElement =
        document.getElementById(
            "sportKnowledgeCount"
        );

    const starElement =
        document.getElementById(
            "sportKnowledgeStarCount"
        );

    const knowledgeTargetElement =
        document.getElementById(
            "sportKnowledgeTarget"
        );

    const starTargetElement =
        document.getElementById(
            "sportKnowledgeStarTarget"
        );

    const levelElement =
        document.getElementById(
            "sportKnowledgeLevel"
        );

    if (knowledgeElement) {
        knowledgeElement.textContent =
            knowledgeCount;
    }

    if (starElement) {
        starElement.textContent =
            starCount;
    }

    if (!levelElement) {
        return;
    }


    // ------------------------------
    // I. SZINT teljesítve?
    // ------------------------------

    const levelTwoComplete =
    knowledgeCount >= 10 &&
    starCount >= 6;

const levelOneComplete =
    knowledgeCount >= 5 &&
    starCount >= 3;

    // ------------------------------
    // II. SZINT
    // ------------------------------

    if (levelTwoComplete) {

    levelElement.textContent =
        "II. SZINT – TELJESÍTVE! 🏆";

    knowledgeTargetElement.textContent = "10";
    starTargetElement.textContent = "6";

    return;

}

if (levelOneComplete) {

    levelElement.textContent =
        "II. SZINT";

    knowledgeTargetElement.textContent = "10";
    starTargetElement.textContent = "6";

    return;

}

levelElement.textContent =
    "I. SZINT";

knowledgeTargetElement.textContent = "5";
starTargetElement.textContent = "3";


    // ------------------------------
    // I. SZINT
    // ------------------------------

    levelElement.textContent =
        "I. SZINT";

    if (knowledgeTargetElement) {
        knowledgeTargetElement.textContent =
            "5";
    }

    if (starTargetElement) {
        starTargetElement.textContent =
            "3";
    }

}
// ------------------------------
// Elért fejlődési szintek
// ------------------------------

function renderEarnedLevels() {

    const earnedLevels =
        document.getElementById("earnedLevels");

    const earnedLevelsSection =
        document.getElementById("earnedLevelsSection");

    if (!earnedLevels || !earnedLevelsSection) {
        return;
    }

    earnedLevels.innerHTML = "";

    if (!selectedStudent) {

        earnedLevelsSection.style.display = "none";

        return;
    }


    // ------------------------------
    // Jelvényszámok
    // ------------------------------

const performanceCount = getBadgeCount("🏃");
const starCount = getBadgeCount("⭐");
const fairPlayCount = getBadgeCount("❤️");
const teamCount = getBadgeCount("🤝");
const persistenceCount = getBadgeCount("🔥");
const challengeCount = getBadgeCount("🎯");
const knowledgeCount = getBadgeCount("🧠");

const movementClassworkCount = getBadgeCount("🤸");
const persistenceClassworkCount = getBadgeCount("🤸");

// ------------------------------
// MOZGÁSHŐS
// Csak a legmagasabb elért szint jelenik meg
// ------------------------------

if (
    performanceCount >= 10 &&
    movementClassworkCount >= 6
) {

    addEarnedLevel(
        "🏃",
        "MOZGÁSHŐS",
        "II. SZINT",
        true
    );

} else if (
    performanceCount >= 5 &&
    movementClassworkCount >= 3
) {
    addEarnedLevel(
        "🏃",
        "MOZGÁSHŐS",
        "I. SZINT",
        true
    );

}


 // ------------------------------
// FAIR PLAY HŐS
// ------------------------------

if (
    fairPlayCount >= 10 &&
    starCount >= 6
) {

    addEarnedLevel(
        "❤️",
        "FAIR PLAY HŐS",
        "II. SZINT",
        true
    );

} else if (
    fairPlayCount >= 5 &&
    starCount >= 3
) {

    addEarnedLevel(
        "❤️",
        "FAIR PLAY HŐS",
        "I. SZINT",
        true
    );

}


// ------------------------------
// CSAPATHŐS
// ------------------------------

if (
    teamCount >= 10 &&
    starCount >= 6
) {

    addEarnedLevel(
        "🤝",
        "CSAPATHŐS",
        "II. SZINT",
        true
    );

} else if (
    teamCount >= 5 &&
    starCount >= 3
) {

   addEarnedLevel(
    "🤝",
    "CSAPATHŐS",
    "I. SZINT",
    true
);

}


// ------------------------------
// KITARTÁSHŐS
// Csak a legmagasabb elért szint jelenik meg
// ------------------------------

if (
    persistenceCount >= 10 &&
    persistenceClassworkCount >= 6
) {

    addEarnedLevel(
        "🔥",
        "KITARTÁSHŐS",
        "II. SZINT",
        true
    );

} else if (
    persistenceCount >= 5 &&
    persistenceClassworkCount >= 3
) {

    addEarnedLevel(
        "🔥",
        "KITARTÁSHŐS",
        "I. SZINT",
        true
    );

}

// ------------------------------
// KIHÍVÁSHŐS
// ------------------------------

if (
    challengeCount >= 10 &&
    starCount >= 6
) {

    addEarnedLevel(
        "🎯",
        "KIHÍVÁSHŐS",
        "II. SZINT",
        true
    );

} else if (
    challengeCount >= 5 &&
    starCount >= 3
) {

    addEarnedLevel(
        "🎯",
        "KIHÍVÁSHŐS",
        "I. SZINT",
        true
    );

}


  // ------------------------------
// SPORTTUDÓS
// ------------------------------

if (
    knowledgeCount >= 10 &&
    starCount >= 6
) {

    addEarnedLevel(
        "🧠",
        "SPORTTUDÓS",
        "II. SZINT",
        true
    );

} else if (
    knowledgeCount >= 5 &&
    starCount >= 3
) {

    addEarnedLevel(
        "🧠",
        "SPORTTUDÓS",
        "I. SZINT",
        true
    );

}


    // ------------------------------
    // Megmutatjuk / elrejtjük
    // ------------------------------

    if (earnedLevels.children.length > 0) {

        earnedLevelsSection.style.display = "block";

    } else {

        earnedLevelsSection.style.display = "none";

    }

}


// ------------------------------
// Egy megszerzett szint hozzáadása
// ------------------------------

function addEarnedLevel(icon, name, rank, completed = true) {

    const earnedLevels =
        document.getElementById("earnedLevels");

    if (!earnedLevels) {
        return;
    }

    const levelElement =
        document.createElement("div");

   levelElement.className =
    `earnedLevel ${rank.startsWith("II.") ? "levelTwo" : "levelOne"}`;

    levelElement.innerHTML = `
        <span class="earnedLevelIcon">
            ${icon}
        </span>

        <span class="earnedLevelInfo">
            <span class="earnedLevelName">
                ${name}
            </span>

            <span class="earnedLevelRank">
                ${rank}${completed ? " – TELJESÍTVE" : ""}
            </span>
        </span>

        <span class="earnedLevelMedal">
            🏆
        </span>
    `;

    earnedLevels.appendChild(levelElement);

}
// ------------------------------
// Jelvények
// ------------------------------

const badgeButtons = document.querySelectorAll("#badgeButtons button");

badgeButtons.forEach(button => {

    button.addEventListener("click", () => {

    if (!selectedStudent) {

    selectStudentModal.style.display = "flex";

    return;
}

        const badge = button.textContent.split(" ")[0];

        selectedStudent.badges.push(badge);

       saveData();

    renderBadges();
    renderMovementGoal();
    renderFairPlayGoal();
    renderTeamGoal();
    renderPersistenceGoal();
    renderChallengeGoal();
    renderSportKnowledgeGoal();
    renderEarnedLevels();

    });

});
// ------------------------------
// Automatikus mentés
// ------------------------------

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students)
    );

}


// ------------------------------
// Adatok betöltése
// ------------------------------

function loadData() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        return;
    }

    try {

        students = JSON.parse(savedData);
        students.forEach(student => {
    if (!student.className) {
        student.className = "6.B";
    }
});
        students.forEach(student => {

    if (!student.selfEvaluationCounts) {

        student.selfEvaluationCounts = {
            hero: 0,
            good: 0,
            developing: 0
        };

    }

});

    } catch (error) {

        console.error(
            "A mentett adatok betöltése sikertelen:",
            error
        );

        students = [];

    }

}


// ------------------------------
// Mentés minden változás után
// ------------------------------

function saveAndRender() {

    saveData();

    renderStudents();

}
// ------------------------------
// Indítás
// ------------------------------

loadData();

loadClasses();

renderClasses();

renderStudents();

// ------------------------------
// Osztályok betöltése
// ------------------------------

function loadClasses() {

    const savedClasses =
        localStorage.getItem(CLASSES_STORAGE_KEY);

    if (savedClasses) {

        try {

            classes = JSON.parse(savedClasses);

        } catch (error) {

            console.error(
                "Az osztályok betöltése sikertelen:",
                error
            );

            classes = [];

        }

    }

    // Ha még nincsenek külön mentett osztályok,
    // a meglévő tanulók osztályaiból építjük fel őket.
    if (classes.length === 0 && students.length > 0) {

        classes = [
            ...new Set(
                students.map(student => student.className)
            )
        ];

        saveClasses();
    }

}


// ------------------------------
// Osztályok mentése
// ------------------------------

function saveClasses() {

    localStorage.setItem(
        CLASSES_STORAGE_KEY,
        JSON.stringify(classes)
    );

}

// ------------------------------
// Osztályválasztó frissítése
// ------------------------------

function renderClasses() {

    classSelect.innerHTML = "";

    classes.forEach(className => {

        const option = document.createElement("option");

        option.value = className;
        option.textContent = className;

        classSelect.appendChild(option);

    });

    if (classes.length > 0) {

        if (classes.includes(selectedClass)) {

            classSelect.value = selectedClass;

        } else {

            selectedClass = classes[0];
            classSelect.value = selectedClass;

        }

    }

}
// ------------------------------
// Osztály hozzáadása - ablak megnyitása
// ------------------------------

addClassButton.addEventListener("click", () => {

    newClassName.value = "";

    addClassModal.style.display = "flex";

    newClassName.focus();

});
// ------------------------------
// Új osztály mentése
// ------------------------------

saveAddClassButton.addEventListener("click", () => {

    const className =
        newClassName.value.trim();

    if (!className) {

        alert("Írd be az osztály nevét!");

        newClassName.focus();

        return;
    }

    if (classes.includes(className)) {

        alert("Ez az osztály már létezik!");

        newClassName.focus();

        newClassName.select();

        return;
    }

    classes.push(className);

    saveClasses();

    selectedClass = className;

    renderClasses();

    classSelect.value = className;

    selectedStudent = null;

    addClassModal.style.display = "none";

    renderStudents();

});
// ------------------------------
// Osztály hozzáadása - Mégse
// ------------------------------

cancelAddClassButton.addEventListener("click", () => {

    addClassModal.style.display = "none";

});
// ------------------------------
// Enter / Escape az osztály hozzáadásánál
// ------------------------------

newClassName.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        saveAddClassButton.click();

    }

    if (event.key === "Escape") {

        addClassModal.style.display = "none";

    }

});
// ------------------------------
// Osztály törlése
// ------------------------------

deleteClassButton.addEventListener("click", () => {

    if (!selectedClass) {

        alert("Először válassz ki egy osztályt!");

        return;
    }

    const confirmDelete = confirm(
        `Biztosan törölni szeretnéd a(z) ${selectedClass} osztályt és a hozzá tartozó tanulókat?`
    );

    if (!confirmDelete) {
        return;
    }

    // Az osztály tanulóinak törlése
    students = students.filter(
        student => student.className !== selectedClass
    );

    // Osztály törlése
    classes = classes.filter(
        className => className !== selectedClass
    );

    saveData();
    saveClasses();

    selectedStudent = null;

    if (classes.length > 0) {

        selectedClass = classes[0];

    } else {

        selectedClass = "";

    }

    renderClasses();

    renderStudents();

});

// ------------------------------
// Név módosítása
// ------------------------------

editStudentButton.addEventListener("click", () => {

if (!selectedStudent) {

    selectStudentModal.style.display = "flex";

    return;
}

    editStudentName.value =
        selectedStudent.name;

    editStudentModal.style.display = "flex";

    editStudentName.focus();

    editStudentName.select();

});


// ------------------------------
// Név módosítás mentése
// ------------------------------

saveEditStudentButton.addEventListener("click", () => {

    const newName =
        editStudentName.value.trim();

    if (!newName) {
        return;
    }

    selectedStudent.name = newName;

    saveData();

    renderStudents();

    heroName.textContent =
        selectedStudent.name;

    closeEditStudentModal();

});


// ------------------------------
// Mégse
// ------------------------------

cancelEditStudentButton.addEventListener("click", () => {

    closeEditStudentModal();

});


// ------------------------------
// Ablak bezárása
// ------------------------------

function closeEditStudentModal() {

    editStudentModal.style.display = "none";

}
// ------------------------------
// Tanuló törlése – saját ablak
// ------------------------------

deleteStudentButton.addEventListener("click", () => {

if (!selectedStudent) {

    selectStudentModal.style.display = "flex";

    return;
}

    deleteStudentMessage.textContent =
        `Biztosan törölni szeretnéd ${selectedStudent.name} adatait?`;

    deleteStudentModal.style.display = "flex";

});
// ------------------------------
// Osztály váltása
// ------------------------------

classSelect.addEventListener("change", () => {

    selectedClass = classSelect.value;

    selectedStudent = null;

    heroName.textContent = "Válassz egy tanulót!";

    badges.innerHTML = "";
    events.innerHTML = "";

    renderStudents();

});


// ------------------------------
// Törlés megerősítése
// ------------------------------

confirmDeleteStudentButton.addEventListener("click", () => {

    students = students.filter(
        student => student !== selectedStudent
    );

    selectedStudent = null;

    heroName.textContent =
        "Válassz egy tanulót!";

    badges.innerHTML = "";

    events.innerHTML = "";

    saveData();

    renderStudents();

    closeDeleteStudentModal();

});


// ------------------------------
// Törlés megszakítása
// ------------------------------

cancelDeleteStudentButton.addEventListener("click", () => {

    closeDeleteStudentModal();

});


function closeDeleteStudentModal() {

    deleteStudentModal.style.display = "none";

}
// ------------------------------
// Negatív esemény rögzítése
// ------------------------------

eventButtons.forEach(button => {

    button.addEventListener("click", () => {

if (!selectedStudent) {

    selectStudentModal.style.display = "flex";

    return;
}

        const eventName =
            button.textContent.trim();

        if (!selectedStudent.events) {
            selectedStudent.events = [];
        }

        selectedStudent.events.push({
            name: eventName,
            date: new Date().toLocaleDateString("hu-HU")
        });

        saveData();

        renderEvents();

    });

});


// ------------------------------
// Események megjelenítése
// ------------------------------

function renderEvents() {

    events.innerHTML = "";

    if (!selectedStudent ||
        !selectedStudent.events) {

        return;
    }

    selectedStudent.events.forEach((event, index) => {

        const eventElement =
            document.createElement("div");

        eventElement.className = "negativeEvent";

        const icon =
            event.name.split(" ")[0];

        eventElement.innerHTML = `
            <span>${icon}</span>
        `;

        eventElement.title =
            event.name;

        eventElement.addEventListener("click", () => {

            deleteEventMessage.textContent =
                `Biztosan vissza szeretnéd vonni ezt az eseményt: ${event.name}?`;

            deleteEventModal.style.display = "flex";

            deleteEventModal.dataset.eventIndex = index;

        });

        events.appendChild(eventElement);

    });

}
// ------------------------------
// Jelvény visszavonása
// ------------------------------

confirmDeleteBadgeButton.addEventListener("click", () => {

    if (!selectedStudent) {
        return;
    }

    const badgeType =
        deleteBadgeModal.dataset.badgeType;

    const index =
        selectedStudent.badges.indexOf(badgeType);

    if (index !== -1) {

        selectedStudent.badges.splice(index, 1);

    }

 saveData();

renderBadges();

renderMovementGoal();

renderFairPlayGoal();

renderTeamGoal();

renderPersistenceGoal();

renderChallengeGoal();

renderSportKnowledgeGoal();

renderEarnedLevels();

closeDeleteBadgeModal();
});

// ------------------------------
// Jelvény törlés megszakítása
// ------------------------------

cancelDeleteBadgeButton.addEventListener("click", () => {

    closeDeleteBadgeModal();

});


// ------------------------------
// Jelvény törlés ablak bezárása
// ------------------------------

function closeDeleteBadgeModal() {

    deleteBadgeModal.style.display = "none";

}
// ------------------------------
// Esemény visszavonása
// ------------------------------

confirmDeleteEventButton.addEventListener("click", () => {

    if (!selectedStudent) {
        return;
    }

    const index =
        Number(deleteEventModal.dataset.eventIndex);

    selectedStudent.events.splice(index, 1);

    saveData();

    renderEvents();

    closeDeleteEventModal();

});


// ------------------------------
// Esemény törlés megszakítása
// ------------------------------

cancelDeleteEventButton.addEventListener("click", () => {

    closeDeleteEventModal();

});


// ------------------------------
// Esemény törlés ablak bezárása
// ------------------------------

function closeDeleteEventModal() {

    deleteEventModal.style.display = "none";

}
// =========================================
// Önértékelés
// =========================================

const selfEvaluationSection =
    document.getElementById("selfEvaluationSection");

const selfEvaluationHeader =
    document.getElementById("selfEvaluationHeader");

const selfEvaluationOptions =
    document.querySelectorAll(".selfEvaluationOption");

const heroSelfEvaluationBadge =
    document.getElementById("heroSelfEvaluationBadge");

    const heroSelfEvaluationHeroCount =
    document.getElementById("heroSelfEvaluationHeroCount");

const heroSelfEvaluationGoodCount =
    document.getElementById("heroSelfEvaluationGoodCount");

const heroSelfEvaluationDevelopingCount =
    document.getElementById("heroSelfEvaluationDevelopingCount");

    const selfEvaluationCountElements = {
    hero: heroSelfEvaluationHeroCount,
    good: heroSelfEvaluationGoodCount,
    developing: heroSelfEvaluationDevelopingCount
};
Object.entries(selfEvaluationCountElements).forEach(
    ([type, element]) => {

        element.parentElement.addEventListener("click", () => {

            if (!selectedStudent) {
                return;
            }

            const names = {
                hero: "🏆 Hős voltam",
                good: "💪 Jó úton vagyok",
                developing: "🌱 Fejlődöm"
            };

            const count =
                selectedStudent.selfEvaluationCounts[type] || 0;

            if (count <= 0) {
                return;
            }

            deleteSelfEvaluationMessage.textContent =
                `Biztosan vissza szeretnéd vonni ezt az önértékelést?\n\n${names[type]}\nJelenlegi szám: ${count}`;

            deleteSelfEvaluationModal.style.display = "flex";

            deleteSelfEvaluationModal.dataset.type = type;
        });

    }
);
cancelDeleteSelfEvaluationButton.addEventListener("click", () => {

    deleteSelfEvaluationModal.style.display = "none";

});
confirmDeleteSelfEvaluationButton.addEventListener("click", () => {

    const type =
        deleteSelfEvaluationModal.dataset.type;

    if (!selectedStudent || !type) {
        return;
    }

    if (selectedStudent.selfEvaluationCounts[type] > 0) {

        selectedStudent.selfEvaluationCounts[type]--;

        saveData();

        renderSelfEvaluationCounts();
    }

    deleteSelfEvaluationModal.style.display = "none";

});
    function renderSelfEvaluationCounts() {

    if (!selectedStudent) {
        return;
    }

    const counts =
        selectedStudent.selfEvaluationCounts || {
            hero: 0,
            good: 0,
            developing: 0
        };

    heroSelfEvaluationHeroCount.textContent =
        counts.hero;

    heroSelfEvaluationGoodCount.textContent =
        counts.good;

    heroSelfEvaluationDevelopingCount.textContent =
        counts.developing;
}


// Jobb oldali Önértékelés panel nyitása / bezárása
selfEvaluationHeader.addEventListener("click", () => {

    selfEvaluationSection.classList.toggle("collapsed");

});



// Önértékelés kiválasztása
selfEvaluationOptions.forEach(option => {

    option.addEventListener("click", () => {

if (!selectedStudent) {

    selectStudentModal.style.display = "flex";

    return;
}

        const value =
            option.dataset.value;

        const badgeMap = {

            hero: "🏆",

            good: "💪",

            developing: "🌱"

        };

        // Önértékelés számlálójának növelése
if (!selectedStudent.selfEvaluationCounts) {
    selectedStudent.selfEvaluationCounts = {
        hero: 0,
        good: 0,
        developing: 0
    };
}

selectedStudent.selfEvaluationCounts[value]++;

// Mentjük az aktuális önértékelést
selectedStudent.selfEvaluation =
    value;


renderSelfEvaluationCounts();

// Megjelenítjük az aktuális jelvényt
heroSelfEvaluationBadge.textContent =
    badgeMap[value];

        // Kiválasztott gomb kiemelése
        selfEvaluationOptions.forEach(item => {

            item.classList.remove("selected");

        });

        option.classList.add("selected");

        saveData();

    });

});
// =========================================
// Hőskártyák forgatása
// =========================================

document.querySelectorAll(".heroCategory").forEach(card => {

    card.addEventListener("click", () => {

        card.classList.toggle("flipped");

    });

});