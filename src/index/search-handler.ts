import {educationFormLabels, Major, Offer, Region, University} from "../common/types.js";
import {renderOffersResponses} from "./offer-renderer.js";


const regionInput = document.getElementById("region-field") as HTMLInputElement;
const universityInput = document.getElementById("university-field") as HTMLInputElement;
const majorInput = document.getElementById("major-field") as HTMLInputElement;
const educationFormInput = document.getElementById("education-form") as HTMLSelectElement;

const regionList = document.getElementById("regions") as HTMLDataListElement;
const universityList = document.getElementById("universities") as HTMLDataListElement;
const majorList = document.getElementById("majors") as HTMLDataListElement;

const searchButton = document.getElementById("search-button") as HTMLButtonElement;

searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    loadOffers();
})

regionInput.addEventListener("change", () => {
    const selectedOption = Array.from(regionList.options).find(
        (option) => option.value === regionInput.value.trim()
    );

    if (selectedOption) {
        universityInput.value = "";
        const regionName = selectedOption.value;
        if (regionName) loadUniversities(regionName);
    }
    else
        loadUniversities();
});

export function loadData(): void {
    loadMajors();
    loadRegions();
    loadUniversities();
    loadEducationForms();
}

function loadEducationForms(): void {
    fetch("http://localhost:8080/offers/education-form")
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then((data: string[]) => {
            educationFormInput.replaceChildren();

            const optionAll = document.createElement("option");
            optionAll.value = "All";
            optionAll.textContent = "Усі";
            educationFormInput.appendChild(optionAll);

            data.forEach(form => {
                const option = document.createElement("option");
                option.value = form;
                option.textContent = educationFormLabels[form] || form;
                educationFormInput.appendChild(option);
            });
        })
        .catch((error: Error) => console.error("Error loading education forms:", error))
}

function getSelectedId(
    options: ArrayLike<HTMLOptionElement>,
    input: HTMLInputElement
): number | null {
    const option = Array.from(options).find(o => o.value === input.value.trim());
    return option?.dataset.id ? Number(option.dataset.id) : null;
}

function loadOffers(): void {
    const majorId = getSelectedId(majorList.options, majorInput);
    const regionId = getSelectedId(regionList.options, regionInput);
    const universityId = getSelectedId(universityList.options, universityInput);
    const educationForm = educationFormInput.value == "All" ? null : educationFormInput.value;

    const params = new URLSearchParams();

    if (majorId) params.append("majorId", String(majorId));
    if (regionId) params.append("regionId", String(regionId));
    if (universityId) params.append("universityId", String(universityId));
    if (educationForm) params.append("educationForm", educationForm);

    fetch(`http://localhost:8080/offers/filter?${params.toString()}`)
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then((data: any[]) => {
            const offers: Offer[] = data;
            renderOffersResponses(offers);
        })
        .catch((error: Error) => console.error("Error loading Offers:", error))
}

function loadMajors(): void {
    fetch('http://localhost:8080/majors')
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
    .then((data: Major[]) => {
        majorList.replaceChildren();
        data.forEach(major =>{
            const option = document.createElement("option");
            option.value = major.majorCode;
            option.textContent = major.majorName;
            option.dataset.id = String(major.id);
            majorList.appendChild(option);
        });
    })
    .catch((error: Error) => console.error("Error loading majors:", error))
}

function loadRegions(): void {
    fetch('http://localhost:8080/regions')
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then((data: Region[]) => {
            regionList.replaceChildren();
            data.forEach(region => {
                const option = document.createElement("option");
                option.value = region.region;
                option.dataset.id = String(region.id);
                regionList.appendChild(option);
            });
        })
        .catch((error: Error) => console.error("Error loading regions:", error));
}

function loadUniversities(regionId: string = ""): void {
    fetch(`http://localhost:8080/universities?city=${regionId}`)
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then((data: University[]) => {
            universityList.replaceChildren();
            data.forEach(university => {
                const option = document.createElement("option");
                option.value = university.universityName;
                option.dataset.id = String(university.id);
                universityList.appendChild(option);
            });
        })
        .catch((error: Error ) => console.error("Error loading universities:", error));
}
