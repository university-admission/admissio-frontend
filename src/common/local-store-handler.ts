export const STORAGE_KEYS = {
    MATH: 'math-score',
    UK_LANG: 'uk-lang-score',
    HISTORY: 'history-score',
    ELECTIVE_SUBJ: 'elective-subject',
    ELECTIVE_SCORE: 'elective-subject-score',
    COMPETITION: 'competition-score',
    ADMISSION_TYPE: 'admission-type',
    TRACKED_OFFERS: 'trackedOffers',

    AUTH_TOKEN: 'auth-token',
    USERNAME: 'auth-username'
} as const;

export const StorageService = {
    getNumber(key: string): number {
        return Number(localStorage.getItem(key)) || 0;
    },

    getString(key: string): string {
        return localStorage.getItem(key) || "";
    },

    set(key: string, value: string | number): void {
        localStorage.setItem(key, String(value));
    },

    getTrackedOffers(): number[] {
        const raw = localStorage.getItem(STORAGE_KEYS.TRACKED_OFFERS);
        return raw ? JSON.parse(raw).map(Number) : [];
    },

    addToTracked(id: number): void {
        const list = this.getTrackedOffers();
        if (!list.includes(id)) {
            list.push(id);
            localStorage.setItem(STORAGE_KEYS.TRACKED_OFFERS, JSON.stringify(list));
        }
    },

    removeFromTracked(id: number): void {
        const list = this.getTrackedOffers();
        const newList = list.filter(item => item !== id);
        localStorage.setItem(STORAGE_KEYS.TRACKED_OFFERS, JSON.stringify(newList));
    },

    isTracked(offerId: number): boolean {
        const trackedOffers = this.getTrackedOffers();
        return trackedOffers.includes(offerId);
    },

    setToken(token: string): void { localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token); },

    getToken(): string { return this.getString(STORAGE_KEYS.AUTH_TOKEN); },

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryDate = payload.exp * 1000;

            if (Date.now() >= expiryDate) {
                this.logout();
                return false;
            }
            return true;
        } catch (e) {
            this.logout();
            return false;
        }
    },

    logout(): void {
        localStorage.removeItem(STORAGE_KEYS.USERNAME);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    },
};