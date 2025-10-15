import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export default function OnlineStatusProvider({ children }) {
  useOnlineStatus();
  return <>{children}</>;
}
