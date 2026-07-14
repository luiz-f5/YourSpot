import AuthContext from "./ctxAuth";
import { useContext } from "react";

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}

