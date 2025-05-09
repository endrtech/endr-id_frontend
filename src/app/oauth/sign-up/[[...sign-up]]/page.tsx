"use client";
import Head from "next/head";
import Image from "next/image";
import { Geist, Space_Grotesk } from "next/font/google";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import * as SignUp from "@clerk/elements/sign-up";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  LinkIcon,
  Loader2,
  MailCheck,
  TextCursorInput,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { getAppConfig } from "@/actions/getAppConfig";
import { useCallback, useEffect, useState } from "react";
import {
  permanentRedirect,
  redirect,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

const geistSans = Space_Grotesk({
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const [getAppConfigData, setAppConfigData] = useState<any>();
  const params = useSearchParams();
  const clientIdParam = params.get("clientId");
  const redirectUrl = params.get("redirectUrl");

  const user = useAuth();

  useEffect(() => {
    const getData = async () => {
      const clientId = window.localStorage.getItem("clientID");
      if (clientId) {
        const getAppConfigData = await getAppConfig(clientId);
        setAppConfigData(getAppConfigData);
      } else {
        const getAppConfigData = await getAppConfig(clientIdParam);
        window.localStorage.setItem("clientID", getAppConfigData.applicationID);
        window.localStorage.setItem(
          "redirectUrl",
          redirectUrl ? redirectUrl : getAppConfigData.afterAuthUrl,
        );
        setAppConfigData(getAppConfigData);
      }
    };

    getData();
  }, []);

  if (user.userId) {
    return router.replace("/");
  }

  return (
    <div
      className={`${geistSans.className} text-white w-full h-screen flex flex-col items-center justify-center`}
      style={{
        background: `url('${getAppConfigData?.applicationWallpaper}')`,
      }}
    >
      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignUp.Step
                name="start"
                className="min-w-[30%] flex flex-col items-start p-6 dark bg-background backdrop-blur-lg shadow-zinc-900/40 rounded-lg border-1 border-zinc-800 shadow-xl"
              >
                <Image
                  src={"/endr-id.svg"}
                  width={80}
                  height={80}
                  alt="ENDR ID"
                  className="-ml-5"
                />
                <h1 className="text-2xl font-bold">Sign up with ENDR ID</h1>
                <h1 className="text-md font-medium text-zinc-400">
                  to continue to {getAppConfigData?.applicationName}
                </h1>
                <Clerk.Field
                  name="emailAddress"
                  className="w-full mt-4 flex flex-col items-start gap-2"
                >
                  <Clerk.Label asChild>
                    <Label>Email address</Label>
                  </Clerk.Label>
                  <Clerk.Input type="email" required asChild>
                    <Input
                      className="w-full px-4 py-2 bg-zinc-800 border-zinc-700 text-sm"
                      placeholder="hello@email.com"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError className="block text-sm text-destructive" />
                </Clerk.Field>
                <Clerk.Field
                  name="password"
                  className="w-full mt-4 flex flex-col items-start gap-2"
                >
                  <Clerk.Label asChild>
                    <Label>Password</Label>
                  </Clerk.Label>
                  <Clerk.Input type="password" required asChild>
                    <Input
                      className="w-full px-4 py-2 bg-zinc-800 border-zinc-700 text-sm"
                      placeholder="••••••••••••"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError className="block text-sm text-destructive" />
                </Clerk.Field>
                <div className="flex flex-row items-center w-full justify-end mt-4 mb-2">
                  <SignUp.Captcha className="empty:hidden" />
                  <SignUp.Action submit asChild>
                    <Button
                      disabled={isGlobalLoading}
                      variant="outline"
                      className="dark text-white"
                    >
                      <Clerk.Loading>
                        {(isLoading) => {
                          return isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            "Continue"
                          );
                        }}
                      </Clerk.Loading>
                    </Button>
                  </SignUp.Action>
                </div>
                <Separator className="mt-2" />
                <div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
                  <Label className="dark text-white">Have an account?</Label>
                  <Button variant="link" className="dark text-white" asChild>
                    <Link
                      href={`/oauth/authorize?clientId=${getAppConfigData?.applicationID}`}
                    >
                      Sign in
                    </Link>
                  </Button>
                </div>
              </SignUp.Step>

              <SignUp.Step
                name="verifications"
                className="min-w-[30%] flex flex-col items-start p-6 dark bg-background backdrop-blur-lg shadow-zinc-900/40 rounded-lg border-1 border-zinc-800 shadow-xl"
              >
                <SignUp.Strategy name="email_code">
                  <Image
                    src={"/endr-id.svg"}
                    width={80}
                    height={80}
                    alt="MYMOD"
                    className="-ml-5"
                  />
                  <h1 className="text-2xl font-bold">Check your email!</h1>
                  <h1 className="text-md font-medium text-zinc-400">
                    We sent a code to your email. Enter the code below to
                    complete sign up.
                  </h1>
                  <Clerk.Field
                    name="code"
                    className="flex flex-col gap-2 items-start justify-start mt-4"
                  >
                    <Clerk.Input
                      type="otp"
                      required
                      className="flex justify-center gap-1"
                      render={({ value, status }) => (
                        <div
                          data-status={status}
                          className="relative h-9 w-8 rounded-md dark bg-background ring-1 ring-inset ring-zinc-800 data-[status=selected]:bg-zinc-400/10 data-[status=selected]:shadow-[0_0_8px_2px_theme(colors.zinc.400/30%)] data-[status=selected]:ring-zinc-400"
                        >
                          <AnimatePresence>
                            {value && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.75 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.75 }}
                                className="absolute inset-0 flex items-center justify-center text-white"
                              >
                                {value}
                              </motion.span>
                            )}
                            {value}
                          </AnimatePresence>
                          {status === "cursor" && (
                            <motion.div
                              layoutId="otp-input-focus"
                              transition={{
                                ease: [0.2, 0.4, 0, 1],
                                duration: 0.2,
                              }}
                              className="absolute animate-pulse inset-0 z-10 rounded-[inherit] border border-zinc-400 bg-zinc-400/10 shadow-[0_0_8px_2px_theme(colors.zinc.400/30%)]"
                            />
                          )}
                        </div>
                      )}
                    />
                    <Clerk.FieldError />
                  </Clerk.Field>
                  <div className="flex flex-row items-center w-full justify-end gap-2 mt-4">
                    <SignUp.Action
                      asChild
                      resend
                      className="text-muted-foreground"
                      fallback={({ resendableAfter }: any) => (
                        <Button variant="link" size="sm" disabled>
                          Didn&apos;t receive a code? Resend (
                          <span className="tabular-nums">
                            {resendableAfter}
                          </span>
                          )
                        </Button>
                      )}
                    >
                      <Button type="button" variant="link" size="sm">
                        Didn&apos;t receive a code? Resend
                      </Button>
                    </SignUp.Action>
                    <SignUp.Action submit asChild>
                      <Button variant="outline" className="dark text-white">
                        Continue
                      </Button>
                    </SignUp.Action>
                  </div>
                </SignUp.Strategy>
              </SignUp.Step>

              <SignUp.Step
                name="continue"
                className="min-w-[30%] flex flex-col items-start p-6 dark bg-background backdrop-blur-lg shadow-zinc-900/40 rounded-lg border-1 border-zinc-800 shadow-xl"
              >
                <Image
                  src={"/endr-id.svg"}
                  width={80}
                  height={80}
                  alt="ENDR ID"
                  className="-ml-5"
                />
                <h1 className="text-2xl font-bold">One last step!</h1>
                <h1 className="text-md font-medium text-zinc-400">
                  Some housekeeping questions.
                </h1>
                <Clerk.Field
                  name="legalAccepted"
                  className="w-full mt-4 flex flex-row items-start gap-2"
                >
                  <Clerk.Input type="checkbox" required />
                  <Clerk.Label asChild>
                    <Label>
                      I agree to the{" "}
                      <a href="https://endr.tech/legal/terms" target="_blank">
                        Terms and Conditions
                      </a>
                      , and{" "}
                      <a href="https://endr.tech/legal/privacy" target="_blank">
                        Privacy Policy
                      </a>
                      .
                    </Label>
                  </Clerk.Label>
                  <Clerk.FieldError className="block text-sm text-destructive" />
                </Clerk.Field>
                <div className="flex flex-row items-center w-full justify-end mt-4">
                  <SignUp.Action submit asChild>
                    <Button
                      disabled={isGlobalLoading}
                      variant="outline"
                      className="dark text-white"
                    >
                      <Clerk.Loading>
                        {(isLoading) => {
                          return isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            "Finish signup"
                          );
                        }}
                      </Clerk.Loading>
                    </Button>
                  </SignUp.Action>
                </div>
              </SignUp.Step>
            </>
          )}
        </Clerk.Loading>
      </SignUp.Root>
    </div>
  );
}
