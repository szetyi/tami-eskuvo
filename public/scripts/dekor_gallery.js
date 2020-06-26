
var isDualEnabled = undefined;

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

        let frame0 = {
            prev : undefined,
            curr : undefined,
            next : undefined
        }
    
        let frame1 = {
            prev : undefined,
            curr : undefined,
            next : undefined
        }

        // Ez a szám adja meg, hogy mennyi a minimum galéria szám, amitől kezdve már kettős galériát
        // szeretnénk használni. 
        let dualGalleryMinimum = 5;

        // Ebben a változóban tároljuk, hogy éppen kettős gallérián vagyunk e, vagy sem.
        // var isDualEnabled = false;
        
        // Jelenlegi kép index
        let current_dekor_gallery = 0;

        // Jelenleg látszó frame ( három van belőle, melyek a sima előre-hátra transition-höz kellenek. )
        let current_dekor_frame = 2;

        // Galéria inicializálása
        checkDualDekorGallery(dualGalleryMinimum);
        updateDekorGallery('init');


        // Amikor átméretezzük az ablakot, legyen az asztali, vagy tablet/telefon elforgatás,
        // lefuttatjuk az ellenőrzést.
        window.addEventListener('resize', function(){
            // Eltároljuk, hogy jelenleg melyik galérián vagyunk.
            let is_dual_enabled_currently = isDualEnabled;

            // Ellenőrzést futtatunk, hogy kell e váltani.
            checkDualDekorGallery(dualGalleryMinimum);

            // Ha változás történt, futtatjuk az updatet "change" settinggel.
            if(is_dual_enabled_currently != isDualEnabled) {
                updateDekorGallery("change");
            }
        });

        function checkDualDekorGallery(treshold) {

            // Ha elég széles a képernyő, azaz tabletnél nagyobb képernyő vagyunk,
            // akkor lehet két galléria kép egymás mellett. 
            // Azt is vizsgálni kell, hogy mennyi megjelenítendő kép van a galériában,
            // ha kevesebb, mint a megadott érték, akkor felesleges egyszerre többet mutatni.
            
            let elements = $($(".gallery-frame"));
            // console.log(elements);
            

            if (window.matchMedia('(max-width: 992px)').matches) {
    
                // Kicsi képernyő, nem kell a kettőzés.
                // console.log("Screen small, set gallery to single");
                isDualEnabled = false;
                for (let i = 0; i < elements.length; i+=2) {
                    
                    $($(".gallery-frame")[i+1]).hide();
                    
                }

                
            } else {
    
                // Nagy képernyő, nézzük meg, hogy elértük e a minimumot
                
                if( dekor_gallery.length < treshold ) {
                    
                    // Ha alatta vagyunk akkor nem kell kettőzni.
                    // console.log("Gallery not large enough, set gallery to single");
                    isDualEnabled = false;
                    
                    for (let i = 0; i < elements.length; i+=2) {
                        
                        $($(".gallery-frame")[i+1]).hide();
                        
                    }
                    // $($("#dekoracio-gallery .gallery .gallery-frame")[1]).hide();
    
                } else {
    
                    // Ha felette vagyunk, akkor kell!
                    // console.log("Set gallery to dual");
                    isDualEnabled = true;


                    for (let i = 0; i < elements.length; i+=2) {
                    
                        $($(".gallery-frame")[i+1]).show();
                        
                    }
                    // $("#dekoracio-gallery .gallery .gallery-frame").each((index,element) => {
                    //     $(element).show()
                    // });
                    
                    // $($("#dekoracio-gallery .gallery .gallery-frame")[1]).show();

                }
    
            }
            
    
        }

        function updateDekorGallery(setting) {

            switch (setting) {

                // INICIALIZÁLÁS
                case "init":
                    
                    // Ha kettős galérián inicializálunk, akkor beállítjuk a két linket,
                    // Az első két képet, és az utánuk jövő két képet.
                    if (isDualEnabled) {

                        animateFrame(0,1,0);
                        animateFrame(0,2,1);
                        animateFrame(0,3,0);
                        animateFrame(1,1,0);
                        animateFrame(1,2,1);
                        animateFrame(1,3,0);

                        setFrame0("curr", 0);
                        setFrameBackground(0,getSubFrame("curr"), frame0.curr);

                        setFrame0("next", 2);
                        setFrameBackground(0,getSubFrame("next"), frame0.next);

                        setFrame1("curr", 1);
                        setFrameBackground(1,getSubFrame("curr"), frame1.curr);

                        setFrame1("next", 3)
                        setFrameBackground(1,getSubFrame("next"), frame1.next);

                    // Ha egyes galérián inicializálunk, akkor csak az első framere kell megcsinálni.
                    } else {
                        
                        animateFrame(0,1,0);
                        animateFrame(0,2,1);
                        animateFrame(0,3,0);
                        animateFrame(1,1,0);
                        animateFrame(1,2,0);
                        animateFrame(1,3,0);

                        setFrame0("curr", 0);
                        setFrameBackground(0,getSubFrame("curr"), frame0.curr);
                        setFrame0("next", 1);
                        setFrameBackground(0,getSubFrame("next"), frame0.next);

                    }

                    break;
            
                // VÁLTÁS
                case "change":

                    if(current_dekor_gallery < 0) {
                        current_dekor_gallery = 0;
                    } else if (current_dekor_gallery > dekor_gallery.length - 1) {
                        current_dekor_gallery = dekor_gallery.length;
                    }

                    // Ha kettősről váltunk egyesre:
                    if(!isDualEnabled) {
                        
                        animateFrame(0,getSubFrame("prev"),0);
                        animateFrame(0,getSubFrame("curr"),1);
                        animateFrame(0,getSubFrame("next"),0);
                        animateFrame(1,getSubFrame("prev"),0);
                        animateFrame(1,getSubFrame("curr"),0);
                        animateFrame(1,getSubFrame("next"),0);

                        setFrame0("next", frame0.curr + 1);
                        setFrameBackground(0, getSubFrame("next"), frame0.next);
                        setFrame0("prev", frame0.curr - 1);
                        setFrameBackground(0, getSubFrame("prev"), frame0.prev);


                    // Ha egyesről váltunk kettősre:
                    } else {

                        animateFrame(0,getSubFrame("prev"),0);
                        animateFrame(0,getSubFrame("curr"),1);
                        animateFrame(0,getSubFrame("next"),0);
                        animateFrame(1,getSubFrame("prev"),0);
                        animateFrame(1,getSubFrame("curr"),1);
                        animateFrame(1,getSubFrame("next"),0);

                        // Attól függően, hogy páros, vagy páratlan a current, mást csinálunk!
                        let current = frame0.curr;

                        // Páros
                        if (current % 2 == 0) {
                            
                            // setFrame1("curr", frame0.next)
                            // setFrameBackground(1, getSubFrame("curr"), frame1.curr);
                            setFrame1("curr", current + 1);
                            setFrameBackground(1,getSubFrame("curr"), frame1.curr);

                            setFrame1("prev", current - 1);
                            setFrameBackground(1, getSubFrame("prev"), frame1.prev);

                            setFrame1("next", current + 3);
                            setFrameBackground(1, getSubFrame("next"), frame1.next);

                            setFrame0("prev", current - 2);
                            setFrameBackground(0, getSubFrame("prev"), frame0.prev);

                            setFrame0("next", current + 2);
                            setFrameBackground(0, getSubFrame("next"), frame0.next);


                        // Páratlan
                        } else {
                            
                            setFrame1("curr", current);
                            setFrameBackground(1, getSubFrame("curr"), frame1.curr);

                            setFrame1("prev", current - 2);
                            setFrameBackground(1, getSubFrame("prev"), frame1.prev);

                            setFrame1("next", current + 2);
                            setFrameBackground(1, getSubFrame("next"), frame1.next);

                            setFrame0("curr", current - 1);
                            setFrameBackground(0, getSubFrame("curr"), frame0.curr);

                            setFrame0("prev", current - 3);
                            setFrameBackground(0, getSubFrame("prev"), frame0.prev);

                            setFrame0("next", current + 1);
                            setFrameBackground(0, getSubFrame("next"), frame0.next);

                        }

                    }
                    
                    break;
                    
                // JOBBRA
                case "right":

                    if (isDualEnabled) {

                        // Animáljuk a current subframe-et 0 opacityre, a nextet pedig 1-re
                        animateFrame(0, getSubFrame("curr"), 0);
                        animateFrame(0, getSubFrame("next"), 1);
                        
                        animateFrame(1, getSubFrame("curr"), 0);
                        animateFrame(1, getSubFrame("next"), 1);
                        
                        // Átállítjuk a current frame-et a jelenlegi next-re 
                        // A current gallery-t pedig megnöveljük kettővel.
                        current_dekor_frame = getSubFrame("next");
                        current_dekor_gallery += 2;
                        
                        // ----- FRAME 0 -----
                        // Beállítjuk a prev-et az most elváltott képre.
                        setFrameBackground(0, getSubFrame("prev"), frame0.curr);
                        setFrame0("prev", frame0.curr);

                        // Frissítjük a curr-t a jelenlegi next-re, mert arra váltottunk.
                        setFrame0("curr", frame0.next);

                        // Beállítjuk a next-et az új curr utáni kettőre. 
                        setFrame0("next", frame0.curr + 2);
                        setFrameBackground(0, getSubFrame("next"), frame0.next);



                        // ----- FRAME 1 -----
                        // ua. mint a frame 0

                        setFrameBackground(1, getSubFrame("prev"), frame1.curr);
                        setFrame1("prev", frame1.curr);

                        setFrame1("curr", frame1.next);

                        setFrame1("next", frame1.curr + 2);
                        setFrameBackground(1, getSubFrame("next"), frame1.next);

                    // Ha egyes galériánk van:
                    } else {
                        
                        // Animáljuk a current subframe-et 0 opacityre, a nextet pedig 1-re
                        animateFrame(0, getSubFrame("curr"), 0);
                        animateFrame(0, getSubFrame("next"), 1);

                        // Átállítjuk a current frame-et a jelenlegi next-re 
                        // A current gallery-t pedig megnöveljük eggyel.
                        current_dekor_frame = getSubFrame("next");
                        current_dekor_gallery++;
                        
                        // Beállítjuk a prev-et az most elváltott képre.
                        setFrameBackground(0, getSubFrame("prev"), frame0.curr);
                        setFrame0("prev", frame0.curr);

                        // Frissítjük a curr-t a jelenlegi next-re, mert arra váltottunk.
                        setFrame0("curr", frame0.next);

                        // Beállítjuk a next-et az új curr utánira. 
                        setFrame0("next", frame0.curr + 1);
                        setFrameBackground(0, getSubFrame("next"), frame0.next);
                    }
                    
                    break;
                    

                // BALRA
                case "left":
                    

                    if (isDualEnabled) {

                        // Animáljuk a current subframe-et 0 opacityre, a prevet pedig 1-re
                        animateFrame(0, getSubFrame("curr"), 0);
                        animateFrame(0, getSubFrame("prev"), 1);
                        
                        animateFrame(1, getSubFrame("curr"), 0);
                        animateFrame(1, getSubFrame("prev"), 1);
                        
                        // Átállítjuk a current frame-et a jelenlegi prev-re 
                        // A current gallery-t pedig csökkentjük kettővel.
                        current_dekor_frame = getSubFrame("prev");
                        current_dekor_gallery -= 2;
                        
                        // ----- FRAME 0 -----
                        // Beállítjuk a next-et az most elváltott képre.
                        setFrameBackground(0, getSubFrame("next"), frame0.curr);
                        setFrame0("next", frame0.curr);

                        // Frissítjük a curr-t a jelenlegi prev-re, mert arra váltottunk.
                        setFrame0("curr", frame0.prev);

                        // Beállítjuk a prev-et az új curr előtti kettőre. 
                        setFrame0("prev", frame0.curr - 2);
                        setFrameBackground(0, getSubFrame("prev"), frame0.prev);

                        // ----- FRAME 1 -----
                        // ua. mint a frame 0

                        setFrameBackground(1, getSubFrame("next"), frame1.curr);
                        setFrame1("next", frame1.curr);

                        setFrame1("curr", frame1.prev);

                        setFrame1("prev", frame1.curr - 2);
                        setFrameBackground(1, getSubFrame("prev"), frame1.prev);

                    // Ha egyes galériánk van:
                    } else {
                        
                        // Animáljuk a current subframe-et 0 opacityre, a prevet pedig 1-re
                        animateFrame(0, getSubFrame("curr"), 0);
                        animateFrame(0, getSubFrame("prev"), 1);

                        // Átállítjuk a current frame-et a jelenlegi next-re 
                        // A current gallery-t pedig megnöveljük eggyel.
                        current_dekor_frame = getSubFrame("prev");
                        current_dekor_gallery--;
                        
                        // Beállítjuk a next-et az most elváltott képre.
                        setFrameBackground(0, getSubFrame("next"), frame0.curr);
                        setFrame0("next", frame0.curr);

                        // Frissítjük a curr-t a jelenlegi prev-re, mert arra váltottunk.
                        setFrame0("curr", frame0.prev);

                        // Beállítjuk a prev-et az új curr előttire. 
                        setFrame0("prev", frame0.curr - 1);
                        setFrameBackground(0, getSubFrame("prev"), frame0.prev);
                    }
                    
                    break;

                // ERROR
                default:
                    console.error("Wrong setting: " + setting + "\nMust be 'init', 'change', 'right' or 'left'.");
                    
                    break;
            }

            setHref(0,frame0.curr);
            if(isDualEnabled) setHref(1,frame1.curr);

            // console.log("dual: " + isDualEnabled + "\nsetting: " + setting);
            // console.table([frame0,frame1]);

        }


        function setFrame1(sub, value) {

            if ( (value < 0) || (value > dekor_gallery.length - 1) || isNaN(value) ) {
                value = undefined
            }

        switch (sub) {

            case "prev":
                frame1.prev = value;
                break;
        
            case "curr":
                frame1.curr = value;
                break;
        
            case "next":
                frame1.next = value;
                break;
        
            default:
                break;
        }
    }

        function setFrame0(sub, value) {

                if ( (value < 0) || (value > dekor_gallery.length - 1) || isNaN(value) ) {
                    value = undefined
                }

            switch (sub) {

                case "prev":
                    frame0.prev = value;
                    break;
            
                case "curr":
                    frame0.curr = value;
                    break;
            
                case "next":
                    frame0.next = value;
                    break;
            
                default:
                    break;
            }
        }

        // Visszadja, hogy melyik frame a "prev", "curr", "next" szám értékként.
        function getSubFrame(requested) {

            let result = undefined;

            switch (requested) {
                case "prev":
                    
                    switch (current_dekor_frame) {
                        case 1:
                            result = 3;
                            break;
                    
                        case 2:
                            result = 1;
                            break;
                    
                        case 3:
                            result = 2;
                            break;
                            

                        default:
                            break;
                    }

                    break;
            
                case "curr":
                    
                    switch (current_dekor_frame) {
                        case 1:
                            result = 1;
                            break;
                    
                        case 2:
                            result = 2;
                            break;
                    
                        case 3:
                            result = 3;
                            break;
                            

                        default:
                            break;
                    }

                    break;
            
                case "next":
                    
                    switch (current_dekor_frame) {
                        case 1:
                            result = 2;
                            break;
                    
                        case 2:
                            result = 3;
                            break;
                    
                        case 3:
                            result = 1;
                            break;
                            

                        default:
                            break;
                    }

                    break;
            
                default:

                    console.error("getSubFrame requested not valid: " + requested + "\nMust be 'prev', 'curr' or 'next'");

                    break;
            }

            return result;

        }

        // Beállítja a frame (0 vagy 1) linkjét a value indexre. Ha a value üres, vagy undefined, akkor leveszi a linket.
        function setHref( frame, value ) {

            if ( (value < 0) || (value > dekor_gallery.length - 1) || isNaN(value) ) {
                value = undefined
            }
            if( value == undefined) {
                $($("#dekoracio-gallery .gallery .gallery-frame a")[frame]).removeAttr('href');
                $($("#dekoracio-gallery .gallery .gallery-frame a")[frame]).css({"cursor" : "default"});

            } else {
                $($("#dekoracio-gallery .gallery .gallery-frame a")[frame]).attr({'href' : dekor_gallery[value].link});
                $($("#dekoracio-gallery .gallery .gallery-frame a")[frame]).css({"cursor" : "pointer"});
            }

        }

        // Beállítja a frame (0 vagy 1) -et üresre, és törli a linket.
        function setFrameBlank(frame, subframe) {
            // setHref(frame);
            $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + subframe))[frame]).css({"background-image" : "url(../img/placeholder-01.svg)"});
        }

        // Beállítja a frame (0 vagy 1) subframe (1, 2 vagy 3) -jét a value index képére.
        function setFrameBackground(frame, subframe, value) {


            // console.log("setFrameBackground:\nframe:" + frame + "\nsubframe: frame" + subframe + "\nvalue: " + value );
            
            if ( (value < 0) || (value > dekor_gallery.length - 1) || isNaN(value) ) {
                value = undefined;
            }

            if(value == undefined ) {
                setFrameBlank(frame, subframe);
            } else {
                $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + subframe))[frame]).css({"background-image" : ("url(" + dekor_gallery[value].img +")")});
            }

        }

        // Animálja a frame (0 vagy 1) subframe (1, 2 vagy 3) opacity-jét value (0 vagy 1) értékre.
        function animateFrame(frame, subframe, value){      
            $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + subframe))[frame]).animate({opacity : value}, 333);
        }



        // Dekor galéria balra
        $("#dekoracio-gallery .gallery .gallery-left").click(function(e){

            e.preventDefault();
            
            if(isDualEnabled) {

                if(frame0.prev == undefined && frame1.prev == undefined ) {
                    shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'left');
                } else {
                    updateDekorGallery("left");
                }

            } else {

                if (frame0.prev == undefined ) {
                    shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'left');
                } else {
                    updateDekorGallery("left");
                }

            }

        });


        // Dekor galéria jobbra
        $("#dekoracio-gallery .gallery .gallery-right").click(function(e){

            e.preventDefault();

            if(isDualEnabled) {

                if(frame0.next == undefined && frame1.next == undefined ) {
                    shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'right');
                } else {
                    updateDekorGallery("right");
                }

            } else {

                if (frame0.next == undefined ) {
                    shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'right');
                } else {
                    updateDekorGallery("right");
                }

            }

            // // Ha az utolsó képnél vagyunk, nincs semmi jobbra.
            // if(current_dekor_gallery >= dekor_gallery.length - (isDualEnabled ? 2 : 1)) {

            //     shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'right')

            // // Ha nem az utolsónál vagyunk, van jobbra még kép, megnöveljük eggyel az indexet,
            // // és frissítjük a galériát.
            // } else {

            //     updateDekorGallery('right');

            // }
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
                if(isDualEnabled) {

                    if(frame0.next == undefined && frame1.next == undefined ) {
                        shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'right');
                    } else {
                        updateDekorGallery("right");
                    }

                } else {

                    if (frame0.next == undefined ) {
                        shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'right');
                    } else {
                        updateDekorGallery("right");
                    }

                }

            // Ha az end 50-nel nagyobb, akkor bal swipe történt.
            } else if(startX + 50 < endX) {
                
                // lsd. bal gomb
                if(isDualEnabled) {

                    if(frame0.prev == undefined && frame1.prev == undefined ) {
                        shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'left');
                    } else {
                        updateDekorGallery("left");
                    }

                } else {

                    if (frame0.prev == undefined ) {
                        shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'left');
                    } else {
                        updateDekorGallery("left");
                    }

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
