import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { MainNav } from './MainNav';
import { MobileNav } from './MobileNav';
import { ModeToggle } from './ModeToggle';
import { UserNav } from './UserNav';
import SupportDrawer from '../SupportDrawer';

export default function SiteHeader(): ReactElement {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b dark:border-b-gray-700 bg-background dark:hover:text-white backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 justify-end items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <QuestionMarkCircledIcon className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Support</SheetTitle>
                <SheetDescription>
                  Need help? We got you covered.
                </SheetDescription>
              </SheetHeader>
              <SupportDrawer />
              <SheetFooter className="pt-20">
                <SheetClose asChild>
                  <Button>Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
