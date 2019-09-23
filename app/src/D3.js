import React, { useEffect } from "react";
import * as d3 from "d3";
import * as chroma from "chroma-js"


function getFontSize(d, dis) {
return Math.min(2 * d.radius, (2 * d.radius - 8) / dis.getComputedTextLength() * 15) + "px"; 
}

const D3 = ({ data, socket }) => {
  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    var width = 400,
      height = 400;

    var x = d3
      .scaleLinear()
      .domain([0, 20])
      .range([30, 55]);
    var nodes = Object.keys(data).map(d => {
      return {text_color: data[d].text_color, color:data[d].color, name: d, radius: x(data[d].vote), id:d.replace(' ', '_') };
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
    var c = n.append("circle")
     .attr('id', d => d.id+'c')
     .attr('fill', d => d.color)
     .style('stroke', 'white')
     .style('stroke-width', '5px')
    .attr("r", function(d) {
      return d.radius;
    })
    .on('click', (d) => {
      socket.emit('colorword', {word: d.name, color: chroma.random().hex(), type:"circ"})
      // const c = d3.select(`#${d.id}c`)

      // console.log(c)
      // c.attr('fill', chroma.random())
    });

    var t = n
      .append("text")
      .attr('id', d => d.id+'t')
      .attr("text-anchor", "middle")
      // .style("font-size", d => d.radius/4)
      .style("fill", d => d.text_color)
      // .style('stroke', 'white')
      .style('font-weight', 'bolder')
      .text(d => d.name)
        .style("font-size", function(d) {return getFontSize(d, this)})
      .style('stroke-width', d => d.radius/100)

      .on('click', (d) => {
              socket.emit('colorword', {word: d.name, color: chroma.random().hex(), type:"text"})
        // const t = d3.select(`#${d.id}t`)
        // t.style('stroke', chroma.random())
        // t.style('fill', chroma.random())
      });

    function ticked() {
      c.attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });

      t.attr("x", d => d.x)
      .attr("y", function(d){
        const divisor = d.y + d.radius /5 - this.textContent.length / 7
        return divisor
      });
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
