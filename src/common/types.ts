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
                public majorCoef : number) {
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
        this.majorCoef = majorCoef;
    }
}