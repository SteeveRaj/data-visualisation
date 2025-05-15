import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './LineChart.css';

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 50, right: 120, bottom: 50, left: 60 };
    const width = 960 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const cleanedData = data.map(d => ({
      Année: +d.Année,
      Région: d.Région,
      Nombre_Arrivées: +d.Nombre_Arrivées
    }));

    const régions = Array.from(new Set(cleanedData.map(d => d.Région)));
    const années = Array.from(new Set(cleanedData.map(d => d.Année))).sort();

    const grouped = régions.map(region => ({
      region,
      values: années.map(année => {
        const record = cleanedData.find(d => d.Année === année && d.Région === region);
        return { année, value: record ? record.Nombre_Arrivées : 0 };
      })
    }));

    const x = d3.scaleLinear()
      .domain(d3.extent(années))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(grouped, g => d3.max(g.values, d => d.value)) || 0])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(régions)
      .range(d3.schemeCategory10);

    const line = d3.line()
      .x(d => x(d.année))
      .y(d => y(d.value));

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
      .call(d3.axisLeft(y));

    grouped.forEach(g => {
      svg.append("path")
        .datum(g.values)
        .attr("fill", "none")
        .attr("stroke", color(g.region))
        .attr("stroke-width", 2)
        .attr("d", line);

      svg.append("text")
        .datum(g.values[g.values.length - 1])
        .attr("x", x(g.values[g.values.length - 1].année) + 5)
        .attr("y", y(g.values[g.values.length - 1].value))
        .style("font-size", "12px")
        .style("fill", color(g.region))
        .text(g.region);
    });

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Évolution des arrivées par région");

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default LineChart;