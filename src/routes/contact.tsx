import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & support — Northbridge Portal" },
      { name: "description", content: "Reach the Northbridge academic office, read support FAQs or send the team a message." },
      { property: "og:title", content: "Contact & support — Northbridge Portal" },
      { property: "og:description", content: "Support hours, contact details and frequently asked questions." },
    ],
  }),
  component: ContactPage,
});

/** All user input is validated before it is accepted — never trusted as-is. */
const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address").max(120),
  topic: z.string().trim().min(3, "Add a short subject").max(120),
  message: z.string().trim().min(20, "Please describe your query in at least 20 characters").max(1000),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

function ContactPage() {
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = contactSchema.safeParse(Object.fromEntries(form));

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    event.currentTarget.reset();
    toast.success("Message received", {
      description: "This demo does not send email — your message was validated and discarded.",
    });
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Contact & support</h1>
          <p className="max-w-2xl text-muted-foreground">
            Academic queries, technical support and admissions — the office responds within one working day.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard title="Send a message" description="All fields are validated before submission.">
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} />
                    {errors.name ? <p className="text-xs text-danger">{errors.name}</p> : null}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} />
                    {errors.email ? <p className="text-xs text-danger">{errors.email}</p> : null}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="topic">Subject</Label>
                  <Input id="topic" name="topic" aria-invalid={Boolean(errors.topic)} />
                  {errors.topic ? <p className="text-xs text-danger">{errors.topic}</p> : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" rows={5} aria-invalid={Boolean(errors.message)} />
                  {errors.message ? <p className="text-xs text-danger">{errors.message}</p> : null}
                </div>
                <Button type="submit">Send message</Button>
              </form>
            </SectionCard>

            <SectionCard title="Frequently asked questions">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-sm">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <SectionCard title="Contact information">
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <MapPin aria-hidden className="mt-0.5 size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Northbridge Institute, Academic Block A, Bengaluru 560001</span>
                </li>
                <li className="flex gap-3">
                  <Mail aria-hidden className="mt-0.5 size-4 text-muted-foreground" />
                  <a className="text-foreground hover:underline" href="mailto:support@northbridge.edu">
                    support@northbridge.edu
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone aria-hidden className="mt-0.5 size-4 text-muted-foreground" />
                  <a className="text-foreground hover:underline" href="tel:+918000000000">
                    +91 80 0000 0000
                  </a>
                </li>
              </ul>
            </SectionCard>

            <SectionCard title="Support hours">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex justify-between"><span>Monday – Friday</span><span>09:00 – 18:00</span></li>
                <li className="flex justify-between"><span>Saturday</span><span>10:00 – 14:00</span></li>
                <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
              </ul>
            </SectionCard>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
