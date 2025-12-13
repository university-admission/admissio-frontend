import {TrackedOffers} from "../common/types.js";
import {removeFromTrackedOffers} from "./tracking-handler.js";
import {applicationType} from "./tracked-offers.js";

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
    allPlaceText.innerText = "Ваше місце (актуальні пропозиції): ";
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
        toggleTrack(offer, event.currentTarget as HTMLButtonElement);
    });
    offerElement.appendChild(trackBtn);

    offerElement.addEventListener("click", (event: Event): void => {
        event.stopPropagation();
        //renderOfferFullInfo(offer);
    })

    return offerElement;
}

function toggleTrack(offer: TrackedOffers, button: HTMLButtonElement): void {
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