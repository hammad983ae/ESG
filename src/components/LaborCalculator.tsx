/**
 * Labor Calculator - Manage labor requirements and wage calculations
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
import { CalendarIcon, Plus, Users, DollarSign, Clock, Trash2, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface LaborRecord {
  id: string;
  date: Date;
  workerName: string;
  jobType: string;
  hoursWorked: number;
  hourlyRate: number;
  totalPay: number;
  isMinimumWage: boolean;
  overtime: number;
  overtimeRate: number;
  totalWithOvertime: number;
  notes: string;
  fieldLocation: string;
}

interface MinimumWageData {
  country: string;
  region: string;
  rate: number;
  effectiveDate: string;
}

export const LaborCalculator = () => {
  const [laborRecords, setLaborRecords] = useState<LaborRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [minimumWageRate, setMinimumWageRate] = useState(15.20); // Default AU minimum wage
  
  const [formData, setFormData] = useState({
    workerName: '',
    jobType: '',
    hoursWorked: '',
    hourlyRate: '',
    overtime: '',
    notes: '',
    fieldLocation: ''
  });

  const jobTypes = [
    'Planting', 'Harvesting', 'Pruning', 'Spraying', 'Irrigation', 'Cultivation',
    'Thinning', 'Picking', 'Packing', 'General Farm Labor', 'Equipment Operation',
    'Maintenance', 'Supervision', 'Quality Control', 'Transport'
  ];

  const minimumWageRates: MinimumWageData[] = [
    { country: 'Australia', region: 'National', rate: 23.23, effectiveDate: '2024-07-01' },
    { country: 'USA', region: 'Federal', rate: 7.25, effectiveDate: '2009-07-24' },
    { country: 'USA', region: 'California', rate: 16.00, effectiveDate: '2024-01-01' },
    { country: 'USA', region: 'New York', rate: 15.00, effectiveDate: '2023-12-31' },
    { country: 'Canada', region: 'Ontario', rate: 16.55, effectiveDate: '2024-01-01' },
    { country: 'UK', region: 'National Living Wage', rate: 11.44, effectiveDate: '2024-04-01' },
    { country: 'New Zealand', region: 'National', rate: 22.70, effectiveDate: '2024-04-01' }
  ];

  const calculateOvertimePay = (regularHours: number, overtimeHours: number, hourlyRate: number) => {
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * (hourlyRate * 1.5); // 1.5x rate for overtime
    return { regularPay, overtimePay, total: regularPay + overtimePay };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const hoursWorked = parseFloat(formData.hoursWorked);
    const hourlyRate = parseFloat(formData.hourlyRate);
    const overtime = parseFloat(formData.overtime) || 0;
    
    const isMinimumWage = hourlyRate <= minimumWageRate;
    const regularHours = Math.max(0, hoursWorked - overtime);
    const overtimeCalc = calculateOvertimePay(regularHours, overtime, hourlyRate);
    
    const newRecord: LaborRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      workerName: formData.workerName,
      jobType: formData.jobType,
      hoursWorked,
      hourlyRate,
      totalPay: hoursWorked * hourlyRate,
      isMinimumWage,
      overtime,
      overtimeRate: hourlyRate * 1.5,
      totalWithOvertime: overtimeCalc.total,
      notes: formData.notes,
      fieldLocation: formData.fieldLocation
    };

    setLaborRecords([...laborRecords, newRecord]);
    
    // Reset form
    setFormData({
      workerName: '',
      jobType: '',
      hoursWorked: '',
      hourlyRate: '',
      overtime: '',
      notes: '',
      fieldLocation: ''
    });
    setSelectedDate(undefined);
  };

  const deleteRecord = (id: string) => {
    setLaborRecords(laborRecords.filter(record => record.id !== id));
  };

  const totalLaborCost = laborRecords.reduce((sum, record) => sum + record.totalWithOvertime, 0);
  const totalHours = laborRecords.reduce((sum, record) => sum + record.hoursWorked, 0);
  const totalOvertime = laborRecords.reduce((sum, record) => sum + record.overtime, 0);
  const averageHourlyRate = laborRecords.length > 0 
    ? laborRecords.reduce((sum, record) => sum + record.hourlyRate, 0) / laborRecords.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Minimum Wage Reference */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Calculator className="h-5 w-5" />
            Minimum Wage Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Select Your Region</Label>
              <Select 
                value={minimumWageRate.toString()} 
                onValueChange={(value) => {
                  const selectedRate = minimumWageRates.find(rate => rate.rate.toString() === value);
                  if (selectedRate) setMinimumWageRate(selectedRate.rate);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {minimumWageRates.map((rate) => (
                    <SelectItem key={`${rate.country}-${rate.region}`} value={rate.rate.toString()}>
                      {rate.country} - {rate.region}: ${rate.rate}/hour
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div>
                <p className="text-sm text-muted-foreground">Current Minimum Wage</p>
                <p className="text-2xl font-bold text-green-600">${minimumWageRate}/hour</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Labor Cost</p>
                <p className="text-2xl font-bold">${totalLaborCost.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overtime Hours</p>
                <p className="text-2xl font-bold">{totalOvertime.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Hourly Rate</p>
              <p className="text-2xl font-bold">${averageHourlyRate.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Labor Record Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Labor Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Work Date */}
              <div className="space-y-2">
                <Label>Work Date</Label>
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

              {/* Worker Name */}
              <div className="space-y-2">
                <Label>Worker Name</Label>
                <Input
                  value={formData.workerName}
                  onChange={(e) => setFormData({...formData, workerName: e.target.value})}
                  placeholder="Employee name"
                />
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={formData.jobType} onValueChange={(value) => setFormData({...formData, jobType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((job) => (
                      <SelectItem key={job} value={job}>{job}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Hours Worked */}
              <div className="space-y-2">
                <Label>Hours Worked</Label>
                <Input
                  type="number"
                  step="0.25"
                  value={formData.hoursWorked}
                  onChange={(e) => setFormData({...formData, hoursWorked: e.target.value})}
                  placeholder="8.0"
                />
              </div>

              {/* Overtime Hours */}
              <div className="space-y-2">
                <Label>Overtime Hours</Label>
                <Input
                  type="number"
                  step="0.25"
                  value={formData.overtime}
                  onChange={(e) => setFormData({...formData, overtime: e.target.value})}
                  placeholder="0.0"
                />
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <Label>Hourly Rate ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                  placeholder={minimumWageRate.toString()}
                />
                {parseFloat(formData.hourlyRate) < minimumWageRate && formData.hourlyRate && (
                  <p className="text-xs text-red-600">Below minimum wage!</p>
                )}
              </div>

              {/* Field Location */}
              <div className="space-y-2">
                <Label>Field/Location</Label>
                <Input
                  value={formData.fieldLocation}
                  onChange={(e) => setFormData({...formData, fieldLocation: e.target.value})}
                  placeholder="North Field, Orchard A"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about the work performed"
                rows={3}
              />
            </div>

            {/* Pay Calculation Preview */}
            {formData.hoursWorked && formData.hourlyRate && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Pay Calculation Preview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Regular Hours:</span>
                      <p>{Math.max(0, parseFloat(formData.hoursWorked) - (parseFloat(formData.overtime) || 0)).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Overtime Hours:</span>
                      <p>{(parseFloat(formData.overtime) || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Regular Pay:</span>
                      <p>${(Math.max(0, parseFloat(formData.hoursWorked) - (parseFloat(formData.overtime) || 0)) * parseFloat(formData.hourlyRate)).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Total Pay:</span>
                      <p className="text-green-600 font-semibold">
                        ${calculateOvertimePay(
                          Math.max(0, parseFloat(formData.hoursWorked) - (parseFloat(formData.overtime) || 0)),
                          parseFloat(formData.overtime) || 0,
                          parseFloat(formData.hourlyRate)
                        ).total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button type="submit" className="w-full" disabled={!selectedDate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Labor Record
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Labor Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Labor Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {laborRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No labor records yet. Add your first record above.
            </div>
          ) : (
            <div className="space-y-4">
              {laborRecords.map((record) => (
                <Card key={record.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {record.workerName} - {record.jobType}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {format(record.date, "PPP")} - {record.fieldLocation}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {record.isMinimumWage && (
                          <Badge variant="secondary">Min Wage</Badge>
                        )}
                        {record.overtime > 0 && (
                          <Badge variant="destructive">Overtime</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRecord(record.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Hours:</span>
                        <p>{record.hoursWorked} hrs</p>
                      </div>
                      <div>
                        <span className="font-medium">Rate:</span>
                        <p>${record.hourlyRate}/hr</p>
                      </div>
                      <div>
                        <span className="font-medium">Overtime:</span>
                        <p>{record.overtime} hrs @ ${record.overtimeRate.toFixed(2)}/hr</p>
                      </div>
                      <div>
                        <span className="font-medium">Total Pay:</span>
                        <p className="text-green-600 font-semibold">${record.totalWithOvertime.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Per Hour Avg:</span>
                        <p>${(record.totalWithOvertime / record.hoursWorked).toFixed(2)}</p>
                      </div>
                    </div>

                    {record.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded">
                        <span className="font-medium text-sm">Notes: </span>
                        <span className="text-sm">{record.notes}</span>
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