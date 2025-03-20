import React, { useEffect, useState, useRef } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Counter animation hook
const useCounterAnimation = (endValue, duration = 1500) => {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(Math.floor(progress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);
  
  return value;
};

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

// Format number with suffixes (K, M, B)
const formatNumber = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
};

const Dashboard = () => {
  // Use counter animation hook for KPIs
  const revenue = useCounterAnimation(396700);
  const marketing = useCounterAnimation(30569);
  const sales = useCounterAnimation(20486);
  const subscribers = useCounterAnimation(567000);
  const activeUsers = useCounterAnimation(1200);
  const conversionRate = useCounterAnimation(4.67, 2000);
  
  const [topProducts, setTopProducts] = useState([]);
  const [dateRange, setDateRange] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingType, setExportingType] = useState('');
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const dashboardRef = useRef(null);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setTopProducts([
        { name: 'Premium Subscription', revenue: 15000, growth: 8.2 },
        { name: 'Basic Package', revenue: 8500, growth: 3.7 },
        { name: 'Enterprise Solution', revenue: 22500, growth: 12.5 },
        { name: 'Starter Kit', revenue: 5900, growth: -2.1 }
      ]);
      setIsLoading(false);
    }, 1200);
  }, []);

  // Monthly revenue data (6 months)
  const monthlyRevenueData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Revenue',
        data: [310000, 350000, 390000, 320000, 360000, 396700],
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        borderColor: 'rgba(53, 162, 235, 0.8)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(53, 162, 235, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Expenses',
        data: [210000, 230000, 250000, 220000, 240000, 260000],
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderColor: 'rgba(255, 99, 132, 0.8)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  // Traffic sources data
  const trafficSourcesData = {
    labels: ['Direct', 'Organic Search', 'Social Media', 'Referral', 'Email', 'Paid Search'],
    datasets: [
      {
        data: [25, 35, 15, 10, 8, 7],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 205, 86, 0.8)'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // User acquisition channels
  const acquisitionData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Organic',
        data: [420, 480, 510, 490, 530, 580],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: 'Paid',
        data: [280, 320, 350, 330, 360, 390],
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
      },
      {
        label: 'Referral',
        data: [150, 170, 180, 190, 210, 230],
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
      },
    ],
  };

  // Performance metrics data
  const performanceMetrics = [
    { metric: 'Average Session Duration', value: '3m 24s', change: 5.2 },
    { metric: 'Pages per Session', value: '2.8', change: -1.3 },
    { metric: 'Bounce Rate', value: '32.4%', change: -3.8 },
    { metric: 'User Retention Rate', value: '68%', change: 2.1 }
  ];

  // Recent activity data
  const recentActivity = [
    { action: 'New subscription', user: 'Enterprise client', time: '10 minutes ago', icon: 'bell' },
    { action: 'Payment received', user: 'Premium user', time: '1 hour ago', icon: 'cash' },
    { action: 'New user signup', user: 'Free tier', time: '2 hours ago', icon: 'user' },
    { action: 'Subscription cancelled', user: 'Basic user', time: '1 day ago', icon: 'x-circle' }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: viewportWidth < 768 ? 'bottom' : 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Revenue' || context.dataset.label === 'Expenses') {
              return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
            }
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          }
        }
      }
    }
  };

  // Status indicators for KPIs
  const getStatusIndicator = (value) => {
    if (value > 5) return { color: 'text-green-500', icon: '▲', message: 'Growing' };
    if (value > 0) return { color: 'text-green-400', icon: '▲', message: 'Stable' };
    if (value === 0) return { color: 'text-yellow-500', icon: '■', message: 'Unchanged' };
    return { color: 'text-red-500', icon: '▼', message: 'Declining' };
  };

  // Function to handle PDF export
  const handleExportPDF = () => {
    setIsExporting(true);
    setExportingType('pdf');
    
    setTimeout(() => {
      const dashboardElement = dashboardRef.current;

      if (dashboardElement) {
        const options = {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollX: 0,
          scrollY: 0
        };

        html2canvas(dashboardElement, options).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = pdfWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          let position = 0;
          let heightLeft = imgHeight;
          
          // Add title page
          pdf.setFontSize(24);
          pdf.setTextColor(44, 62, 80);
          pdf.text('Business Analytics Dashboard', pdfWidth / 2, 30, { align: 'center' });
          
          pdf.setFontSize(14);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 45, { align: 'center' });
          pdf.text(`Date Range: ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}`, pdfWidth / 2, 55, { align: 'center' });
          
          pdf.setFontSize(12);
          pdf.text(`Total Revenue: ${formatCurrency(revenue)}`, pdfWidth / 2, 70, { align: 'center' });
          pdf.text(`Active Subscribers: ${formatNumber(subscribers)}`, pdfWidth / 2, 80, { align: 'center' });
          
          pdf.addPage();
          
          // Add dashboard image across multiple pages if needed
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
          
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
          }
          
          // Create a downloadable link for the PDF
          const pdfBlob = pdf.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          const downloadLink = document.createElement('a');
          downloadLink.href = pdfUrl;
          downloadLink.download = `business-dashboard-${dateRange}-${new Date().toISOString().slice(0, 10)}.pdf`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          setIsExporting(false);
          setExportingType('');
        });
      }
    }, 500);
  };

  // Function to handle Excel export
  const handleExportExcel = () => {
    setIsExporting(true);
    setExportingType('excel');
    
    setTimeout(() => {
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      
      // Create Revenue & Expenses worksheet
      const revenueExpensesData = [
        ['Month', 'Revenue', 'Expenses', 'Profit'],
        ...monthlyRevenueData.labels.map((month, idx) => [
          month,
          monthlyRevenueData.datasets[0].data[idx],
          monthlyRevenueData.datasets[1].data[idx],
          monthlyRevenueData.datasets[0].data[idx] - monthlyRevenueData.datasets[1].data[idx]
        ])
      ];
      
      // Create Traffic Sources worksheet
      const trafficSourcesSheetData = [
        ['Source', 'Percentage'],
        ...trafficSourcesData.labels.map((source, idx) => [
          source, 
          trafficSourcesData.datasets[0].data[idx] + '%'
        ])
      ];
      
      // Create User Acquisition worksheet
      const acquisitionSheetData = [
        ['Month', ...acquisitionData.datasets.map(ds => ds.label)],
        ...acquisitionData.labels.map((month, idx) => [
          month,
          ...acquisitionData.datasets.map(ds => ds.data[idx])
        ])
      ];
      
      // Create Top Products worksheet
      const topProductsSheetData = [
        ['Product', 'Revenue', 'Growth'],
        ...topProducts.map(product => [
          product.name,
          product.revenue,
          product.growth + '%'
        ])
      ];
      
      // Create Performance Metrics worksheet
      const performanceSheetData = [
        ['Metric', 'Value', 'Change'],
        ...performanceMetrics.map(metric => [
          metric.metric,
          metric.value,
          metric.change + '%'
        ])
      ];
      
      // Create Summary worksheet with KPIs
      const summarySheetData = [
        ['Key Performance Indicators', 'Value', 'Change'],
        ['Total Revenue', formatCurrency(revenue), '+8.3%'],
        ['Marketing Spend', formatCurrency(marketing), '+4.2%'],
        ['Conversion Rate', conversionRate.toFixed(2) + '%', '+0.7%'],
        ['Active Subscribers', formatNumber(subscribers), '+3.85%'],
        ['', '', ''],
        ['Report Date', new Date().toLocaleDateString(), ''],
        ['Date Range', dateRange.charAt(0).toUpperCase() + dateRange.slice(1), '']
      ];
      
      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summarySheetData), 'Summary');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(revenueExpensesData), 'Revenue & Expenses');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(trafficSourcesSheetData), 'Traffic Sources');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(acquisitionSheetData), 'User Acquisition');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(topProductsSheetData), 'Top Products');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(performanceSheetData), 'Performance Metrics');
      
      // Convert workbook to blob and create downloadable link
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const excelUrl = URL.createObjectURL(excelBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = excelUrl;
      downloadLink.download = `business-dashboard-${dateRange}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setIsExporting(false);
      setExportingType('');
    }, 500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Business Analytics Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Real-time metrics and performance indicators</p>
          </div>
          <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 w-full sm:w-auto">
            <select 
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              disabled={isExporting}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center flex-1 sm:flex-auto"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                {isExporting && exportingType === 'pdf' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Export PDF
                  </>
                )}
              </button>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center flex-1 sm:flex-auto"
                onClick={handleExportExcel}
                disabled={isExporting}
              >
                {isExporting && exportingType === 'excel' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Export Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8" ref={dashboardRef}>
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              {/* Total Revenue */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(revenue)}</h3>
                    <div className="flex items-center mt-2">
                      <span className={`${getStatusIndicator(8.3).color} font-medium text-sm mr-1`}>
                        {getStatusIndicator(8.3).icon} 8.3%
                      </span>
                      <span className="text-xs text-gray-500">vs last period</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Marketing ROI */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marketing Spend</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(marketing)}</h3>
                    <div className="flex items-center mt-2">
                      <span className={`${getStatusIndicator(4.2).color} font-medium text-sm mr-1`}>
                        {getStatusIndicator(4.2).icon} 4.2%
                      </span>
                      <span className="text-xs text-gray-500">vs last period</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{conversionRate.toFixed(2)}%</h3>
                    <div className="flex items-center mt-2">
                      <span className={`${getStatusIndicator(0.7).color} font-medium text-sm mr-1`}>
                        {getStatusIndicator(0.7).icon} 0.7%
                      </span>
                      <span className="text-xs text-gray-500">vs last period</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-2 sm:p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Active Subscribers */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{formatNumber(subscribers)}</h3>
                    <div className="flex items-center mt-2">
                      <span className={`${getStatusIndicator(3.85).color} font-medium text-sm mr-1`}>
                        {getStatusIndicator(3.85).icon} 3.85%
                      </span>
                      <span className="text-xs text-gray-500">vs last period</span>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue & Expenses</h3>
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-xs text-gray-500 mr-2">Revenue</span>
                    <span className="inline-block w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="text-xs text-gray-500">Expenses</span>
                  </div>
                </div>
                <div className="h-64 sm:h-80">
                  <Line data={monthlyRevenueData} options={chartOptions} />
                </div>
              </div>

              {/* Traffic Sources Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
                  <div className="text-xs text-gray-500">
                    Based on last 30 days
                  </div>
                </div>
                <div className="h-64 sm:h-80">
                  <Pie data={trafficSourcesData} options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          boxWidth: 12,
                          padding: 20,
                          font: {
                            size: 12
                          }
                        }
                      }
                    }
                  }} />
                </div>
              </div>
            </div>

            {/* User Acquisition and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* User Acquisition */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Acquisition</h3>
                  <div className="text-xs text-gray-500">
                    Last 6 months
                  </div>
                </div>
                <div className="h-64 sm:h-80">
                  <Bar data={acquisitionData} options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        ...chartOptions.plugins.legend,
                        position: 'top'
                      }
                    }
                  }} />
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Growth
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topProducts.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 text-right">
                            {formatCurrency(product.revenue)}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-medium ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.growth >= 0 ? '+' : ''}{product.growth}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Performance Metrics and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Performance Metrics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                  <div className="text-xs text-gray-500">
                    Last 30 days
                  </div>
                </div>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{metric.metric}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{metric.value}</span>
                        <span className={`text-xs font-medium ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change >= 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.icon === 'bell' ? 'bg-blue-100 text-blue-600' :
                        activity.icon === 'cash' ? 'bg-green-100 text-green-600' :
                        activity.icon === 'user' ? 'bg-purple-100 text-purple-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {activity.icon === 'bell' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
                          {activity.icon === 'cash' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />}
                          {activity.icon === 'user' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                          {activity.icon === 'x-circle' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-center">
              <p className="text-sm text-gray-500">
                Data last updated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                This dashboard is for demonstration purposes only. All data is simulated.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;