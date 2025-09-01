# 🏠 HomeManager - Mājas pārvaldības platforma

Современная веб-платформа для управления многоквартирным домом с поддержкой латышского и английского языков.

## ✨ Возможности

### 🏠 Для жильцов
- **Личный кабинет** с информацией о квартире
- **Просмотр показаний счетчиков** (вода, электричество, отопление, газ)
- **Управление счетами** и платежами
- **Новости дома** с категоризацией и приоритетами
- **Календарь событий** с праздниками Латвии
- **Система обратной связи** для предложений и жалоб
- **Управление парковкой** с QR-кодами для доступа
- **Полезные контакты** и напоминания

### 👨‍💼 Для администраторов
- **Полное управление пользователями** (создание, редактирование, блокировка)
- **Управление показаниями счетчиков** для всех квартир
- **Выставление счетов** с автоматическим расчетом
- **Публикация новостей** и объявлений
- **Управление календарем** и событиями
- **Обработка обратной связи** от жильцов
- **Управление парковочными местами** и пропусками
- **Система уведомлений** по email и WhatsApp

### 🌐 Многоязычность
- **Латышский язык** (основной)
- **Английский язык** (полная поддержка)
- Автоматическое переключение языков
- Локализованные сообщения об ошибках

### 🔒 Безопасность
- JWT аутентификация
- Роли пользователей (жилец, администратор, суперадминистратор)
- Защита от брутфорс атак
- Валидация данных на сервере и клиенте
- HTTPS поддержка

## 🚀 Технологии

### Backend
- **Node.js** с Express.js
- **MongoDB** с Mongoose ODM
- **JWT** для аутентификации
- **bcryptjs** для хеширования паролей
- **Nodemailer** для email уведомлений
- **Multer** для загрузки файлов
- **Express Validator** для валидации

### Frontend
- **React 18** с функциональными компонентами
- **React Router** для навигации
- **React Query** для управления состоянием
- **Styled Components** для стилизации
- **React Hook Form** для форм
- **Framer Motion** для анимаций
- **Chart.js** для графиков

### Дополнительные возможности
- **QR-коды** для парковочных пропусков
- **Интеграция с WhatsApp** Business API
- **Email рассылки** с шаблонами
- **Темная/светлая тема** с автоматическим переключением
- **Адаптивный дизайн** для всех устройств

## 📋 Требования

- Node.js 16+ 
- MongoDB 5+
- npm или yarn
- Git

## 🛠️ Установка

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd HomeManager
```

### 2. Установка зависимостей
```bash
# Установка серверных зависимостей
npm run install-server

# Установка клиентских зависимостей
npm run install-client

# Или установка всех зависимостей сразу
npm run install-all
```

### 3. Настройка окружения
```bash
# Скопируйте пример конфигурации
cp config.env.example .env

# Отредактируйте .env файл
nano .env
```

#### Пример конфигурации (.env)
```env
# База данных
MONGODB_URI=mongodb://localhost:27017/home-manager

# JWT секрет (сгенерируйте уникальный ключ)
JWT_SECRET=your-super-secret-jwt-key-here

# Email настройки
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# WhatsApp Business API (опционально)
WHATSAPP_API_KEY=your-whatsapp-api-key
WHATSAPP_PHONE_NUMBER=your-whatsapp-number

# Сервер
PORT=5000
NODE_ENV=development
```

### 4. Запуск MongoDB
```bash
# Локально
mongod

# Или используйте MongoDB Atlas (облачная версия)
```

### 5. Запуск приложения

#### Режим разработки
```bash
# Запуск сервера
npm run dev

# В новом терминале - запуск клиента
cd client
npm start
```

#### Продакшн режим
```bash
# Сборка клиента
npm run build

# Запуск сервера
npm start
```

## 🌐 Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## 👥 Создание первого пользователя

После запуска приложения создайте первого суперадминистратора:

```bash
# Подключитесь к MongoDB
mongosh

# Выберите базу данных
use home-manager

