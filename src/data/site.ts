export const site = {
  name: "Skatelövsvägen 44",
  city: "Grimslöv",
  postalCode: "340 32",
  street: "Skatelövsvägen 44",
  contactEmail: "hakfastigheter@gmail.com",
};

export const heroImage =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=2400&q=80";

export interface Apartment {
  id: string;
  name: string;
  rooms: string;
  size: string;
  floor: string;
  rent: string;
  status: "Ledig" | "Uthyrd" | "Kö";
  image: string;
  description: string;
}

export const apartments: Apartment[] = [
  {
    id: "1",
    name: "Lägenhet 1",
    rooms: "1 rok",
    size: "32 m²",
    floor: "Bottenvåning",
    rent: "4 200 kr/mån",
    status: "Uthyrd",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    description: "Etta med pentry och egen uteplats mot trädgården.",
  },
  {
    id: "2",
    name: "Lägenhet 2",
    rooms: "2 rok",
    size: "54 m²",
    floor: "Bottenvåning",
    rent: "5 800 kr/mån",
    status: "Ledig",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    description: "Ljus tvåa med separat sovrum och fullt utrustat kök.",
  },
  {
    id: "3",
    name: "Lägenhet 3",
    rooms: "2 rok",
    size: "58 m²",
    floor: "Bottenvåning",
    rent: "6 100 kr/mån",
    status: "Uthyrd",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    description: "Hörnlägenhet med fönster åt två väderstreck.",
  },
  {
    id: "4",
    name: "Lägenhet 4",
    rooms: "3 rok",
    size: "72 m²",
    floor: "Bottenvåning",
    rent: "7 400 kr/mån",
    status: "Kö",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    description: "Större trea, lämplig för familj eller delning.",
  },
  {
    id: "5",
    name: "Lägenhet 5",
    rooms: "1 rok",
    size: "34 m²",
    floor: "Övervåning",
    rent: "4 350 kr/mån",
    status: "Ledig",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    description: "Etta med utsikt över bygatan och nyrenoverat badrum.",
  },
  {
    id: "6",
    name: "Lägenhet 6",
    rooms: "2 rok",
    size: "56 m²",
    floor: "Övervåning",
    rent: "5 950 kr/mån",
    status: "Uthyrd",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    description: "Tvåa med inglasad balkong och eget förråd.",
  },
  {
    id: "7",
    name: "Lägenhet 7",
    rooms: "2 rok",
    size: "60 m²",
    floor: "Övervåning",
    rent: "6 200 kr/mån",
    status: "Ledig",
    image:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80",
    description: "Genomgående tvåa med öppen planlösning.",
  },
  {
    id: "8",
    name: "Lägenhet 8",
    rooms: "3 rok",
    size: "75 m²",
    floor: "Övervåning",
    rent: "7 600 kr/mån",
    status: "Uthyrd",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    description: "Trea i toppvåning med vacker utsikt över omgivningarna.",
  },
];
