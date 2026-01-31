import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import exportService from '../../services/exportService';
import { Box, Typography, Alert, CircularProgress, Grid } from '@mui/material';
import StatsCards from '../../components/analytics/StatsCards';
import FiltersPanel from '../../components/analytics/FiltersPanel';
import ChartContainer from '../../components/analytics/ChartContainer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [stats, setStats] = useState({
    totalAmount: 0,
    timeSeries: [],
    distribution: [],
    topRoutes: [],
    summary: {}
  });
  
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    groupBy: 'month',
    distributionBy: 'status'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
        groupBy: filters.groupBy,
        distributionBy: filters.distributionBy
      };
      
      const response = await exportService.getSalesStats(params);
      
      setStats({
        totalAmount: response.totalAmount || 0,
        timeSeries: response.timeSeries || [],
        distribution: response.distribution || [],
        topRoutes: response.topRoutes || [],
        summary: response.summary || {}
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
      setError('Не удалось загрузить данные аналитики');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchStats();
  };

  const handleResetFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      groupBy: 'month',
      distributionBy: 'status'
    });
    fetchStats();
  };

  const timeSeriesData = {
    labels: stats.timeSeries.map(m => m.period),
    datasets: [{
      label: 'Сумма продаж ($)',
      data: stats.timeSeries.map(m => m.amount),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  const distributionData = {
    labels: stats.distribution.map(s => s.key),
    datasets: [{
      data: stats.distribution.map(s => s.amount),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#8AC926', '#1982C4'
      ]
    }]
  };

  const topRoutesData = {
    labels: stats.topRoutes.map(t => t.name),
    datasets: [{
      label: 'Сумма продаж ($)',
      data: stats.topRoutes.map(t => t.amount),
      backgroundColor: 'rgba(153, 102, 255, 0.7)'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: { 
        enabled: true,
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 13
        }
      }
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
        textAlign: { xs: 'center', sm: 'left' }
      }}>
        Аналитика продаж
      </Typography>

      <FiltersPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        loading={loading}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <StatsCards stats={stats} distributionBy={filters.distributionBy} />

          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: 3 }}>
            <Grid item xs={12} lg={6}>
              <ChartContainer 
                title="Динамика продаж"
                height={{ xs: 300, sm: 350, md: 380, lg: 400 }}
              >
                <Line data={timeSeriesData} options={chartOptions} />
              </ChartContainer>
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <ChartContainer 
                title={`Распределение по ${filters.distributionBy === 'status' ? 'статусам' : filters.distributionBy === 'route' ? 'маршрутам' : 'целям'}`}
                height={{ xs: 300, sm: 350, md: 380, lg: 400 }}
              >
                <Pie data={distributionData} options={chartOptions} />
              </ChartContainer>
            </Grid>
            
            <Grid item xs={12}>
              <ChartContainer 
                title="Топ маршрутов по сумме продаж"
                height={{ xs: 350, sm: 400, md: 450 }}
              >
                <Bar data={topRoutesData} options={chartOptions} />
              </ChartContainer>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AnalyticsPage;