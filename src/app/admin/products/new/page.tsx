// This is a placeholder for the new product page.
// In a real application, you would have a form to create a new product.

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const sizes = ['30', '32', '34', '36', '38', '40', '42', 'S', 'M', 'L', 'XL'];

export default function AdminProductNewPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Stylish Blue Dress" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the product..." />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Images (up to 6)</CardTitle></CardHeader>
            <CardContent>
              <Input type="file" multiple accept="image/*" />
              {/* Image previews would go here */}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Properties</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" placeholder="e.g. 2999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dresses">Dresses</SelectItem>
                    <SelectItem value="Shoes">Shoes</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Skirts">Skirts</SelectItem>
                    <SelectItem value="Jackets">Jackets</SelectItem>
                    <SelectItem value="Tops">Tops</SelectItem>
                    <SelectItem value="Trousers">Trousers</SelectItem>
                    <SelectItem value="Bra & Panty Sets">Bra & Panty Sets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand Name</Label>
                <Input id="brand" placeholder="e.g. Chic Boutique" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" placeholder="e.g. formal, party wear, elegant" />
              </div>
              <div className="space-y-2">
                <Label>Sizes</Label>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => (
                    <div key={size} className="flex items-center gap-2">
                      <Checkbox id={`size-${size}`} />
                      <Label htmlFor={`size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (grams)</Label>
                <Input id="weight" type="number" placeholder="e.g. 500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" placeholder="e.g. Fashion House Inc." />
              </div>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full">Save Product</Button>
        </div>
      </form>
    </div>
  );
}
