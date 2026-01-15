import Logo from "../../assets/logomesa.png";
import { Button } from "../../components/Button/Button";
import InputField from "../../components/Inputs/InputField";
import { useLogin } from "../../hooks/useLogin";

export const Login = () => {
  const { formData, handleChange, handleSubmit, loading } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={Logo} alt="MESA" className="h-20 w-auto" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 uppercase">
          Iniciar sesión
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <InputField
              label="Número de nómina"
              type="number"
              name="payRollNumber"
              value={formData.payRollNumber}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div>
            <InputField
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
