 import {SettingsIcon, InfoIcon} from "@/components/ui/icon";
import { Home } from "lucide-react-native";

export const tabsConstants = [
    {
      name : "index",
      title: "Home",
      component: Home 
    },
    {
      name: "settings",
      title: "Settings",
      component: SettingsIcon
    },
    {
      name: "about",
      title: "About",
      component: InfoIcon
    }
  ]