import {
  BanknotesIcon,
  UserPlusIcon,
  UserIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  CircleStackIcon, CheckCircleIcon, ForwardIcon, HandThumbDownIcon
} from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";


export const statisticsCardsData = [
  {
    color: "blue",
    icon: TagIcon,
    title: "Categories",
    value: "unknown",
/*     footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    }, */
  },

  {
    color: "green",
    icon: UserPlusIcon,
    title: "Clients",
    value: "unknown",
/*     footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    }, */
  },
  {
    color: "orange",
    icon: WrenchScrewdriverIcon,
    title: "Services",
    value: "unknown",
/*     footer: {
      color: "text-green-500",
      value: "+5%",
      label: "than yesterday",
    }, */
  },
  {
    color: "red",
    icon: CircleStackIcon,
    title: "Earnings",
    value: "unknown",
    /*     footer: {
          color: "text-red-500",
          value: "-2%",
          label: "than yesterday",
        }, */
  }, {
    color: "blue",
    icon: CheckCircleIcon,
    title: "CompletedOrders",
    value: "unknown",
    /*     footer: {
          color: "text-red-500",
          value: "-2%",
          label: "than yesterday",
        }, */
  },{
    color: "purple",
    icon: ForwardIcon,
    title: "InProgressOrders",
    value: "unknown",
    /*     footer: {
          color: "text-red-500",
          value: "-2%",
          label: "than yesterday",
        }, */
  },{
    color: "purple",
    icon: XCircleIcon,
    title: "CanceledOrders",
    value: "unknown",
    /*     footer: {
          color: "text-red-500",
          value: "-2%",
          label: "than yesterday",
        }, */
  }, {
    color: "pink",
    icon: UserIcon,
    title: "Sellers",
    value: "unknown",
    /*     footer: {
          color: "text-green-500",
          value: "+3%",
          label: "than last month",
        }, */
  },{
    color: "purple",
    icon:   HandThumbDownIcon,
    title: "NonApprovedSellers",
    value: "unknown",
    /*     footer: {
          color: "text-red-500",
          value: "-2%",
          label: "than yesterday",
        }, */
  },



];

export default statisticsCardsData;
