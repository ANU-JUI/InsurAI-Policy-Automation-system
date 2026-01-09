import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isVisible, setIsVisible] = useState({
    hero: true,
    about: true,
    features: true,
    workflow: true,
    whyChoose: true,
    vision: true,
    contact: true
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [isSwitchingTheme, setIsSwitchingTheme] = useState(false);

  const [isNightMode, setIsNightMode] = useState(() => {
    // Check localStorage for saved preference, default to true (dark mode)
    const saved = localStorage.getItem('insurai-dark-mode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeStep, setActiveStep] = useState(0);
  const observerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const navigate = useNavigate();


  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('insurai-dark-mode', JSON.stringify(isNightMode));
  }, [isNightMode]);
useEffect(() => {
  const timer = setTimeout(() => {
    setShowIntro(false);
  }, 5500); // 2.5 seconds (feel free to tweak)

  return () => clearTimeout(timer);
}, []);

  // Premium Theme Color Palette - Separate Light & Dark Modes
  const getColors = () => ({
    // Primary brand colors
    primary: isNightMode ? '#6366F1' : '#065F46', // Indigo for dark, deep green for light
    primaryDark: isNightMode ? '#4F46E5' : '#064E3B',
    primaryLight: isNightMode ? '#8B5CF6' : '#047857',
    secondary: isNightMode ? '#22D3EE' : '#F97316', // Cyan for dark, orange for light
    accent: isNightMode ? '#14B8A6' : '#DC2626', // Teal for dark, red for light
    success: isNightMode ? '#10B981' : '#22c55e',
    warning: isNightMode ? '#F59E0B' : '#f59e0b',

    // Background and surface colors
    light: isNightMode ? '#0F172A' : '#F8FAFC', // Deep charcoal for dark, soft gray for light
    dark: isNightMode ? '#020617' : '#1e293b', // Near-black for dark, dark slate for light
    white: isNightMode ? '#E5E7EB' : '#FFFFFF', // Soft white for dark, pure white for light
    gray: isNightMode ? '#94A3B8' : '#334155', // Muted gray for dark, neutral dark gray for light
    grayLight: isNightMode ? '#64748B' : '#64748B', // Lighter gray for both modes
    charcoal: isNightMode ? '#64748B' : '#1F2937', // Charcoal for headings

    // Section backgrounds
    sectionBg: isNightMode ? '#0F172A' : '#FFFFFF',
    cardBg: isNightMode ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',

    // Light mode section gradients
    heroGradient: isNightMode ?
      'linear-gradient(135deg, #020617 0%, #0F172A 100%)' :
      'linear-gradient(135deg, #f97316 0%, #22c55e 100%)', // Orange to green
    aboutGradient: isNightMode ?
      'linear-gradient(135deg, #0F172A 0%, #020617 100%)' :
      'linear-gradient(135deg, #f97316 0%, #dc2626 100%)', // Orange to red
    featuresGradient: isNightMode ?
      'linear-gradient(135deg, #0F172A 0%, #020617 100%)' :
      'linear-gradient(135deg, #22c55e 0%, #eab308 100%)', // Green to yellow
    workflowGradient: isNightMode ?
      'linear-gradient(135deg, #0F172A 0%, #020617 100%)' :
      'linear-gradient(135deg, #DC2626 0%, #F472B6 100%)', // Red to pink
    whyChooseGradient: isNightMode ?
      'linear-gradient(135deg, #0F172A 0%, #020617 100%)' :
      'linear-gradient(135deg, #eab308 0%, #dc2626 100%)', // Yellow to red
    visionGradient: isNightMode ?
      'linear-gradient(135deg, #020617 0%, #0F172A 100%)' :
      'linear-gradient(135deg, #22c55e 0%, #eab308 100%)', // Green to yellow
    contactGradient: isNightMode ?
      'linear-gradient(135deg, #0F172A 0%, #020617 100%)' :
      'linear-gradient(135deg, #ec4899 0%, #f97316 100%)', // Pink to orange

    // Gradients
    gradientHero: isNightMode ?
      'linear-gradient(135deg, #020617 0%, #0F172A 100%)' :
      'linear-gradient(135deg, #14532D 0%, #FACC15 100%)',
    gradientNav: isNightMode ?
      'linear-gradient(90deg, #0F172A 0%, #020617 100%)' :
      'linear-gradient(90deg, #14532D 0%, #FACC15 100%)', // Green to yellow navbar
    gradientCard: isNightMode ?
      'rgba(15, 23, 42, 0.85)' :
      '#FFFFFF',
    gradientAccent: isNightMode ?
      'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' :
      'linear-gradient(135deg, #065F46 0%, #10b981 100%)',
    gradientGreen: isNightMode ?
      'linear-gradient(135deg, #22D3EE 0%, #14B8A6 100%)' :
      'linear-gradient(135deg, #065F46 0%, #059669 100%)',
    gradientYellow: isNightMode ?
      'linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)' :
      'linear-gradient(135deg, #F97316 0%, #FDE047 100%)',
});
  const colors = getColors();

  // Particle system for hero background
  const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationId;

      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 2 + 1;
          this.speedX = Math.random() * 0.5 - 0.25;
          this.speedY = Math.random() * 0.5 - 0.25;
          this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          if (this.y < 0) this.y = canvas.height;
        }

        draw() {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const initParticles = () => {
        particlesRef.current = [];
        for (let i = 0; i < 50; i++) {
          particlesRef.current.push(new Particle());
        }
      };

      const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesRef.current.forEach(particle => {
          particle.update();
          particle.draw();
        });

        // Draw connections
        particlesRef.current.forEach((a, i) => {
          particlesRef.current.slice(i + 1).forEach(b => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          });
        });

        animationId = requestAnimationFrame(animateParticles);
      };

      resizeCanvas();
      initParticles();
      animateParticles();

      window.addEventListener('resize', resizeCanvas);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resizeCanvas);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    );
  };

  // Enhanced scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[data-section]');
      const scrollPos = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.dataset.section]: true
            }));
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observerRef.current.observe(section));

    window.addEventListener('scroll', handleScroll);
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Smooth scroll with offset for fixed navbar
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Enhanced styles with glassmorphism for dark mode
  const styles = {
    hero: {
      background: colors.heroGradient,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
      WebkitTextFillColor: colors.white,
      color: colors.white,
      

    },
    navbar: {
      background: colors.gradientNav,
      backdropFilter: 'none',
WebkitBackdropFilter: 'none',

      borderBottom: `1px solid ${isNightMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isNightMode ?
        '0 4px 20px rgba(0,0,0,0.4)' :
        '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
    },
    card: {
      background: colors.cardBg,
      border: isNightMode ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(0,0,0,0.05)',
      borderRadius: '20px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isNightMode ?
        '0 8px 32px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.1)' :
        '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none'
    },
    cardHover: {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: isNightMode ?
        '0 25px 50px rgba(99, 102, 241, 0.2), 0 0 30px rgba(99, 102, 241, 0.15)' :
        '0 12px 40px rgba(0, 0, 0, 0.12), 0 6px 16px rgba(0, 0, 0, 0.08)',
      borderColor: isNightMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(6, 95, 70, 0.2)'
    },
    gradientText: {
  background: isNightMode
    ? 'linear-gradient(135deg, #E5E7EB 0%, #94A3B8 100%)'
    : 'linear-gradient(135deg, #064E3B 0%, #10b981 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
},
sectionHeading: {
  fontWeight: 800,
  letterSpacing: '0.5px',
  textAlign: 'center',
  marginBottom: '1rem',
  color: isNightMode ? colors.white : '#1F2937',
  

},

    floatingAnimation: {
      animation: 'float 6s ease-in-out infinite'
    },
    glowEffect: {
      filter: isNightMode ? 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))' : 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))'
    },
    // Section-specific backgrounds
    aboutSection: {
      background: colors.aboutGradient,
      padding: '80px 0',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease'
    },
    featuresSection: {
      background: colors.featuresGradient,
      padding: '80px 0',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease'
    },
    workflowSection: {
      background: colors.workflowGradient,
      padding: '80px 0',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease'
    },
    whyChooseSection: {
      background: colors.whyChooseGradient,
      padding: '80px 0',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease'
    },
    visionSection: {
      background: colors.visionGradient,
      padding: '80px 0',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease'
    },
    contactSection: {
      background: colors.contactGradient,
      padding: '80px 0',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease'
    }
  };

  // Enhanced feature data with icons and colors
  const features = [
    {
      icon: '⚡',
      title: 'Automated Claim Processing',
      description: 'Reduce manual workload and turnaround time with intelligent automation',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', // Purple to pink
      stats: '90% Faster'
    },
    {
      icon: '🧠',
      title: 'Smart Policy Management',
      description: 'Centralized control for HR and administrators with real-time updates',
      gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)', // Orange to red
      stats: 'AI Powered'
    },
    {
      icon: '👁️',
      title: 'Employee Transparency',
      description: 'Real-time claim tracking and instant notifications for all stakeholders',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #1e40af 100%)', // Teal to blue
      stats: '100% Visible'
    },
    {
      icon: '🛡️',
      title: 'AI-Powered Fraud Detection',
      description: 'Identify anomalies before they impact finances with machine learning',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #f59e0b 100%)', // Green to yellow
      stats: '99% Accurate'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Data-driven decisions with comprehensive visual dashboards',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)', // Pink to purple
      stats: 'Real-time Data'
    },
    {
      icon: '🔧',
      title: 'Custom Workflows',
      description: 'Tailored processes that match your organizational structure',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)', // Red to orange
      stats: 'Flexible'
    }
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '100vw',
      minHeight: '100vh',
      overflowX: 'hidden',
      background: colors.gradientHero,
      transition: 'background 0.3s ease',
      color: colors.white,
      paddingTop: '76px' // Account for fixed navbar height
      
    }}>
      {/* ================= FULLSCREEN INTRO OVERLAY ================= */}
{showIntro && (
  <div className="insurai-intro-overlay">
    <div className="intro-content">
      <div className="intro-logo">🏠</div>
      <h1 className="intro-text">InsurAI</h1>
      <p className="intro-tagline">
        Intelligent Insurance System.One Platform For All.
      </p>
    </div>
  </div>
)}

      
      {/* Enhanced Navigation Bar */}
 {/* ✨ Enhanced Navigation Bar with Distinct Branding and Contrast */}
<nav 
  className="navbar navbar-expand-lg fixed-top shadow-sm"
  style={styles.navbar}
>
  <div className="container-fluid px-4">
    {/* 🔹 Brand Logo / Title */}
    <a 
      className="navbar-brand fw-bold fs-3 d-flex align-items-center"
      href="#"
      style={{
        textDecoration: 'none',
        fontWeight: '700',
        letterSpacing: '0.5px',
        animation: 'logoFadeIn 2s ease-out',
        transform: 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      <span style={{
        background: isNightMode ? 
          'linear-gradient(90deg, #6366F1, #8B5CF6, #22D3EE, #14B8A6)' : 
          'linear-gradient(90deg, #10b981, #059669, #eab308, #f59e0b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
         backgroundClip: 'text',
        filter: isNightMode ? 'drop-shadow(0 0 8px rgba(99,102,241,0.5))' : 'drop-shadow(0 0 8px rgba(5,150,105,0.5))',
        transition: 'all 0.3s ease',
        animation: 'logoGlow 3s ease-in-out infinite alternate'
      }}>
        🏠 Insur<span style={{ color: isNightMode ? '#22D3EE' : '#10b981', WebkitTextFillColor: 'unset' }}>AI</span>
      </span>
    </a>

    {/* 🔸 Toggler for Mobile */}
    <button 
      className="navbar-toggler" 
      type="button" 
      data-bs-toggle="collapse" 
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
      style={{ border: 'none' }}
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* 🔸 Navigation Links */}
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto gap-2">
        {['about', 'features', 'workflow', 'why-choose', 'vision', 'contact'].map((section) => (
          <li key={section} className="nav-item">
            <button
              className="nav-link btn btn-link position-relative px-3"
              onClick={() => scrollToSection(section)}
              style={{
                color: activeSection === section ? (isNightMode ? '#ffffff' : '#064E3B') : (isNightMode ? 'rgba(255,255,255,0.65)' : '#334155'),
                border: 'none',
                background: 'none',
                fontWeight: activeSection === section ? '600' : '400',
                letterSpacing: '0.5px',
                transition: 'box-shadow 0.3s ease, opacity 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isNightMode ? '#00f5d4' : '#065F46';
                e.target.style.textShadow = isNightMode ? '0 0 10px rgba(0,245,212,0.8)' : '0 0 10px rgba(6, 95, 70, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = activeSection === section ? (isNightMode ? '#ffffff' : '#064E3B') : (isNightMode ? 'rgba(255,255,255,0.65)' : '#334155');
                e.target.style.textShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {section
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}

              {/* Active Underline */}
              <div style={{
                position: 'absolute',
                bottom: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: activeSection === section ? '40%' : '0%',
                height: '2px',
                background: isNightMode ? 'linear-gradient(90deg, #00f5d4, #3b82f6)' : 'linear-gradient(90deg, #065F46, #10b981)',
                borderRadius: '2px',
                boxShadow: isNightMode ? '0 0 8px rgba(59,130,246,0.6)' : '0 0 8px rgba(6, 95, 70, 0.4)',
                transition: 'box-shadow 0.3s ease, opacity 0.3s ease, width 0.3s ease'
              }} />
            </button>
          </li>
        ))}
      </ul>
      
      {/* Premium Night Mode Toggle */}
      <div className="d-flex align-items-center ms-3">
        <button
          onClick={() => setIsNightMode(!isNightMode)}
          className="btn position-relative overflow-hidden"
          style={{
            background: isNightMode ? 
              'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)' : 
              'linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(20,184,166,0.2) 100%)',
            border: `1px solid ${isNightMode ? 'rgba(99,102,241,0.3)' : 'rgba(34,211,238,0.3)'}`,
            borderRadius: '50px',
            padding: '8px 16px',
            color: isNightMode ? '#E5E7EB' : '#0F172A',
            fontSize: '1.1rem',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'None',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isNightMode ? 
              '0 4px 15px rgba(99, 102, 241, 0.2)' : 
              '0 4px 15px rgba(34, 211, 238, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = isNightMode ? 
              '0 8px 25px rgba(99, 102, 241, 0.3)' : 
              '0 8px 25px rgba(220, 147, 30, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = isNightMode ? 
              '0 4px 15px rgba(99, 102, 241, 0.2)' : 
              '0 4px 15px rgba(34, 211, 238, 0.2)';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>
            {isNightMode ? '☀️' : '🌙'}
          </span>
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: '500',
            opacity: 0.9
          }}>
            {isNightMode ? 'Light' : 'Dark'}
          </span>
          
          {/* Animated background glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: isNightMode ? 
              'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' : 
              'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transition: 'box-shadow 0.3s ease, opacity 0.3s ease',
            opacity: 0
          }}></div>
        </button>
      </div>
    </div>
  </div>
</nav>

      {/* Rolling Captions Section - Moved below navbar */}
      <section className="rolling-captions-section py-2 position-relative" style={{
        scrollMarginTop: '76px' // Account for navbar height when scrolling to anchors
      }}>
        <div className="rolling-captions-container">
          <div className="rolling-captions">
            <span>🚀 Revolutionizing Insurance with AI-Powered Automation</span>
            <span>⚡ 90% Faster Claim Processing</span>
            <span>🛡️ Advanced Fraud Detection Technology</span>
            <span>📊 Real-Time Analytics & Insights</span>
            <span>🔒 Enterprise-Grade Security</span>
            <span>🤖 Smart Policy Management</span>
            <span>📱 Seamless Mobile Experience</span>
            <span>🎯 Predictive Risk Assessment</span>
          </div>
        </div>
      </section>
<section 
  id="hero"
  data-section="hero"
  style={styles.hero}
  className="d-flex align-items-center justify-content-center text-white position-relative hero-section"
>
  <ParticleBackground />
  <div className="container-fluid position-relative" style={{ padding: '0 clamp(1rem, 4vw, 2rem)', zIndex: 2 }}>
    <div className="row align-items-center" style={{
      minHeight: 'calc(100vh - 76px)', // Subtract navbar height
      padding: 'clamp(2rem, 8vw, 6rem) 0 clamp(2rem, 4vw, 4rem) 0'
    }}>
      {/* Left Side - Hero Text */}
      <div className="col-lg-6 col-12 order-2 order-lg-1 hero-text" style={{
        transform: isVisible.hero ? 'translateX(0) rotateY(0)' : 'translateX(-100px) rotateY(-10deg)',
        opacity: isVisible.hero ? 1 : 0,
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
        perspective: '1000px',
        textAlign: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)',
        scrollMarginTop: '76px'
      }}>
        <h1 className="display-4 fw-bold mb-4" style={{
          ...styles.gradientText,
          fontSize: 'clamp(2rem, 8vw, 4rem)',
          lineHeight: '1.2',
          textShadow: '0 4px 8px rgba(0,0,0,0.25)',
          background: isNightMode ? 
            'linear-gradient(135deg, #E5E7EB 0%, #94A3B8 100%)' : 
            'linear-gradient(135deg, #ffffff 0%, #fefce8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Intelligent Insurance Solutions for Modern Enterprises
        </h1>

        <p className="lead mb-4" style={{ 
          fontSize: 'clamp(1rem, 4vw, 1.25rem)', 
          lineHeight: '1.6',
          opacity: 0.9,
          textShadow: '0 2px 4px rgba(0,0,0,0.15)',
          color: colors.white
        }}>
          Transform your corporate insurance operations with AI-powered automation, predictive analytics, 
          and seamless digital workflows that ensure compliance and accelerate processing.
        </p>

        {/* Get Started Button */}
        <div className="d-flex gap-3 flex-wrap">
          <button
            // onClick={() => navigate('/employee/register')}
            onClick={() => navigate("/roles")}
            className="btn btn-lg px-5 py-3 rounded-pill fw-semibold position-relative overflow-hidden shadow-lg"
            style={{
              background: colors.gradientAccent,
              color: '#fff',
              border: 'none',
              minWidth: '180px',
              letterSpacing: '0.5px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '50px',
              boxShadow: isNightMode ? 
                '0 8px 25px rgba(99, 102, 241, 0.3)' : 
                '0 8px 25px rgba(5, 150, 105, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px) scale(1.05)';
              e.target.style.boxShadow = isNightMode ? 
                '0 15px 35px rgba(99, 102, 241, 0.4)' : 
                '0 15px 35px rgba(5, 150, 105, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = isNightMode ? 
                '0 8px 25px rgba(99, 102, 241, 0.3)' : 
                '0 8px 25px rgba(5, 150, 105, 0.4)';
            }}
          >
            <span className="position-relative z-2">🚀 Get Started</span>
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.25), transparent)',
              transform: 'rotate(45deg)',
              transition: 'box-shadow 0.3s ease, opacity 0.3s ease'
            }}></div>
          </button>
        </div>
      </div>

      {/* Right Side - Floating Feature Icons */}
      <div className="col-lg-6 col-12 order-1 order-lg-2 text-center hero-icons" style={{
        transform: isVisible.hero ? 'translateX(0) rotateY(0)' : 'translateX(100px) rotateY(10deg)',
        opacity: isVisible.hero ? 1 : 0,
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
        perspective: '1000px',
        padding: 'clamp(1rem, 4vw, 2rem)',
        scrollMarginTop: '76px'
      }}>
        <div style={{
          ...styles.floatingAnimation,
          background: isNightMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.08)',
          borderRadius: '25px',
          padding: 'clamp(1.5rem, 6vw, 3rem) clamp(1rem, 4vw, 2rem)',
          backdropFilter: 'none',
          border: isNightMode ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(255,255,255,0.2)',
          maxWidth: 'min(500px, 90vw)',
          width: '100%',
          margin: '0 auto',
          boxShadow: isNightMode ?
            '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(99,102,241,0.1)' :
            '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div className="row text-center">
            {[
              { icon: '🚀', name: 'Auto Claims' },
              { icon: '🎯', name: 'Smart Policies' },
              { icon: '⚡', name: 'AI Analytics' },
              { icon: '🛡️', name: 'Fraud Shield' }
            ].map((item, index) => (
              <div key={index} className="col-6 mb-4">
                <div style={{
                  fontSize: '3.5rem',
                  animation: `float 4s ease-in-out infinite ${index * 0.5}s`,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))'
                }}>
                  {item.icon}
                </div>
                <small style={{ 
                  color: colors.white,
                  fontWeight: '500',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontSize: '0.9rem'
                }}>
                  {item.name}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>


  {/* Scroll indicator */}
  <div style={{
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    animation: 'bounce 2s infinite'
  }}>
    <div>Scroll to Explore</div>
    <div style={{ fontSize: '1.5rem' }}>↓</div>
  </div>
</section>

      <section
        id="about"
        data-section="about"
        className="py-5 position-relative"
        style={styles.aboutSection}
      >
        <div className="container-fluid" style={{ paddingLeft: 'clamp(1rem, 4vw, 2rem)', paddingRight: 'clamp(1rem, 4vw, 2rem)' }}>
          <div className="row align-items-center">
            <div className="col-lg-6" style={{
              transform: isVisible.about ? 'translateY(0)' : 'translateY(50px)',
              opacity: isVisible.about ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <h2 className="fw-bold mb-4 display-5" style={{
                ...styles.gradientText,
                fontSize: 'clamp(2rem, 8vw, 3rem)'
              }}>
                About InsurAI
              </h2>
              <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: isNightMode ? colors.white : '#1F2937' }}>
                InsurAI is a cutting-edge insurance intelligence platform that leverages artificial intelligence 
                and machine learning to revolutionize corporate insurance management. Our platform combines 
                predictive analytics, automated workflows, and intelligent fraud detection to deliver 
                unprecedented efficiency and accuracy.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: isNightMode ? colors.gray : '#334155' }}>
                Designed for modern enterprises, InsurAI bridges the gap between traditional insurance processes 
                and digital innovation, ensuring that every stakeholder — from employees to executives — 
                benefits from transparent, intelligent, and lightning-fast insurance operations.
              </p>
            </div>
            <div className="col-lg-6" style={{
              transform: isVisible.about ? 'scale(1) rotateY(0)' : 'scale(0.8) rotateY(-10deg)',
              opacity: isVisible.about ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
            }}>
              <div className="row g-4">
                {[
                  { icon: '🚀', title: 'Fast Processing', desc: '90% faster approvals', color: colors.success },
                  { icon: '🎯', title: 'AI Powered', desc: 'Smart automation', color: colors.secondary },
                  { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security', color: colors.primary },
                  { icon: '📈', title: 'Scalable', desc: 'Grows with your business', color: colors.accent }
                ].map((item, index) => (
                  <div key={index} className="col-6">
                    <div 
                      style={{
                        ...styles.card,
                        padding: '2rem 1.5rem',
                        textAlign: 'center',
                        transition: 'transform 0.1s ease, opacity 0.6s ease',
                        height: '100%'
                      }}
                      onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, styles.cardHover);
                      }}
                      onMouseLeave={(e) => {
                        Object.assign(e.currentTarget.style, styles.card);
                      }}
                    >
                      <div style={{ 
                        fontSize: '3rem', 
                        marginBottom: '1rem'
                      }}>
                        {item.icon}
                      </div>
                      <h5 className="fw-bold mb-2" style={{ color: colors.white, fontSize: '1.1rem' }}>
                        {item.title}
                      </h5>
                      <small style={{ color: colors.gray, fontSize: '0.9rem' }}>
                        {item.desc}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with Carousel */}
      <section
        id="features"
        data-section="features"
        className="py-5 position-relative"
        style={styles.featuresSection}
      >
        <div className="container-fluid" style={{ paddingLeft: 'clamp(1rem, 4vw, 2rem)', paddingRight: 'clamp(1rem, 4vw, 2rem)' }}>
          <div className="text-center mb-5" style={{
            transform: isVisible.features ? 'translateY(0)' : 'translateY(30px)',
            opacity: isVisible.features ? 1 : 0,
            transition: 'all 0.6s ease'
          }}>
            <h2 className="fw-bold mb-3 display-5" style={{
              ...styles.gradientText,
              fontSize: 'clamp(2rem, 8vw, 3rem)'
            }}>
            
            </h2>
            <p className="lead" style={{ 
              maxWidth: '600px', 
              margin: '0 auto', 
              color: isNightMode ? colors.gray : '#334155',
              fontSize: '1.1rem'
            }}>
             
            </p>
          </div>

          <div id="featuresCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
            <div className="carousel-indicators d-none d-md-flex">
              {Array.from({length: Math.ceil(features.length / 3)}, (_, i) => (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#featuresCarousel"
                  data-bs-slide-to={i}
                  className={i === 0 ? "active" : ""}
                  style={{
                    backgroundColor: i === 0 ? colors.primary : colors.gray,
                    border: `2px solid ${colors.primary}`
                  }}
                ></button>
              ))}
            </div>
            
<section className="py-5">
  <div className="container-fluid px-4">

    {/* ---------- Heading ---------- */}
    <div className="text-center mb-5">
      <h2 className="fw-bold display-5">What InsurAI Does</h2>
      <p className="lead">
        We help corporates streamline the entire insurance lifecycle through automation and intelligence.
      </p>
    </div>

    {/* ================= DESKTOP CAROUSEL (3 CARDS) ================= */}
    <div className="d-none d-md-block">
      <div
        id="featuresCarouselDesktop"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="4000"
      >
        <div className="carousel-inner">
          {Array.from({ length: Math.ceil(features.length / 3) }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className={`carousel-item ${slideIndex === 0 ? 'active' : ''}`}
            >
              <div className="row g-4 justify-content-center">
                {features
                  .slice(slideIndex * 3, slideIndex * 3 + 3)
                  .map((feature, index) => (
                    <div key={index} className="col-lg-4 col-md-6">
                      {/* === CARD === */}
                      <div
                        style={{
                          ...styles.card,
                          background: feature.gradient,
                          color: colors.white,
                          padding: '2.5rem',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ 
                          fontSize: '4rem', 
                          background: 'rgba(255,255,255,0.2)', 
                          borderRadius: '50%', 
                          width: '80px', 
                          height: '80px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          margin: '0 auto 1rem' 
                        }}>{feature.icon}</div>
                        <h4 className="fw-bold mt-3">{feature.title}</h4>
                        <p>{feature.description}</p>
                        <span className="badge rounded-pill px-4 py-2">
                          {feature.stats}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#featuresCarouselDesktop"
          data-bs-slide="prev"
        />
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#featuresCarouselDesktop"
          data-bs-slide="next"
        />
      </div>
    </div>

    {/* ================= MOBILE CAROUSEL (1 CARD) ================= */}
    <div className="d-md-none">
      <div
        id="featuresCarouselMobile"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3500"
      >
        <div className="carousel-inner">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
            >
              <div className="row justify-content-center">
                <div className="col-12">
                  {/* === CARD === */}
                  <div
                    style={{
                      ...styles.card,
                      background: feature.gradient,
                      color: colors.white,
                      padding: '2rem',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '3.5rem' }}>{feature.icon}</div>
                    <h4 className="fw-bold mt-3">{feature.title}</h4>
                    <p>{feature.description}</p>
                    <span className="badge rounded-pill px-4 py-2">
                      {feature.stats}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#featuresCarouselMobile"
          data-bs-slide="prev"
        />
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#featuresCarouselMobile"
          data-bs-slide="next"
        />
      </div>
    </div>

  </div>
</section>
          </div>
        </div>
      </section>

      {/* Enhanced Target Audience Section */}
      <section className="py-5 position-relative" style={{ 
        background: colors.gradientHero 
      }}>
        <div className="container-fluid" style={{ padding: '0 clamp(1rem, 4vw, 2rem)' }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 display-5 text-white">Who We Empower</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { icon: '👨‍💼', title: 'Employees', desc: 'Manage claims and policies with ease', delay: 0 },
              { icon: '👥', title: 'HR Teams', desc: 'Automate reporting and approvals', delay: 0.1 },
              { icon: '🤝', title: 'Agents', desc: 'Deliver faster responses and better support', delay: 0.2 },
              { icon: '🏢', title: 'Enterprises', desc: 'Gain visibility, control, and compliance', delay: 0.3 }
            ].map((audience, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '2.5rem 2rem',
                borderRadius: '20px',
                textAlign: 'center',
                backdropFilter: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                transform: `translateY(${isVisible.features ? '0' : '30px'}) scale(${isVisible.features ? 1 : 0.9})`,
                opacity: isVisible.features ? 1 : 0,
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${audience.delay}s`
              }}

                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                >
                  <div style={{ 
                    fontSize: '3.5rem', 
                    marginBottom: '1.5rem',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                  }}>
                    {audience.icon}
                  </div>
                  <h5 className="fw-bold mb-3 text-white">{audience.title}</h5>
                  <p className="mb-0" style={{ opacity: 0.9, color: 'rgba(255,255,255,0.9)' }}>
                    {audience.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section - Interactive Steps */}
      <section
        id="workflow"
        data-section="workflow"
        className="py-5 position-relative"
        style={styles.workflowSection}
      >
        <div className="container-fluid" style={{ padding: '0 clamp(1rem, 4vw, 2rem)' }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 display-5" style={{
              ...styles.gradientText,
              fontSize: 'clamp(2rem, 8vw, 3rem)'
            }}>
              How It Works
            </h2>
            <p className="lead" style={{
              maxWidth: '600px',
              margin: '0 auto',
              color: isNightMode ? colors.gray : '#334155',
              fontSize: '1.1rem'
            }}>
              Our streamlined 5-step process ensures fast, transparent, and intelligent claim processing.
            </p>
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="d-none d-lg-block">
            <div className="row justify-content-center align-items-center position-relative">
              {/* Connecting line */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '5%',
                right: '5%',
                height: '3px',
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
                transform: 'translateY(-50%)',
                opacity: isVisible.workflow ? 1 : 0,
                transition: 'all 0.8s ease 0.5s',
                zIndex: 1,
                borderRadius: '2px'
              }}></div>

              {[
                { step: '1', title: 'Submit Claims', desc: 'Employees submit claims online through our intuitive interface', icon: '📝' },
                { step: '2', title: 'Auto Verification', desc: 'AI-powered system instantly verifies eligibility and documents', icon: '🤖' },
                { step: '3', title: 'HR Approval', desc: 'Human oversight ensures quality and compliance standards', icon: '✅' },
                { step: '4', title: 'Instant Updates', desc: 'Real-time notifications keep everyone informed', icon: '🔔' },
                { step: '5', title: 'Complete', desc: 'Seamless processing with full transparency and no paperwork', icon: '🎉' }
              ].map((step, index) => (
                <div key={index} className="col-lg-2 col-md-4 col-6 mb-4 position-relative" style={{ zIndex: 2 }}>
                  <div style={{
                    transform: isVisible.workflow ?
                      `translateY(0) scale(1) rotateY(0)` :
                      `translateY(50px) scale(0.5) rotateY(90deg)`,
                    opacity: isVisible.workflow ? 1 : 0,
                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`
                  }}>
                    <div
                      style={{
                        ...styles.card,
                        padding: '2rem 1.5rem',
                        textAlign: 'center',
                        height: '100%',
                        cursor: 'pointer',
                        background: activeStep === index ? colors.gradientAccent : colors.cardBg,
                        transform: activeStep === index ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onClick={() => setActiveStep(index)}
                      onMouseEnter={(e) => {
                        if (activeStep !== index) {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = isNightMode ?
                            '0 12px 40px rgba(99, 102, 241, 0.2)' :
                            '0 8px 30px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeStep !== index) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = styles.card.boxShadow;
                        }
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: activeStep === index ? colors.gradientAccent : colors.primary,
                        color: colors.white,
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        boxShadow: activeStep === index ?
                          '0 8px 25px rgba(99, 102, 241, 0.4)' :
                          '0 4px 15px rgba(0, 0, 0, 0.2)',
                        border: `3px solid ${colors.sectionBg}`,
                        transition: 'all 0.3s ease'
                      }}>
                        {step.step}
                      </div>
                      <div style={{
                        fontSize: '3.5rem',
                        marginBottom: '1rem',
                        marginTop: '1rem',
                        opacity: activeStep === index ? 1 : 0.7,
                        transition: 'all 0.3s ease'
                      }}>
                        {step.icon}
                      </div>
                      <h6 className="fw-bold mb-3" style={{
                        fontSize: '1.1rem',
                        color: activeStep === index ? colors.white : colors.primary,
                        transition: 'all 0.3s ease'
                      }}>
                        {step.title}
                      </h6>
                      <p style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: activeStep === index ? (isNightMode ? '#E5E7EB' : '#FFFFFF') : colors.gray,
                        opacity: activeStep === index ? 1 : 0.8,
                        transition: 'all 0.3s ease'
                      }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet: Vertical Layout */}
          <div className="d-lg-none">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8">
                {[
                  { step: '1', title: 'Submit Claims', desc: 'Employees submit claims online through our intuitive interface', icon: '📝' },
                  { step: '2', title: 'Auto Verification', desc: 'AI-powered system instantly verifies eligibility and documents', icon: '🤖' },
                  { step: '3', title: 'HR Approval', desc: 'Human oversight ensures quality and compliance standards', icon: '✅' },
                  { step: '4', title: 'Instant Updates', desc: 'Real-time notifications keep everyone informed', icon: '🔔' },
                  { step: '5', title: 'Complete', desc: 'Seamless processing with full transparency and no paperwork', icon: '🎉' }
                ].map((step, index) => (
                  <div key={index} className="mb-4 position-relative">
                    <div style={{
                      transform: isVisible.workflow ?
                        `translateY(0) scale(1)` :
                        `translateY(30px) scale(0.9)`,
                      opacity: isVisible.workflow ? 1 : 0,
                      transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`
                    }}>
                      <div
                        style={{
                          ...styles.card,
                          padding: '1.5rem',
                          cursor: 'pointer',
                          background: activeStep === index ? colors.gradientAccent : colors.cardBg,
                          transform: activeStep === index ? 'scale(1.02)' : 'scale(1)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onClick={() => setActiveStep(index)}
                        onMouseEnter={(e) => {
                          if (activeStep !== index) {
                            e.currentTarget.style.transform = 'scale(1.01)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeStep !== index) {
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div style={{
                            background: activeStep === index ? 'rgba(255,255,255,0.2)' : colors.primary,
                            color: colors.white,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            marginRight: '1rem',
                            flexShrink: 0,
                            transition: 'all 0.3s ease'
                          }}>
                            {step.step}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <span style={{
                                fontSize: '1.8rem',
                                marginRight: '0.5rem',
                                opacity: activeStep === index ? 1 : 0.7,
                                transition: 'all 0.3s ease'
                              }}>
                                {step.icon}
                              </span>
                              <h6 className="fw-bold mb-0" style={{
                                fontSize: '1rem',
                                color: activeStep === index ? colors.white : colors.primary,
                                transition: 'all 0.3s ease'
                              }}>
                                {step.title}
                              </h6>
                            </div>
                            <p style={{
                              fontSize: '0.85rem',
                              lineHeight: '1.4',
                              color: activeStep === index ? (isNightMode ? '#E5E7EB' : '#FFFFFF') : colors.gray,
                              opacity: activeStep === index ? 1 : 0.8,
                              margin: 0,
                              transition: 'all 0.3s ease'
                            }}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector line for mobile */}
                    {index < 4 && (
                      <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '100%',
                        width: '2px',
                        height: '20px',
                        background: `linear-gradient(to bottom, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                        opacity: isVisible.workflow ? 1 : 0,
                        transition: `all 0.8s ease ${index * 0.2 + 0.5}s`,
                        zIndex: 1
                      }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section - Circular Cards */}
      <section
        id="why-choose"
        data-section="whyChoose"
        className="py-5 position-relative"
        style={{
          background: colors.sectionBg,
          transition: 'background 0.3s ease',
          scrollMarginTop: '76px',
          padding: 'clamp(3rem, 8vw, 5rem) 0'
        }}
      >
        <div className="container-fluid" style={{ padding: '0 clamp(1rem, 4vw, 2rem)' }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 display-5" style={{
              ...styles.gradientText,
              fontSize: 'clamp(2rem, 8vw, 3rem)'
            }}>
              Why Choose InsurAI
            </h2>
            <p className="lead" style={{
              maxWidth: '600px',
              margin: '0 auto',
              color: colors.gray,
              fontSize: '1.1rem'
            }}>
              Discover the advantages that make InsurAI the preferred choice for intelligent insurance management.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              {
                title: 'Lightning Fast Processing',
                description: 'Automated workflows reduce claim cycle time by up to 80%',
                icon: '⚡',
                stats: '80% Faster',
                gradient: isNightMode ?
                  'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' :
                  'linear-gradient(135deg, #065F46 0%, #10b981 100%)'
              },
              {
                title: 'Crystal Clear Transparency',
                description: 'Employees track everything in real time with full visibility',
                icon: '👁️',
                stats: '100% Transparent',
                gradient: isNightMode ?
                  'linear-gradient(135deg, #22D3EE 0%, #14B8A6 100%)' :
                  'linear-gradient(135deg, #0F766E 0%, #059669 100%)'
              },
              {
                title: 'Advanced AI Intelligence',
                description: 'Early fraud detection and predictive insights powered by ML',
                icon: '🧠',
                stats: 'AI Powered',
                gradient: isNightMode ?
                  'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' :
                  'linear-gradient(135deg, #10b981 0%, #065F46 100%)'
              },
              {
                title: 'Enterprise Scalability',
                description: 'Built for enterprises of any size with enterprise-grade security',
                icon: '🏢',
                stats: 'Enterprise Ready',
                gradient: isNightMode ?
                  'linear-gradient(135deg, #14B8A6 0%, #22D3EE 100%)' :
                  'linear-gradient(135deg, #059669 0%, #0F766E 100%)'
              },
              {
                title: 'Smart Data Analytics',
                description: 'Advanced reports and dashboards providing strategic insights',
                icon: '📈',
                stats: 'Smart Analytics',
                gradient: isNightMode ?
                  'linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)' :
                  'linear-gradient(135deg, #065F46 0%, #10b981 100%)'
              },
              {
                title: '24/7 Premium Support',
                description: 'Round-the-clock customer support and technical assistance',
                icon: '🛡️',
                stats: 'Always Available',
                gradient: isNightMode ?
                  'linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%)' :
                  'linear-gradient(135deg, #10b981 0%, #0F766E 100%)'
              }
            ].map((reason, index) => (
              <div key={index} className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex justify-content-center">
                <div
                  style={{
                    transform: isVisible.whyChoose ?
                      `translateY(0) scale(1)` :
                      `translateY(50px) scale(0.9)`,
                    opacity: isVisible.whyChoose ? 1 : 0,
                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                    width: '100%',
                    maxWidth: '320px'
                  }}
                >
                  <div
                    className="text-center position-relative"
                    style={{
                      background: colors.cardBg,
                      borderRadius: '50px',
                      padding: '2.5rem 2rem',
                      border: isNightMode ? '2px solid rgba(99,102,241,0.2)' : '2px solid rgba(6,95,70,0.1)',
                      boxShadow: isNightMode ?
                        '0 8px 32px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.1)' :
                        '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                      e.currentTarget.style.boxShadow = isNightMode ?
                        '0 20px 40px rgba(99, 102, 241, 0.25), 0 0 30px rgba(99, 102, 241, 0.15)' :
                        '0 12px 40px rgba(0, 0, 0, 0.12), 0 6px 16px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.borderColor = isNightMode ? 'rgba(99,102,241,0.4)' : 'rgba(6,95,70,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = isNightMode ?
                        '0 8px 32px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.1)' :
                        '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.borderColor = isNightMode ? 'rgba(99,102,241,0.2)' : 'rgba(6,95,70,0.1)';
                    }}
                  >
                    {/* Circular icon container */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: reason.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      fontSize: '2.5rem',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      border: `3px solid ${colors.sectionBg}`
                    }}>
                      {reason.icon}
                    </div>

                    <h5 className="fw-bold mb-3" style={{
                      fontSize: '1.2rem',
                      color: colors.primary,
                      lineHeight: '1.3'
                    }}>
                      {reason.title}
                    </h5>

                    <p className="mb-4" style={{
                      lineHeight: '1.6',
                      fontSize: '0.95rem',
                      color: colors.gray,
                      margin: '0 0 1.5rem 0'
                    }}>
                      {reason.description}
                    </p>

                    <div style={{
                      background: reason.gradient,
                      color: 'white',
                      padding: '0.6rem 1.5rem',
                      borderRadius: '25px',
                      display: 'inline-block',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      border: `2px solid ${colors.sectionBg}`
                    }}>
                      {reason.stats}
                    </div>

                    {/* Subtle glow effect */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120%',
                      height: '120%',
                      background: `radial-gradient(circle, ${isNightMode ? 'rgba(99,102,241,0.05)' : 'rgba(6,95,70,0.03)'} 0%, transparent 70%)`,
                      borderRadius: '50px',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      pointerEvents: 'none'
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Vision Section */}
      <section 
        id="vision" 
        data-section="vision"
        className="py-5 text-white position-relative"
        style={{ 
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primaryDark} 100%)`,
          overflow: 'hidden',
          scrollMarginTop: '76px'
        }}
      >
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 8s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 6s infinite 2s'
        }}></div>

        <div className="container-fluid position-relative" style={{ padding: '0 clamp(1rem, 4vw, 2rem)', zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div style={{
                transform: isVisible.vision ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(50px)',
                opacity: isVisible.vision ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <h2 className="fw-bold mb-4 display-5">Our Vision</h2>
                <p className="lead mb-4" style={{ 
                  fontSize: '1.3rem', 
                  lineHeight: '1.8',
                  opacity: 0.9
                }}>
                  To become the world's leading insurance intelligence platform, where AI doesn't just automate 
                  processes but anticipates needs, prevents fraud before it occurs, and provides actionable 
                  insights that transform how enterprises approach risk management and employee welfare.
                </p>
                <div style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  height: '2px',
                  width: '100%',
                  margin: '2rem auto',
                  animation: 'shimmer 3s infinite'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section 
        id="contact" 
        data-section="contact"
        className="py-5 position-relative"
        style={{ 
          background: colors.gradientHero,
          transition: 'background 0.3s ease',
          scrollMarginTop: '76px'
        }}
      >
        <div className="container-fluid" style={{ padding: '0 clamp(1rem, 4vw, 2rem)' }}>
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div style={{
                transform: isVisible.contact ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
                opacity: isVisible.contact ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <h2 className="fw-bold mb-4 display-5" style={{
                  ...styles.gradientText,
                  fontSize: 'clamp(2rem, 8vw, 3rem)'
                }}>
                  Get in Touch
                </h2>
                <p className="mb-5" style={{ 
                  fontSize: '1.1rem', 
                  color: colors.gray,
                  lineHeight: '1.6'
                }}>
                  Interested in modernizing your organization's insurance operations?<br />
                  Let's build a smarter future together.
                </p>
                <button 
                  className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-semibold position-relative overflow-hidden"
                  style={{
                    background: colors.gradientAccent,
                    border: 'none',
                    fontSize: '1.1rem',
                    transition: 'all 0.4s ease',
                    minWidth: '180px',
                    boxShadow: `0 8px 25px ${colors.primaryLight}40`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                    e.target.style.boxShadow = `0 15px 35px ${colors.primaryLight}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = `0 8px 25px ${colors.primaryLight}40`;
                  }}
                >
                  <span className="position-relative z-2">Contact Us</span>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    transition: 'left 0.6s ease'
                  }}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-4 text-white position-relative" style={{ background: colors.dark }}>
        <div className="container-fluid text-center" style={{ padding: '0 clamp(1rem, 4vw, 2rem)' }}>
          <p className="mb-0" style={{ fontSize: '0.95rem', opacity: 0.8 }}>
            &copy; 2026 InsurAI. All rights reserved. Corporate Policy Automation and Intelligence System.
          </p>
        </div>
      </footer>

      {/* Advanced Global Styles */}
      <style>
        {`
        /* ================= INSURAI INTRO SPLASH ================= */

.insurai-intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #0F172A 0%, #020617 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: introFadeOut 0.8s ease forwards;
  animation-delay: 4.2s;
}

.intro-content {
  text-align: center;
  animation:
    introZoom 1.6s ease forwards,
    breathing 3.5s ease-in-out infinite;
}


.intro-logo {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: introFloat 2s ease-in-out infinite;
}

.intro-text {
  font-size: clamp(4rem, 12vw, 7rem); /* 🔥 BIG */
  font-weight: 900;
  letter-spacing: 4px;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #6366F1, #8B5CF6, #22D3EE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}


.intro-tagline {
  color: rgba(255,255,255,0.8);
  font-size: 1.1rem;
  letter-spacing: 1px;
}

/* Animations */
@keyframes introZoom {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes introFadeOut {
  to { opacity: 0; pointer-events: none; }
}

@keyframes introFloat {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
            40% { transform: translateY(-10px) translateX(-50%); }
            60% { transform: translateY(-5px) translateX(-50%); }
          }
          @keyframes breathing {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(99,102,241,0.4));
  }
  50% {
    transform: scale(1.06);
    filter: drop-shadow(0 0 30px rgba(99,102,241,0.8));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(99,102,241,0.4));
  }
}

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes logoFadeIn {
            0% { opacity: 0; transform: translateY(-20px) scale(0.8); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          
          @keyframes logoGlow {
            0% { filter: drop-shadow(0 0 8px rgba(99,102,241,0.5)); }
            100% { filter: drop-shadow(0 0 15px rgba(99,102,241,0.8)); }
          }
          
          @keyframes rollLeft {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          
          html {
            scroll-behavior: smooth;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            width: 100%;
            max-width: 100vw;
            overflow-x: hidden;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            body {
  backface-visibility: hidden;
  transform: translateZ(0);
}

          }
          
          section {
            width: 100% !important;
            max-width: 100vw !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
          }
          
          .container-fluid {
            width: 100%;
            max-width: 100vw;
            margin: 0 auto;
            padding-left: 0 !important;
            padding-right: 0 !important;
            overflow-x: hidden;
          }
          
          .btn-link {
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .btn-link:hover {
            transform: translateY(-2px);
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${colors.light};
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${colors.primary};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${colors.primaryDark};
          }
          
          @media (max-width: 768px) {
            .display-4 {
              font-size: 2rem !important;
            }
            .display-5 {
              font-size: 1.8rem !important;
            }
            .navbar-brand {
              font-size: 1.5rem !important;
            }
            .container-fluid {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            section {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .card {
              margin-bottom: 1rem;
            }
            .hero-section {
              padding: 2rem 0 !important;
            }
            .hero-text {
              text-align: center !important;
              padding: 1rem !important;
            }
            .hero-icons {
              margin-top: 2rem !important;
            }
            .navbar-nav {
              text-align: center;
              margin-top: 1rem;
            }
            .nav-item {
              margin-bottom: 0.5rem;
            }
          }
          
          @media (max-width: 576px) {
            .display-4 {
              font-size: 1.75rem !important;
            }
            .display-5 {
              font-size: 1.5rem !important;
            }
            .btn-lg {
              padding: 0.75rem 1.5rem !important;
              font-size: 1rem !important;
            }
            .navbar-nav {
              text-align: center;
            }
            .nav-item {
              margin-bottom: 0.5rem;
            }
            .card {
              margin-bottom: 1rem;
            }
            .hero-section {
              padding: 1rem 0 !important;
            }
          }
          
          .rolling-captions-container {
            width: 100%;
            overflow: hidden;
            background: linear-gradient(135deg, #0F172A 0%, #020617 100%);
            padding: 10px 0;
            borderBottom: '1px solid rgba(99,102,241,0.1)';
          }
          
          .rolling-captions {
            display: flex;
            white-space: nowrap;
            animation: rollLeft 25s linear infinite;
          }
          
          .rolling-captions span {
            display: inline-block;
            color: #E5E7EB;
            font-weight: 600;
            font-size: 0.9rem;
            margin-right: 30px;
            padding: 6px 14px;
            background: rgba(99,102,241,0.1);
            border: 1px solid rgba(99,102,241,0.2);
            border-radius: 20px;
            backdrop-filter: none;
            box-shadow: 0 2px 8px rgba(99,102,241,0.1);
          }
          
          .rolling-captions span:nth-child(odd) {
            background: rgba(34,211,238,0.1);
            border-color: rgba(34,211,238,0.2);
            box-shadow: 0 2px 8px rgba(34,211,238,0.1);
          }
          
          .rolling-captions-section {
            margin-top: 76px; /* Account for fixed navbar */
          }
        `}
      </style>
    </div>
  );
};

export default Homepage;