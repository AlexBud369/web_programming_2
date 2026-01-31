import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const StatsCards = ({ stats, distributionBy }) => {
  const getDistributionLabel = () => {
    switch (distributionBy) {
      case 'status': return 'Статусов';
      case 'route': return 'Маршрутов';
      case 'purpose': return 'Целей';
      default: return 'Категорий';
    }
  };

  const distributionField = `unique${distributionBy.charAt(0).toUpperCase() + distributionBy.slice(1)}s`;

  return (
    <Grid 
      container 
      spacing={{ xs: 1, sm: 2 }} 
      sx={{ mb: 3 }}
    >
      <Grid item xs={6} sm={6} md={3}>
        <Card sx={{ height: '100%', minHeight: 100 }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoneyIcon sx={{ 
                mr: 1, 
                color: '#3B82F6', 
                fontSize: { xs: 18, sm: 20 } 
              }} />
              <Typography color="textSecondary" variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Общий доход
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              ${stats.totalAmount?.toFixed(2) || '0.00'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={6} sm={6} md={3}>
        <Card sx={{ height: '100%', minHeight: 100 }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon sx={{ 
                mr: 1, 
                color: '#10B981', 
                fontSize: { xs: 18, sm: 20 } 
              }} />
              <Typography color="textSecondary" variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Средняя цена
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              ${(stats.summary?.averagePrice || 0).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={6} sm={6} md={3}>
        <Card sx={{ height: '100%', minHeight: 100 }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BarChartIcon sx={{ 
                mr: 1, 
                color: '#F59E0B', 
                fontSize: { xs: 18, sm: 20 } 
              }} />
              <Typography color="textSecondary" variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Уникальных маршрутов
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              {stats.summary?.uniqueRoutes || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={6} sm={6} md={3}>
        <Card sx={{ height: '100%', minHeight: 100 }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PieChartIcon sx={{ 
                mr: 1, 
                color: '#EC4899', 
                fontSize: { xs: 18, sm: 20 } 
              }} />
              <Typography color="textSecondary" variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {getDistributionLabel()}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              {stats.summary?.[distributionField] || stats.distribution?.length || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;