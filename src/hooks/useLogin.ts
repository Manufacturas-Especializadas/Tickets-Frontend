import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { authService } from "../api/services/authService";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    payRollNumber: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.payRollNumber || !formData.password) {
      Swal.fire("Error", "Todos los campos son obligaro");
    }

    setLoading(true);

    try {
      const response = await authService.login(
        Number(formData.payRollNumber),
        formData.password
      );

      login(response);

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Sesión iniciada correctamente",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/administrador");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Error al iniciar sesión";
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
  };
};
