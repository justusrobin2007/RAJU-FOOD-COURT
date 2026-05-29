export interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location: string;
  date: string;
  role: string;
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "r1",
    name: "Dr. Anirudh Mehta",
    rating: 5,
    comment: "The closest thing to dining in a premium Mylapore eatery! Their Cheese Burst Dosa is spectacular, and the aroma of pure ghee is present in every bite. Truly world-class.",
    location: "Ahmedabad, Gujarat",
    date: "2026-05-15",
    role: "Regular Food Critic"
  },
  {
    id: "r2",
    name: "Pooja Patel",
    rating: 5,
    comment: "I have visited Chennai multiple times, and I can confirm that Raju Madras Cafe's Ghee Podi Dosa matches the authenticity completely. The atmosphere and flavor are excellent.",
    location: "Vadodara, Gujarat",
    date: "2026-05-20",
    role: "Local Guide"
  },
  {
    id: "r3",
    name: "Vikram Shah",
    rating: 5,
    comment: "Excellent service and hygiene. The Madras Special Thali offers an incredible array of flavors. It is very difficult to find such authentic Tamil tastes here in Gujarat. Must visit!",
    location: "Surat, Gujarat",
    date: "2026-05-22",
    role: "Gourmand & Business Owner"
  },
  {
    id: "r4",
    name: "Rajesh Trivedi",
    rating: 4,
    comment: "Their Ghee Podi Mini Idli is phenomenal. It has the perfect balance of spice and ghee. The digital takeaway ordering was very smooth, and my food was ready exactly when I arrived.",
    location: "Rajkot, Gujarat",
    date: "2026-05-24",
    role: "Regular Customer"
  }
];
