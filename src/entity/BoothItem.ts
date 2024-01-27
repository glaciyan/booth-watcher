import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("booth_item")
export class BoothItem {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}