export const downloadFile = (data: string, fileName: string, type: string) => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(url);
  link.remove();
};
