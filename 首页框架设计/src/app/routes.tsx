import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { Dashboard } from "./pages/Dashboard";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-6">
      <div className="bg-white/60 backdrop-blur-2xl py-12 px-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 text-center max-w-md w-full">
        <h1 className="text-3xl font-medium text-[#202124] mb-4">{title}</h1>
        <p className="text-gray-500">页面建设中...</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "courses", element: <PlaceholderPage title="课程页面" /> },
      { path: "tasks", element: <PlaceholderPage title="任务页面" /> },
      { path: "*", element: <PlaceholderPage title="404 页面未找到" /> },
    ],
  },
]);
