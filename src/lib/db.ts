// db.ts
import Dexie, { type Table } from "dexie";

export interface OrderItem {
  id: number;
  name: string;
  photo: string;
  audio: string;
  cold: boolean;
}

export class MySubClassedDexie extends Dexie {
  OrderItems!: Table<OrderItem>;

  constructor() {
    super("myDatabase");
    this.version(2).stores({
      OrderItems: "++id, &name", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
