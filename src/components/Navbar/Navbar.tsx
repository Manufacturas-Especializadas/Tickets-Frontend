import { Link } from "react-router";
import Logo from "../../assets/logomesa.png";

const Navbar = () => {
    return (
        <>
            <nav className="bg-primary shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <img
                                src={Logo}
                                alt="logo-mesa"
                                className="h-12 w-auto mr-3"
                            />
                            <Link to="/">
                                <h1 className="font-bold text-white text-xl">
                                    SISTEMAS
                                </h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar