$(document).ready(function() {

    // Grafika galéria tömb, ezt egy HTTP Get request tölti fel
    let grafika_gallery = []

    // HTTP Get request a node.js szervernek a "/get/gr/imgs" címre,
    // Ez a "../gallery/grafika/" mappában lévő jpg képek fájlneveit adja vissza
    // A callback funcion akkor fut le, ha már megérkezett a válasz.
    $.get("/get/gr/imgs", function(data){
        
        // Amennyi kép van, annyiszor fut le a ciklus, belepakolja a képeket a tömbbe.
        for (let i = 0; i < data.length; i++) {
            let filename = data[i];
            
            grafika_gallery.push(
                "../gallery/grafika/" + filename,
            );
            
        }

        // Amint feltöltöttük a galériát, a main funkció fut le.
        main();

    });

    // A teljes funkcionalitás.
    function main(){
            
            // Jelenlegi kép index
            let current_grafika_gallery = 0;

            // Jelenleg látszó frame ( három van belőle, melyek a sima előre-hátra transition-höz kellenek. )
            let current_grafika_frame = 2;
            
            // Galéria inicializálása
            updateGrafikaGallery(current_grafika_gallery, 'init');

            // ----------------------------
            // Galéria léptető function, paraméterek a jelenlegi kép indexe, illetve a lépés iránya
            // ----------------------------

            function updateGrafikaGallery(current, direction) {
                
                // Inicializáláshoz
                if(direction == 'init') {

                    // Ez mindig a 0. képet állítja az első láthatónak, és a tőle jobbra lépéshez beállítja az 1. képet.
                    $("#grafika-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + grafika_gallery[current] +")")});
                    $("#grafika-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + grafika_gallery[current+1] +")")});

                // Balra lépés
                } else if(direction == 'left') {

                    // Attól függően, hogy a három frame közül melyik látható, mást csinálunk.
                    switch (current_grafika_frame) {

                        case 1:

                            // Az első látható, úgyhogy a balra lépésnél a harmadik jön, felfedjük, az elsőt elrejtjük.
                            $("#grafika-gallery .gallery .gallery-frame .frame1").animate({opacity : 0}, 333);
                            $("#grafika-gallery .gallery .gallery-frame .frame3").animate({opacity : 1}, 333);

                            // Az új látható a hármas.
                            current_grafika_frame = 3;

                            // Mivel a hármas látható, a tőle balra lévő a kettes lesz, ez megkapja előre a megfelelő képet.
                            // A tőle jobbra lévő az egyes kép lesz, ez is előre tölti a képét.
                            if(current != 0){    
                                $("#grafika-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + grafika_gallery[current-1] +")")});
                            }    
                            $("#grafika-gallery .gallery .gallery-frame .frame1").css({"background-image" : ("url(" + grafika_gallery[current+1] +")")});
                            
                            break;
                            
                        case 2:

                            // Másodikat elrejtjük, balra az első van, felfedjük.
                            $("#grafika-gallery .gallery .gallery-frame .frame2").animate({opacity : 0}, 333);
                            $("#grafika-gallery .gallery .gallery-frame .frame1").animate({opacity : 1}, 333);

                            // Az első az új látható.
                            current_grafika_frame = 1;
                            
                            // Előre töltjük a két új, jelenleg nem látható szombszédot.
                            if(current != 0){    
                                $("#grafika-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + grafika_gallery[current-1] +")")});
                            }
                            $("#grafika-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + grafika_gallery[current+1] +")")});
                            
                            
                            break;
                            
                        case 3:
                            
                            // Harmadikat elrejtjük, balra az második van, felfedjük.
                            $("#grafika-gallery .gallery .gallery-frame .frame3").animate({opacity : 0}, 333);
                            $("#grafika-gallery .gallery .gallery-frame .frame2").animate({opacity : 1}, 333);

                            // A második az új látható.
                            current_grafika_frame = 2;

                            // Előre töltjük a két új, jelenleg nem látható szombszédot.
                            if(current != 0){
                                $("#grafika-gallery .gallery .gallery-frame .frame1").css({"background-image" : ("url(" + grafika_gallery[current-1] +")")});
                            }
                            $("#grafika-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + grafika_gallery[current+1] +")")});
                            
                            break;
                    
                        default:

                            // Ide nem szabadna eljutni, error
                            console.error("Current frame out of range [1-3] ?!");
                            break;

                    }

                // Jobbra léptetés
                // lsd. balra
                } else if (direction == 'right') {

                    switch (current_grafika_frame) {

                        case 1:

                            $("#grafika-gallery .gallery .gallery-frame .frame1").animate({opacity : 0}, 333);
                            $("#grafika-gallery .gallery .gallery-frame .frame2").animate({opacity : 1}, 333);

                            current_grafika_frame = 2;

                            $("#grafika-gallery .gallery .gallery-frame .frame1").css({"background-image" : ("url(" + grafika_gallery[current-1] +")")});
                            if(current != grafika_gallery.length - 1){    
                                $("#grafika-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + grafika_gallery[current+1] +")")});
                            }    
                            break;
                            
                        case 2:

                            $("#grafika-gallery .gallery .gallery-frame .frame2").animate({opacity : 0}, 333);
                            $("#grafika-gallery .gallery .gallery-frame .frame3").animate({opacity : 1}, 333);
                            
                            current_grafika_frame = 3;

                            $("#grafika-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + grafika_gallery[current-1] +")")});
                            if(current != grafika_gallery.length - 1){
                                $("#grafika-gallery .gallery .gallery-frame .frame1").css({"background-image" : ("url(" + grafika_gallery[current+1] +")")});
                            }    
                            
                            break;
                            
                        case 3:

                            $("#grafika-gallery .gallery .gallery-frame .frame3").animate({opacity : 0}, 333);
                            $("#grafika-gallery .gallery .gallery-frame .frame1").animate({opacity : 1}, 333);

                            current_grafika_frame = 1;

                            $("#grafika-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + grafika_gallery[current-1] +")")});
                            if(current != grafika_gallery.length - 1){    
                                $("#grafika-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + grafika_gallery[current+1] +")")});
                            }
                            
                            break;
                    
                        default:

                            console.error("Current frame out of range [1-3] ?!");
                            break;

                    }


                } else {

                    // Ha a direction nem "init", "left" vagy "right", akkor error
                    console.error("Wrong direction provided at updateGrafikaGallery: " + direction);

                }

            }


            // Grafika galéria balra
            $("#grafika-gallery .gallery .gallery-left").click(function(e){

                e.preventDefault();
                
                //Ha a 0. képnél vagyunk, akkor nincs balra semmi, nem lépünk tovább
                if(current_grafika_gallery == 0) {

                    shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),"left");

                // Ha nem a 0. képnél vagyunk, akkor van mit mutatni, csökkentjük a jelenlegi indexet eggyel,
                // majd frissítjük vele a galériát.
                } else {

                    updateGrafikaGallery(--current_grafika_gallery, 'left');

                }

            });

            // Grafika galéria jobbra
            $("#grafika-gallery .gallery .gallery-right").click(function(e){

                e.preventDefault();

                // Ha az utolsó képnél vagyunk, nincs semmi jobbra.
                if(current_grafika_gallery == grafika_gallery.length - 1) {

                    shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),"right");

                // Ha nem az utolsónál vagyunk, van jobbra még kép, megnöveljük eggyel az indexet,
                // és frissítjük a galériát.
                } else {

                    updateGrafikaGallery(++current_grafika_gallery, 'right');

                }

            });


            // ----------------------------
            // Galéria touch léptetés
            // ----------------------------
            
            // Szükséges változók
            let start_touch;
            let startX;
            let end_touch;
            let endX;

            // Amikor hozzáér a képhez, eltároljuk az X koordinátát.
            $("#grafika-gallery .gallery .gallery-frame").on("touchstart", function (start_e) {

                start_touch = start_e.touches[0];
                startX = start_touch.clientX;

            });

            // Amikor véget ér a touch, megnézzük, hogy kell e léptetni.
            $("#grafika-gallery .gallery .gallery-frame").on("touchend", function (end_e) {

                // Eltároljuk a végpont X koordinátáját
                end_touch = end_e.changedTouches[0];
                endX = end_touch.clientX;

                // Ha a start 50 pixellel nagyobb, akkor jobb swipe történt
                if(startX > endX + 50) {
                    
                    // lsd. jobb gomb
                    if(current_grafika_gallery == grafika_gallery.length - 1) {

                        shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),"right");

                    } else {

                        updateGrafikaGallery(++current_grafika_gallery, 'right');

                    }

                // Ha az end 50-nel nagyobb, akkor bal swipe történt.
                } else if(startX + 50 < endX) {
                    
                    // lsd. bal gomb
                    if(current_grafika_gallery == 0) {

                        shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),"left");
                        
                    } else {

                        updateGrafikaGallery(--current_grafika_gallery, 'left');

                    }
                    
                // Ha a swipe kisebb mint 50 pixel, akkor nem teszünk semmit
                // Ez a buffer a fel-le görgetés miatt szükséges, ha nem lenne
                // akkor a fel-le görgetésnél is váltana a kép.
                } else {

                    // console.log("Kicsi swipe!");

                }

        });

    }
    

    // Animáció funkció. Egy html elemet és egy irányt kell neki átadni.
    function shakeElement(element, direction) {

        // Ha jobbra akarjuk megrázni
        if(direction == "right") {

            // 15 pixellel jobbra toljuk, amint az végzett, visszahúzzuk,
            // majd a .css funkcióval levesszük a right : 0 style-t.
            // Ha ezt nem tesszük meg, új animáció esetén nem megfelelő a működés.
            // A szám érték (alapesetben 100) az animáció sebessége ms-ben.
            $(element).animate({"right" : '15px'}, 100, function(){
                $(element).animate({"right" : ""}, 100, function(){
                    $(element).css({"right" : ""});
                });
            });

        // Bal esetén ugyan az, csak baloldali irányba.
        } else if( direction == "left") {

            $(element).animate({"left" : '15px'}, 100, function(){
                $(element).animate({"left" : ""}, 100, function(){
                    $(element).css({"left" : ""});
                });
            });

        // Ha nem megfelelő az irány (left vagy right) error-t logolunk, az animáció pedig nem fut le.
        } else {
            console.error("direction must be \"left\" or \"right\".");
        }
        
    }

});
