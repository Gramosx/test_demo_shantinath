import { TenderDates } from '../types/models';

export class DateCalculator {
    // Add business days to a date
    static addBusinessDays(date: Date, days: number, holidays: Date[] = []): Date {
        let currentDate = new Date(date);
        let addedDays = 0;

        while (addedDays < days) {
            currentDate.setDate(currentDate.getDate() + 1);

            // Skip weekends and holidays
            if (this.isBusinessDay(currentDate, holidays)) {
                addedDays++;
            }
        }

        return currentDate;
    }

    // Check if a date is a business day
    static isBusinessDay(date: Date, holidays: Date[] = []): boolean {
        const day = date.getDay();

        // Check if it's a weekend (0 = Sunday, 6 = Saturday)
        if (day === 0 || day === 6) {
            return false;
        }

        // Check if it's a holiday
        return !holidays.some(holiday =>
            holiday.getFullYear() === date.getFullYear() &&
            holiday.getMonth() === date.getMonth() &&
            holiday.getDate() === date.getDate()
        );
    }

    // Calculate all related dates based on creation date
    static calculateTenderDates(creationDate: Date, holidays: Date[] = []): TenderDates {
        const sendForQuote = this.addBusinessDays(creationDate, 3, holidays);
        const priceDiscussion = this.addBusinessDays(creationDate, 5, holidays);
        const quoteApproval = this.addBusinessDays(creationDate, 10, holidays);
        const submission = this.addBusinessDays(creationDate, 15, holidays);
        const reference = this.addBusinessDays(submission, 2, holidays);

        return {
            creation: creationDate,
            sendForQuote,
            priceDiscussion,
            quoteApproval,
            submission,
            reference
        };
    }

    // Format date to display in 12-hour format
    static formatDate(date: Date): string {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}
