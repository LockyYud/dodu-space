export function LocalizedText({
  vi,
  en,
}: Readonly<{ vi: React.ReactNode; en: React.ReactNode }>) {
  return (
    <>
      <span data-i18n="vi">{vi}</span>
      <span data-i18n="en">{en}</span>
    </>
  );
}
