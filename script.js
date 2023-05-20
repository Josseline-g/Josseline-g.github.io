// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'
import {getDatabase, ref, onValue, update, push,child}  from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDLeSf7rNtsKLMsxtQnMKIhCZmlfTB8K0o",
    authDomain: "chatdepaginaintro.firebaseapp.com",
    projectId: "chatdepaginaintro",
    storageBucket: "chatdepaginaintro.appspot.com",
    messagingSenderId: "481881588416",
    appId: "1:481881588416:web:93f7152e3d1f4171376325",
    measurementId: "G-LEBXKB8CHW"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  var btnIniciar = document.getElementById('btnIniciar');
  var btnCerrar = document.getElementById('btnCerrar');
  var nombreUsuario = document.getElementById('nombreUsuario')
  var textoMensaje = document.getElementById('textoMensaje')
  var usuarioConectado = ""
  var Chat = document.getElementById('Chat');

  btnIniciar.onclick = async function (){
    var auth = getAuth();
    var provider = new GoogleAuthProvider();
    auth.languageCode = 'es';
    var response = await signInWithPopup(auth, provider);
    nombreUsuario.innerText = response.user.email;
    escucharYDibujarMensajes ();
    usuarioConectado = response.user.email;
    btnIniciar.style.display = "none";
    btnCerrar.style.display = "flex";
  }

  btnCerrar.onclick = async function(){
    var auth = getAuth();
    await auth.signOut();
    btnIniciar.style.display = "flex";
    btnCerrar.style.display = "none";
    nombreUsuario.innerText = "No autenticado";
    usuarioConectado = "";
  }

  textoMensaje.onkeydown = async function (evento){
    if (evento.key == "Enter"){
        if (usuarioConectado == ""){
            alert("Debes de haber iniciado sesion primero para escribir")
            return;
        }
        var db = getDatabase()
        var referenciaAMensajes = ref(db, 'Mensajes');
        var nuevaLlave = push(child(ref(db),'Mensajes')).key;
        var nuevosDatos = {
            [nuevaLlave]: {
                usuario: usuarioConectado,
                mensaje: textoMensaje.value,
                fecha: new Date().toLocaleDateString
            }
        }
        textoMensaje.value="";
        await update(referenciaAMensajes, nuevosDatos);
    }
  }

  function escucharYDibujarMensajes (){
      //referencia a base de datos firebase
      var db = getDatabase();
      var referenciaAMensajes = ref(db, "Mensajes");
      onValue(referenciaAMensajes, function(datos){
         var valoresObtenidos = datos.val();
         //console.log(valoresObtenidos)
         Chat.innerHTML = "";
         Object.keys(valoresObtenidos).forEach(llave=>{
            var mensajeDescargado = valoresObtenidos[llave];
            var mensaje = "";
            mensaje += "<div class='nombre-usuario'>"+ mensajeDescargado.usuario + "</div>";
            mensaje += "<div class='mensaje-chat'>"+ mensajeDescargado.mensaje + "</div>";
            mensaje += "<div>"+ mensajeDescargado.fecha + "</div><hr>";
            Chat.innerHTML += mensaje;
          })
    })
  }
