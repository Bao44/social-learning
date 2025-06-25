import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to My Next.js App!</h1>
      <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-30">
        Click me
      </Button>
      <p className="mt-4 text-lg">
        This is a simple example of a Next.js application.
      </p>

      <Avatar className="h-20 w-20">
        <AvatarImage
          src="https://github.com/shadcn.png"
        />
      </Avatar>
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        width={200}
        height={200}
        className="mt-8"
      />
    </main>
  );
}
