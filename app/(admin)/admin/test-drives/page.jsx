import React from "react";
import TestDriveList from "./_components/test-drive-list";

export const metadata = {
  title: "Test Drives | Vehiql Admin",
  description: "Manage test drives bookings",
};

const TestDrivePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test Drive Management</h1>
      <TestDriveList />
    </div>
  );
};

export default TestDrivePage;
