/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      <Dashboard searchTerm={searchTerm} />
    </Layout>
  );
}
