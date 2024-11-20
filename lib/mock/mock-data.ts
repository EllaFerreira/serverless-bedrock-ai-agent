type Ticket = {
  id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  category: string;
};

type Patient = {
  id: number;
  code: string;
  name: string;
};

type Order = {
  id: number;
  code: string;
  patient_id: number;
};

export const tickets: Ticket[] = [
  {
    id: "1",
    code: "109",
    title: "Ticket 109",
    description: "This is ticket 109",
    status: "open",
    category: "technical",
  },
  {
    id: "2",
    code: "110",
    title: "Ticket 110",
    description: "This is ticket 110",
    status: "open",
    category: "technical",
  },
  {
    id: "3",
    code: "111",
    title: "Ticket 111",
    description: "This is ticket 111",
    status: "open",
    category: "technical",
  },
  {
    id: "4",
    code: "112",
    title: "Ticket 112",
    description: "This is ticket 112",
    status: "open",
    category: "technical",
  },
  {
    id: "5",
    code: "113",
    title: "Ticket 113",
    description: "This is ticket 113",
    status: "open",
    category: "technical",
  },
  {
    id: "6",
    code: "114",
    title: "Ticket 114",
    description: "This is ticket 114",
    status: "open",
    category: "technical",
  },
  {
    id: "7",
    code: "115",
    title: "Ticket 115",
    description: "This is ticket 115",
    status: "open",
    category: "technical",
  },
  {
    id: "8",
    code: "116",
    title: "Ticket 116",
    description: "This is ticket 116",
    status: "open",
    category: "technical",
  },
  {
    id: "9",
    code: "117",
    title: "Ticket 117",
    description: "This is ticket 117",
    status: "open",
    category: "technical",
  },
  {
    id: "10",
    code: "118",
    title: "Ticket 118",
    description: "This is ticket 118",
    status: "open",
    category: "technical",
  },
  {
    id: "11",
    code: "119",
    title: "Ticket 119",
    description: "This is ticket 119",
    status: "open",
    category: "technical",
  }
];
export const patients: Patient[] = [
  {
    id: 1,
    code: "P001",
    name: "John Doe",
  },
  {
    id: 2,
    code: "P002",
    name: "Jane Doe",
  },
  {
    id: 3,
    code: "P003",
    name: "John Smith",
  },
  {
    id: 4,
    code: "P004",
    name: "Jane Smith",
  },
  {
    id: 5,
    code: "P005",
    name: "John Brown",
  },
  {
    id: 6,
    code: "P006",
    name: "Jane Brown",
  },
  {
    id: 7,
    code: "P007",
    name: "John White",
  },
  {
    id: 8,
    code: "P008",
    name: "Jane White",
  },
  {
    id: 9,
    code: "P009",
    name: "John Green",
  },
  {
    id: 10,
    code: "P010",
    name: "Jane"
  }
];
export const orders: Order[] = [
  {
    id: 1,
    code: "O001",
    patient_id: 1,
  },
  {
    id: 2,
    code: "O002",
    patient_id: 2,
  },
  {
    id: 3,
    code: "O003",
    patient_id: 3,
  },
  {
    id: 4,
    code: "O004",
    patient_id: 4,
  },
  {
    id: 5,
    code: "O005",
    patient_id: 5,
  },
  {
    id: 6,
    code: "O006",
    patient_id: 6,
  },
  {
    id: 7,
    code: "O007",
    patient_id: 7,
  },
  {
    id: 8,
    code: "O008",
    patient_id: 8,
  },
  {
    id: 9,
    code: "O009",
    patient_id: 9,
  },
  {
    id: 10,
    code: "O010",
    patient_id: 10,
  }
];
