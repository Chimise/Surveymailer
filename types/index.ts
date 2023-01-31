export interface User {
  _id: string;
  name: string;
  email: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  surveys: number;
  provider: 'google' | 'local';
}

export interface ErrorObj {
    error: {
        message: string;
    }
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Choice {
    _id: string;
    action: string;
    responses: number;
    code: number;
}

export interface Survey {
    _id: string;
    title: string;
    body: string;
    subject: string;
    recipients: number;
    shipper: string;
    shipper_email?: string;
    choices: Choice[],
    createdAt: string;
    updatedAt: string;
}

export interface Recipient {
    _id: string,
    email: string,
    responded: boolean,
    choice: string;
    createdAt: string;
    updatedAt: string;
}

export interface Paginate {
    total: number;
    totalPages: number;
    currentPage: number;
    previousPage: number;
    nextPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PaystackReference {
    reference: string;
}

export interface PaystackSetup {
    key: string;
    email: string;
    amount: number;
    ref?: any;
    currency?: 'NGN'| 'GHS'|'ZAR'|'USD';
    channels?: Array<'card'|'bank'|'ussd'|'qr'|'mobile_money'|'bank_transfer'>;
    metadata?: object;
    label?: string;
    callback: (data: PaystackReference) => void | Promise<void>;
    onClose: () => void;
}

interface PaystackHandler {
    openIframe: () => void;
}

export interface Paystack {
    setup: (options: PaystackSetup) => PaystackHandler;
}

export type Option = {name: string, text: string};