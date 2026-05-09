document.addEventListener('DOMContentLoaded', () => {
    // 1. Market Ticker Logic
    const ticker = document.getElementById('marketTicker');
    const assets = [
        { name: 'ECUINDEX', price: '1,245.30', change: '+0.45%', up: true },
        { name: 'FAVORITA', price: '2.14', change: '+1.2%', up: true },
        { name: 'PICHINCHA', price: '94.50', change: '-0.3%', up: false },
        { name: 'S&P 500', price: '5,123.44', change: '+1.2%', up: true },
        { name: 'BTC/USD', price: '64,231', change: '-2.4%', up: false },
        { name: 'PRODUBANCO', price: '1.05', change: '+0.1%', up: true },
        { name: 'GOLD', price: '2,341', change: '+0.5%', up: true }
    ];

    function renderTicker() {
        // Double the items for seamless loop
        const allAssets = [...assets, ...assets];
        ticker.innerHTML = allAssets.map(asset => `
            <div class="ticker-item">
                <span style="font-weight: 600;">${asset.name}</span>
                <span>$${asset.price}</span>
                <span class="ticker-price ${asset.up ? 'up' : 'down'}">${asset.change}</span>
            </div>
        `).join('');
    }

    renderTicker();

    // 2. Dynamic Chart Simulation
    const chartContainer = document.getElementById('chartContainer');

    function renderChart() {
        chartContainer.innerHTML = '';
        // Adjust bar count based on width
        const barCount = window.innerWidth < 480 ? 15 : (window.innerWidth < 768 ? 20 : 35);
        
        for (let i = 0; i < barCount; i++) {
            const height = Math.floor(Math.random() * 80) + 10;
            const rand = Math.random();
            let color = '#e2e8f0'; // Default gray
            
            if (rand > 0.6) color = 'var(--primary-color)';
            else if (rand > 0.4) color = 'var(--data-color)';
            else if (rand < 0.05) color = 'var(--loss-color)';

            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = '0%';
            bar.style.background = color;
            bar.setAttribute('data-value', `$${(height * 100).toLocaleString()}`);
            chartContainer.appendChild(bar);
            
            setTimeout(() => {
                bar.style.height = `${height}%`;
            }, i * 25);
        }
    }

    renderChart();
    // Refresh chart every 5 seconds for "live" feel
    setInterval(renderChart, 5000);

    // 3. Investment Calculator
    const initialInput = document.getElementById('initialInv');
    const monthlyInput = document.getElementById('monthlyInv');
    const yearsInput = document.getElementById('years');
    
    const initialVal = document.getElementById('initialInvVal');
    const monthlyVal = document.getElementById('monthlyInvVal');
    const yearsVal = document.getElementById('yearsVal');
    const resultDisplay = document.getElementById('finalResult');

    function calculateInvestment() {
        const P = parseFloat(initialInput.value);
        const PMT = parseFloat(monthlyInput.value);
        const t = parseFloat(yearsInput.value);
        const r = 0.10; // 10% annual return
        const n = 12;   // Compounded monthly

        // Compound interest with monthly contributions formula
        // A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
        
        const ratePerMonth = r / n;
        const totalMonths = n * t;
        const futureValuePrincipal = P * Math.pow(1 + ratePerMonth, totalMonths);
        const futureValueContributions = PMT * (Math.pow(1 + ratePerMonth, totalMonths) - 1) / ratePerMonth;
        
        const total = futureValuePrincipal + futureValueContributions;

        resultDisplay.textContent = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(total);

        // Update labels
        initialVal.textContent = `$${P.toLocaleString()}`;
        monthlyVal.textContent = `$${PMT.toLocaleString()}`;
        yearsVal.textContent = `${t} Años`;
    }

    [initialInput, monthlyInput, yearsInput].forEach(input => {
        input.addEventListener('input', calculateInvestment);
    });

    calculateInvestment();

    // 4. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('input[placeholder*="Nombre"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const whatsapp = contactForm.querySelector('input[type="tel"]').value;
            const service = contactForm.querySelector('select').value;
            
            const subject = `Nueva Solicitud de Asesoría - ${name}`;
            const body = `Hola Estefany,\n\nHas recibido una nueva solicitud desde la web Elite Finance:\n\nNombre: ${name}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nInterés: ${service}\n\nSaludos.`;
            
            // Redirect to mailto
            window.location.href = `mailto:estefany.naad@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Visual feedback
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '¡Solicitud Preparada!';
            btn.style.background = '#10b981';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 3000);
        });
    }

    // 5. Smooth scroll and Reveal
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const menuIcon = menuToggle.querySelector('i');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon
            const isActive = navLinks.classList.contains('active');
            if (isActive) {
                menuToggle.innerHTML = '<i data-lucide="x"></i>';
            } else {
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';
            }
            lucide.createIcons();
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            });
        });
    }

    // 7. Navbar scroll effect
    const nav = document.querySelector('nav');
    const tickerWrap = document.querySelector('ticker-wrap');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.top = '0';
            nav.style.padding = '0.5rem 0';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        } else {
            if (window.innerWidth > 768) {
                nav.style.top = '41px';
            } else {
                nav.style.top = '0';
            }
            nav.style.padding = '0.8rem 0';
            nav.style.boxShadow = 'none';
        }
    });

    // Handle resize for nav position
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            nav.style.top = '0';
        } else if (window.scrollY <= 50) {
            nav.style.top = '41px';
        }
        renderChart();
    });
});
