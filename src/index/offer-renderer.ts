import {educationFormLabels, Offer} from "../common/types.js";
import {StorageService} from "../common/student-score-handler.js";

export function renderOffersResponses(offers: Offer[]): void {
    const offerResponseResult = document.getElementById("result") as HTMLHeadElement;
    const offerCount = document.getElementById("offersCount") as HTMLElement;
    const offersList = document.getElementById("offers-list") as HTMLDivElement;

    if (!offerResponseResult || !offerCount || !offersList) {
        console.error("Offers fields not found!");
        return;
    }

    if (offers.length > 0) {
        offerResponseResult.textContent = "Результати пошуку, кількість пропозицій: ";
        offerResponseResult.appendChild(offerCount);
        offerCount.textContent = String(offers.length);
    }
    else{
        offerResponseResult.textContent = "За даним запитом не знайдено пропозицій";
        offerResponseResult.appendChild(offerCount);
        offerCount.textContent = "";
    }


    offersList.replaceChildren();
    offers.forEach((offer: Offer) => {
        offersList.appendChild(renderPartOFOffer(offer));
    });
}

function renderPartOFOffer(offer: Offer): HTMLElement {
    const offerElement = document.createElement("div");
    offerElement.classList.add("offer-card");
    offerElement.id = String(offer.id);

    const university = document.createElement("h3");
    university.innerText = offer.universityName;
    offerElement.appendChild(university);

    const major = document.createElement("p");
    const majorName = document.createElement("strong");
    majorName.innerText = "Спеціальність: ";
    major.appendChild(majorName);
    major.appendChild(document.createTextNode(offer.major.majorName));
    offerElement.appendChild(major);

    const faculty = document.createElement("p");
    const facultyName = document.createElement("strong");
    facultyName.innerText = "Факультет: ";
    faculty.appendChild(facultyName);
    faculty.appendChild(document.createTextNode(offer.faculty));
    offerElement.appendChild(faculty);

    const placesInfo = document.createElement("div");
    placesInfo.classList.add("places-info");

    let type = document.createElement("p");
    let typeName = document.createElement("strong");
    typeName.innerText = "Бюджет: ";
    type.appendChild(typeName);
    type.appendChild(document.createTextNode(String(offer.budgetPlaces)));
    placesInfo.appendChild(type);

    type = document.createElement("p");
    typeName = document.createElement("strong");
    typeName.innerText = "Квота 1: ";
    type.appendChild(typeName);
    type.appendChild(document.createTextNode(String(offer.quota1Places)));
    placesInfo.appendChild(type);

    type = document.createElement("p");
    typeName = document.createElement("strong");
    typeName.innerText = "Контракт: ";
    type.appendChild(typeName);
    type.appendChild(document.createTextNode(String(offer.contractPlaces)));
    placesInfo.appendChild(type);

    type = document.createElement("p");
    typeName = document.createElement("strong");
    typeName.innerText = "Квота 2: ";
    type.appendChild(typeName);
    type.appendChild(document.createTextNode(String(offer.quota2Places)));
    placesInfo.appendChild(type);

    offerElement.appendChild(placesInfo);

    const trackBtn = document.createElement("button");
    if (StorageService.isTracked(offer.id)){
        trackBtn.textContent = "Перестати відстежувати";
        trackBtn.classList.add("tracked");
    }
    else{
        trackBtn.textContent = "Відстежувати";
        trackBtn.classList.remove("tracked");
    }

    trackBtn.addEventListener("click", (event: Event): void => {
        event.stopPropagation();
        toggleTrack(offer, event.currentTarget as HTMLButtonElement);
    });
    offerElement.appendChild(trackBtn);

    offerElement.addEventListener("click", (event: Event): void => {
        event.stopPropagation();
        renderOfferFullInfo(offer);
    })

    return offerElement;
}

