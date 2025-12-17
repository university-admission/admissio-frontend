import {TrackedOffers, Application, StudentApplication, educationFormLabels} from "../common/types.js";
import {removeFromTrackedOffers} from "./tracking-handler.js";
import {applicationType, getApplications, getStudentApplications} from "./tracked-offers.js";

const popup = document.getElementById("offer-popup") as HTMLDivElement;
const popupOverlay = document.getElementById("popup-overlay") as HTMLDivElement;

const studentApplicationsPopup = document.getElementById("student-popup") as HTMLDivElement;

export function renderTrackedOffer(offer: TrackedOffers): HTMLElement {
    const offerElement = document.createElement("div");
    offerElement.classList.add("offer-card");
    offerElement.id = String(offer.offerId);

    const university = document.createElement("h3");
    university.innerText = offer.universityName;
    offerElement.appendChild(university);

    const major = document.createElement("p");
    const majorName = document.createElement("strong");
    majorName.innerText = "Спеціальність: ";
    major.appendChild(majorName);
    major.appendChild(document.createTextNode(offer.majorName));
    offerElement.appendChild(major);

    const faculty = document.createElement("p");
    const facultyName = document.createElement("strong");
    facultyName.innerText = "Факультет: ";
    faculty.appendChild(facultyName);
    faculty.appendChild(document.createTextNode(offer.facultyName));
    offerElement.appendChild(faculty);

    const score = document.createElement("p");
    const scoreText = document.createElement("strong");
    scoreText.innerText = "Ваш Бал: ";
    score.appendChild(scoreText);
    score.appendChild(document.createTextNode(String(offer.userScore.toFixed(3))));
    offerElement.appendChild(score);

    const actualPlace = document.createElement("p");
    const actualPlaceText = document.createElement("strong");
    actualPlaceText.innerText = "Ваше місце (актуальні пропозиції): ";
    actualPlace.appendChild(actualPlaceText);
    const actualPlaceNumber = document.createElement("span");
    actualPlaceNumber.innerText = offer.rankActual + "/" + offer.places;
    if (offer.rankActual < offer.places)
        actualPlaceNumber.classList.add("save-place");
    else if (offer.rankActual == offer.places)
        actualPlaceNumber.classList.add("dangerous-place");
    else
        actualPlaceNumber.classList.add("impassable-place");
    actualPlace.appendChild(actualPlaceNumber);
    offerElement.appendChild(actualPlace);

    const allPlace = document.createElement("p");
    const allPlaceText = document.createElement("strong");
    allPlaceText.innerText = "Ваше місце (усі пропозиції): ";
    allPlace.appendChild(allPlaceText);
    const allPlaceNumber = document.createElement("span");
    allPlaceNumber.innerText = offer.rankAll + "/" + offer.places;
    if (offer.rankAll < offer.places)
        allPlaceNumber.classList.add("save-place");
    else if (offer.rankAll == offer.places)
        allPlaceNumber.classList.add("dangerous-place");
    else
        allPlaceNumber.classList.add("impassable-place");
    allPlace.appendChild(allPlaceNumber);
    offerElement.appendChild(allPlace);

    const trackBtn = document.createElement("button");
    trackBtn.textContent = "Перестати відстежувати";
    trackBtn.classList.add("tracked");

    trackBtn.addEventListener("click", (event: Event): void => {
        event.stopPropagation();
        toggleTrack(offer);
    });
    offerElement.appendChild(trackBtn);

    offerElement.addEventListener("click", (event: Event): void => {
        event.stopPropagation();
        renderFullInfo(offer);
    })

    return offerElement;
}

function toggleTrack(offer: TrackedOffers): void {
    if (!confirm("Ви впевнені, що хочете видалити цю пропозицію зі списку відстежуваних?"))
        return;

    removeFromTrackedOffers(String(offer.offerId));

    const card = document.getElementById(String(offer.offerId));
    if (card)
        card.remove();

    const currentCount = parseInt(applicationType.textContent?.split(", ")[1] || "0")
    const typeText = applicationType.textContent?.split(", ")[0];
    if (currentCount > 0 && typeText)
        applicationType.textContent = `${typeText}, ${currentCount - 1}`;
}

