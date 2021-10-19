import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import NoneSpace from '../people/utils/noneSpace';
import { Button, Modal, SearchTextInput, Divider } from '../sphinxUI';
import { useStores } from '../store';
import { useObserver } from 'mobx-react-lite'
import { EuiLoadingSpinner } from '@elastic/eui';
import { useFuse, useScroll } from '../hooks'
import { colors } from '../colors'
import FadeLeft from '../animated/fadeLeft';
import { useIsMobile } from '../hooks';
import Bot from './bot'
import Form from '../form';
import { botSchema } from '../form/schema';
import MaterialIcon from '@material/react-material-icon';
import BotView from './botView'

// avoid hook within callback warning by renaming hooks
const getFuse = useFuse
const getScroll = useScroll

export default function BotBody() {
    const { main, ui } = useStores()
    const [loading, setLoading] = useState(false)
    const [showBotCreator, setShowBotCreator] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [selectedWidget, setSelectedWidget] = useState('top')
    const [showDropdown, setShowDropdown] = useState(false)

    const c = colors['light']
    const isMobile = useIsMobile()

    function selectBot(unique_name: string) {
        console.log('selectBot', unique_name)
        ui.setSelectedBot(unique_name)
        ui.setSelectingBot(unique_name)
    }

    async function createBot(v: any) {
        console.log('createBot!')
        try {
            await main.makeBot(v)
        } catch (e) {
            console.log('e', e)
        }
        setShowBotCreator(false)
        setShowCreate(false)
    }

    async function loadBots() {
        setLoading(true)
        let un = ''
        if (window.location.pathname.startsWith('/b/')) {
            un = window.location.pathname.substr(3)
        }
        const ps = await main.getBots(un)
        // if (un) {
        //     const initial = ps[0]
        //     if (initial && initial.unique_name === un) ui.setSelectedBot(initial.id || 0)
        // }
        setLoading(false)
    }

    useEffect(() => {
        loadBots()
    }, [])

    const tabs = [
        {
            label: 'Top',
            name: 'top',

        },
        {
            label: 'Music',
            name: 'music',
            disabled: true

        }
    ]
    function redirect() {
        let el = document.createElement('a')
        el.target = '_blank'
        el.href = 'https://github.com/stakwork/sphinx-relay/blob/master/docs/deep/bots.md'
        el.click();
    }

    return useObserver(() => {
        const bs = getFuse(main.bots, ["name", "description"])
        const { handleScroll, n, loadingMore } = getScroll()
        let bots = bs.slice(0, n)

        bots = (bots && bots.filter(f => !f.hide)) || []


        if (loading) {
            return <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                <EuiLoadingSpinner size="xl" />
            </Body>
        }

        const widgetLabel = selectedWidget && tabs.find(f => f.name === selectedWidget)

        if (isMobile) {
            return <Body>
                {!ui.meInfo &&
                    <div style={{ marginTop: 50 }}>
                        <NoneSpace
                            buttonText={'Get Started'}
                            buttonIcon={'arrow_forward'}
                            action={() => ui.setShowSignIn(true)}
                            img={'bots_nonespace.png'}
                            text={'Discover Bots on Sphinx'}
                            sub={'Spice up your Sphinx experience with our diverse range of Sphinx bots'}
                            style={{ background: '#fff', height: 400 }}
                        />
                        <Divider />
                    </div>
                }
                <div style={{
                    width: '100%', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'flex-start', padding: 20,
                    height: 62, marginBottom: 20
                }}>
                    <Label style={{ fontSize: 20 }}>
                        Explore
                        <Link
                            onClick={() => setShowDropdown(true)}>
                            <div>{widgetLabel && widgetLabel.label}</div>
                            <MaterialIcon icon={'expand_more'} style={{ fontSize: 18, marginLeft: 5 }} />

                            {showDropdown && <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, background: '#fff' }}>
                                {tabs && tabs.map((t, i) => {
                                    const label = t.label
                                    const selected = selectedWidget === t.name

                                    return <Tab key={i}
                                        style={{ borderRadius: 0, margin: 0 }}
                                        selected={selected}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowDropdown(false)
                                            setSelectedWidget(t.name)
                                        }}>
                                        {label}
                                    </Tab>
                                })}
                            </div>}
                        </Link>
                    </Label>



                    <SearchTextInput
                        small
                        name='search'
                        type='search'
                        placeholder='Search'
                        value={ui.searchText}
                        style={{ width: 164, height: 40, border: '1px solid #DDE1E5', background: '#fff' }}
                        onChange={e => {
                            console.log('handleChange', e)
                            ui.setSearchText(e)
                        }}

                    />

                </div>
                <div style={{ width: '100%' }} >
                    {bots.map(t => <Bot
                        {...t} key={t.id}
                        selected={ui.selectedBot === t.id}
                        small={isMobile}
                        select={() => selectBot(t.unique_name)}
                    />)}
                </div>
                <FadeLeft
                    withOverlay
                    drift={40}
                    overlayClick={() => ui.setSelectingBot('')}
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 10000, width: '100%' }}
                    isMounted={ui.selectingBot ? true : false}
                    dismountCallback={() => ui.setSelectedBot('')}
                >
                    <BotView goBack={() => ui.setSelectingBot('')}
                        botUniqueName={ui.selectedBot}
                        loading={loading}
                        selectBot={selectBot}
                        botView={true} />
                </FadeLeft>
            </Body >
        }

        // desktop mode
        return <Body style={{
            background: '#f0f1f3',
            height: 'calc(100% - 65px)'
        }}>

            {!ui.meInfo &&
                <div style={{ marginTop: 50 }}>
                    <NoneSpace
                        buttonText={'Get Started'}
                        buttonIcon={'arrow_forward'}
                        action={() => ui.setShowSignIn(true)}
                        img={'bots_nonespace.png'}
                        text={'Discover Bots on Sphinx'}
                        sub={'Spice up your Sphinx experience with our diverse range of Sphinx bots'}
                        style={{ height: 400 }}
                    />
                    <Divider />
                </div>
            }

            <div style={{
                width: '100%', display: 'flex',
                justifyContent: 'space-between', alignItems: 'flex-start', padding: 20,
                height: 62
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Label style={{ marginRight: 46 }}>
                        Explore
                    </Label>

                    <Tabs>
                        {tabs && tabs.map((t, i) => {
                            const label = t.label
                            const selected = selectedWidget === t.name

                            return <Tab key={i}
                                selected={selected}
                                onClick={() => {
                                    setSelectedWidget(t.name)
                                }}>
                                {label}
                            </Tab>
                        })}

                    </Tabs>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>

                    <Button
                        text={'Add a Bot'}
                        leadingIcon={'add'}
                        height={40}
                        color='primary'
                        onClick={() => setShowBotCreator(true)}
                    />

                    <SearchTextInput
                        name='search'
                        type='search'
                        placeholder='Search'
                        value={ui.searchText}
                        style={{ width: 204, height: 40, background: '#DDE1E5', marginLeft: 20 }}
                        onChange={e => {
                            console.log('handleChange', e)
                            ui.setSearchText(e)
                        }}

                    />
                </div>
            </div>

            <>
                <div style={{
                    width: '100%', display: 'flex', flexWrap: 'wrap', height: '100%',
                    justifyContent: 'flex-start', alignItems: 'flex-start', padding: 20
                }}>
                    {bots.map(t => <Bot
                        {...t} key={t.id}
                        small={false}
                        selected={ui.selectedBot === t.id}
                        select={() => selectBot(t.unique_name)}
                    />
                    )}
                </div>
                <div style={{ height: 100 }} />
            </>


            {/* selected view */}
            <FadeLeft
                withOverlay={isMobile}
                drift={40}
                overlayClick={() => ui.setSelectingBot('')}
                style={{ position: 'absolute', top: isMobile ? 0 : 65, right: 0, zIndex: 10000, width: '100%' }}
                isMounted={ui.selectingBot ? true : false}
                dismountCallback={() => ui.setSelectedBot('')}
            >
                <BotView goBack={() => ui.setSelectingBot('')}
                    botUniqueName={ui.selectedBot}
                    loading={loading}
                    selectBot={selectBot}
                    botView={true} />
            </FadeLeft>

            <Modal
                close={() => {
                    setShowBotCreator(false)
                    setShowCreate(false)
                }}
                visible={showBotCreator}>
                {showCreate ? <Form
                    loading={loading}
                    close={() => setShowCreate(false)}
                    onSubmit={createBot}
                    schema={botSchema}
                    initialValues={{}}
                /> :
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            text={'Build your own bot'}
                            leadingIcon={'open_in_new'}
                            height={50}
                            width={200}
                            onClick={() => redirect()} />
                        <div style={{ height: 20 }} />
                        <Button
                            text={'Add a bot listing'}
                            color={'primary'}
                            disabled={true}
                            height={50}
                            width={200}
                            onClick={() => setShowCreate(true)} />
                    </div>
                }

            </Modal>

        </Body >
    }
    )
}

const Body = styled.div`
            flex:1;
            height:calc(100% - 105px);
            padding-bottom:80px;
            width:100%;
            overflow:auto;
            display:flex;
            flex-direction:column;
            `
const Label = styled.div`
            font-family: Roboto;
            font-style: normal;
            font-weight: bold;
            font-size: 26px;
            line-height: 40px;
            /* or 154% */
            
            display: flex;
            align-items: center;
            
            /* Text 2 */
            
            color: #3C3F41;`


const Tabs = styled.div`
display:flex;
`;

interface TagProps {
    selected: boolean;
}
const Tab = styled.div<TagProps>`
display:flex;
padding:10px 25px;
margin-right:35px;
color:${p => p.selected ? '#5078F2' : '#5F6368'};
// border-bottom: ${p => p.selected && '4px solid #618AFF'};
cursor:pointer;
font-weight: 500;
font-size: 15px;
line-height: 19px;
background:${p => p.selected ? '#DCEDFE' : '#3C3F4100'};
border-radius:25px;
min-width:89px;
justify-content:center;
align-items:center;
`;
const Link = styled.div`
            display:flex;
            justify-content:center;
            align-items:center;
            margin-left:6px;
            color:#618AFF;
            cursor:pointer;
            position:relative;
            `;