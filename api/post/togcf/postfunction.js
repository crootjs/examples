import { setInner,getValue } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.17/element.min.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.17/api.min.js";
import { setCookieWithExpireHour } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.17/cookie.min.js";

export default function PostSignUp(){
    let target_url = "https://asia-southeast2-awangga.cloudfunctions.net/petapedia-post";
    let tokenkey = "token";
    let tokenvalue = "8e87pod9d9a8fh9sfd87f9dhsf98dsf98sdf9ssd98f";
    let datainjson = {
        "username": getValue("username"),
        "password": getValue("password")
    }

    // Token pindah ke dua argumen terakhir: postJSON(url, data, callback, tokenkey, tokenvalue).
    postJSON(target_url,datainjson,responseData,tokenkey,tokenvalue);

}



function responseData(response){
    // status 0 = request gagal total (offline, DNS gagal, CORS ditolak, timeout 15 detik).
    if (response.status === 0) {
        setInner("pesan","Request gagal, cek koneksi atau server sedang down.");
        return;
    }
    setInner("pesan",response.data.message);
    setCookieWithExpireHour("token",response.data.token,2);
}
