/**
 * Expense Calculator - Track and calculate operational expenses
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, Plus, Receipt, TrendingUp, Trash2, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Expense {
  id: string;
  date: Date;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  vendor: string;
  paymentMethod: string;
  isRecurring: boolean;
  recurringFrequency: string;
  notes: string;
  tags: string[];
  receiptNumber: string;
}

export const ExpenseCalculator = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: '',
    amount: '',
    vendor: '',
    paymentMethod: '',
    isRecurring: false,
    recurringFrequency: '',
    notes: '',
    tags: '',
    receiptNumber: ''
  });

  const expenseCategories = {
    'Seeds & Plants': ['Seeds', 'Seedlings', 'Trees', 'Grafts', 'Rootstock'],
    'Fertilizers': ['Nitrogen', 'Phosphorus', 'Potassium', 'Organic', 'Micronutrients'],
    'Chemicals': ['Herbicides', 'Pesticides', 'Fungicides', 'Growth Regulators'],
    'Fuel & Energy': ['Diesel', 'Gasoline', 'Electricity', 'Propane', 'Solar'],
    'Equipment': ['Tractors', 'Implements', 'Tools', 'Maintenance', 'Repairs'],
    'Labor': ['Wages', 'Contractors', 'Benefits', 'Training'],
    'Irrigation': ['Water Rights', 'Pumps', 'Pipes', 'Sprinklers', 'Maintenance'],
    'Insurance': ['Crop Insurance', 'Equipment', 'Liability', 'Workers Comp'],
    'Professional Services': ['Consulting', 'Veterinary', 'Legal', 'Accounting'],
    'Utilities': ['Phone', 'Internet', 'Waste Management', 'Security'],
    'Transportation': ['Shipping', 'Delivery', 'Vehicle Expenses', 'Fuel'],
    'Storage & Processing': ['Bins', 'Cold Storage', 'Processing', 'Packaging'],
    'Marketing': ['Advertising', 'Trade Shows', 'Website', 'Certifications'],
    'Other': ['Miscellaneous', 'Office Supplies', 'Travel', 'Education']
  };

  const paymentMethods = [
    'Cash', 'Check', 'Credit Card', 'Debit Card', 'Bank Transfer', 'PayPal', 'Invoice/Terms'
  ];

  const recurringFrequencies = [
    'Weekly', 'Bi-weekly', 'Monthly', 'Bi-monthly', 'Quarterly', 'Semi-annually', 'Annually'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      date: selectedDate,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      amount: parseFloat(formData.amount),
      vendor: formData.vendor,
      paymentMethod: formData.paymentMethod,
      isRecurring: formData.isRecurring,
      recurringFrequency: formData.recurringFrequency,
      notes: formData.notes,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      receiptNumber: formData.receiptNumber
    };

    setExpenses([...expenses, newExpense]);
    
    // Reset form
    setFormData({
      category: '',
      subcategory: '',
      description: '',
      amount: '',
      vendor: '',
      paymentMethod: '',
      isRecurring: false,
      recurringFrequency: '',
      notes: '',
      tags: '',
      receiptNumber: ''
    });
    setSelectedDate(undefined);
    setSelectedCategory('');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categorySummary = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySummary)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFormData({...formData, category, subcategory: ''});
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Expense Records</p>
                <p className="text-2xl font-bold">{expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Per Record</p>
              <p className="text-2xl font-bold">
                ${expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <p className="text-lg font-bold">
                {topCategories.length > 0 ? topCategories[0][0] : 'None'}
              </p>
              <p className="text-sm text-muted-foreground">
                ${topCategories.length > 0 ? topCategories[0][1].toLocaleString() : '0'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategories.map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(amount / totalExpenses) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary">${amount.toLocaleString()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Expense Date */}
              <div className="space-y-2">
                <Label>Expense Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(expenseCategories).map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory */}
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => setFormData({...formData, subcategory: value})}
                  disabled={!selectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory && expenseCategories[selectedCategory as keyof typeof expenseCategories]?.map((sub) => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of expense"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Vendor */}
              <div className="space-y-2">
                <Label>Vendor/Supplier</Label>
                <Input
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  placeholder="Company or person paid"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Receipt Number */}
              <div className="space-y-2">
                <Label>Receipt/Invoice #</Label>
                <Input
                  value={formData.receiptNumber}
                  onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                  placeholder="Reference number"
                />
              </div>
            </div>

            {/* Recurring Expense Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="recurring">Recurring Expense</Label>
                </div>
              </div>

              {formData.isRecurring && (
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={formData.recurringFrequency} onValueChange={(value) => setFormData({...formData, recurringFrequency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {recurringFrequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g., organic, fertilizer, spring-2024"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes or details"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!selectedDate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Expense Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Expense History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No expenses recorded yet. Add your first expense above.
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <Card key={expense.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {expense.description}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {format(expense.date, "PPP")} - {expense.vendor}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{expense.category}</Badge>
                        {expense.isRecurring && (
                          <Badge variant="outline">Recurring</Badge>
                        )}
                        <Badge variant="destructive">${expense.amount.toFixed(2)}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExpense(expense.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Subcategory:</span>
                        <p>{expense.subcategory}</p>
                      </div>
                      <div>
                        <span className="font-medium">Payment:</span>
                        <p>{expense.paymentMethod}</p>
                      </div>
                      <div>
                        <span className="font-medium">Receipt #:</span>
                        <p>{expense.receiptNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span>
                        <p>{expense.isRecurring ? expense.recurringFrequency : 'One-time'}</p>
                      </div>
                    </div>

                    {expense.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {expense.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {expense.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded">
                        <span className="font-medium text-sm">Notes: </span>
                        <span className="text-sm">{expense.notes}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};