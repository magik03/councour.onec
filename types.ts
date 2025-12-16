export interface Team {
    name: string;
    logo: string;
}

export interface Match {
    id?: string;
    league: string;
    round: string;
    home: string;
    away: string;
    homeLogo: string;
    awayLogo: string;
    scoreH: number;
    scoreA: number;
    scorersH: string;
    scorersA: string;
    status: string;
    time: number;
    isRunning: boolean;
    lastStartTime: number | null;
}

export interface LeagueData {
    [key: string]: Team[];
}

export type ImageSize = "1K" | "2K" | "4K";