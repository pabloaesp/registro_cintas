export class BackupRegister {
    constructor(
        public _id: string,
        public user: string,
        public backup: string,
        public tape: string,
        public note: string,
        public start_date: string,
        public end_date: string,
        public status: string
    ){}
}