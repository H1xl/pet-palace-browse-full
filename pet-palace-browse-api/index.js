const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // Подключение к базе данных
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Включение CORS для всех запросов

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Если токена нет

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Невалидный токен
    req.user = user;
    next();
  });
};

// Middleware для проверки роли администратора
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.sendStatus(403); // Доступ запрещен
    }
};

// ==========================================================
// API Эндпоинты для Users
// ==========================================================

// Регистрация пользователя
app.post('/api/users/register', async (req, res) => {
  const { full_name, username, email, phone, password } = req.body;
  if (!full_name || !username || !email || !password) {
    return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (full_name, username, email, phone, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role',
      [full_name, username, email, phone, hashedPassword]
    );
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Код ошибки для уникальных полей
        return res.status(409).json({ message: 'Пользователь с таким именем пользователя или email уже существует.' });
    }
    res.status(500).json({ message: 'Ошибка сервера при регистрации пользователя.' });
  }
});

// Вход пользователя
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный email или пароль.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Вход успешен', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при входе.' });
  }
});

// Получить всех пользователей (только для админов)
app.get('/api/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, full_name, username, email, phone, role, status, created_at, updated_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при получении пользователей.' });
  }
});

// Получить пользователя по ID (только для админов или самого пользователя)
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен.' });
    }
    const result = await pool.query('SELECT id, full_name, username, email, phone, role, status, created_at, updated_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при получении пользователя.' });
  }
});

// Обновить пользователя (только для админов или самого пользователя)
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { full_name, username, email, phone, role, status } = req.body;
  try {
    if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен.' });
    }
    // Разрешаем обновление роли и статуса только администраторам
    let query = 'UPDATE users SET updated_at = NOW()';
    const values = [];
    let paramIndex = 1;

    if (full_name !== undefined) { query += `, full_name = $${paramIndex++}`; values.push(full_name); }
    if (username !== undefined) { query += `, username = $${paramIndex++}`; values.push(username); }
    if (email !== undefined) { query += `, email = $${paramIndex++}`; values.push(email); }
    if (phone !== undefined) { query += `, phone = $${paramIndex++}`; values.push(phone); }
    if (req.user.role === 'admin') { // Только админ может менять role и status
        if (role !== undefined) { query += `, role = $${paramIndex++}`; values.push(role); }
        if (status !== undefined) { query += `, status = $${paramIndex++}`; values.push(status); }
    }
    
    query += ` WHERE id = $${paramIndex++} RETURNING id, username, email, role`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    res.json({ message: 'Пользователь успешно обновлен', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
        return res.status(409).json({ message: 'Пользователь с таким именем пользователя или email уже существует.' });
    }
    res.status(500).json({ message: 'Ошибка сервера при обновлении пользователя.' });
  }
});

// Удалить пользователя (только для админов)
app.delete('/api/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    res.json({ message: 'Пользователь успешно удален.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при удалении пользователя.' });
  }
});

// ==========================================================
// API Эндпоинты для Products
// ==========================================================

// Создать новый продукт (только для админов)
app.post('/api/products', authenticateToken, authorizeAdmin, async (req, res) => {
  const { name, description, price, image_url, category, pet_type, product_type, discount, is_new, in_stock, brand, weight, specifications } = req.body;
  if (!name || !price || !category || !pet_type || !product_type) {
    return res.status(400).json({ message: 'Обязательные поля: name, price, category, pet_type, product_type.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, image_url, category, pet_type, product_type, discount, is_new, in_stock, brand, weight, specifications) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [name, description, price, image_url, category, pet_type, product_type, discount, is_new, in_stock, brand, weight, specifications]
    );
    res.status(201).json({ message: 'Продукт успешно создан', product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при создании продукта.' });
  }
});

// Получить все продукты
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при получении продуктов.' });
  }
});

// Получить продукт по ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Продукт не найден.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при получении продукта.' });
  }
});

// Обновить продукт (только для админов)
app.put('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category, pet_type, product_type, discount, is_new, in_stock, brand, weight, specifications } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5, pet_type = $6, product_type = $7, discount = $8, is_new = $9, in_stock = $10, brand = $11, weight = $12, specifications = $13, updated_at = NOW() WHERE id = $14 RETURNING *',
      [name, description, price, image_url, category, pet_type, product_type, discount, is_new, in_stock, brand, weight, specifications, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Продукт не найден.' });
    }
    res.json({ message: 'Продукт успешно обновлен', product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при обновлении продукта.' });
  }
});

// Удалить продукт (только для админов)
app.delete('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Продукт не найден.' });
    }
    res.json({ message: 'Продукт успешно удален.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при удалении продукта.' });
  }
});

// ==========================================================
// API Эндпоинты для Orders
// ==========================================================

