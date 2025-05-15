import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './GroupedBarChart.css';

const GroupedBarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 100, left: 60 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Nettoyage et conversion des données
    const cleanedData = data.map(d => ({
      Année: d.Année,
      Région: d.Région,
      Nombre_Arrivées: +d.Nombre_Arrivées
    }));

    const années = Array.from(new Set(cleanedData.map(d => d.Année))).sort();
    const régions = Array.from(new Set(cleanedData.map(d => d.Région)));

    const grouped = d3.groups(cleanedData, d => d.Année);

    // Scales
    const x0 = d3.scaleBand()
      .domain(années)
      .range([0, width])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(régions)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanedData, d => d.Nombre_Arrivées) || 0])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(régions)
      .range(d3.schemeCategory10);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("g.year")
      .data(grouped)
      .enter()
      .append("g")
      .attr("class", "year")
      .attr("transform", d => `translate(${x0(d[0])},0)`)
      .selectAll("rect")
      .data(d => régions.map(region => {
        const record = d[1].find(r => r.Région === region);
        return {
          région: region,
          année: d[0],
          Nombre_Arrivées: record ? record.Nombre_Arrivées : 0
        };
      }))
      .enter()
      .append("rect")
      .attr("x", d => x1(d.région))
      .attr("y", d => y(d.Nombre_Arrivées))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.Nombre_Arrivées))
      .attr("fill", d => color(d.région));

    // Titre
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text("Arrivées Touristiques par Région et par Année");

    // Légende
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 100}, 0)`);

    régions.forEach((region, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(region));

      legendRow.append("text")
        .attr("x", -10)
        .attr("y", 12)
        .attr("text-anchor", "end")
        .text(region);
    });

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default GroupedBarChart;