function toggleTrack(offer: Offer, button: HTMLButtonElement){
    if (StorageService.isTracked(offer.id)) {
        button.textContent = "Відстежувати";
        button.classList.remove("tracked");
        StorageService.removeFromTracked(offer.id);
    } else {
        button.textContent = "Перестати відстежувати";
        button.classList.add("tracked");
        StorageService.addToTracked(offer.id);
    }
}

function renderOfferFullInfo(offer: Offer): void {
    const popup = document.getElementById("popup") as HTMLDivElement;
    const popupOverlay = document.getElementById("popup-overlay") as HTMLDivElement;

    if (!popupOverlay || !popup) {
        console.error("Popup not found!");
        return;
    }

    popup.style.display = "block";
    popupOverlay.style.display = "block";

    (document.querySelector("#popup-university span") as HTMLElement).textContent = offer.universityName;
    (document.querySelector("#popup-region span") as HTMLElement).textContent = offer.regionName;
    (document.querySelector("#popup-offer-name span") as HTMLElement).textContent = offer.name;
    (document.querySelector("#popup-major-name span") as HTMLElement).textContent = offer.major.majorName;
    (document.querySelector("#popup-education-program span") as HTMLElement).textContent = offer.educationalProgram;
    (document.querySelector("#popup-faculty span") as HTMLElement).textContent = offer.faculty;
    (document.querySelector("#popup-study-form span") as HTMLElement).textContent = educationFormLabels[offer.educationForm] || offer.educationForm;
    (document.querySelector("#popup-price span") as HTMLElement).textContent = String(offer.price);
    (document.querySelector("#popup-min-application-score span") as HTMLElement).textContent = String(offer.minApplicationScore);

    const setPlacesRow = (rowId: string, total: number, submitted: number, minScore: number): void => {
        const row = document.getElementById(rowId) as HTMLTableRowElement;
        row.children[1].textContent = String(total);
        row.children[2].textContent = String(submitted);
        row.children[3].textContent = String(minScore);
    };

    setPlacesRow("budget-row", offer.budgetPlaces, offer.budgetApplications, offer.minBudgetScore);
    setPlacesRow("quota1-row", offer.quota1Places, offer.quota1Applications, offer.minQuota1Score);
    setPlacesRow("quota2-row", offer.quota2Places, offer.quota2Applications, offer.minQuota2Score);
    setPlacesRow("contract-row", offer.contractPlaces, offer.contractApplications, offer.minContractScore);

    (document.querySelector("#popup-region-coef span") as HTMLElement).textContent = String(offer.regionCoef);
    (document.querySelector("#popup-major-coef span") as HTMLElement).textContent = String(offer.major.coef);

    const setMajorInfoRow = (rowId: string, coef: number, minScore: number) => {
        const row = document.getElementById(rowId) as HTMLTableRowElement;
        row.children[1].textContent = String(coef);
        row.children[2].textContent = String(minScore);
    };

    setMajorInfoRow("math-row", offer.major.mathCoef, offer.minMathScore);
    setMajorInfoRow("uk-lang-row", offer.major.ukLanguageCoef, offer.minUkLangScore);
    setMajorInfoRow("history-row", offer.major.historyCoef, offer.minHistoryScore);
    setMajorInfoRow("uk-lit-row", offer.major.ukLiteratureCoef, offer.minUkLitScore);
    setMajorInfoRow("foreign-lang-row", offer.major.foreignLangCoef, offer.minForeignLangScore);
    setMajorInfoRow("biology-row", offer.major.biologyCoef, offer.minBiologyScore);
    setMajorInfoRow("geography-row", offer.major.geographyCoef, offer.minGeographyScore);
    setMajorInfoRow("physics-row", offer.major.physicsCoef, offer.minPhysicsScore);
    setMajorInfoRow("chemistry-row", offer.major.chemistryCoef, offer.minChemistryScore);
    setMajorInfoRow("competition-row", offer.major.competitionCoef, offer.minCompetitionScore);
}