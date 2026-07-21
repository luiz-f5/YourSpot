import { Home, Settings, Info, UserRound } from "lucide-react-native";

export const tabsConstants = [
    {
      name: "index",
      title: "Home",
      component: Home 
    },
    {
      name: "contacts",
      title: "Contatos",
      component: UserRound 
    },
    {
      name: "settings",
      title: "Settings",
      component: Settings
    },
    {
      name: "about",
      title: "About",
      component: Info
    }
]