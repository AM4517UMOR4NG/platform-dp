document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const initialForm = document.getElementById('initialForm');
    const hobbyInputForm = document.getElementById('hobbyInputForm');
    const hobbySelectionForm = document.getElementById('hobbySelectionForm');
    const resultDiv = document.getElementById('result');
    const hobbyForm = document.getElementById('hobbyForm');
    const hobbyDetailsForm = document.getElementById('hobbyDetailsForm');
    const hobbyCheckboxForm = document.getElementById('hobbyCheckboxForm');

    let userData = {};
    let hobbies = [];

    hobbyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userData.firstName = document.getElementById('firstName').value;
        userData.lastName = document.getElementById('lastName').value;
        userData.email = document.getElementById('email').value;
        userData.hobbyCount = parseInt(document.getElementById('hobbyCount').value);

        document.getElementById('firstName').setAttribute('readonly', 'readonly');
        document.getElementById('lastName').setAttribute('readonly', 'readonly');
        document.getElementById('email').setAttribute('readonly', 'readonly');
        document.getElementById('hobbyCount').setAttribute('readonly', 'readonly');

        const initialSubmitButton = hobbyForm.querySelector('button[type="submit"]');
        initialSubmitButton.setAttribute('disabled', 'disabled');
        initialSubmitButton.classList.add('disabled');


        const hobbyInputs = document.getElementById('hobbyInputs');
        hobbyInputs.innerHTML = '';
        for (let i = 0; i < userData.hobbyCount; i++) {
            hobbyInputs.innerHTML += `
                <div class="row mb-3">
                    <label for="hobby${i}" class="col-sm-4 col-form-label"><i class="fas fa-star me-2"></i>Pilihan ${i + 1}:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="hobby${i}" required>
                    </div>
                </div>
            `;
        }
        hobbyInputForm.classList.remove('d-none');
    });

    hobbyDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hobbies = [];
        for (let i = 0; i < userData.hobbyCount; i++) {
            const hobbyInput = document.getElementById(`hobby${i}`);
            const hobby = hobbyInput.value;
            if (hobby) hobbies.push(hobby);
            hobbyInput.setAttribute('readonly', 'readonly');
        }

        const detailsSubmitButton = hobbyDetailsForm.querySelector('button[type="submit"]');
        detailsSubmitButton.setAttribute('disabled', 'disabled');
        detailsSubmitButton.classList.add('disabled');

        const hobbyCheckboxes = document.getElementById('hobbyCheckboxes');
        hobbyCheckboxes.innerHTML = '<p class="form-label"><i class="fas fa-check-circle me-2"></i>Pilih hobi yang Anda sukai:</p>';
        hobbies.forEach((hobby, index) => {
            hobbyCheckboxes.innerHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${hobby}" id="check${index}">
                    <label class="form-check-label" for="check${index}">${hobby}</label>
                </div>
            `;
        });
        hobbySelectionForm.classList.remove('d-none');
    });

    hobbyCheckboxForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedHobbies = [];
        document.querySelectorAll('#hobbyCheckboxes .form-check-input').forEach(checkbox => {
            if (checkbox.checked) {
                selectedHobbies.push(checkbox.value);
            }
            checkbox.setAttribute('disabled', 'disabled');
        });

        const checkboxSubmitButton = hobbyCheckboxForm.querySelector('button[type="submit"]');
        checkboxSubmitButton.setAttribute('disabled', 'disabled');
        checkboxSubmitButton.classList.add('disabled');

        const allHobbies = hobbies.join(', ');
        const likedHobbies = selectedHobbies.join(', ') || 'tidak ada';
        const resultText = `Hallo, nama saya ${userData.firstName} ${userData.lastName}, dengan email ${userData.email}, saya mempunyai ${hobbies.length} pilihan hobi yaitu ${allHobbies}, dan saya menyukai ${likedHobbies}.`;
        resultDiv.querySelector('.alert').textContent = resultText;
        resultDiv.classList.remove('d-none');
    });

    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate__animated');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate__fadeIn');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});
