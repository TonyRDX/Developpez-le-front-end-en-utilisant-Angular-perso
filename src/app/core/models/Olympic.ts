/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/

import type { Participation } from "./Participation";

export interface Olympic {
    id: number;
    country: string;
    participations: Participation[];
}
