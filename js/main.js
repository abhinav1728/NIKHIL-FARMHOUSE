// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Mobile Navigation Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const body = document.body;
    
    console.log('Hamburger element:', hamburger);
    console.log('Nav links:', navLinks);
    console.log('Nav items:', navItems);
    
    // Toggle mobile menu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('no-scroll');
    }
    
    // Close mobile menu when clicking a nav link
    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('no-scroll');
    }
    
    // Event Listeners
    if (hamburger && navLinks) {
        console.log('Adding event listeners');
        hamburger.addEventListener('click', function(e) {
            console.log('Hamburger clicked');
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.hamburger')) {
                closeMenu();
            }
        });
        
        // Close menu when clicking on nav items
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                console.log('Nav item clicked');
                closeMenu();
            });
        });
        
        // Prevent clicks inside the menu from closing it
        navLinks.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    } else {
        console.error('Could not find hamburger menu or nav links');
    }

    // Sticky Header on Scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scrolled')) {
            // Scrolling down
            header.classList.add('scrolled');
        } else if (currentScroll < lastScroll && header.classList.contains('scrolled')) {
            // Scrolling up
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Handle navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo(0, targetElement.offsetTop - 80);
                history.replaceState(null, '', targetId);
            }
        });
    });

    // Handle regular navigation links
    document.querySelectorAll('a[href^="."], a[href^="/"]').forEach(link => {
        if (link.hostname === window.location.hostname && 
            !link.getAttribute('target') && 
            !link.classList.contains('no-instant')) {
            
            link.addEventListener('click', function(e) {
                // If it's the same page, don't prevent default
                if (this.pathname === window.location.pathname) return;
                
                e.preventDefault();
                window.location.href = this.href;
            });
        }
    });

    // Booking Form Handling
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        // Add input event listeners for better mobile UX
        const formInputs = bookingForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                // Scroll to the input field on focus (for mobile)
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Add a class to style the focused input
                this.classList.add('input-focused');
            });
            
            input.addEventListener('blur', function() {
                this.classList.remove('input-focused');
            });
        });
        
        // Handle form submission
        bookingForm.addEventListener('submit', function(e) {
            // Get form values
            const checkIn = document.getElementById('check-in');
            const checkOut = document.getElementById('check-out');
            const guests = document.getElementById('guests');
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            
            // Reset error states
            [checkIn, checkOut, guests, name, email, phone].forEach(field => {
                field.style.borderColor = '#ddd';
            });
            
            // Validate required fields
            let isValid = true;
            const requiredFields = [
                { field: checkIn, name: 'Check-in date' },
                { field: checkOut, name: 'Check-out date' },
                { field: guests, name: 'Number of guests' },
                { field: name, name: 'Full name' },
                { field: email, name: 'Email' },
                { field: phone, name: 'Phone number' }
            ];
            
            requiredFields.forEach(({ field, name }) => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    isValid = false;
                    // Scroll to first error
                    if (isValid === false) {
                        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    alert(`Please fill in the ${name} field.`);
                    return false;
                }
            });
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value && !emailRegex.test(email.value)) {
                email.style.borderColor = '#e74c3c';
                isValid = false;
                email.scrollIntoView({ behavior: 'smooth', block: 'center' });
                alert('Please enter a valid email address.');
                return false;
            }
            
            // Validate phone number (basic validation)
            const phoneRegex = /^[0-9]{10,15}$/;
            if (phone.value && !phoneRegex.test(phone.value.replace(/[^0-9]/g, ''))) {
                phone.style.borderColor = '#e74c3c';
                isValid = false;
                phone.scrollIntoView({ behavior: 'smooth', block: 'center' });
                alert('Please enter a valid phone number (10-15 digits).');
                return false;
            }
            
            if (!isValid) {
                e.preventDefault();
                return false;
            }
            
            // If all validations pass, the form will submit
            return true;
        });
    }

    // Set minimum date for check-in to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Format date as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const todayFormatted = formatDate(today);
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    
    if (checkInInput) {
        checkInInput.min = todayFormatted;
        checkInInput.value = todayFormatted;
        
        // Set minimum check-out date to day after check-in
        const updateCheckOutMinDate = () => {
            if (!checkInInput.value) return;
            
            const checkInDate = new Date(checkInInput.value);
            const nextDay = new Date(checkInDate);
            nextDay.setDate(checkInDate.getDate() + 1);
            
            const nextDayFormatted = formatDate(nextDay);
            checkOutInput.min = nextDayFormatted;
            
            // Reset check-out if it's before the new min date
            if (checkOutInput.value && new Date(checkOutInput.value) < nextDay) {
                checkOutInput.value = '';
            }
            
            // If check-out is not set, set it to next day
            if (!checkOutInput.value) {
                checkOutInput.value = nextDayFormatted;
            }
        };
        
        checkInInput.addEventListener('change', updateCheckOutMinDate);
        
        // Initialize check-out date to tomorrow
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        checkOutInput.min = formatDate(tomorrow);
        checkOutInput.value = formatDate(tomorrow);
        
        // Initial update of check-out min date
        updateCheckOutMinDate();
    }
    
    // Testimonial Slider
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    // Auto-rotate testimonials if there are multiple
    if (testimonials.length > 1) {
        showTestimonial(currentTestimonial);
        
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }

    // Add animation class when elements come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .welcome-image, .gallery-item, .contact-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Google Maps Functionality
    function initMap() {
        // Farm coordinates (28°28'30.9"N 77°24'15.8"E)
        const farmLocation = { lat: 28.47525, lng: 77.4043888888889 }; // 28°28'30.9"N 77°24'15.8"E
        
        // Create map
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: farmLocation,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                },
                {
                    featureType: 'transit',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        // Add farm marker
        new google.maps.Marker({
            position: farmLocation,
            map: map,
            title: 'Cozy Glory Shed',
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/farm.png',
                scaledSize: new google.maps.Size(40, 40)
            }
        });

        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // Add user location marker
                    new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: 'Your Location',
                        icon: {
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        }
                    });

                    // Calculate and display route
                    const directionsService = new google.maps.DirectionsService();
                    const directionsRenderer = new google.maps.DirectionsRenderer({
                        map: map,
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: '#4CAF50',
                            strokeWeight: 4
                        }
                    });

                    const request = {
                        origin: userLocation,
                        destination: farmLocation,
                        travelMode: 'DRIVING'
                    };

                    directionsService.route(request, (result, status) => {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(result);
                            
                            // Show distance and duration
                            const route = result.routes[0].legs[0];
                            document.getElementById('distance').textContent = route.distance.text;
                            document.getElementById('duration').textContent = route.duration.text;
                            
                            // Update UI
                            document.getElementById('location-info').style.display = 'none';
                            document.getElementById('distance-result').style.display = 'block';
                        }
                    });

                    // Center map to show both locations
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(userLocation);
                    bounds.extend(farmLocation);
                    map.fitBounds(bounds);
                },
                (error) => {
                    // Handle location access denied
                    console.error('Error getting location:', error);
                    map.setCenter(farmLocation);
                    
                    // Show error message
                    const locationInfo = document.getElementById('location-info');
                    locationInfo.innerHTML = '<i class="fas fa-exclamation-circle"></i> Location access denied. Using default location.';
                }
            );
        } else {
            // Browser doesn't support Geolocation
            console.error('Geolocation is not supported by this browser.');
            map.setCenter(farmLocation);
            
            const locationInfo = document.getElementById('location-info');
            locationInfo.innerHTML = '<i class="fas fa-exclamation-circle"></i> Geolocation is not supported by your browser.';
        }
    }

    // Update active navigation links
    function updateActiveNav() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash || '';
        const navigationLinks = document.querySelectorAll('.nav-links a');
        
        navigationLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const isActive = 
                (linkHref === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html'))) ||
                (linkHref !== 'index.html' && currentPath.endsWith(linkHref)) ||
                (currentHash && linkHref.endsWith(currentHash));
            
            link.classList.toggle('active', isActive);
        });
    }

    // Run on page load and when navigating with back/forward buttons
    document.addEventListener('DOMContentLoaded', updateActiveNav);
    window.addEventListener('popstate', updateActiveNav);
});

// Add loading animation
window.addEventListener('load', function() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>Loading Cozy Glory Shed...</p>
    `;
    
    document.body.appendChild(loader);
    
    // Remove loader after page is fully loaded
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Add styles for loader
    const style = document.createElement('style');
    style.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #2e5a3d;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .page-loader p {
            color: #2e5a3d;
            font-size: 1.2rem;
            margin-top: 20px;
            font-weight: 500;
        }
    `;
    
    document.head.appendChild(style);
});
