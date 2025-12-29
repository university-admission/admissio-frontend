export const API_BASE_URL = "http://localhost:8080"
export const ENDPOINTS = {
    OFFERS: `${API_BASE_URL}/offers`,
    FILTERED_OFFERS: `${API_BASE_URL}/offers/filter`,
    TRACKED_OFFERS: `${API_BASE_URL}/offers/tracked`,
    EDUCATION_FORM: `${API_BASE_URL}/offers/education-form`,

    APPLICATIONS: `${API_BASE_URL}/applications`,
    STUDENT_APPLICATIONS: `${API_BASE_URL}/applications/student`,

    REGIONS: `${API_BASE_URL}/regions`,

    MAJORS: `${API_BASE_URL}/majors`,

    UNIVERSITIES: `${API_BASE_URL}/universities`,
} as const;