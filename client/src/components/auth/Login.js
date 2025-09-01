import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiGlobe, FiSun, FiMoon } from 'react-icons/fi';
import styled from 'styled-components';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primaryHover) 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background: var(--color-background);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  position: relative;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.875rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: var(--color-text-disabled);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
`;

const Button = styled.button`
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-primaryHover);
  }

  &:disabled {
    background: var(--color-text-disabled);
    cursor: not-allowed;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const LanguageToggle = styled.button`
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
`;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const { currentTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'lv' ? 'en' : 'lv';
    changeLanguage(newLang);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Header>
          <Logo>🏠 HomeManager</Logo>
          <Subtitle>
            {currentLanguage === 'lv' 
              ? 'Mājas pārvaldības platforma' 
              : 'Home Management Platform'
            }
          </Subtitle>
        </Header>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="email">
              {currentLanguage === 'lv' ? 'E-pasts' : 'Email'}
            </Label>
            <InputWrapper>
              <Input
                id="email"
                type="email"
                placeholder={currentLanguage === 'lv' ? 'ievadiet e-pastu' : 'enter your email'}
                {...register('email', { 
                  required: currentLanguage === 'lv' ? 'E-pasts ir obligāts' : 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: currentLanguage === 'lv' ? 'Nederīgs e-pasta formāts' : 'Invalid email format'
                  }
                })}
              />
              <IconWrapper>
                <FiMail />
              </IconWrapper>
            </InputWrapper>
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">
              {currentLanguage === 'lv' ? 'Parole' : 'Password'}
            </Label>
            <InputWrapper>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={currentLanguage === 'lv' ? 'ievadiet paroli' : 'enter your password'}
                {...register('password', { 
                  required: currentLanguage === 'lv' ? 'Parole ir obligāta' : 'Password is required',
                  minLength: {
                    value: 6,
                    message: currentLanguage === 'lv' ? 'Parolei jābūt vismaz 6 simboliem' : 'Password must be at least 6 characters'
                  }
                })}
              />
              <IconWrapper onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </IconWrapper>
            </InputWrapper>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (currentLanguage === 'lv' ? 'Ielādē...' : 'Loading...')
              : (currentLanguage === 'lv' ? 'Ieiet' : 'Sign In')
            }
          </Button>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>

        <Controls>
          <LanguageToggle onClick={toggleLanguage}>
            <FiGlobe />
            <span style={{ marginLeft: '0.5rem' }}>
              {currentLanguage === 'lv' ? 'EN' : 'LV'}
            </span>
          </LanguageToggle>

          <ThemeToggle onClick={toggleTheme}>
            {currentTheme === 'light' ? <FiMoon /> : <FiSun />}
          </ThemeToggle>
        </Controls>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