# Создайте пользователя (пароль будет захеширован автоматически)
db.users.insertOne({
  apartment: "ADMIN",
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  phone: "+37120000000",
  password: "$2a$10$your-hashed-password",
  role: "superadmin",
  language: "lv",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 📱 Использование

### Вход в систему
1. Откройте http://localhost:3000
2. Войдите с созданными учетными данными
3. Переключитесь между языками кнопкой в правом верхнем углу

### Основные функции
- **Dashboard**: Обзор всех важных данных
- **Счетчики**: Просмотр и добавление показаний
- **Счета**: Управление платежами
- **Новости**: Чтение объявлений
- **Календарь**: События и праздники
- **Обратная связь**: Предложения и жалобы
- **Парковка**: Управление местами
- **Админ панель**: Управление системой

## 🔧 API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация (только админы)
- `GET /api/auth/me` - Получение профиля
- `PUT /api/auth/me` - Обновление профиля

### Пользователи
- `GET /api/users` - Список пользователей
- `POST /api/users` - Создание пользователя
- `PUT /api/users/:id` - Обновление пользователя
- `DELETE /api/users/:id` - Удаление пользователя

### Счетчики
- `GET /api/meters` - Список счетчиков
- `POST /api/meters/:id/readings` - Добавление показаний
- `GET /api/meters/:id/history` - История показаний

### Счета
- `GET /api/bills` - Список счетов
- `POST /api/bills` - Создание счета
- `PUT /api/bills/:id` - Обновление счета
- `POST /api/bills/:id/pay` - Оплата счета

### Новости
- `GET /api/news` - Список новостей
- `POST /api/news` - Создание новости
- `PUT /api/news/:id` - Обновление новости
- `DELETE /api/news/:id` - Удаление новости

### Календарь
- `GET /api/calendar` - События календаря
- `POST /api/calendar` - Создание события
- `PUT /api/calendar/:id` - Обновление события
- `DELETE /api/calendar/:id` - Удаление события

### Обратная связь
- `GET /api/feedback` - Список обращений
- `POST /api/feedback` - Создание обращения
- `PUT /api/feedback/:id` - Обновление обращения
- `POST /api/feedback/:id/comment` - Добавление комментария

### Парковка
- `GET /api/parking/spaces` - Парковочные места
- `POST /api/parking/passes` - Создание пропуска
- `GET /api/parking/passes/:id/qr` - QR-код пропуска

### Уведомления
- `GET /api/notifications` - Список уведомлений
- `POST /api/notifications` - Отправка уведомления
- `PUT /api/notifications/:id/read` - Отметка как прочитанное

## 🎨 Кастомизация

### Темы
Приложение поддерживает светлую и темную темы с автоматическим переключением в зависимости от системных настроек.

### Языки
Для добавления нового языка:
1. Добавьте переводы в `client/src/contexts/LanguageContext.js`
2. Обновите языковые переключатели
3. Добавьте поддержку в формы

### Стили
Используйте CSS переменные для кастомизации цветов, теней и радиусов скругления.

## 🚀 Развертывание

### Docker (рекомендуется)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# Запуск тестов с покрытием
npm run test:coverage

# E2E тесты
npm run test:e2e
```

## 📊 Мониторинг

### Логи
- Серверные логи: `logs/server.log`
- Ошибки: `logs/error.log`
- Доступ: `logs/access.log`

### Метрики
- Время отклика API
- Количество активных пользователей
- Статистика использования функций

## 🔒 Безопасность

### Рекомендации
1. Используйте HTTPS в продакшене
2. Регулярно обновляйте зависимости
3. Настройте файрвол
4. Используйте сильные пароли
5. Включите двухфакторную аутентификацию

### Аудит безопасности
```bash
npm audit
npm audit fix
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

- **Документация**: [Wiki](wiki-link)
- **Issues**: [GitHub Issues](issues-link)
- **Email**: support@homemanager.com
- **Telegram**: @HomeManagerSupport

## 🙏 Благодарности

- React команде за отличную библиотеку
- MongoDB за надежную базу данных
- Сообществу open source за вклад в развитие

---

**HomeManager** - Управление домом стало проще! 🏠✨
