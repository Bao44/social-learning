"use client";

import { LeftSidebar } from "./components/LeftSideBar";
import { MainContentArea } from "./components/MainContentArea";
import { RightSidebar } from "./components/RightSidebar";
import { TopHeader } from "./components/TopHeader";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <div className="ml-64">
        <TopHeader />

        <div className="flex">
          {/* Center Content */}
          <div className="flex-1 px-6 py-6">
            <MainContentArea />
          </div>

          {/* Right Sidebar */}
          <div className="w-90 p-6 hidden xl:block">
            <div className="sticky top-24">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
