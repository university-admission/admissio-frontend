import { uploadFile } from "../common/api-client.js";
import { ENDPOINTS } from "../common/config.js";
import { showToast } from "../common/toast.js";
import { StorageService } from "../common/local-store-handler.js"

export function initUploadPage(): void {
    if (!StorageService.isLoggedIn()) {
        window.location.replace("./login.html");
        return;
    }

    const studentsForm = document.getElementById("upload-students-form") as HTMLFormElement;
    const appsForm = document.getElementById("upload-applications-form") as HTMLFormElement;

    if (studentsForm) {
        setupUploadHandler(studentsForm, ENDPOINTS.UPLOAD_STUDENTS, "Базу студентів оновлено!");
    }

    if (appsForm) {
        setupUploadHandler(appsForm, ENDPOINTS.UPLOAD_APPLICATIONS, "Базу заяв оновлено!");
    }

    document.getElementById("logout-btn")?.addEventListener("click", (e) => {
        e.preventDefault();
        StorageService.logout();
        window.location.replace("./");
    });
}

function setupUploadHandler(form: HTMLFormElement, endpoint: string, successMsg: string) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
        const file = fileInput.files?.[0];

        if (!file) {
            showToast("Будь ласка, оберіть файл", "error");
            return;
        }

        if (!file.name.endsWith(".csv")) {
            showToast("Дозволено лише CSV файли", "error");
            return;
        }

        const submitBtn = form.querySelector('button') as HTMLButtonElement;
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Завантаження...";

            await uploadFile(endpoint, file);
            showToast(successMsg);
            form.reset();
        } catch (error: any) {
            console.error("Upload error:", error);
            showToast(error.message || "Помилка сервера", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}