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