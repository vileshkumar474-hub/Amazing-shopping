// This is a placeholder for the product edit page.
// In a real application, you would fetch the product data and populate a form.

import { getProductById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const sizes = ['30', '32', '34', '36', '38', '40', '42'];

export default function AdminProductEditPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Edit: {product.name}</h1>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" defaultValue={product.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" defaultValue={product.description} />
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
                        <Input id="price" type="number" defaultValue={product.price} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select defaultValue={product.category}>
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
                        <Label>Sizes</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map(size => (
                                <div key={size} className="flex items-center gap-2">
                                    <Checkbox id={`size-${size}`} defaultChecked={product.sizes?.includes(size)} />
                                    <Label htmlFor={`size-${size}`}>{size}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="weight">Weight (grams)</Label>
                        <Input id="weight" type="number" defaultValue={product.weight} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="manufacturer">Manufacturer</Label>
                        <Input id="manufacturer" defaultValue={product.manufacturer} />
                    </div>
                </CardContent>
            </Card>
             <Button type="submit" size="lg" className="w-full">Save Product</Button>
        </div>
      </form>
    </div>
  );
}
