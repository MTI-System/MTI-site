import { BadgeInterface } from "./TournamentsAPI";

export interface CardInterface {
    id: number,
    title: string,
    main_image: string,
    logo_image: string,
    badge: BadgeInterface
}