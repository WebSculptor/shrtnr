import { ICredential } from "@/interface";
import { supabase, supabaseUrl } from "./supabase";

export async function getCurrentUser() {
  try {
    const { data: session, error } = await supabase.auth.getSession();

    if (!session) return null;
    if (error) throw new Error(error.message);

    const user = session?.session;

    const account: ICredential = {
      id: user?.user?.user_metadata?.sub,
      name: user?.user?.user_metadata?.name,
      email: user?.user?.user_metadata?.email,
      avatar: user?.user?.user_metadata?.avatar,
      joined: user?.user?.created_at!,
      lastSeen: user?.user?.last_sign_in_at!,
      role: user?.user?.role!,
      expiresIn: user?.expires_in,
      expiresAt: user?.expires_at,
    };

    return account;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function signUp({
  name,
  email,
  password,
  avatar,
}: {
  name: string;
  email: string;
  password: string;
  avatar: any;
}) {
  try {
    const fileName =
      avatar.name || `avatar-${name.split(" ").join("-")}-${Math.random()}`;
    const { error: storageError } = await supabase.storage
      .from("avatar")
      .upload(fileName, avatar);

    if (storageError) throw new Error(storageError.message);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          avatar: `${supabaseUrl}/storage/v1/object/public/avatar/${fileName}`,
        },
      },
    });

    if (signUpError) throw new Error(signUpError.message);

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function signOut() {
  try {
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) throw new Error(signOutError.message);

    return true;
  } catch (error: any) {
    throw Error(error);
  }
}
