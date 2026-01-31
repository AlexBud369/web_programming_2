import React, { useState } from 'react';
import exportService from '../services/exportService';
import { exportToExcel } from '../utils/exportToExcel';
import { exportToDocx } from '../utils/exportToDocx';

const ExportButton = () => {
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleExport = async (format) => {
    setLoading(true);
    try {
      const params = {};
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const sales = await exportService.getSalesForExport(params);
      const stats = await exportService.getSalesStats(params);

      const safeStats = {
        totalAmount: stats.totalAmount || 0,
        timeSeries: Array.isArray(stats.timeSeries) ? stats.timeSeries : [],
        distribution: Array.isArray(stats.distribution) ? stats.distribution : [],
        totalSum: stats.totalAmount || 0,
        monthlySums: Array.isArray(stats.timeSeries) ? stats.timeSeries : [],
        statusSums: Array.isArray(stats.distribution) ? stats.distribution : []
      };

      if (format === 'excel') {
        await exportToExcel(sales, safeStats);
      } else if (format === 'docx') {
        await exportToDocx(sales, safeStats);
      }
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      alert('Ошибка при экспорте данных');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label>С даты: <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} /></label>
      <label>По дату: <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} /></label>
      <button onClick={() => handleExport('excel')} disabled={loading}>
        {loading ? 'Загрузка...' : 'Экспорт в Excel'}
      </button>
      <button onClick={() => handleExport('docx')} disabled={loading}>
        {loading ? 'Загрузка...' : 'Экспорт в DOCX'}
      </button>
    </div>
  );
};

export default ExportButton;