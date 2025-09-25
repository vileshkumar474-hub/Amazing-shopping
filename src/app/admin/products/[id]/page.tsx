'use client';

import { useState, useEffect, Suspense } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getProductById, products } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const sizes = ['30', '32', '34', '36', '38', '40', '42', 'S', 'M', 'L', 'XL'];

type AdminProductEditPageProps = {
    params: { id: string };
};

function AdminProductEditPageComponent({ params: paramsPromise }: AdminProductEditPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [productData, setProductData] = useState<Product | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [params, setParams] = useState<AdminProductEditPageProps['params'] | null>(null);

  useEffect(() => {
    Promise.resolve(paramsPromise).then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (params) {
      const foundProduct = getProductById(params.id);
      if (foundProduct) {
        setProductData(foundProduct);
        setSelectedSizes(foundProduct.sizes || []);
      } else {
        notFound();
      }
    }
  }, [params]);

  if (!productData) {
    return <div>Loading...</div>;
  }
  
  const placeholder = PlaceHolderImages.find((p) => p.id === productData.imageId);

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
    const productIndex = products.findIndex(p => p.id === productData.id);

    if (productIndex === -1) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Product not found to update."
        });
        return;
    }
    
    const imageFile = formData.get('image') as File;
    let imageId = productData.imageId;
    if (imageFile && imageFile.size > 0) {
        imageId = `prod-${(products.length % 16) + 1}`;
    }

    const updatedProduct: Product = {
        ...productData,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        category: formData.get('category') as string,
        brand: formData.get('brand') as string,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
        sizes: selectedSizes,
        weight: Number(formData.get('weight')),
        manufacturer: formData.get('manufacturer') as string,
        imageId: imageId,
        images: [imageId],
    };

    products[productIndex] = updatedProduct;

    toast({
        title: "Product Updated!",
        description: `${updatedProduct.name} has been updated.`
    });

    router.push('/admin/products');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Edit: {productData.name}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="name" defaultValue={productData.name} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" defaultValue={productData.description} required />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Image</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative h-48 w-48 overflow-hidden rounded-md border">
                        {placeholder && <Image src={placeholder.imageUrl} alt={productData.name} fill className="object-cover" />}
                    </div>
                    <Label htmlFor="image">Change Image (optional)</Label>
                    <Input id="image" name="image" type="file" accept="image/*" />
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Properties</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" name="price" type="number" defaultValue={productData.price} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue={productData.category} required>
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
                        <Input id="brand" name="brand" defaultValue={productData.brand} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" name="tags" defaultValue={productData.tags?.join(', ')} />
                    </div>
                     <div className="space-y-2">
                        <Label>Sizes</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map(size => (
                                <div key={size} className="flex items-center gap-2">
                                    <Checkbox 
                                        id={`size-${size}`} 
                                        defaultChecked={productData.sizes?.includes(size)}
                                        onCheckedChange={(checked) => handleSizeChange(size, !!checked)}
                                    />
                                    <Label htmlFor={`size-${size}`}>{size}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="weight">Weight (grams)</Label>
                        <Input id="weight" name="weight" type="number" defaultValue={productData.weight} />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="manufacturer">Manufacturer</Label>
                        <Input id="manufacturer" name="manufacturer" defaultValue={productData.manufacturer} />
                    </div>
                </CardContent>
            </Card>
             <Button type="submit" size="lg" className="w-full">Save Product</Button>
        </div>
      </form>
    </div>
  );
}


export default function AdminProductEditPage(props: AdminProductEditPageProps) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminProductEditPageComponent {...props} />
      </Suspense>
    );
}