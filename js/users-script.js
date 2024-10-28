document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;

    function loadUsers(page = 1, search = '') {
        $.ajax({
            url: `http://localhost/user_app/user_api.php?action=list&page=${page}&search=${search}`,
            type: 'GET',
            success: function(users) {
                $('#userTableBody').empty();
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
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error: ", status, error);
                console.log(xhr.responseText);
            }
        });
    }

    document.getElementById('loadMoreBtn').addEventListener('click', function() {
        currentPage++;
        loadUsers(currentPage, document.getElementById('searchInput').value);
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        loadUsers(1, this.value);
    });

    document.getElementById('newUserBtn').addEventListener('click', function() {
        $('#userForm')[0].reset();
        $('#userId').val('');
        $('#modalTitle').text('Agregar Usuario');
        $('#userModal').show();
    });

    document.getElementById('userTableBody').addEventListener('click', function(e) {
        if (e.target.classList.contains('editBtn')) {
            const userId = e.target.dataset.id;

            $.ajax({
                url: `http://localhost/user_app/user_api.php?action=get&id=${userId}`,
                type: 'GET',
                success: function(user) {
                    $('#userId').val(user.id);
                    $('#dni').val(user.dni);
                    $('#full_name').val(user.full_name);
                    $('#birth_date').val(user.birth_date);
                    $('#phone').val(user.phone);
                    $('#email').val(user.email);
                    $('#modalTitle').text('Modificar Usuario');
                    $('#userModal').show();
                },
                error: function(xhr, status, error) {
                    console.error("Error fetching user data: ", status, error);
                }
            });
        }
    });

    $('#userForm').on('submit', function(event) {
        event.preventDefault();

        const dni = $('#dni').val();
        const fullName = $('#full_name').val();
        const birthDate = $('#birth_date').val();

        if (!dni || !fullName || !birthDate) {
            alert('Los campos DNI, Nombre Completo y Fecha de Nacimiento son obligatorios.');
            return;
        }

        const formData = $(this).serialize();
        const action = $('#userId').val() ? 'update' : 'create';

        $.ajax({
            url: `http://localhost/user_app/user_api.php?action=${action}`,
            type: 'POST',
            data: formData,
            success: function(response) {
                loadUsers();
                $('#userModal').hide();
            },
            error: function(xhr, status, error) {
                console.error("Error creating/updating user: ", status, error);
                console.log(xhr.responseText);
            }
        });
    });

    document.getElementById('closeModal').addEventListener('click', function() {
        $('#userModal').hide();
    });

    loadUsers();
});

