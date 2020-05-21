$(document).ready(function() {

    let dekor_gallery = [

        {
            img : "../gallery/eskuvok/norbi-dia/img/thumbnail.jpg",
            link : "/gallery?norbi-dia",
            text : "Norbi & Dia"
        },
        {
            img : "../gallery/eskuvok/kati-pisti/img/01.jpg",
            link : "/gallery?kati-pisti",
            text : "Kati & Pisti"
        }

    ]

    
    // Jelenlegi kép index
    let current_dekor_gallery = 0;

    // Jelenleg látszó frame ( három van belőle, melyek a sima előre-hátra transition-höz kellenek. )
    let current_dekor_frame = 2;

    // Galéria inicializálása
    updateDekorGallery(current_dekor_gallery, 'init');


    function updateDekorGallery(current, direction) {
        
        $("#dekoracio-gallery .gallery .gallery-frame p").text(dekor_gallery[current].text);
        $("#dekoracio-gallery .gallery .gallery-frame a").attr({'href' : dekor_gallery[current].link});

        // Inicializáláshoz
        if(direction == 'init') {

            // Ez mindig a 0. képet állítja az első láthatónak, és a tőle jobbra lépéshez beállítja az 1. képet.
            $("#dekoracio-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + dekor_gallery[current].img +")")});
            $("#dekoracio-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});

        // Balra lépés
        } else if(direction == 'left') {

            // Attól függően, hogy a három frame közül melyik látható, mást csinálunk.
            switch (current_dekor_frame) {

                case 1:

                    // Az első látható, úgyhogy a balra lépésnél a harmadik jön, felfedjük, az elsőt elrejtjük.
                    $("#dekoracio-gallery .gallery .gallery-frame .frame1").animate({opacity : 0}, 333);
                    $("#dekoracio-gallery .gallery .gallery-frame .frame3").animate({opacity : 1}, 333);

                    // Az új látható a hármas.
                    current_dekor_frame = 3;

                    // Mivel a hármas látható, a tőle balra lévő a kettes lesz, ez megkapja előre a megfelelő képet.
                    // A tőle jobbra lévő az egyes kép lesz, ez is előre tölti a képét.
                    if(current != 0){    
                        $("#dekoracio-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                    }
                    $("#dekoracio-gallery .gallery .gallery-frame .frame1").css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                    
                    break;
                    
                case 2:

                    // Másodikat elrejtjük, balra az első van, felfedjük.
                    $("#dekoracio-gallery .gallery .gallery-frame .frame2").animate({opacity : 0}, 333);
                    $("#dekoracio-gallery .gallery .gallery-frame .frame1").animate({opacity : 1}, 333);

                    // Az első az új látható.
                    current_dekor_frame = 1;
                    
                    // Előre töltjük a két új, jelenleg nem látható szombszédot.
                    if(current != 0){
                        $("#dekoracio-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                    }    
                    $("#dekoracio-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                    
                    
                    break;
                    
                case 3:
                    
                    // Harmadikat elrejtjük, balra az második van, felfedjük.
                    $("#dekoracio-gallery .gallery .gallery-frame .frame3").animate({opacity : 0}, 333);
                    $("#dekoracio-gallery .gallery .gallery-frame .frame2").animate({opacity : 1}, 333);

                    // A második az új látható.
                    current_dekor_frame = 2;

                    // Előre töltjük a két új, jelenleg nem látható szombszédot.
                    if(current != 0){
                        $("#dekoracio-gallery .gallery .gallery-frame .frame1").css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                    }    
                    $("#dekoracio-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                    
                    break;
            
                default:

                    // Ide nem szabadna eljutni, error
                    console.error("Current frame out of range [1-3] ?!");
                    break;

            }

        // Jobbra léptetés
        // lsd. balra
        } else if (direction == 'right') {

            switch (current_dekor_frame) {

                case 1:

                    $("#dekoracio-gallery .gallery .gallery-frame .frame1").animate({opacity : 0}, 333);
                    $("#dekoracio-gallery .gallery .gallery-frame .frame2").animate({opacity : 1}, 333);

                    current_dekor_frame = 2;

                    $("#dekoracio-gallery .gallery .gallery-frame .frame1").css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                    if(current != dekor_gallery.length - 1){    
                        $("#dekoracio-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                    }    
                    break;
                    
                case 2:

                    $("#dekoracio-gallery .gallery .gallery-frame .frame2").animate({opacity : 0}, 333);
                    $("#dekoracio-gallery .gallery .gallery-frame .frame3").animate({opacity : 1}, 333);
                    
                    current_dekor_frame = 3;

                    $("#dekoracio-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                    if(current != dekor_gallery.length - 1){    
                        $("#dekoracio-gallery .gallery .gallery-frame .frame1").css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                    }
                    
                    break;
                    
                case 3:

                    $("#dekoracio-gallery .gallery .gallery-frame .frame3").animate({opacity : 0}, 333);
                    $("#dekoracio-gallery .gallery .gallery-frame .frame1").animate({opacity : 1}, 333);

                    current_dekor_frame = 1;

                    $("#dekoracio-gallery .gallery .gallery-frame .frame3").css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                    if(current != dekor_gallery.length - 1){
                        $("#dekoracio-gallery .gallery .gallery-frame .frame2").css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                    }    
                    
                    break;
            
                default:

                    console.error("Current frame out of range [1-3] ?!");
                    break;

            }


        } else {

            // Ha a direction nem "init", "left" vagy "right", akkor error
            console.error("Wrong direction provided at updateDekorGallery: " + direction);

        }


    }


    // Dekor galéria balra
    $("#dekoracio-gallery .gallery .gallery-left").click(function(e){

        e.preventDefault();
        
        //Ha a 0. képnél vagyunk, akkor nincs balra semmi, nem lépünk tovább
        if(current_dekor_gallery == 0) {

            shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'left')
            // NINCS ANIMÁCIÓ MÉG

        // Ha nem a 0. képnél vagyunk, akkor van mit mutatni, csökkentjük a jelenlegi indexet eggyel,
        // majd frissítjük vele a galériát.
        } else {

            updateDekorGallery(--current_dekor_gallery, 'left');

        }
    });


    // Dekor galéria jobbra
    $("#dekoracio-gallery .gallery .gallery-right").click(function(e){

        e.preventDefault();

        // Ha az utolsó képnél vagyunk, nincs semmi jobbra.
        if(current_dekor_gallery == dekor_gallery.length - 1) {

            shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'right')
            // NINCS ANIMÁCIÓ MÉG    

        // Ha nem az utolsónál vagyunk, van jobbra még kép, megnöveljük eggyel az indexet,
        // és frissítjük a galériát.
        } else {

            updateDekorGallery(++current_dekor_gallery, 'right');

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
    $("#dekoracio-gallery .gallery .gallery-frame").on("touchstart", function (start_e) {

        start_touch = start_e.touches[0];
        startX = start_touch.clientX;

    });

    // Amikor véget ér a touch, megnézzük, hogy kell e léptetni.
    $("#dekoracio-gallery .gallery .gallery-frame").on("touchend", function (end_e) {

        // Eltároljuk a végpont X koordinátáját
        end_touch = end_e.changedTouches[0];
        endX = end_touch.clientX;

        // Ha a start 50 pixellel nagyobb, akkor jobb swipe történt
        if(startX > endX + 50) {
            
            // lsd. jobb gomb
            if(current_dekor_gallery == dekor_gallery.length - 1) {

                shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),"right");

            } else {

                updateDekorGallery(++current_dekor_gallery, 'right');

            }

        // Ha az end 50-nel nagyobb, akkor bal swipe történt.
        } else if(startX + 50 < endX) {
            
            // lsd. bal gomb
            if(current_dekor_gallery == 0) {

                shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),"left");
                
            } else {

                updateDekorGallery(--current_dekor_gallery, 'left');

            }
            
        // Ha a swipe kisebb mint 50 pixel, akkor nem teszünk semmit
        // Ez a buffer a fel-le görgetés miatt szükséges, ha nem lenne
        // akkor a fel-le görgetésnél is váltana a kép.
        } else {

            // console.log("Kicsi swipe!");

        }

    });



    function shakeElement(element, direction) {

        if(direction == "right") {

            $(element).animate({"right" : '15px'}, 100, function(){
                $(element).animate({"right" : ""}, 100, function(){
                    $(element).css({"right" : ""});
                });
            });

        } else if( direction == "left") {

            $(element).animate({"left" : '15px'}, 100, function(){
                $(element).animate({"left" : ""}, 100, function(){
                    $(element).css({"left" : ""});
                });
            });

        } else {
            console.error("direction must be \"left\" or \"right\".");
        }
        
    }


});
