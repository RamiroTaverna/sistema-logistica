export interface User {
  username: string;
  role: 'admin' | 'operador';
  token: string;
}
