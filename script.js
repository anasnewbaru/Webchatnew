document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    const appOverlay = document.getElementById('appOverlay');
    const overlayMessage = document.getElementById('overlayMessage');

    // Auth Pages
    const loginPage = document.getElementById('loginPage');
    const registerPage = document.getElementById('registerPage');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const loginBtn = document.getElementById('loginBtn');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const registerBtn = document.getElementById('registerBtn');
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerPasswordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Main App
    const chatApp = document.getElementById('chatApp');
    const logoutBtn = document.getElementById('logoutBtn');
    const myProfileAvatar = document.getElementById('myProfileAvatar');
    const myProfileName = document.getElementById('myProfileName');

    // Navigation
    const navChatBtn = document.getElementById('navChatBtn');
    const navUsersBtn = document.getElementById('navUsersBtn');
    const navStatusBtn = document.getElementById('navStatusBtn');
    const navAdminBtn = document.getElementById('navAdminBtn');
    const adminOnlyElements = document.querySelectorAll('.admin-only');

    // Main Content Views
    const chatView = document.getElementById('chatView');
    const usersView = document.getElementById('usersView');
    const statusView = document.getElementById('statusView');
    const adminPanel = document.getElementById('adminPanel');

    // Chat View Elements
    const chatList = document.getElementById('chatList');
    const currentChatAvatar = document.getElementById('currentChatAvatar');
    const currentChatName = document.getElementById('currentChatName');
    const chatPartnerVerified = document.getElementById('chatPartnerVerified');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const attachMediaBtn = document.getElementById('attachMediaBtn');
    const moreOptionsBtn = document.querySelector('.more-options');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const viewProfileBtn = document.getElementById('viewProfileBtn');

    // Users View Elements
    const globalUserList = document.getElementById('globalUserList');

    // Status View Elements
    const statusInput = document.getElementById('statusInput');
    const postStatusBtn = document.getElementById('postStatusBtn');
    const statusFeed = document.getElementById('statusFeed');

    // Admin Panel Elements
    const adminUserList = document.getElementById('adminUserList');

    // Modals
    const bannedModal = document.getElementById('bannedModal');
    const closeBannedModal = document.getElementById('closeBannedModal');
    const reviewBanBtn = document.getElementById('reviewBanBtn');
    const reviewBanModal = document.getElementById('reviewBanModal');
    const cancelReviewBtn = document.getElementById('cancelReviewBtn');
    const submitReviewBtn = document.getElementById('submitReviewBtn');
    const reviewReasonInput = document.getElementById('reviewReasonInput');


    // --- Data Simulasi (In-Memory, TIDAK PERSISTEN) ---
    let users = {
        'annas': { password: 'annas', isAdmin: true, avatar: 'https://api.adorable.io/avatars/50/annas.png', isBanned: false, status: 'Online' },
        'anas': { password: 'pass1', isAdmin: false, avatar: 'https://api.adorable.io/avatars/50/anas.png', isBanned: false, status: 'Online' },
        'budi': { password: 'pass2', isAdmin: false, avatar: 'https://api.adorable.io/avatars/50/budi.png', isBanned: false, status: 'Offline' },
        'cindy': { password: 'pass3', isAdmin: false, avatar: 'https://api.adorable.io/avatars/50/cindy.png', isBanned: true, status: 'Online' }, // Contoh user banned
        'dian': { password: 'pass4', isAdmin: false, avatar: 'https://api.adorable.io/avatars/50/dian.png', isBanned: false, status: 'Away' }
    };

    let currentUser = null; // Username pengguna yang sedang login
    let currentChatPartner = null; // Username pengguna yang sedang di-chat

    let chatData = {
        'anas': [
            { sender: 'anas', type: 'text', content: 'Halo, gimana kabarmu?', timestamp: '10:30 AM' },
            { sender: 'annas', type: 'text', content: 'Baik, kamu?', timestamp: '10:31 AM' },
            { sender: 'anas', type: 'media', content: 'https://via.placeholder.com/200x150?text=Gambar+Keren', timestamp: '10:33 AM' }
        ],
        'budi': [
            { sender: 'annas', type: 'text', content: 'Hai Budi, ada apa?', timestamp: 'Kemarin' }
        ]
    };

    let statusFeedData = [
        { author: 'anas', avatar: 'https://api.adorable.io/avatars/40/anas.png', text: 'Selamat pagi semua! Semoga harimu menyenangkan ✨', time: '1 jam lalu' },
        { author: 'budi', avatar: 'https://api.adorable.io/avatars/40/budi.png', text: 'Sedang mengerjakan proyek baru, semangat! 🚀', time: '3 jam lalu' },
        { author: 'dian', avatar: 'https://api.adorable.io/avatars/40/dian.png', text: 'Ngopi dulu biar semangat!', time: '5 jam lalu' }
    ];

    // --- Fungsi Utilitas ---

    function showOverlay(message = 'Memuat...') {
        overlayMessage.textContent = message;
        appOverlay.classList.add('active');
    }

    function hideOverlay() {
        appOverlay.classList.remove('active');
    }

    function showPage(pageId) {
        showOverlay();
        // Hide all main containers first
        document.querySelectorAll('.auth-page, .main-app').forEach(page => page.classList.remove('active', 'hidden'));
        document.querySelectorAll('.auth-page').forEach(page => page.classList.add('hidden')); // Ensure auth pages are truly hidden
        document.getElementById(pageId).classList.remove('hidden'); // Show target page by removing hidden

        // Special handling for auth pages vs main app
        if (pageId === 'loginPage' || pageId === 'registerPage') {
            document.getElementById(pageId).classList.add('active');
            chatApp.classList.add('hidden'); // Ensure chat app is hidden
        } else if (pageId === 'chatApp') {
            document.getElementById(pageId).classList.add('active');
            loginPage.classList.add('hidden');
            registerPage.classList.add('hidden');
        }

        hideOverlay();
    }

    function showMainContentView(viewId) {
        document.querySelectorAll('.main-content section').forEach(view => view.classList.remove('active'));
        document.querySelectorAll('.main-content section').forEach(view => view.classList.add('hidden')); // Ensure all sections are truly hidden
        document.getElementById(viewId).classList.remove('hidden');
        document.getElementById(viewId).classList.add('active');

        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        // Activate the correct navigation button
        if (viewId === 'chatView') navChatBtn.classList.add('active');
        else if (viewId === 'usersView') navUsersBtn.classList.add('active');
        else if (viewId === 'statusView') navStatusBtn.classList.add('active');
        else if (viewId === 'adminPanel') navAdminBtn.classList.add('active');
    }

    function generateAvatar(username) {
        return `https://api.adorable.io/avatars/50/${username}.png`;
    }

    // --- Auth Logic ---
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('registerPage');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('loginPage');
    });

    loginBtn.addEventListener('click', () => {
        const username = loginUsernameInput.value.toLowerCase();
        const password = loginPasswordInput.value;

        showOverlay('Memverifikasi...');
        setTimeout(() => { // Simulate network delay
            if (users[username] && users[username].password === password) {
                currentUser = username;
                if (users[currentUser].isBanned) {
                    showPage('loginPage'); // Stay on login page
                    bannedModal.classList.add('active');
                } else {
                    showPage('chatApp');
                    myProfileName.textContent = username.charAt(0).toUpperCase() + username.slice(1);
                    myProfileAvatar.src = users[username].avatar;
                    // Show/hide admin panel button and panel itself
                    if (users[currentUser].isAdmin) {
                        adminOnlyElements.forEach(el => el.classList.remove('hidden'));
                        // showMainContentView('adminPanel'); // Optionally go to admin panel on login
                    } else {
                        adminOnlyElements.forEach(el => el.classList.add('hidden'));
                        showMainContentView('chatView'); // Default to chat view
                    }
                    populateChatList();
                    populateGlobalUserList();
                    populateStatusFeed();
                    populateAdminUserList(); // Populate admin list regardless if admin is logged in
                }
            } else {
                alert('Username atau password salah!');
                showPage('loginPage'); // Stay on login page
            }
            hideOverlay();
        }, 1000);
    });

    registerBtn.addEventListener('click', () => {
        const username = registerUsernameInput.value.toLowerCase();
        const password = registerPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert('Konfirmasi password tidak cocok!');
            return;
        }
        if (username.length < 3 || password.length < 6) {
            alert('Username minimal 3 karakter, password minimal 6 karakter!');
            return;
        }
        if (users[username]) {
            alert('Username sudah terdaftar!');
            return;
        }

        showOverlay('Mendaftarkan akun...');
        setTimeout(() => { // Simulate network delay
            users[username] = {
                password: password,
                isAdmin: false,
                avatar: generateAvatar(username),
                isBanned: false,
                status: 'Online'
            };
            alert('Registrasi berhasil! Silakan login.');
            showPage('loginPage');
            registerUsernameInput.value = '';
            registerPasswordInput.value = '';
            confirmPasswordInput.value = '';
            hideOverlay();
        }, 1000);
    });

    logoutBtn.addEventListener('click', () => {
        showOverlay('Logging out...');
        setTimeout(() => {
            currentUser = null;
            currentChatPartner = null;
            chatMessages.innerHTML = ''; // Clear chat messages
            chatList.innerHTML = ''; // Clear chat list
            globalUserList.innerHTML = ''; // Clear user list
            statusFeed.innerHTML = ''; // Clear status feed
            adminUserList.innerHTML = ''; // Clear admin list
            showPage('loginPage');
            hideOverlay();
        }, 800);
    });

    // --- Navigation ---
    navChatBtn.addEventListener('click', () => showMainContentView('chatView'));
    navUsersBtn.addEventListener('click', () => showMainContentView('usersView'));
    navStatusBtn.addEventListener('click', () => showMainContentView('statusView'));
    navAdminBtn.addEventListener('click', () => {
        if (currentUser && users[currentUser].isAdmin) {
            showMainContentView('adminPanel');
            populateAdminUserList(); // Refresh admin list
        } else {
            alert('Anda tidak memiliki akses admin!');
        }
    });

    // --- Chat Functionality ---
    function populateChatList() {
        chatList.innerHTML = '';
        const allUsernames = Object.keys(users).filter(u => u !== currentUser);

        allUsernames.forEach(username => {
            const user = users[username];
            const li = document.createElement('li');
            li.classList.add('chat-item');
            if (currentChatPartner === username) {
                li.classList.add('active');
            }
            li.setAttribute('data-username', username);
            li.innerHTML = `
                <img src="${user.avatar}" alt="Avatar ${username}" class="chat-avatar">
                <div class="chat-details">
                    <span class="chat-name">${username.charAt(0).toUpperCase() + username.slice(1)}</span>
                    <p class="last-message">${chatData[username] && chatData[username].length > 0 ? chatData[username][chatData[username].length - 1].content.substring(0, 30) + (chatData[username][chatData[username].length - 1].content.length > 30 ? '...' : '') : 'Mulai chat baru'}</p>
                </div>
                <span class="chat-time">${chatData[username] && chatData[username].length > 0 ? chatData[username][chatData[username].length - 1].timestamp : ''}</span>
                `;
            chatList.appendChild(li);

            li.addEventListener('click', () => {
                selectChat(username);
            });
        });
    }

    function selectChat(username) {
        currentChatPartner = username;
        document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`.chat-item[data-username="${username}"]`).classList.add('active');

        const partnerUser = users[username];
        currentChatAvatar.src = partnerUser.avatar;
        currentChatName.textContent = username.charAt(0).toUpperCase() + username.slice(1);

        if (users[username].isAdmin) {
            chatPartnerVerified.classList.remove('hidden');
        } else {
            chatPartnerVerified.classList.add('hidden');
        }

        loadChatMessages(username);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    function loadChatMessages(username) {
        chatMessages.innerHTML = '';
        const messages = chatData[username] || [];

        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.sender === currentUser ? 'sent' : 'received');

            let contentHTML = '';
            if (msg.type === 'text') {
                contentHTML = `<p>${msg.content}</p>`;
            } else if (msg.type === 'media') {
                contentHTML = `<img src="${msg.content}" alt="Media Terkirim">`;
                messageDiv.classList.add('media');
            }

            messageDiv.innerHTML = `
                <div class="message-content">
                    ${contentHTML}
                </div>
                <span class="message-time">${msg.timestamp}</span>
            `;
            chatMessages.appendChild(messageDiv);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight; // Ensure it's scrolled to the bottom
    }

    sendMessageBtn.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText && currentChatPartner) {
            const newMessage = {
                sender: currentUser,
                type: 'text',
                content: messageText,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };
            if (!chatData[currentChatPartner]) {
                chatData[currentChatPartner] = [];
            }
            chatData[currentChatPartner].push(newMessage);
            loadChatMessages(currentChatPartner);
            messageInput.value = '';
            // Update last message in sidebar
            const chatItem = document.querySelector(`.chat-item[data-username="${currentChatPartner}"]`);
            if (chatItem) {
                chatItem.querySelector('.last-message').textContent = messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '');
                chatItem.querySelector('.chat-time').textContent = newMessage.timestamp;
            }
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    attachMediaBtn.addEventListener('click', () => {
        if (!currentChatPartner) {
            alert('Silakan pilih chat terlebih dahulu.');
            return;
        }
        const imageUrl = prompt('Masukkan URL gambar (contoh: https://via.placeholder.com/150):');
        if (imageUrl) {
            const newMediaMessage = {
                sender: currentUser,
                type: 'media',
                content: imageUrl,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };
            if (!chatData[currentChatPartner]) {
                chatData[currentChatPartner] = [];
            }
            chatData[currentChatPartner].push(newMediaMessage);
            loadChatMessages(currentChatPartner);
            // Update last message in sidebar
            const chatItem = document.querySelector(`.chat-item[data-username="${currentChatPartner}"]`);
            if (chatItem) {
                chatItem.querySelector('.last-message').textContent = '🖼️ Gambar';
                chatItem.querySelector('.chat-time').textContent = newMediaMessage.timestamp;
            }
        }
    });

    // Dropdown menu for chat header
    moreOptionsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from closing immediately
        dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!moreOptionsBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    viewProfileBtn.addEventListener('click', () => {
        alert(`Melihat profil ${currentChatPartner.charAt(0).toUpperCase() + currentChatPartner.slice(1)}`);
        dropdownMenu.classList.add('hidden');
    });
    document.querySelectorAll('.report-chat-btn').forEach(btn => btn.addEventListener('click', () => {
        alert(`Melaporkan chat dengan ${currentChatPartner.charAt(0).toUpperCase() + currentChatPartner.slice(1)}`);
        dropdownMenu.classList.add('hidden');
    }));
    document.querySelectorAll('.clear-chat-btn').forEach(btn => btn.addEventListener('click', () => {
        if (confirm(`Yakin ingin membersihkan semua pesan dengan ${currentChatPartner.charAt(0).toUpperCase() + currentChatPartner.slice(1)}?`)) {
            chatData[currentChatPartner] = [];
            loadChatMessages(currentChatPartner);
            alert('Chat dibersihkan.');
        }
        dropdownMenu.classList.add('hidden');
    }));


    // --- Users View ---
    function populateGlobalUserList() {
        globalUserList.innerHTML = '';
        const allUsernames = Object.keys(users).filter(u => u !== currentUser && !users[u].isBanned); // Filter banned users

        allUsernames.forEach(username => {
            const user = users[username];
            const li = document.createElement('li');
            li.classList.add('user-item');
            li.setAttribute('data-username', username);
            li.innerHTML = `
                <img src="${user.avatar}" alt="Avatar ${username}" class="user-avatar">
                <div class="user-info">
                    <span class="user-name">${username.charAt(0).toUpperCase() + username.slice(1)}</span>
                    <span class="user-status ${user.status.toLowerCase()}">${user.status}</span>
                </div>
                <button class="start-chat-btn"><i class="fas fa-comment-dots"></i> Chat</button>
            `;
            globalUserList.appendChild(li);

            li.querySelector('.start-chat-btn').addEventListener('click', () => {
                selectChat(username);
                showMainContentView('chatView');
            });
        });
    }

    document.getElementById('userSearchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('#globalUserList .user-item').forEach(item => {
            const username = item.getAttribute('data-username').toLowerCase();
            if (username.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });


    // --- Status View ---
    function populateStatusFeed() {
        statusFeed.innerHTML = '';
        statusFeedData.forEach(status => {
            const li = document.createElement('li');
            li.classList.add('status-item');
            li.innerHTML = `
                <img src="${status.avatar}" alt="Avatar ${status.author}" class="status-avatar">
                <div class="status-content">
                    <span class="status-author">${status.author.charAt(0).toUpperCase() + status.author.slice(1)}</span>
                    <p class="status-text">${status.text}</p>
                    <span class="status-time">${status.time}</span>
                </div>
            `;
            statusFeed.appendChild(li);
        });
    }

    postStatusBtn.addEventListener('click', () => {
        const newStatusText = statusInput.value.trim();
        if (newStatusText) {
            statusFeedData.unshift({ // Add to the beginning
                author: currentUser,
                avatar: users[currentUser].avatar,
                text: newStatusText,
                time: 'Baru saja'
            });
            populateStatusFeed();
            statusInput.value = '';
            alert('Status berhasil diposting!');
        } else {
            alert('Silakan tulis status Anda.');
        }
    });

    document.getElementById('statusSearchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('#statusFeed .status-item').forEach(item => {
            const author = item.querySelector('.status-author').textContent.toLowerCase();
            const text = item.querySelector('.status-text').textContent.toLowerCase();
            if (author.includes(searchTerm) || text.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });


    // --- Admin Panel ---
    function populateAdminUserList() {
        adminUserList.innerHTML = '';
        const allUsernames = Object.keys(users).filter(u => u !== currentUser);

        allUsernames.forEach(username => {
            const user = users[username];
            const li = document.createElement('li');
            li.classList.add('admin-user-item');
            li.setAttribute('data-username', username);
            if (user.isBanned) li.setAttribute('data-is-banned', 'true');
            if (user.isAdmin) li.setAttribute('data-is-admin', 'true');

            const roleClass = user.isAdmin ? 'admin' : (user.isBanned ? 'banned' : '');

            li.innerHTML = `
                <img src="${user.avatar}" alt="Avatar ${username}" class="user-avatar">
                <div class="user-info">
                    <span class="user-name">${username.charAt(0).toUpperCase() + username.slice(1)}</span>
                    <span class="user-role ${roleClass}">${user.isAdmin ? 'Admin' : (user.isBanned ? 'Diblokir' : 'Pengguna Biasa')}</span>
                </div>
                <div class="admin-actions">
                    <button class="action-btn ban-user-btn ${user.isBanned ? 'hidden' : ''}" title="Ban Pengguna"><i class="fas fa-ban"></i></button>
                    <button class="action-btn unban-user-btn ${user.isBanned ? '' : 'hidden'}" title="Unban Pengguna"><i class="fas fa-check"></i></button>
                    <button class="action-btn set-admin-btn ${user.isAdmin ? 'hidden' : ''}" title="Jadikan Admin"><i class="fas fa-user-shield"></i></button>
                    <button class="action-btn remove-admin-btn ${user.isAdmin ? '' : 'hidden'}" title="Hapus Admin"><i class="fas fa-user"></i></button>
                </div>
            `;
            adminUserList.appendChild(li);

            // Add event listeners for admin actions
            li.querySelector('.ban-user-btn')?.addEventListener('click', () => toggleUserBan(username, true));
            li.querySelector('.unban-user-btn')?.addEventListener('click', () => toggleUserBan(username, false));
            li.querySelector('.set-admin-btn')?.addEventListener('click', () => toggleUserAdmin(username, true));
            li.querySelector('.remove-admin-btn')?.addEventListener('click', () => toggleUserAdmin(username, false));
        });
    }

    function toggleUserBan(username, shouldBan) {
        if (confirm(`Yakin ingin ${shouldBan ? 'memblokir' : 'membuka blokir'} akun ${username}?`)) {
            users[username].isBanned = shouldBan;
            alert(`Akun ${username} berhasil ${shouldBan ? 'diblokir' : 'dibuka blokir'}.`);
            populateAdminUserList(); // Refresh list to reflect changes
            populateGlobalUserList(); // Refresh user list to reflect ban status
        }
    }

    function toggleUserAdmin(username, shouldBeAdmin) {
        if (confirm(`Yakin ingin ${shouldBeAdmin ? 'menjadikan' : 'menghapus'} ${username} ${shouldBeAdmin ? 'sebagai admin' : 'dari admin'}?`)) {
            users[username].isAdmin = shouldBeAdmin;
            alert(`Akun ${username} berhasil ${shouldBeAdmin ? 'dijadikan admin' : 'dihapus dari admin'}.`);
            populateAdminUserList(); // Refresh list to reflect changes
            // If the current user's admin status changes, adjust visibility of admin-only elements
            if (username === currentUser) {
                if (shouldBeAdmin) {
                    adminOnlyElements.forEach(el => el.classList.remove('hidden'));
                } else {
                    adminOnlyElements.forEach(el => el.classList.add('hidden'));
                    // If current admin loses admin, redirect from admin panel
                    if (document.getElementById('adminPanel').classList.contains('active')) {
                        showMainContentView('chatView');
                    }
                }
            }
        }
    }

    document.getElementById('adminUserSearchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('#adminUserList .admin-user-item').forEach(item => {
            const username = item.getAttribute('data-username').toLowerCase();
            if (username.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });


    // --- Banned Modal Logic ---
    closeBannedModal.addEventListener('click', () => {
        bannedModal.classList.remove('active');
    });

    reviewBanBtn.addEventListener('click', () => {
        bannedModal.classList.remove('active');
        reviewBanModal.classList.add('active');
    });

    cancelReviewBtn.addEventListener('click', () => {
        reviewBanModal.classList.remove('active');
        reviewReasonInput.value = '';
    });

    submitReviewBtn.addEventListener('click', () => {
        const reason = reviewReasonInput.value.trim();
        if (reason.length < 20) {
            alert('Mohon berikan alasan yang lebih detail (minimal 20 karakter).');
            return;
        }
        showOverlay('Mengirim permohonan...');
        setTimeout(() => { // Simulate sending data to backend
            alert('Permohonan tinjauan Anda telah terkirim. Mohon tunggu konfirmasi dari admin.');
            reviewBanModal.classList.remove('active');
            reviewReasonInput.value = '';
            hideOverlay();
        }, 1500);
    });


    // --- Initial Load ---
    // Start with login page
    showPage('loginPage');

    // Select default chat when app loads for the first time after login
    // This will be called after a successful login
    // For initial load without login, this will be skipped
    // If you want a default selected chat after login, uncomment and adjust:
    // if (currentUser) {
    //     selectChat('anas'); // Select 'anas' by default if logged in
    // }
});