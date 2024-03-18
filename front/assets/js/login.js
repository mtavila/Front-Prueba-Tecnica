if(localStorage.getItem('token')) {
    window.location.href = 'dashboard.html';
}

document.getElementById('formLogin').addEventListener('submit', function(event) {
    event.preventDefault();
    // const formData = new FormData(document.getElementById('formLogin'));
    $(".btn-login").attr("disabled", true);
    const parametros = {
        email: document.getElementById('txtEmail').value,
        password: document.getElementById('txtPassword').value
    };
    // Construir la URL con los parámetros
    const url = new URL('http://apirest-creasoft.test:82/api/login');
    url.search = new URLSearchParams(parametros).toString();

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            // Puedes incluir otros encabezados si es necesario
        },
    })
    .then(response => {
        if (!response.ok) {
            $(".btn-login").attr("disabled", true);
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        // Manejar la respuesta de la API
        console.log(data.status);
        $(".btn-login").attr("disabled", false);
        if(data.status == true)
        {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html'; 
        }
        else if(data.code == '422')
        {
            let errors = data.errors;
            let promocionValidation = '';

            $.each(errors, function(index, value) {

                if (typeof value !== 'undefined' || typeof value !== "") 
                {
                    promocionValidation += '<li>' + value + '</li>';
                }

            }); 

            Swal.fire({
                icon: 'error',
                title: 'ERROR...',
                html: '<ul>'+
                promocionValidation  + 
                        '</ul>'
            });
        }
        else if(data.status == false)
        {
            Swal.fire({
                icon: 'error',
                title: 'ERROR...',
                html: data.message
            });
        }
    })
    .catch(error => {
        $(".btn-login").attr("disabled", true);
        console.error('Hubo un problema con la solicitud:', error);
    });
});
