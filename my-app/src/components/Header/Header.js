// components/Header/Header.js
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../../images/Logo.png';
import { media } from '../../styles/media';

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  height: 72px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: relative;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 100%;

  img {
    height: 40px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;

  ${media.tablet} {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background-color: ${({ theme }) => theme.colors.bgHover};
  }

  &.active {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
  }
`;

export default function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <StyledHeader>
      <HeaderContent>
        <LogoLink to="/">
          <img src={logoImage} alt="Euphoria Logo" />
        </LogoLink>

        <Nav>
          <NavLink to="/home" className={isActive('/home') ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/catalog" className={isActive('/catalog') ? 'active' : ''}>
            Catalog
          </NavLink>
        </Nav>
      </HeaderContent>
    </StyledHeader>
  );
}