// src/app/services/layout.js
export const metadata = {
  title: 'Services - Bhaktapur International Hospital',
  description: 'Detailed information about our medical services',
};

export default function ServicesLayout({ children }) {
  return (
    <main className="site-main">
      {children}
    </main>
  );
}