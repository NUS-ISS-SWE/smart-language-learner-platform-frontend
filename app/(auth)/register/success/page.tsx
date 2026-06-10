import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function RegisterSuccessPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <CardTitle>Account created</CardTitle>
        <CardDescription>
          Please visit your email to activate your Smart Language Learner Platform account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-center">
        <p className="rounded-lg border bg-muted p-4 text-sm text-muted-foreground">
          Check the email inbox you used during registration, then activate the account before logging in.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Go to login</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
