import React from 'react'

const Footer = () => {
  return (
    <footer style={{
      position: 'relative',
      left: 0,
      bottom: 0,
      width: '100%',
      background: '#222',
      color: '#fff',
      textAlign: 'center',
      padding: '16px 0',
      zIndex: 100
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>StyleAura</div>
        <div style={{ fontSize: '14px' }}>
          StyleAura is your one-stop destination for the latest trends in fashion. Discover, shop, and express your unique style with us.
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px' }}>
          <a href="/about" style={{ color: '#fff', textDecoration: 'underline' }}>About</a>
          <a href="/terms" style={{ color: '#fff', textDecoration: 'underline' }}>Terms &amp; Conditions</a>
        </div>
        <div style={{ fontSize: '12px', color: '#bbb' }}>
          &copy; {new Date().getFullYear()} StyleAura. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer