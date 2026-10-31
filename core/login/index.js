import {setCookieWithExpireHour,getCookie} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/cookie.min.js";
import {onClick,getValue,addCSS} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/element.min.js";
import {postJSON,getJSON} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/api.min.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/url.min.js";

//start import Sweet Alert
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';
await addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");
//end sweet alert import

//config param
const urlBackend = "https://n-pts-yang-contamination.trycloudflare.com";


onClick("submit",PostSignIn);

function PostSignIn(){
    let datainjson = {
        "username": getValue("username"),
        "password": getValue("password")
    }
    postJSON(urlBackend+"/login",datainjson,responseFunction);
}

function responseFunction(result){
    console.log(result);
    if (result.status === 200) {
        setCookieWithExpireHour("token",result.data.token,2);
        let tokenValue=getCookie("token");
        getJSON(urlBackend+"/login", runafterGetUsername, "Token",tokenValue);
    } else {
        Swal.fire(result.data.status, result.data.message, 'warning');//success,warning,info,question
    }
}

async function runafterGetUsername(result){
    console.log(result);
    const swalResult = await Swal.fire(result.data.status, result.data.message + " : "+result.data.username, 'success');//success,warning,info,question
    if (swalResult.isConfirmed) {
        // Aksi setelah user menekan OK
        redirect("./dashboard");
    }
}
