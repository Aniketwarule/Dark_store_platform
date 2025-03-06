'use client';

import { useState, useEffect } from 'react';
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
import { Plus, Upload, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
const BASEURL = "https://dark-store-platform.onrender.com";

const categories = ['All', 'Produce', 'Dairy', 'Bakery', 'Beverages', 'Pantry'];

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  // New state for form inputs
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');

  // Fetch inventory data on component mount
  useEffect(() => {
    console.log('Fetching inventory data...');
    fetchInventory();
  }, []);

  console.log("hello all")

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASEURL}/inventory/all`);
      console.log(response);
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
      }
      
      const data = await response.json();
      setInventory(data);
      setError('');
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  console.log(inventory)

  const filteredInventory = inventory.filter((item: any) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleCSVUpload = async (e: any) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a CSV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch(`${BASEURL}/upload-csv`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessage(data.message);
      
      // Refresh inventory after upload
      if (response.ok) {
        fetchInventory();
      }
      
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
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      // Create product object according to your schema
      const newProduct = {
        product_id: Math.floor(Math.random() * 10000), // Generate temporary ID (best to let backend handle this)
        name: newProductName,
        category: newProductCategory,
        description: newProductDescription,
        brand: newProductBrand,
        stock_quantity: parseInt(newProductStock),
        selling_price: parseFloat(newProductPrice),
        reorder_alert: parseInt(newProductStock) <= 50
      };

      // Send POST request to backend
      const response = await fetch(`${BASEURL}/add-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Refresh inventory after adding
        fetchInventory();
        
        // Reset form and close dialog
        setNewProductName('');
        setNewProductCategory('');
        setNewProductStock('');
        setNewProductPrice('');
        setNewProductDescription('');
        setNewProductBrand('');
        setIsAddProductDialogOpen(false);
        setMessage('Product added successfully!');
      } else {
        setMessage(data.error || 'Error adding product.');
      }
    } catch (error) {
      setMessage('Error adding product. Please try again.');
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
            <DialogTrigger>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <Button onClick={async() => {
                  const res = await axios.get(`${BASEURL}/inventory/opetimize`);
                  console.log(res.data);
                  setInventory(res.data);
                }}>
                  {/* <Plus className="h-4 w-4 mr-2" /> */}
                  Optimize Inventory
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name*</label>
                  <Input 
                    placeholder="Enter product name" 
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category*</label>
                  <Select 
                    value={newProductCategory}
                    onValueChange={setNewProductCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input 
                    placeholder="Enter description" 
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand</label>
                  <Input 
                    placeholder="Enter brand" 
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock Quantity*</label>
                  <Input 
                    type="number" 
                    placeholder="Enter quantity"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price*</label>
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
                          //value={file.name} 
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading inventory...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item: any) => (
                    <TableRow key={item.product_id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.brand || '-'}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${parseFloat(item.price.toString()).toFixed(2)}</TableCell>
                        <TableCell>
                            {item.level == 1 ? "High Demand" : item.level == 2 ? "Moderate Demand" : "Low Demand"} 
                        </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.quantity > 6 ? 'default' : 'destructive'}
                        >
                          {item.quantity > 6 ? 'In Stock' : 'Low Stock'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </>
  );
}