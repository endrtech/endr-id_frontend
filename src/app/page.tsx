"use client"
import { getAppConfig } from "@/actions/getAppConfig";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Geist } from "next/font/google";
import { permanentRedirect, redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export default function Home() {
    const router = useRouter();
    const [getAppConfigData, setAppConfigData] = useState<any>();
    const [clientId, setClientId] = useState<string | null>(null);
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            setRedirectUrl(window.localStorage.getItem("redirectUrl"));
            setClientId(window.localStorage.getItem("clientID"));
            const response = await getAppConfig(window.localStorage.getItem("clientID"));
            setAppConfigData(response);
        }
        getData();
    }, [])

    useEffect(() => {
        if (!redirectUrl) return

        const timeout = setTimeout(() => {
            router.push(redirectUrl + "?source=endr-id")
        }, 5000)

        return () => clearTimeout(timeout) // cleanup if component unmounts before timeout
    }, [redirectUrl, router])

    return (
        <div className={`${geistSans.className} text-white w-full h-screen flex flex-col items-center justify-center`} style={{
            background: `url('${getAppConfigData?.applicationWallpaper}')`,
        }}>
            <div className="min-w-[30%] flex flex-col items-center justify-center p-6 dark bg-background backdrop-blur-lg shadow-zinc-900/40 rounded-lg border-1 border-zinc-800 shadow-xl">
                <Loader2 size={32} className="animate-spin" />
                <span>Logging you into {getAppConfigData?.applicationName}...</span>
            </div>
        </div>
    )
}