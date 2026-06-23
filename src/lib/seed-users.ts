// ============================================================
// SEED USERS — sample users for development
// ============================================================
// These match the seed data in src/db/seed.ts.
// Used by the fake auth system and the Header component.
// ============================================================

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export const SEED_USERS: User[] = [
  {
    id: "user-1",
    name: "Alex Rivera",
    email: "alex@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: "user-2",
    name: "Jordan Chen",
    email: "jordan@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
  },
  {
    id: "user-3",
    name: "Sam Okafor",
    email: "sam@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
  },
  {
    id: "user-4",
    name: "Maya Patel",
    email: "maya@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
  },
];
