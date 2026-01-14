import { Route, Routes } from "react-router";
// import { HomeIndex } from "../pages/HomePage/HomeIndex";
import { TicketForm } from "../pages/Tickets/TicketForm";
import { AdminIndex } from "../pages/Admin/AdminIndex";
import { Login } from "../pages/Auth/Login";

const MyRoutes = () => {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<HomeIndex />} /> */}

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Form */}
        <Route path="/" element={<TicketForm />} />

        {/* Admin */}
        <Route path="/administrador" element={<AdminIndex />} />
      </Routes>
    </>
  );
};

export default MyRoutes;
