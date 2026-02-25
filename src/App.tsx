import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';

/**
 * App Component
 * Maneja el estado global de búsqueda y la estructura principal del sitio.
 */
function App() {
  const [query, setQuery] = useState('');

  return (
    <Layout searchTerm={query} setSearchTerm={setQuery}>
      <Dashboard searchTerm={query} />
    </Layout>
  );
}

export default App;