async function renderFullInfo(offer: TrackedOffers): Promise<void> {
    const applications = await getApplications(offer.offerId);

    popup.style.display = "block";
    popupOverlay.style.display = "block";

    (document.querySelector("#popup-university span") as HTMLElement).textContent = offer.universityName;
    (document.querySelector("#popup-major span") as HTMLElement).textContent = offer.majorName;
    (document.querySelector("#popup-offer-name span") as HTMLElement).textContent = offer.offerName;
    (document.querySelector("#popup-faculty span") as HTMLElement).textContent = offer.facultyName;
    (document.querySelector("#popup-study-form span") as HTMLElement).textContent = educationFormLabels[offer.educationForm] || offer.educationForm;
    const actualPlace = document.querySelector("#user-actual-place span") as HTMLElement;
    actualPlace.textContent = offer.rankActual + "/" + offer.places;
    if (offer.rankActual < offer.places) {
        for (let c of actualPlace.classList.values())
            actualPlace.classList.remove(c)
        
        actualPlace.classList.add("save-place");
    }
    else if (offer.rankActual == offer.places) {
        for (let c of actualPlace.classList.values())
            actualPlace.classList.remove(c)
        
        actualPlace.classList.add("dangerous-place");
    }
    else {
        for (let c of actualPlace.classList.values())
            actualPlace.classList.remove(c)

        actualPlace.classList.add("impassable-place");
    }

    const allPlace = document.querySelector("#user-all-place span") as HTMLElement;
    allPlace.textContent = offer.rankAll + "/" + offer.places;
    if (offer.rankAll < offer.places) {
        for (let c of allPlace.classList.values()) 
            allPlace.classList.remove(c)
        
        allPlace.classList.add("save-place");
    }
    else if (offer.rankAll == offer.places) {
        for (let c of allPlace.classList.values())
            allPlace.classList.remove(c)
        
        allPlace.classList.add("dangerous-place");
    }
    else {
        for (let c of allPlace.classList.values())
            allPlace.classList.remove(c)
        
        allPlace.classList.add("impassable-place");
    }

    const title = document.getElementById("offer-popup-title") as HTMLHeadElement;
    title.replaceChildren();
    title.textContent = "Список заяв";
    if (!applications){
        const someThingWrong = document.createElement("p");
        someThingWrong.textContent = "Помилка завантажування заяв, спробуйте пізніше!";
        someThingWrong.style.color = "red";
        title.appendChild(someThingWrong);
        return;
    }

    const applicationTable = document.querySelector("#application-table tbody") as HTMLTableSectionElement;
    applicationTable.replaceChildren();

    let i : number = 1;
    let realCount: number = 1;
    let userIsPlaced: boolean = false;
    for (const application of applications) {
        if (!userIsPlaced && application.score <= offer.userScore) {
            applicationTable.appendChild(renderUserApplication(i, realCount, offer.userScore, offer.places - offer.rankAll));
            i++;
            realCount++;
            userIsPlaced = true;
        }

        if (application.isCounted){
            applicationTable.appendChild(renderApplication(i, application, String(realCount)));
            realCount++;
        }
        else
            applicationTable.appendChild(renderApplication(i, application));
        i++;
    }
}

function renderApplication(count: number, application: Application, realCount: string = ""): HTMLTableRowElement {
    const row = document.createElement("tr");
    row.id = String(application.studentId);

    let statusHtml;

    if (application.isCounted && application.isActual) {
        row.classList.add("state-recommended");
        statusHtml = '<span class="status-badge badge-success">✅ Рекомендовано</span>';
    }
    else if (application.isCounted && !application.isActual) {
        row.classList.add("state-blocked");
        statusHtml = '<span class="status-badge badge-warning">⚠️ Очікує вищий пріоритет</span>';
    }
    else {
        row.classList.add("state-rejected");
        statusHtml = '<span class="status-badge badge-neutral">Проходить за вищим пріоритетом, або не проходить</span>';
    }

    const index = document.createElement("td");
    index.textContent = String(count);
    row.appendChild(index);

    const realIndex = document.createElement("td");
    realIndex.textContent = realCount;
    row.appendChild(realIndex);

    const name = document.createElement("td");
    name.textContent = application.studentName;
    row.appendChild(name);

    const score = document.createElement("td");
    score.textContent = String(application.score.toFixed(3));
    row.appendChild(score);

    const priority = document.createElement("td");
    priority.textContent = String(application.priority);
    row.appendChild(priority);

    const status = document.createElement("td");
    status.innerHTML = statusHtml;
    row.appendChild(status);

    row.addEventListener("click",  (event: Event): void => {
        event.stopPropagation();
        renderStudentFullInfo(application.studentId, application.studentName);
    });

    return row;
}

