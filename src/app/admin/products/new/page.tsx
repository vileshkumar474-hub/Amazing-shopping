'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { products } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const sizes = ['30', '32', '34', '36', '38', '40', '42', 'S', 'M', 'L', 'XL'];

export default function AdminProductNewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes(prev => [...prev, size]);
    } else {
      setSelectedSizes(prev => prev.filter(s => s !== size));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct = {
      id: `prod-${products.length + 1}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      brand: formData.get('brand') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
      sizes: selectedSizes,
      weight: Number(formData.get('weight')),
      manufacturer: formData.get('manufacturer') as string,
      imageId: `prod-${products.length + 1}`, // Placeholder for now
      rating: 0,
      reviewCount: 0,
      featured: false,
    };

    // In a real app, you would send this to a server.
    // For now, we'll just add it to the in-memory array.
    products.push(newProduct);

    toast({
      title: 'Product Added!',
      description: `${newProduct.name} has been added to the store.`,
    });

    router.push('/admin/products');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" placeholder="e.g. Stylish Blue Dress" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Describe the product..." required/>
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
                <Input id="price" name="price" type="number" placeholder="e.g. 2999" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
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
                <Input id="brand" name="brand" placeholder="e.g. Chic Boutique" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" name="tags" placeholder="e.g. formal, party wear, elegant" />
              </div>
              <div className="space-y-2">
                <Label>Sizes</Label>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => (
                    <div key={size} className="flex items-center gap-2">
                      <Checkbox 
                        id={`size-${size}`} 
                        onCheckedChange={(checked) => handleSizeChange(size, !!checked)}
                      />
                      <Label htmlFor={`size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (grams)</Label>
                <Input id="weight" name="weight" type="number" placeholder="e.g. 500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" name="manufacturer" placeholder="e.g. Fashion House Inc." />
              </div>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full">Save Product</Button>
        </div>
      </form>
    </div>
  );
}
