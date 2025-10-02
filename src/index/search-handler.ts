import {Major, Region, University} from "../common/types.js";

const regionInput = document.getElementById("region-field") as HTMLInputElement;
const universityInput = document.getElementById("university-field") as HTMLInputElement;
const regionsList = document.getElementById("regions") as HTMLDataListElement;
const universityList = document.getElementById("universities") as HTMLDataListElement;
const majorList = document.getElementById("majors") as HTMLDataListElement;

regionInput.addEventListener("change", () => {
    const selectedOption = Array.from(regionsList.options).find(
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
    loadMajor();
    loadRegions();
    loadUniversities();
}

function loadMajor(): void {
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
            regionsList.replaceChildren();
            data.forEach(region => {
                const option = document.createElement("option");
                option.value = region.region;
                option.dataset.id = String(region.id);
                regionsList.appendChild(option);
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
