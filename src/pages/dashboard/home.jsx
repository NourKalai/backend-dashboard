import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  ClockIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useMemo } from "react";
import { chartsConfig } from "@/configs";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]


export function Home() {
  const clients = useSelector((state) => state.selectClients.value.clients);
  const prestataires = useSelector((state) => state.selectPrestataires.value.prestataires);
  const services = useSelector((state) => state.selectServices.value.services);
  const categories = useSelector((state) => state.selectCategories.value.categories);
  const orders = useSelector((state) => state.selectCommandes.value.commandes);
  const stats=useSelector((state)=>state.selectStats.value.stats);
  const [monthlyOrdersChart, setMonthlyOrdersChart] = useState(null);
  const [ordersStatusChart, setOrdersStatusChart] = useState(null);
  const [lastMonthMessageDisplay,setLastMonthMessageDisplay] = useState(null) 

  const diffMonth = useCallback((d2, d1) => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  });

  const diff = useMemo(()=>diffMonth(new Date(),new Date(new Date().getFullYear(),0,1)),[])

  useEffect(()=>{
    if(orders){
      const ordersSorted = [...orders].sort((a,b)=>{
        // sort by delivery date
        return new Date(a.deliveryDate) - new Date(b.deliveryDate);
      })
      const data = ordersSorted.reduce((acc,el)=>{
        const month = new Date(el.deliveryDate).getMonth() + 1;
        const year = new Date(el.deliveryDate).getFullYear();
        const key = `${year}-${month}`;
        const idx = acc.length-1 ;
        if(acc.length===0){
          acc.push({key:key,value:0});
        }
        else if(acc[idx].key === key){
          acc[idx].value+=1;
        }else{
          acc.push({key:key,value:0});
        }
        return acc;
      },[]);
      setMonthlyOrdersChart({
        type: "line",
        height:220,
        series: [
          {
            name: "Commandes",
            data: data.map(el=>el.value)
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#fff"],
          stroke: {
            lineCap: "round",
          },
          markers: {
            size: 5,
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: 
              data.map(el=>el.key)
            ,
          },
          yaxis:{
            min:0,
            tickAmount:1,
            labels:{
                style:{
                  colors:["#fff"]
                }
            }
          }
        },
      });
      setOrdersStatusChart({
        height:220,
        options:{},
        type: "donut",
        series: [44, 55, 41],
        labels: ['A', 'B', 'C']
      })
    }
  },[orders])

  useEffect(()=>{
/*     if(monthlyOrdersChart){
      const lastMonthGap = (monthlyOrdersChart.series[0].data[new Date().getMonth()] - monthlyOrdersChart.series[0].data[new Date().getMonth()-1]);
      if(monthlyOrdersChart.series[0].data[new Date().getMonth()]===0){
        setLastMonthMessageDisplay("Pas de commandes ce mois-ci");
        return;
      }
      if(monthlyOrdersChart.series[0].data[new Date().getMonth()-1]===0){
        setLastMonthMessageDisplay("100% de croissance par rapport au mois précédent");
        return;
      }
      setMonthlyOrdersChart(`${100*lastMonthGap/monthlyOrdersChart.series[0].data[new Date().getMonth()-1]} de croissance par rapport au mois précédent`);
    } */
  },[monthlyOrdersChart])


  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, color, value }) => (
          <StatisticsCard
            key={title}
            color={color}
            value={title==="Clients"  ? stats.numberOfBuyers: title==="Sellers"? stats.numberOfSellers :title==="NonApprovedSellers"?stats.numberOfNonApprovedSellers: title==="Services" && services instanceof Array ? services.length : title==="Categories" && categories instanceof Array ? categories.length :title==="CompletedOrders"? stats.totalCompletedOrders :title ==="InProgressOrders"? stats.totalInProgressOrders:
              title==="CanceledOrders"?stats.totalCanceledOrders : title==="Earnings" ?stats.totalEarnings+"TND" :value}
            title={title==="Sellers" ?"Prestataires":title==="NonApprovedSellers"?"Prestataires Non Approuvés":title==="Categories" ?"Catégories":title==="CompletedOrders"?"Commandes Validées":title ==="InProgressOrders"?"Commandes En Cours":title==="CanceledOrders"?"Commandes Annulées": title==="Earnings"?"Gains":title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {monthlyOrdersChart && statisticsChartsData.map((props,idx) => (
          <StatisticsChart
            key={props.title}
            {...props}
            chart={idx===0?monthlyOrdersChart:ordersStatusChart}
            description={idx===0?lastMonthMessageDisplay:null}
          />
        ))}

      </div>
      {/* <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckIcon strokeWidth={3} className="h-4 w-4 text-blue-500" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div> */}
    </div>
  );
}

export default Home;
