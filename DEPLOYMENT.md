# 🚀 Деплой HomeManager

## Варианты деплоя

### 1. Vercel (Рекомендуется)

#### Шаги:
1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Настройте переменные окружения:
   - `MONGODB_URI` - ваш MongoDB Atlas URI
   - `JWT_SECRET` - секретный ключ для JWT
   - `NODE_ENV=production`

#### Автоматический деплой:
- Vercel автоматически определит настройки из `vercel.json`
- Каждый push в main ветку будет автоматически деплоиться

### 2. Railway

#### Шаги:
1. Зарегистрируйтесь на [railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Добавьте переменные окружения
4. Railway автоматически запустит приложение

### 3. Render

#### Шаги:
1. Зарегистрируйтесь на [render.com](https://render.com)
2. Создайте новый Web Service
3. Подключите GitHub репозиторий
4. Настройте переменные окружения
5. Укажите команду запуска: `npm start`

### 4. Heroku

#### Шаги:
1. Установите Heroku CLI
2. Создайте приложение: `heroku create your-app-name`
3. Добавьте переменные окружения:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```
4. Деплой: `git push heroku main`

## Переменные окружения

Создайте файл `.env` или настройте переменные в панели управления:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/home-manager
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
PORT=5001
```

## База данных

Рекомендуется использовать MongoDB Atlas:
1. Создайте кластер на [mongodb.com](https://mongodb.com)
2. Получите connection string
3. Добавьте в переменные окружения

## Домен

После деплоя вы получите URL вида:
- Vercel: `https://your-app.vercel.app`
- Railway: `https://your-app.railway.app`
- Render: `https://your-app.onrender.com`
- Heroku: `https://your-app.herokuapp.com`

## Мониторинг

- Проверяйте логи в панели управления
- Настройте уведомления об ошибках
- Мониторьте производительность
