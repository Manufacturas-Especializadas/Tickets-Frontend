import { BrowserRouter } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import MyRoutes from "./routes/Routes";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main>
            <MyRoutes />
          </main>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default App;
