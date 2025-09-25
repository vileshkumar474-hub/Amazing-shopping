import Link from 'next/link';
import Logo from '../shared/Logo';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import VisitorCounter from '../shared/VisitorCounter';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Your ultimate shopping destination for the latest trends.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Dresses" className="text-muted-foreground hover:text-primary">
                  Dresses
                </Link>
              </li>
              <li>
                <Link href="/products?category=Shoes" className="text-muted-foreground hover:text-primary">
                  Shoes
                </Link>
              </li>
              <li>
                <Link href="/products?category=Accessories" className="text-muted-foreground hover:text-primary">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-primary">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-primary">
                  Order Tracking
                </Link>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
