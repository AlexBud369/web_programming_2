import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (sales, stats) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Отчет по продажам');

  worksheet.addRow(['Отчет по продажам']).getCell(1).font = { bold: true, size: 16 };
  worksheet.addRow([]); 

  const totalAmount = stats.totalAmount || 0;
  const timeSeries = stats.timeSeries || [];
  const distribution = stats.distribution || [];
  
  worksheet.addRow(['Общая сумма продаж:', totalAmount.toFixed(2)]);
  worksheet.addRow(['Суммы по статусам/распределению:']);
  
  distribution.forEach(item => {
    const label = item.key || item.status || 'Не указано';
    const amount = item.amount || item.sum || 0;
    worksheet.addRow([`  ${label}:`, amount.toFixed(2)]);
  });
  
  worksheet.addRow([]); 

  worksheet.addRow(['Суммы по периодам:']);
  timeSeries.forEach(period => {
    const periodLabel = period.period || period.month || 'Не указано';
    const periodAmount = period.amount || period.sum || 0;
    worksheet.addRow([`  ${periodLabel}:`, periodAmount.toFixed(2)]);
  });
  worksheet.addRow([]); 

  const headers = ['Цель', 'Цена', 'Количество', 'Дата продажи', 'Имя клиента', 'Email клиента', 'Статус', 'Маршрут'];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
  });

  sales.forEach(sale => {
    worksheet.addRow([
      sale.purpose,
      (sale.price != null ? Number(sale.price).toFixed(2) : '0.00'),
      sale.quantity != null ? sale.quantity : 0,
      sale.saleDate ? new Date(sale.saleDate).toLocaleDateString('ru-RU') : 'Не указана',
      sale.customerName || 'Не указано',
      sale.customerEmail || 'Не указано',
      sale.status || 'Не указан',
      sale.route ? sale.route.name : 'Не указан'
    ]);
  });

  worksheet.getColumn(1).width = 15;
  worksheet.getColumn(2).width = 10;
  worksheet.getColumn(3).width = 12;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 20;
  worksheet.getColumn(6).width = 25;
  worksheet.getColumn(7).width = 15;
  worksheet.getColumn(8).width = 30;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'otchet_po_prodazham.xlsx');
};