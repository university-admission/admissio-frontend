export class Region {
    constructor(public id: number, public region: string) {
        this.id = id;
        this.region = region;
    }
}

export class University {
    constructor(public id:number, public universityName: string, public universityCode: number) {
        this.id = id;
        this.universityName = universityName;
        this.universityCode = universityCode;
    }
}

export class Major{
    constructor(public id:number, public majorName: string, public majorCode: string,
                public ukLanguageCoef: number, public mathCoef: number,
                public historyCoef: number, public ukLiteratureCoef: number,
                public foreignLangCoef: number, public biologyCoef: number,
                public geographyCoef: number, public physicsCoef: number,
                public chemistryCoef: number, public competitionCoef: number,
                public coef : number) {
        this.id = id;
        this.majorName = majorName;
        this.majorCode = majorCode;
        this.ukLanguageCoef = ukLanguageCoef;
        this.mathCoef = mathCoef;
        this.historyCoef = historyCoef;
        this.ukLiteratureCoef = ukLiteratureCoef;
        this.foreignLangCoef = foreignLangCoef;
        this.biologyCoef = biologyCoef;
        this.geographyCoef = geographyCoef;
        this.physicsCoef = physicsCoef;
        this.chemistryCoef = chemistryCoef;
        this.competitionCoef = competitionCoef;
        this.coef = coef;
    }
}

function mapMajor(raw: any): Major {
    return Object.assign(new Major(0, "", "", 0,0,0,0,0,0,0,0,0,0,0), raw);
}

export class Offer{
    constructor(public id: number, public edboId: number,
                public major: Major, public universityName: string, public regionName: string,
                public name: string, public faculty: string,
                public educationalProgram: string, public price: number,
                public educationForm: string, public budgetPlaces: number, public budgetApplications: number,
                public budgetPlacesCount: number, public minBudgetScore: number,
                public contractPlaces: number, public contractApplications: number, public contractPlacesCount: number,
                public minContractScore: number, public quota1Places: number, public quota1Applications: number,
                public quota1PlacesCount: number, public minQuota1Score: number,
                public quota2Places: number, public quota2Applications: number, public quota2PlacesCount: number,
                public minQuota2Score: number, public minUkLangScore: number,
                public minMathScore: number, public minHistoryScore: number,
                public minUkLitScore: number, public minForeignLangScore: number,
                public minBiologyScore: number, public minGeographyScore: number,
                public minPhysicsScore: number, public minChemistryScore: number,
                public minCompetitionScore: number, public minApplicationScore: number,
                public additionalPoints: number, public regionCoef: number) {
        this.id = id;
        this.edboId = edboId;
        this.major = major;
        this.universityName = universityName;
        this.regionName = regionName;
        this.name = name;
        this.faculty = faculty;
        this.educationalProgram = educationalProgram;
        this.price = price;
        this.educationForm = educationForm;
        this.budgetPlaces = budgetPlaces;
        this.budgetApplications = budgetApplications;
        this.budgetPlacesCount = budgetPlacesCount;
        this.minBudgetScore = minBudgetScore;
        this.contractPlaces = contractPlaces;
        this.contractApplications = contractApplications;
        this.contractPlacesCount = contractPlacesCount;
        this.minContractScore = minContractScore;
        this.quota1Places = quota1Places;
        this.quota1Applications = quota1Applications;
        this.quota1PlacesCount = quota1PlacesCount;
        this.minQuota1Score = minQuota1Score;
        this.quota2Places = quota2Places;
        this.quota2Applications = quota2Applications;
        this.quota2PlacesCount = quota2PlacesCount;
        this.minQuota2Score = minQuota2Score;
        this.minUkLangScore = minUkLangScore;
        this.minMathScore = minMathScore;
        this.minHistoryScore = minHistoryScore;
        this.minUkLitScore = minUkLitScore;
        this.minForeignLangScore = minForeignLangScore;
        this.minBiologyScore = minBiologyScore;
        this.minGeographyScore = minGeographyScore;
        this.minPhysicsScore = minPhysicsScore;
        this.minChemistryScore = minChemistryScore;
        this.minCompetitionScore = minCompetitionScore;
        this.minApplicationScore = minApplicationScore;
        this.additionalPoints = additionalPoints;
        this.regionCoef = regionCoef;
    }
}

export function mapOffer(raw: any): Offer {
    return Object.assign(new Offer(0, 0, new Major(0,"","",0,0,0,0,0,0,0,0,0,0,0), "", "", "", "", "", 0, "",0, 0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 0), raw, {
        major: mapMajor(raw.major)
    });
}

export const educationFormLabels: Record<string, string> = {
    "FULL_TIME": "Денна форма",
    "PART_TIME": "Заочна форма",
    "EVENING": "Вечірня форма",
    "DISTANCE": "Дистанційна форма",
};