export interface AuthProvider {
  register(email: string, password: string): Promise<string>;
  login(email: string, password: string): Promise<string>;
}