<?php
session_start();
require_once 'db_connect.php';

// Redirect jika sudah login
if (isset($_SESSION['user_id'])) {
    header('Location: todo.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    $stmt = $pdo->prepare('SELECT id, password FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        header('Location: todo.php');
        exit();
    }

    $error = 'Username atau password salah. Silakan coba lagi.';
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - To-Do List</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Import font */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        :root {
            --bg: #121212;
            --card: #1e1e1e;
            --accent: #BB86FC;
            --text: #E0E0E0;
            --text-secondary: #757575;
            --radius: 0.75rem;
            --transition: 0.25s ease;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
        }
        .header {
            text-align: center;
            margin-bottom: 1rem;
        }
         .profile-photo {
            width: 500px;
            height: 180px;
            object-fit: cover;
            border-radius: 16px;
            border: 3px solid #ff9a76;
        }

        }
        .header-text h1 {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        .header-text h2 {
            font-size: 1.125rem;
            font-weight: 300;
            color: var(--text-secondary);
        }
        .container {
            background: var(--card);
            padding: 2.5rem;
            border-radius: var(--radius);
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            width: 100%;
            max-width: 500px;
            animation: fadeIn 0.5s var(--transition);
            text-align: center;
        }
        .container h2 {
            font-weight: 600;
            margin-bottom: 1.5rem;
            font-size: 2rem;
        }
        .form-group {
            position: relative;
            margin-bottom: 1.5rem;
        }
        .form-group label {
            position: absolute;
            top: -1.2rem;
            left: 1rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        .form-group input {
            width: 100%;
            padding: 1.25rem 1rem 1.25rem 3rem;
            border: none;
            border-radius: var(--radius);
            background: #2a2a2a;
            color: var(--text);
            font-size: 1rem;
            transition: background var(--transition), box-shadow var(--transition);
        }
        .form-group input:focus {
            outline: none;
            background: #333;
            box-shadow: 0 0 0 2px var(--accent);
        }
        .form-group .fa-user,
        .form-group .fa-lock {
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
            font-size: 1.4rem;
            color: var(--text-secondary);
        }
        .toggle-password {
            position: absolute;
            top: 50%;
            right: 1rem;
            transform: translateY(-50%);
            font-size: 1.4rem;
            color: var(--text-secondary);
            cursor: pointer;
        }
        .btn {
            display: block;
            width: 100%;
            padding: 0.9rem;
            background: var(--accent);
            color: #fff;
            border: none;
            border-radius: var(--radius);
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: background var(--transition), transform var(--transition);
            margin-top: 0.5rem;
        }
        .btn:hover {
            background: #a66ae0;
            transform: translateY(-2px);
        }
        p.register {
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: var(--text-secondary);
        }
        p.register a {
            color: var(--accent);
            text-decoration: none;
            transition: color var(--transition);
        }
        p.register a:hover {
            color: #d08efc;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(1rem); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>

    <div class="header">
        <img src="photo.jpg" alt="Foto Profil" class="profile-photo">
        <div class="header-text">
            <h1>Alogo Situmorang</h1>
            <h2>235314088</h2>
        </div>
    </div>

    <div class="container">
        <h2>Masuk</h2>

        <?php if ($error): ?>
            <p style="color: #ff6b6b; margin-bottom: 1rem;"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <div class="form-group">
                <label for="username">Username</label>
                <i class="fas fa-user"></i>
                <input type="text" id="username" name="username" placeholder="Masukkan username Anda" required>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <i class="fas fa-lock"></i>
                <input type="password" id="password" name="password" placeholder="Masukkan password Anda" required>
                <i class="fas fa-eye toggle-password" data-target="password"></i>
            </div>

            <button type="submit" class="btn">Masuk</button>
        </form>

        <p class="register">Belum punya akun? <a href="register.php">Daftar di sini</a></p>
    </div>

    <script>
        document.querySelectorAll('.toggle-password').forEach(icon => {
            icon.addEventListener('click', () => {
                const target = icon.getAttribute('data-target');
                const input = document.getElementById(target);
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });
    </script>

</body>

</html>
