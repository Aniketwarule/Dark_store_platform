'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const inventory = [
  {
    id: 1,
    name: 'Organic Bananas',
    category: 'Produce',
    stock: 150,
    price: 2.99,
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'Whole Milk',
    category: 'Dairy',
    stock: 50,
    price: 3.99,
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Sourdough Bread',
    category: 'Bakery',
    stock: 25,
    price: 4.99,
    status: 'Low Stock',
  },
  {
    id: 4,
    name: 'Free Range Eggs',
    category: 'Dairy',
    stock: 200,
    price: 5.99,
    status: 'In Stock',
  },
  {
    id: 5,
    name: 'Ground Coffee',
    category: 'Beverages',
    stock: 75,
    price: 12.99,
    status: 'In Stock',
  },
];

const categories = ['All', 'Produce', 'Dairy', 'Bakery', 'Beverages', 'Pantry'];

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  // New state for form inputs
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const filteredInventory = inventory.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleCSVUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a CSV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessage(data.message);
      
      // Reset file input and close dialog if upload is successful
      setFile(null);
      setIsAddProductDialogOpen(false);
    } catch (error) {
      setMessage('Error uploading file.');
    }
  };

  const handleAddProduct = async () => {
    // Validate inputs
    if (!newProductName || !newProductCategory || !newProductStock || !newProductPrice) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      // Here you would typically send a POST request to your backend
      const newProduct = {
        id: inventory.length + 1,
        name: newProductName,
        category: newProductCategory,
        stock: parseInt(newProductStock),
        price: parseFloat(newProductPrice),
        status: parseInt(newProductStock) > 50 ? 'In Stock' : 'Low Stock'
      };

      // For now, we'll just log the product (in a real app, you'd send to backend)
      console.log('New Product:', newProduct);

      // Reset form and close dialog
      setNewProductName('');
      setNewProductCategory('');
      setNewProductStock('');
      setNewProductPrice('');
      setIsAddProductDialogOpen(false);
      setMessage('Product added successfully!');
    } catch (error) {
      setMessage('Error adding product.');
    }
  };

  return (
    <>
      <Header title="Inventory Management" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search products..."
              className="w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input 
                    placeholder="Enter product name" 
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={newProductCategory}
                    onValueChange={setNewProductCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock Quantity</label>
                  <Input 
                    type="number" 
                    placeholder="Enter quantity"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Enter price"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                  />
                </div>
                
                {message && <p className="text-sm text-red-500">{message}</p>}
                
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleAddProduct} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // Reset file and message when switching to CSV upload
                      setFile(null);
                      setMessage('');
                    }}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </Button>
                </div>
                
                {file ? (
                  <div className="mt-4">
                    <form onSubmit={handleCSVUpload} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="text" 
                          value={file.name} 
                          readOnly 
                          className="flex-grow"
                        />
                        <Button type="submit" size="sm">
                          Confirm Upload
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="mt-4">
                    <Input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleFileChange} 
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === 'In Stock' ? 'default' : 'destructive'}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}