import Image from "next/image";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-[#111]">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <div className="relative h-10 w-36">
            <Image
              src="/images/Riviere logo sin bordes.png"
              alt="RIVIERE"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <p className="mb-10 text-center text-xs uppercase tracking-[0.32em] text-riviere-smoke">
          Acceso Administrativo
        </p>

        <LoginForm />
      </div>
    </main>
  );
}
