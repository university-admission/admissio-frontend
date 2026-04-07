import { StorageService } from "../common/local-store-handler.js"
import { post } from "../common/api-client.js";
import { ENDPOINTS } from "../common/config.js";
import type { JwtResponse } from "../common/types.js";
import {showToast} from "../common/toast.js";

export function initLoginPage(): void {
    const loginForm = document.getElementById("login-form") as HTMLFormElement;

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const loginRequest = Object.fromEntries(formData.entries());

        try {
            const response = await post<JwtResponse>(ENDPOINTS.LOGIN, loginRequest);

            if (response && response.token) {
                StorageService.setToken(response.token);

                window.location.replace("./upload.html");
            }
        } catch (error) {
            console.error("Login failed:", error);
            showToast("Невірний логін або пароль", "error");
        }
    });
}