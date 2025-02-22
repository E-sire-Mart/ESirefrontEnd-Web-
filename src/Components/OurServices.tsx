"use client";

import { TbTruckDelivery } from "react-icons/tb";
import { RiCustomerServiceLine, RiShieldCheckLine } from "react-icons/ri";

const services = [
  {
    id: 1,
    icon: <TbTruckDelivery className="w-3/4 h-3/4 bg-black rounded-full text-primary p-2" />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140",
  },
  {
    id: 2,
    icon: <RiCustomerServiceLine className="w-3/4 h-3/4 bg-black rounded-full text-primary p-2" />,
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support",
  },
  {
    id: 3,
    icon: <RiShieldCheckLine className="w-3/4 h-3/4 bg-black rounded-full text-primary p-2" />,
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days",
  },
];

export default function OurServices() {
  return (
    <section className="w-full px-[5%] my-20">
      <div className="flex w-full items-center justify-center gap-[3rem] flex-wrap">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col items-center justify-center gap-4 w-max">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-secondary">
              {service.icon}
            </div>
            <h3 className="text-lg font-bold">{service.title}</h3>
            <p className="text-base">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
