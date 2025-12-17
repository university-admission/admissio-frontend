import {Application, StudentApplication, TrackedOffers} from "../common/types.js";
import {renderTrackedOffer} from "./tracked-offer-renderer.js"

const header = document.getElementById("header") as HTMLSpanElement;
export const applicationType = document.getElementById("application-type") as HTMLSpanElement;

const offersList = document.getElementById("offers-list") as HTMLDivElement;
const admissioType = localStorage.getItem("admission-type") || "budget";

getTrackedOffers();

function getTrackedOffers() : void {
    header.textContent = "Відстежуванні пропозиції: ";
    applicationType.textContent = "";

    const mathScore = Number(localStorage.getItem("math-score"));
    const ukLangScore = Number(localStorage.getItem("uk-lang-score"));
    const historyScore = Number(localStorage.getItem("history-score"));
    const electiveSubject = localStorage.getItem("elective-subject");
    const electiveSubjectScore = Number(localStorage.getItem("elective-subject-score"));
    const competitionScore = Number(localStorage.getItem("competition-score"));
    const trackedOffersRaw= localStorage.getItem("trackedOffers");

    if (!(admissioType && mathScore && ukLangScore && historyScore && electiveSubject && electiveSubjectScore)) {
        header.textContent = "Відстежуванні пропозиції не доступні, введіть на головній сторінці оцінку абітурієнта!";
        return;
    }

    switch (admissioType) {
        case "quota-1":
            applicationType.textContent = "Квота 1";
            break;
        case "quota-2":
            applicationType.textContent = "Квота 2";
            break;
        case "contract":
            applicationType.textContent = "Контракт";
            break;
        default:
            applicationType.textContent = "Бюджет";
    }

    const trackedOffers : number[] = trackedOffersRaw ? JSON.parse(trackedOffersRaw).map(Number) : [];

    let quotaType: "GENERAL" | "QUOTA_1" | "QUOTA_2" = "GENERAL";
    if (admissioType === 'quota-1') quotaType = "QUOTA_1";
    if (admissioType === 'quota-2') quotaType = "QUOTA_2";


    offersList.innerHTML = `
        <div class="loader-container">
            <div class="loader"></div>
            <h3 class="loader-text">Аналізуємо конкурсну ситуацію...</h3>
        </div>
    `;

    const requestData = {
        "scoreCalculationRequestDto": {
            "mandatorySubjects": {
                "ukrainian": ukLangScore,
                "math": mathScore,
                "history": historyScore
            },
            "electiveSubject": {
                "subjectName": electiveSubject,
                "score": electiveSubjectScore
            },
            "creativeCompetitionScore": competitionScore
        },
        "offerIds": trackedOffers,
        "quotaType": quotaType,
        "isBudget": admissioType !== "contract"
    };

    fetch("http://localhost:8080/offers/tracked",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        return response.json();
    })
    .then((data: TrackedOffers[]) => {
        renderTrackedOffers(data);
    })
    .catch((error: Error) => {
        console.error("Error loading tracked offers: ", error);
        offersList.innerHTML = `<p style="color: red; text-align: center;">Помилка завантаження даних. Спробуйте оновити сторінку.</p>`;
    });
}

function renderTrackedOffers(offers: TrackedOffers[]): void {
    applicationType.textContent += ", " + offers.length;

    offersList.replaceChildren();

    for (const offer of offers)
        offersList.appendChild(renderTrackedOffer(offer));
}

export async function getApplications(offerId: number): Promise<Application[] | null> {
    let quotaType: "GENERAL" | "QUOTA_1" | "QUOTA_2" = "GENERAL";
    if (admissioType === 'quota-1') quotaType = "QUOTA_1";
    if (admissioType === 'quota-2') quotaType = "QUOTA_2";

    const response = await fetch(`http://localhost:8080/applications?offerId=${offerId}&quotaType=${quotaType}&isBudget=${admissioType !== "contract"}`);

    if (!response.ok) {
        console.error("Error loading applications: ", new Error(`HTTP error! Status: ${response.status}`));
        return null;
    }

    return await response.json();
}

export async function getStudentApplications(studentId: number): Promise<StudentApplication[] | null> {
    const response = await fetch(`http://localhost:8080/applications/student?studentId=${studentId}`);

    if (!response.ok) {
        console.error("Error loading student applications: ", new Error(`HTTP error! Status: ${response.status}`));
        return null;
    }

    return await response.json();
}