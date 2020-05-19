$(document).ready(function() {

    let gallery_name = window.location.search.slice(1,100)

    // console.log(gallery_name)

    $.getJSON(("./gallery/eskuvok/" + gallery_name + "/leiras.json"), function(json){
        // console.log(json);
        
        {
            console.log(json.thumbnail);
            
            let img = new Image();
            img.src = './gallery/eskuvok/' + gallery_name + '/img/' + json.thumbnail + '.jpg';
            $("#thumbnail").append(img); 
        }

        for (let i = 0; i < json.col_1.length; i++) {
            let img = new Image();
            img.src = './gallery/eskuvok/' + gallery_name + '/img/' + json.col_1[i] + '.jpg';
            $("#col-1").append(img);
        }
        
        for (let i = 0; i < json.col_2.length; i++) {
            let img = new Image();
            img.src = './gallery/eskuvok/' + gallery_name + '/img/' + json.col_2[i] + '.jpg';
            $("#col-2").append(img);
        }
        
        for (let i = 0; i < json.col_3.length; i++) {
            let img = new Image();
            img.src = './gallery/eskuvok/' + gallery_name + '/img/' + json.col_3[i] + '.jpg';
            $("#col-3").append(img);
        }

        // let current_col = 1;
        
        // for (let i = 0; i < json.img_count; i++) {
        //     img_path = './gallery/eskuvok/' + gallery_name + '/img/' + i + '.jpg';
        //     $(("#col-" + current_col++)).append('<img src='+ img_path +'/>');

        //     if(current_col > 3) current_col = 1;
        // }

        // for (let i = 0; i < json.img_count; i++) {
        //     let img = new Image();
        //     $(img).on('load',function(){
        //         let ratio = img.height / img.width;
        //         console.log(ratio);

        //         if(ratio > 1) {
        //             current_col = 1;
        //         } else {
        //             current_col = 2;
        //         }

        //         $(("#col-" + current_col)).append(img);
        //     });

        //     img.src = './gallery/eskuvok/' + gallery_name + '/img/' + i + '.jpg';
        // }

        $("#description h1").text(json.title);
        $("#description p").text(json.description);
    });
});