$(document).ready(function() {

    // Ebbe a tömbbe töltjük be a galéria objektumokat, melyek
    // {
    //     img: "/elérési/út/fájl.jpg",
    //     link: "/gallery?valami-valami",
    //     text: "leírás"
    // }
    // formátumban vannak.
    let dekor_gallery = [];
    
    // HTTP Get requesttel lekérjük a ../gallery/eskuvok/ mappában
    // lévő mappák neveit.
    $.get("/get/dekor/", function(data){

        // A válasz egy mappaneveket tartalmazó tömb
        for (let i = 0; i < data.length; i++) {

            let dirname = data[i];

            // Az egyes mappában lévő leiras.json fájlokat lekérjük,
            // ez tartalmazza az objektumban a thumbnail kép nevét és a leírást.
            $.getJSON(("../gallery/eskuvok/" + dirname + "/leiras.json"))
                .done(function(json){
                        
                    // létrehozzuk az objektumot
                    let gallery_obj = 
                    {
                        img : "../gallery/eskuvok/" + dirname + "/img/" + json.thumbnail + ".jpg",
                        link : "/gallery?" + dirname,
                        text : json.title
                    };
                    
                    // belerakjuk a tömbünkbe.
                    dekor_gallery[i] = gallery_obj;

                });
            
        }
        
        // Ezzel a számlálóval várjuk a tömb feltöltését, 100 ms-onként
        // ellenőrzi, hogy minden galériát betöltöttünk e.
        let wait_for_gallery = setInterval(() => {
        
            // Akkor van kész a Get request, ha a dekor_gallery
            // tömb mérete eléri a válaszként kapott tömb méretét.    
            if(dekor_gallery.length == data.length) {
                // leállítjuk az ellenőrzést, majd futtatjuk a main funkciót.
                clearInterval(wait_for_gallery);
                main();
            }

        }, 100);

    });

    function main(){    

        dekor_gallery.forEach(e => {
            console.log(e.text);
        });
        
    
        // Ez a szám adja meg, hogy mennyi a minimum galéria szám, amitől kezdve már kettős galériát
        // szeretnénk használni. 
        let dualGalleryMinimum = 5;

        // Ebben a változóban tároljuk, hogy éppen kettős gallérián vagyunk e, vagy sem.
        let isDualEnabled = false;
        
        // Jelenlegi kép index
        let current_dekor_gallery = 0;

        // Jelenleg látszó frame ( három van belőle, melyek a sima előre-hátra transition-höz kellenek. )
        let current_dekor_frame = 2;

        // Galéria inicializálása
        checkDualDekorGallery(dualGalleryMinimum);
        updateDekorGallery(current_dekor_gallery, 'init');


        // Amikor átméretezzük az ablakot, legyen az asztali, vagy tablet/telefon elforgatás,
        // lefuttatjuk az ellenőrzést.
        window.addEventListener('resize', function(){
            checkDualDekorGallery(dualGalleryMinimum);
        });

        function checkDualDekorGallery(treshold) {

            // Ha elég széles a képernyő, azaz tabletnél nagyobb képernyő vagyunk,
            // akkor lehet két galléria kép egymás mellett. 
            // Azt is vizsgálni kell, hogy mennyi megjelenítendő kép van a galériában,
            // ha kevesebb, mint a megadott érték, akkor felesleges egyszerre többet mutatni.
    
            if (window.matchMedia('(max-width: 992px)').matches) {
    
                // Kicsi képernyő, nem kell a kettőzés.
                console.log("Screen small, set gallery to single");
                isDualEnabled = false;
                $($("#dekoracio-gallery .gallery .gallery-frame")[1]).hide();

                
            } else {
    
                // Nagy képernyő, nézzük meg, hogy elértük e a minimumot
                
                if( dekor_gallery.length < treshold ) {
                    
                    // Ha alatta vagyunk akkor nem kell kettőzni.
                    console.log("Gallery not large enough, set gallery to single");
                    isDualEnabled = false;
                    $($("#dekoracio-gallery .gallery .gallery-frame")[1]).hide();
    
                } else {
    
                    // Ha felette vagyunk, akkor kell!
                    console.log("Set gallery to dual");
                    isDualEnabled = true;
                    $($("#dekoracio-gallery .gallery .gallery-frame")[1]).show();

                }
    
            }
            
    
        }

        function updateDekorGallery(current, setting) {


            $($("#dekoracio-gallery .gallery .gallery-frame a")[0]).attr({'href' : dekor_gallery[current].link});

            if(isDualEnabled) {

                if(dekor_gallery.length-1 > current) {

                    $($("#dekoracio-gallery .gallery .gallery-frame a")[1]).attr({'href' : dekor_gallery[current+1].link});

                } else {

                    $($("#dekoracio-gallery .gallery .gallery-frame a")[1]).removeAttr('href');
                    $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[1]).css({"background-image" : ("url(../img/virag_rozsaszin-01.svg)")});
                    $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[1]).css({"background-image" : ("url(../img/virag_rozsaszin-01.svg)")});
                    $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[1]).css({"background-image" : ("url(../img/virag_rozsaszin-01.svg)")});

                }

            }

            // Inicializáláshoz
            if(setting == 'init') {


                if(isDualEnabled) {

                    $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).css({"background-image" : ("url(" + dekor_gallery[current].img +")")});
                    $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).css({"background-image" : ("url(" + dekor_gallery[current+2].img +")")});

                    $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[1]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                    $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[1]).css({"background-image" : ("url(" + dekor_gallery[current+3].img +")")});

                } else {

                    // Ez mindig a 0. képet állítja az első láthatónak, és a tőle jobbra lépéshez beállítja az 1. képet.
                    $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).css({"background-image" : ("url(" + dekor_gallery[current].img +")")});
                    $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});

                }

            // Amikor megváltozik a galéria kettőssége, meghívjuk ezt a részt.
            } else if (setting == 'changed') {

                // Ha jelenleg kettős galériánk van, akkor a current marad.
                // Ha jelenleg egyes galériánk van:
                if (!isDualEnabled) {

                    // Ha a current páros, megtartjuk. Ha páratlan, akkor kivonunk egyet.
                    if(current % 2 === 1) current--;

                }

                let curr, prev, next;
                // Attól függően, hogy jelenleg melyik frame látható:
                switch (current_dekor_frame) {

                    case 1:
                        // Akkor az egyest állítjuk a jelenlegi képünkre.
                        curr = 1;
                        // Az előtte lévő ( ha van ilyen ) a hármas.
                        prev = 3;
                        // Az utána lévő ( ha van ilyen ) a kettes.
                        next = 2;
                        break;
                
                    case 2:
                        // Akkor a kettest állítjuk a jelenlegi képünkre.
                        curr = 2;
                        // Az előtte lévő ( ha van ilyen ) az egyes.
                        prev = 1;
                        // Az utána lévő ( ha van ilyen ) a hármas.
                        next = 3;
                    
                        break;
                
                    case 3:
                        // Akkor a hármast állítjuk a jelenlegi képünkre.
                        curr = 3;
                        // Az előtte lévő ( ha van ilyen ) a kettes.
                        prev = 2;
                        // Az utána lévő ( ha van ilyen ) az egyes.
                        next = 1;
                
                        break;
                    
                    default:
                        break;
                }

                if(isDualEnabled) {
                        
                    // Jelenlegi kép
                    $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + curr ))[0]).css({"background-image" : ("url(" + dekor_gallery[current].img +")")});
                    $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + curr ))[1]).css({"background-image" : ("url(" + dekor_gallery[current+2].img +")")});
                    
                    // Előző kép
                    if( current != 0) {
                        $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + prev))[0]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                        $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + prev))[1]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                    } 

                    // Következő kép
                    if( current != dekor_gallery.length -1 ) {
                        $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + next))[1]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                    }

                } else {

                    // Jelenlegi kép
                    $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + curr ))[0]).css({"background-image" : ("url(" + dekor_gallery[current].img +")")});
                    
                    // Előző kép
                    if( current != 0) {
                        $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + prev))[0]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                    } 

                    // Következő kép
                    if( current != dekor_gallery.length -1 ) {
                        $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + next))[0]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                    }

                }


                

            // Balra lépés
            } else if ( setting == 'left') {

                // Attól függően, hogy a három frame közül melyik látható, mást csinálunk.
                switch (current_dekor_frame) {

                    case 1:

                        // Az első látható, úgyhogy a balra lépésnél a harmadik jön, felfedjük, az elsőt elrejtjük.
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[0]).animate({opacity : 0}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).animate({opacity : 1}, 333);

                        // Az új látható a hármas.
                        current_dekor_frame = 3;

                        // Mivel a hármas látható, a tőle balra lévő a kettes lesz, ez megkapja előre a megfelelő képet.
                        // A tőle jobbra lévő az egyes kép lesz, ez is előre tölti a képét.
                        if(current != 0){    
                            $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                        }
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[0]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                        
                        break;
                        
                    case 2:

                        // Másodikat elrejtjük, balra az első van, felfedjük.
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).animate({opacity : 0}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[0]).animate({opacity : 1}, 333);

                        // Az első az új látható.
                        current_dekor_frame = 1;
                        
                        // Előre töltjük a két új, jelenleg nem látható szombszédot.
                        if(current != 0){
                            $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                        }    
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                        
                        
                        break;
                        
                    case 3:
                        
                        // Harmadikat elrejtjük, balra az második van, felfedjük.
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).animate({opacity : 0}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).animate({opacity : 1}, 333);

                        // A második az új látható.
                        current_dekor_frame = 2;

                        // Előre töltjük a két új, jelenleg nem látható szombszédot.
                        if(current != 0){
                            $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[0]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                        }    
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                        
                        break;
                
                    default:

                        // Ide nem szabadna eljutni, error
                        console.error("Current frame out of range [1-3] ?!");
                        break;

                }

            // Jobbra léptetés
            } else if (setting == 'right') {

                
                // Attól függően, hogy a három frame közül melyik látható, mást csinálunk.
                switch (current_dekor_frame) {

                    case 1:

                        // Az első látható, úgyhogy a jobbra lépésnél a második jön, felfedjük, az elsőt elrejtjük.
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[0]).animate({opacity : 0}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).animate({opacity : 1}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[1]).animate({opacity : 0}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[1]).animate({opacity : 1}, 333);

                        // Az új látható a kettes.
                        current_dekor_frame = 2;


                        // Mivel a kettes látható, a tőle jobbra lévő a hármas lesz, ez megkapja a megfelelő képet, HA még van.
                        // A tőle balra lévő az egyes lesz.


                        if (isDualEnabled) {
                            
                            $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[0]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                            $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[1]).css({"background-image" : ("url(" + dekor_gallery[current-2].img +")")});

                            if(current != dekor_gallery.length - 1) {    

                                $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                                $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[1]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});

                            }    

                        } else {

                            $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[0]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});

                            if(current != dekor_gallery.length - 1) {    

                                $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});

                            }    

                        }

                        break;
                        
                    case 2:

                        $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).animate({opacity : 0}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).animate({opacity : 1}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[1]).animate({opacity : 0}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[1]).animate({opacity : 1}, 333);
                        
                        current_dekor_frame = 3;

                        $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                        if(current != dekor_gallery.length - 1){    
                            $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[0]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                        }
                        
                        break;
                        
                    case 3:

                        $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).animate({opacity : 0}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[0]).animate({opacity : 1}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[1]).animate({opacity : 0}, 333);
                        $($("#dekoracio-gallery .gallery .gallery-frame .frame1")[1]).animate({opacity : 1}, 333);

                        current_dekor_frame = 1;

                        $($("#dekoracio-gallery .gallery .gallery-frame .frame3")[0]).css({"background-image" : ("url(" + dekor_gallery[current-1].img +")")});
                        if(current != dekor_gallery.length - 1){
                            $($("#dekoracio-gallery .gallery .gallery-frame .frame2")[0]).css({"background-image" : ("url(" + dekor_gallery[current+1].img +")")});
                        }    
                        
                        break;
                
                    default:

                        console.error("Current frame out of range [1-3] ?!");
                        break;

                }


            } else {

                // Ha a setting nem "init", "changed", "left" vagy "right", akkor error
                console.error("Wrong setting provided at updateDekorGallery: " + setting);

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

            // Ha nem az utolsónál vagyunk, van jobbra még kép, megnöveljük eggyel az indexet,
            // és frissítjük a galériát.
            } else {

                if(isDualEnabled) {

                    current_dekor_gallery += 2;
                    updateDekorGallery(current_dekor_gallery, 'right');

                } else {
                        
                    updateDekorGallery(++current_dekor_gallery, 'right');

                }


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

    }

    // lsd. grafika_gallery.js
    function shakeElement(element, direction) {

        if(direction == "right") {

            $(element).animate({"right" : '10px'}, 100, function(){
                $(element).animate({"right" : ""}, 100, function(){
                    $(element).css({"right" : ""});
                });
            });

        } else if( direction == "left") {

            $(element).animate({"left" : '10px'}, 100, function(){
                $(element).animate({"left" : ""}, 100, function(){
                    $(element).css({"left" : ""});
                });
            });

        } else {
            console.error("direction must be \"left\" or \"right\".");
        }
        
    }


});
