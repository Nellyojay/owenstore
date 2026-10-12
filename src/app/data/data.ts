export const products = [
  {
    name: 'Everyday Overshirt',
    category: 'Apparel',
    price: '$88',
    color: 'Moss / 3 colors',
    image: 'photo-1591047139829-d91aecb6caea',
    tone: 'bg-[#e6e8df]',
  },
  {
    name: 'Sunday Ceramic Set',
    category: 'Objects',
    price: '$42',
    color: 'Chalk / 2 colors',
    image: 'photo-1490312278390-ab64016e0aa9',
    tone: 'bg-[#e5e3d8]',
  },
  {
    name: 'Field Knit',
    category: 'Apparel',
    price: '$124',
    color: 'Pine / 2 colors',
    image: 'photo-1618354691373-d851c5c3a990',
    tone: 'bg-[#dce5df]',
  },
  {
    name: 'Good Morning Tote',
    category: 'Objects',
    price: '$36',
    color: 'Natural / 1 color',
    image: 'photo-1590874103328-eac38a683ce7',
    tone: 'bg-[#ece5d7]',
  },
]

export const collections = [
  {
    id: "1",
    name: "The tank",
    description: "Classic bike tank with a modern twist",
    items: [
      {
        id: "1",
        name: "Helmets",
        stock: 100,
        sold: 50,
        price: 35000,
        salesHistory: [
          {
            id: "1",
            quantity: 10,
            unitPrice: 35000,
            date: "2023-01-01",
          }
        ]
      }
    ]
  }
]