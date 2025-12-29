import {StorageService, STORAGE_KEYS} from "../common/student-score-handler.js"

let mathField: HTMLInputElement;
let ukLangField: HTMLInputElement;
let historyField: HTMLInputElement;
let electiveSubjectSelect: HTMLSelectElement;
let electiveSubjectField: HTMLInputElement;
let competitionField: HTMLInputElement;
let admissionType: HTMLSelectElement;

export function initScoreForm(): void {
    const button = document.getElementById("score-button") as HTMLButtonElement;
    const form = document.getElementById("scores-form") as HTMLFormElement;

    if (!button || !form) {
        console.log("Missing score form or button!");
        return;
    }

    button.addEventListener("click", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        saveStudentScore();
    });

    getFields();
    loadStudentScore();
}

function getFields(): void{
    mathField = document.getElementById("math-field") as HTMLInputElement;
    ukLangField = document.getElementById("uk-lang-field") as HTMLInputElement;
    historyField = document.getElementById("history-field") as HTMLInputElement;
    electiveSubjectSelect = document.getElementById("elective-subject-select") as HTMLSelectElement;
    electiveSubjectField = document.getElementById("elective-subject-field") as HTMLInputElement;
    competitionField = document.getElementById("competition-field") as HTMLInputElement;
    admissionType = document.getElementById("admission-type") as HTMLSelectElement;
}

function validateFields(): boolean {
    return (mathField && ukLangField && historyField && electiveSubjectSelect && electiveSubjectField && competitionField && admissionType != null);
}

function saveStudentScore() : void {
    if (!validateFields()) {
        console.log("Missing required fields!");
        return;
    }

    StorageService.set(STORAGE_KEYS.MATH, Number(mathField.value));
    StorageService.set(STORAGE_KEYS.UK_LANG, Number(ukLangField.value));
    StorageService.set(STORAGE_KEYS.HISTORY, Number(historyField.value));
    StorageService.set(STORAGE_KEYS.ELECTIVE_SUBJ, electiveSubjectSelect.value);
    StorageService.set(STORAGE_KEYS.ELECTIVE_SCORE, Number(electiveSubjectField.value));
    StorageService.set(STORAGE_KEYS.COMPETITION, Number(competitionField.value));
    StorageService.set(STORAGE_KEYS.ADMISSION_TYPE, admissionType.value);
    showToast("Оцінки збережено!")
}

export function loadStudentScore() : void {
    if (!validateFields()) {
        console.log("Missing required fields!");
        return;
    }

    mathField.value = StorageService.getString(STORAGE_KEYS.MATH);
    ukLangField.value = StorageService.getString(STORAGE_KEYS.UK_LANG)
    historyField.value = StorageService.getString(STORAGE_KEYS.HISTORY)
    electiveSubjectSelect.value = StorageService.getString(STORAGE_KEYS.ELECTIVE_SUBJ) ?? electiveSubjectSelect.options[0].value;
    electiveSubjectField.value = StorageService.getString(STORAGE_KEYS.ELECTIVE_SCORE);
    competitionField.value = StorageService.getString(STORAGE_KEYS.COMPETITION);
    admissionType.value = StorageService.getString(STORAGE_KEYS.ADMISSION_TYPE) ?? admissionType.options[0].value;
}

function showToast(message: string): void {
    const toast = document.getElementById("toast") as HTMLDivElement;
    const messageSpan = document.getElementById("toast-message") as HTMLSpanElement;

    if (!toast || !messageSpan) {
        console.log("Missing required toast message!");
        return;
    }

    messageSpan.textContent = message;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 400);
    }, 2500);
}
