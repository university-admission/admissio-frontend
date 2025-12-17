import {educationFormLabels, Major, Offer, Region, University} from "../common/types.js";
import {renderOffersResponses} from "./offer-renderer.js";
import {get} from "../common/api-client.js";
import {ENDPOINTS} from "../common/config.js";


const regionInput = document.getElementById("region-field") as HTMLInputElement;
const universityInput = document.getElementById("university-field") as HTMLInputElement;
const majorInput = document.getElementById("major-field") as HTMLInputElement;
const educationFormInput = document.getElementById("education-form") as HTMLSelectElement;

const regionList = document.getElementById("regions") as HTMLDataListElement;
const universityList = document.getElementById("universities") as HTMLDataListElement;
const majorList = document.getElementById("majors") as HTMLDataListElement;

const searchButton = document.getElementById("search-button") as HTMLButtonElement;

searchButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await loadOffers();
})

regionInput.addEventListener("change", async () => {
    const selectedOption = Array.from(regionList.options).find(
        (option) => option.value === regionInput.value.trim()
    );

    if (selectedOption) {
        universityInput.value = "";
        const regionName = selectedOption.value;
        if (regionName) await loadUniversities(regionName);
    }
    else
        await loadUniversities();
});

export async function loadData(): Promise<void> {
    await loadMajors();
    await loadRegions();
    await loadUniversities();
    await loadEducationForms();
}

async function loadEducationForms(): Promise<void> {
    try {
        const educationForms = await get<string[]>(ENDPOINTS.EDUCATION_FORM);

        educationFormInput.replaceChildren();

        const optionAll = document.createElement("option");
        optionAll.value = "All";
        optionAll.textContent = "Усі";
        educationFormInput.appendChild(optionAll);

        educationForms.forEach(form => {
            const option = document.createElement("option");
            option.value = form;
            option.textContent = educationFormLabels[form] || form;
            educationFormInput.appendChild(option);
        });
    }
    catch (error) {
        console.error("Error loading education forms:", error);
    }
}

function getSelectedId(
    options: ArrayLike<HTMLOptionElement>,
    input: HTMLInputElement
): number | null {
    const option = Array.from(options).find(o => o.value === input.value.trim());
    return option?.dataset.id ? Number(option.dataset.id) : null;
}

async function loadOffers(): Promise<void> {
    const majorId = getSelectedId(majorList.options, majorInput);
    const regionId = getSelectedId(regionList.options, regionInput);
    const universityId = getSelectedId(universityList.options, universityInput);
    const educationForm = educationFormInput.value == "All" ? null : educationFormInput.value;

    const params = new URLSearchParams();

    if (majorId) params.append("majorId", String(majorId));
    if (regionId) params.append("regionId", String(regionId));
    if (universityId) params.append("universityId", String(universityId));
    if (educationForm) params.append("educationForm", educationForm);

    try {
        const offers = await get<Offer[]>(ENDPOINTS.FILTERED_OFFERS + `?${params.toString()}`);
        renderOffersResponses(offers);
    }
    catch (error) {
        console.error("Error loading Offers:", error);
    }
}

async function loadMajors(): Promise<void> {
    try {
        const majors = await get<Major[]>(ENDPOINTS.MAJORS);
        majorList.replaceChildren();
        majors.forEach(major =>{
            const option = document.createElement("option");
            option.value = major.majorCode;
            option.textContent = major.majorName;
            option.dataset.id = String(major.id);
            majorList.appendChild(option);
        });
    }
    catch (error) {
        console.error("Error loading majors:", error);
    }
}

async function loadRegions(): Promise<void> {
    try {
        const regions = await get<Region[]>(ENDPOINTS.REGIONS);
        regionList.replaceChildren();
        regions.forEach(region => {
            const option = document.createElement("option");
            option.value = region.region;
            option.dataset.id = String(region.id);
            regionList.appendChild(option);
        });
    }
    catch (error) {
        console.error("Error loading regions:", error);
    }
}

async function loadUniversities(regionId: string = ""): Promise<void> {
    try {
        const universities = await get<University[]>(ENDPOINTS.UNIVERSITIES + "?" + regionId);
        universityList.replaceChildren();
        universities.forEach(university => {
            const option = document.createElement("option");
            option.value = university.universityName;
            option.dataset.id = String(university.id);
            universityList.appendChild(option);
        });
    }
    catch (error) {
        console.error("Error loading universities:", error);
    }
}