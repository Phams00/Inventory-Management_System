export {};

declare global {
  namespace Express {
    interface Request {
      companyId?: string;
    }
  }
}