// Создать новый заказ (требуется аутентификация)
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { total, shipping_street, shipping_city, shipping_postal_code, items } = req.body;
  const user_id = req.user.id; // Получаем user_id из токена

  if (!total || !shipping_street || !shipping_city || !shipping_postal_code || !items || items.length === 0) {
    return res.status(400).json({ message: 'Все обязательные поля и позиции заказа должны быть заполнены.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Начинаем транзакцию

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total, shipping_street, shipping_city, shipping_postal_code) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [user_id, total, shipping_street, shipping_city, shipping_postal_code]
    );
    const order_id = orderResult.rows[0].id;

    for (const item of items) {
      const { product_id, quantity, price } = item;
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order_id, product_id, quantity, price]
      );
    }

    await client.query('COMMIT'); // Завершаем транзакцию
    res.status(201).json({ message: 'Заказ успешно создан', order_id });
  } catch (err) {
    await client.query('ROLLBACK'); // Откатываем транзакцию в случае ошибки
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при создании заказа.' });
  } finally {
    client.release();
  }
});

// Получить все заказы (только для админов)
app.get('/api/orders', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при получении заказов.' });
  }
});

// Получить заказы текущего пользователя
app.get('/api/orders/my', authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [user_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при получении ваших заказов.' });
    }
});


// Получить заказ по ID (для админа или владельца заказа)
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Заказ не найден.' });
    }
    const order = result.rows[0];
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен.' });
    }
    // Также можно получить позиции заказа
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    order.items = itemsResult.rows;
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при получении заказа.' });
  }
});

// Обновить статус заказа (только для админов)
app.put('/api/orders/:id/status', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
      return res.status(400).json({ message: 'Статус заказа обязателен.' });
  }
  // Проверка на допустимые статусы
  const allowedStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Недопустимый статус заказа.' });
  }

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Заказ не найден.' });
    }
    res.json({ message: 'Статус заказа успешно обновлен', order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при обновлении статуса заказа.' });
  }
});

// Удалить заказ (только для админов)
app.delete('/api/orders/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Заказ не найден.' });
    }
    res.json({ message: 'Заказ успешно удален.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера при удалении заказа.' });
  }
});

// ==========================================================
// API Эндпоинты для Cart Items
// ==========================================================

// Добавить товар в корзину
app.post('/api/cart', authenticateToken, async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Product ID и Quantity (больше 0) обязательны.' });
    }

    try {
        // Проверяем, есть ли уже этот товар в корзине пользователя
        const existingItem = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
            [user_id, product_id]
        );

        if (existingItem.rows.length > 0) {
            // Если товар уже есть, обновляем количество
            const updatedItem = await pool.query(
                'UPDATE cart_items SET quantity = quantity + $1, updated_at = NOW() WHERE user_id = $2 AND product_id = $3 RETURNING *',
                [quantity, user_id, product_id]
            );
            return res.status(200).json({ message: 'Количество товара в корзине обновлено.', cartItem: updatedItem.rows[0] });
        } else {
            // Если товара нет, добавляем новый
            const result = await pool.query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [user_id, product_id, quantity]
            );
            res.status(201).json({ message: 'Товар добавлен в корзину.', cartItem: result.rows[0] });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при добавлении товара в корзину.' });
    }
});

// Получить товары в корзине текущего пользователя
app.get('/api/cart', authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(`
            SELECT
                ci.id AS cart_item_id,
                ci.product_id,
                ci.quantity,
                p.name AS product_name,
                p.price AS product_price,
                p.image_url AS product_image_url
            FROM
                cart_items ci
            JOIN
                products p ON ci.product_id = p.id
            WHERE
                ci.user_id = $1
            ORDER BY
                ci.created_at DESC
        `, [user_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при получении корзины.' });
    }
});

// Обновить количество товара в корзине
app.put('/api/cart/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; // id элемента корзины
    const { quantity } = req.body;
    const user_id = req.user.id;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity (больше 0) обязательна.' });
    }

    try {
        const result = await pool.query(
            'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, id, user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Элемент корзины не найден или не принадлежит пользователю.' });
        }
        res.json({ message: 'Количество товара в корзине обновлено.', cartItem: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при обновлении количества товара в корзине.' });
    }
});

// Удалить товар из корзины
app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; // id элемента корзины
    const user_id = req.user.id;
    try {
        const result = await pool.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id', [id, user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Элемент корзины не найден или не принадлежит пользователю.' });
        }
        res.json({ message: 'Элемент корзины успешно удален.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при удалении элемента из корзины.' });
    }
});

// Очистить корзину пользователя
app.delete('/api/cart/clear', authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    try {
        await pool.query('DELETE FROM cart_items WHERE user_id = $1', [user_id]);
        res.json({ message: 'Корзина пользователя успешно очищена.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при очистке корзины.' });
    }
});


// ==========================================================
// Запуск сервера
// ==========================================================
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});