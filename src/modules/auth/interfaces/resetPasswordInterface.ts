export interface RequestPassword {
  email: string;
}

export interface RequestPasswordResponse {
  message: string;
  emailRegistered: boolean;
}

export interface VerifyCode {
  email: string;
  code: string;
}

export interface ResetPassword {
  sessionToken: string;
  newPassword: string;
  confirmPassword: string;
}
