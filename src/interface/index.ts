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
  isFetchingUser: boolean;
  isAuthenticated: boolean;
  credentials: ICredential | null;
  fetchUserFn: () => void;
}
