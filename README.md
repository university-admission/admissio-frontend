# admissio-frontend
Це клієнтська частина проєкту **Admissio** — система прогнозування шансів вступу до університету.

## Функціональність

- Введення власного балу
- Перевірка позиції в рейтингу
- Взаємодія з бекендом через REST API

## Технології

- TypeScript
- HTML + CSS
- Lite-server (локальний сервер)
- Fetch API

## Запуск проєкту

### 1. Встановлення залежностей
```bash
npm install
```
### 2. Збірка TypeScript
```bash
npm run build
```
### 3. Запуск локального сервера
```bash
npm start
```

## Запуск через Docker
```bash
docker build -t admissio-frontend .
docker run -p 3000:80 admissio-frontend
```

Сайт буде доступний за адресою: http://localhost:3000