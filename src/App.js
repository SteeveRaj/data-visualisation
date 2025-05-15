import React, { useState, useEffect } from 'react';
 import LineChart from './components/LineChart';
 import GroupedBarChart from './components/GroupedBarChart';
 import PieChart from './components/PieChart';
 import './App.css';
 import * as d3 from 'd3';
 

 function App() {
  const [data, setData] = useState([]);
 

  useEffect(() => {
  fetchData();
  }, []);
 

  const fetchData = async () => {
  try {
    const response = await fetch('tourisme_madagascar.csv');
    const csvText = await response.text();
    const csvData = d3.csvParse(csvText);
    setData(csvData);
  } catch (error) {
  console.error('Error fetching data:', error);
  }
  };
 

  // Préparer les données pour le graphique circulaire (exemple)
  const pieChartData = () => {
  if (!data || data.length === 0) return [];
 

  //  Calculer les dépenses totales par secteur (Motif_Visite)
  const groupedData = d3.rollup(data, v => d3.sum(v, d => d.Dépenses_Moyennes), d => d.Motif_Visite);
  const arrayData = Array.from(groupedData, ([Secteur, Dépenses]) => ({ Secteur, Dépenses }));
 

  return arrayData;
  };
 

  return (
    <div className="app-container">
    <h1>Tableau de Bord du Tourisme à Madagascar</h1>
    <div className="chart-container">
    <LineChart data={data} />
    </div>
    <div className="chart-container">
    <GroupedBarChart data={data} />
    </div>
    <div className="chart-container">
    <PieChart data={data} />
    </div>
    </div>
  );
 }
 

 export default App;