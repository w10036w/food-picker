import dayjs from "dayjs";

interface Storage {
  token?: string;
  host?: {
    name: string;
    code: string;
  }
  list?: {
    key: string;
    groups: { name: string, key: string, list: string[] }[]
  }
}

export type MyContextType = {
  date: dayjs.Dayjs;
  setDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  storage: Storage;
  updateStorage: (key: keyof Storage, value: any) => void;
  vendorCode: string;
  setVendorCode: React.Dispatch<React.SetStateAction<string>>;
};

export interface AllowanceRes {
  allowance: number;
  customer_code: string;
  is_required_expense_code: boolean;
  is_allowance_available: boolean;
}