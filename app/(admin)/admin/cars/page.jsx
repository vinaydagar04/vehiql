import React from "react";
import { CarsList } from "./_components/car-list";

const metadata = {
  title: "Cars | Vehiql Admin",
  description: "Manage cars in your marketplace",
};

const CarpPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cars Management</h1>
      <CarsList />
    </div>
  );
};

export default CarpPage;
