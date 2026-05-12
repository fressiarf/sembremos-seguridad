/**
 * Generates and downloads a CSV file from an array of objects
 */
export const exportToCSV = (data, fileName, columns) => {
  if (!data || !data.length) return;

  // Header row
  const header = columns.map(col => col.label).join(';');
  
  // Data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = col.path ? col.path.split('.').reduce((obj, key) => obj?.[key], item) : item[col.key];
      
      // Handle commas and quotes in content
      if (value === null || value === undefined) value = '';
      value = String(value).replace(/"/g, '""');
      return `"${value}"`;
    }).join(';');
  });

  // Adding 'sep=;' to help Excel recognize the delimiter automatically
  const csvContent = ['sep=;', header, ...rows].join('\n');
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
