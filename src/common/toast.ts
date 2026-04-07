export function showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const toast = document.getElementById("toast");
    const messageSpan = document.getElementById("toast-message");
    const iconSpan = document.getElementById("toast-icon");

    if (!toast || !messageSpan) return;

    messageSpan.textContent = message;

    if (type === 'error') {
        toast.style.backgroundColor = "var(--impassable-text)";
        if (iconSpan) iconSpan.textContent = "✖";
    } else {
        toast.style.backgroundColor = "#4caf50";
        if (iconSpan) iconSpan.textContent = "✔";
    }

    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 400);
    }, 3000);
}