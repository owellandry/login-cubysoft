// globals.d.ts
interface CodeData {
    code: string;
    expires: number;
  }
  
  declare global {
    var codes: Record<string, CodeData>;
  }
  
export {};