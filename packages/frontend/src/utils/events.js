export const eventStatuses = ["All Events", "Planning", "Confirmed", "Past"];

export const mockEvents = [
  {
    id: 1,
    title: "Newaz's Wedding",
    category: "Wedding",
    status: "Planning",
    date: "20 Dec 2026",
    location: "Dhaka",
    guests: 250,
    budget: 500000,

    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",

    vendors: [
      {
        id: 1,
        name: "Wedding Photography",
        image:
          "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 2,
        name: "Wedding Decoration",
        image:
          "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=100&q=80",
      },
    ],

    extraVendors: 3,
  },

  {
    id: 2,
    title: "Birthday Celebration",
    category: "Birthday",
    status: "Confirmed",
    date: "15 Jan 2027",
    location: "Gulshan, Dhaka",
    guests: 80,
    budget: 120000,

    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80",

    vendors: [
      {
        id: 3,
        name: "Birthday Decoration",
        image:
          "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 4,
        name: "Catering",
        image:
          "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=100&q=80",
      },
    ],

    extraVendors: 2,
  },

  {
    id: 3,
    title: "Corporate Annual Event",
    category: "Corporate",
    status: "Past",
    date: "10 May 2026",
    location: "Banani, Dhaka",
    guests: 300,
    budget: 350000,

    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80",

    vendors: [
      {
        id: 5,
        name: "Event Management",
        image:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 6,
        name: "Photography",
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=100&q=80",
      },
    ],

    extraVendors: 4,
  },
];
