

import React from 'react'
import styled from 'styled-components'

function Title(props: any) {
    return <T {...props} >
        {props.children}
    </T>
}
function Date(props: any) {
    return <D {...props} >
        {props.children}
    </D>
}
function Paragraph(props: any) {
    return <P {...props} >
        {props.children}
    </P>
}
function Link(props: any) {
    return <L {...props} >
        {props.children}
    </L>
}

const T = styled.div`
color:#3C3F41;
font-size: 20px;
font-style: normal;
font-weight: 500;
line-height: 26px;
letter-spacing: 0.7px;
text-align: left;
margin-bottom:10px;

        `
const D = styled.div`
font-family: Roboto;
font-size: 10px;
font-style: normal;
font-weight: 400;
line-height: 20px;
letter-spacing: 1px;
text-align: left;
color:#B0B7BC;
margin-bottom:10px;
        `
const P = styled.div`
font-family: Roboto;
font-size: 14px;
color:#5F6368;
font-style: normal;
font-weight: 400;
line-height: 20px;
letter-spacing: 0px;
text-align: left;
margin-bottom:10px;
        `

const L = styled.div`
font-family: Roboto;
font-size: 13px;
font-style: normal;
font-weight: 400;
line-height: 20px;
letter-spacing: 0px;
text-align: left;
color:#618AFF;
        `

export { Title, Date, Paragraph, Link }