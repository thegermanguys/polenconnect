import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-14">
      <SignIn />
    </div>
  );
}
