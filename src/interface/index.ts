type TpNode = React.ReactNode;

export interface ILayout {
  children: TpNode;
}

export interface IWrapper {
  children: TpNode;
  className?: string;
}

export interface ICredential {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joined: string;
  lastSeen: string;
  role: string;
  expiresIn?: number;
  expiresAt?: number;
}

export interface IAuthProvider {
  isFetchingUser: boolean | null | undefined;
  isAuthenticated: boolean;
  credentials: ICredential | null;
  fetchUserFn: () => void;
}

export interface IFetchHook {
  data?: any;
  isLoading?: boolean | null | undefined | any;
  isError?: string | null | any;
  fn: (...args: any) => Promise<boolean>;
}
