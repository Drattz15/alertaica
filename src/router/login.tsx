import LoginForm from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <img
            src="https://media.discordapp.net/attachments/1303499047058800745/1310400532527054898/ac830d22-9071-4d58-a056-18d99dfaac6b.png?ex=67451519&is=6743c399&hm=621243352bcec482d8e6a91e0c343978531a47f391d189c906fff8ca821662bd&=&format=webp&quality=lossless&width=401&height=352"
            alt="Logo de la app"
            className="h-36 w-36 object-contain rounded-full border-4 border-gray-700 shadow-md"
          />
          <h1 className="text-4xl font-bold text-white font-mono text-center">
            Alerta ICA
          </h1>
        </div>
        <Card className="w-full max-w-sm shadow-lg rounded-lg border border-gray-700 bg-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-white">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-gray-400">
              Ingresa tu DNI y contraseña para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <LoginForm />
          </CardContent>
          <CardFooter className="text-center">
            <div className="text-sm text-gray-400">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="underline text-blue-400 hover:text-blue-600">
                Regístrate
              </Link>
            </div>
          </CardFooter>
        </Card>
        <div className="text-sm text-gray-400">
          <Link to="/forgot-password" className="underline text-blue-400 hover:text-blue-600">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
