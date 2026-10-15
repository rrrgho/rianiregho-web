"use client";

import { useActionState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { login, type LoginState } from "@/lib/actions/auth";
import { AlertCircleIcon } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {}
  );

  return (
    <div className="flex">
      <div className="w-full h-screen  flex justify-center items-center">
        <div className="w-full lg:w-[400px] px-10 lg:px-0">
          <Card>
            <CardHeader>
              <CardTitle>
                <h1>Login!</h1>
              </CardTitle>
              <CardDescription>
                Login to manage the website content !
              </CardDescription>
              {state.error && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>{state.error}</AlertTitle>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <form action={formAction} className="flex flex-col gap-6">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="rian@iregho.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    required
                  />
                </Field>
                <Button
                  type="submit"
                  disabled={pending}
                  className="w-full cursor-pointer"
                >
                  {pending ? <Spinner /> : <span>Login</span>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
