const vendors = [
  {
    id: 1,
    name: "Chateau de Versailles",
    description:
      "Host unforgettable celebrations in one of the world's most iconic luxury venues. Featuring grand ballrooms, stunning gardens, and timeless architecture, it's perfect for weddings, galas, and prestigious corporate events.",
    category: "Event Venues",
    location: "Paris, FR",
    rating: 5.0,
    price: "৳15,000",
    featured: true,
    verified: true,

    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjF2cBYRtV4qodo48Qcp142g6lPnnIPg8r1Ju-hkC7tFFwuvkY1fgICVIMmqR0bFkcoF1Ze_F53yN3kD366oN8ELutb8rPizq_o9TuD641--ighbOmDKiDzikQu6lResaHzYZYjQCx3OebuoHgmeP5n-JRxTNB7yRrn4deIPBPqrqPJU7kIESwoTPB-C3MxOkXw-kZfLNXhlBGjgOadi5U1HhmmhNAmTAtSRCiX5_O5yTetGte7dqvLxoSKjnQB2rTCqRUZzk7I90",

    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
    ],
  },

  {
    id: 2,
    name: "Artisan Palate",
    description:
      "Delivering exceptional culinary experiences with handcrafted menus, premium ingredients, and elegant presentation. From intimate gatherings to large-scale celebrations, every meal is tailored to perfection.",
    category: "Caterers",
    location: "New York, NY",
    rating: 4.9,
    price: "৳4,200",
    featured: false,
    verified: true,

    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB47aH1n5GLi3GjmDKBtXDJuv9-MneEYOnZKCZIvE_GlskENzuj3WSEHe7t9-Pidhqmy7d5QTO8kJI5qmLq0ufSWStOXqSPSLDyqoWj6UFetF2OJkgZHvJXLaKEJiL9fxXBA-ElA7b88sE_jROgCOTHnzApE7ppb35RC2H8p28eVDvxytVaHQvFtyiCjEbTEoyufe3krpZIJ5VLibtjeeBOczqLJ2_uPc8ntmhk8U8XAR98JbRoskruSqLJ8hzgZ00WFOdqsoFHKcs",

    photos: [
      "https://images.unsplash.com/photo-1555244162-803834f70033",
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      "https://images.unsplash.com/photo-1547592180-85f173990554",
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c",
    ],
  },

  {
    id: 3,
    name: "Botanical Noir",
    description:
      "Transform ordinary spaces into breathtaking event experiences with bespoke floral arrangements, luxury décor, and creative styling. Every design is crafted to reflect your unique vision and theme.",
    category: "Decorations",
    location: "London, UK",
    rating: 4.8,
    price: "৳2,800",
    featured: false,
    verified: false,

    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMhcwtsGdpuZvIT3qIuTmvH1WuxB3VdMIdkB25l-ByxOf8cUKU6bVl7kihVnJJTXL64dZQPs8MDfjzBKo4Feu5gqnf-VW2rm48jbZ7OldbNNXQKAO1DNk7DdmE4YePSjoiEbVN3LWlJT8AmJj7ezJ5Z8YqFZDlperYuQZoaEC1lLcKa7ttVR0IWLRl0PRK3kSiwU9XJ8AbK_HgjNqe32K7H0VmHzq3hIWuE7SMVPy1au2kYcB7cO79XPC1XLIxeW6ALC0Tc4G6sds",

    photos: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    ],
  },

  {
    id: 4,
    name: "Vogue Visions",
    description:
      "Capture every unforgettable moment through cinematic photography and professional videography. From candid emotions to stunning aerial shots, every memory is preserved with artistic excellence.",
    category: "Photography & Videography",
    location: "Milan, IT",
    rating: 4.9,
    price: "৳5,500",
    featured: false,
    verified: true,

    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1oDL2pA37HO4DcgXCrlDQ_suT31Cw7I-YEsiUNt30JgZ0jE9_stNA1EJMtPE7oWUahg0-wmc1rtwrICoAy_zdkSSJFF7C3K3EvzaEUCjU9LpYui5dxv5H_RkQeD2fvQ5BQYDPJXxZ_VUUSyYO9AJnKrILOj_C4He3nTsXs9YscfZx5Lq5A-uD-HOy2SBxGMk2Idq8NuTDOtk8i-Wd1Xhu7AmM_1KxYcytPrR-zILdHRTNjP7yJUtWNwNProEMTDbyJPpAM3UpgMk",

    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866",
      "https://images.unsplash.com/photo-1544078751-58fee2d8a03b",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
    ],
  },

  {
    id: 5,
    name: "Symphony Services",
    description:
      "A full-service event planning company dedicated to creating seamless and stress-free celebrations. From vendor coordination to on-site management, every detail is handled with precision.",
    category: "Event Management",
    location: "Vienna, AT",
    rating: 4.7,
    price: "৳3,000",
    featured: false,
    verified: true,

    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIlP3Y-O591MB3PtJiD9rSxdgkGKVxg84bn3mM3xjkzGj8z7Fc2zAlIBq2RKbv99E0mJWnokwPE7ECjMIJ6IN1cUlk2aUQuthLM9uqiqDFPGpj57ngQKtmHs2vM2llkZaIHPcWaGojsW36EtP04raAF-r5A6Tidq5ML9_ABjkigrwW6qCvcFH-ebJnXpblqpqTMMxCeX2Xkf_Xg0o9BdLn5OUtfB22IPAdl71AKf6gphtlT276by02bZ81ZXvF0sZnlOfKf0eR9sM",

    photos: [
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
    ],
  },

  {
    id: 6,
    name: "Sugar & Silk",
    description:
      "Known for exquisite desserts, gourmet cuisine, and beautifully curated dining experiences. Our team creates memorable menus that delight guests and complement every special occasion.",
    category: "Caterers",
    location: "Beverly Hills, CA",
    rating: 5.0,
    price: "৳1,200",
    featured: true,
    verified: true,

    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCB7_ARSoJ1x5e2NXmNMKnQbFLre2mxVDWwnT2QmP4VG_rtG1WiK7nEhCjZ10VajK1CDa5rYr6bi1hj9xavw8Tq_yJVfhM9u1xQS7cmknpoHjo2pndp_BDErCvd1WZ4vUbBqHMwso63ho4OIUnLJxCs9om0OTEgjmAhQWz638YH1Y61H_wo3gduXpxI9GhhzzwsyUneCI3VlprmM9kq50AtAfY8OX0r-F_4jc6l_fmpza_oX_aiSOOCI5U3CQ44TleAVvm1Poq7s_s",

    photos: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
      "https://images.unsplash.com/photo-1558326567-98ae2405596b",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
      "https://images.unsplash.com/photo-1558326567-98ae2405596b",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
    ],
  },

  {
    id: 7,
    name: "Harmony Events",
    description:
      "Providing personalized event planning services for weddings, parties, and corporate gatherings. With creative ideas and flawless execution, every event is designed to leave a lasting impression.",
    category: "Event Management",
    location: "Vienna, AT",
    rating: 3.6,
    price: "৳2,700",
    featured: false,
    verified: true,

    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIlP3Y-O591MB3PtJiD9rSxdgkGKVxg84bnm3M3xjkzGj8z7Fc2zAlIBq2RKbv99E0mJWnokwPE7ECjMIJ6IN1cUlk2aUQuthLM9uqiqDFPGpj57ngQKtmHs2vM2llkZaIHPcWaGojsW36EtP04raAF-r5A6Tidq5ML9_ABjkigrwW6qCvcFH-ebJnXpblqpqTMMxCeX2Xkf_Xg0o9BdLn5OUtfB22IPAdl71AKf6gphtlT276by02bZ81ZXvF0sZnlOfKf0eR9sM",

    photos: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "https://images.unsplash.com/photo-1511578314322-379afb476865",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
    ],
  },
];

export default vendors;
