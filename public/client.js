const socket = io();
const input = document.getElementById('webserver-name');
const list = document.getElementById('file-upload');
const form = document.getElementById('form-upload');

socket.on('confirm', (data)=>{
    console.log(data);
    list.style.display = 'flex';
})

input.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter'){
        console.log(input.value);
        socket.emit('server-name', input.value);
    }
});

form.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const formdata = new FormData();
    const fileinput = document.getElementById('fileinput');
    formdata.append('file',fileinput.files[0]);
    try {
        const response = await fetch('/upload',{
            method: 'POST',
            body: formdata
        });
        const result = await response.text();
        console.log(result);
    }catch(error){
        console.log(`Error : ${error}`);
    }
})


