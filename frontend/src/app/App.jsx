
import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { useAuthInit } from "../features/auth/hook/useAuthInit.js";


function App() {
     useAuthInit();

   
    return <RouterProvider router={router} />;
}

export default App;
