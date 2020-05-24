$(document).ready(function() {
    
    // -----------------------------------
    // A landing page háttérképét váltó funkcionalitás
    // Itt két cover div css-background-ját változtatjuk
    // Mindig csak az egyik látszik, míg a másik betölti a következő képet.
    // -----------------------------------

    let fo_images = [];

    $.get("/get/fo/imgs", function(data){
        
        for (let i = 0; i < data.length; i++) {
            let filename = data[i];
            
            fo_images.push(
                "../img/fo_cover/" + filename,
            );
            
        }

        main();

    });

    function main(){
        // __VÁLTOZTATHATÓ__ Az időintervallum millisecundumban
        let delay = 5000;

        // __VÁLTOZTATHATÓ__ Animációsebesség
        let change_speed = 333;

        // kép indexek a két cover-nek.
        // mindig kettővel nőnek, és átfordulnak az elejére, ha túllépték a képmennyiséget.
        let cover1 = 0;
        let cover2 = 1;

        // a jelenleg látható cover
        let current = 1;
        
        // Inicializálás
        $("#cover1").css({"background-image" : ("url(" + fo_images[cover1] +")")});
        $("#cover2").css({"background-image" : ("url(" + fo_images[cover2] +")")});

        // Adott intervallum(delay - a tömb végén) után vált egyet a képen
        setInterval( () => {

            // Az aktuálisan látszó cover alapján cseréli a kettőt, megnöveli a frissen
            // eltüntetett cover kép-indexét kettővel
            if(current == 1) {

                $("#cover1").animate({opacity : 0}, change_speed);
                $("#cover2").animate({opacity : 1}, change_speed);
                cover1 += 2;
                current = 2;

            } else {

                $("#cover2").animate({opacity : 0}, change_speed);
                $("#cover1").animate({opacity : 1}, change_speed);
                cover2 += 2;
                current = 1;

            }

            // Ha valamelyik index nagyobb a képek mennyiségénél,
            // akkor  visszamegy az elejére az első vagy második képre
            if(cover1 >= fo_images.length) {
                cover1 = cover1 - fo_images.length;
            }

            if(cover2 >= fo_images.length) {
                cover2 = cover2 - fo_images.length;
            }

            // Miután megvolt az animáció az első if tömbben, megváltoztatjuk a képeket.
            setTimeout(function(){
                $("#cover1").css({"background-image" : ("url(" + fo_images[cover1] +")")});
                $("#cover2").css({"background-image" : ("url(" + fo_images[cover2] +")")});
            },change_speed);

        }, delay);
    }

});
