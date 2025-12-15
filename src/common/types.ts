export interface Region {
    id: number;
    region: string;
}

export class University {
    constructor(public id:number, public universityName: string, public universityCode: number) {
        this.id = id;
        this.universityName = universityName;
        this.universityCode = universityCode;
    }
}

export interface Major{
    id:number;
    majorName: string;
    majorCode: string;
    ukLanguageCoef: number;
    mathCoef: number;
    historyCoef: number;
    ukLiteratureCoef: number;
    foreignLangCoef: number;
    biologyCoef: number;
    geographyCoef: number;
    physicsCoef: number;
    chemistryCoef: number;
    competitionCoef: number;
    coef : number;
}

export interface Offer{
    id: number;
    edboId: number;
    major: Major;
    universityName: string;
    regionName: string;
    name: string;
    faculty: string;
    educationalProgram: string;
    price: number;
    educationForm: string;
    budgetPlaces: number;
    budgetApplications: number;
    budgetPlacesCount: number;
    minBudgetScore: number;
    contractPlaces: number;
    contractApplications: number;
    contractPlacesCount: number;
    minContractScore: number;
    quota1Places: number;
    quota1Applications: number;
    quota1PlacesCount: number;
    minQuota1Score: number;
    quota2Places: number;
    quota2Applications: number;
    quota2PlacesCount: number;
    minQuota2Score: number;
    minUkLangScore: number;
    minMathScore: number;
    minHistoryScore: number;
    minUkLitScore: number;
    minForeignLangScore: number;
    minBiologyScore: number;
    minGeographyScore: number;
    minPhysicsScore: number;
    minChemistryScore: number;
    minCompetitionScore: number;
    minApplicationScore: number;
    additionalPoints: number;
    regionCoef: number;
}

export const educationFormLabels: Record<string, string> = {
    "FULL_TIME": "Денна форма",
    "PART_TIME": "Заочна форма",
    "EVENING": "Вечірня форма",
    "DISTANCE": "Дистанційна форма",
};

export interface TrackedOffers{
    offerId: number;
    universityName: string;
    majorName: string;
    offerName: string;
    facultyName: string;
    educationForm: string;
    userScore: number;
    rankActual: number;
    rankAll: number;
    places: number;
}

export interface Application{
    studentId: number;
    studentName: string;
    score: number;
    priority: number;
    isActual: boolean;
    isCounted: boolean;
}