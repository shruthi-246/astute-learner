import type { ClassGroup } from "@/types/academic";

export const classGroups: readonly ClassGroup[] = [
  {
    id: "cls-cse-a",
    name: "CSE — Section A",
    program: "B.Tech Computer Science",
    semester: 5,
    advisorId: "t-01",
    room: "Block A · 204",
    courseIds: ["c-dbms", "c-dsa", "c-maths", "c-datasci"],
  },
  {
    id: "cls-cse-b",
    name: "CSE — Section B",
    program: "B.Tech Computer Science",
    semester: 5,
    advisorId: "t-03",
    room: "Block B · 310",
    courseIds: ["c-dbms", "c-dsa", "c-maths", "c-techmgmt"],
  },
  {
    id: "cls-ds-a",
    name: "Data Science — Section A",
    program: "B.Tech Data Science",
    semester: 3,
    advisorId: "t-02",
    room: "Block C · 101",
    courseIds: ["c-datasci", "c-dbms", "c-maths", "c-techmgmt"],
  },
  {
    id: "cls-ece-a",
    name: "ECE — Section A",
    program: "B.Tech Electronics",
    semester: 5,
    advisorId: "t-05",
    room: "Block D · 006",
    courseIds: ["c-electronics", "c-dsa", "c-maths", "c-techmgmt"],
  },
];
