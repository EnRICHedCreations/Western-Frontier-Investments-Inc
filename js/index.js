// Western Frontier Investments - Main JavaScript

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Initialize forms if they exist
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initContactForm();
    }

    const jvForm = document.getElementById('jvForm');
    if (jvForm) {
        initJVForm();
    }
});

// Contact Form (Seller Leads)
function initContactForm() {
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="animate-spin inline-block">⏳</span> Submitting...';
        submitButton.disabled = true;

        // Collect form data
        const leadData = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            propertyAddress: document.getElementById('propertyAddress').value,
            situation: document.getElementById('situation').value,
            dateSubmitted: new Date().toISOString(),
            status: 'new',
            type: 'seller-lead'
        };

        // Validate
        if (!WFIUtils.validateEmail(leadData.email)) {
            WFIUtils.showErrorMessage('Please enter a valid email address');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            return;
        }

        if (!WFIUtils.validatePhone(leadData.phone)) {
            WFIUtils.showErrorMessage('Please enter a valid phone number');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            return;
        }

        try {
            console.log('Submitting seller lead:', leadData);

            // Load existing leads and add new one
            const existingLeads = await CloudStorage.loadData('SellerLeads', []);
            existingLeads.push(leadData);
            await CloudStorage.saveData('SellerLeads', existingLeads);

            console.log('Seller lead saved successfully!');
            WFIUtils.showSuccessMessage('🎉 Thank you! We\'ll contact you within 24 hours with your cash offer.');

            // Reset form
            this.reset();
        } catch (error) {
            console.error('Error submitting lead:', error);
            WFIUtils.showErrorMessage('There was an error submitting your request. Please try again or call us directly.');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// JV Form
function initJVForm() {
    document.getElementById('jvForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="animate-spin inline-block">⏳</span> Submitting...';
        submitButton.disabled = true;

        // Collect form data
        const jvData = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            dealAddress: document.getElementById('dealAddress').value,
            jvAgreement: document.getElementById('jvAgreement').value,
            contractPrice: document.getElementById('contractPrice').value,
            arv: document.getElementById('arv').value,
            repairsEstimate: document.getElementById('repairsEstimate').value,
            emailAddress: document.getElementById('emailAddress').value,
            dateSubmitted: new Date().toISOString(),
            status: 'pending'
        };

        // Basic validation
        if (!jvData.firstName || !jvData.lastName || !jvData.dealAddress || !jvData.jvAgreement ||
            !jvData.contractPrice || !jvData.arv || !jvData.repairsEstimate || !jvData.emailAddress) {
            WFIUtils.showErrorMessage('Please fill in all required fields');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            return;
        }

        // Validate email
        if (!WFIUtils.validateEmail(jvData.emailAddress)) {
            WFIUtils.showErrorMessage('Please enter a valid email address');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            return;
        }

        try {
            console.log('Submitting JV deal:', jvData);

            // Check if Firebase is initialized
            if (typeof CloudStorage === 'undefined') {
                throw new Error('Firebase CloudStorage not initialized');
            }

            // Store the JV submission in Firebase
            console.log('Loading existing JV submissions...');
            const existingJVs = await CloudStorage.loadData('JointVentures', []);
            console.log('Existing JV submissions:', existingJVs.length);

            existingJVs.push(jvData);
            console.log('Saving JV submission to Firebase...');
            await CloudStorage.saveData('JointVentures', existingJVs);

            console.log('JV deal saved successfully!');

            // Show success message
            WFIUtils.showSuccessMessage('🎉 JV deal submitted successfully! We\'ll be in touch soon.');

            // Reset form
            this.reset();
        } catch (error) {
            console.error('Error submitting JV deal:', error);
            console.error('Error details:', error.message, error.stack);
            WFIUtils.showErrorMessage('There was an error submitting your deal. Please check the console for details or try again.');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}
