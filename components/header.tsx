import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { Ticket } from "lucide-react";
import SearchBar from "./searchbar";
import { ModeToggle } from "./theme-changer";

function Header() {
  return (
    <div className="border-b ">
      <div className="flex flex-col max-w-7xl mx-auto sm:px-6 lg:px-8 lg:flex-row items-center gap-4 p-4">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link href="/" className="font-bold shrink-0 relative">
            {/* <div className="border-b-2 border-blue-600 w-6 absolute -top-1 -left-2"></div>
            <div className="border-r-2 border-blue-600 h-6 absolute -top-1 -left-2"></div> */}
            <Ticket className="size-5 text-blue-600 absolute" />
            <div className="border-l-2 border-l-blue-600 left-7 h-7 absolute -top-1 transform rotate-12"></div>
            <p className="text-blue-600 tracking-wider w-fit ml-9 italic">
              Event Hive
            </p>
            {/* <div className="border-b-2 border-blue-600 w-6 absolute -right-2"></div>
            <div className="border-r-2 border-blue-600 h-5 absolute top-1 -right-2"></div> */}
          </Link>

          {/* Login and logout rules */}
          <div className="lg:hidden">
            <SignedIn>
              <div className="flex gap-2">
                <ModeToggle />
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline">Entrar</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* Searchbar */}
        <div className="w-full lg:max-w-2xl">
          <SearchBar />
        </div>

        {/* Desktop view */}
        <div className="hidden lg:block ml-auto">
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link href="/seller">
                <Button className="dark:bg-blue-900 dark:text-white hover:dark:bg-blue-800">
                  Vender Ingressos
                </Button>
              </Link>
              <Link href="/tickets">
                <Button variant="outline">Meus Ingressos</Button>
              </Link>
              <ModeToggle />
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Entrar</Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile view */}
        <div className="lg:hidden w-full flex justify-center gap-3">
          <SignedIn>
            <Link href="/seller" className="flex-1">
              <Button className="w-full dark:bg-blue-900 dark:text-white hover:dark:bg-blue-800">
                Vender Ingressos
              </Button>
            </Link>
            <Link href="/tickets" className="flex-1">
              <Button variant="outline" className="w-full">
                Meus Ingressos
              </Button>
            </Link>
          </SignedIn>
          {/* <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Entrar</Button>
            </SignInButton>
          </SignedOut> */}
        </div>
      </div>
    </div>
  );
}

export default Header;
