import React, { useEffect } from "react"
import * as d3 from "d3"
const D3 = ({ data }) => {

    useEffect(() => {
        if (Object.keys(data).length === 0) return
        console.log(data)
        var width = 400, height = 400

        var x = d3.scaleLinear()
            .domain([0, 200])
            .range([30, 55])
        var nodes = Object.keys(data).map(d => {
            return { name: d, radius: x(data[d]) }
        })
        console.log(1)

        var simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(function (d) {
                return d.radius
            }))
            .on('tick', ticked);

        function ticked() {
            var u = d3.select('svg')
                .selectAll('circle')
                .data(nodes)

            var n = u.enter()
            n.append('circle')
                .attr('r', function (d) {
                    return d.radius
                })
                .merge(u)
                .attr('cx', function (d) {
                    return d.x
                })
                .attr('cy', function (d) {
                    return d.y
                })
                .text(d => d.name)

            var t = d3.select('svg')
                .selectAll('text')
                .data(nodes)

            var m = t.enter()
            m.append('text')
                .merge(t)
                .attr('text-anchor', 'middle')
                .attr('x', d => d.x)
                .attr('y', d => d.y)
                .style('font-size', '1rem')
                .style('fill', 'red')
                .text(d => d.name)

            u.exit().remove()
            t.exit().remove()



        }
        return () => {
            console.log('clean')
        };
    }, [data])
    return (
        <svg width="400" height="400" />

    )
}

export default D3;