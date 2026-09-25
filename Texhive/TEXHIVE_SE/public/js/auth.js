const rf = document.getElementById('registerForm');
const lf = document.getElementById('loginForm');


/* =========================================================
   ROLE-BASED REDIRECT
========================================================= */

function go(user) {

    if (!user || !user.role) {
        console.error('Invalid user returned from backend:', user);
        return;
    }

    if (user.role === 'ADMIN') {
        window.location.href = 'admin.html';
        return;
    }

    if (user.role === 'SUPPLIER') {
        window.location.href = 'supplier-dashboard.html';
        return;
    }

    window.location.href = 'dashboard.html';
}


/* =========================================================
   REGISTER PAGE
========================================================= */

if (rf) {

    const roleInput = document.getElementById('role');
    const message = document.getElementById('message');

    const roleButtons =
        document.querySelectorAll('[data-role-btn]');


    /* -----------------------------------------------------
       BUYER / SUPPLIER BUTTONS
    ----------------------------------------------------- */

    roleButtons.forEach(function (button) {

        button.addEventListener('click', function () {

            const selectedRole =
                button.getAttribute('data-role-btn');

            /* Store selected role */

            roleInput.value = selectedRole;


            /* Change yellow active button */

            roleButtons.forEach(function (otherButton) {

                otherButton.classList.remove('active');

            });

            button.classList.add('active');


            /* Clear previous message */

            if (message) {
                message.textContent = '';
            }


            console.log(
                'Selected registration role:',
                selectedRole
            );

        });

    });


    /* -----------------------------------------------------
       REGISTRATION SUBMIT
    ----------------------------------------------------- */

    rf.addEventListener('submit', async function (event) {

        event.preventDefault();


        if (message) {
            message.textContent = '';
        }


        /* Get form elements */

        const nameElement =
            document.getElementById('name');

        const companyElement =
            document.getElementById('companyName');

        const emailElement =
            document.getElementById('email');

        const phoneElement =
            document.getElementById('phone');

        const passwordElement =
            document.getElementById('password');


        /* Make sure elements exist */

        if (
            !nameElement ||
            !companyElement ||
            !emailElement ||
            !phoneElement ||
            !passwordElement ||
            !roleInput
        ) {

            console.error(
                'Registration form elements are missing.'
            );

            message.textContent =
                'Registration form error. Please refresh the page.';

            return;
        }


        /* Read values */

        const name =
            nameElement.value.trim();

        const companyName =
            companyElement.value.trim();

        const email =
            emailElement.value.trim().toLowerCase();

        const phone =
            phoneElement.value.trim();

        const password =
            passwordElement.value;

        const role =
            roleInput.value;


        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (!name) {

            message.textContent =
                'Please enter your full name.';

            nameElement.focus();

            return;
        }


        if (!email) {

            message.textContent =
                'Please enter your email.';

            emailElement.focus();

            return;
        }


        if (!password) {

            message.textContent =
                'Please enter your password.';

            passwordElement.focus();

            return;
        }


        if (password.length < 6) {

            message.textContent =
                'Password must contain at least 6 characters.';

            passwordElement.focus();

            return;
        }


        if (!role) {

            message.textContent =
                'Please select Buyer or Supplier.';

            return;
        }


        /* -------------------------------------------------
           ADMIN IS NOT REGISTERED THROUGH THIS PAGE
        ------------------------------------------------- */

        if (email === 'admin@texhive.com') {

            message.textContent =
                'Admin account is predefined. Please use Login.';

            return;
        }


        /* -------------------------------------------------
           REQUEST DATA
        ------------------------------------------------- */

        const payload = {
            name: name,
            companyName: companyName,
            email: email,
            phone: phone,
            password: password,
            role: role
        };


    
console.log('Sending registration data:', {
    name: name,
    companyName: companyName,
    email: email,
    phone: phone,
    password: password,
    role: role
});

console.log('JSON being sent:', JSON.stringify(payload));




        /* -------------------------------------------------
           DISABLE SUBMIT BUTTON
        ------------------------------------------------- */

        const submitButton =
            rf.querySelector('button[type="submit"]');


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                'CREATING ACCOUNT...';
        }


        try {

            /* ---------------------------------------------
               SEND TO SPRING BOOT
               
               POST:
               http://localhost:8080/api/users
            --------------------------------------------- */

            const user =
                await apiPost('/users', payload);


            console.log(
                'Registration successful:',
                user
            );


            /* ---------------------------------------------
               SAVE CURRENT USER IN SESSION
            --------------------------------------------- */

            if (typeof setUser === 'function') {
                setUser(user);
            }


            /* ---------------------------------------------
               BUYER
            --------------------------------------------- */

            if (role === 'BUYER') {

                message.textContent =
                    'Registration successful. Redirecting...';


                setTimeout(function () {

                    go(user);

                }, 700);

                return;
            }


            /* ---------------------------------------------
               SUPPLIER
            --------------------------------------------- */

            if (role === 'SUPPLIER') {

                message.textContent =
                    'Registration successful. Waiting for Admin verification.';


                setTimeout(function () {

                    go(user);

                }, 1000);

                return;
            }


        } catch (error) {

            console.error(
                'Registration failed:',
                error
            );


            let errorMessage =
                error && error.message
                    ? error.message
                    : 'Registration failed. Please try again.';


            /* Friendly duplicate email message */

            const lowerMessage =
                errorMessage.toLowerCase();


            if (
                lowerMessage.includes('duplicate') ||
                lowerMessage.includes('already registered') ||
                lowerMessage.includes('already exists')
            ) {

                errorMessage =
                    'This email is already registered. Please use another email.';
            }


            if (message) {
                message.textContent =
                    errorMessage;
            }


        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    'CREATE ACCOUNT';
            }

        }

    });

}


/* =========================================================
   LOGIN PAGE
========================================================= */

if (lf) {

    const message =
        document.getElementById('message');


    lf.addEventListener('submit', async function (event) {

        event.preventDefault();


        if (message) {
            message.textContent = '';
        }


        const emailElement =
            document.getElementById('email');

        const passwordElement =
            document.getElementById('password');


        if (!emailElement || !passwordElement) {

            message.textContent =
                'Login form error. Please refresh the page.';

            return;
        }


        const email =
            emailElement.value.trim().toLowerCase();

        const password =
            passwordElement.value;


        if (!email) {

            message.textContent =
                'Please enter your email.';

            emailElement.focus();

            return;
        }


        if (!password) {

            message.textContent =
                'Please enter your password.';

            passwordElement.focus();

            return;
        }


        const submitButton =
            lf.querySelector('button[type="submit"]');


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                'LOGGING IN...';
        }


        try {

            const user =
                await apiPost(
                    '/auth/login',
                    {
                        email: email,
                        password: password
                    }
                );


            console.log(
                'Login successful:',
                user
            );


            if (typeof setUser === 'function') {
                setUser(user);
            }


            go(user);


        } catch (error) {

            console.error(
                'Login failed:',
                error
            );


            message.textContent =
                error && error.message
                    ? error.message
                    : 'Invalid email or password.';


        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    'LOGIN';
            }

        }

    });

}
