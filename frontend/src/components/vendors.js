const vendors = [
  {
    id: 1,
    name: "Chateau de Versailles",
    category: "Elite Venue",
    location: "Paris, FR",
    rating: 5.0,
    price: "$15,000",
    featured: true,
    verified: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjF2cBYRtV4qodo48Qcp142g6lPnnIPg8r1Ju-hkC7tFFwuvkY1fgICVIMmqR0bFkcoF1Ze_F53yN3kD366oN8ELutb8rPizq_o9TuD641--ighbOmDKiDzikQu6lResaHzYZYjQCx3OebuoHgmeP5n-JRxTNB7yRrn4deIPBPqrqPJU7kIESwoTPB-C3MxOkXw-kZfLNXhlBGjgOadi5U1HhmmhNAmTAtSRCiX5_O5yTetGte7dqvLxoSKjnQB2rTCqRUZzk7I90",
  },

  {
    id: 2,
    name: "Artisan Palate",
    category: "Bespoke Catering",
    location: "New York, NY",
    rating: 4.9,
    price: "$4,200",
    featured: false,
    verified: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB47aH1n5GLi3GjmDKBtXDJuv9-MneEYOnZKCZIvE_GlskENzuj3WSEHe7t9-Pidhqmy7d5QTO8kJI5qmLq0ufSWStOXqSPSLDyqoWj6UFetF2OJkgZHvJXLaKEJiL9fxXBA-ElA7b88sE_jROgCOTHnzApE7ppb35RC2H8p28eVDvxytVaHQvFtyiCjEbTEoyufe3krpZIJ5VLibtjeeBOczqLJ2_uPc8ntmhk8U8XAR98JbRoskruSqLJ8hzgZ00WFOdqsoFHKcs",
  },

  {
    id: 3,
    name: "Botanical Noir",
    category: "Floral Design",
    location: "London, UK",
    rating: 4.8,
    price: "$2,800",
    featured: false,
    verified: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMhcwtsGdpuZvIT3qIuTmvH1WuxB3VdMIdkB25l-ByxOf8cUKU6bVl7kihVnJJTXL64dZQPs8MDfjzBKo4Feu5gqnf-VW2rm48jbZ7OldbNNXQKAO1DNk7DdmE4YePSjoiEbVN3LWlJT8AmJj7ezJ5Z8YqFZDlperYuQZoaEC1lLcKa7ttVR0IWLRl0PRK3kSiwU9XJ8AbK_HgjNqe32K7H0VmHzq3hIWuE7SMVPy1au2kYcB7cO79XPC1XLIxeW6ALC0Tc4G6sds",
  },

  {
    id: 4,
    name: "Vogue Visions",
    category: "Photography",
    location: "Milan, IT",
    rating: 4.9,
    price: "$5,500",
    featured: false,
    verified: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1oDL2pA37HO4DcgXCrlDQ_suT31Cw7I-YEsiUNt30JgZ0jE9_stNA1EJMtPE7oWUahg0-wmc1rtwrICoAy_zdkSSJFF7C3K3EvzaEUCjU9LpYui5dxv5H_RkQeD2fvQ5BQYDPJXxZ_VUUSyYO9AJnKrILOj_C4He3nTsXs9YscfZx5Lq5A-uD-HOy2SBxGMk2Idq8NuTDOtk8i-Wd1Xhu7AmM_1KxYcytPrR-zILdHRTNjP7yJUtWNwNProEMTDbyJPpAM3UpgMk",
  },

  {
    id: 5,
    name: "Symphony Services",
    category: "Live Music",
    location: "Vienna, AT",
    rating: 4.7,
    price: "$3,000",
    featured: false,
    verified: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIlP3Y-O591MB3PtJiD9rSxdgkGKVxg84bn3mM3xjkzGj8z7Fc2zAlIBq2RKbv99E0mJWnokwPE7ECjMIJ6IN1cUlk2aUQuthLM9uqiqDFPGpj57ngQKtmHs2vM2llkZaIHPcWaGojsW36EtP04raAF-r5A6Tidq5ML9_ABjkigrwW6qCvcFH-ebJnXpblqpqTMMxCeX2Xkf_Xg0o9BdLn5OUtfB22IPAdl71AKf6gphtlT276by02bZ81ZXvF0sZnlOfKf0eR9sM",
  },

  {
    id: 6,
    name: "Sugar & Silk",
    category: "Artisan Cakes",
    location: "Beverly Hills, CA",
    rating: 5.0,
    price: "$1,200",
    featured: true,
    verified: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCB7_ARSoJ1x5e2NXmNMKnQbFLre2mxVDWwnT2QmP4VG_rtG1WiK7nEhCjZ10VajK1CDa5rYr6bi1hj9xavw8Tq_yJVfhM9u1xQS7cmknpoHjo2pndp_BDErCvd1WZ4vUbBqHMwso63ho4OIUnLJxCs9om0OTEgjmAhQWz638YH1Y61H_wo3gduXpxI9GhhzzwsyUneCI3VlprmM9kq50AtAfY8OX0r-F_4jc6l_fmpza_oX_aiSOOCI5U3CQ44TleAVvm1Poq7s_s",
  },
  {
    id: 7,
    name: "Symphony Services",
    category: "Live Music",
    location: "Vienna, AT",
    rating: 3.6,
    price: "$2,700",
    featured: false,
    verified: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIlP3Y-O591MB3PtJiD9rSxdgkGKVxg84bn3mM3xjkzGj8z7Fc2zAlIBq2RKbv99E0mJWnokwPE7ECjMIJ6IN1cUlk2aUQuthLM9uqiqDFPGpj57ngQKtmHs2vM2llkZaIHPcWaGojsW36EtP04raAF-r5A6Tidq5ML9_ABjkigrwW6qCvcFH-ebJnXpblqpqTMMxCeX2Xkf_Xg0o9BdLn5OUtfB22IPAdl71AKf6gphtlT276by02bZ81ZXvF0sZnlOfKf0eR9sM",
  },
];

export default vendors;