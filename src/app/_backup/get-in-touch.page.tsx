"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Download } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const contactFormSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  subject: z
    .string({ message: "Subject is required" })
    .min(5, "Subject must be at least 5 characters"),
  message: z
    .string({ message: "Message is required" })
    .min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function GetInTouchPage() {
  const [isSubmitting, setIsSubmitting] = useState(true);
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      try {
        setIsSubmitting(true);
        // TODO: Replace with your actual API endpoint or email service
        console.log("Form data:", data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Message sent successfully! I'll get back to you soon.");
        form.reset();
      } catch (error) {
        console.error("Failed to send message:", error);
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [form]
  );

  const handleDownloadCV = () => {
    const cvUrl = "/assets/media/resume.pdf";
    window.open(cvUrl, "_blank");
  };

  return (
    <div className="min-h-screen pt-20 px-5 lg:px-40 pb-10">
      <style jsx>{`
        @keyframes bounce-smooth {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.8);
          }
        }

        .bounce-animation {
          animation: bounce-smooth 2s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="grid md:grid-cols-2 gap-8">
        {/* CV Section */}
        <div className="flex flex-col gap-4 relative">
          <Card className="h-full flex flex-col overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl">My Resume</CardTitle>
              <CardDescription>
                Download my CV to see my full experience and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-6 relative z-10">
              <div className="flex-1 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl flex items-center justify-center min-h-96 relative">
                <div className="text-center">
                  <div className="text-8xl mb-4 bounce-animation">📄</div>
                  <p className="text-muted-foreground mb-4 font-semibold">
                    resume.pdf
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Click the amazing button below to view my complete resume
                  </p>
                </div>
              </div>
              <Button
                onClick={handleDownloadCV}
                className="w-full gap-2 h-14 text-base font-bold bounce-animation pulse-glow bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Download className="size-5" />
                Open Resume
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Get In Touch</CardTitle>
              <CardDescription>
                Feel free to reach out to me. I'll get back to you as soon as
                possible.
              </CardDescription>
              <Alert variant="destructive">
                <AlertCircleIcon color="orange" />
                <AlertTitle className="text-amber-500">
                  My apologies, this feature is still under development.
                </AlertTitle>
              </Alert>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name Field */}
                <div>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name_input">Name</FieldLabel>
                        <Input
                          {...field}
                          id="name_input"
                          aria-invalid={fieldState.invalid}
                          placeholder="Your name"
                          autoComplete="off"
                          disabled={isSubmitting}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email_input">Email</FieldLabel>
                        <Input
                          {...field}
                          id="email_input"
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="your.email@example.com"
                          autoComplete="email"
                          disabled={isSubmitting}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <Controller
                    name="subject"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="subject_input">Subject</FieldLabel>
                        <Input
                          {...field}
                          id="subject_input"
                          aria-invalid={fieldState.invalid}
                          placeholder="What is this about?"
                          autoComplete="off"
                          disabled={isSubmitting}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="message_input">Message</FieldLabel>
                        <Textarea
                          {...field}
                          id="message_input"
                          aria-invalid={fieldState.invalid}
                          placeholder="Your message here..."
                          disabled={isSubmitting}
                          rows={5}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Disabled" : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
