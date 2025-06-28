document.addEventListener('DOMContentLoaded', () => {
    const loginPage = document.querySelector('.login-page');
    const registerPage = document.querySelector('.register-page');
    const chatApp = document.querySelector('.chat-app');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerPasswordInput = document.getElementById('registerPassword');

    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.querySelector('.chat-messages');

    const adminControlPanel = document.querySelector('.admin-control-panel');
    const adminOnlyElements = document.querySelectorAll('.admin-only');

    const bannedPopup = document.querySelector('.banned-popup');
    const closeBannedPopupBtn = document.getElementById('closeBannedPopup');
    const reviewBannedPopupBtn = document.getElementById('reviewBannedPopup');

    const reviewBannedPopup = document.querySelector('.review-banned-popup');
    const submitReviewReasonBtn = document.getElementById('submitReviewReason');
    const cancelReviewBtn = document.getElementById('cancelReview');

    const statusNavButton = document.querySelector('.bottom-nav .nav-button:nth-child(2)'); // Tombol Status
    const statusAdminPopup = document.querySelector('.status-admin-popup');
    const closeStatusAdminPopupBtn = document.getElementById('closeStatusAdminPopup');


    let currentLoggedInUser = null; // Menyimpan informasi pengguna yang sedang login

    // --- Login/Register Logic (Sederhana, tanpa backend) ---
    const users = {
        'annas': { password: 'annas', isAdmin: true, isBanned: false },
        'pengguna1': { password: 'pass1', isAdmin: false, isBanned: false },
        'pengguna2': { password: 'pass2', isAdmin: false, isBanned: true } // Contoh pengguna dibanned
    };

    function showPage(page) {
        loginPage.classList.remove('active');
        registerPage.classList.remove('active');
        chatApp.classList.remove('active');
        adminControlPanel.classList.remove('active'); // Pastikan panel admin tersembunyi saat ganti halaman

        if (page === 'login') {
            loginPage.classList.add('active');
        } else if (page === 'register') {
            registerPage.classList.add('active');
        } else if (page === 'chat') {
            chatApp.classList.add('active');
            if (currentLoggedInUser && users[currentLoggedInUser].isAdmin) {
                adminControlPanel.classList.add('active');
                adminOnlyElements.forEach(el => el.style.display = 'inline-block'); // Tampilkan elemen admin
                populateAdminUserList();
            } else {
                adminControlPanel.classList.remove('active');
                adminOnlyElements.forEach(el => el.style.display = 'none'); // Sembunyikan elemen admin
            }
        }
    }

    // Default tampilan saat awal
    showPage('login');

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login');
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('register');
    });

    loginBtn.addEventListener('click', () => {
        const username = loginUsernameInput.value.toLowerCase();
        const password = loginPasswordInput.value;

        if (users[username] && users[username].password === password) {
            currentLoggedInUser = username;
            if (users[username].isBanned) {
                bannedPopup.classList.add('active');
                showPage('login'); // Tetap di halaman login jika diblokir
            } else {
                showPage('chat');
                // Perbarui nama profil di sidebar
                document.querySelector('.profile-name').textContent = username.charAt(0).toUpperCase() + username.slice(1);
            }
        } else {
            alert('Username atau password salah!');
        }
    });

    registerBtn.addEventListener('click', () => {
        const username = registerUsernameInput.value.toLowerCase();
        const password = registerPasswordInput.value;

        if (username.length < 3 || password.length < 3) {
            alert('Username dan password harus minimal 3 karakter!');
            return;
        }

        if (users[username]) {
            alert('Username sudah ada!');
            return;
        }

        users[username] = { password: password, isAdmin: false, isBanned: false };
        alert('Registrasi berhasil! Silakan login.');
        showPage('login');
        registerUsernameInput.value = '';
        registerPasswordInput.value = '';
    });

    // --- Chat Functionality ---
    sendMessageBtn.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'sent');
            messageDiv.innerHTML = `<p>${messageText}</p><span>${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>`;
            chatMessages.appendChild(messageDiv);
            messageInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll ke bawah
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    // Simulasi pengiriman media (hanya tampilan)
    document.querySelector('.attach-button').addEventListener('click', () => {
        const imageUrl = prompt('Masukkan URL gambar (contoh: https://via.placeholder.com/150):');
        if (imageUrl) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'sent', 'media');
            messageDiv.innerHTML = `<img src="${imageUrl}" alt="Gambar Terkirim"><span>${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    // --- Admin Control Panel Logic ---
    function populateAdminUserList() {
        const userListAdmin = document.querySelector('.user-list-admin');
        userListAdmin.innerHTML = ''; // Kosongkan daftar sebelum mengisi ulang

        for (const username in users) {
            if (username === currentLoggedInUser) continue; // Jangan tampilkan admin itu sendiri di daftar kontrol

            const user = users[username];
            const li = document.createElement('li');
            li.classList.add('admin-user-item');
            li.setAttribute('data-username', username);

            const statusChecked = user.isBanned ? '' : 'checked'; // Checkbox untuk banned status

            li.innerHTML = `
                <img src="https://via.placeholder.com/30" alt="User">
                <span class="admin-username">${username.charAt(0).toUpperCase() + username.slice(1)}</span>
                <div class="admin-actions">
                    <button class="ban-btn" style="${user.isBanned ? 'display: none;' : ''}"><i class="fas fa-ban"></i> Banned</button>
                    <button class="unban-btn" style="${user.isBanned ? '' : 'display: none;'}" ><i class="fas fa-unlock"></i> Unban</button>
                    <label class="switch">
                        <input type="checkbox" ${statusChecked}>
                        <span class="slider round"></span>
                    </label>
                </div>
            `;
            userListAdmin.appendChild(li);
        }

        // Event Listeners untuk tombol Ban/Unban
        userListAdmin.querySelectorAll('.ban-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const userItem = e.target.closest('.admin-user-item');
                const usernameToBan = userItem.getAttribute('data-username');
                if (confirm(`Yakin ingin memblokir akun ${usernameToBan}?`)) {
                    users[usernameToBan].isBanned = true;
                    // Simulasi efek centang/silang status di daftar admin
                    userItem.querySelector('.ban-btn').style.display = 'none';
                    userItem.querySelector('.unban-btn').style.display = 'inline-block';
                    userItem.querySelector('.switch input').checked = false; // Setel ke tidak aktif (diblokir)
                    alert(`Akun ${usernameToBan} telah diblokir.`);
                }
            });
        });

        userListAdmin.querySelectorAll('.unban-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const userItem = e.target.closest('.admin-user-item');
                const usernameToUnban = userItem.getAttribute('data-username');
                if (confirm(`Yakin ingin membuka blokir akun ${usernameToUnban}?`)) {
                    users[usernameToUnban].isBanned = false;
                    // Simulasi efek centang/silang status di daftar admin
                    userItem.querySelector('.unban-btn').style.display = 'none';
                    userItem.querySelector('.ban-btn').style.display = 'inline-block';
                    userItem.querySelector('.switch input').checked = true; // Setel ke aktif (tidak diblokir)
                    alert(`Akun ${usernameToUnban} telah dibuka blokirnya.`);
                }
            });
        });

        // Event Listeners untuk toggle switch
        userListAdmin.querySelectorAll('.switch input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const userItem = e.target.closest('.admin-user-item');
                const username = userItem.getAttribute('data-username');
                users[username].isBanned = !e.target.checked; // Jika dicentang berarti tidak dibanned (aktif)
                if (users[username].isBanned) {
                    userItem.querySelector('.ban-btn').style.display = 'none';
                    userItem.querySelector('.unban-btn').style.display = 'inline-block';
                } else {
                    userItem.querySelector('.unban-btn').style.display = 'none';
                    userItem.querySelector('.ban-btn').style.display = 'inline-block';
                }
                alert(`Status akun ${username} diubah menjadi ${e.target.checked ? 'aktif' : 'diblokir'}.`);
            });
        });
    }


    // --- Banned Popup Logic ---
    closeBannedPopupBtn.addEventListener('click', () => {
        bannedPopup.classList.remove('active');
    });

    reviewBannedPopupBtn.addEventListener('click', () => {
        bannedPopup.classList.remove('active');
        reviewBannedPopup.classList.add('active');
    });

    submitReviewReasonBtn.addEventListener('click', () => {
        const reason = document.getElementById('reviewReason').value.trim();
        if (reason.length > 10) {
            alert('Alasan tinjauan Anda telah dikirim. Harap tunggu konfirmasi dari admin.');
            reviewBannedPopup.classList.remove('active');
            document.getElementById('reviewReason').value = '';
        } else {
            alert('Silakan masukkan alasan yang lebih lengkap (minimal 10 karakter).');
        }
    });

    cancelReviewBtn.addEventListener('click', () => {
        reviewBannedPopup.classList.remove('active');
    });

    // --- Status Admin Popup Logic (triggered by "Status" button in bottom nav) ---
    statusNavButton.addEventListener('click', () => {
        if (currentLoggedInUser && users[currentLoggedInUser].isAdmin) {
            statusAdminPopup.classList.add('active');
            populateStatusAdminList();
        } else {
            alert('Fitur ini hanya untuk admin!');
        }
    });

    closeStatusAdminPopupBtn.addEventListener('click', () => {
        statusAdminPopup.classList.remove('active');
    });

    function populateStatusAdminList() {
        const userStatusList = document.querySelector('.status-admin-content');
        userStatusList.innerHTML = '<h2>Kontrol Status Pengguna</h2>'; // Reset content

        for (const username in users) {
            if (username === currentLoggedInUser) continue; // Jangan tampilkan admin itu sendiri

            const user = users[username];
            const statusDiv = document.createElement('div');
            statusDiv.classList.add('user-status-item');
            statusDiv.setAttribute('data-username', username);

            const activeClassCheck = user.isBanned ? '' : 'active-status';
            const activeClassX = user.isBanned ? 'active-status' : '';

            statusDiv.innerHTML = `
                <img src="https://via.placeholder.com/40" alt="User Avatar">
                <span class="user-status-name">${username.charAt(0).toUpperCase() + username.slice(1)}</span>
                <div class="status-toggle">
                    <i class="fas fa-check-circle green-check ${activeClassCheck}" data-status="active"></i>
                    <i class="fas fa-times-circle red-x ${activeClassX}" data-status="banned"></i>
                </div>
            `;
            userStatusList.appendChild(statusDiv);
        }

        userStatusList.querySelectorAll('.status-toggle i').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const userItem = e.target.closest('.user-status-item');
                const username = userItem.getAttribute('data-username');
                const statusType = e.target.getAttribute('data-status');

                userItem.querySelector('.green-check').classList.remove('active-status');
                userItem.querySelector('.red-x').classList.remove('active-status');
                e.target.classList.add('active-status');

                if (statusType === 'active') {
                    users[username].isBanned = false;
                    alert(`Status ${username} diatur menjadi aktif.`);
                } else {
                    users[username].isBanned = true;
                    alert(`Status ${username} diatur menjadi diblokir.`);
                }
                 // Perbarui juga tampilan di admin control panel utama
                 populateAdminUserList();
            });
        });
        const closeBtn = document.createElement('button');
        closeBtn.id = 'closeStatusAdminPopup';
        closeBtn.textContent = 'Tutup';
        closeBtn.addEventListener('click', () => statusAdminPopup.classList.remove('active'));
        userStatusList.appendChild(closeBtn);
    }

    // Initialize the main chat list (contoh, nanti akan diisi dari backend)
    // Misalnya, Anda bisa menambahkan user ke chat list jika tidak di banned
    // populateChatList(); // Perlu fungsi untuk ini
});