import { useEffect, useState, useRef } from "react";
import {  useMutation, useQuery } from "@tanstack/react-query";
import { confirmAlert, showError } from "../utils/alert";
import axios from "axios";
import type { IPGeoInterface } from "../types/geolocation.type";
import Map from "../components/map";
import { validateIP } from "../utils/function";
import axiosInstance from "../api/axiosInstance";
import type { historyInterface } from "../types/history.type";
import { useNavigate } from "react-router-dom";
import { Globe, Search, Trash2, LogOut, MapPin, Building2, Clock, Hash, Server, Navigation, Mail, RotateCcw, History, Eye, Wifi } from "lucide-react";
import PageSkeleton from "../components/loading";


export default function HomePage() {

  const navigate = useNavigate();

  const resultRef = useRef<HTMLDivElement>(null);


  const [ip, setIp] = useState("");
  const [ipGeoLoc, setIpGeoLoc] = useState<IPGeoInterface | null>(null);
  const [history, setHistory] = useState<historyInterface[] | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);

  const { data : geoLocData, isLoading : geoLocLoading, refetch : geoLocRefetch } = useQuery({
    queryKey: ["ipgeoloc"],
    queryFn: () => axios.get(`https://ipinfo.io//geo`),
  });

  const { data : historyData, isLoading : historyLoading, refetch : historyRefetch } = useQuery({
    queryKey: ["history"],
    queryFn: () => axiosInstance.get("/history"),
  });
  


  useEffect(() => {
    if (historyData?.data) setHistory(historyData.data);
  }, [historyData]);

  useEffect(() => {
    if (geoLocData?.data) setIpGeoLoc(geoLocData.data);
  }, [geoLocData]);

  const recordMutation = useMutation({
    mutationFn: (ip: string) => axios.get(`https://ipinfo.io/${ip}/json`),
    onSuccess: async (response) => {
      setIpGeoLoc(response.data);
      const res = await axiosInstance.post(`/history/${response.data.ip}`)
      console.log(res.data)
      historyRefetch()
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Search failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (history: string[]) => axiosInstance.post(`/history/delete`, { history }),
    onSuccess: async (response) => {
      setSelectedHistory([])
      historyRefetch()
      console.log(response.data)
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Fetch failed");
    },
  });


  const isSelected = (id: string) => selectedHistory.includes(id);

  const toggleSelection = (id: string) => {
    setSelectedHistory((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedHistory)
  }



  const handleSearch = (searchIp : string) => {
    if (!validateIP(searchIp)) {
      showError("Invalid IP address format");
      return;
    }
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    recordMutation.mutate(searchIp);
  };

  
  const clear = () => {
    setIp("")
    geoLocRefetch()
  };

  const logout = () => {
    confirmAlert("logout", "logout", () => {
      localStorage.clear();
      navigate('/')
    })
  }

  if (geoLocLoading || recordMutation.isPending || historyLoading || !history) return <PageSkeleton/>;

  
return (
  <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

    {/* ── Top nav ── */}
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur  top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-400">
          <Wifi size={20} />
          <span className="font-semibold text-slate-100 tracking-tight text-sm uppercase">
            IP Tracer
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>

    <main className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">

      {/* ── Search card ── */}
      <section ref={resultRef}>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          IP Lookup
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4">
          {/* Input + Lookup */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(ip)}
                placeholder="e.g. 8.8.8.8"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition"
              />
            </div>
            <button
              onClick={() => handleSearch(ip)}
              disabled={recordMutation.isPending}
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Globe size={14} />
              {recordMutation.isPending ? "Looking up…" : "Lookup"}
            </button>
          </div>

          {/* Clear */}
          <button
            onClick={clear}
            disabled={geoLocLoading}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-500 px-3 py-2 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
            {geoLocLoading ? "Clearing…" : "Clear"}
          </button>
        </div>
      </section>

      {/* ── Result ── */}
      {ipGeoLoc && (
        <section  >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Result
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Info card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Live result</span>
              </div>

              {[
                { icon: <Hash size={14} />,       label: "IP",           value: ipGeoLoc.ip },
                { icon: <Server size={14} />,     label: "Hostname",     value: ipGeoLoc.hostname },
                { icon: <MapPin size={14} />,     label: "City",         value: ipGeoLoc.city },
                { icon: <Navigation size={14} />, label: "Region",       value: ipGeoLoc.region },
                { icon: <Globe size={14} />,      label: "Country",      value: ipGeoLoc.country },
                { icon: <MapPin size={14} />,     label: "Coordinates",  value: ipGeoLoc.loc },
                { icon: <Building2 size={14} />,  label: "Organization", value: ipGeoLoc.org },
                { icon: <Mail size={14} />,       label: "Postal",       value: ipGeoLoc.postal },
                { icon: <Clock size={14} />,      label: "Timezone",     value: ipGeoLoc.timezone },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 text-sm border-b border-slate-800 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-slate-500 mt-0.5 shrink-0">{icon}</span>
                  <span className="text-slate-500 w-24 shrink-0">{label}</span>
                  <span className="text-slate-100 font-medium break-all">{value || "—"}</span>
                </div>
              ))}
            </div>

            {/* Map */}
            <div
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
              style={{ height: "420px" }}
            >
              <Map mapKey={ipGeoLoc.ip} loc={ipGeoLoc.loc} />
            </div>
          </div>
        </section>
      )}

      {/* ── History ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History size={15} className="text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Search History
            </p>
          </div>
          <button
            onClick={handleDelete}
            className={` ${selectedHistory.length === 0 && "hidden"} flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed border border-red-900/50 hover:border-red-700 px-3 py-1.5 rounded-lg transition-colors`}
          >
            <Trash2 size={13} />
            Delete{selectedHistory.length > 0 ? ` (${selectedHistory.length})` : ""}
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {history.length === 0 && (
            <div className="py-12 text-center text-slate-600 text-sm">
              No searches yet. Look up an IP above.
            </div>
          )}

          {history.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/50 transition-colors"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSelected(item._id)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSelection(item._id);
                }}
                className="accent-sky-500 w-4 h-4 rounded cursor-pointer"
              />

              {/* IP badge */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <Globe size={13} className="text-sky-400 shrink-0" />
                <span className="text-sm font-mono text-slate-100 truncate">
                  {item.ip}
                </span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                <Clock size={12} />
                {item.searchedAt}
              </div>

              {/* View button */}
              <button
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 border border-sky-900/50 hover:border-sky-700 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSearch(item.ip);
                }}
              >
                <Eye size={12} />
                View
              </button>
            </div>
          ))}
        </div>
      </section>

    </main>
  </div>
);
}