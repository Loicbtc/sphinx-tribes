import React from 'react'
import styled from "styled-components";
import { Wanted } from '../../../form/inputs/widgets/interfaces';
import { formatPrice } from '../../../helpers';
import { Divider } from '../../../sphinxUI';
import GalleryViewer from '../../utils/galleryViewer';

export default function WantedSummary(props: Wanted) {
        const { title, description, priceMin, priceMax, url, gallery } = props

        return <>

                <GalleryViewer gallery={gallery} selectable={false} wrap={false} big={true} />
                <Divider />
                <Pad>
                        <Y>
                                <div>Price</div>
                                <P>{formatPrice(priceMin)} <B>sat</B> - {formatPrice(priceMax)} <B>sat</B></P>
                        </Y>
                        <Divider style={{
                                marginBottom: 10
                        }} />


                        <T>{title || 'No title'}</T>
                        <D>{description || 'No description'}</D>
                </Pad>

        </>

}
const Pad = styled.div`
        padding: 0 20px;
        `;
const Y = styled.div`
        display: flex;
        justify-content:space-between;
        width:100%;
        height:50px;
        align-items:center;
        `;
const T = styled.div`
        font-weight:bold;
        font-size:20px;
        margin: 10px 0;
        `;
const B = styled.span`
        font-weight:300;
        `;
const P = styled.div`
        font-weight:500;
        `;
const D = styled.div`
        color:#5F6368;
        margin: 10px 0;
        `;


const Body = styled.div`
        font-size:14px;
        margin-left:10px;
        font-size: 15px;
        line-height: 20px;
        /* or 133% */

        display: flex;
        flex-direction:column;
        justify-content: space-around;

        /* Primary Text 1 */

        color: #292C33;
        overflow:hidden;
        `;
