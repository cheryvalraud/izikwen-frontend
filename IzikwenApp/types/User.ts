

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  role: "USER" | "ADMIN";
}
