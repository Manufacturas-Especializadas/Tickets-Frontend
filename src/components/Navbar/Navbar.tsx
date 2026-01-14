import { Link, useNavigate } from "react-router";
import Logo from "../../assets/logomesa.png";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro que deseas salir?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  return (
    <>
      <nav className="bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="shrink-0 flex items-center">
              <img src={Logo} alt="logo-mesa" className="h-12 w-auto mr-3" />
              <Link to="/">
                <h1 className="font-bold text-white text-xl">SISTEMAS</h1>
              </Link>
            </div>

            {isAuthenticated && user && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end text-white">
                  <span className="font-bold text-sm leading-tight mb-1">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-200 bg-white/20 px-2 rounded-full">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-white/10 rounded-full 
                  transition-colors flex items-center gap-2 group hover:cursor-pointer"
                  title="Cerrar sesión"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 group-hover:text-red-300 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
