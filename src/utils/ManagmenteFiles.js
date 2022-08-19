/* 
    ====================   M A N A G M E N T E   F I L E S =============================
*/

export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

//Usage example:
var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=', 'hello.txt');
console.log(file);