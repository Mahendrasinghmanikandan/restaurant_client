import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Booking from "../pages/Booking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/bookings",
    element: <App />,
    children: [
      {
        path: "/bookings",
        element: <Booking />,
      },
    ],
  },
]);

export default router;
