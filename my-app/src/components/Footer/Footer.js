import { useState } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import facebookIcon from "../../images/facebook_icon.svg";
import instagramIcon from "../../images/instagram_icon.svg";
import twitterIcon from "../../images/twitter_icon.svg";
import { Container } from '../UI/Container/Container';
import { Button } from '../UI/Button/Button';
import { Typography } from '../UI/Typography/Typography';
import { Input } from '../UI/Input/Input';
import { media } from '../../styles/media';

const StyledFooter = styled.footer`
  background: ${({ theme }) => theme.colors.footerBg};
  color: ${({ theme }) => theme.colors.footerText};
  padding: ${({ theme }) => theme.spacing[6]} 0 ${({ theme }) => theme.spacing[4]};
  margin-top: auto;
  font-family: ${({ theme }) => theme.fonts.main};
  line-height: 1.6;
  transition: ${({ theme }) => theme.transitions.base};

  ${media.tablet} {
    padding: ${({ theme }) => theme.spacing[8]} 0 ${({ theme }) => theme.spacing[6]};
  }
`;

const FooterContainer = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[6]};

  ${media.tablet} {
    gap: ${({ theme }) => theme.spacing[8]};
    padding-bottom: ${({ theme }) => theme.spacing[8]};
  }

  ${media.mobile} {
    flex-direction: column;
    align-items: center;
  }
`;

const FooterColumn = styled.div`
  flex: 1 1 250px;
  min-width: 200px;

  ${media.tablet} {
    flex: 1 1 200px;
  }

  ${media.mobile} {
    flex: 1 1 100%;
    text-align: center;
  }
`;

const FooterTitle = styled(Typography).attrs({ variant: 'h3', as: 'h2' })`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.footerText};
  text-align: ${({ theme, $align }) => $align || 'left'};

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 2px;
    background: ${({ theme }) => theme.colors.footerAccent};
    transition: width 0.3s ease;

    ${media.mobile} {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover::after {
    width: 60px;
  }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.footerText};
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.base};
  display: inline-block;
  opacity: 0.9;

  &:hover {
    color: ${({ theme }) => theme.colors.footerAccent};
    transform: translateX(4px);
    opacity: 1;
  }
`;

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.footerText};
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.base};
  display: inline-block;
  opacity: 0.9;

  &:hover {
    color: ${({ theme }) => theme.colors.footerAccent};
    transform: translateX(4px);
    opacity: 1;
  }
`;

const SubscribeSection = styled.section`
  flex: 1 1 min(100%, 400px);
  max-width: 400px;
  text-align: center;

  ${media.mobile} {
    max-width: 100%;
  }
`;

const FooterForm = styled.form`
  margin-top: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const SubscribeButton = styled(Button)`
  width: 100%;
`;

const Disclaimer = styled(Typography).attrs({ variant: 'caption' })`
  margin-top: ${({ theme }) => theme.spacing[2]};
  text-align: center;
`;

const FooterBottom = styled.div`
  width: 100%;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.footerBorder};
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.footerAccent};
    transform: translateY(-3px) scale(1.1);
  }
`;

const SocialIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;

  ${SocialLink}:hover & {
    transform: scale(1.2);
  }
`;

const Copyright = styled(Typography).attrs({ variant: 'caption' })`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.7;
`;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribed with email:', email);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <StyledFooter>
      <FooterContainer $fluid={false}>
        <FooterColumn>
          <FooterTitle $align="left">Shop</FooterTitle>
          <FooterList>
            <li>
              <FooterLink to="/home">Home</FooterLink>
            </li>
            <li>
              <FooterLink to="/catalog">Catalog</FooterLink>
            </li>
          </FooterList>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle $align="left">Contacts</FooterTitle>
          <FooterList>
            <li>
              <ExternalLink as="span" style={{ cursor: 'default' }}>
                +1 (234) 567-89-00
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="mailto:info@euphoria.com">
                info@euphoria.com
              </ExternalLink>
            </li>
          </FooterList>
        </FooterColumn>

        <SubscribeSection>
          <FooterTitle $align="center">Newsletter</FooterTitle>
          <Typography variant="body" $align="center" $gutterBottom>
            Subscribe for exclusive offers and updates
          </Typography>
          <FooterForm onSubmit={handleSubmit}>
            <FormGroup>
              {/* Используем ваш Input */}
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                $success={isSubscribed}
                disabled={isSubscribed}
              />
              {/* Используем ваш Button */}
              <SubscribeButton
                variant="primary"
                type="submit"
                size="medium"
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </SubscribeButton>
            </FormGroup>
            <Disclaimer $align="center">
              We respect your privacy. Unsubscribe at any time.
            </Disclaimer>
          </FooterForm>
        </SubscribeSection>
      </FooterContainer>

      <FooterBottom>
        <SocialLinks aria-label="Social media links">
          <SocialLink href="#" aria-label="Facebook">
            <SocialIcon src={facebookIcon} alt="Facebook" />
          </SocialLink>
          <SocialLink href="#" aria-label="Instagram">
            <SocialIcon src={instagramIcon} alt="Instagram" />
          </SocialLink>
          <SocialLink href="#" aria-label="Twitter">
            <SocialIcon src={twitterIcon} alt="Twitter" />
          </SocialLink>
        </SocialLinks>
        <Copyright $align="center">
          Copyright © 2023 Euphoria Folks Pvt Ltd. All rights reserved.
        </Copyright>
      </FooterBottom>
    </StyledFooter>
  );
}