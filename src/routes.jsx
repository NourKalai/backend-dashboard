import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import {Home, Profile, Prestataires, Notifications, Clients, Categories, Services, Commandes} from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Buyer from "@/pages/dashboard/Buyer";
import Seller from "@/pages/dashboard/Seller.jsx";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    title: "dashboard pages",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {    icon: <TableCellsIcon {...icon} />,
          name: "categories",
          path: "/categories",
          element: <Categories />,
      },
/*       {
        icon: <TableCellsIcon {...icon} />,
        name: "clients",
        path: "/tables/clients",
        element: <Tables />,
      }, */
      {
        icon: <TableCellsIcon {...icon} />,
        name: "prestataires",
        path: "/prestataires",
        element: <Prestataires />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Clients",
        path: "/clients",
        element: <Clients />,
      },  {
        icon: <TableCellsIcon {...icon} />,
        name: "Services",
        path: "/services",
        element: <Services />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "commandes",
        path: "/commandes",
        element: <Commandes />,
      },

      /*
      /*       {
              icon: <TableCellsIcon {...icon} />,
              name: "services",
              path: "/tables/services",
              element: <Tables />,
            }, */
/*       {
        icon: <TableCellsIcon {...icon} />,
        name: "commandes",
        path: "/tables/commandes",
        element: <Tables />,
      }, */
/*       {
        icon: <BellIcon {...icon} />,
        name: "notifactions",
        path: "/notifactions",
        element: <Notifications />,
      }, */
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ArrowLeftOnRectangleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      }
    ],
  },
];

export default routes;
