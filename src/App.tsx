import { BrowserRouter } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import MyRoutes from "./routes/Routes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <main>
          <MyRoutes />
        </main>
      </BrowserRouter>
    </>
  )
}

export default App