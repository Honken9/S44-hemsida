export const site = {
  name: "Skatelövsvägen 44",
  city: "Grimslöv",
  postalCode: "340 32",
  street: "Skatelövsvägen 44",
  contactEmail: "hakfastigheter@gmail.com",
};

export const heroImage = "/hero.jpg";

export const apartmentPlaceholderImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

export interface Apartment {
  id: string;
  name: string;
  rooms: string;
  floor: string;
  status: "Ledig" | "Uthyrd" | "Kö";
  image?: string;
  size?: string;
  rent?: string;
  description?: string;
}

export const apartments: Apartment[] = [
  {
    id: "1",
    name: "Lägenhet 1",
    rooms: "2 rok",
    floor: "Bottenvåning",
    status: "Uthyrd",
  },
  {
    id: "2",
    name: "Lägenhet 2",
    rooms: "2 rok",
    floor: "Bottenvåning",
    status: "Ledig",
  },
  {
    id: "3",
    name: "Lägenhet 3",
    rooms: "2 rok",
    floor: "Bottenvåning",
    status: "Uthyrd",
  },
  {
    id: "4",
    name: "Lägenhet 4",
    rooms: "2 rok",
    floor: "Bottenvåning",
    status: "Uthyrd",
  },
  {
    id: "5",
    name: "Lägenhet 5",
    rooms: "2 rok",
    floor: "Övervåning",
    status: "Ledig",
  },
  {
    id: "6",
    name: "Lägenhet 6",
    rooms: "2 rok",
    floor: "Övervåning",
    status: "Uthyrd",
  },
  {
    id: "7",
    name: "Lägenhet 7",
    rooms: "2 rok",
    floor: "Övervåning",
    status: "Uthyrd",
  },
  {
    id: "8",
    name: "Lägenhet 8",
    rooms: "2 rok",
    floor: "Övervåning",
    status: "Uthyrd",
  },
];
