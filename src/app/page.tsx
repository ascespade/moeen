export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #fef3c7 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-10rem',
          right: '-10rem',
          width: '20rem',
          height: '20rem',
          background:
            'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(251, 146, 60, 0.2) 100%)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      ></div>

      <div
        style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '-10rem',
          width: '24rem',
          height: '24rem',
          background:
            'linear-gradient(45deg, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 4s ease-in-out infinite 1s',
        }}
      ></div>

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1
            style={{
              fontSize: '4rem',
              fontWeight: '900',
              background:
                'linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              lineHeight: '1.1',
            }}
          >
            Ultimate E2E
          </h1>
          <h2
            style={{
              fontSize: '3rem',
              fontWeight: '700',
              background:
                'linear-gradient(135deg, #d97706 0%, #ea580c 50%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '2rem',
            }}
          >
            Self-Healing Runner
          </h2>
          <p
            style={{
              fontSize: '1.5rem',
              color: '#475569',
              marginBottom: '3rem',
              maxWidth: '800px',
              margin: '0 auto 3rem',
              lineHeight: '1.6',
            }}
          >
            Comprehensive testing system with Playwright and Supawright.
            <strong style={{ color: '#1e293b' }}>
              {' '}
              Automatically detect, fix, and prevent issues
            </strong>{' '}
            with AI-powered healing.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem',
            }}
          >
            <button
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '1rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
              }}
              onMouseOver={e => {
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
                e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseOut={e => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
            >
              Start Testing
            </button>
            <button
              style={{
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#1e293b',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '1rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseOver={e => {
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              }}
              onMouseOut={e => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {/* Feature 1 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.target.style.transform = 'scale(1.02) translateY(-4px)';
              e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
          >
            <div
              style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <svg
                width='32'
                height='32'
                fill='none'
                stroke='white'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '1rem',
              }}
            >
              Auto-Healing
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              Automatically detect and fix issues using AI-powered analysis and
              smart suggestions.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.target.style.transform = 'scale(1.02) translateY(-4px)';
              e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
          >
            <div
              style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <svg
                width='32'
                height='32'
                fill='none'
                stroke='white'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '1rem',
              }}
            >
              Parallel Testing
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              Run multiple test suites in parallel with intelligent resource
              management.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.target.style.transform = 'scale(1.02) translateY(-4px)';
              e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
          >
            <div
              style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <svg
                width='32'
                height='32'
                fill='none'
                stroke='white'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '1rem',
              }}
            >
              Advanced Analytics
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              Get deep insights into test performance and system health.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            marginBottom: '4rem',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '1rem',
              }}
            >
              System Statistics
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#475569' }}>
              Real-time performance metrics and insights
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  background:
                    'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem',
                }}
              >
                560
              </div>
              <div style={{ color: '#475569', fontWeight: '500' }}>
                Total Tests
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  background:
                    'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem',
                }}
              >
                448
              </div>
              <div style={{ color: '#475569', fontWeight: '500' }}>
                Passed Tests
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  background:
                    'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem',
                }}
              >
                80%
              </div>
              <div style={{ color: '#475569', fontWeight: '500' }}>
                Success Rate
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  background:
                    'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem',
                }}
              >
                16
              </div>
              <div style={{ color: '#475569', fontWeight: '500' }}>
                Modules Tested
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '9999px',
              padding: '0.75rem 1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                width: '0.75rem',
                height: '0.75rem',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            ></div>
            <span style={{ color: '#374151', fontWeight: '500' }}>
              System Online & Ready
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
