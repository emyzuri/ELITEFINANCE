document.addEventListener('DOMContentLoaded', () => {
    // 1. Market Ticker Logic
    const ticker = document.getElementById('marketTicker');
    const assets = [
        { name: 'CORP. FAVORITA', price: '2.030', change: '+4.64%', up: true },
        { name: 'BANCO PICHINCHA', price: '94.50', change: '-0.3%', up: false },
        { name: 'HOLCIM ECUADOR', price: '49.00', change: '+8.89%', up: true },
        { name: 'BANCO BOLIVARIANO', price: '1.500', change: '+3.45%', up: true },
        { name: 'BEVERAGE BRAND', price: '50.00', change: '+1.01%', up: true },
        { name: 'BCO. DEL AUSTRO', price: '0.500', change: '+16.28%', up: true },
        { name: 'S&P 500', price: '5,123.44', change: '+1.2%', up: true }
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

    // 1.1 Ecuador Market Table
    const ecuadorStocks = [
        { name: 'CORPORACIÓN FAVORITA', price: '2.030', change: '+4.64%', cap: '1,713.44 M', up: true },
        { name: 'BEVERAGE BRAND & PAY', price: '50.00', change: '+1.01%', cap: '1,024.52 M', up: true },
        { name: 'HOLCIM ECUADOR S.A.', price: '49.00', change: '+8.89%', cap: '1,013.86 M', up: true },
        { name: 'BANCO BOLIVARIANO', price: '1.500', change: '+3.45%', cap: '735 M', up: true },
        { name: 'INVERSANCARLOS S.A.', price: '2.880', change: '-2.37%', cap: '158 M', up: false },
        { name: 'RETRATOREC S.A.', price: '4.300', change: '+7.50%', cap: '1.5 M', up: true },
        { name: 'BANCO DEL AUSTRO', price: '0.500', change: '+16.28%', cap: '0', up: true }
    ];

    function renderMarketTable() {
        const tableBody = document.getElementById('ecuadorMarketBody');
        if (!tableBody) return;

        tableBody.innerHTML = ecuadorStocks.map(stock => `
            <tr>
                <td class="company-name">${stock.name}</td>
                <td>$${stock.price}</td>
                <td><span class="market-trend ${stock.up ? 'trend-up' : 'trend-down'}">${stock.change}</span></td>
                <td>${stock.cap}</td>
                <td><i data-lucide="${stock.up ? 'trending-up' : 'trending-down'}" class="${stock.up ? 'trend-up' : 'trend-down'}"></i></td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    renderMarketTable();

    // 2. Real Chart with Chart.js
    const ctx = document.getElementById('marketChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Índice de Volatilidad Estratégica',
                    data: [12, 19, 15, 25, 22, 30, 45],
                    borderColor: '#1e40af',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 2.1 Dark Mode Logic
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i data-lucide="sun"></i>';
        lucide.createIcons();
    }

    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i data-lucide="moon"></i>';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i data-lucide="sun"></i>';
        }
        lucide.createIcons();
    });

    // 2.2 Reveal on Scroll Logic
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));


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
            const whatsapp = contactForm.querySelector('input[placeholder*="WhatsApp"]').value;
            const service = contactForm.querySelector('select').value;

            // Form Validation (Basic)
            if (!name || !email || !whatsapp) {
                alert('Por favor complete todos los campos.');
                return;
            }

            const subject = `Nueva Solicitud de Asesoría - ${name}`;
            const body = `Hola Equipo Elite Finance,\n\nHas recibido una nueva solicitud de inversión:\n\nNombre: ${name}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nInterés: ${service}\n\nPor favor contactar a la brevedad.`;

            // Visual feedback - Simulated "Sending"
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Procesando...';

            setTimeout(() => {
                // Redirect to mailto (This is the most functional way in a static site)
                window.location.href = `mailto:estefany.naad@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                btn.textContent = '¡Solicitud Preparada!';
                btn.style.background = '#10b981';
                
                // Show a success alert or message
                alert(`¡Gracias ${name}! Tu solicitud ha sido preparada. Se abrirá tu aplicación de correo para enviar el mensaje a nuestro equipo.`);

                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    btn.style.background = '';
                    contactForm.reset();
                }, 3000);
            }, 1000);
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
            if (window.innerWidth > 600) {
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
        if (window.innerWidth <= 600) {
            nav.style.top = '0';
        } else if (window.scrollY <= 50) {
            nav.style.top = '41px';
        }
        renderChart();
    });
});
