export type SuburbCatalogItem = {
  id: string;
  name: string;
  slug: string;
  city: string;
  regionGroup: string;
  summary: string;
  standoutFeature: string;
  quoteReady: boolean;
};

export const suburbCatalog: SuburbCatalogItem[] = [
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Claremont",
    slug: "claremont",
    city: "Cape Town",
    regionGroup: "southern_suburbs",
    summary:
      "Vibrant Southern Suburbs node with strong schools, retail access, and easier CBD reach than many outer areas.",
    standoutFeature: "Cavendish Square anchors daily life in the heart of Claremont.",
    quoteReady: true,
  },
  {
    id: "70b49d94-abd3-0856-dc87-3ef946b78b46",
    name: "Observatory",
    slug: "observatory",
    city: "Cape Town",
    regionGroup: "city_bowl_edge",
    summary:
      "Creative inner-city fringe suburb with older apartments, nightlife, and one of the easier CBD access points.",
    standoutFeature: "Groote Schuur Hospital is located in Observatory.",
    quoteReady: true,
  },
  {
    id: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
    name: "Table View",
    slug: "table-view",
    city: "Cape Town",
    regionGroup: "western_seaboard",
    summary:
      "Beach-oriented western seaboard suburb known for space-for-rent value and a stronger remote-work lifestyle feel.",
    standoutFeature: "Table View is named after its views of Table Mountain.",
    quoteReady: true,
  },
  {
    id: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
    name: "Bellville",
    slug: "bellville",
    city: "Cape Town",
    regionGroup: "northern_suburbs",
    summary:
      "Large Northern Suburbs workhorse with practical rental stock, shopping access, and strong family utility.",
    standoutFeature: "Tyger Valley is one of Bellville's major retail anchors.",
    quoteReady: true,
  },
  {
    id: "c76b6e04-3306-5577-7812-e49d6602d2c4",
    name: "Rondebosch",
    slug: "rondebosch",
    city: "Cape Town",
    regionGroup: "southern_suburbs",
    summary:
      "Southern Suburbs area with a strong academic pull, leafy streets, and close ties to the UCT orbit.",
    standoutFeature: "UCT's Groote Schuur Campus is situated in Rondebosch.",
    quoteReady: true,
  },
  {
    id: "f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df",
    name: "Sea Point",
    slug: "sea-point",
    city: "Cape Town",
    regionGroup: "atlantic_seaboard",
    summary:
      "Atlantic Seaboard apartment market with shoreline access, strong lifestyle appeal, and faster CBD reach than most outer suburbs.",
    standoutFeature: "The Sea Point Promenade is one of the suburb's defining drawcards.",
    quoteReady: true,
  },
  {
    id: "df9651e6-ed98-c46c-14cf-38c0a5d07435",
    name: "Woodstock",
    slug: "woodstock",
    city: "Cape Town",
    regionGroup: "city_bowl_edge",
    summary:
      "Creative city-edge suburb with older housing stock, design energy, and relatively direct access into town.",
    standoutFeature: "The Old Biscuit Mill remains one of Woodstock's biggest anchors.",
    quoteReady: true,
  },
  {
    id: "00d90a9b-494b-c150-5634-f84c13fc6bf6",
    name: "Century City",
    slug: "century-city",
    city: "Cape Town",
    regionGroup: "northern_gateway",
    summary:
      "Mixed-use precinct between the CBD and northern suburbs with a strong business, mall, and apartment-led living pattern.",
    standoutFeature: "Century City is a 250ha mixed-use precinct between the CBD and northern suburbs.",
    quoteReady: true,
  },
  {
    id: "366b3ba4-cc06-99a5-b3e1-c917429f6ba4",
    name: "Durbanville",
    slug: "durbanville",
    city: "Cape Town",
    regionGroup: "northern_suburbs",
    summary:
      "More spacious northern suburban market with family housing stock, wine-country pull, and longer cross-city commutes.",
    standoutFeature: "Durbanville Wine Valley is one of the area's signature drawcards.",
    quoteReady: true,
  },
  {
    id: "bf7804c8-6b28-f47d-6f44-e95e49bde03c",
    name: "Newlands",
    slug: "newlands",
    city: "Cape Town",
    regionGroup: "southern_suburbs",
    summary:
      "Leafy Southern Suburbs market with mountain access, premium family stock, and strong proximity to green space.",
    standoutFeature: "Kirstenbosch National Botanical Garden is located in Newlands.",
    quoteReady: true,
  },
];

export function getDefaultSuburb() {
  return suburbCatalog[0];
}
