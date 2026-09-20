import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-14">
      <SignUp />
    </div>
  );
}
