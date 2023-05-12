/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:8080/contacto"
      })
        .done(function( msg ) {
          console.log( "Data Saved: ", msg.contactos );
          contactosList = msg.contactos;
          contactosList.forEach(element => {
            console.log(element);
            $("#contactosList tbody").append('<tr><td>'+element.nombres+'</td><td>'+element.apellidos+'</td><td>'+element.telefono+'</td><td>'+element.correo+'</td><td><a href="#" onclick="eliminarContacto('+element.id_contacto+')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16"><path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/></svg></a><a href="#" onclick="editarContacto('+element.id_contacto+')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></a></td></tr>');
          });
          
        });
}

function eliminarContacto(id){
    console.log("eliminando");
    $.confirm({
        title: 'Eliminar',
        content: '¿Realmente deseas eliminar el contacto?',
        type: 'red',
        typeAnimated: true,
        buttons: {
            confirm: {
                text: 'Eliminar',
                btnClass: 'btn-red',
                action: function(){
                    $.post("http://127.0.0.1:8080/contacto/"+id, 
                        {"arg1":"value1",
                        "_method":"delete"},function(data){
                            // Do something with the result
                            $.alert({
                                title: 'Eliminado',
                                content: 'El contacto se a eliminado!',
                                buttons: {
                                    ok: function(){
                                        window.location.reload();
                                    }
                                }
                            });
                        }); 
                }
            },
            close: {
                text: 'Cerrar',
                action: function(){
                }
            }
        }
    });
}

function editarContacto(id){
    console.log("editando",id);
    $.ajax({
        method: "GET",
        url: "http://127.0.0.1:8080/contacto/"+id
    })
    .done(function( msg ) {
        console.log(msg);
        $("#nombres").val(msg.nombres);
        $("#apellidos").val(msg.apellidos);
        $("#telefono").val(msg.telefono);
        $("#correo").val(msg.correo);
        $("#id_Contacto").val(id);
    });
    $("#agregarContactoModal").modal("show");
}
function agregarContacto(){
    console.log("agregando");
    $("#nombres").val("");
        $("#apellidos").val("");
        $("#telefono").val("");
        $("#correo").val("");
    $("#agregarContactoModal").modal("show");
}

$("#guardarContacto").click(function(){
    console.log("boton guarda",$("#id_Contacto").val());
    if(!$("#formContacto #id_Contacto").val()){
        console.log("boton agrega");
        $.ajax({
            method: "POST",
            url: "http://127.0.0.1:8080/contacto",
            data: {
                nombres: $("#nombres").val(),
                apellidos: $("#apellidos").val(),
                telefono: $("#telefono").val(),
                correo: $("#correo").val()
            }
          })
            .done(function( msg ) {
              console.log( "Data Saved: ", msg.contactos );
              $.alert({
                title: 'Agregaro',
                content: 'El contacto se a agregado!',
                buttons: {
                    ok: function(){
                        window.location.reload();
                    }
                }
            });
              
            });
    }
    else{
        console.log("boton actualiza");
        $.post("http://127.0.0.1:8080/contacto/"+$("#id_Contacto").val(), 
        {"nombres": $("#nombres").val(),
        "apellidos": $("#apellidos").val(),
        "telefono": $("#telefono").val(),
        "correo": $("#correo").val(),
        "arg1":"value1",
        "_method":"put"},
        function(data){
            // Do something with the result
            $.alert({
                title: 'Actualizado',
                content: 'El contacto se a actualizado!',
                buttons: {
                    ok: function(){
                        window.location.reload();
                    }
                }
            });
        }); 
    }
});
