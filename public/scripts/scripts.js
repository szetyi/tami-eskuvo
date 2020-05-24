$(document).ready(function() {

    // -----------------------------------
    // -----------------------------------
    // Kisebb funkciók, amelyek nem igényeltek külön .js fájlokat.
    // -----------------------------------
    // -----------------------------------



    
    // -----------------------------------
    // Navigáció scroll effect
    // -----------------------------------

    // Minden "scrolling-link" class-al ellátott elemre rárak egy onclick handlert,
    // mely megnézi a href attribútum célját, és odateker a megfelelő helyre.
    $(".scrolling-link").click(function(e) {
        e.preventDefault();
  
        $("html, body").animate({
            scrollTop: $(`${this.getAttribute("href")}`).offset().top
        }, 1000);
    });



    // -----------------------------------
    // MOBILON MÁS GALÉRIA ELRENDEZÉS!
    // -----------------------------------

    // Előre vizsgálunk, mert ha telefonon nyitjuk meg, nem lesz window resize event.
    changeGalleries();

    // Amikor átméretezzük az ablakot, legyen az asztali, vagy tablet/telefon elforgatás,
    // lefuttatjuk az ellenőrzést.
    window.onresize = function() {changeGalleries();};


    function changeGalleries() {

        // Ha megegyezünk a telefon media-query-vel, akkor a galériákat oszlopszerűen rendezzük el.
        if (window.matchMedia('(max-width: 600px)').matches) {

            $("#dekoracio-gallery").detach().insertAfter("#dekoracio-card");
            $("#grafika-gallery").detach().insertAfter("#grafika-card");

        // Ha nem telefon, akkor egy helyre rakjuk a galériákat.
        } else {

            $("#dekoracio-gallery").detach().insertAfter("#szolgaltatasok-cards");
            $("#grafika-gallery").detach().insertAfter("#szolgaltatasok-cards");

        }
    }

});