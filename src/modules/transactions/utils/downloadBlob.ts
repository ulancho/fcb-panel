export function downloadBlobFile(blob: Blob, type: 'xlsx' | 'pdf') {
  const extension = type === 'xlsx' ? 'xlsx' : 'pdf';
  const filename = `TRANSACTIONS_${new Date().toISOString().split('T')[0]}.${extension}`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
