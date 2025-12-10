"use client";

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
import { Separator } from "@/components/ui/separator";
import { login } from "@/lib/actions/auth";
import { AlertCircleIcon, Github } from "lucide-react";

export default function LoginPage() {
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
              <Alert variant="default">
                <AlertCircleIcon color="orange" />
                <AlertTitle className="text-primary">
                  Login with email is temporary disabled !
                </AlertTitle>
              </Alert>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <Field>
                <FieldLabel htmlFor="Email">Email</FieldLabel>
                <Input placeholder="rian@iregho.com" disabled />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input placeholder="Your password" disabled />
              </Field>

              <div>
                <Button disabled className="w-full cursor-pointer">
                  <span>Login</span>
                </Button>
              </div>

              <div className="grid grid-cols-3 flex justify-center items-center">
                <Separator />
                <div className="text-center">Login with</div>
                <Separator />
              </div>

              <div>
                <Button
                  onClick={() => login()}
                  className="w-full cursor-pointer bg-background"
                >
                  <Github className="text-primary" />
                  <span className="text-primary">Github</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
