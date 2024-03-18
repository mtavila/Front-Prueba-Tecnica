  // Verificar si el usuario está autenticado
  if (!localStorage.getItem('token')) {
    // Redirigir al usuario al inicio de sesión
    window.location.href = 'login.html';
}

obtenerDatosPerfil();
ObtenerListadoPromociones();

function obtenerDatosPerfil()
{
    const token = localStorage.getItem('token');

    fetch('http://apirest-creasoft.test:82/api/profile', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        $('#usuario').html(data.user.name);
    })
    .catch(error => {

        console.error('Hubo un problema con la solicitud:', error);
    });
}

function ObtenerListadoPromociones()
{
    const token = localStorage.getItem('token');

    fetch('http://apirest-creasoft.test:82/api/listadopromociones', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
       
        let html='';
        let i = 0;
        Object.keys(data).forEach(function(key) {
          i++;
          html += '<tr><td>'+i+'</td><td>'+data[key].dni+'</td><td>'+data[key].celular+'</td><tr>';
        });
         $('.table-promociones tbody').append(html);

    })
    .catch(error => {

        console.error('Hubo un problema con la solicitud:', error);
    });
}

document.getElementById('logout_btn').addEventListener('click', function(e) {
    const token = localStorage.getItem('token');
    Swal.fire({
        icon: 'warning',
        title: 'Está seguro de cerrar la Sesión?',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonColor: "#EB1010",
        confirmButtonText: `Sí, Cerrar Sesión`,
        cancelButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://apirest-creasoft.test:82/api/logout', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la solicitud');
                    }
                    return response.json();
                })
                .then(data => {
                    // Manejar la respuesta de la API
                   if(data.status == true)
                   {
                        localStorage.removeItem('token');
                        window.location.href = 'login.html';
                   }
                })
                .catch(error => {
            
                    console.error('Hubo un problema con la solicitud:', error);
                });
            }
        })
});

document.getElementById('btn-pdf').addEventListener('click', function(e) {
    const token = localStorage.getItem('token');
    fetch('http://apirest-creasoft.test:82/api/reporte_pdf', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
    .then(response => response.blob())
    .then(blob => {
        // Crea un objeto URL para el Blob
        const url = window.URL.createObjectURL(blob);

        // Abre una nueva ventana y carga el PDF en ella
        window.open(url, '_blank');

        // Libera el objeto URL
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error al exportar el PDF:', error));
});