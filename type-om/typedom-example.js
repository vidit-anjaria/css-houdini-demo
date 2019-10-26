///let element = document.getElementsByClassName('square');

function withOutTypeom() {
    let then1 = performance.now();
    let element = document.getElementsByClassName('square');
    for (var i = 0; i < element.length; i++) {
        let opacity_conversion = parseFloat(getComputedStyle(element[i]).opacity);
        element[i].style.opacity = opacity_conversion + 0.2;
    }
    let now1 = performance.now();
    console.log('Time taken witout TypedOm -- ', now1 - then1 + 'ms');
}
// nohoudini(s);

function withTypeom() {
    let then2 = performance.now();
    let element = document.getElementsByClassName('square');
    for (var i = 0; i < element.length; i++) {
        let opacity_conversion = element[i].computedStyleMap().get('opacity').value;
        element[i].style.opacity = opacity_conversion + 0.2;
    }
    let now2 = performance.now();
    console.log('Time taken using TypedOm -- ', now2 - then2 + 'ms');
} 
