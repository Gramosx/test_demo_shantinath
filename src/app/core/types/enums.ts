export enum UserRole {
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
    USER = 'USER'
}

export enum TenderType {
    GEM = 'GEM',
    EPROC = 'EPROC'
}

export enum TenderTOC {
    PRIORITY = 'PRIORITY',
    CLEAR = 'CLEAR'
}

export enum TenderStatus {
    DRAFT = 'DRAFT',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum TenderStage {
    CREATION = 'CREATION',
    PRICE_DISCUSSION = 'PRICE_DISCUSSION',
    QUOTE_APPROVAL = 'QUOTE_APPROVAL',
    SUBMIT = 'SUBMIT'
}

export enum HolidayType {
    NATIONAL = 'NATIONAL',
    REGIONAL = 'REGIONAL',
    CUSTOM = 'CUSTOM'
}
