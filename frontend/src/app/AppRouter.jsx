import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./AppLayout";
import DashboardPage from "../features/analytics/presentation/pages/DashboardPage";
import JobSearchPage from "../features/jobs/presentation/pages/JobSearchPage";
import JobDetailsPage from "../features/jobs/presentation/pages/JobDetailsPage";
import DuplicateReviewPage from "../features/duplicates/presentation/pages/DuplicateReviewPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "jobs", element: <JobSearchPage /> },
      { path: "jobs/:id", element: <JobDetailsPage /> },
      { path: "duplicates", element: <DuplicateReviewPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
