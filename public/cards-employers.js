let user = {};
let liked = [];
let currentProfileIndex = 0;
let profiles = [];

// Функция для проверки авторизации пользователя
function checkAuth() {
    fetch('/user')
        .then(response => {
            console.log(response);
            if (response.ok) {
                return response.json();
            }
            throw new Error('Not authenticated');
        })
        .then(user => {
            document.getElementById('user-info').classList.remove('hidden');
            document.getElementById('user-name').textContent = `Вы вошли как: ${user.firstName} ${user.lastName}`;
            document.getElementById('auth-buttons').classList.add('hidden');
            document.getElementById('logout-btn').classList.remove('hidden');
        })
        .catch(error => {
            console.log(error.message);
            document.getElementById('user-info').classList.add('hidden');
            document.getElementById('auth-buttons').classList.remove('hidden');
            document.getElementById('logout-btn').classList.add('hidden');
        });
}

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', checkAuth);

// Функция для выхода из аккаунта
function logout() {
    fetch('/logout')
        .then(response => {
            if (response.ok) {
                location.reload();
            }
        });
}

window.onload = function() {
    fetch('/user')
        .then(response => response.json())
        .then(userData => {
            user = userData;
        });
}

document.getElementById('user-name').addEventListener('click', function() {
    window.location.href = '/userProfile.html';
});

fetch('employerData.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        displayProfiles(data, 'Соискатели');
    })
.catch(error => console.error('Ошибка при загрузке данных:', error));

function displayProfiles(data, profileType) {
    profiles = data;
    const profilesContainer = document.getElementById('profiles-container');
    profilesContainer.classList.remove('hidden');
    displayProfile(currentProfileIndex);
    
    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', () => {
        currentProfileIndex++;
        if (currentProfileIndex >= profiles.length) {
            currentProfileIndex = 0;
        }
        displayProfile(currentProfileIndex);
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

const likeBtn = document.getElementById('like-btn');
likeBtn.addEventListener('click', () => {
    if(user.type === 'applicant'){

        // Проверка на наличие анкет
        if (profiles.length === 0) {
            console.error('Нет анкет для лайка');
            return;
        }

        fetch('/user/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ likedProfileIndex: currentProfileIndex }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Profile liked:', data);
                // Здесь мы делаем еще один запрос к серверу для получения обновленных данных пользователя
                return fetch('/user');
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(userData => {
                // Здесь мы обновляем глобальный объект user и массив likedProfiles
                user = userData;
                liked = user.liked;
                console.log(user);
            })
            .catch(error => console.error('Error:', error));
    }
});