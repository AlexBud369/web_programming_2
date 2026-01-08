import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { fetchSales } from '../../store/slices/saleSlice';
import PageHeader from '../../components/PageHeader';
import AnalyticsCard from '../../components/AnalyticsCard';
import LineChart from '../../components/charts/LineChart';
import DoughnutChart from '../../components/charts/DoughnutChart';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { list: sales, loading, error } = useSelector((state) => state.sales);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgTicket: 0,
    salesByMonth: [],
    salesByPurpose: []
  });

  useEffect(() => {
    dispatch(fetchSales({ limit: 1000, sort: 'saleDate', order: 'DESC' }));
  }, [dispatch]);

  useEffect(() => {
    if (sales.length > 0) {
      calculateStats(sales);
    }
  }, [sales]);

  const calculateStats = (salesData) => {
    let totalRevenue = 0;
    let totalSales = salesData.length;

    salesData.forEach(sale => {
      totalRevenue += parseFloat(sale.price) * sale.quantity;
    });

    const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
    const salesByMonth = getSalesByMonth(salesData, 6);
    const salesByPurpose = getSalesByPurpose(salesData);

    setStats({
      totalRevenue,
      totalSales,
      avgTicket,
      salesByMonth,
      salesByPurpose
    });
  };

  const getSalesByMonth = (salesData, monthsCount = 6) => {
    const result = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(monthStart);
      
      const monthSales = salesData.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate >= monthStart && saleDate <= monthEnd;
      });

      const monthRevenue = monthSales.reduce((sum, sale) => {
        return sum + (parseFloat(sale.price) * sale.quantity);
      }, 0);

      result.push({
        month: format(monthStart, 'MMM yyyy', { locale: ru }),
        revenue: monthRevenue,
        count: monthSales.length
      });
    }

    return result;
  };

  const getSalesByPurpose = (salesData) => {
    const purposeMap = {};

    salesData.forEach(sale => {
      const purpose = sale.purpose;
      const revenue = parseFloat(sale.price) * sale.quantity;

      if (!purposeMap[purpose]) {
        purposeMap[purpose] = {
          purpose,
          revenue: 0,
          count: 0
        };
      }

      purposeMap[purpose].revenue += revenue;
      purposeMap[purpose].count += 1;
    });

    return Object.values(purposeMap).sort((a, b) => b.revenue - a.revenue);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <PageHeader title="Аналитика продаж" />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <PageHeader title="Аналитика продаж" />
        <Alert severity="error">Ошибка загрузки данных: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <PageHeader title="Аналитика продаж" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <AnalyticsCard
            title="Общая выручка"
            value={`$${stats.totalRevenue.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}`}
            subtext="За все время"
            color="primary"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <AnalyticsCard
            title="Всего продаж"
            value={stats.totalSales}
            subtext="Количество транзакций"
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <AnalyticsCard
            title="Средний чек"
            value={`$${stats.avgTicket.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}`}
            subtext="На одну продажу"
            color="success"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Динамика продаж по месяцам
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 400 }}>
              <LineChart 
                data={stats.salesByMonth} 
                title="Динамика продаж по месяцам"
              />
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Показаны продажи за последние 6 месяцев
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Распределение по целям
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 400 }}>
              <DoughnutChart 
                data={stats.salesByPurpose} 
                title="Распределение продаж по целям"
              />
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Доля каждой цели в общей выручке
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Детализация по целям
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {stats.salesByPurpose.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        {item.purpose}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${item.revenue.toLocaleString('ru-RU')}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.count} продаж
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;