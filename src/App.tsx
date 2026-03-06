import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { showError, showAccount } from "./utils/alert";
import axiosInstance from "./api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Wifi, Mail, Lock, LogIn, Zap, LoaderCircle } from "lucide-react";
import type { accountInterface } from "./types/account.type";


export default function LoginPage() {

  const [accounts, setAccounts] = useState<accountInterface[] | null>(null);

  const { data , refetch } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => axiosInstance.get("/availableAccounts"),
    refetchInterval : 5000,
  });


  useEffect(() => {
    if (data?.data) setAccounts(data.data);
  }, [data]);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) navigate("/home");
  }, [])

  const seederMutation = useMutation({
    mutationFn: () => axiosInstance.post("/seeder"),
    onSuccess: (response) => {
      showAccount(response.data);
      setEmail(response.data.email)
      setPassword("12345")
      refetch()
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Seed User failed");
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      axiosInstance.post("/login", data),
    onSuccess: (data: { data: { token: string } }) => {
      localStorage.setItem("token", data.data.token);
      setEmail("")
      setPassword("")
      navigate("/home");
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Login failed");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };
  
  const autoFill = (email : string) => {
    setEmail(email)
    setPassword("12345")
  };

  if(!accounts) return(
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center max-w-sm">
            <h2 className="text-lg font-semibold text-white mb-2">
              Server Sleeping
            </h2>

            <p className="text-sm text-slate-300">
              The server is currently sleeping because it is hosted on free hosting.
              Please wait <span className="font-semibold text-sky-400">1-5 minutes</span> for it to wake up.
            </p>

            <p className="text-xs text-slate-500 mt-3">
              Thank you for your patience.
            </p>
          </div>
        </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative">

    
      <div className="absolute top-5 left-5 max-h-64 w-60 overflow-y-auto bg-slate-800/70 p-3 rounded-lg">
        <p className="text-slate-200 font-semibold mb-2 text-sm"> {accounts.length == 0 ? "No Available Account": "Available User Accounts"}  </p>
        {accounts.map((account) => (
          <div key={account.email} className="text-slate-100 mb-2 border-b border-slate-700 pb-2">
            <p className="text-xs"><strong>Name:</strong> {account.name}</p>
            <p className="text-xs"><strong>Email:</strong> {account.email}</p>
            <p className="text-xs"><strong>Password:</strong> 12345</p>
            <button
              onClick={() => autoFill(account.email)}
              className="mt-1 w-full flex items-center justify-center gap-1 bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium py-1 rounded transition-colors"
            >
              AutoFill
            </button>
          </div>
        ))}
      </div>

      {/* User Seeder — top right */}
      <div className="absolute top-5 right-5 text-right">
        <p className="text-xs text-slate-500 mb-1.5">Click to generate a user account</p>
        <button onClick={() => seederMutation.mutate()} disabled={seederMutation.isPending} className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 border border-green-800  text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors">
          {seederMutation.isPending ? ( <LoaderCircle size={13} className="animate-spin text-white"  />) : (<Zap size={13} className="text-white" />)}
          
          User Seeder
        </button>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.6)]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Wifi size={20} className="text-sky-400" />
          <span className="font-semibold text-slate-100 tracking-tight text-sm uppercase">
            IP Tracer
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-100 mb-1">Welcome back</h2>
        <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>

        <form
          onSubmit={handleLogin}
          className="flex flex-col"
        >
          {/* Email */}
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Email
            </label>

            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Password
            </label>

            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            <LogIn size={15} />
            {mutation.isPending ? "Signing in…" : "Sign In"}
          </button>

          {/* Error */}
          {mutation.isError && (
            <p className="text-red-400 text-xs text-center mt-4">
              {(mutation.error as any)?.response?.data?.message || "Login failed"}
            </p>
          )}
        </form>
              
        {/* Inline error */}
        {mutation.isError && (
          <p className="text-red-400 text-xs text-center mt-4">
            {(mutation.error as any)?.response?.data?.message || "Login failed"}
          </p>
        )}
      </div>
      
    </div>
  );
}