import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
const API_URL = 'https://SUA-URL-DO-RENDER.onrender.com';';

function App() {
  const [stats, setStats] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [hasData, setHasData] = useState(false);
  
  // Filtros
  const [filterCliente, setFilterCliente] = useState('');
  const [filterCidade, setFilterCidade] = useState('');

  // Carregar dados ao montar o componente
  useEffect(() => {
    checkData();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...pedidos];

    if (filterCliente) {
      filtered = filtered.filter(p => 
        p.razao_social?.toLowerCase().includes(filterCliente.toLowerCase())
      );
    }

    if (filterCidade) {
      filtered = filtered.filter(p => p.cidade === filterCidade);
    }

    setFilteredPedidos(filtered);
  }, [pedidos, filterCliente, filterCidade]);

  const checkData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/check-data`);
      setHasData(response.data.hasData);
      
      if (response.data.hasData) {
        await loadData();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao verificar dados:', error);
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, pedidosRes] = await Promise.all([
        axios.get(`${API_URL}/api/stats`),
        axios.get(`${API_URL}/api/pedidos`)
      ]);

      setStats(statsRes.data);
      setPedidos(pedidosRes.data);
      setFilteredPedidos(pedidosRes.data);
      setHasData(true);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message);
      await loadData();
      setUploading(false);
      event.target.value = '';
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao importar arquivo: ' + (error.response?.data?.error || error.message));
      setUploading(false);
    }
  };

  const clearFilters = () => {
    setFilterCliente('');
    setFilterCidade('');
  };

  const getCidades = () => {
    const cidades = [...new Set(pedidos.map(p => p.cidade))];
    return cidades.sort();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h1>Bem-vindo ao Dashboard de Pedidos</h1>
          <p>Nenhum dado encontrado. Importe um arquivo Excel para começar.</p>
          
          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-button">
              {uploading ? 'Importando...' : 'Importar Arquivo Excel'}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="info-box">
            <h3>Formato esperado do arquivo:</h3>
            <ul>
              <li>Colunas: PEDIDOS, DATA DO PEDIDO, COD CLIENTE, RAZÃO SOCIAL, CEP, ENDERECO, BAIRRO, Cidades, ESTADO, PESO PEDIDO, VALOR</li>
              <li>Formato: .xls ou .xlsx</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div>
            <h1>Dashboard de Pedidos</h1>
            <p className="subtitle">Análise Regional</p>
          </div>
          
          <div className="upload-section-header">
            <label htmlFor="file-upload-header" className="upload-button-small">
              {uploading ? 'Importando...' : 'Atualizar Dados'}
            </label>
            <input
              id="file-upload-header"
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="card kpi-card">
            <div className="kpi-label">Total de Pedidos</div>
            <div className="kpi-value">{stats?.total_pedidos || 0}</div>
            <div className="kpi-subtitle">{stats?.por_cidade?.length || 0} cidades atendidas</div>
          </div>

          <div className="card kpi-card">
            <div className="kpi-label">Peso Total</div>
            <div className="kpi-value">
              {(stats?.peso_total || 0).toLocaleString('pt-BR')} <span className="kpi-unit">kg</span>
            </div>
            <div className="kpi-subtitle">
              Média: {stats?.total_pedidos ? Math.round(stats.peso_total / stats.total_pedidos) : 0} kg/pedido
            </div>
          </div>

          <div className="card kpi-card">
            <div className="kpi-label">Valor Total</div>
            <div className="kpi-value">
              R$ {(stats?.valor_total || 0).toLocaleString('pt-BR')}
            </div>
            <div className="kpi-subtitle">
              Ticket médio: R$ {stats?.total_pedidos ? Math.round(stats.valor_total / stats.total_pedidos).toLocaleString('pt-BR') : 0}
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div className="rankings-grid">
          {/* Ranking por Valor */}
          <div className="card">
            <h2 className="card-title">Ranking por Valor</h2>
            <div className="ranking-list">
              {stats?.por_cidade?.slice(0, 5).map((cidade, index) => (
                <div key={cidade.cidade} className="ranking-item">
                  <div className={`ranking-badge ${index < 3 ? 'top-3' : ''}`}>
                    {index + 1}
                  </div>
                  <div className="ranking-content">
                    <div className="ranking-name">{cidade.cidade}</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(cidade.valor_total / stats.por_cidade[0].valor_total) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="ranking-stats">
                      <span className="ranking-count">{cidade.total_pedidos} pedidos</span>
                      <span className="ranking-value">R$ {cidade.valor_total.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking por Peso */}
          <div className="card">
            <h2 className="card-title">Ranking por Peso</h2>
            <div className="ranking-list">
              {[...stats?.por_cidade || []]
                .sort((a, b) => b.peso_total - a.peso_total)
                .slice(0, 5)
                .map((cidade, index) => {
                  const maxPeso = Math.max(...stats.por_cidade.map(c => c.peso_total));
                  return (
                    <div key={cidade.cidade} className="ranking-item">
                      <div className={`ranking-badge ${index < 3 ? 'top-3' : ''}`}>
                        {index + 1}
                      </div>
                      <div className="ranking-content">
                        <div className="ranking-name">{cidade.cidade}</div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ 
                              width: `${(cidade.peso_total / maxPeso) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="ranking-stats">
                          <span className="ranking-count">{cidade.total_pedidos} pedidos</span>
                          <span className="ranking-value">{cidade.peso_total.toLocaleString('pt-BR')} kg</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Outras Cidades */}
        {stats?.por_cidade?.length > 5 && (
          <div className="card">
            <h2 className="card-title">Outras Cidades</h2>
            <div className="other-cities-grid">
              {stats.por_cidade.slice(5).map(cidade => (
                <div key={cidade.cidade} className="city-card">
                  <div className="city-name">{cidade.cidade}</div>
                  <div className="city-stats">
                    <span className="city-stat">{cidade.total_pedidos} pedidos</span>
                    <span className="city-stat">{cidade.peso_total.toLocaleString('pt-BR')} kg</span>
                  </div>
                  <div className="city-value">R$ {cidade.valor_total.toLocaleString('pt-BR')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabela de Pedidos */}
        <div className="card">
          <h2 className="card-title">Detalhamento de Pedidos</h2>

          {/* Filtros */}
          <div className="filters-grid">
            <div className="filter-group">
              <label>Buscar por Cliente</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Digite o nome do cliente..."
                value={filterCliente}
                onChange={(e) => setFilterCliente(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Filtrar por Cidade</label>
              <select
                className="filter-input"
                value={filterCidade}
                onChange={(e) => setFilterCidade(e.target.value)}
              >
                <option value="">Todas as cidades</option>
                {getCidades().map(cidade => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>&nbsp;</label>
              <button className="clear-button" onClick={clearFilters}>
                Limpar Filtros
              </button>
            </div>
          </div>

          <div className="table-info">
            Total de registros: <strong>{filteredPedidos.length}</strong>
          </div>

          {/* Tabela */}
          <div className="table-container">
            {filteredPedidos.length === 0 ? (
              <div className="no-results">
                <p>Nenhum resultado encontrado</p>
                <p className="no-results-subtitle">Tente ajustar os filtros de busca</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Cidade</th>
                    <th>Estado</th>
                    <th className="text-right">Peso (kg)</th>
                    <th className="text-right">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>
                        <span className="badge">#{pedido.pedido}</span>
                      </td>
                      <td>{pedido.data}</td>
                      <td>{pedido.razao_social}</td>
                      <td><strong>{pedido.cidade}</strong></td>
                      <td>{pedido.estado}</td>
                      <td className="text-right">{pedido.peso_pedido.toLocaleString('pt-BR')}</td>
                      <td className="text-right">R$ {pedido.valor.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
