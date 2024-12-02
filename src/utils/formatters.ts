export const formatTableName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatColumnHeader = (column: string): string => {
  return column
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '-';
    }
  }
  return String(value);
};