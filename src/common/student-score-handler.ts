export const STORAGE_KEYS = {
    MATH: 'math-score',
    UK_LANG: 'uk-lang-score',
    HISTORY: 'history-score',
    ELECTIVE_SUBJ: 'elective-subject',
    ELECTIVE_SCORE: 'elective-subject-score',
    COMPETITION: 'competition-score',
    ADMISSION_TYPE: 'admission-type',
    TRACKED_OFFERS: 'trackedOffers'
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
    }
};