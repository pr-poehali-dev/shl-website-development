-- Создание таблиц для хоккейной лиги СХЛ

-- Таблица конференций
CREATE TABLE IF NOT EXISTS conferences (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица команд
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    conference_id INTEGER REFERENCES conferences(id),
    name VARCHAR(100) NOT NULL,
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    overtime_losses INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица матчей
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    match_date TIMESTAMP NOT NULL,
    home_score INTEGER,
    away_score INTEGER,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица регламента
CREATE TABLE IF NOT EXISTS regulations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных данных: конференции
INSERT INTO conferences (name) VALUES 
('Западная конференция'),
('Восточная конференция');

-- Вставка начальных команд (по 6 в каждой конференции)
INSERT INTO teams (conference_id, name, games_played, wins, losses, overtime_losses, points, goals_for, goals_against, position) VALUES
-- Западная конференция
(1, 'Команда 1', 10, 7, 2, 1, 22, 35, 18, 1),
(1, 'Команда 2', 10, 6, 3, 1, 19, 30, 22, 2),
(1, 'Команда 3', 10, 5, 4, 1, 16, 28, 25, 3),
(1, 'Команда 4', 10, 4, 5, 1, 13, 25, 28, 4),
(1, 'Команда 5', 10, 3, 6, 1, 10, 20, 30, 5),
(1, 'Команда 6', 10, 2, 7, 1, 7, 15, 35, 6),
-- Восточная конференция
(2, 'Команда 7', 10, 8, 1, 1, 25, 40, 15, 1),
(2, 'Команда 8', 10, 6, 2, 2, 20, 32, 20, 2),
(2, 'Команда 9', 10, 5, 3, 2, 17, 28, 23, 3),
(2, 'Команда 10', 10, 4, 4, 2, 14, 26, 26, 4),
(2, 'Команда 11', 10, 3, 5, 2, 11, 22, 30, 5),
(2, 'Команда 12', 10, 1, 8, 1, 4, 12, 38, 6);

-- Вставка начального регламента
INSERT INTO regulations (title, content, order_index) VALUES
('Формат турнира', 'Турнир проводится в формате регулярного чемпионата с последующими плей-офф. В регулярном чемпионате участвуют 12 команд, разделенных на две конференции по 6 команд.', 1),
('Система начисления очков', 'За победу в основное время команда получает 3 очка, за победу в овертайме или по буллитам - 2 очка, за поражение в овертайме или по буллитам - 1 очко, за поражение в основное время - 0 очков.', 2),
('Плей-офф', 'В плей-офф выходят 8 лучших команд по итогам регулярного чемпионата. Все серии плей-офф играются до 4 побед.', 3);