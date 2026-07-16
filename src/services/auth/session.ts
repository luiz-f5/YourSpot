import { useContext } from "react";
import AuthContext from "./ctxAuth";

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}

