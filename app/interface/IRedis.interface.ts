export interface ICacheData {
  data: any;
  timestamp: number;
  expiresIn: number;
}

export interface IRedisConfig {
  host: string;
  port: number;
  password?: string;
}