import React from 'react'

import BreakdownDonut from './BreakdownDonut'

export default {
    title: 'omnia components/visualisation/BreakdownDonut',
    component: BreakdownDonut
}

const Template = (props) => (
    <div style={{ height: '80vh', padding: 30, background: '#1D262C'}}>
        <BreakdownDonut
            className=""
            {...props}
        />
    </div>
)

export const Intro = Template.bind({})

Intro.args = {
data: [
    {label: 'Drawn', value: 32947, valueText: '$33k'},
    {label: 'Undrawn', value: 11365, valueText: '$11k'}

],
}