'use client';

import {
  Menu,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react';
import Link from 'next/link';
import Logo from '../shared/Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useCart } from '@/context/CartProvider';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/orders', label: 'My Orders' },
  { href: '/#featured', label: 'Deals' },
];

export default function Header() {
  const { state } = useCart();
  const router = useRouter();
  const cartItemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      router.push(`/products?search=${query}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo className="hidden md:flex" />
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Logo className="mb-8" />
              <nav className="grid gap-6 text-lg font-medium">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Logo className="md:hidden" />
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden w-full max-w-sm items-center sm:flex"
          >
            <div className="relative w-full">
              <Input
                type="search"
                name="search"
                placeholder="Search products..."
                className="w-full rounded-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href="/cart" aria-label="Shopping Cart">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </div>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="/account" aria-label="My Account">
                <User className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
