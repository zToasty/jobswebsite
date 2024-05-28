let user = {};
let liked = [];
let currentProfileIndex = 0;
let profiles = [];

window.onload = function() {
    alert('Если у вас не отображаются анкеты, перезайдите в аккаунт.')
    updateUser();
    console.log(user);
}

function updateUser() {
    fetch('/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(userData => {
            // Populate the global user object and likedProfiles array
            user = userData;
            console.log(user);
            liked = user.liked ;

            // Populate the HTML elements with the user data
            document.getElementById('user-first-name').textContent = user.firstName;
            document.getElementById('user-last-name').textContent = user.lastName;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('user-type').textContent = user.type === 'employer' ? 'Работодатель' : 'Соискатель';

            // Fetch the appropriate data based on user type
            const dataUrl = user.type === 'employer' ? 'applicantData.json' : 'employerData.json';
            return fetch(dataUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Populate the appropriate global array based on user type
            if (user.type === 'employer') {
                if(liked.length > 0){
                    displayProfiles(data);
                }

            } else {
                if(liked.length > 0){
                    displayProfiles(data);
                }
            }
        })
        .catch(error => console.error('Ошибка при загрузке данных:', error));
};


function displayProfiles(data) {
    profiles = data;
    const profilesContainer = document.getElementById('profiles-container');
    profilesContainer.classList.remove('hidden');
    displayProfile(liked[currentProfileIndex]);

    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', () => {
        currentProfileIndex += 1;
        if (currentProfileIndex >= liked.length) {
            currentProfileIndex = 0;
        }
        displayProfile(liked[currentProfileIndex]);
    });
}

function displayProfile(index) {
    const profilesContainer = document.getElementById('profiles-container');
    profilesContainer.innerHTML = '';  // Clear previous profiles

    const profile = profiles[index];

    const profileCard = document.createElement('div');
    profileCard.classList.add('profile-card');

    const name = document.createElement('div');
    const nameLabel = document.createElement('span');
    nameLabel.className = "uppercase-text";
    nameLabel.textContent = "Имя: ";
    profileCard.appendChild(name);
    name.appendChild(nameLabel);
    const profileName = document.createElement('span');
    profileName.className = "primary-text";
    profileName.textContent = profile.name;
    name.appendChild(profileName);
    name.className = "card-paragraph-main"

    const birthday = document.createElement('div');
    const birthdayLabel = document.createElement('span');
    birthdayLabel.className = "uppercase-text";
    birthdayLabel.textContent = "Дата регистрации компании: ";
    profileCard.appendChild(birthday);
    birthday.appendChild(birthdayLabel);
    const profileBirthday = document.createElement('span');
    profileBirthday.className = "primary-text";
    profileBirthday.textContent = profile.birthday;
    birthday.appendChild(profileBirthday);
    birthday.className = "card-paragraph-secondary";

    const phone = document.createElement('div');
    const phoneLabel = document.createElement('span');
    phoneLabel.className = "uppercase-text";
    phoneLabel.textContent = "Телефон: ";
    profileCard.appendChild(phone);
    phone.appendChild(phoneLabel);
    const profilePhone = document.createElement('span');
    profilePhone.className = "primary-text";
    profilePhone.textContent = profile.phone;
    phone.appendChild(profilePhone);
    phone.className = "card-paragraph-secondary";

    const email = document.createElement('div');
    const emailLabel = document.createElement('span');
    emailLabel.className = "uppercase-text";
    emailLabel.textContent = "Email: ";
    profileCard.appendChild(email);
    email.appendChild(emailLabel);
    const profileEmail = document.createElement('span');
    profileEmail.className = "primary-text";
    profileEmail.textContent = profile.email;
    email.appendChild(profileEmail);
    email.className = "card-paragraph-secondary";

    const message = document.createElement('div');
    const messageLabel = document.createElement('span');
    messageLabel.className = "uppercase-text";
    messageLabel.textContent = "Сообщение: ";
    profileCard.appendChild(message);
    message.appendChild(messageLabel);
    const profileMessage = document.createElement('span');
    profileMessage.className = "primary-text";
    profileMessage.textContent = profile.message;
    message.appendChild(profileMessage);
    message.className = "card-paragraph-secondary";

    profilesContainer.appendChild(profileCard);
}
