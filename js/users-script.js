$(document).ready(function() {
    let currentPage = 1;

    function loadUsers(page = 1, search = '') {
        $.ajax({
            url: 'user_api.php?action=list',
            type: 'GET',
            data: { page, search },
            success: function(data) {
                const users = JSON.parse(data);
                users.forEach(user => {
                    $('#userTableBody').append(`
                        <tr>
                            <td>${user.dni}</td>
                            <td>${user.full_name}</td>
                            <td>${user.birth_date}</td>
                            <td>${user.phone}</td>
                            <td>${user.email}</td>
                            <td><button class="editBtn" data-id="${user.id}">Editar</button></td>
                        </tr>
                    `);
                });
            }
        });
    }

    $('#loadMoreBtn').click(function() {
        currentPage++;
        loadUsers(currentPage, $('#searchInput').val());
    });

    $('#searchInput').on('input', function() {
        $('#userTableBody').html('');
        loadUsers(1, $(this).val());
    });

    $('#newUserBtn').click(function() {
        // Mostrar formulario para nuevo usuario
    });

    $('#userTableBody').on('click', '.editBtn', function() {
        const userId = $(this).data('id');
        // Mostrar datos del usuario en el formulario para editar
    });

    loadUsers();
});
