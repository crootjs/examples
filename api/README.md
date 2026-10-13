# RESTFull API Example

Swagger Documentation on Github Pages : [Demo](./swagger/) - [Source Code](https://github.com/crootjs/examples/tree/main/api/swagger)

## GET 

### From File

[Demo](./get/fromfile/) - [Source Code](https://github.com/crootjs/examples/tree/main/api/get/fromfile)

html file

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
  </head>
<body>


<table class="table">
  <tbody id="lokasi">
    <tr>
      <th>Type</th>
      <th>Nama</th>
      <th>Kordinat</th>
    </tr>
  </tbody>
</table>

<script type="module" src="./get.js"></script>

</body>
</html>
```

get.js

```js
import { getJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/api.min.js";
import {URLGeoJson,responseData} from "./getfunction.js";

getJSON(URLGeoJson,responseData);
```

getfunction.js

```js
import { addChild } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.min.js";

export let URLGeoJson = "./data.json";
export let tableTag="tr";
export let tableRowClass="content is-small";
export let tableTemplate=`
<td>#TYPE#</td>
<td>#NAME#</td>
<td>#KORDINAT#</td>
`

// getJSON memanggil callback dengan { status, data } — bukan body respons
// langsung — dan status 0 berarti request gagal total (offline/timeout).
export function responseData(response){
    if (response.status !== 200) {
        console.log("gagal mengambil data, status:", response.status);
        return;
    }
    console.log(response.data.features);
    response.data.features.forEach(isiRow);
}

export function isiRow(value){
    let content=tableTemplate.replace("#TYPE#",value.geometry.type).replace("#NAME#",value.properties.name).replace("#KORDINAT#",value.geometry.coordinates);
    console.log(content);
    addChild("lokasi",tableTag,tableRowClass,content);
}
```

### From Goocle Cloud Function

[Demo](./get/fromgcf/) - [Source Code](https://github.com/crootjs/examples/tree/main/api/get/fromgcf)

html

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
  </head>
<body>


<table class="table">
  <tbody id="lokasi">
    <tr>
      <th>Type</th>
      <th>Nama</th>
      <th>Kordinat</th>
    </tr>
  </tbody>
</table>

<script type="module" src="./get.js"></script>

</body>
</html>
```

get.js

```js
import { getJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/api.min.js";
import {URLGeoJson,responseData} from "./getfunction.js";

getJSON(URLGeoJson,responseData);
```

getfunction.js

```js
import { addChild } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.min.js";

export let URLGeoJson = "https://asia-southeast2-awangga.cloudfunctions.net/petapedia";
export let tableTag="tr";
export let tableRowClass="content is-small";
export let tableTemplate=`
<td>#TYPE#</td>
<td>#NAME#</td>
<td>#KORDINAT#</td>
`

// getJSON memanggil callback dengan { status, data } — bukan body respons
// langsung — dan status 0 berarti request gagal total (offline/timeout).
export function responseData(response){
    if (response.status !== 200) {
        console.log("gagal mengambil data, status:", response.status);
        return;
    }
    console.log(response.data);
    response.data.forEach(isiRow);
}

export function isiRow(value){
    let content=tableTemplate.replace("#TYPE#",value.geometry.type).replace("#NAME#",value.properties.name).replace("#KORDINAT#",value.geometry.coordinates);
    console.log(content);
    addChild("lokasi",tableTag,tableRowClass,content);
}
```

## POST
### Form Catch Response

[Demo](./post/toapi/) - [Source Code](https://github.com/crootjs/examples/tree/main/api/post/toapi)

html file
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
  </head>
<body>
    
  <div class="field">
        <label class="label" for="fname">First name:</label>
        <div class="control">
        <input class="input" type="text" id="fname" name="fname">
        </div>
</div>
<div class="field">
        <label class="label" for="lname">Last name:</label>
        <div class="control">
        <input class="input" type="text" id="lname" name="lname">
        </div>
</div>
<div class="field">
  <div class="control">
      <button class="button is-link is-light" type="submit" id="button">Submit</button>
    </div>
  </div>

  <div class="container">
     <div class="notification is-primary" id="pesan"></div>
    </div>

<script type="module" src="./post.js"></script>

</body>
</html>
```

post.js

```js
import { onClick } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.min.js";
import PostSignUp from "./postfunction.js";

onClick("button",PostSignUp);
```

postfunction.js

```js
import { setInner,getValue } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.min.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/api.min.js";

export default function PostSignUp(){
    let target_url = "https://eol0j1lmdtbpzp.m.pipedream.net";
    let tokenkey = "token";
    let tokenvalue = "8e87pod9d9a8fh9sfd87f9dhsf98dsf98sdf9ssd98f";
    let datainjson = {
        "namadepan": getValue("fname"),
        "namabelakang": getValue("lname")
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
    setInner("pesan",response.data.success);
}
```

### Login and Save Token to Cookies

[Demo](./post/togcf/) - [Source Code](https://github.com/crootjs/examples/tree/main/api/post/togcf)
![image](https://github.com/crootjs/examples/assets/11188109/c5c6c6c7-f012-4108-b369-23c0856c3520)

html file
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
  </head>
<body>
    
  <div class="field">
        <label class="label" for="username">Username:</label>
        <div class="control">
        <input class="input" type="text" id="username" name="username" value="petped">
        </div>
</div>
<div class="field">
        <label class="label" for="password">Password:</label>
        <div class="control">
        <input class="input" type="password" id="password" name="password" value="secret">
        </div>
</div>
<div class="field">
  <div class="control">
      <button class="button is-link is-light" type="submit" id="button">Submit</button>
    </div>
  </div>

  <div class="container">
     <div class="notification is-primary" id="pesan"></div>
    </div>

<script type="module" src="./post.js"></script>

</body>
</html>
```

post.js

```js
import { onClick } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.min.js";
import PostSignUp from "./postfunction.js";

onClick("button",PostSignUp);
```

postfunction.js
```js
import { setInner,getValue } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.min.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/api.min.js";
import { setCookieWithExpireHour } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/cookie.min.js";

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
```