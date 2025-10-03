export function addToTrackedOffers(offerId: string): void {
    const trackedOffers = getTrackedOffers();
    trackedOffers.push(offerId);
    localStorage.setItem('trackedOffers', JSON.stringify(trackedOffers));
}

export function getTrackedOffers(): string[] {
    const trackedOffers = localStorage.getItem("trackedOffers");
    return trackedOffers ? JSON.parse(trackedOffers) : [];
}

export function removeFromTrackedOffers(offerId: string): void {
    const trackedOffers = getTrackedOffers();
    trackedOffers.splice(trackedOffers.indexOf(offerId), 1);
    localStorage.setItem("trackedOffers", JSON.stringify(trackedOffers));
}

export function isTracked(offerId: string): boolean {
    const trackedOffers = getTrackedOffers();
    return trackedOffers.indexOf(offerId) > -1;
}