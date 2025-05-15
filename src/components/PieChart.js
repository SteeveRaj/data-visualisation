import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Définir un objet avec une couleur fixe pour chaque ville
const cityColorMap = {
  "Nosy Be": "#1f77b4",
  "Diego Suarez": "#ff7f0e",
  "Antananarivo": "#2ca02c",
  "Sainte Marie": "#d62728",
  // Ajouter d'autres villes ici avec des couleurs fixes
};

// Fonction pour générer une couleur aléatoire pour les villes manquantes
const generateRandomColor = () => {
  return `hsl(${Math.random() * 360}, 100%, 50%)`; // Couleur aléatoire
};

const PieChartWithSelector = ({ data }) => {
  const svgRef = useRef();
  const [selectedYear, setSelectedYear] = useState(null);

  // Extraire toutes les années disponibles dans le CSV
  const years = Array.from(new Set(data.map(d => d.Année))).sort();

  useEffect(() => {
    if (!selectedYear) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const filteredData = data
      .filter(d => d.Année === selectedYear)
      .reduce((acc, cur) => {
        acc[cur.Ville] = (acc[cur.Ville] || 0) + +cur.Nombre_Arrivées;
        return acc;
      }, {});

    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const pieData = pie(Object.entries(filteredData));

    svg.selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => {
        // Vérifier si la ville a une couleur définie, sinon générer une couleur aléatoire
        const city = d.data[0];
        return cityColorMap[city] || generateRandomColor();
      })
      .attr("stroke", "#fff")
      .style("stroke-width", "2px");

    svg.selectAll("text")
      .data(pieData)
      .enter()
      .append("text")
      .text(d => d.data[0])
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px");

    svg.append("text")
      .attr("y", -height / 2 + 20)
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`Répartition des arrivées en ${selectedYear}`);

  }, [data, selectedYear]);

  return (
    <div>
      <label htmlFor="year-select">Choisissez une année : </label>
      <select
        id="year-select"
        value={selectedYear || ''}
        onChange={e => setSelectedYear(e.target.value)}
      >
        <option value="" disabled>Sélectionner une année</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PieChartWithSelector;