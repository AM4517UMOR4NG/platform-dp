# Web Development Projects — Platform Development

Kumpulan tugas dan proyek web development, mulai dari fundamental HTML/CSS hingga aplikasi full-stack PHP dan JavaScript.

---

## 📂 Daftar Proyek

| Proyek | Direktori | Stack Utama | Deskripsi Singkat |
| :--- | :--- | :--- | :--- |
| **Modern Dashboard** | `ModernDashboard/` | Chart.js, PWA, MVC | Dashboard analytics interaktif *(In Progress)* |
| **Todo List App** | `Tugas_PHP/` | PHP 8, MySQL, PDO | CRUD tugas dengan autentikasi aman & session |
| **Netflix Clone** | `NetlixClone/` | Tailwind CSS, YouTube API | Landing page replika dengan video modal popup |
| **Portfolio** | `Boostrap (UTS_Platform_DP)/` | Bootstrap 5, Animate.css | Web portofolio responsif multi-seksi |
| **Games Collection** | `A_bunch_of_games/` | Vanilla JS, CSS Grid/Flexbox | Koleksi game interaktif sederhana |
| **JS Dynamic Form** | `TugasJavaScript/` | Vanilla JS | Form dinamis multi-step dengan validasi |
| **HTML & CSS Basics** | `Tugas_HTML/`, `Tugas_CSS/` | Semantic HTML5, CSS3 | Latihan struktur semantik dan styling layout |

---

## 🛠 Teknologi

* **Frontend:** HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, Bootstrap 5
* **Backend & Database:** PHP 8+, MySQL
* **Tools & Libraries:** Chart.js, Font Awesome, Animate.css

---

## 🚀 Cara Menjalankan

### Proyek Statis / Frontend
Buka file `.html` yang relevan langsung di browser atau gunakan ekstensi **Live Server** di VS Code.

### Proyek PHP (Todo List)
1. Pindahkan folder ke direktori server lokal (misalnya `htdocs` di XAMPP).
2. Buat database di phpMyAdmin dan import file SQL dari `Tugas_PHP/Database/Perintah_Query/`.
3. Sesuaikan koneksi di `Tugas_PHP/Semua_File_PHP/db_connect.php`.
4. Buka `http://localhost/[nama-folder]/Tugas_PHP/Semua_File_PHP/login.php` di browser.

### Modern Dashboard
```bash
npm install
npm start
