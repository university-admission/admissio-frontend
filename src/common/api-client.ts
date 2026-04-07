import {StorageService} from "./local-store-handler.js";

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers || {});

    if (StorageService.isLoggedIn()) {
        headers.set("Authorization", `Bearer ${StorageService.getToken()}`);
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        if (url.includes("/login")) {
            return response;
        }

        StorageService.logout();
        window.location.replace("./login.html");
        throw new Error("Термін дії сесії закінчився. Будь ласка, увійдіть знову.");
    }

    return response;
}

export async function get<T>(url: string): Promise<T> {
    const response = await fetchWithAuth(url);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
}

export async function post<T>(url: string, data: any): Promise<T> {
    const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
}

export async function uploadFile(url: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchWithAuth(url, {
        method: "POST",
        body: formData
    });

    const result = await response.text();

    if (!response.ok) {
        throw new Error(result || "Помилка при завантаженні файлу");
    }

    return result;
}