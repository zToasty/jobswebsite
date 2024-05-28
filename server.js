const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const hostname = '0.0.0.0'; // Позволяет принимать запросы с любого IP-адреса
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

const saveUserData = (filePath, data) => {
    let existingData = [];

    if (fs.existsSync(filePath)) {
        try {
            const fileData = fs.readFileSync(filePath);
            // Проверяем, не пустой ли файл
            if (fileData.length > 0) {
                existingData = JSON.parse(fileData);
            }
        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    }

    existingData.push(data);

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
};

const findUserByEmail = (filePath, email) => {
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        const users = JSON.parse(fileData);
        return users.find(user => user.email === email);
    }
    return null;
};

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, type  } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        type,
        likedProfiles: [] // добавляем пустой массив для хранения ID понравившихся анкет
    };

    const jsonFilePath = path.join(__dirname, 'public', 'usersData.json');
    saveUserData(jsonFilePath, userData);
    res.redirect('/login.html');
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const jsonFilePath = path.join(__dirname, 'public', 'usersData.json');
    let user = findUserByEmail(jsonFilePath, email);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.status(401).send("Вы ввели неверные данные, повторите попытку снова.");
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({
            liked: req.session.user.likedProfiles,
            email: req.session.user.email,
            type: req.session.user.type,
            firstName: req.session.user.firstName,
            lastName: req.session.user.lastName
        });
    } else {
        res.status(401).send('Not authenticated');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/');
    });
});

app.post('/submit', (req, res) => {
    const formData = req.body;
    let jsonFilePath;

    // Читаем текущее значение счетчиков из файла
    const counterFilePath = path.join(__dirname, 'public', 'idCounter.json');
    const counterData = JSON.parse(fs.readFileSync(counterFilePath));

    if (formData.type === 'applicant') {
        jsonFilePath = path.join(__dirname, 'public', 'applicantData.json');
        formData.id = counterData.applicantIdCounter; // Добавляем идентификатор к данным формы
        counterData.applicantIdCounter++; // Увеличиваем счетчик на 1
    } else if (formData.type === 'employer') {
        jsonFilePath = path.join(__dirname, 'public', 'employerData.json');
        formData.id = counterData.employerIdCounter; // Добавляем идентификатор к данным формы
        counterData.employerIdCounter++; // Увеличиваем счетчик на 1
    } else {
        res.status(400).send('Invalid form type');
        return;
    }

    saveUserData(jsonFilePath, formData);

    // Сохраняем обновленные счетчики обратно в файл
    fs.writeFileSync(counterFilePath, JSON.stringify(counterData, null, 2));

    res.redirect('./index.html');
});

app.post('/user/like', (req, res) => {
    const likedProfileIndex = req.body.likedProfileIndex;

    if (req.session.user) {
        const jsonFilePath = path.join(__dirname, 'public', 'usersData.json');
        let users = JSON.parse(fs.readFileSync(jsonFilePath));
        let user = users.find(user => user.email === req.session.user.email);

        if (user) {
            // Проверяем, содержит ли массив likedProfiles уже этот индекс
            if (!user.likedProfiles.includes(likedProfileIndex)) {
                user.likedProfiles.push(likedProfileIndex);
                fs.writeFileSync(jsonFilePath, JSON.stringify(users, null, 2));
                res.send('Profile liked');
            } else {
                res.send('Profile already liked');
            }
        } else {
            res.status(404).send('User not found');
        }
    } else {
        res.status(401).send('Not authenticated');
    }
});
// Сервер начинает прослушивание порта
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
