$(document).ready(function() {
    function checkImg(img) {
        if (img.naturalHeight <= 1 && img.naturalWidth <= 1) {
            // undersize image here
            img.src = "/images/placeholder.png";
        }
    }

    $("img").each(function() {
        console.log('Replaced an Image with Placeholder');
        // if image already loaded, we can check it's height now
        if (this.complete) {
            checkImg(this);
        } else {
            // if not loaded yet, then set load and error handlers
            $(this).load(function() {
                checkImg(this);
            }).error(function() {
                // img did not load correctly
                // set new .src here
                this.src = "/images/placeholder.png";
            });

        }
    });
});
