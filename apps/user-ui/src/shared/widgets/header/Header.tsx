'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../../../components/layout';
import { Button } from '../../../components/ui/button';
import SearchBar from './SearchBar';
import { useUser } from 'apps/user-ui/src/hooks/useAuthUser';

const Header = () => {
  const  {data: user} = useUser();

  console.log(user);
  return (
    <header className="border-b border-brand-muted/20 bg-white shadow-sm font-sora">
      <Container className="py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src={'/logo.png'}
              alt="Hamsoya"
              width={59}
              height={29}
              className="object-contain h-[36px]"
              priority={true}
            />
            <h1 className="text-[24px] font-bold text-brand-primary hidden sm:block">
              Hamsoya
            </h1>
          </Link>

          {/* Search Section */}
          <SearchBar className="flex-1 max-w-2xl mx-2 md:mx-4" />

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Wishlist */}
            <Button
              size={'icon'}
              variant={'ghost'}
              className="rounded-full p-2 border border-[#1B1B1B1A]"
            >
              <Image
                src="/wishlist.svg"
                alt="Wishlist"
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
                priority={true}
              />
            </Button>

            {/* Cart */}
            <Button
              className="rounded-full p-2 border border-[#1B1B1B1A]"
              size={'icon'}
              variant={'ghost'}
            >
              <Image
                src="/cart.svg"
                alt="Cart"
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </Button>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant={'ghost'}
                className="rounded-full border border-[#1B1B1B1A] hover:bg-gray-50"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white px-4 py-2 hidden sm:inline-flex"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
