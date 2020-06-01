$(document).ready(function() {

    // -----------------------------------
    // A visszajelzések háttérképét váltó funkcionalitás
    // Itt két cover div css-background-ját változtatjuk
    // Mindig csak az egyik látszik, míg a másik betölti a következő képet.
    // -----------------------------------

    // Ebbe a tömbbe kerülnek a visszajelzés objektumok, melyek
    // {
    //     img: "/elérési/ót/fajl.jpg",
    //     desc: "leírás"
    // }
    // formátumban kell lenniük.
    let vj_images = [];

    // Először lekérjük a visszajelzés szövegeket egy .json fájlból,
    // ha ez megérkezett, HTTP Get requesttel kérjük a képek elérési útját.
    // A json fájlban a kép nevével egyező key-hez adjuk hozzá a leírást.
    $.getJSON("../img/vj_cover/visszajel_text.json", function(json){

        // fájlneveket tartalmazó tömböt ad tovább
        $.get("/get/vj/imgs", function(data){
            
            // Végigmegyünk a válasz tömbön
            for (let i = 0; i < data.length; i++) {
                // eltároljuk a fájlnevet
                let filename = data[i];
                
                // Az eredeti tömbünkbe belerakjuk az összerakott objektumot
                vj_images.push(
                    {
                        img : "../img/vj_cover/" + filename,
                        desc : json[filename]
                    }
                );
                
            }

            // a tömb feltöltése után lefuttatjuk a main függvényt.
            main();

        });

    });


    function main() {

        // __VÁLTOZTATHATÓ__ Az időintervallum millisecundumban
        let vj_delay = 5000;

        // __VÁLTOZTATHATÓ__ Animációsebesség
        let vj_change_speed = 333;

        // kép indexek a két cover-nek.
        // mindig kettővel nőnek, és átfordulnak az elejére, ha túllépték a képmennyiséget.
        let vj_cover1 = 0;
        let vj_cover2 = 1;

        // a jelenleg látható cover és szöveg
        let vj_current = 1;
        let vj_current_text = 1;
        
        // incializálás
        $("#vj-cover1").css({"background-image" : ("url(" + vj_images[vj_cover1].img +")")});
        $("#vj-cover2").css({"background-image" : ("url(" + vj_images[vj_cover2].img +")")});
        $("#visszajelzesek-idezet").text(vj_images[0].desc); 


        
        // Adott intervallum(vj_delay - a tömb végén) után vált egyet a képen
        setInterval( () => {

            // Az aktuálisan látszó cover alapján cseréli a kettőt, megnöveli a frissen
            // eltüntetett cover kép-indexét kettővel
            if(vj_current == 1) {

                $("#vj-cover1").animate({opacity : 0}, vj_change_speed);
                $("#vj-cover2").animate({opacity : 1}, vj_change_speed);
                vj_cover1 += 2;
                vj_current = 2;

            } else {

                $("#vj-cover2").animate({opacity : 0}, vj_change_speed);
                $("#vj-cover1").animate({opacity : 1}, vj_change_speed);
                vj_cover2 += 2;
                vj_current = 1;

            }

            // Ha valamelyik index nagyobb a képek mennyiségénél,
            // akkor  visszamegy az elejére az első vagy második képre
            if(vj_cover1 >= vj_images.length) {
                vj_cover1 = vj_cover1 - vj_images.length;
            }

            if(vj_cover2 >= vj_images.length) {
                vj_cover2 = vj_cover2 - vj_images.length;
            }

            // Miután megvolt az animáció az első if tömbben, megváltoztatjuk a képeket.
            setTimeout(function(){

                $("#vj-cover1").css({"background-image" : ("url(" + vj_images[vj_cover1].img +")")});
                $("#vj-cover2").css({"background-image" : ("url(" + vj_images[vj_cover2].img +")")});

            },vj_change_speed);

            // Aktív képhez tartozó szöveg beállítása
            $("#visszajelzesek-idezet").text(vj_images[vj_current_text].desc); 

            // Megnöveljük utána eggyel.
            vj_current_text += 1;

            // Ha túlmegyünk az indexxel a tömb méretén, akkor visszaállunk az elejére.
            if(vj_current_text == vj_images.length) {
                vj_current_text = vj_current_text - vj_images.length;
            }

        }, vj_delay);
    }


});