function renderUserApplication(count: number, realCount: number, userScore: number, placeAfterUser: number): HTMLTableRowElement {
    const row = document.createElement("tr");

    let statusHtml;

    if (placeAfterUser > 0 ) {
        row.classList.add("state-recommended");
        statusHtml = '<span class="status-badge badge-success">✅ Рекомендовано</span>';
    }
    else if (placeAfterUser == 0) {
        row.classList.add("state-blocked");
        statusHtml = '<span class="status-badge badge-warning">⚠️ Рекомендовано, але не безпечно</span>';
    }
    else {
        row.classList.add("state-canceled");
        statusHtml = '<span class="status-badge badge-danger">❌ Не проходите</span>';
    }

    const index = document.createElement("td");
    index.textContent = String(count);
    row.appendChild(index);

    const realIndex = document.createElement("td");
    realIndex.textContent = String(realCount);
    row.appendChild(realIndex);

    const name = document.createElement("td");
    name.textContent = "Ви";
    row.appendChild(name);

    const score = document.createElement("td");
    score.textContent = String(userScore.toFixed(3));
    row.appendChild(score);

    const priority = document.createElement("td");
    priority.textContent = "-";
    row.appendChild(priority);

    const status = document.createElement("td");
    status.innerHTML = statusHtml;
    row.appendChild(status);

    return row;
}

async function renderStudentFullInfo(studentId: number, studentName: string): Promise<void>{
    const applications: StudentApplication[] | null = await getStudentApplications(studentId);

    studentApplicationsPopup.style.display = "block";

    const title = document.querySelector("#student-popup-title span") as HTMLSpanElement;
    title.replaceChildren();
    title.textContent = "писок заяв студента ";
    const name = document.createElement("span");
    name.textContent = studentName;
    title.appendChild(name);
    if (!applications) {
        const someThingWrong = document.createElement("p");
        someThingWrong.style.color = "red";
        someThingWrong.textContent = "Помилка завантажування заяв, спробуйте пізніше!";
        title.appendChild(someThingWrong);
        return;
    }

    const applicationList = document.querySelector("#student-application-table tbody") as HTMLTableSectionElement;
    applicationList.replaceChildren();

    for (const application of applications) {
        applicationList.appendChild(renderStudentApplication(application));
    }
}

function renderStudentApplication(application: StudentApplication): HTMLTableRowElement{
    const row = document.createElement("tr");

    const priority = document.createElement("td");
    priority.textContent = String(application.priority);
    row.appendChild(priority);

    const isActual = document.createElement("td");
    isActual.classList.add("status-badge");
    if (application.isCounted && application.isActual) {
        row.classList.add("state-recommended");
        isActual.classList.add("badge-success");
        isActual.textContent = "✅ Рекомендовано";
    }
    else if (application.isCounted && !application.isActual) {
        row.classList.add("state-blocked");
        isActual.classList.add("badge-neutral");
        isActual.textContent = "⚠️ Рекомендовано, але не має вищих пріорітетів";
    }
    else {
        row.classList.add("state-rejected");
        isActual.classList.add("badge-neutral");
        isActual.textContent = "❌ Не проходить, або проходить за вищим пріорітетом";
    }
    row.appendChild(isActual);

    const score = document.createElement("td");
    score.textContent = String(application.score);
    row.appendChild(score);

    const type = document.createElement("td");
    if (!application.isBudget){
        type.textContent = "Контракт";
    }
    else{
        switch (application.quotaType) {
            case "QUOTA_1":
                type.textContent = "Квота 1";
                break;
            case "QUOTA_2":
                type.textContent = "Квота 2";
                break;
            case "GENERAL":
                type.textContent = "Бюджет";
                break;
            default:
                type.textContent = "Помилка";
                type.style.color = "red";
                break;
        }
    }
    row.appendChild(type);

    const university = document.createElement("td");
    university.textContent = application.universityName;
    row.appendChild(university);

    const faculty = document.createElement("td");
    faculty.textContent = application.facultyName;
    row.appendChild(faculty);

    const major = document.createElement("td");
    major.textContent = application.majorName;
    row.appendChild(major);

    return row;
}