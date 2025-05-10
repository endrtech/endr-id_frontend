"use client";
import Head from "next/head";
import Image from "next/image";
import { Geist, Space_Grotesk } from "next/font/google";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  Link,
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
      const getAppConfigFn = await getAppConfig(clientIdParam);
      window.localStorage.setItem("clientID", getAppConfigFn.applicationID);
      window.localStorage.setItem(
        "redirectUrl",
        redirectUrl ? redirectUrl : getAppConfigFn.afterAuthUrl,
      );
      setAppConfigData(getAppConfigFn);
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
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step
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
                <h1 className="text-2xl font-bold">Sign in with ENDR ID</h1>
                <h1 className="text-md font-medium text-zinc-400">
                  to continue to {getAppConfigData?.applicationName}
                </h1>
                <Clerk.Field
                  name="identifier"
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
                <div className="flex flex-row items-center w-full justify-end mt-4 mb-2">
                  <SignIn.Action submit asChild>
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
                  </SignIn.Action>
                </div>
                <Separator className="mt-2" />
                <div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
                  <Label className="dark text-white">
                    Don&apos;t have an account?
                  </Label>
                  <Button variant="link" className="dark text-white" asChild>
                    <a href="/oauth/sign-up">Sign up</a>
                  </Button>
                </div>
              </SignIn.Step>

              <SignIn.Step
                name="verifications"
                className="min-w-[30%] flex flex-col items-start p-6 dark bg-background backdrop-blur-lg shadow-zinc-900/40 rounded-lg border-1 border-zinc-800 shadow-xl"
              >
                <SignIn.Strategy name="email_code">
                  <Image
                    src={"/endr-id.svg"}
                    width={80}
                    height={80}
                    alt="MYMOD"
                    className="-ml-5"
                  />
                  <h1 className="text-2xl font-bold">Check your email!</h1>
                  <h1 className="text-md font-medium text-zinc-400">
                    We sent a code to{" "}
                    <span className="text-white">
                      <SignIn.SafeIdentifier />
                    </span>
                    .
                  </h1>
                  <Clerk.Field
                    name="code"
                    className="flex flex-col gap-2 items-start justify-start mt-4"
                  >
                    <Clerk.Input
                      type="otp"
                      name="code"
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
                    <SignIn.Action
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
                    </SignIn.Action>
                    <SignIn.Action submit asChild>
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
                    </SignIn.Action>
                  </div>
                </SignIn.Strategy>

                <SignIn.Strategy name="password">
                  <Image
                    src={"/endr-id.svg"}
                    width={80}
                    height={80}
                    alt="MYMOD"
                    className="-ml-5"
                  />
                  <h1 className="text-2xl font-bold">Welcome back!</h1>
                  <h1 className="text-md font-medium text-zinc-400">
                    Enter your password
                  </h1>
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

                  <div className="flex flex-row items-center w-full justify-end gap-2 mt-4">
                    <SignIn.Action submit asChild>
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
                    </SignIn.Action>
                  </div>
                  <Separator className="mt-6" />
                  <div className="flex flex-row items-center justify-between w-full gap-2 mt-4">
                    <SignIn.Action navigate="forgot-password" asChild>
                      <Button variant="ghost" className="dark text-white">
                        Forgot password?
                      </Button>
                    </SignIn.Action>
                    <SignIn.Action navigate="choose-strategy" asChild>
                      <Button variant="ghost" className="dark text-white">
                        Choose another method
                      </Button>
                    </SignIn.Action>
                  </div>
                </SignIn.Strategy>

                <SignIn.Strategy name="reset_password_email_code">
                  <Image
                    src={"/endr-id.svg"}
                    width={80}
                    height={80}
                    alt="MYMOD"
                    className="-ml-5"
                  />
                  <h1 className="text-2xl font-bold">Check your email!</h1>
                  <h1 className="text-md font-medium text-zinc-400">
                    We sent a code to{" "}
                    <span className="text-white">
                      <SignIn.SafeIdentifier />
                    </span>
                    .
                  </h1>
                  <Clerk.Field
                    name="code"
                    className="flex flex-col gap-2 items-start justify-start mt-4"
                  >
                    <Clerk.Input
                      type="otp"
                      name="code"
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
                    <SignIn.Action
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
                    </SignIn.Action>
                    <SignIn.Action submit asChild>
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
                    </SignIn.Action>
                  </div>
                </SignIn.Strategy>
              </SignIn.Step>

              <SignIn.Step
                name="choose-strategy"
                className="min-w-[30%] flex flex-col items-start p-6 dark bg-background backdrop-blur-lg shadow-zinc-900/40 rounded-lg border-1 border-zinc-800 shadow-xl"
              >
                <Image
                  src={"/endr-id.svg"}
                  width={80}
                  height={80}
                  alt="MYMOD"
                  className="-ml-5"
                />
                <h1 className="text-2xl font-bold">Choose another method</h1>
                <h1 className="text-md font-medium text-zinc-400">
                  How do you want to sign in to MYMOD?
                </h1>
                <div className="flex flex-col items-start justify-start gap-2 w-full mt-4">
                  <SignIn.SupportedStrategy name="email_code" asChild>
                    <Button
                      variant="outline"
                      className="dark w-full text-white"
                    >
                      <MailCheck /> Email me a code
                    </Button>
                  </SignIn.SupportedStrategy>
                  <SignIn.SupportedStrategy name="email_link" asChild>
                    <Button
                      variant="outline"
                      className="dark w-full text-white"
                    >
                      <Link /> Send me a link to sign in
                    </Button>
                  </SignIn.SupportedStrategy>
                  <div className="relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                  <SignIn.Action navigate="previous" asChild>
                    <Button variant="ghost" className="dark w-full text-white">
                      <TextCursorInput /> Login with a password
                    </Button>
                  </SignIn.Action>
                </div>
              </SignIn.Step>

              <SignIn.Step
                name="forgot-password"
                className="min-w-[30%] flex flex-col items-start p-6 dark bg-background backdrop-blur-lg shadow-zinc-900/40 rounded-lg border-1 border-zinc-800 shadow-xl"
              >
                <Image
                  src={"/endr-id.svg"}
                  width={80}
                  height={80}
                  alt="MYMOD"
                  className="-ml-5"
                />
                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                <h1 className="text-md font-medium text-zinc-400">
                  Happens to the best of us.
                </h1>
                <div className="flex flex-col items-start justify-start gap-2 w-full mt-4">
                  <SignIn.SupportedStrategy name="email_code" asChild>
                    <Button
                      variant="outline"
                      className="dark w-full text-white"
                    >
                      Reset password
                    </Button>
                  </SignIn.SupportedStrategy>
                  <div className="relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                  <SignIn.Action navigate="previous" asChild>
                    <Button variant="ghost" className="dark w-full text-white">
                      <ChevronLeft /> Go back
                    </Button>
                  </SignIn.Action>
                </div>
              </SignIn.Step>

              <SignIn.Step
                name="reset-password"
                className="min-w-[60%] flex flex-col items-start p-6 dark bg-background backdrop-blur-lg shadow-zinc-900/40 rounded-lg border-1 border-zinc-800 shadow-xl"
              >
                <Image
                  src={"/endr-id.svg"}
                  width={80}
                  height={80}
                  alt="MYMOD"
                  className="-ml-5"
                />
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <h1 className="text-md font-medium text-zinc-400">
                  Make sure its secure.
                </h1>
                <Clerk.Field
                  name="identifier"
                  className="w-full mt-4 flex flex-col items-start gap-2"
                >
                  <Clerk.Label asChild>
                    <Label>New password</Label>
                  </Clerk.Label>
                  <Clerk.Input name="password" type="password" required asChild>
                    <Input
                      className="w-full px-4 py-2 bg-zinc-800 border-zinc-700 text-sm"
                      placeholder="hello@email.com"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError className="block text-sm text-destructive" />
                </Clerk.Field>
                <Clerk.Field
                  name="identifier"
                  className="w-full mt-4 flex flex-col items-start gap-2"
                >
                  <Clerk.Label asChild>
                    <Label>Confirm password</Label>
                  </Clerk.Label>
                  <Clerk.Input
                    name="confirmPassword"
                    type="password"
                    required
                    asChild
                  >
                    <Input
                      className="w-full px-4 py-2 bg-zinc-800 border-zinc-700 text-sm"
                      placeholder="hello@email.com"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError className="block text-sm text-destructive" />
                </Clerk.Field>
                <div className="flex flex-row items-center w-full justify-end mt-4">
                  <SignIn.Action submit asChild>
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
                            "Reset password"
                          );
                        }}
                      </Clerk.Loading>
                    </Button>
                  </SignIn.Action>
                </div>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  );
}
