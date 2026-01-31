import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType } from 'docx';
import { saveAs } from 'file-saver';

export const exportToDocx = async (sales, stats) => {
  const totalAmount = stats.totalAmount || 0;
  const timeSeries = stats.timeSeries || [];
  const distribution = stats.distribution || [];
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'Отчет по продажам', bold: true, size: 32 })],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({}), 

        new Paragraph({ 
          children: [new TextRun({ 
            text: `Общая сумма продаж: ${totalAmount.toFixed(2)}`, 
            bold: true 
          })] 
        }),
        new Paragraph({ children: [new TextRun('Суммы по статусам/распределению:')] }),
        
        ...distribution.map(item => {
          const label = item.key || item.status || 'Не указано';
          const amount = item.amount || item.sum || 0;
          return new Paragraph({ 
            children: [new TextRun(`  ${label}: ${amount.toFixed(2)}`)] 
          });
        }),
        
        new Paragraph({}), 

        new Paragraph({ children: [new TextRun('Суммы по периодам:')] }),
        ...timeSeries.map(period => {
          const periodLabel = period.period || period.month || 'Не указано';
          const periodAmount = period.amount || period.sum || 0;
          return new Paragraph({ 
            children: [new TextRun(`  ${periodLabel}: ${periodAmount.toFixed(2)}`)] 
          });
        }),
        
        new Paragraph({}), 

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph('Цель')] }),
                new TableCell({ children: [new Paragraph('Цена')] }),
                new TableCell({ children: [new Paragraph('Количество')] }),
                new TableCell({ children: [new Paragraph('Дата продажи')] }),
                new TableCell({ children: [new Paragraph('Имя клиента')] }),
                new TableCell({ children: [new Paragraph('Email клиента')] }),
                new TableCell({ children: [new Paragraph('Статус')] }),
                new TableCell({ children: [new Paragraph('Маршрут')] }),
              ]
            }),
            ...sales.map(sale => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(sale.purpose || 'Не указано')] }),
                new TableCell({ 
                  children: [new Paragraph(
                    sale.price != null ? Number(sale.price).toFixed(2) : '0.00'
                  )] 
                }),
                new TableCell({ 
                  children: [new Paragraph(
                    sale.quantity != null ? sale.quantity.toString() : '0'
                  )] 
                }),
                new TableCell({ 
                  children: [new Paragraph(
                    sale.saleDate ? new Date(sale.saleDate).toLocaleDateString('ru-RU') : 'Не указана'
                  )] 
                }),
                new TableCell({ children: [new Paragraph(sale.customerName || 'Не указано')] }),
                new TableCell({ children: [new Paragraph(sale.customerEmail || 'Не указано')] }),
                new TableCell({ children: [new Paragraph(sale.status || 'Не указан')] }),
                new TableCell({ children: [new Paragraph(sale.route ? sale.route.name : 'Не указан')] }),
              ]
            }))
          ]
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'otchet_po_prodazham.docx');
};