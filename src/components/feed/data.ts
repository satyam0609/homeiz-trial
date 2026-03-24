// data/posts.ts
import property from "./images/property1.jpg";

export const posts = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `John Zimmer ${i + 1}`,
  location: "Agoura Hills, CA",
  role: "Real Estate Agent",
  rating: 3.5,
  reviews: 120 + i,
  price: "$980,000",
  beds: 5,
  baths: 5,
  area: "5,050 sqft",
  address: "8246 Woodshill Tri, Los Angeles, CA",
  company: "LUXURY COLLECTIVE",
  image: property,
  stats: {
    likes: "1K",
    comments: "220",
    shares: "24",
    views: "50",
  },
}));
