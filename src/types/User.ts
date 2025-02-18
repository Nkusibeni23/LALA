export interface UserInput {
  name: string;
  email: string;
  password: string;
  role?: "RENTER" | "HOST";
}
