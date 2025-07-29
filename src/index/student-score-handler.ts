
const button = document.getElementById("score-button") as HTMLButtonElement;
const form = document.getElementById("scores-form") as HTMLFormElement;
button.addEventListener("click", () => {
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    saveStudentScore();
} )

const mathField = document.getElementById("math-field") as HTMLInputElement;
const ukLangField = document.getElementById("uk-lang-field") as HTMLInputElement;
const historyField = document.getElementById("history-field") as HTMLInputElement;
const electiveSubjectSelect = document.getElementById("elective-subject-select") as HTMLSelectElement;
const electiveSubjectField = document.getElementById("elective-subject-field") as HTMLInputElement;
const competitionField = document.getElementById("competition-field") as HTMLInputElement;
const admissionType = document.getElementById("admission-type") as HTMLSelectElement;

function saveStudentScore() : void {
    localStorage.setItem('math-score', mathField.value);
    localStorage.setItem('uk-lang-score', ukLangField.value);
    localStorage.setItem('history-score', historyField.value);
    localStorage.setItem('elective-subject', electiveSubjectSelect.value);
    localStorage.setItem('elective-subject-score', electiveSubjectField.value);
    localStorage.setItem('competition-score', competitionField.value);
    localStorage.setItem('admission-type', admissionType.value);
    showToast("Оцінки збережено!")
}

export function loadStudentScore() : void {
    mathField.value = localStorage.getItem("math-score") ?? "";
    ukLangField.value = localStorage.getItem("uk-lang-score") ?? "";
    historyField.value = localStorage.getItem("history-score") ?? "";
    electiveSubjectSelect.value = localStorage.getItem("elective-subject") ?? electiveSubjectSelect.options[0].value;
    electiveSubjectField.value = localStorage.getItem("elective-subject-score") ?? "";
    competitionField.value = localStorage.getItem("competition-score") ?? "";
    admissionType.value = localStorage.getItem("admission-type") ?? admissionType.options[0].value;
}

function showToast(message: string): void {
    const toast = document.getElementById("toast") as HTMLDivElement;
    const messageSpan = document.getElementById("toast-message") as HTMLSpanElement;

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
