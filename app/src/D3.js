import React, { useEffect } from "react";
import * as d3 from "d3";
const D3 = ({ data }) => {
  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    console.log(data);
    var width = 400,
      height = 400;

    var x = d3
      .scaleLinear()
      .domain([0, 20])
      .range([30, 55]);
    var nodes = Object.keys(data).map(d => {
      return { name: d, radius: x(data[d]) };
    });

    var simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius(function(d) {
          return d.radius;
        })
      )
      .on("tick", ticked);
    function dragsubject() {
      return simulation.find(d3.event.x, d3.event.y);
    }
    d3.select("svg").call(
      d3
        .drag()
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
    var u = d3
      .select("svg")
      .selectAll("circle")
      .data(nodes);

    var n = u.enter();
    var c = n.append("circle").attr("r", function(d) {
      return d.radius;
    });

    var t = n
      .append("text")
      .attr("text-anchor", "middle")
      .style("font-size", "1rem")
      .style("fill", "red")
      .text(d => d.name);

    function ticked() {
      c.attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });

      t.attr("x", d => d.x).attr("y", d => d.y);
    }

    function dragstarted() {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
    }

    function dragged() {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragended() {
      if (!d3.event.active) simulation.alphaTarget(0);
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }

    return () => {
      d3.select("svg")
        .selectAll("*")
        .remove();
    };
  }, [data]);
  return <svg width="400" height="400" />;
};

export default D3;
