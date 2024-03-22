import React, { useState } from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import {SidebarData} from './SidebarData'
import SubMenu from './SubMenu'
import { IconContext } from 'react-icons/lib';
import {OutsideClickDetector} from './OutsideClickDetector.js';

const Nav = styled.div`
    background: #15171c;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const NavIcon = styled(Link)`
    margin-left: 2rem;
    font-size: 2rem;
    height: 80px;
    display:flex;
    justify-content: flex-start;
    align-items: center;
`;

const Sidebarnav = styled.nav`
    background: #15171c;
    width: 250px;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    position: fixed;
    top: 0;
    left: ${(props)  => (props.$sidebar ? "0" : '-100%')};
    transition: 350ms;
    z-index: 10;
`;

const SidebarWrap = styled.div`
    width: 100%;
`;

const Sidebar = () => {

    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar (sidebar ? false : true)

    const handleClickOutside = () => {
      if (sidebar) {
        setSidebar(false)
      } else {
        return
      }
    };

    return (
        <>
          <OutsideClickDetector handleClickOutside={handleClickOutside}>
            <IconContext.Provider value={{ color: '#fff'}}>
            <Nav>
                <NavIcon to='#'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </NavIcon>
            </Nav>
            <Sidebarnav $sidebar={sidebar}>
                <SidebarWrap>
                    <NavIcon>
                        <AiIcons.AiOutlineClose onClick={showSidebar}/>
                    </NavIcon>
                    {SidebarData.map((item, index) =>{
                        return <SubMenu item={item} key={index} />;
                    })}
                </SidebarWrap>
            </Sidebarnav>
            </IconContext.Provider>
          </OutsideClickDetector>
        </>
    );
}
export default Sidebar;