let userData = {};

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
            userData = user;
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

document.getElementById('view-vacancies-btn').addEventListener('click', function() {
    window.location = 'cards-employers.html';
});

document.getElementById('view-vacancies-btn').addEventListener('click', function() {
    window.location = 'cards-applicants.html';
});

document.getElementById('signup-btn-employer').addEventListener('click', function() {
    if (userData.type === 'employer')
        window.location = 'cards-employers.html';
    else {
        alert("Вы не можете создать анкету Соискателя, авторизуйтесь в аккаунт Работадателя, чтобы продолжить.");
    }
});

document.getElementById('signup-btn-applicant').addEventListener('click', function() {
    if (userData.type === 'applicant')
        window.location = 'cards-employers.html';
    else {
        alert("Вы не можете создать анкету Соискателя, авторизуйтесь в аккаунт Соискателя, чтобы продолжить.");
    }
});


document.getElementById('user-name').addEventListener('click', function() {
    window.location.href = '/userProfile.html';
});
