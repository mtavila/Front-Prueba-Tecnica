function valideKey(evt){
    
    // code is the decimal ASCII representation of the pressed key.
    var code = (evt.which) ? evt.which : evt.keyCode;
    
    if(code==8) { // backspace.
      return true;
    } else if(code>=48 && code<=57) { // is a number.
      return true;
    } else{ // other keys.
      return false;
    }
}

document.getElementById('formPromocion').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('formPromocion'));
    $(".form-btn").attr("disabled", true);
    fetch('http://apirest-creasoft.test:82/api/promociones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Puedes incluir otros encabezados si es necesario
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
    })
    .then(response => {
        if (!response.ok) {
            $(".form-btn").attr("disabled", true);
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        // Manejar la respuesta de la API
        console.log(data.status);
        $(".form-btn").attr("disabled", false);
        if(data.status == 'success')
        {
            document.getElementById('celular').value="";
            document.getElementById('dni').value="";
            document.getElementById('chkterminosPromocion').checked = false;
            Swal.fire({
                icon: 'success',
                title: 'ÉXITO!',
                text: 'Se han registrado sus Datos correctamente, pronto nos contactaremos con usted'
            });
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
    })
    .catch(error => {
        $(".form-btn").attr("disabled", true);
        console.error('Hubo un problema con la solicitud:', error);
    });
});

