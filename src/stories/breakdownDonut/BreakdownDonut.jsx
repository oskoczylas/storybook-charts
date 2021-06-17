import React, {useRef, useEffect, useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import styled from 'styled-components'
import useResizeObserver from './useResizeObserver'

export default function BreakdownDonutThree({data, styleAttributes, donutWidth}) {
const wrapperRef = useRef()
const resizedDimensions = useResizeObserver(wrapperRef)
const [chartInnerRadius, setChartInnerRadius] = useState(0)
const [width, setWidth] = useState(0)
const [height, setHeight] = useState(0)
const [wrapperMinimumDimensions, setWrapperMinimumDimensions] = useState(0)
const [padding, setPadding] = useState(0)
const [h, setH] = useState(0)

const fontSize = useMemo(() => {
    const scale = d3.scaleLinear()
    .domain([200, 280])
    .range([11, 16])
return scale(chartInnerRadius * 2)
}, [chartInnerRadius])

useEffect(() => {
    if (!resizedDimensions) return
setWidth(resizedDimensions.width)
setHeight(resizedDimensions.height)

const svg = d3
    .select(wrapperRef.current)
    .select('svg')
    .attr('width', width)
    .attr('height', height)

setWrapperMinimumDimensions(Math.min(width, height))
setPadding(wrapperMinimumDimensions * 0.09)
setH(wrapperMinimumDimensions - (padding * 2))
const g = svg.select('g').attr('transform', `translate(${width / 2}, ${padding + (h / 2)})`)
g.selectAll('*').remove()

// draw chart

const pie = d3.pie().value((d)=> d.value)
const innerRadius = (h / 2) - (h * donutWidth)
setChartInnerRadius(innerRadius)
const arc = d3.arc().innerRadius(innerRadius).outerRadius(h / 2)

g.selectAll('segment')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (_, i) => styleAttributes.colors[i])

},[h, data, width, height, padding, donutWidth, styleAttributes, resizedDimensions, wrapperMinimumDimensions])

return (
    <StyledBreakdownDonut 
    ref={wrapperRef}
    >
        <svg>
            <g/>    
        </svg>
        <StyledBreakdownDonutInner
        width={width}
        padding={padding}
        h={h}
        fontSize={fontSize}
        style={{ width: chartInnerRadius * 1.32, height: chartInnerRadius * 1.8}}
        styleAttributes={styleAttributes}
        >
        <div className="headline">
            <h5 className="title">NOT Unconditionally Cancellable</h5>
            <h4 className="first-value"> $73</h4>
            <h3 className="subtitle"> CR RWA</h3>
        </div>
        <div className="variance">
            <div>
            <div className="text-icon-container">
                <h6 className="text">Undraw</h6>
            </div>
            <h3 className="value">$30k</h3>
            </div>
            <div>
                <h6 className="text">Drawn</h6>
                <h3 className="value">$12k</h3>
            </div>
        </div>
        </StyledBreakdownDonutInner>
    </StyledBreakdownDonut>
)
}

BreakdownDonutThree.propTypes = {
    data: PropTypes.arrayOf(
    PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.number,
        valueText: PropTypes.string
}).isRequired
).isRequired,
StyleAttributes: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    textColor: PropTypes.string
}),
donutWidth: PropTypes.number

}
BreakdownDonutThree.defaultProps = {
    donutWidth: 0.05,
    styleAttributes: {
        colors: ['#1087EF', '#EDB343'],
        // fonts: [
        //     ''
        // ]
        textColor: null
    }
}
const StyledBreakdownDonut = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    > svg {
        position: absolute;
        pointer-events: none;
        width: 100%;
        height: 100%;
    }
`
const StyledBreakdownDonutInner = styled.div`
    font-size: ${({ fontSize}) => fontSize}px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    position: absolute;
    top: ${({padding}) => padding}px;
    margin: ${({padding}) => padding}px;
    .text {
        color: white;
    }
    .value {
        font-size: 112.5%;
        color: white;
        white-space: nowrap;
    }
    .headline {
        display: flex;
        flex-direction: column;
        aligne-items: center;
            .title {
                font-size: 62.5%;
                color: #A7A7A7;
                margin: 22% 20% 12% 20%;
            }
            .first-value {
                font-size: 150%;
                color: #FFFFFF;
                margin: 0;
            }
            .subtitle {
                font-size: 87.5%;
                color: #A5B4BF;
                margin: 7.47% 0;

            }
    }

    .variance {
        display: flex;
        justify-content: space-between;
        padding: 4% 0 37.4% 0;
        border-top: 1px solid #5A6A75;
        > div {
            flex: 1;
            &:first-of-type {
                border-right: 1px dashed #5A6A75;
                text-align: left;
                padding-bottom: 8.8%;
                    > h3 {
                        color: ${({styleAttributes}) => styleAttributes.colors[0]};
                    }
        }
            &:last-of-type {
                text-align: end;
                > h6, h3 {
                    color: ${({styleAttributes}) => styleAttributes.colors[1]};
                }
            }
            .text {
                font-size: 62.5%;
                margin: 0 0 12.6% 0;
            }
            .value {
                font-size: 87.5%;   
                margin: 0;
            }
            .text-icon-container {
                display: flex;  
                justify-content: space-between;
                    > span {
                    margin: 0 7% 0 0;
                    }
                > h6 {
                    color: ${({styleAttributes}) => styleAttributes.colors[0]};
                }
                > img {
                    height: 21%;
                    width: 21%;
                    padding-right: 10%;
                }
            }
    }   
}
`