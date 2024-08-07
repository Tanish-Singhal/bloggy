"use client"; 

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const credentialSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  username: z.string().min(4, "Username must be at least 4 characters long"),
});

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = credentialSchema.safeParse({
      username: username,
      email: email,
      password: password,
    });

    if (!result.success) {
      return console.error(result.error.errors);
    }

    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });
    console.log(res);

    if (res.ok) {
      router.push("/signin")
    }
    else {
      console.error("Registration Failed");
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] flex justify-center">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Create an Account
            </h1>

            <p className="mt-3 text-xl text-muted-foreground">
              Create your account by filling out the below boxes
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="text">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Tanish1887"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <Button type="submit" className="w-full" onClick={handleSignup}>
              Create
            </Button>

            <Separator asChild className="bg-background">
              <div className="py-3 flex items-center text-xs text-muted-foreground uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:before:border-gray-700 dark:after:border-gray-700">
                Or
              </div>
            </Separator>

            <Button variant="outline" className="w-full">
              Create using Google
            </Button>

            <Button variant="outline" className="w-full">
              Create using Github
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
              Signin
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
