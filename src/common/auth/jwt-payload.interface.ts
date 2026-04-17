export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  type: 'admin' | 'user';
}