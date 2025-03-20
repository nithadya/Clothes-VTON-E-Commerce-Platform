import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    canceled: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color configurations
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];
  const RADIAN = Math.PI / 180;

  // Helper functions for data formatting
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Mock data fetching
  // In a real application, you would fetch this data from your backend
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Simulating API calls
        // In a real app, replace these with actual API calls
        
        // Example: const response = await axios.get(`${backendUrl}/api/analytics/sales?timeRange=${timeRange}`);
        // setSalesData(response.data.sales);
        
        // Generating mock data
        const mockSalesData = generateMockSalesData(timeRange);
        const mockProductData = generateMockProductData();
        const mockCategoryData = generateMockCategoryData();
        const mockOrderStats = generateMockOrderStats();
        
        // Setting state with mock data
        setSalesData(mockSalesData);
        setProductData(mockProductData);
        setCategoryData(mockCategoryData);
        setOrderStats(mockOrderStats);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // Mock data generation functions
  const generateMockSalesData = (range) => {
    const currentDate = new Date();
    let data = [];
    let increment = 0;
    
    if (range === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        data.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          sales: Math.floor(Math.random() * 3000) + 1000,
          orders: Math.floor(Math.random() * 50) + 10
        });
      }
    } else if (range === 'month') {
      // Last 30 days grouped by week
      for (let i = 0; i < 4; i++) {
        data.push({
          date: `Week ${i + 1}`,
          sales: Math.floor(Math.random() * 20000) + 5000,
          orders: Math.floor(Math.random() * 250) + 50
        });
      }
    } else {
      // Year - last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(currentDate.getMonth() - i);
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          sales: Math.floor(Math.random() * 50000) + 10000,
          orders: Math.floor(Math.random() * 800) + 200
        });
      }
    }
    
    return data;
  };

  const generateMockProductData = () => {
    return [
      { name: 'Product A', sales: 1200 },
      { name: 'Product B', sales: 950 },
      { name: 'Product C', sales: 800 },
      { name: 'Product D', sales: 650 },
      { name: 'Product E', sales: 500 }
    ];
  };

  const generateMockCategoryData = () => {
    return [
      { name: 'Electronics', value: 35 },
      { name: 'Clothing', value: 25 },
      { name: 'Home', value: 20 },
      { name: 'Books', value: 10 },
      { name: 'Others', value: 10 }
    ];
  };

  const generateMockOrderStats = () => {
    return {
      total: 1250,
      completed: 872,
      pending: 327,
      canceled: 51
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-6">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        <div className="flex space-x-2 mb-6">
          <button 
            className={`px-4 py-2 rounded ${timeRange === 'week' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('week')}
          >
            Weekly
          </button>
          <button 
            className={`px-4 py-2 rounded ${timeRange === 'month' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('month')}
          >
            Monthly
          </button>
          <button 
            className={`px-4 py-2 rounded ${timeRange === 'year' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('year')}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Total Sales</h2>
          <p className="text-3xl font-bold">
            {formatCurrency(salesData.reduce((sum, item) => sum + item.sales, 0))}
          </p>
          <div className="mt-2 text-sm text-green-600">
            <span>↑ 12.5% from last {timeRange}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Total Orders</h2>
          <p className="text-3xl font-bold">{orderStats.total}</p>
          <div className="mt-2 text-sm text-green-600">
            <span>↑ 8.2% from last {timeRange}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Avg. Order Value</h2>
          <p className="text-3xl font-bold">
            {formatCurrency(salesData.reduce((sum, item) => sum + item.sales, 0) / orderStats.total)}
          </p>
          <div className="mt-2 text-sm text-green-600">
            <span>↑ 4.1% from last {timeRange}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-500 text-sm font-medium mb-2">Conversion Rate</h2>
          <p className="text-3xl font-bold">3.8%</p>
          <div className="mt-2 text-sm text-red-600">
            <span>↓ 0.5% from last {timeRange}</span>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip formatter={(value, name) => {
                return name === 'sales' ? formatCurrency(value) : value;
              }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="sales" name="Sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [formatCurrency(value), "Sales"]} />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-green-700 font-medium mb-2">Completed</h3>
            <p className="text-2xl font-bold">{orderStats.completed}</p>
            <p className="text-sm text-green-600 mt-1">
              {Math.round((orderStats.completed / orderStats.total) * 100)}% of total
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="text-yellow-700 font-medium mb-2">Pending</h3>
            <p className="text-2xl font-bold">{orderStats.pending}</p>
            <p className="text-sm text-yellow-600 mt-1">
              {Math.round((orderStats.pending / orderStats.total) * 100)}% of total
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="text-red-700 font-medium mb-2">Cancelled</h3>
            <p className="text-2xl font-bold">{orderStats.canceled}</p>
            <p className="text-sm text-red-600 mt-1">
              {Math.round((orderStats.canceled / orderStats.total) * 100)}% of total
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index % 3 === 0 ? 'bg-green-100 text-green-600' : 
                index % 3 === 1 ? 'bg-blue-100 text-blue-600' : 
                'bg-purple-100 text-purple-600'
              }`}>
                {index % 3 === 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                ) : index % 3 === 1 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {index % 3 === 0 ? 'New order placed' : 
                   index % 3 === 1 ? 'New customer registered' : 
                   'Product updated'}
                </p>
                <p className="text-sm text-gray-500">
                  {index % 3 === 0 ? 'Order #12345 - $127.49' : 
                   index % 3 === 1 ? 'John Doe (john@example.com)' : 
                   'Product "Awesome Product" stock updated'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.floor(Math.random() * 60)} minutes ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;